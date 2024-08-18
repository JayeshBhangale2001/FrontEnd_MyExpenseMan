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
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select'; // Import MatSelectModule
import { ExpenseService } from '../../expense.service';
import { Expense } from '../../models/expense.model';
import { ReusableTableComponent } from '../../reusable-table/reusable-table.component';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
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
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
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
  expensesList: Expense[] = [];

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const now = new Date();
    this.expenseForm = this.fb.group({
      month: [this.months[now.getMonth()], Validators.required],
      expenseType: ['', Validators.required],
      expenseAmount: ['', Validators.required],
      expenseDate: ['', Validators.required]
    });

    this.editForm = this.fb.group({
      id: [''],
      month: [this.months[now.getMonth()], Validators.required],
      expenseType: ['', Validators.required],
      expenseAmount: ['', Validators.required],
      expenseDate: ['', Validators.required]
    });

    this.fetchExpenses();
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

  fetchExpenses() {
    this.expenseService.getExpenses().subscribe(
      (expenses: Expense[]) => {
        this.expensesList = expenses.map(expense => ({
          ...expense,
          expenseDate: this.datePipe.transform(expense.expenseDate, 'short') || ''
        }));
      },
      (error) => {
        console.error('Error Fetching Expenses:', error);
      }
    );
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      const newExpense: Expense = this.expenseForm.value;
      this.expenseService.saveExpense(newExpense).subscribe(
        (savedExpense) => {
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
    }
  }

  onEdit(expense: Expense) {
    this.editingExpense = { ...expense };
    this.editForm.patchValue({
      ...this.editingExpense,
      expenseDate: new Date(this.editingExpense.expenseDate)
    });
    this.switchTab(2);
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
