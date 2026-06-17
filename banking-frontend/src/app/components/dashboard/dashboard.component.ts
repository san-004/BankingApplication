import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AccountService, Account } from '../../services/account.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <div class="page-header">
        <h2>Dashboard</h2>
        <p>Welcome to SecureBank - Your Banking Application Overview</p>
      </div>

      <!-- Statistics Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-info">
            <h3>{{ accounts.length }}</h3>
            <p>Total Accounts</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">
            <i class="fas fa-dollar-sign"></i>
          </div>
          <div class="stat-info">
            <h3>{{ getTotalBalance() | currency }}</h3>
            <p>Total Balance</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple">
            <i class="fas fa-piggy-bank"></i>
          </div>
          <div class="stat-info">
            <h3>{{ getSavingsCount() }}</h3>
            <p>Savings Accounts</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange">
            <i class="fas fa-briefcase"></i>
          </div>
          <div class="stat-info">
            <h3>{{ getCurrentCount() }}</h3>
            <p>Current Accounts</p>
          </div>
        </div>
      </div>

      <!-- Recent Accounts -->
      <div class="card">
        <div class="card-header">
          <h3>Recent Accounts</h3>
          <a routerLink="/accounts" class="btn btn-primary">View All</a>
        </div>
        <div *ngIf="accounts.length === 0" class="empty-state">
          <i class="fas fa-wallet"></i>
          <p>No accounts found. Create your first account to get started.</p>
          <a routerLink="/accounts" class="btn btn-primary">Create Account</a>
        </div>
        <table *ngIf="accounts.length > 0">
          <thead>
            <tr>
              <th>Account Number</th>
              <th>Holder Name</th>
              <th>Type</th>
              <th>Balance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let account of accounts.slice(0, 5)">
              <td><code>{{ account.accountNumber }}</code></td>
              <td>{{ account.accountHolderName }}</td>
              <td><span class="badge badge-deposit">{{ account.accountType }}</span></td>
              <td class="balance">{{ account.balance | currency }}</td>
              <td><span class="badge" [class.badge-deposit]="account.active">Active</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h3>Quick Actions</h3>
        <div class="actions-grid">
          <a routerLink="/accounts" class="action-card">
            <i class="fas fa-plus-circle"></i>
            <span>New Account</span>
          </a>
          <a routerLink="/transactions" class="action-card">
            <i class="fas fa-arrow-down"></i>
            <span>Deposit</span>
          </a>
          <a routerLink="/transactions" class="action-card">
            <i class="fas fa-arrow-up"></i>
            <span>Withdraw</span>
          </a>
          <a routerLink="/multithreading" class="action-card">
            <i class="fas fa-layer-group"></i>
            <span>Batch Process</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: white;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }

    .stat-icon {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: white;
    }

    .stat-icon.blue { background: linear-gradient(135deg, #1a73e8, #1557b0); }
    .stat-icon.green { background: linear-gradient(135deg, #28a745, #218838); }
    .stat-icon.purple { background: linear-gradient(135deg, #6f42c1, #5a32a3); }
    .stat-icon.orange { background: linear-gradient(135deg, #fd7e14, #e56b00); }

    .stat-info h3 {
      font-size: 22px;
      font-weight: 700;
      color: #1a1a1a;
    }

    .stat-info p {
      font-size: 13px;
      color: #666;
      margin-top: 2px;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .card-header h3 {
      font-size: 18px;
      font-weight: 600;
    }

    .balance {
      font-weight: 600;
      color: #28a745;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #666;
    }

    .empty-state i {
      font-size: 48px;
      color: #ddd;
      margin-bottom: 16px;
    }

    .empty-state p {
      margin-bottom: 16px;
    }

    .quick-actions h3 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 16px;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
    }

    .action-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: transform 0.3s, box-shadow 0.3s;
      cursor: pointer;
    }

    .action-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    }

    .action-card i {
      font-size: 28px;
      color: #1a73e8;
    }

    .action-card span {
      font-weight: 500;
      color: #333;
    }
  `]
})
export class DashboardComponent implements OnInit {
  accounts: Account[] = [];

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.getAllAccounts().subscribe({
      next: (response) => {
        if (response.success) {
          this.accounts = response.data;
        }
      },
      error: (err) => console.error('Error loading accounts:', err)
    });
  }

  getTotalBalance(): number {
    return this.accounts.reduce((sum, acc) => sum + acc.balance, 0);
  }

  getSavingsCount(): number {
    return this.accounts.filter(acc => acc.accountType === 'SAVINGS').length;
  }

  getCurrentCount(): number {
    return this.accounts.filter(acc => acc.accountType === 'CURRENT').length;
  }
}
