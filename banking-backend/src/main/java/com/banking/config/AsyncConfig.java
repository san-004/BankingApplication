package com.banking.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

/**
 * Configuration for async task execution.
 * Defines the thread pool used for @Async annotated methods.
 * Demonstrates thread pool configuration for multithreading.
 */
@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(4);       // Minimum threads
        executor.setMaxPoolSize(8);        // Maximum threads
        executor.setQueueCapacity(50);     // Queue capacity before rejection
        executor.setThreadNamePrefix("Async-BankTxn-");
        executor.initialize();
        return executor;
    }
}
