package com.banking.service;

import com.banking.dto.TransactionDTO;
import com.banking.dto.TransferDTO;
import com.banking.exception.AccountNotFoundException;
import com.banking.exception.InsufficientFundsException;
import com.banking.model.*;
import com.banking.repository.AccountRepository;
import com.banking.repository.TransactionRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;

/**
 * Service class for managing banking transactions.
 * Demonstrates multithreading with @Async and synchronized methods.
 */
@Service
public class TransactionService {

    private static final Logger logger = LoggerFactory.getLogger(TransactionService.class);

    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;

    @Autowired
    public TransactionService(TransactionRepository transactionRepository,
                              AccountRepository accountRepository) {
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
    }

    /**
     * Processes a deposit transaction.
     * Uses synchronized block to ensure thread safety when modifying balance.
     */
    @Transactional
    public Transaction deposit(TransactionDTO transactionDTO) {
        logger.info("[Thread: {}] Processing deposit for account: {}",
                Thread.currentThread().getName(), transactionDTO.getAccountNumber());

        Account account = accountRepository.findByAccountNumber(transactionDTO.getAccountNumber())
                .orElseThrow(() -> new AccountNotFoundException(
                        "Account not found: " + transactionDTO.getAccountNumber()));

        BigDecimal amount = BigDecimal.valueOf(transactionDTO.getAmount());
        BigDecimal balanceBefore = account.getBalance();

        // Synchronized block to ensure thread-safe balance update
        synchronized (account) {
            account.setBalance(account.getBalance().add(amount));
            accountRepository.save(account);
        }

        // Create and save transaction record
        Transaction transaction = createTransaction(
                TransactionType.DEPOSIT, amount, balanceBefore,
                account.getBalance(), transactionDTO.getDescription(), account);

        logger.info("[Thread: {}] Deposit completed. New balance: {}",
                Thread.currentThread().getName(), account.getBalance());

        return transactionRepository.save(transaction);
    }

    /**
     * Processes a withdrawal transaction.
     * Validates sufficient funds before processing.
     */
    @Transactional
    public Transaction withdraw(TransactionDTO transactionDTO) {
        logger.info("[Thread: {}] Processing withdrawal for account: {}",
                Thread.currentThread().getName(), transactionDTO.getAccountNumber());

        Account account = accountRepository.findByAccountNumber(transactionDTO.getAccountNumber())
                .orElseThrow(() -> new AccountNotFoundException(
                        "Account not found: " + transactionDTO.getAccountNumber()));

        BigDecimal amount = BigDecimal.valueOf(transactionDTO.getAmount());
        BigDecimal balanceBefore = account.getBalance();

        // Check sufficient funds
        if (account.getBalance().compareTo(amount) < 0) {
            throw new InsufficientFundsException(
                    "Insufficient funds. Available balance: " + account.getBalance());
        }

        // Synchronized block for thread-safe withdrawal
        synchronized (account) {
            account.setBalance(account.getBalance().subtract(amount));
            accountRepository.save(account);
        }

        // Create and save transaction record
        Transaction transaction = createTransaction(
                TransactionType.WITHDRAWAL, amount, balanceBefore,
                account.getBalance(), transactionDTO.getDescription(), account);

        logger.info("[Thread: {}] Withdrawal completed. New balance: {}",
                Thread.currentThread().getName(), account.getBalance());

        return transactionRepository.save(transaction);
    }

    /**
     * Processes a fund transfer between two accounts.
     * Demonstrates transaction management across multiple accounts.
     */
    @Transactional
    public List<Transaction> transfer(TransferDTO transferDTO) {
        logger.info("[Thread: {}] Processing transfer from {} to {}",
                Thread.currentThread().getName(),
                transferDTO.getFromAccountNumber(),
                transferDTO.getToAccountNumber());

        // Withdrawal from source
        TransactionDTO withdrawalDTO = new TransactionDTO(
                transferDTO.getFromAccountNumber(),
                TransactionType.WITHDRAWAL,
                transferDTO.getAmount(),
                "Transfer to " + transferDTO.getToAccountNumber() +
                        (transferDTO.getDescription() != null ? " - " + transferDTO.getDescription() : ""));

        // Deposit to destination
        TransactionDTO depositDTO = new TransactionDTO(
                transferDTO.getToAccountNumber(),
                TransactionType.DEPOSIT,
                transferDTO.getAmount(),
                "Transfer from " + transferDTO.getFromAccountNumber() +
                        (transferDTO.getDescription() != null ? " - " + transferDTO.getDescription() : ""));

        Transaction withdrawal = withdraw(withdrawalDTO);
        Transaction deposit = deposit(depositDTO);

        return List.of(withdrawal, deposit);
    }

    /**
     * Asynchronous transaction processing.
     * Demonstrates multithreading using @Async and CompletableFuture.
     * Used for batch processing or background transaction validation.
     */
    @Async
    public CompletableFuture<Transaction> processTransactionAsync(TransactionDTO transactionDTO) {
        logger.info("[ASYNC Thread: {}] Processing async transaction for account: {}",
                Thread.currentThread().getName(), transactionDTO.getAccountNumber());

        // Simulate processing delay for demonstration
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        Transaction transaction;
        if (transactionDTO.getTransactionType() == TransactionType.DEPOSIT) {
            transaction = deposit(transactionDTO);
        } else {
            transaction = withdraw(transactionDTO);
        }

        logger.info("[ASYNC Thread: {}] Async transaction completed: {}",
                Thread.currentThread().getName(), transaction.getTransactionId());

        return CompletableFuture.completedFuture(transaction);
    }

    /**
     * Gets transaction history for an account.
     */
    public List<Transaction> getTransactionHistory(String accountNumber) {
        return transactionRepository.findByAccountAccountNumberOrderByTransactionDateDesc(accountNumber);
    }

    /**
     * Gets recent transactions (last 10) for an account.
     */
    public List<Transaction> getRecentTransactions(String accountNumber) {
        return transactionRepository.findTop10ByAccountAccountNumberOrderByTransactionDateDesc(accountNumber);
    }

    /**
     * Gets transactions within a date range.
     */
    public List<Transaction> getTransactionsByDateRange(String accountNumber,
                                                        LocalDateTime startDate,
                                                        LocalDateTime endDate) {
        return transactionRepository.findByAccountAndDateRange(accountNumber, startDate, endDate);
    }

    /**
     * Helper method to create a Transaction entity.
     */
    private Transaction createTransaction(TransactionType type, BigDecimal amount,
                                          BigDecimal balanceBefore, BigDecimal balanceAfter,
                                          String description, Account account) {
        Transaction transaction = new Transaction();
        transaction.setTransactionId(UUID.randomUUID().toString());
        transaction.setTransactionType(type);
        transaction.setAmount(amount);
        transaction.setBalanceBefore(balanceBefore);
        transaction.setBalanceAfter(balanceAfter);
        transaction.setDescription(description != null ? description : type.name());
        transaction.setAccount(account);
        transaction.setStatus(TransactionStatus.COMPLETED);
        transaction.setProcessedByThread(Thread.currentThread().getName());
        return transaction;
    }
}
