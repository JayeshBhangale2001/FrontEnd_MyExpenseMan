import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SideNavComponent } from '../side-nav/side-nav.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatIconModule, SideNavComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  //Income
  lastMonthsIncome = ['January: $1000', 'February: $1500', 'March: $1200'];
  currentMonthIncome = '$2000';

  //Expense
  lastMonthsExpense = ['January: $800', 'February: $1000', 'March: $1200'];
  currentMonthExpense = '$1500';
 
  //Todo Trans
  todoTransactions = [
    { description: 'Pay electricity bill' },
    { description: 'Submit monthly report' },
    { description: 'Buy groceries' },
    { description: 'Call insurance company' }
  ];

  //Total
  totalCurrentMonthIncome = 2000;
  totalCurrentMonthExpense = 1500;
  savingsAccountBalance = 5000;
  checkingAccountBalance = 3000;
  investmentAccountBalance = 10000;

  constructor(public router: Router) { }

  onIncome() {
    this.router.navigate(['/budget-planner/income']);
  }
  onExpense() {
    this.router.navigate(['/budget-planner/expense']);
  }
  onTodo() {
    this.router.navigate(['/budget-planner/todo']);
  }
  onAccount() {
    this.router.navigate(['/budget-planner/accounts']);
  }

  onUserDefinedList() {
    this.router.navigate(['/budget-planner/user-defined-list']);
  }

  onInvestment() {
    this.router.navigate(['/budget-planner/investment']); // Corrected path
  }

  onBudget() {
    this.router.navigate(['/budget-planner/budget']); // Corrected path
  }

  onStatisticsClick() {
    this.router.navigate(['/budget-planner/spending-statistics']); // Corrected path
  }
  //Calculate Total
  get currentMonthSavings(): number {
    return this.totalCurrentMonthIncome - this.totalCurrentMonthExpense;
  }

}
