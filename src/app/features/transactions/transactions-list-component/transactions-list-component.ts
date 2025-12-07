import { Component, computed, inject, input, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { AccountsService } from '../../../services/accounts.service';
import { TransactionsService } from '../../../services/transactions.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-transactions-list-component',
  imports: [DatePipe, DecimalPipe, RouterLink, CommonModule],
  templateUrl: './transactions-list-component.html',
  styleUrl: './transactions-list-component.scss',
})
export class TransactionsListComponent implements OnInit {
  limit = input<number>();
  fullListPreview = input<boolean>();

  private accountService = inject(AccountsService);
  private transactionsService = inject(TransactionsService);

  transactions = this.transactionsService.transactions;
  accounts = this.accountService.accounts;
  isExternal!: boolean;

  sortedTransactions = computed(() => {
    let list = [...this.transactions()]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map((transaction) => {
        const source = this.accounts().find((a) => a.id === transaction.sourceId);
        const dest = this.accounts().find((a) => a.id === transaction.destinationId);

        const isExternal = source?.accountType === 'external' || dest?.accountType === 'external';

        return {
          ...transaction,
          sourceName: source?.accountName || 'Deleted Account',
          destinationName: dest?.accountName || 'Deleted Account',
          isExternal
        };
      });

    if (!this.fullListPreview()) {
      return list.slice(0, this.limit());
    }

    return list;
  });

  ngOnInit() {
    this.loadTransactionsData();
  }

  loadTransactionsData(): void {
    this.transactionsService.loadTransactions().subscribe();
  }
}
