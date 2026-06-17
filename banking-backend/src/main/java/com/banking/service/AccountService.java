package com.banking.service;

import com.banking.dto.AccountDTO;
import com.banking.exception.AccountNotFoundException;
import com.banking.exception.InsufficientFundsException;
import com.banking.model.Account;
import com.banking.model.AccountType;
import com.banking.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * Service class for managing bank accounts.
 * Demonstrates use of Collections (Map, List) for account management.
 */
@Service
public class AccountService {

    private final AccountRepository accountRepository;

    /**
     * ConcurrentHashMap used for thread-safe in-memory caching of accounts.
     * Demonstrates collection usage for account management.
     */
    private final ConcurrentHashMap<String, Account> accountCache = new ConcurrentHashMap<>();

    @Autowired
    public AccountService(AccountRepository accountRepository) {
        this.accountRepository = accountRepository;
    }

    /**
     * Creates a new bank account with a unique account number.
     */
    @Transactional
    public Account createAccount(AccountDTO accountDTO) {
        // Generate unique 12-digit account number
        String accountNumber = generateAccountNumber();

        Account account = new Account(
                accountNumber,
                accountDTO.getAccountHolderName(),
                accountDTO.getEmail(),
                accountDTO.getAccountType()
        );

        // Set initial deposit if provided
        if (accountDTO.getInitialDeposit() != null && accountDTO.getInitialDeposit() > 0) {
            account.setBalance(BigDecimal.valueOf(accountDTO.getInitialDeposit()));
        }

        Account savedAccount = accountRepository.save(account);

        // Add to cache (demonstrates ConcurrentHashMap usage)
        accountCache.put(accountNumber, savedAccount);

        return savedAccount;
    }

    /**
     * Retrieves account by account number.
     * First checks the cache, then falls back to database.
     */
    public Account getAccountByNumber(String accountNumber) {
        // Check cache first (demonstrates HashMap get operation)
        Account cachedAccount = accountCache.get(accountNumber);
        if (cachedAccount != null) {
            return cachedAccount;
        }

        // Fallback to database
        Account account = accountRepository.findByAccountNumber(accountNumber)
                .orElseThrow(() -> new AccountNotFoundException(
                        "Account not found: " + accountNumber));

        // Update cache
        accountCache.put(accountNumber, account);
        return account;
    }

    /**
     * Retrieves all active accounts.
     * Demonstrates use of List and Stream API.
     */
    public List<Account> getAllActiveAccounts() {
        List<Account> accounts = accountRepository.findByActiveTrue();

        // Update cache with all fetched accounts
        accounts.forEach(acc -> accountCache.put(acc.getAccountNumber(), acc));

        return accounts;
    }

    /**
     * Gets accounts by type using Streams.
     * Demonstrates filtering with Java Collections Framework.
     */
    public List<Account> getAccountsByType(AccountType accountType) {
        return accountRepository.findByAccountType(accountType);
    }

    /**
     * Search accounts by holder name.
     */
    public List<Account> searchAccountsByName(String name) {
        return accountRepository.findByAccountHolderNameContainingIgnoreCase(name);
    }

    /**
     * Updates account details.
     */
    @Transactional
    public Account updateAccount(String accountNumber, AccountDTO accountDTO) {
        Account account = getAccountByNumber(accountNumber);

        account.setAccountHolderName(accountDTO.getAccountHolderName());
        account.setEmail(accountDTO.getEmail());
        account.setAccountType(accountDTO.getAccountType());
        account.setUpdatedAt(LocalDateTime.now());

        Account updatedAccount = accountRepository.save(account);
        accountCache.put(accountNumber, updatedAccount);

        return updatedAccount;
    }

    /**
     * Deactivates an account (soft delete).
     */
    @Transactional
    public void deactivateAccount(String accountNumber) {
        Account account = getAccountByNumber(accountNumber);
        account.setActive(false);
        account.setUpdatedAt(LocalDateTime.now());
        accountRepository.save(account);
        accountCache.remove(accountNumber);
    }

    /**
     * Gets account statistics.
     * Demonstrates advanced collection operations with Streams.
     */
    public Map<String, Object> getAccountStatistics() {
        List<Account> allAccounts = accountRepository.findByActiveTrue();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalAccounts", allAccounts.size());
        stats.put("totalBalance", allAccounts.stream()
                .map(Account::getBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        stats.put("averageBalance", allAccounts.stream()
                .map(Account::getBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(Math.max(allAccounts.size(), 1)), 2, BigDecimal.ROUND_HALF_UP));

        // Group by account type (demonstrates Collectors.groupingBy)
        Map<AccountType, Long> countByType = allAccounts.stream()
                .collect(Collectors.groupingBy(Account::getAccountType, Collectors.counting()));
        stats.put("accountsByType", countByType);

        return stats;
    }

    /**
     * Generates a unique 12-digit account number.
     */
    private String generateAccountNumber() {
        String accountNumber;
        do {
            long number = (long) (Math.random() * 900000000000L) + 100000000000L;
            accountNumber = String.valueOf(number);
        } while (accountRepository.existsByAccountNumber(accountNumber));
        return accountNumber;
    }
}
