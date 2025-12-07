import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Transaction } from '../shared/models/transaction.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  apiUrl = 'http://localhost:3000/transactions';
  private http = inject(HttpClient);

  transactions = signal<Transaction[]>([]);

  loadTransactions(): Observable<Transaction[]> {
    return this.http
      .get<Transaction[]>(this.apiUrl)
      .pipe(tap((data) => this.transactions.set(data)));
  }

  addTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, transaction).pipe(
      tap((created) => {
        this.transactions.update((list) => [...list, created]);
      })
    );
  }
}
