import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { AccountService } from '../../account.service';
import { Account } from '../../models/account.model';
import { ReusableTableComponent } from '../reusable-table/reusable-table.component';

@Component({
  selector: 'app-account',
  standalone: true, // Ensure standalone if using Angular Standalone Components
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    ReusableTableComponent,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule ,
    MatIconModule
  ],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  providers: [DatePipe]
})
export class AccountComponent implements OnInit {
  accountTypes: string[] = ['Saving', 'Investment', 'Loan', 'Credit'];
  displayedColumns: string[] = ['Account Name', 'Account Type', 'Account Address','Initial Balance', 'Current Balance', 'Notes'];
  transformedAccountsList: any[] = [];
  accountForm!: FormGroup;
  editForm!: FormGroup;
  currentTab: number = 0;
  showDetails: boolean = false;
  editingAccount: Account | null = null;
  accountsList: Account[] = [];

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.fetchAccounts();
  }

  private initializeForms(): void {
    this.accountForm = this.fb.group({
      accountName: ['', Validators.required],
      accountDetails: ['', Validators.required],
      accountType: ['', Validators.required],
      accountAddress: ['', Validators.required],
      initialBalance: ['', Validators.required],
      currentBalance: ['', Validators.required],
      notes: ['']
    });

    this.editForm = this.fb.group({
      id: [''],
      accountName: ['', Validators.required],
      accountDetails: ['', Validators.required],
      accountType: ['', Validators.required],
      accountAddress: ['', Validators.required],
      initialBalance: ['', Validators.required],
      currentBalance: ['', Validators.required],
      notes: ['']
    });
  }

  toggleShowDetails(): void {
    this.showDetails = !this.showDetails;
  }

  switchTab(tabIndex: number): void {
    this.currentTab = tabIndex;
    if (tabIndex === 1) {
      this.fetchAccounts(); // Fetch accounts when the 'Account Transactions' tab is selected
    }
  }

  fetchAccounts(): void {
    this.accountService.getAccounts().subscribe(
      (accounts: Account[]) => {
        this.accountsList = accounts;
        this.transformedAccountsList = this.transformAccountsList(accounts); // Store transformed data
      },
      (error) => console.error('Error Fetching Accounts:', error)
    );
  }

  private transformAccountsList(accounts: Account[]): any[] {
    return accounts.map(account => ({
      'id': account.id,
      'Account Name': account.accountName,
      'Account Type': account.accountType,
      'Account Address': account.accountAddress,
      'Account Details': account.accountDetails,
      'Initial Balance': account.initialBalance,
      'Current Balance': account.currentBalance,
      'Notes': account.notes
    }));
  }

  onSubmit(): void {
    if (this.accountForm.valid) {
      const newAccount: Account = this.accountForm.value;
      this.accountService.saveAccount(newAccount).subscribe(
        (savedAccount) => {
          this.accountsList = [...this.accountsList, savedAccount];
          this.transformedAccountsList = this.transformAccountsList(this.accountsList); // Update transformed list
          this.accountForm.reset();
          this.switchTab(1); // Switch to the 'Account Transactions' tab
        },
        (error) => console.error('Error Saving Account:', error)
      );
    }
  }

  onEdit(account: any): void {
    console.log('Editing Account:', account);
  
    // Transform the data to match the form control names
    const transformedData = {
      id: account.id || '', // Ensure this field exists
      accountName: account['Account Name'] || '', // Map 'Account Name' to 'accountName'
      accountDetails: account['Account Details'] || '', // Map 'Account Details' to 'accountDetails'
      accountType: account['Account Type'] || '', // Map 'Account Type' to 'accountType'
      accountAddress: account['Account Address'] || '', // Map 'Account Address' to 'accountAddress'
      initialBalance: account['Initial Balance'] || '', // Map 'Initial Balance' to 'initialBalance'
      currentBalance: account['Current Balance'] || '', // Map 'Current Balance' to 'currentBalance'
      notes: account['Notes'] || '' // Map 'Notes' to 'notes'
    };
  
    // Populate the editForm with the transformed data
    this.editForm.patchValue(transformedData);
  
    console.log('Edit Form Value After Patch:', this.editForm.value);
  
    // Switch to the 'Edit Account' tab
    this.switchTab(2);
  }
  
  
  
  
  


  onSaveEdit(): void {
    if (this.editForm.valid) {
      const updatedAccount: Account = this.editForm.value;
      this.accountService.updateAccount(updatedAccount).subscribe(
        (savedAccount) => {
          const index = this.accountsList.findIndex(account => account.id === savedAccount.id);
          if (index !== -1) {
            this.accountsList[index] = savedAccount;
            this.transformedAccountsList = this.transformAccountsList(this.accountsList); // Update transformed list
          }
          this.editingAccount = null;
          this.switchTab(1); // Switch to the 'Account Transactions' tab
        },
        (error) => console.error('Error Updating Account:', error)
      );
    }
  }

  onDelete(accountId: number): void {
    console.log('Deleting Account with ID:', accountId); // Add this line
    this.accountService.deleteAccount(accountId).subscribe(
      () => {
        this.accountsList = this.accountsList.filter(account => account.id !== accountId);
        this.transformedAccountsList = this.transformAccountsList(this.accountsList); // Update transformed list
      },
      (error) => console.error('Error Deleting Account:', error)
    );
  }
  

  cancelEdit(): void {
    this.editingAccount = null;
    this.switchTab(1); // Switch to the 'Account Transactions' tab
  }
}