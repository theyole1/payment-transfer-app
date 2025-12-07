import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsListComponent } from './accounts-list-component';
import { AccountsService } from '../../services/accounts.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('AccountsListComponent', () => {
  let component: AccountsListComponent;
  let fixture: ComponentFixture<AccountsListComponent>;
  let mockAccountsService: jasmine.SpyObj<AccountsService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAccountsService = jasmine.createSpyObj('AccountsService', ['loadAccounts'], {
      accounts: of([
        { id: '1', accountName: 'A', accountType: 'internal', accountNumber: 123, balance: 100 },
        { id: '2', accountName: 'B', accountType: 'internal', accountNumber: 456, balance: 200 },
        { id: '3', accountName: 'C', accountType: 'internal', accountNumber: 789, balance: 300 },
        { id: '4', accountName: 'D', accountType: 'internal', accountNumber: 101, balance: 400 },
        { id: '5', accountName: 'E', accountType: 'external', accountNumber: 102, balance: 500 },
      ]),
    });
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [AccountsListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loadAccounts on ngOnInit', () => {
    mockAccountsService.loadAccounts.and.returnValue(of([]));
    spyOn(component, 'loadAccounts').and.callThrough();

    component.ngOnInit();

    expect(component.loadAccounts).toHaveBeenCalled();
    expect(mockAccountsService.loadAccounts).toHaveBeenCalled();
  });

  it('accountsList should show first 4 items if fullAccListPrevie', () => {
    component.fullAccListPreview = false as any;
    expect(component.accountsList().length).toBe(4);
  });

  it('accountsList should show all if fullAccListPreview', () => {
    component.fullAccListPreview = true as any;
    expect(component.accountsList().length).toBe(5);
  });

  it('should navigate on onAddAccount', () => {
    component.onAddAccount();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/add-account']);
  });
});
