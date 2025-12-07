import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AccountsService } from '../../../services/accounts.service';
import { TransactionsService } from '../../../services/transactions.service';
import { TransferPreviewComponent } from '../transfer-preview-component/transfer-preview-component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transfer-form-component',
  standalone: true,
  imports: [CommonModule, FormsModule, TransferPreviewComponent],
  templateUrl: './transfer-form-component.html',
  styleUrl: './transfer-form-component.scss',
})
export class TransferFormComponent {
  private accountService = inject(AccountsService);
  private transactionsService = inject(TransactionsService);
  private router = inject(Router);

  accounts = this.accountService.accounts;
  internalAccounts = this.accounts().filter((acc) => acc.accountType !== 'external');

  sourceId = signal('');
  destinationId = signal('');
  amount = signal<number | null>(null);
  message = signal<string | null>(null);
  error = signal<string | null>(null);
  step = signal<'form' | 'preview'>('form');

  sourceAccount = computed(() => this.accounts().find((a) => a.id === this.sourceId()) || null);
  destinationAccount = computed(
    () => this.accounts().find((a) => a.id === this.destinationId()) || null
  );

  goToPreview(): void {
    this.error.set(null);

    if (!this.sourceId() || !this.destinationId() || !this.amount()) {
      this.error.set('Please fill in all fields.');
      return;
    }

    if (this.sourceId() === this.destinationId()) {
      this.error.set('You cannot transfer to the same account.');
      return;
    }

    this.step.set('preview');
  }

  submitTransfer(): void {
    this.error.set(null);
    this.message.set(null);

    const source = this.sourceId();
    const dest = this.destinationId();
    const amount = this.amount();

    if (!source || !dest || !amount) {
      this.error.set('Please fill in all fields.');
      return;
    }

    try {
      this.accountService.transferAccountsFunds(source, dest, amount).subscribe({
        next: () => {
          this.transactionsService.loadTransactions();
          this.message.set('Transfer completed successfully!');
          this.amount.set(null);
          this.sourceId.set('');
          this.destinationId.set('');
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.error.set(err.message || 'Transfer failed.');
        },
      });
    } catch (err: any) {
      this.error.set(err.message);
    }
  }

  goToDashboard(): void {
    this.router.navigate(['/']);
  }
}
