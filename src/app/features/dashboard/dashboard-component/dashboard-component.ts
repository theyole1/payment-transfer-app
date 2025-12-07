import { Component } from '@angular/core';
import { AccountsListComponent } from '../../../components/accounts-list-component/accounts-list-component';
import { BannerComponent } from '../../../components/banner-component/banner-component';
import { TransactionsListComponent } from '../../transactions/transactions-list-component/transactions-list-component';

@Component({
  selector: 'app-dashboard-component',
  imports: [AccountsListComponent, BannerComponent, TransactionsListComponent],
  templateUrl: './dashboard-component.html',
  styleUrl: './dashboard-component.scss',
})
export class DashboardComponent {}
