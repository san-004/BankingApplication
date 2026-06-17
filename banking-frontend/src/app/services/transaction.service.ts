import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from './account.service';
import { environment } from '../../environments/environment';

export interface Transaction {
  id: number;
  transactionId: string;
  transactionType: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  transactionDate: string;
  status: string;
  processedByThread: string;
}

export interface TransactionDTO {
  accountNumber: string;
  transactionType: string;
  amount: number;
  description?: string;
}

export interface TransferDTO {
  fromAccountNumber: string;
  toAccountNumber: string;
  amount: number;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private baseUrl = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) {}

  deposit(transaction: TransactionDTO): Observable<ApiResponse<Transaction>> {
    return this.http.post<ApiResponse<Transaction>>(`${this.baseUrl}/deposit`, transaction);
  }

  withdraw(transaction: TransactionDTO): Observable<ApiResponse<Transaction>> {
    return this.http.post<ApiResponse<Transaction>>(`${this.baseUrl}/withdraw`, transaction);
  }

  transfer(transfer: TransferDTO): Observable<ApiResponse<Transaction[]>> {
    return this.http.post<ApiResponse<Transaction[]>>(`${this.baseUrl}/transfer`, transfer);
  }

  getHistory(accountNumber: string): Observable<ApiResponse<Transaction[]>> {
    return this.http.get<ApiResponse<Transaction[]>>(`${this.baseUrl}/history/${accountNumber}`);
  }

  getRecentTransactions(accountNumber: string): Observable<ApiResponse<Transaction[]>> {
    return this.http.get<ApiResponse<Transaction[]>>(`${this.baseUrl}/recent/${accountNumber}`);
  }

  processBatch(accountNumber: string, deposits: number, withdrawals: number): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.baseUrl}/batch/${accountNumber}?deposits=${deposits}&withdrawals=${withdrawals}`, {});
  }

  getThreadInfo(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.baseUrl}/thread-info`);
  }
}
