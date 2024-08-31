import { Component, Input, Output,OnChanges,EventEmitter, SimpleChanges } from '@angular/core';
import { EChartsOption, SeriesOption } from 'echarts';

@Component({
  selector: 'app-spending-categories-labels',
  templateUrl: './spending-categories-labels.component.html',
  styleUrls: ['./spending-categories-labels.component.scss']
})
export class SpendingCategoriesLabelsComponent implements OnChanges {
  @Input() categoriesData: any;
  @Input() trendData: any;
  @Output() categoryClicked = new EventEmitter<string>();  // Emit category name
  @Output() trendClicked = new EventEmitter<string>();     // Emit date

  public pieChartOptions: EChartsOption = {
    title: {
      text: 'Spending by Categories',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Expenses',
        type: 'pie',
        radius: '50%',
        data: [] as { name: string; value: number }[],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      } as SeriesOption
    ]
  };

  public barChartOptions: EChartsOption = {
    title: {
      text: 'Spending Trend',
      left: 'center'
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: [] as string[] // Define as an array of strings
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [] as number[],
        type: 'bar'
      } as SeriesOption
    ]
  };

  private pieChartInstance: any;
private barChartInstance: any;

ngOnChanges(changes: SimpleChanges): void {
  if (changes['categoriesData']) {
    this.updatePieChartData();
  }
  if (changes['trendData']) {
    this.updateBarChartData();
  }
}

private updatePieChartData(): void {
  console.log('Initial categoriesData:', this.categoriesData);
  
  // Assuming categoriesData is an object with category names as keys and amounts as values
  const categoryData = this.categoriesData?.categoryData || {}; 
  
  const pieData = Object.keys(categoryData).map(key => ({
    name: key,
    value: categoryData[key]
  }));

  console.log('Converted pieData:', pieData);

  if (this.pieChartInstance) {
    console.log('Updating pie chart with new data');
    this.pieChartInstance.setOption({
      series: [{
        data: pieData // Use the correct data here
      }]
    });
  }
}


private updateBarChartData(): void {
  const trendData = this.trendData || {};
  const labels = Object.keys(trendData);
  const data = Object.values(trendData);

  if (this.barChartInstance) {
    console.log('Updating bar chart with new data');
    this.barChartInstance.setOption({
      xAxis: {
        data: labels
      },
      series: [{
        data: data
      }]
    });
  }
}



onPieChartInit(chart: any) {
  this.pieChartInstance = chart;

  this.pieChartInstance.on('click', (params: any) => {
    this.categoryClicked.emit(params.name);  // Emit the category name
  });
}

onBarChartInit(chart: any) {
  this.barChartInstance = chart;

  this.barChartInstance.on('click', (params: any) => {
    this.trendClicked.emit(params.name);  // Emit the date
  });
}

}
