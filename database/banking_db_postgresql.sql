-- ============================================
-- Banking Application Database Script
-- Database: PostgreSQL (for Render deployment)
-- ============================================

-- Create tables (Hibernate auto-creates these, but included for reference)

CREATE TABLE IF NOT EXISTS accounts (
    id BIGSERIAL PRIMARY KEY,
    account_number VARCHAR(12) NOT NULL UNIQUE,
    account_holder_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    account_type VARCHAR(20) NOT NULL CHECK (account_type IN ('SAVINGS', 'CURRENT', 'FIXED_DEPOSIT')),
    balance DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS transactions (
    id BIGSERIAL PRIMARY KEY,
    transaction_id VARCHAR(36) NOT NULL UNIQUE,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('DEPOSIT', 'WITHDRAWAL', 'TRANSFER')),
    amount DECIMAL(15, 2) NOT NULL,
    balance_before DECIMAL(15, 2),
    balance_after DECIMAL(15, 2),
    description VARCHAR(255),
    transaction_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED')),
    account_id BIGINT NOT NULL REFERENCES accounts(id),
    processed_by_thread VARCHAR(100)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_account_number ON accounts(account_number);
CREATE INDEX IF NOT EXISTS idx_account_type ON accounts(account_type);
CREATE INDEX IF NOT EXISTS idx_transaction_account ON transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_transaction_date ON transactions(transaction_date);

-- ============================================
-- Sample Data
-- ============================================
INSERT INTO accounts (account_number, account_holder_name, email, account_type, balance) VALUES
('100000000001', 'Rahul Sharma', 'rahul.sharma@email.com', 'SAVINGS', 50000.00),
('100000000002', 'Priya Patel', 'priya.patel@email.com', 'CURRENT', 120000.00),
('100000000003', 'Amit Kumar', 'amit.kumar@email.com', 'SAVINGS', 75000.00),
('100000000004', 'Sneha Reddy', 'sneha.reddy@email.com', 'FIXED_DEPOSIT', 200000.00),
('100000000005', 'Vikram Singh', 'vikram.singh@email.com', 'CURRENT', 30000.00)
ON CONFLICT (account_number) DO NOTHING;
