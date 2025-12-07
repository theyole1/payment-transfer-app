import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountCardComponent } from './account-card-component';
import { AccountsService } from '../../services/accounts.service';
import { of } from 'rxjs';

describe('AccountCardComponent', () => {
  let component: AccountCardComponent;
  let fixture: ComponentFixture<AccountCardComponent>;
  let mockAccountsService: jasmine.SpyObj<AccountsService>;

  beforeEach(async () => {
    mockAccountsService = jasmine.createSpyObj('AccountsService', ['deleteAccount']);

    await TestBed.configureTestingModule({
      imports: [AccountCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call deleteAccount when user confirms', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    mockAccountsService.deleteAccount.and.returnValue(of({}));

    component.onDelete('123');

    expect(mockAccountsService.deleteAccount).toHaveBeenCalledWith('123');
  });

  it('should NOT call deleteAccount when user cancels', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.onDelete('123');

    expect(mockAccountsService.deleteAccount).not.toHaveBeenCalled();
  });
});
