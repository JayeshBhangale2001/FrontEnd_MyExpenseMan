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
  incomeForm!: FormGroup;
  editForm!: FormGroup;
  selectedMonth: string;
  monthSelected: boolean = false;
  editingIncome: Income | null = null;

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
    this.incomeForm = this.fb.group({
      month: ['', Validators.required],
      source: ['', Validators.required],
      amount: ['', Validators.required],
      investments: ['', Validators.required],
      date: ['', Validators.required]  // Add this line
    });
  
    this.editForm = this.fb.group({
      id: [''],
      month: ['', Validators.required],
      source: ['', Validators.required],
      amount: ['', Validators.required],
      investments: ['', Validators.required],
      date: ['', Validators.required]  // Add this line
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
        this.incomeForm.patchValue({ month: '', source: '', amount: '', investments: '', date: '' });
      });
    }
  }

  onEdit(income: Income) {
    this.editingIncome = { ...income };
    this.editForm.patchValue(this.editingIncome);
  }
  
  onSaveEdit() {
    if (this.editForm.valid) {
      const updatedIncome: Income = this.editForm.value;
      this.incomeService.updateIncome(updatedIncome).subscribe((savedIncome) => {
        const index = this.incomes[this.selectedMonth].findIndex(income => income.id === savedIncome.id);
        if (index !== -1) {
          this.incomes[this.selectedMonth][index] = savedIncome;
        }
        this.editingIncome = null;
        this.editForm.reset();
      });
    }
  }

  onDelete(incomeId: number | undefined) {
    if (incomeId !== undefined) {
      this.incomeService.deleteIncome(incomeId).subscribe(() => {
        this.incomes[this.selectedMonth] = this.incomes[this.selectedMonth].filter(income => income.id !== incomeId);
      });
    } else {
      console.error("Income ID is undefined");
    }
  }

  cancelEdit() {
    this.editingIncome = null;
    this.editForm.reset();
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
