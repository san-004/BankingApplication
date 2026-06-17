-- ============================================
-- Banking Application Database Script
-- Database: MySQL
-- ============================================

-- Create Database
CREATE DATABASE IF NOT EXISTS banking_db;
USE banking_db;

-- ============================================
-- Table: accounts
-- Stores bank account information
-- ============================================
CREATE TABLE IF NOT EXISTS accounts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(12) NOT NULL UNIQUE,
    account_holder_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    account_type ENUM('SAVINGS', 'CURRENT', 'FIXED_DEPOSIT') NOT NULL,
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    
    INDEX idx_account_number (account_number),
    INDEX idx_account_type (account_type),
    INDEX idx_active (active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- Table: transactions
-- Records all deposit and withdrawal operations
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_id VARCHAR(36) NOT NULL UNIQUE,
    transaction_type ENUM('DEPOSIT', 'WITHDRAWAL', 'TRANSFER') NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    balance_before DECIMAL(15, 2),
    balance_after DECIMAL(15, 2),
    description VARCHAR(255),
    transaction_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PENDING', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    account_id BIGINT NOT NULL,
    processed_by_thread VARCHAR(100),
    
    CONSTRAINT fk_account FOREIGN KEY (account_id) REFERENCES accounts(id),
    
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_account_id (account_id),
    INDEX idx_transaction_date (transaction_date),
    INDEX idx_transaction_type (transaction_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- Sample Data: Accounts
-- ============================================
INSERT INTO accounts (account_number, account_holder_name, email, account_type, balance, created_at, updated_at, active) VALUES
('100000000001', 'Rahul Sharma', 'rahul.sharma@email.com', 'SAVINGS', 50000.00, NOW(), NOW(), TRUE),
('100000000002', 'Priya Patel', 'priya.patel@email.com', 'CURRENT', 120000.00, NOW(), NOW(), TRUE),
('100000000003', 'Amit Kumar', 'amit.kumar@email.com', 'SAVINGS', 75000.00, NOW(), NOW(), TRUE),
('100000000004', 'Sneha Reddy', 'sneha.reddy@email.com', 'FIXED_DEPOSIT', 200000.00, NOW(), NOW(), TRUE),
('100000000005', 'Vikram Singh', 'vikram.singh@email.com', 'CURRENT', 30000.00, NOW(), NOW(), TRUE);

-- ============================================
-- Sample Data: Transactions
-- ============================================
INSERT INTO transactions (transaction_id, transaction_type, amount, balance_before, balance_after, description, transaction_date, status, account_id, processed_by_thread) VALUES
(UUID(), 'DEPOSIT', 10000.00, 40000.00, 50000.00, 'Initial deposit', NOW() - INTERVAL 5 DAY, 'COMPLETED', 1, 'main'),
(UUID(), 'DEPOSIT', 25000.00, 95000.00, 120000.00, 'Salary credit', NOW() - INTERVAL 3 DAY, 'COMPLETED', 2, 'main'),
(UUID(), 'WITHDRAWAL', 5000.00, 80000.00, 75000.00, 'ATM Withdrawal', NOW() - INTERVAL 2 DAY, 'COMPLETED', 3, 'main'),
(UUID(), 'DEPOSIT', 50000.00, 150000.00, 200000.00, 'FD Deposit', NOW() - INTERVAL 1 DAY, 'COMPLETED', 4, 'main'),
(UUID(), 'WITHDRAWAL', 10000.00, 40000.00, 30000.00, 'Online Purchase', NOW(), 'COMPLETED', 5, 'main');

-- ============================================
-- Verification Queries
-- ============================================
-- View all accounts
SELECT * FROM accounts WHERE active = TRUE;

-- View all transactions
SELECT t.*, a.account_number, a.account_holder_name 
FROM transactions t 
JOIN accounts a ON t.account_id = a.id 
ORDER BY t.transaction_date DESC;

-- View account balance summary
SELECT 
    account_type,
    COUNT(*) as total_accounts,
    SUM(balance) as total_balance,
    AVG(balance) as avg_balance
FROM accounts 
WHERE active = TRUE 
GROUP BY account_type;
