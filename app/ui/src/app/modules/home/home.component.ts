import { Component, OnInit } from '@angular/core';
import { LegendItem, ChartType } from '../lbd/lbd-chart/lbd-chart.component';
import { DataService } from '../../services/data.service';
import { combineLatest } from 'rxjs';
import * as Chartist from 'chartist';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
    public cansChartType: ChartType = ChartType.Pie;
    public cansChartData: any;
    public cansChartLegendItems: LegendItem[] = [];

    public inspectionChartType: ChartType = ChartType.Line;
    public inspectionChartData: any;
    public inspectionChartOptions: any;
    public inspectionChartResponsive: any[] = [];
    public inspectionChartLegendItems: LegendItem[] = [];

    public monthlyChartType: ChartType = ChartType.Bar;
    public monthlyChartData: any;
    public monthlyChartOptions: any;
    public monthlyChartResponsive: any[] = [];
    public monthlyChartLegendItems: LegendItem[] = [];

    constructor(private dataService: DataService) { }

    ngOnInit() {
        this.cansChartType = ChartType.Pie;
        this.cansChartLegendItems = [
            { title: 'OK', imageClass: 'fa fa-circle text-info' },
            { title: 'NOT OK', imageClass: 'fa fa-circle text-danger' }
        ];

        // Use combineLatest to combine the two observables and update the chart data whenever either value changes
        combineLatest([this.dataService.getOkCount(), this.dataService.getNotOkCount()]).subscribe(([okCount, notOkCount]) => {
            this.updateCansChartData(okCount, notOkCount);
        });

        this.setStaticChartData();
    }

    private setStaticChartData(): void {
        // Static data for inspection and monthly charts (as you provided)
        this.inspectionChartType = ChartType.Line;
        this.inspectionChartData = {
            labels: ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
            series: [
                [0, 20, 40, 100, 140, 190, 220, 240, 250],
                [0, 2, 5, 15, 23, 25, 30, 35, 40]
            ]
        };
        this.inspectionChartOptions = {
            low: 0,
            showArea: true,
            height: '245px',
            axisX: {
                showGrid: false,
            },
            lineSmooth: Chartist.Interpolation.simple({
                divisor: 3
            }),
            showLine: true,
            showPoint: false
        };
        this.inspectionChartResponsive = [
            ['screen and (max-width: 640px)', {
                axisX: {
                    labelInterpolationFnc: function (value: any[]) {
                        return value[0];
                    }
                }
            }]
        ];
        this.inspectionChartLegendItems = [
            { title: 'Total Inspections', imageClass: 'fa fa-circle text-info' },
            { title: 'Failed Inspections', imageClass: 'fa fa-circle text-danger' }
        ];

        this.monthlyChartType = ChartType.Bar;
        this.monthlyChartData = {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            series: [
                [800, 1200, 1600, 1800], 
                [250, 370, 480, 500]  
            ]
        };
        this.monthlyChartOptions = {
            seriesBarDistance: 10,
            axisX: {
                showGrid: false
            },
            height: '245px'
        };
        this.monthlyChartResponsive = [
            ['screen and (max-width: 640px)', {
                seriesBarDistance: 5,
                axisX: {
                    labelInterpolationFnc: function (value: any[]) {
                        return value[0];
                    }
                }
            }]
        ];
        this.monthlyChartLegendItems = [
            { title: 'OK', imageClass: 'fa fa-circle text-info' },
            { title: 'NOT OK', imageClass: 'fa fa-circle text-danger' }
        ];
    }

    private updateCansChartData(okCount: number, notOkCount: number): void {
        if (okCount > 0 || notOkCount > 0) {
            this.cansChartData = {
                labels: [`${okCount}`, `${notOkCount}`],
                series: [okCount, notOkCount]
            };
        } else {
            this.cansChartData = {
                labels: ['70', '30'],
                series: [70, 30] 
            };
        }
    }
}
