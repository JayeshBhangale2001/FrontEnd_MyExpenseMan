import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EChartsOption } from 'echarts';

@Component({
  selector: 'app-nature-of-spending',
  templateUrl: './nature-of-spending.component.html',
  styleUrls: ['./nature-of-spending.component.scss']
})
export class NatureOfSpendingComponent implements OnChanges {
  @Input() data: any;

  public pieChartOptions: EChartsOption = {
    title: {
      text: 'Nature of Spending',
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
        name: 'Spending',
        type: 'pie',
        radius: '50%',
        data: [] as { name: string, value: number }[],
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  public barChartData: EChartsOption = {
    title: {
      text: 'Spending Trend'
    },
    tooltip: {},
    xAxis: {
      type: 'category',
      data: [] as string[]
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        data: [] as number[],
        type: 'bar'
      }
    ]
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.updatePieChartData();
      this.updateBarChartData();
    }
  }

  private updatePieChartData(): void {
    const categoryData = this.data?.categoryData || {};

    // Convert categoryData into an array for the pie chart
    const pieData = Object.keys(categoryData).map(key => ({
      name: key,
      value: categoryData[key]
    }));

    // Ensure pieChartOptions.series is an array and assign data safely
    if (Array.isArray(this.pieChartOptions.series) && this.pieChartOptions.series.length > 0) {
      (this.pieChartOptions.series[0] as any).data = pieData;
    }
  }

  private updateBarChartData(): void {
    const trendData = this.data?.trendData || {};

    const labels = Object.keys(trendData);
    const data = Object.values(trendData);

    // Ensure barChartData.xAxis is an object and has a data property
    if (this.barChartData.xAxis && typeof this.barChartData.xAxis === 'object') {
      (this.barChartData.xAxis as { data?: string[] }).data = labels;
    }

    // Ensure barChartData.series is an array and assign data safely
    if (Array.isArray(this.barChartData.series) && this.barChartData.series.length > 0) {
      (this.barChartData.series[0] as any).data = data;
    }
  }

  get processedPieChartData() {
    return Array.isArray(this.pieChartOptions.series) && this.pieChartOptions.series.length > 0
      ? (this.pieChartOptions.series[0] as any).data
      : [];
  }
}
