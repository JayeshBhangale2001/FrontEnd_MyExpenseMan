import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { BudgetPlannerRoutingModule } from './budget-planner-routing.module';

// Components
import { NatureOfSpendingComponent } from './nature-of-spending/nature-of-spending.component';
import { SpendingCategoriesLabelsComponent } from './spending-categories-labels/spending-categories-labels.component';
import { SpendingStatisticsComponent } from './spending-statistics/spending-statistics.component';
import { SpendingTimelineComponent } from './spending-timeline/spending-timeline.component';
import { NgxEchartsModule } from 'ngx-echarts'; // Import NgxEchartsModule
@NgModule({
  declarations: [
    SpendingStatisticsComponent,
    SpendingCategoriesLabelsComponent,
    NatureOfSpendingComponent,
    SpendingTimelineComponent
  ],
  imports: [
    CommonModule,
    BudgetPlannerRoutingModule,
    BaseChartDirective,
    NgxEchartsModule 
  ]
})
export class BudgetPlannerModule { }
