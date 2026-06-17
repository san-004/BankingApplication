package com.banking.service;

import com.banking.dto.TransactionDTO;
import com.banking.model.Transaction;
import com.banking.model.TransactionType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.*;
import java.util.stream.Collectors;

/**
 * Service to demonstrate multithreading concepts in banking operations.
 * Shows thread pool usage, concurrent processing, and thread safety.
 */
@Service
public class MultithreadingDemoService {

    private static final Logger logger = LoggerFactory.getLogger(MultithreadingDemoService.class);

    private final TransactionService transactionService;

    /**
     * Custom thread pool for processing batch transactions.
     * Demonstrates ExecutorService and thread pool management.
     */
    private final ExecutorService transactionExecutor = Executors.newFixedThreadPool(4,
            new ThreadFactory() {
                private int count = 1;
                @Override
                public Thread newThread(Runnable r) {
                    Thread thread = new Thread(r);
                    thread.setName("BankTxn-Worker-" + count++);
                    return thread;
                }
            });

    @Autowired
    public MultithreadingDemoService(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    /**
     * Processes multiple transactions concurrently using a thread pool.
     * Demonstrates:
     * - ExecutorService for thread pool management
     * - CompletableFuture for async operations
     * - Thread-safe concurrent execution
     */
    public Map<String, Object> processBatchTransactions(String accountNumber, int depositCount, int withdrawalCount) {
        logger.info("Starting batch processing with {} deposits and {} withdrawals on thread: {}",
                depositCount, withdrawalCount, Thread.currentThread().getName());

        List<CompletableFuture<Transaction>> futures = new ArrayList<>();
        long startTime = System.currentTimeMillis();

        // Submit deposit tasks to thread pool
        for (int i = 1; i <= depositCount; i++) {
            final int txnNum = i;
            CompletableFuture<Transaction> future = CompletableFuture.supplyAsync(() -> {
                logger.info("[{}] Processing deposit #{}", Thread.currentThread().getName(), txnNum);
                TransactionDTO dto = new TransactionDTO(
                        accountNumber,
                        TransactionType.DEPOSIT,
                        100.0,
                        "Batch Deposit #" + txnNum
                );
                return transactionService.deposit(dto);
            }, transactionExecutor);
            futures.add(future);
        }

        // Submit withdrawal tasks to thread pool
        for (int i = 1; i <= withdrawalCount; i++) {
            final int txnNum = i;
            CompletableFuture<Transaction> future = CompletableFuture.supplyAsync(() -> {
                logger.info("[{}] Processing withdrawal #{}", Thread.currentThread().getName(), txnNum);
                TransactionDTO dto = new TransactionDTO(
                        accountNumber,
                        TransactionType.WITHDRAWAL,
                        50.0,
                        "Batch Withdrawal #" + txnNum
                );
                return transactionService.withdraw(dto);
            }, transactionExecutor);
            futures.add(future);
        }

        // Wait for all transactions to complete
        List<Transaction> completedTransactions = futures.stream()
                .map(future -> {
                    try {
                        return future.get(10, TimeUnit.SECONDS);
                    } catch (Exception e) {
                        logger.error("Transaction failed: {}", e.getMessage());
                        return null;
                    }
                })
                .filter(t -> t != null)
                .collect(Collectors.toList());

        long endTime = System.currentTimeMillis();

        // Collect thread usage information
        Map<String, Long> threadUsage = completedTransactions.stream()
                .collect(Collectors.groupingBy(
                        Transaction::getProcessedByThread,
                        Collectors.counting()
                ));

        Map<String, Object> result = new ConcurrentHashMap<>();
        result.put("totalTransactions", completedTransactions.size());
        result.put("processingTimeMs", endTime - startTime);
        result.put("threadsUsed", threadUsage);
        result.put("transactions", completedTransactions.stream()
                .map(t -> Map.of(
                        "transactionId", t.getTransactionId(),
                        "type", t.getTransactionType().name(),
                        "amount", t.getAmount(),
                        "processedBy", t.getProcessedByThread(),
                        "status", t.getStatus().name()
                ))
                .collect(Collectors.toList()));

        logger.info("Batch processing completed. {} transactions in {}ms using threads: {}",
                completedTransactions.size(), endTime - startTime, threadUsage.keySet());

        return result;
    }

    /**
     * Demonstrates thread information for educational purposes.
     */
    public Map<String, Object> getThreadInfo() {
        Map<String, Object> info = new ConcurrentHashMap<>();
        info.put("currentThread", Thread.currentThread().getName());
        info.put("availableProcessors", Runtime.getRuntime().availableProcessors());
        info.put("activeThreadCount", Thread.activeCount());
        info.put("threadPoolType", "FixedThreadPool(4)");
        info.put("description", "The application uses a custom thread pool with 4 worker threads " +
                "named 'BankTxn-Worker-N' for concurrent transaction processing.");
        return info;
    }
}
