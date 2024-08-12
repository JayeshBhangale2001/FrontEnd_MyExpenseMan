import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ExpenseService } from '../../expense.service';
import { Expense } from '../../models/expense.model';
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
    MatTabsModule, // Make sure MatTabsModule is imported
    ReusableTableComponent
  ],
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss'],
  providers: [DatePipe] // Add DatePipe to providers
})
export class ExpenseComponent implements OnInit {
  expenseForm!: FormGroup;
  editForm!: FormGroup;
  currentTab: string = 'add';
  editingExpense: Expense | null = null;
  expensesList: Expense[] = [];

  constructor(
    private fb: FormBuilder,
    private expenseService: ExpenseService,
    private datePipe: DatePipe // Inject DatePipe
  ) {}

  ngOnInit(): void {
    this.expenseForm = this.fb.group({
      month: ['', Validators.required],
      expenseType: ['', Validators.required],
      expenseAmount: ['', Validators.required],
      date: ['', Validators.required]
    });

    this.editForm = this.fb.group({
      id: [''],
      month: ['', Validators.required],
      expenseType: ['', Validators.required],
      expenseAmount: ['', Validators.required],
      date: ['', Validators.required]
    });

    this.fetchExpenses();
  }

  switchTab(tab: string) {
    this.currentTab = tab;
    if (tab === 'transactions') {
      this.fetchExpenses();
    }
  }

  fetchExpenses() {
    this.expenseService.getExpenses().subscribe(
      (expenses: Expense[]) => {
        this.expensesList = expenses.map(expense => ({
          ...expense,
          createdAt: this.datePipe.transform(expense.createdAt, 'short') || '' // Ensure createdAt is always a string
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
            createdAt: this.datePipe.transform(savedExpense.createdAt, 'short') || '' // Ensure createdAt is always a string
          });
          this.expenseForm.reset();
          this.switchTab('transactions');
        },
        (error) => {
          console.error('Error Saving Expense:', error);
        }
      );
    }
  }

  onEdit(expense: Expense) {
    this.editingExpense = { ...expense };
    this.editForm.patchValue(this.editingExpense);
    this.switchTab('edit');
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
              createdAt: this.datePipe.transform(savedExpense.createdAt, 'short') || '' // Ensure createdAt is always a string
            };
          }
          this.editingExpense = null;
          this.switchTab('transactions');
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
    this.switchTab('transactions');
  }
}
