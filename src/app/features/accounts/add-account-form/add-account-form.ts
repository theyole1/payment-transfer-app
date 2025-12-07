import { Component, inject, OnInit, signal } from '@angular/core';
import { AccountsService } from '../../../services/accounts.service';
import Account from '../../../shared/models/account.model';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { noNumbersOnlyValidator } from '../../../shared/helpers/validators/noNumbersOnlyValidator';
import { uniqueNameValidator } from '../../../shared/helpers/validators/uniqueNameValidator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-account-form',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './add-account-form.html',
  styleUrl: './add-account-form.scss',
})
export class AddAccountForm implements OnInit {
  private fb = inject(FormBuilder);
  private accountsService = inject(AccountsService);
  private router = inject(Router);

  error = signal<string | null>(null);
  message = signal<string | null>(null);

  form!: FormGroup;

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.form = this.fb.group({
      accountName: [
        '',
        [Validators.required, noNumbersOnlyValidator, uniqueNameValidator(this.accountsService)],
      ],
      accountNumber: [
        null,
        [Validators.required, Validators.min(0), Validators.pattern(/^\d{1,6}$/)],
      ],
      accountType: ['internal', Validators.required],
    });
  }

  submit(): void {
    this.error.set(null);
    this.message.set(null);

    if (this.form.invalid) {
      this.error.set('Please fill in all fields.');
      this.form.markAllAsTouched();
      return;
    }

    const newAccount = {
      id: undefined as any,
      accountName: this.form.value.accountName,
      accountNumber: Number(this.form.value.accountNumber),
      accountType: this.form.value.accountType,
      balance: 0,
    };

    this.accountsService.addAccount(newAccount).subscribe({
      next: () => {
        this.message.set('Account successfully created!');
        this.form.reset({ accountType: 'internal' });
        this.router.navigate(['/accounts']);
      },
      error: () => this.error.set('Failed to create account.'),
    });
  }
}
