import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountService, Account, AccountDTO } from '../../services/account.service';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="accounts-page">
      <div class="page-header">
        <h2>Account Management</h2>
        <p>Create and manage bank accounts</p>
      </div>

      <!-- Create Account Form -->
      <div class="card">
        <h3><i class="fas fa-plus-circle"></i> Create New Account</h3>
        <form (ngSubmit)="createAccount()" class="account-form">
          <div class="form-row">
            <div class="form-group">
              <label for="holderName">Account Holder Name</label>
              <input type="text" id="holderName" [(ngModel)]="newAccount.accountHolderName"
                     name="holderName" placeholder="Enter full name" required>
            </div>
            <div class="form-group">
              <label for="email">Email Address</label>
              <input type="email" id="email" [(ngModel)]="newAccount.email"
                     name="email" placeholder="email@example.com" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label for="accountType">Account Type</label>
              <select id="accountType" [(ngModel)]="newAccount.accountType" name="accountType" required>
                <option value="">Select Type</option>
                <option value="SAVINGS">Savings</option>
                <option value="CURRENT">Current</option>
                <option value="FIXED_DEPOSIT">Fixed Deposit</option>
              </select>
            </div>
            <div class="form-group">
              <label for="initialDeposit">Initial Deposit (Optional)</label>
              <input type="number" id="initialDeposit" [(ngModel)]="newAccount.initialDeposit"
                     name="initialDeposit" placeholder="0.00" min="0">
            </div>
          </div>
          <button type="submit" class="btn btn-primary">
            <i class="fas fa-check"></i> Create Account
          </button>
        </form>
      </div>

      <!-- Success/Error Messages -->
      <div *ngIf="successMessage" class="alert alert-success">
        <i class="fas fa-check-circle"></i> {{ successMessage }}
      </div>
      <div *ngIf="errorMessage" class="alert alert-error">
        <i class="fas fa-exclamation-circle"></i> {{ errorMessage }}
      </div>

      <!-- Accounts List -->
      <div class="card">
        <div class="card-header">
          <h3><i class="fas fa-list"></i> All Accounts</h3>
          <button class="btn btn-primary" (click)="loadAccounts()">
            <i class="fas fa-refresh"></i> Refresh
          </button>
        </div>

        <div *ngIf="loading" class="loading-spinner"></div>

        <div *ngIf="!loading && accounts.length === 0" class="empty-state">
          <p>No accounts found. Create one above.</p>
        </div>

        <table *ngIf="!loading && accounts.length > 0">
          <thead>
            <tr>
              <th>Account Number</th>
              <th>Holder Name</th>
              <th>Email</th>
              <th>Type</th>
              <th>Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let account of accounts">
              <td><code>{{ account.accountNumber }}</code></td>
              <td>{{ account.accountHolderName }}</td>
              <td>{{ account.email }}</td>
              <td><span class="badge badge-deposit">{{ account.accountType }}</span></td>
              <td class="balance">{{ account.balance | currency }}</td>
              <td>
                <button class="btn btn-danger btn-sm" (click)="deleteAccount(account.accountNumber)"
                        title="Deactivate Account">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .account-form {
      margin-top: 16px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
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

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .balance {
      font-weight: 600;
      color: #28a745;
    }

    .btn-sm {
      padding: 6px 12px;
      font-size: 12px;
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
      font-size: 13px;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AccountsComponent implements OnInit {
  accounts: Account[] = [];
  loading = false;
  successMessage = '';
  errorMessage = '';

  newAccount: AccountDTO = {
    accountHolderName: '',
    email: '',
    accountType: '',
    initialDeposit: 0
  };

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.loading = true;
    this.accountService.getAllAccounts().subscribe({
      next: (response) => {
        this.accounts = response.data || [];
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load accounts';
        this.loading = false;
      }
    });
  }

  createAccount(): void {
    this.clearMessages();
    this.accountService.createAccount(this.newAccount).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = `Account created successfully! Account Number: ${response.data.accountNumber}`;
          this.loadAccounts();
          this.resetForm();
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to create account';
      }
    });
  }

  deleteAccount(accountNumber: string): void {
    if (confirm('Are you sure you want to deactivate this account?')) {
      this.accountService.deleteAccount(accountNumber).subscribe({
        next: (response) => {
          this.successMessage = 'Account deactivated successfully';
          this.loadAccounts();
        },
        error: (err) => {
          this.errorMessage = 'Failed to deactivate account';
        }
      });
    }
  }

  resetForm(): void {
    this.newAccount = {
      accountHolderName: '',
      email: '',
      accountType: '',
      initialDeposit: 0
    };
  }

  clearMessages(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
