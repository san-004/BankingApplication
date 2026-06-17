import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component')
      .then(m => m.DashboardComponent)
  },
  {
    path: 'accounts',
    loadComponent: () => import('./components/accounts/accounts.component')
      .then(m => m.AccountsComponent)
  },
  {
    path: 'transactions',
    loadComponent: () => import('./components/transactions/transactions.component')
      .then(m => m.TransactionsComponent)
  },
  {
    path: 'multithreading',
    loadComponent: () => import('./components/multithreading/multithreading.component')
      .then(m => m.MultithreadingComponent)
  }
];
