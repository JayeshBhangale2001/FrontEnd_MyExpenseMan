import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IncomeService } from '../../income.service';
import { Income } from '../../models/income.model';

@Component({
  selector: 'app-income',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss']
})
export class IncomeComponent implements OnInit {
  incomeForm!: FormGroup;  // Use definite assignment assertion
  selectedMonth: string;
  monthSelected: boolean = false;

  incomes: { [key: string]: Income[] } = {
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
    private incomeService: IncomeService
  ) {
    const currentDate = new Date();
    this.selectedMonth = currentDate.toLocaleString('default', { month: 'long' });
  }

  ngOnInit(): void {
    // Initialize the form group here
    this.incomeForm = this.fb.group({
      month: ['', Validators.required],
      source: ['', Validators.required],
      amount: ['', Validators.required],
      investments: ['', Validators.required]
    });

    this.fetchIncomes();
  }

  onChange(event: any) {
    this.selectedMonth = event.target.value;
    this.monthSelected = true;
  }

  calculateTotalIncome(month: string): number {
    return this.incomes[month]?.reduce((total, income) => total += income.amount, 0) || 0;
  }

  getFilteredIncomes(): Income[] {
    return this.incomes[this.selectedMonth] || [];
  }

  onSubmit() {
    if (this.incomeForm.valid) {
      const newIncome: Income = this.incomeForm.value;
      this.incomeService.saveIncome(newIncome).subscribe((savedIncome) => {
        this.incomes[this.selectedMonth].push(savedIncome);
        this.incomeForm.reset();
        this.incomeForm.patchValue({ month: '', source: '', amount: '', investments: '' });
      });
    }
  }

  fetchIncomes() {
    this.incomeService.getIncomes().subscribe((incomes: Income[]) => {
      incomes.forEach(income => {
        if (!this.incomes[income.month]) {
          this.incomes[income.month] = [];
        }
        this.incomes[income.month].push(income);
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
