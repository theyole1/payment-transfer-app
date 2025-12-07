import { AbstractControl, ValidationErrors } from '@angular/forms';
import { AccountsService } from '../../../services/accounts.service';
import Account from '../../models/account.model';

export function uniqueNameValidator(accountsService: AccountsService) {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value?.toString().trim();
    if (!value) return null;

    const existing = accountsService
      .accounts()
      .find((acc: Account) => acc.accountName.toLowerCase() === value.toLowerCase());

    return existing ? { nameTaken: true } : null;
  };
}
