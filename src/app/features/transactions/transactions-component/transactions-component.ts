import { Component } from '@angular/core';
import { TransactionsListComponent } from '../transactions-list-component/transactions-list-component';
import { AccountsListComponent } from "../../../components/accounts-list-component/accounts-list-component";

@Component({
  selector: 'app-transactions-component',
  imports: [TransactionsListComponent],
  templateUrl: './transactions-component.html',
  styleUrl: './transactions-component.scss',
})
export class TransactionsComponent {

}
