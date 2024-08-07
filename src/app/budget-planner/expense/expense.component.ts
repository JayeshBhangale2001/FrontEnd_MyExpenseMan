import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
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
    ReusableTableComponent
  ],
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {
  expenseForm!: FormGroup;
  editForm!: FormGroup;
  selectedMonth: string;
  monthSelected: boolean = false;
  editingExpense: Expense | null = null;

  expenses: { [key: string]: Expense[] } = {
    January: [],
    February: [],
    March: [],
    April: [],
    May: [],
    June: [],
    July: [],
    August: [],
    September: [],
    October: [],
    November: [],
    December: []
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private expenseService: ExpenseService
  ) {
    const currentDate = new Date();
    this.selectedMonth = currentDate.toLocaleString('default', { month: 'long' });
    console.log('Initial Selected Month:', this.selectedMonth);
  }

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

  onChange(event: any) {
    this.selectedMonth = event.target.value;
    this.monthSelected = true;
    console.log('Month Changed:', this.selectedMonth);
  }

  calculateTotalExpense(month: string): number {
    const total = this.expenses[month]?.reduce((total, expense) => total += expense.expenseAmount, 0) || 0;
    console.log(`Total expense for ${month}:`, total);
    return total;
  }

  getFilteredExpenses(): Expense[] {
    const filteredExpenses = this.expenses[this.selectedMonth] || [];
    console.log('Filtered Expenses:', filteredExpenses);
    return filteredExpenses;
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      const newExpense: Expense = this.expenseForm.value;
      console.log('Submitting New Expense:', newExpense);
      this.expenseService.saveExpense(newExpense).subscribe(
        (savedExpense) => {
          console.log('Expense Saved:', savedExpense);
          this.expenses[this.selectedMonth].push(savedExpense);
          this.expenseForm.reset();
          this.expenseForm.patchValue({ month: '', expenseType: '', expenseAmount: '', date: '' });
        },
        (error) => {
          console.error('Error Saving Expense:', error);
        }
      );
    } else {
      console.warn('Expense Form is Invalid:', this.expenseForm.errors);
    }
  }

  onEdit(expense: Expense) {
    this.editingExpense = { ...expense };
    this.editForm.patchValue(this.editingExpense);
    console.log('Editing Expense:', this.editingExpense);
  }

  onSaveEdit() {
    if (this.editForm.valid) {
      const updatedExpense: Expense = this.editForm.value;
      console.log('Saving Edited Expense:', updatedExpense);
      this.expenseService.updateExpense(updatedExpense).subscribe(
        (savedExpense) => {
          console.log('Expense Updated:', savedExpense);
          const index = this.expenses[this.selectedMonth].findIndex(expense => expense.id === savedExpense.id);
          if (index !== -1) {
            this.expenses[this.selectedMonth][index] = savedExpense;
          }
          this.editingExpense = null;
          this.editForm.reset();
        },
        (error) => {
          console.error('Error Updating Expense:', error);
        }
      );
    } else {
      console.warn('Edit Form is Invalid:', this.editForm.errors);
    }
  }

  onDelete(expenseId: number | undefined) {
    if (expenseId !== undefined) {
      console.log('Deleting Expense ID:', expenseId);
      this.expenseService.deleteExpense(expenseId).subscribe(
        () => {
          console.log('Expense Deleted');
          this.expenses[this.selectedMonth] = this.expenses[this.selectedMonth].filter(expense => expense.id !== expenseId);
        },
        (error) => {
          console.error('Error Deleting Expense:', error);
        }
      );
    } else {
      console.error("Expense ID is undefined");
    }
  }

  cancelEdit() {
    this.editingExpense = null;
    this.editForm.reset();
    console.log('Edit Canceled');
  }

  fetchExpenses() {
    console.log('Fetching Expenses...');
    this.expenseService.getExpenses().subscribe(
      (expenses: Expense[]) => {
        console.log('Fetched Expenses:', expenses);
        expenses.forEach(expense => {
          if (!this.expenses[expense.month]) {
            this.expenses[expense.month] = [];
          }
          this.expenses[expense.month].push(expense);
        });
        console.log('Expenses after Fetch:', this.expenses);
      },
      (error) => {
        console.error('Error Fetching Expenses:', error);
      }
    );
  }

  saveForm() {
    console.log('Form saved!');
  }

  onBack() {
    console.log('Navigating back to dashboard...');
    this.router.navigate(['/budget-planner/dashboard']);
  }
}
