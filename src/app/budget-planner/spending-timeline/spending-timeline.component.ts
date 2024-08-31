import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-spending-timeline',
  templateUrl: './spending-timeline.component.html',
  styleUrls: ['./spending-timeline.component.scss']
})
export class SpendingTimelineComponent {
  @Input() timelineOptions: string[] = [];
  @Input() selectedTimeline: string = '';
  @Output() timelineChange = new EventEmitter<{ timeline: string, dateRange: [string, string] }>();

  selectTimeline(timeline: string) {
    const dateRange = this.getDateRange(timeline);
    this.timelineChange.emit({ timeline, dateRange });
  }

  private getDateRange(timeline: string): [string, string] {
    const endDate = new Date();
    const startDate = new Date();
    
    switch (timeline) {
      case '7D':
        startDate.setDate(endDate.getDate() - 6);
        break;
      case '30D':
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case '12W':
        startDate.setDate(endDate.getDate() - 84); // Approx. 12 weeks
        break;
      case '6M':
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case '1Y':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        break;
    }
    
    return [startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]]; // Format as YYYY-MM-DD
  }
}
