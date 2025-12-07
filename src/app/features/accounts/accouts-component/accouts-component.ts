import { Component, inject } from '@angular/core';
import { AccountCardComponent } from '../../../components/account-card-component/account-card-component';
import { AccountsListComponent } from '../../../components/accounts-list-component/accounts-list-component';
import { Router } from '@angular/router';
import { BannerComponent } from '../../../components/banner-component/banner-component';

@Component({
  selector: 'app-accouts-component',
  imports: [ AccountsListComponent, BannerComponent],
  templateUrl: './accouts-component.html',
  styleUrl: './accouts-component.scss',
})
export class AccoutsComponent {
  private router = inject(Router);
  onAddAccount() {
    this.router.navigate(['/add-account']);
  }
}
