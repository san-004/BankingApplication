package com.banking.exception;

/**
 * Custom exception thrown when withdrawal amount exceeds available balance.
 */
public class InsufficientFundsException extends RuntimeException {

    public InsufficientFundsException(String message) {
        super(message);
    }
}
