package com.banking.controller;

import com.banking.dto.ApiResponse;
import com.banking.dto.TransactionDTO;
import com.banking.dto.TransferDTO;
import com.banking.model.Transaction;
import com.banking.service.MultithreadingDemoService;
import com.banking.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

/**
 * REST Controller for transaction operations.
 * Provides deposit, withdrawal, transfer, and transaction history endpoints.
 */
@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "http://localhost:4200")
public class TransactionController {

    private final TransactionService transactionService;
    private final MultithreadingDemoService multithreadingDemoService;

    @Autowired
    public TransactionController(TransactionService transactionService,
                                  MultithreadingDemoService multithreadingDemoService) {
        this.transactionService = transactionService;
        this.multithreadingDemoService = multithreadingDemoService;
    }

    /**
     * POST /api/transactions/deposit - Process a deposit
     */
    @PostMapping("/deposit")
    public ResponseEntity<ApiResponse<Transaction>> deposit(@Valid @RequestBody TransactionDTO transactionDTO) {
        Transaction transaction = transactionService.deposit(transactionDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Deposit successful", transaction));
    }

    /**
     * POST /api/transactions/withdraw - Process a withdrawal
     */
    @PostMapping("/withdraw")
    public ResponseEntity<ApiResponse<Transaction>> withdraw(@Valid @RequestBody TransactionDTO transactionDTO) {
        Transaction transaction = transactionService.withdraw(transactionDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Withdrawal successful", transaction));
    }

    /**
     * POST /api/transactions/transfer - Process a fund transfer
     */
    @PostMapping("/transfer")
    public ResponseEntity<ApiResponse<List<Transaction>>> transfer(@Valid @RequestBody TransferDTO transferDTO) {
        List<Transaction> transactions = transactionService.transfer(transferDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Transfer successful", transactions));
    }

    /**
     * POST /api/transactions/async - Process transaction asynchronously (multithreading demo)
     */
    @PostMapping("/async")
    public ResponseEntity<ApiResponse<String>> processAsync(@Valid @RequestBody TransactionDTO transactionDTO) {
        CompletableFuture<Transaction> future = transactionService.processTransactionAsync(transactionDTO);
        return ResponseEntity
                .accepted()
                .body(ApiResponse.success(
                        "Transaction submitted for async processing on thread pool",
                        "Transaction is being processed asynchronously. Check transaction history for status."));
    }

    /**
     * POST /api/transactions/batch - Process batch transactions (multithreading demo)
     * Demonstrates concurrent processing with thread pool
     */
    @PostMapping("/batch/{accountNumber}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> processBatch(
            @PathVariable String accountNumber,
            @RequestParam(defaultValue = "5") int deposits,
            @RequestParam(defaultValue = "3") int withdrawals) {
        Map<String, Object> result = multithreadingDemoService.processBatchTransactions(
                accountNumber, deposits, withdrawals);
        return ResponseEntity.ok(ApiResponse.success("Batch processing completed", result));
    }

    /**
     * GET /api/transactions/history/{accountNumber} - Get transaction history
     */
    @GetMapping("/history/{accountNumber}")
    public ResponseEntity<ApiResponse<List<Transaction>>> getHistory(@PathVariable String accountNumber) {
        List<Transaction> transactions = transactionService.getTransactionHistory(accountNumber);
        return ResponseEntity.ok(ApiResponse.success("Transaction history retrieved", transactions));
    }

    /**
     * GET /api/transactions/recent/{accountNumber} - Get recent transactions
     */
    @GetMapping("/recent/{accountNumber}")
    public ResponseEntity<ApiResponse<List<Transaction>>> getRecentTransactions(
            @PathVariable String accountNumber) {
        List<Transaction> transactions = transactionService.getRecentTransactions(accountNumber);
        return ResponseEntity.ok(ApiResponse.success("Recent transactions retrieved", transactions));
    }

    /**
     * GET /api/transactions/thread-info - Get thread pool information
     */
    @GetMapping("/thread-info")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getThreadInfo() {
        Map<String, Object> info = multithreadingDemoService.getThreadInfo();
        return ResponseEntity.ok(ApiResponse.success("Thread information", info));
    }
}
