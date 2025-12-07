import { Component, computed, inject, input, OnInit } from '@angular/core';
import { AccountsService } from '../../services/accounts.service';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { AccountCardComponent } from '../account-card-component/account-card-component';

@Component({
  selector: 'app-accounts-list-component',
  imports: [AccountCardComponent],
  templateUrl: './accounts-list-component.html',
  styleUrl: './accounts-list-component.scss',
})
export class AccountsListComponent implements OnInit {
  fullAccListPreview = input<boolean>();

  private accountService = inject(AccountsService);
  private router = inject(Router);

  accounts = this.accountService.accounts;

  accountsList = computed(() => {
    const list = this.accounts();
    if (!this.fullAccListPreview()) {
      return list.slice(0, 4);
    }

    return list;
  });

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.accountService.loadAccounts().subscribe({
      error: (err) => console.error('Failed to load accounts', err),
    });
  }

  onAddAccount(): void {
    this.router.navigate(['/add-account']);
  }
}
