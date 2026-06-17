import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService, Account } from '../../services/account.service';
import { TransactionService, Transaction, TransactionDTO, TransferDTO } from '../../services/transaction.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="transactions-page">
      <div class="page-header">
        <h2>Transactions</h2>
        <p>Perform deposits, withdrawals, and transfers</p>
      </div>

      <!-- Operation Tabs -->
      <div class="tabs">
        <button [class.active]="activeTab === 'deposit'" (click)="activeTab = 'deposit'">
          <i class="fas fa-arrow-down"></i> Deposit
        </button>
        <button [class.active]="activeTab === 'withdraw'" (click)="activeTab = 'withdraw'">
          <i class="fas fa-arrow-up"></i> Withdraw
        </button>
        <button [class.active]="activeTab === 'transfer'" (click)="activeTab = 'transfer'">
          <i class="fas fa-exchange-alt"></i> Transfer
        </button>
        <button [class.active]="activeTab === 'history'" (click)="activeTab = 'history'">
          <i class="fas fa-history"></i> History
        </button>
      </div>

      <!-- Messages -->
      <div *ngIf="successMessage" class="alert alert-success">
        <i class="fas fa-check-circle"></i> {{ successMessage }}
      </div>
      <div *ngIf="errorMessage" class="alert alert-error">
        <i class="fas fa-exclamation-circle"></i> {{ errorMessage }}
      </div>

      <!-- Deposit Form -->
      <div class="card" *ngIf="activeTab === 'deposit'">
        <h3><i class="fas fa-arrow-down" style="color: #28a745;"></i> Make a Deposit</h3>
        <form (ngSubmit)="processDeposit()" class="transaction-form">
          <div class="form-group">
            <label for="depositAccount">Select Account</label>
            <select id="depositAccount" [(ngModel)]="depositData.accountNumber" name="depositAccount" required>
              <option value="">Choose an account</option>
              <option *ngFor="let acc of accounts" [value]="acc.accountNumber">
                {{ acc.accountHolderName }} - {{ acc.accountNumber }} ({{ acc.balance | currency }})
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="depositAmount">Amount</label>
            <input type="number" id="depositAmount" [(ngModel)]="depositData.amount"
                   name="depositAmount" placeholder="Enter amount" min="0.01" step="0.01" required>
          </div>
          <div class="form-group">
            <label for="depositDesc">Description (Optional)</label>
            <input type="text" id="depositDesc" [(ngModel)]="depositData.description"
                   name="depositDesc" placeholder="E.g., Salary credit">
          </div>
          <button type="submit" class="btn btn-success">
            <i class="fas fa-check"></i> Process Deposit
          </button>
        </form>
      </div>

      <!-- Withdrawal Form -->
      <div class="card" *ngIf="activeTab === 'withdraw'">
        <h3><i class="fas fa-arrow-up" style="color: #dc3545;"></i> Make a Withdrawal</h3>
        <form (ngSubmit)="processWithdrawal()" class="transaction-form">
          <div class="form-group">
            <label for="withdrawAccount">Select Account</label>
            <select id="withdrawAccount" [(ngModel)]="withdrawData.accountNumber" name="withdrawAccount" required>
              <option value="">Choose an account</option>
              <option *ngFor="let acc of accounts" [value]="acc.accountNumber">
                {{ acc.accountHolderName }} - {{ acc.accountNumber }} ({{ acc.balance | currency }})
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="withdrawAmount">Amount</label>
            <input type="number" id="withdrawAmount" [(ngModel)]="withdrawData.amount"
                   name="withdrawAmount" placeholder="Enter amount" min="0.01" step="0.01" required>
          </div>
          <div class="form-group">
            <label for="withdrawDesc">Description (Optional)</label>
            <input type="text" id="withdrawDesc" [(ngModel)]="withdrawData.description"
                   name="withdrawDesc" placeholder="E.g., ATM Withdrawal">
          </div>
          <button type="submit" class="btn btn-danger">
            <i class="fas fa-check"></i> Process Withdrawal
          </button>
        </form>
      </div>

      <!-- Transfer Form -->
      <div class="card" *ngIf="activeTab === 'transfer'">
        <h3><i class="fas fa-exchange-alt" style="color: #1a73e8;"></i> Fund Transfer</h3>
        <form (ngSubmit)="processTransfer()" class="transaction-form">
          <div class="form-group">
            <label for="fromAccount">From Account</label>
            <select id="fromAccount" [(ngModel)]="transferData.fromAccountNumber" name="fromAccount" required>
              <option value="">Select source account</option>
              <option *ngFor="let acc of accounts" [value]="acc.accountNumber">
                {{ acc.accountHolderName }} - {{ acc.accountNumber }} ({{ acc.balance | currency }})
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="toAccount">To Account</label>
            <select id="toAccount" [(ngModel)]="transferData.toAccountNumber" name="toAccount" required>
              <option value="">Select destination account</option>
              <option *ngFor="let acc of accounts" [value]="acc.accountNumber">
                {{ acc.accountHolderName }} - {{ acc.accountNumber }} ({{ acc.balance | currency }})
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="transferAmount">Amount</label>
            <input type="number" id="transferAmount" [(ngModel)]="transferData.amount"
                   name="transferAmount" placeholder="Enter amount" min="0.01" step="0.01" required>
          </div>
          <div class="form-group">
            <label for="transferDesc">Description (Optional)</label>
            <input type="text" id="transferDesc" [(ngModel)]="transferData.description"
                   name="transferDesc" placeholder="E.g., Payment for services">
          </div>
          <button type="submit" class="btn btn-primary">
            <i class="fas fa-paper-plane"></i> Transfer Funds
          </button>
        </form>
      </div>

      <!-- Transaction History -->
      <div class="card" *ngIf="activeTab === 'history'">
        <h3><i class="fas fa-history"></i> Transaction History</h3>
        <div class="form-group">
          <label for="historyAccount">Select Account</label>
          <select id="historyAccount" [(ngModel)]="historyAccountNumber"
                  (change)="loadHistory()" name="historyAccount">
            <option value="">Choose an account</option>
            <option *ngFor="let acc of accounts" [value]="acc.accountNumber">
              {{ acc.accountHolderName }} - {{ acc.accountNumber }}
            </option>
          </select>
        </div>

        <div *ngIf="transactions.length === 0 && historyAccountNumber" class="empty-state">
          <p>No transactions found for this account.</p>
        </div>

        <table *ngIf="transactions.length > 0">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Balance After</th>
              <th>Description</th>
              <th>Thread</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let txn of transactions">
              <td>{{ txn.transactionDate | date:'short' }}</td>
              <td>
                <span class="badge" [ngClass]="{
                  'badge-deposit': txn.transactionType === 'DEPOSIT',
                  'badge-withdrawal': txn.transactionType === 'WITHDRAWAL',
                  'badge-transfer': txn.transactionType === 'TRANSFER'
                }">{{ txn.transactionType }}</span>
              </td>
              <td [class.amount-deposit]="txn.transactionType === 'DEPOSIT'"
                  [class.amount-withdrawal]="txn.transactionType === 'WITHDRAWAL'">
                {{ txn.transactionType === 'DEPOSIT' ? '+' : '-' }}{{ txn.amount | currency }}
              </td>
              <td>{{ txn.balanceAfter | currency }}</td>
              <td>{{ txn.description }}</td>
              <td><code>{{ txn.processedByThread }}</code></td>
              <td><span class="badge badge-deposit">{{ txn.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .tabs button {
      padding: 10px 20px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      font-size: 14px;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .tabs button:hover {
      border-color: #1a73e8;
      color: #1a73e8;
    }

    .tabs button.active {
      background: #1a73e8;
      color: white;
      border-color: #1a73e8;
    }

    .transaction-form {
      margin-top: 16px;
      max-width: 500px;
    }

    h3 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    h3 i {
      margin-right: 8px;
    }

    .amount-deposit {
      color: #28a745;
      font-weight: 600;
    }

    .amount-withdrawal {
      color: #dc3545;
      font-weight: 600;
    }

    .empty-state {
      text-align: center;
      padding: 30px;
      color: #666;
    }

    code {
      background: #f0f2f5;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 11px;
    }
  `]
})
export class TransactionsComponent implements OnInit {
  activeTab = 'deposit';
  accounts: Account[] = [];
  transactions: Transaction[] = [];
  historyAccountNumber = '';
  successMessage = '';
  errorMessage = '';

  depositData: TransactionDTO = {
    accountNumber: '',
    transactionType: 'DEPOSIT',
    amount: 0,
    description: ''
  };

  withdrawData: TransactionDTO = {
    accountNumber: '',
    transactionType: 'WITHDRAWAL',
    amount: 0,
    description: ''
  };

  transferData: TransferDTO = {
    fromAccountNumber: '',
    toAccountNumber: '',
    amount: 0,
    description: ''
  };

  constructor(
    private accountService: AccountService,
    private transactionService: TransactionService
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.getAllAccounts().subscribe({
      next: (response) => {
        this.accounts = response.data || [];
      },
      error: (err) => {
        this.errorMessage = 'Failed to load accounts';
      }
    });
  }

  processDeposit(): void {
    this.clearMessages();
    this.depositData.transactionType = 'DEPOSIT';
    this.transactionService.deposit(this.depositData).subscribe({
      next: (response) => {
        this.successMessage = `Deposit of ${this.depositData.amount} completed successfully!`;
        this.depositData = { accountNumber: '', transactionType: 'DEPOSIT', amount: 0, description: '' };
        this.loadAccounts();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Deposit failed';
      }
    });
  }

  processWithdrawal(): void {
    this.clearMessages();
    this.withdrawData.transactionType = 'WITHDRAWAL';
    this.transactionService.withdraw(this.withdrawData).subscribe({
      next: (response) => {
        this.successMessage = `Withdrawal of ${this.withdrawData.amount} completed successfully!`;
        this.withdrawData = { accountNumber: '', transactionType: 'WITHDRAWAL', amount: 0, description: '' };
        this.loadAccounts();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Withdrawal failed. Check available balance.';
      }
    });
  }

  processTransfer(): void {
    this.clearMessages();
    if (this.transferData.fromAccountNumber === this.transferData.toAccountNumber) {
      this.errorMessage = 'Source and destination accounts must be different';
      return;
    }
    this.transactionService.transfer(this.transferData).subscribe({
      next: (response) => {
        this.successMessage = `Transfer of ${this.transferData.amount} completed successfully!`;
        this.transferData = { fromAccountNumber: '', toAccountNumber: '', amount: 0, description: '' };
        this.loadAccounts();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Transfer failed';
      }
    });
  }

  loadHistory(): void {
    if (this.historyAccountNumber) {
      this.transactionService.getHistory(this.historyAccountNumber).subscribe({
        next: (response) => {
          this.transactions = response.data || [];
        },
        error: (err) => {
          this.errorMessage = 'Failed to load transaction history';
        }
      });
    }
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
