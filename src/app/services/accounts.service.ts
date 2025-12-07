import { computed, inject, Injectable, signal } from '@angular/core';
import Account from '../shared/models/account.model';
import { HttpClient } from '@angular/common/http';
import { concatMap, Observable, tap } from 'rxjs';
import { TransactionsService } from './transactions.service';
import { Transaction } from '../shared/models/transaction.model';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  private http = inject(HttpClient);
  private transactionsService = inject(TransactionsService);
  private apiUrl = 'http://localhost:3000/accounts';

  accounts = signal<Account[]>([]);
  totalBalance = computed(() =>
    this.accounts()
      .filter((acc) => acc.accountType !== 'external')
      .reduce((sum, acc) => sum + acc.balance, 0)
  );

  loadAccounts() {
    return this.http.get<Account[]>(this.apiUrl).pipe(tap((data) => this.accounts.set(data)));
  }

  addAccount(account: Account) {
    return this.http
      .post<Account>(this.apiUrl, account)
      .pipe(tap((newAccount) => this.accounts.update((acc) => [...acc, newAccount])));
  }

  updateAccount(id: string, data: Partial<Account>) {
    return this.http
      .patch<Account>(`${this.apiUrl}/${id}`, data)
      .pipe(
        tap((updated) =>
          this.accounts.update((accList) => accList.map((a) => (a.id === id ? updated : a)))
        )
      );
  }

  deleteAccount(id: string) {
    const deletedAccount = this.accounts().find((account) => account.id === id);
    const primaryAccount = this.accounts()[0];

    if (!deletedAccount) throw new Error('Account not found.');
    if (!primaryAccount) throw new Error('Primary account not available.');

    const amountToTransfer = deletedAccount.balance;

    // if amount on deleted acc is 0 and if account is external, don't send funds to the main acc, just delet it
    if (this._deleteAccountWithoutTransferingFunds(amountToTransfer, deletedAccount)) {
      return this.http
        .delete(`${this.apiUrl}/${id}`)
        .pipe(tap(() => this.accounts.update((accList) => accList.filter((a) => a.id !== id))));
    }

    // if deleting account, transfer funds to the primary acc
    if (deletedAccount) this._transferingFundsWhenDeletingAccount(deletedAccount);

    return this.transferAccountsFunds(deletedAccount.id, primaryAccount.id, amountToTransfer).pipe(
      concatMap(() => this.http.delete(`${this.apiUrl}/${id}`)),
      tap(() => {
        this.accounts.update((accList) => accList.filter((a) => a.id !== id));
      })
    );
  }

  transferAccountsFunds(sourceId: string, destinationId: string, amount: number) {
    if (sourceId === destinationId) {
      throw new Error('Source and destination accounts cannot be the same.');
    }

    const accounts = this.accounts();
    const sourceAccount = accounts.find((a) => a.id === sourceId);
    const destinationAccount = accounts.find((a) => a.id === destinationId);

    if (!sourceAccount || !destinationAccount) throw new Error('Account not found.');
    if (sourceAccount.balance < amount) throw new Error('Insufficient balance.');

    const updatedSource = {
      ...sourceAccount,
      balance: sourceAccount.balance - amount,
    };

    const updatedDestination = {
      ...destinationAccount,
      balance: destinationAccount.balance + amount,
    };

    const transactionRecord = this._createTransactionRecord(sourceId, destinationId, amount);

    return this.updateAccount(sourceId, updatedSource).pipe(
      concatMap(() => this.updateAccount(destinationId, updatedDestination)),
      concatMap(() => this.transactionsService.addTransaction(transactionRecord))
    );
  }

  private _createTransactionRecord(sourceId: string, destinationId: string, amount: number) {
    return {
      id: crypto.randomUUID(),
      sourceId,
      destinationId,
      amount,
      date: new Date().toISOString(),
    };
  }

  private _deleteAccountWithoutTransferingFunds(amount: number, account: Account): boolean {    
    return amount === 0 || account.accountType === 'external';
  }

  private _transferingFundsWhenDeletingAccount(account: Account) {
    return this.transferAccountsFunds(account?.id, this.accounts()[0].id, account?.balance);
  }
}
