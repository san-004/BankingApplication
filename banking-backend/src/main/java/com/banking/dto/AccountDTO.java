package com.banking.dto;

import com.banking.model.AccountType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Data Transfer Object for Account creation/update requests.
 */
public class AccountDTO {

    @NotBlank(message = "Account holder name is required")
    private String accountHolderName;

    @Email(message = "Valid email is required")
    @NotBlank(message = "Email is required")
    private String email;

    @NotNull(message = "Account type is required")
    private AccountType accountType;

    private Double initialDeposit;

    // Constructors
    public AccountDTO() {}

    public AccountDTO(String accountHolderName, String email, AccountType accountType, Double initialDeposit) {
        this.accountHolderName = accountHolderName;
        this.email = email;
        this.accountType = accountType;
        this.initialDeposit = initialDeposit;
    }

    // Getters and Setters
    public String getAccountHolderName() {
        return accountHolderName;
    }

    public void setAccountHolderName(String accountHolderName) {
        this.accountHolderName = accountHolderName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public AccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }

    public Double getInitialDeposit() {
        return initialDeposit;
    }

    public void setInitialDeposit(Double initialDeposit) {
        this.initialDeposit = initialDeposit;
    }
}
