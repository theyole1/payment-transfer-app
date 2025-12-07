import { Component, computed, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountsService } from '../../services/accounts.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-banner-component',
  imports: [DecimalPipe ],
  templateUrl: './banner-component.html',
  styleUrl: './banner-component.scss',
})
export class BannerComponent {
  private accountService = inject(AccountsService);
  private router = inject(Router);

  totalBalance = this.accountService.totalBalance;

  onTransfer() {
    this.router.navigate(['/transfer']);
  }

  onViewHistory() {
    this.router.navigate(['/history']);
  }
}
