import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon'; // Import MatIconModule
interface Budget {
  name: string;
  amount: number;
  currency: string;
  period?: string;
  spent?: number;
}

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, DecimalPipe, CommonModule, MatIconModule]
})
export class BudgetComponent {
  budgets = [
    { name: 'Food', amount: 1000, currency: 'INR', spent: 800 },
    { name: 'Transport', amount: 500, currency: 'INR', spent: 300 },
    // Add more budget data as needed
  ];

  currencies = ['INR', 'USD', 'EUR'];
  periods = ['Monthly', 'Weekly', 'Yearly'];

  selectedBudget: any = null;
  isCreatingNewBudget = false;

  budgetForm = {
    name: '',
    amount: 0,
    currency: 'INR',
    period: 'Monthly'
  };

  getProgress(budget: any): number {
    return (budget.spent / budget.amount) * 100;
  }

  isOverBudget(budget: any): boolean {
    return budget.spent > budget.amount;
  }

  getRemainingAmount(budget: any): number {
    return budget.amount - budget.spent;
  }

  selectBudget(budget: any): void {
    this.selectedBudget = budget;
    this.isCreatingNewBudget = false;
    this.populateBudgetForm(budget);
  }

  editBudget(event: MouseEvent, budget: any): void {
    event.stopPropagation();
    this.selectBudget(budget);
  }

  createNewBudget(): void {
    this.isCreatingNewBudget = true;
    this.selectedBudget = null;
    this.budgetForm = {
      name: '',
      amount: 0,
      currency: 'INR',
      period: 'Monthly'
    };
  }

  populateBudgetForm(budget: any): void {
    this.budgetForm = {
      name: budget.name,
      amount: budget.amount,
      currency: budget.currency,
      period: budget.period || 'Monthly'
    };
  }

  saveBudget(): void {
    if (this.isCreatingNewBudget) {
      this.budgets.push({ ...this.budgetForm, spent: 0 });
    } else if (this.selectedBudget) {
      this.selectedBudget.name = this.budgetForm.name;
      this.selectedBudget.amount = this.budgetForm.amount;
      this.selectedBudget.currency = this.budgetForm.currency;
      this.selectedBudget.period = this.budgetForm.period;
    }

    this.resetForm();
  }

  resetForm(): void {
    this.selectedBudget = null;
    this.isCreatingNewBudget = false;
    this.budgetForm = {
      name: '',
      amount: 0,
      currency: 'INR',
      period: 'Monthly'
    };
  }
}