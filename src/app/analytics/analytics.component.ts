import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../analytics.service';
import { Expense } from '../models/expense.model';
import { ChartData, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  totalExpense: number = 0;
  minExpense: number = 0;
  maxExpense: number = 0;
  expensesByMonth: ChartData<'bar'> = { labels: [], datasets: [] };
  expensesByDay: ChartData<'line'> = { labels: [], datasets: [] };
  expensesByYear: ChartData<'pie'> = { labels: [], datasets: [] };
  expensesByType: ChartData<'doughnut'> = { labels: [], datasets: [] };

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    // Assume expenses are fetched from a service or other source
    const expenses: Expense[] = []; // Replace with actual expense data

    this.totalExpense = this.analyticsService.getTotalExpense(expenses);
    this.minExpense = this.analyticsService.getMinExpense(expenses);
    this.maxExpense = this.analyticsService.getMaxExpense(expenses);

    this.setExpensesByMonth(expenses);
    this.setExpensesByDay(expenses);
    this.setExpensesByYear(expenses);
    this.setExpensesByType(expenses);
  }

  setExpensesByMonth(expenses: Expense[]): void {
    const data = this.analyticsService.getExpensesByMonth(expenses);
    this.expensesByMonth = {
      labels: Object.keys(data),
      datasets: [{ data: Object.values(data), label: 'Expenses by Month' }]
    };
  }

  setExpensesByDay(expenses: Expense[]): void {
    const data = this.analyticsService.getExpensesByDay(expenses);
    this.expensesByDay = {
      labels: Object.keys(data),
      datasets: [{ data: Object.values(data), label: 'Expenses by Day' }]
    };
  }

  setExpensesByYear(expenses: Expense[]): void {
    const data = this.analyticsService.getExpensesByYear(expenses);
    this.expensesByYear = {
      labels: Object.keys(data),
      datasets: [{ data: Object.values(data), label: 'Expenses by Year' }]
    };
  }

  setExpensesByType(expenses: Expense[]): void {
    const data = this.analyticsService.getExpensesByType(expenses);
    this.expensesByType = {
      labels: Object.keys(data),
      datasets: [{ data: Object.values(data), label: 'Expenses by Type' }]
    };
  }
}
