import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ExpenseService } from '../../expense.service';
import { Expense } from '../../models/expense.model';

@Component({
  selector: 'app-expense',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
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
  }

  ngOnInit(): void {
    this.expenseForm = this.fb.group({
      month: ['', Validators.required],
      expenseType: ['', Validators.required],
      expenseAmount: ['', Validators.required],
      date: ['', Validators.required]  // Add this line
    });
  
    this.editForm = this.fb.group({
      id: [''],
      month: ['', Validators.required],
      expenseType: ['', Validators.required],
      expenseAmount: ['', Validators.required],
      date: ['', Validators.required]  // Add this line
    });
  
    this.fetchExpenses();
  }

  onChange(event: any) {
    this.selectedMonth = event.target.value;
    this.monthSelected = true;
  }

  calculateTotalExpense(month: string): number {
    return this.expenses[month]?.reduce((total, expense) => total += expense.expenseAmount, 0) || 0;
  }

  getFilteredExpenses(): Expense[] {
    return this.expenses[this.selectedMonth] || [];
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      const newExpense: Expense = this.expenseForm.value;
      this.expenseService.saveExpense(newExpense).subscribe((savedExpense) => {
        this.expenses[this.selectedMonth].push(savedExpense);
        this.expenseForm.reset();
        this.expenseForm.patchValue({ month: '', expenseType: '', expenseAmount: '', date: '' });
      });
    }
  }

  onEdit(expense: Expense) {
    this.editingExpense = { ...expense };
    this.editForm.patchValue(this.editingExpense);
  }
  
  onSaveEdit() {
    if (this.editForm.valid) {
      const updatedExpense: Expense = this.editForm.value;
      this.expenseService.updateExpense(updatedExpense).subscribe((savedExpense) => {
        const index = this.expenses[this.selectedMonth].findIndex(expense => expense.id === savedExpense.id);
        if (index !== -1) {
          this.expenses[this.selectedMonth][index] = savedExpense;
        }
        this.editingExpense = null;
        this.editForm.reset();
      });
    }
  }

  onDelete(expenseId: number | undefined) {
    if (expenseId !== undefined) {
      this.expenseService.deleteExpense(expenseId).subscribe(() => {
        this.expenses[this.selectedMonth] = this.expenses[this.selectedMonth].filter(expense => expense.id !== expenseId);
      });
    } else {
      console.error("Expense ID is undefined");
    }
  }

  cancelEdit() {
    this.editingExpense = null;
    this.editForm.reset();
  }

  fetchExpenses() {
    this.expenseService.getExpenses().subscribe((expenses: Expense[]) => {
      expenses.forEach(expense => {
        if (!this.expenses[expense.month]) {
          this.expenses[expense.month] = [];
        }
        this.expenses[expense.month].push(expense);
      });
    });
  }

  saveForm() {
    console.log('Form saved!');
  }

  onBack() {
    this.router.navigate(['/budget-planner/dashboard']);
  }
}
