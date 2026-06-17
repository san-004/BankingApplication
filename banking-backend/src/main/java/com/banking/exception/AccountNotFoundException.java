package com.banking.exception;

/**
 * Custom exception thrown when a bank account is not found.
 */
public class AccountNotFoundException extends RuntimeException {

    public AccountNotFoundException(String message) {
        super(message);
    }
}
