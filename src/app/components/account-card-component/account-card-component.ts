import { Component, inject, Input } from '@angular/core';
import Account from '../../shared/models/account.model';
import { AccountsService } from '../../services/accounts.service';
import { DecimalPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-account-card-component',
  imports: [DecimalPipe, NgClass],
  templateUrl: './account-card-component.html',
  styleUrl: './account-card-component.scss',
})
export class AccountCardComponent {
  private accountService = inject(AccountsService);

  @Input() account!: Account;

  onDelete(id: string) {
    const confirmed = confirm('Are you sure you want to delete this account?');
    if (!confirmed) return;

    this.accountService.deleteAccount(id).subscribe();
  }
}
