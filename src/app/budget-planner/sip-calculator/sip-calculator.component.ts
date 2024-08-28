import { Component, OnInit } from '@angular/core';
import { NgIf, NgFor, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sip-calculator',
  templateUrl: './sip-calculator.component.html',
  styleUrls: ['./sip-calculator.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, FormsModule, DecimalPipe, CommonModule]
})
export class SipCalculatorComponent implements OnInit {
  selectedOption: string = 'SIP';
  isSIP = true;
  monthlyInvestment = 25000;  // Default monthly SIP amount
  lumpsumInvestment = 1000000;  // Default lumpsum amount
  returnRate = 25;  // Default annual return rate
  timePeriod = 25;  // Default investment period in years
  investmentAmount = this.monthlyInvestment;  // Holds the current investment amount based on selected option
  breakdown: BreakdownItem[] = [];
  chart: any;

  ngOnInit() {
    this.calculateBreakdown();
    this.renderChart();
  }

  onInputChange() {
    if (this.isSIP) {
      this.monthlyInvestment = this.investmentAmount;
    } else {
      this.lumpsumInvestment = this.investmentAmount;
    }
    this.calculateBreakdown();
    this.updateChart();
  }

  get investedAmount(): number {
    return this.isSIP ? this.monthlyInvestment * this.timePeriod * 12 : this.lumpsumInvestment;
  }

  get estimatedReturns(): number {
    return this.isSIP ? this.calculateSIPReturns() : this.calculateLumpsumReturns();
  }

  get totalValue(): number {
    return this.investedAmount + this.estimatedReturns;
  }

  switchToSIP() {
    this.isSIP = true;
    this.selectedOption = 'SIP';
    this.investmentAmount = this.monthlyInvestment;
    this.calculateBreakdown();
    this.updateChart();
  }

  switchToLumpsum() {
    this.isSIP = false;
    this.selectedOption = 'Lumpsum';
    this.investmentAmount = this.lumpsumInvestment;
    this.calculateBreakdown();
    this.updateChart();
  }

  calculateBreakdown() {
    this.breakdown = [];
    if (this.isSIP) {
      let currentAmount = 0;
      let totalInvested = 0;
      for (let year = 1; year <= this.timePeriod; year++) {
        totalInvested += this.monthlyInvestment * 12;
        currentAmount = 0;
        // Calculate future value of each monthly installment
        for (let month = 1; month <= year * 12; month++) {
          currentAmount += this.monthlyInvestment * ((1 + this.returnRate / 1200) ** (this.timePeriod * 12 - month + 1));
        }
        const yearReturns = currentAmount - totalInvested;

        this.breakdown.push({
          investedAmount: Math.round(totalInvested),
          estimatedReturns: Math.round(yearReturns),
          maturityValue: Math.round(currentAmount)
        });
      }
    } else {
      // For lumpsum calculation
      let cumulativeInvestment = this.lumpsumInvestment;
      let totalValue = this.lumpsumInvestment;
      for (let year = 1; year <= this.timePeriod; year++) {
        const yearReturns = totalValue * (this.returnRate / 100);
        totalValue += yearReturns;
        this.breakdown.push({
          investedAmount: Math.round(cumulativeInvestment),
          estimatedReturns: Math.round(yearReturns),
          maturityValue: Math.round(totalValue)
        });
      }
    }
  }

  calculateSIPReturns(): number {
    const monthlyRate = this.returnRate / 1200;
    const numberOfMonths = this.timePeriod * 12;
    const maturityAmount = this.monthlyInvestment * (((1 + monthlyRate) ** numberOfMonths - 1) / monthlyRate) * (1 + monthlyRate);
    return Math.round(maturityAmount - this.investedAmount);
  }

  calculateLumpsumReturns(): number {
    return Math.round(this.lumpsumInvestment * ((1 + this.returnRate / 100) ** this.timePeriod - 1));
  }

  renderChart() {
    Chart.register(...registerables);
    const canvas = document.getElementById('sipChart') as HTMLCanvasElement;

    this.chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: ['Invested amount', 'Est. returns'],
        datasets: [{
          data: [Math.round(this.investedAmount), Math.round(this.estimatedReturns)],
          backgroundColor: ['#C8E6C9', '#5C6BC0']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top'
          }
        }
      }
    });
  }

  updateChart() {
    if (this.chart) {
      this.chart.data.datasets[0].data = [Math.round(this.investedAmount), Math.round(this.estimatedReturns)];
      this.chart.update();
    }
  }
}

interface BreakdownItem {
  investedAmount: number;
  estimatedReturns: number;
  maturityValue: number;
}
