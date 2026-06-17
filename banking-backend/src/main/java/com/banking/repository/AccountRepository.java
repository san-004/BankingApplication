package com.banking.repository;

import com.banking.model.Account;
import com.banking.model.AccountType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for Account entity.
 * Spring Data JPA provides implementation automatically.
 */
@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByAccountNumber(String accountNumber);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<Account> findByAccountNumberAndActiveTrue(String accountNumber);

    List<Account> findByActiveTrue();

    List<Account> findByAccountType(AccountType accountType);

    boolean existsByAccountNumber(String accountNumber);

    boolean existsByEmail(String email);

    List<Account> findByAccountHolderNameContainingIgnoreCase(String name);
}
