import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'; // Import MatSelectModule
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { AccountService } from '../../account.service'; // Import AccountService
import { ExpenseService } from '../../expense.service';
import { Account } from '../../models/account.model'; // Import Account model
import { Expense, PartialExpense } from '../../models/expense.model';
import { ReusableTableComponent } from '../../reusable-table/reusable-table.component';
@Component({
  selector: 'app-expense',
  standalone: true,
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
    NgxMatDatetimePickerModule,
    NgxMatNativeDateModule,
    MatSelectModule 
     
  ],
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
  providers: [DatePipe]
})
export class ExpenseComponent implements OnInit {
  accounts: Account[] = []; 
  dateOptions = [
    { label: 'Today', value: 'today' },
    { label: 'Tomorrow', value: 'tomorrow' },
    { label: 'Yesterday', value: 'yesterday' },
    { label: 'Day After Tomorrow', value: 'dayAfterTomorrow' }
  ]; // Add this property
  currentMonth: string = ''; // Initialize with an empty string
  expenseForm!: FormGroup;
  editForm!: FormGroup;
  currentTab: number = 0;
  editingExpense: Expense | null = null;
  expensesList: PartialExpense[] = [];
  displayedColumns: string[] = ['Account Name', 'Expense Type', 'Expense Amount', 'Expense Date'];
  transformedAccountsList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private accountService: AccountService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadAccounts(); 
    const now = new Date();
    this.expenseForm = this.fb.group({
      account: [null, Validators.required], 
      expenseType: ['', Validators.required],
      expenseAmount: ['', Validators.required],
      expenseDate: [now, Validators.required] // Use Date object
    });

    this.editForm = this.fb.group({
      id: [''],
      account: [null, Validators.required], // Ensure account control is correctly initialized
      expenseType: ['', Validators.required],
      expenseAmount: ['', Validators.required],
      expenseDate: [new Date(), Validators.required] // Ensure the date control is initialized correctly
    });
    

