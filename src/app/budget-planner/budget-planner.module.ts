import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { BudgetPlannerRoutingModule } from './budget-planner-routing.module';

// Components
import { NgxEchartsModule } from 'ngx-echarts'; // Import NgxEchartsModule
import { DataPopupComponent } from './data-popup/data-popup.component'; // Adjust the path accordingly
import { NatureOfSpendingComponent } from './nature-of-spending/nature-of-spending.component';
import { ReusableTableComponent } from './reusable-table/reusable-table.component'; // Import ReusableTableComponent
import { SpendingCategoriesLabelsComponent } from './spending-categories-labels/spending-categories-labels.component';
import { SpendingStatisticsComponent } from './spending-statistics/spending-statistics.component';
import { SpendingTimelineComponent } from './spending-timeline/spending-timeline.component';
@NgModule({
  declarations: [
    SpendingStatisticsComponent,
    SpendingCategoriesLabelsComponent,
    NatureOfSpendingComponent,
    SpendingTimelineComponent,
    DataPopupComponent
  ],
  imports: [
    CommonModule,
    BudgetPlannerRoutingModule,
    BaseChartDirective,
    NgxEchartsModule ,
    ReusableTableComponent 
  ]
})
export class BudgetPlannerModule { }
