import { Component, OnInit } from '@angular/core';
import { EChartOption } from 'echarts';

@Component({
  selector: 'ngx-businessdashboard',
  templateUrl: './businessdashboard.component.html',
  styleUrls: ['./businessdashboard.component.scss']
})
export class BusinessdashboardComponent implements OnInit {

  chartOption: EChartOption = {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [820, 932, 901, 934, 1290, 1430, 1550, 1200, 1650.1450, 1680.1890],
      type: 'pie',
      areaStyle: {}
    }]
  };

  constructor() { }

  ngOnInit(): void {
  }

}
