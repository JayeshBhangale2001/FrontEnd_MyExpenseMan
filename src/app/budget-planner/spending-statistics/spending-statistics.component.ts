import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../expense.service';

@Component({
  selector: 'app-spending-statistics',
  templateUrl: './spending-statistics.component.html',
  styleUrls: ['./spending-statistics.component.scss']
})
export class SpendingStatisticsComponent implements OnInit {
  categoriesData: any = {}; // This will hold the data for categories
  trendData: any = {}; // This will hold the data for the trend
  timelineOptions = ['7D', '30D', '12W', '6M', '1Y'];
  selectedTimeline = '7D';
  startDate: Date = new Date();
  endDate: Date = new Date();

  constructor(private expenseService: ExpenseService) {}

  ngOnInit(): void {
    console.log('SpendingStatisticsComponent initialized');
    this.fetchStatistics();
  }

  onTimelineChange({ timeline, dateRange }: { timeline: string, dateRange: [string, string] }) {
    console.log('Timeline change detected:', timeline, dateRange);
    this.selectedTimeline = timeline;
    this.startDate = new Date(dateRange[0]);
    this.endDate = new Date(dateRange[1]);
    this.fetchStatistics();
  }

  private fetchStatistics(): void {
    console.log('Fetching statistics with timeline:', this.selectedTimeline);
    this.expenseService.getExpenseStatistics(this.selectedTimeline, this.startDate, this.endDate)
      .subscribe(data => {
        console.log('Fetched statistics data:', data);
        this.trendData = data.trendData || {}; // Ensure default empty object
        this.categoriesData = {
          categoryData: data.categoryData || {},
          totalAmount: data.totalAmount || 0,
          topExpenses: data.topExpenses || []
        };
        console.log('Updated trendData:', this.trendData);
        console.log('Updated categoriesData:', this.categoriesData);
      }, error => {
        console.error('Error fetching statistics:', error);
      });
}
}
