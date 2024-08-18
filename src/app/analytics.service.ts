import { Injectable } from '@angular/core';
import { Expense } from './models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  constructor() {}

  // Calculate the total amount of expenses
  getTotalExpense(expenses: Expense[]): number {
    return expenses.reduce((total, expense) => total + expense.expenseAmount, 0);
  }

  // Find the minimum expense amount
  getMinExpense(expenses: Expense[]): number {
    return Math.min(...expenses.map(expense => expense.expenseAmount));
  }

  // Find the maximum expense amount
  getMaxExpense(expenses: Expense[]): number {
    return Math.max(...expenses.map(expense => expense.expenseAmount));
  }

  // Group expenses by month and calculate totals
  getExpensesByMonth(expenses: Expense[]): { [month: string]: number } {
    return expenses.reduce((acc, expense) => {
      const month = new Date(expense.expenseDate).toLocaleString('default', { month: 'long' });
      acc[month] = (acc[month] || 0) + expense.expenseAmount;
      return acc;
    }, {} as { [month: string]: number });
  }

  // Group expenses by day and calculate totals
  getExpensesByDay(expenses: Expense[]): { [day: string]: number } {
    return expenses.reduce((acc, expense) => {
      const day = new Date(expense.expenseDate).toLocaleDateString();
      acc[day] = (acc[day] || 0) + expense.expenseAmount;
      return acc;
    }, {} as { [day: string]: number });
  }

  // Group expenses by year and calculate totals
  getExpensesByYear(expenses: Expense[]): { [year: number]: number } {
    return expenses.reduce((acc, expense) => {
      const year = new Date(expense.expenseDate).getFullYear();
      acc[year] = (acc[year] || 0) + expense.expenseAmount;
      return acc;
    }, {} as { [year: number]: number });
  }

  // Group expenses by type and calculate totals
  getExpensesByType(expenses: Expense[]): { [type: string]: number } {
    return expenses.reduce((acc, expense) => {
      acc[expense.expenseType] = (acc[expense.expenseType] || 0) + expense.expenseAmount;
      return acc;
    }, {} as { [type: string]: number });
  }
}
