import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../expense.service';
import { ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-spending-statistics',
  templateUrl: './spending-statistics.component.html',
  styleUrls: ['./spending-statistics.component.scss'],
  providers: [DatePipe] // Ensure DatePipe is provided here
 
})
export class SpendingStatisticsComponent implements OnInit {
  categoriesData: any = {}; // This will hold the data for categories
  trendData: any = {}; // This will hold the data for the trend
  timelineOptions = ['7D', '30D', '12W', '6M', '1Y'];
  selectedTimeline = '7D';
  startDate: Date = new Date();
  endDate: Date = new Date();
  popupData: any[] = []; // Make sure this is declared
  displayedColumns: string[] = []; // Make sure this is declared
  showPopup = false; // Make sure this is declared


  constructor(private expenseService: ExpenseService, private cdr: ChangeDetectorRef, private datePipe: DatePipe ) {}

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

  onCategoryClick(categoryName: string): void {
    console.log('Category clicked:', categoryName);
    
    this.expenseService.getDetailedCategoryData(categoryName, this.selectedTimeline, this.startDate, this.endDate)
      .subscribe(detailedData => {
        console.log('Detailed category data:', detailedData);
        this.popupData = this.transformData(detailedData);
        this.displayedColumns = ['id', 'accountName', 'expenseType', 'expenseAmount', 'expenseDate']; // Adjust as needed
        this.showPopup = true;
        this.cdr.detectChanges();
      }, error => {
        console.error('Error fetching detailed category data:', error);
      });
  }

  onTrendClick(date: string): void {
    console.log('Trend clicked:', date);
    
    this.expenseService.getDetailedTrendData(date)
      .subscribe(detailedData => {
        console.log('Detailed trend data:', detailedData);
        this.popupData = this.transformData(detailedData);
        this.displayedColumns = ['id', 'accountName', 'expenseType', 'expenseAmount', 'expenseDate']; // Adjust as needed
        this.showPopup = true;
        this.cdr.detectChanges();
      }, error => {
        console.error('Error fetching detailed trend data:', error);
      });
  }

  closePopup(): void {
    this.showPopup = false;
    this.cdr.detectChanges();
    this.popupData = [];
  }

  private transformData(data: any[]): any[] {
    return data.map(item => ({
      id: item.id || 0,
      accountName: item.account?.accountName || '',
      expenseType: item.expenseType || '',
      expenseAmount: item.expenseAmount || 0,
      expenseDate: this.datePipe.transform(item.expenseDate, 'yyyy-MM-dd') || '' // Format date
    }));
  }

}
