import { Component, EventEmitter, input, Input, output, Output } from '@angular/core';
import Account from '../../../shared/models/account.model';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-transfer-preview-component',
  imports: [DecimalPipe],
  templateUrl: './transfer-preview-component.html',
  styleUrl: './transfer-preview-component.scss',
})
export class TransferPreviewComponent {
  sourceAccount = input.required<Account>();
  destinationAccount = input.required<Account>();
  amount = input.required<number>();

  edit = output<void>();
  confirm = output<void>();
}
