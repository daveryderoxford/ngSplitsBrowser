/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { ChangeDetectionStrategy, Component, computed, input, viewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Competitor } from '../model';
import { FormatTimePipe } from "../model/results-pipes";

type BarChartOptions = ChartConfiguration<'bar'>['options'];

type MixedChartData = ChartData<'bar'> | ChartData<'line'>;

@Component({
   selector: 'app-summary-graph',
   imports: [BaseChartDirective, FormatTimePipe],
   template: `
      <div class=title>
         @let comp = competitor();
         <span>{{comp.name}}</span> 
         <span>{{comp.club}}</span> 
         <span>Total time: {{comp.totalTime | formatTime}}</span>
      </div>
      <canvas
        baseChart
        [data]="barChartData()"
        [options]="barChartOptions()"
        type="bar"
        (chartClick)="chartClicked($event)"
      ></canvas>
  `,
   styles: `
   :host {
      display: flex;
      flex-direction: column;
   }
   .title {
      display: flex;
      gap: 20px;
      font: var(--mat-sys-title-medium);
      padding-top: 7px;
      padding-left: 60px;
   }
   `,
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummaryGraph {

   competitor = input.required<Competitor>();
   maxCompetitors = input.required<number>();
   maxSplits = input.required<number>();

   labels = computed(() => this.competitor().splitRanks.map((_, i) => i));

   chart = viewChild.required<BaseChartDirective<'bar'>>(BaseChartDirective);

   barChartOptions = computed<BarChartOptions>(() => ({
      scales: {
         y: {
            position: 'left',
            min: 0, max: 4.0, 
            title: {text: 'Time (min)', display: true },
         },
         y1: {
            position: 'right',
            min: 0, max: this.maxCompetitors(), 
            title: { text: 'Position', display: true },
            grid: {
               drawOnChartArea: false, // only want the grid lines for one axis to show up
             },
         }
      },
      plugins: {
         legend: {
            display: true,
         },
      },
   }));

   timeLoss = computed(() => this.competitor().timeLosses.map(loss => loss > 0 ? loss/60 : 0));
   timeGain = computed(() => this.competitor().timeLosses.map(loss => loss < 0 ? -loss/60 : 0));

   barChartData = computed<MixedChartData>(() => ({
      labels: this.labels(),
      datasets: [
         { data: this.timeLoss(), label: 'Time loss', yAxisID: 'y' },
         { data: this.timeGain(), label: 'Time Gain', yAxisID: 'y' },
         { data: this.competitor().splitRanks, label: 'Position', type: 'line', yAxisID: 'y1' },
         { data: this.competitor().cumRanks, label: 'Cumulative Position', type: 'line', yAxisID: 'y1' }
      ],
   })) as any;  //cast way type information to avoid typing issue with mixed charts in ng-chart

   // events
   public chartClicked({
      event,
      active,
   }: {
      event?: ChartEvent;
      active?: object[];
   }): void {
      console.log(event, active);
   }

}
