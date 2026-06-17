package com.banking.config;

import com.banking.model.Account;
import com.banking.model.AccountType;
import com.banking.repository.AccountRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;

/**
 * Initializes sample data on application startup.
 * Useful for demonstration and testing purposes.
 */
@Configuration
public class DataInitializer {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    CommandLineRunner initDatabase(AccountRepository accountRepository) {
        return args -> {
            if (accountRepository.count() == 0) {
                logger.info("Initializing sample data...");

                Account account1 = new Account("100000000001", "Rahul Sharma", "rahul.sharma@email.com", AccountType.SAVINGS);
                account1.setBalance(BigDecimal.valueOf(50000.00));
                accountRepository.save(account1);

                Account account2 = new Account("100000000002", "Priya Patel", "priya.patel@email.com", AccountType.CURRENT);
                account2.setBalance(BigDecimal.valueOf(120000.00));
                accountRepository.save(account2);

                Account account3 = new Account("100000000003", "Amit Kumar", "amit.kumar@email.com", AccountType.SAVINGS);
                account3.setBalance(BigDecimal.valueOf(75000.00));
                accountRepository.save(account3);

                Account account4 = new Account("100000000004", "Sneha Reddy", "sneha.reddy@email.com", AccountType.FIXED_DEPOSIT);
                account4.setBalance(BigDecimal.valueOf(200000.00));
                accountRepository.save(account4);

                Account account5 = new Account("100000000005", "Vikram Singh", "vikram.singh@email.com", AccountType.CURRENT);
                account5.setBalance(BigDecimal.valueOf(30000.00));
                accountRepository.save(account5);

                logger.info("Sample data initialized: 5 accounts created");
            }
        };
    }
}
