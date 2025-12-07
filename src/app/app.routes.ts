import { Routes } from '@angular/router';
import { TransferFormComponent } from './features/transfer/transfer-form-component/transfer-form-component';
import { AddAccountForm } from './features/accounts/add-account-form/add-account-form';
import { DashboardComponent } from './features/dashboard/dashboard-component/dashboard-component';
import { NotFound } from './components/not-found/not-found';
import { TransactionsComponent } from './features/transactions/transactions-component/transactions-component';
import { AccoutsComponent } from './features/accounts/accouts-component/accouts-component';

export const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: DashboardComponent },
      { path: 'accounts', component: AccoutsComponent },
      { path: 'transfer', component: TransferFormComponent },
      { path: 'history', component: TransactionsComponent },
      { path: 'add-account', component: AddAccountForm },
      { path: '**', component: NotFound },
    ],
  },
];
