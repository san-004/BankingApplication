import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService, Account } from '../../services/account.service';
import { TransactionService } from '../../services/transaction.service';

@Component({
  selector: 'app-multithreading',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="multithreading-page">
      <div class="page-header">
        <h2>Multithreading Demonstration</h2>
        <p>Demonstrates concurrent transaction processing using Java thread pools</p>
      </div>

      <!-- Thread Info Card -->
      <div class="card info-card">
        <h3><i class="fas fa-info-circle"></i> Thread Pool Configuration</h3>
        <div class="info-grid" *ngIf="threadInfo">
          <div class="info-item">
            <span class="label">Current Thread:</span>
            <span class="value"><code>{{ threadInfo.currentThread }}</code></span>
          </div>
          <div class="info-item">
            <span class="label">Thread Pool Type:</span>
            <span class="value">{{ threadInfo.threadPoolType }}</span>
          </div>
          <div class="info-item">
            <span class="label">Available Processors:</span>
            <span class="value">{{ threadInfo.availableProcessors }}</span>
          </div>
          <div class="info-item">
            <span class="label">Active Threads:</span>
            <span class="value">{{ threadInfo.activeThreadCount }}</span>
          </div>
        </div>
        <p class="description" *ngIf="threadInfo">{{ threadInfo.description }}</p>
        <button class="btn btn-primary" (click)="loadThreadInfo()">
          <i class="fas fa-refresh"></i> Refresh Thread Info
        </button>
      </div>

      <!-- Batch Processing Card -->
      <div class="card">
        <h3><i class="fas fa-layer-group"></i> Batch Transaction Processing</h3>
        <p class="subtitle">
          Submit multiple transactions simultaneously. They will be processed concurrently
          using the thread pool, demonstrating parallel execution.
        </p>

        <form (ngSubmit)="processBatch()" class="batch-form">
          <div class="form-row">
            <div class="form-group">
              <label for="batchAccount">Select Account</label>
              <select id="batchAccount" [(ngModel)]="batchAccountNumber" name="batchAccount" required>
                <option value="">Choose an account</option>
                <option *ngFor="let acc of accounts" [value]="acc.accountNumber">
                  {{ acc.accountHolderName }} - {{ acc.accountNumber }} ({{ acc.balance | currency }})
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="depositCount">Number of Deposits (₹100 each)</label>
              <input type="number" id="depositCount" [(ngModel)]="depositCount"
                     name="depositCount" min="1" max="10" required>
            </div>
            <div class="form-group">
              <label for="withdrawalCount">Number of Withdrawals (₹50 each)</label>
              <input type="number" id="withdrawalCount" [(ngModel)]="withdrawalCount"
                     name="withdrawalCount" min="0" max="10" required>
            </div>
          </div>
          <button type="submit" class="btn btn-primary" [disabled]="processing">
            <i class="fas fa-bolt"></i>
            {{ processing ? 'Processing...' : 'Execute Batch Processing' }}
          </button>
        </form>
      </div>

      <!-- Messages -->
      <div *ngIf="successMessage" class="alert alert-success">
        <i class="fas fa-check-circle"></i> {{ successMessage }}
      </div>
      <div *ngIf="errorMessage" class="alert alert-error">
        <i class="fas fa-exclamation-circle"></i> {{ errorMessage }}
      </div>

      <!-- Batch Results -->
      <div class="card" *ngIf="batchResult">
        <h3><i class="fas fa-chart-bar"></i> Batch Processing Results</h3>
        <div class="results-summary">
          <div class="result-item">
            <span class="label">Total Transactions:</span>
            <span class="value highlight">{{ batchResult.totalTransactions }}</span>
          </div>
          <div class="result-item">
            <span class="label">Processing Time:</span>
            <span class="value highlight">{{ batchResult.processingTimeMs }} ms</span>
          </div>
        </div>

        <!-- Thread Usage Visualization -->
        <h4>Thread Distribution</h4>
        <div class="thread-usage">
          <div *ngFor="let thread of getThreadUsage()" class="thread-bar">
            <div class="thread-name"><code>{{ thread.name }}</code></div>
            <div class="bar-container">
              <div class="bar" [style.width.%]="getThreadPercentage(thread.count)">
                {{ thread.count }} tasks
              </div>
            </div>
          </div>
        </div>

        <!-- Transaction Details -->
        <h4>Transaction Details</h4>
        <table>
          <thead>
            <tr>
              <th>Transaction ID</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Processed By Thread</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let txn of batchResult.transactions">
              <td><code>{{ txn.transactionId?.substring(0, 8) }}...</code></td>
              <td>
                <span class="badge" [ngClass]="{
                  'badge-deposit': txn.type === 'DEPOSIT',
                  'badge-withdrawal': txn.type === 'WITHDRAWAL'
                }">{{ txn.type }}</span>
              </td>
              <td>{{ txn.amount | currency }}</td>
              <td><code class="thread-highlight">{{ txn.processedBy }}</code></td>
              <td><span class="badge badge-deposit">{{ txn.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Concept Explanation -->
      <div class="card concept-card">
        <h3><i class="fas fa-book"></i> Multithreading Concepts Used</h3>
        <div class="concept-grid">
          <div class="concept-item">
            <h4>ExecutorService</h4>
            <p>Fixed thread pool with 4 worker threads for concurrent transaction processing.</p>
          </div>
          <div class="concept-item">
            <h4>CompletableFuture</h4>
            <p>Non-blocking async operations with CompletableFuture.supplyAsync() for parallel execution.</p>
          </div>
          <div class="concept-item">
            <h4>Synchronized Blocks</h4>
            <p>Thread-safe balance updates using synchronized blocks to prevent race conditions.</p>
          </div>
          <div class="concept-item">
            <h4>ConcurrentHashMap</h4>
            <p>Thread-safe collection for account caching without explicit locking.</p>
          </div>
          <div class="concept-item">
            <h4>&#64;Async Annotation</h4>
            <p>Spring's async method execution using a configured ThreadPoolTaskExecutor.</p>
          </div>
          <div class="concept-item">
            <h4>Thread Safety</h4>
            <p>Pessimistic locking in JPA and synchronized methods prevent data inconsistency.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .info-card {
      background: linear-gradient(135deg, #f8f9ff 0%, #e8f0fe 100%);
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 12px;
      margin: 16px 0;
    }

    .info-item {
      display: flex;
      flex-direction: column;
    }

    .info-item .label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-item .value {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
      margin-top: 4px;
    }

    .description {
      color: #555;
      font-size: 13px;
      margin: 12px 0;
      padding: 10px;
      background: white;
      border-radius: 8px;
    }

    .subtitle {
      color: #666;
      margin-bottom: 16px;
      font-size: 14px;
    }

    .batch-form .form-row {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 16px;
      margin-bottom: 16px;
    }

    .results-summary {
      display: flex;
      gap: 30px;
      margin: 16px 0;
    }

    .result-item {
      display: flex;
      flex-direction: column;
    }

    .result-item .label {
      font-size: 12px;
      color: #666;
    }

    .result-item .highlight {
      font-size: 24px;
      font-weight: 700;
      color: #1a73e8;
    }

    h3 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    h3 i {
      margin-right: 8px;
      color: #1a73e8;
    }

    h4 {
      font-size: 15px;
      font-weight: 600;
      margin: 20px 0 12px;
      color: #333;
    }

    .thread-usage {
      margin: 12px 0;
    }

    .thread-bar {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }

    .thread-name {
      width: 180px;
      flex-shrink: 0;
    }

    .bar-container {
      flex: 1;
      background: #eee;
      border-radius: 8px;
      height: 28px;
      overflow: hidden;
    }

    .bar {
      height: 100%;
      background: linear-gradient(90deg, #1a73e8, #4285f4);
      border-radius: 8px;
      display: flex;
      align-items: center;
      padding: 0 12px;
      color: white;
      font-size: 12px;
      font-weight: 500;
      min-width: 60px;
    }

    .thread-highlight {
      background: #e8f0fe;
      color: #1a73e8;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 11px;
    }

    .concept-card {
      background: #fafafa;
    }

    .concept-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-top: 16px;
    }

    .concept-item {
      background: white;
      padding: 16px;
      border-radius: 8px;
      border: 1px solid #eee;
    }

    .concept-item h4 {
      margin: 0 0 8px;
      font-size: 14px;
      color: #1a73e8;
    }

    .concept-item p {
      font-size: 13px;
      color: #555;
      margin: 0;
    }

    code {
      background: #f0f2f5;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 12px;
    }

    @media (max-width: 768px) {
      .batch-form .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class MultithreadingComponent implements OnInit {
  accounts: Account[] = [];
  threadInfo: any = null;
  batchResult: any = null;
  batchAccountNumber = '';
  depositCount = 5;
  withdrawalCount = 3;
  processing = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private accountService: AccountService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
    this.loadThreadInfo();
  }

  loadAccounts(): void {
    this.accountService.getAllAccounts().subscribe({
      next: (response) => {
        this.accounts = response.data || [];
      }
    });
  }

  loadThreadInfo(): void {
    this.transactionService.getThreadInfo().subscribe({
      next: (response) => {
        this.threadInfo = response.data;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load thread info';
      }
    });
  }

  processBatch(): void {
    this.clearMessages();
    if (!this.batchAccountNumber) {
      this.errorMessage = 'Please select an account';
      return;
    }

    this.processing = true;
    this.batchResult = null;

    this.transactionService.processBatch(
      this.batchAccountNumber, this.depositCount, this.withdrawalCount
    ).subscribe({
      next: (response) => {
        this.batchResult = response.data;
        this.successMessage = `Batch processing completed! ${response.data.totalTransactions} transactions ` +
          `processed in ${response.data.processingTimeMs}ms`;
        this.processing = false;
        this.loadAccounts();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Batch processing failed';
        this.processing = false;
      }
    });
  }

  getThreadUsage(): { name: string; count: number }[] {
    if (!this.batchResult?.threadsUsed) return [];
    return Object.entries(this.batchResult.threadsUsed).map(([name, count]) => ({
      name,
      count: count as number
    }));
  }

  getThreadPercentage(count: number): number {
    if (!this.batchResult) return 0;
    return (count / this.batchResult.totalTransactions) * 100;
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
