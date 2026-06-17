package com.banking.controller;

import com.banking.dto.AccountDTO;
import com.banking.dto.ApiResponse;
import com.banking.model.Account;
import com.banking.model.AccountType;
import com.banking.service.AccountService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST Controller for bank account operations.
 * Provides CRUD endpoints for account management.
 */
@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "http://localhost:4200")
public class AccountController {

    private final AccountService accountService;

    @Autowired
    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    /**
     * POST /api/accounts - Create a new bank account
     */
    @PostMapping
    public ResponseEntity<ApiResponse<Account>> createAccount(@Valid @RequestBody AccountDTO accountDTO) {
        Account account = accountService.createAccount(accountDTO);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success("Account created successfully", account));
    }

    /**
     * GET /api/accounts/{accountNumber} - Get account by number
     */
    @GetMapping("/{accountNumber}")
    public ResponseEntity<ApiResponse<Account>> getAccount(@PathVariable String accountNumber) {
        Account account = accountService.getAccountByNumber(accountNumber);
        return ResponseEntity.ok(ApiResponse.success("Account retrieved", account));
    }

    /**
     * GET /api/accounts - Get all active accounts
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<Account>>> getAllAccounts() {
        List<Account> accounts = accountService.getAllActiveAccounts();
        return ResponseEntity.ok(ApiResponse.success("Accounts retrieved", accounts));
    }

    /**
     * GET /api/accounts/type/{type} - Get accounts by type
     */
    @GetMapping("/type/{type}")
    public ResponseEntity<ApiResponse<List<Account>>> getAccountsByType(@PathVariable AccountType type) {
        List<Account> accounts = accountService.getAccountsByType(type);
        return ResponseEntity.ok(ApiResponse.success("Accounts retrieved by type", accounts));
    }

    /**
     * GET /api/accounts/search?name= - Search accounts by holder name
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Account>>> searchAccounts(@RequestParam String name) {
        List<Account> accounts = accountService.searchAccountsByName(name);
        return ResponseEntity.ok(ApiResponse.success("Search results", accounts));
    }

    /**
     * PUT /api/accounts/{accountNumber} - Update account details
     */
    @PutMapping("/{accountNumber}")
    public ResponseEntity<ApiResponse<Account>> updateAccount(
            @PathVariable String accountNumber,
            @Valid @RequestBody AccountDTO accountDTO) {
        Account account = accountService.updateAccount(accountNumber, accountDTO);
        return ResponseEntity.ok(ApiResponse.success("Account updated successfully", account));
    }

    /**
     * DELETE /api/accounts/{accountNumber} - Deactivate account
     */
    @DeleteMapping("/{accountNumber}")
    public ResponseEntity<ApiResponse<Object>> deactivateAccount(@PathVariable String accountNumber) {
        accountService.deactivateAccount(accountNumber);
        return ResponseEntity.ok(ApiResponse.success("Account deactivated successfully", null));
    }

    /**
     * GET /api/accounts/statistics - Get account statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStatistics() {
        Map<String, Object> stats = accountService.getAccountStatistics();
        return ResponseEntity.ok(ApiResponse.success("Account statistics", stats));
    }
}