    this.fetchExpenses();
  }

  loadAccounts(): void {
    this.accountService.getAccounts().subscribe(
      (accounts: Account[]) => {
        this.accounts = accounts;
      },
      (error) => {
        console.error('Error Fetching Accounts:', error);
      }
    );
  }

  onDateOptionChange(option: string) {
    let date: Date;
    switch (option) {
      case 'today':
        date = new Date();
        break;
      case 'tomorrow':
        date = new Date();
        date.setDate(date.getDate() + 1);
        break;
      case 'yesterday':
        date = new Date();
        date.setDate(date.getDate() - 1);
        break;
      case 'dayAfterTomorrow':
        date = new Date();
        date.setDate(date.getDate() + 2);
        break;
      default:
        date = new Date();
    }

    this.expenseForm.get('expenseDate')?.setValue(date);
    this.editForm.get('expenseDate')?.setValue(date);
  }

  switchTab(tabIndex: number) {
    this.currentTab = tabIndex;
    if (tabIndex === 1) {
      this.fetchExpenses();
    }
  }

  // columnMap = {
  //   'Account Name': 'account.accountName',
  //   'Expense Type': 'expenseType',
  //   'Expense Amount': 'expenseAmount',
  //   'Expense Date': 'expenseDate'
  // };

  // displayedColumns = Object.keys(this.columnMap); 

  fetchExpenses() {
    this.expenseService.getExpenses().subscribe(
      (expenses: Expense[]) => {
        console.log('Raw expenses from backend:', expenses);
  
        this.expensesList = expenses.map(expense => ({
          ...expense,
          expenseDate: this.datePipe.transform(expense.expenseDate, 'short') || ''
        }));
        console.log('Mapped expenses for frontend:', this.expensesList);
        this.transformedAccountsList = this.transformAccountsList(expenses);
        console.log('Mapped transformedAccountsList for frontend:', this.transformedAccountsList);
      },
      (error) => {
        console.error('Error Fetching Expenses:', error);
      }
    );
  }
  

  // private transformAccountsList(expenses: Expense[]): any[] {
  //   return expenses.map(expense => ({
  //     'Account Name': expense.account ? expense.account.accountName : 'N/A', // Handle null account
  //   'Expense Type': expense.expenseType,
  //   'Expense Amount': expense.expenseAmount,
  //   'Expense Date': expense.expenseDate
  //   }));
  // }


  private transformAccountsList(expenses: Expense[]): any[] {
    return expenses.map(expense => ({
      'id': expense.id,
      'Account Name': expense.account ? expense.account.accountName : 'N/A',
      'Expense Type': expense.expenseType,
      'Expense Amount': expense.expenseAmount,
      'Expense Date': expense.expenseDate ? this.datePipe.transform(expense.expenseDate, 'short') : ''
    }));
  }
  
  onSubmit() {
    if (this.expenseForm.valid) {
      const formValues = this.expenseForm.value;

      const newExpense: PartialExpense = {
        accountId: formValues.account.id,
        expenseType: formValues.expenseType,
        expenseAmount: formValues.expenseAmount,
        expenseDate: new Date(formValues.expenseDate).toISOString() 
      };

      console.log('Data being sent to the backend:', newExpense);

      this.expenseService.saveExpense(newExpense).subscribe(
        (savedExpense) => {
          console.log('Saved expense response:', savedExpense);

          this.expensesList.push({
            ...savedExpense,
            expenseDate: this.datePipe.transform(savedExpense.expenseDate, 'short') || ''
          });
          this.expenseForm.reset();
          this.switchTab(1);
        },
        (error) => {
          console.error('Error Saving Expense:', error);
        }
      );
    } else {
      console.log('Form is invalid:', this.expenseForm.errors);
    }
  }

  onEdit(expense: any): void {
    console.log('Incoming expense object:', expense);
  
    if (this.accounts.length === 0) {
      console.error('Accounts list is empty. onEdit called too early?');
      return;
    }
  
    const account = this.accounts.find(acc => acc.accountName === expense['Account Name']) || null;
    console.log('Found account object:', account);
  
    const expenseDate = new Date(expense['Expense Date']);
    if (isNaN(expenseDate.getTime())) {
      console.error('Expense date is invalid:', expense['Expense Date']);
    } else {
      console.log('Converted expenseDate:', expenseDate);
    }
  
    console.log('Edit form before patching:', this.editForm.value);
  
    this.editForm.patchValue({
      id: expense.id,
      account: account,
      expenseType: expense['Expense Type'],
      expenseAmount: expense['Expense Amount'],
      expenseDate: expenseDate // Use the correctly parsed Date object
    });
  
    console.log('Edit form after patching:', this.editForm.value);
  
    this.editingExpense = {
      id: expense.id,
      account: account,
      expenseType: expense['Expense Type'],
      expenseAmount: expense['Expense Amount'],
      expenseDate: expenseDate
    } as Expense;
  
    console.log('Stored editingExpense:', this.editingExpense);
  
    this.switchTab(2);
    console.log('Switched to Edit Expense tab.');
  }
  
  
  

  
  

  onSaveEdit() {
    if (this.editForm.valid) {
      const updatedExpense: Expense = this.editForm.value;
      this.expenseService.updateExpense(updatedExpense).subscribe(
        (savedExpense) => {
          const index = this.expensesList.findIndex(expense => expense.id === savedExpense.id);
          if (index !== -1) {
            this.expensesList[index] = {
              ...savedExpense,
              expenseDate: this.datePipe.transform(savedExpense.expenseDate, 'short') || ''
            };
          }
          this.editingExpense = null;
          this.editForm.reset();
          this.switchTab(1);
        },
        (error) => {
          console.error('Error Updating Expense:', error);
        }
      );
    }
  }

  onDelete(expenseId: number) {
    this.expenseService.deleteExpense(expenseId).subscribe(
      () => {
        this.expensesList = this.expensesList.filter(expense => expense.id !== expenseId);
      },
      (error) => {
        console.error('Error Deleting Expense:', error);
      }
    );
  }

  cancelEdit() {
    this.editingExpense = null;
    this.switchTab(1);
  }
}
