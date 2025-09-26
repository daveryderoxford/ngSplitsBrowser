import { ChangeDetectionStrategy, Component, computed, input, viewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, TooltipItem } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { Competitor, TimeUtilities } from '../model';
import { FormatTimePipe } from "../model/results-pipes";

type BarChartOptions = ChartConfiguration<'bar'>['options'];

type MixedChartData = ChartData<'bar'> | ChartData<'line'>;

const RED = "#ff0000";
const RED_30 = "rgba(255,0,0,0.3)";
const BLUE = "#0000ff";
const BLUE_30 = "rgba(0,0,255,0.3)";
const PURPLE = "#b300ff";
const PURPLE_30 = "rgba(180,0,255,0.3)";

const TIME_LOSS = 0;
const TIME_GAIN = 1;
const POSITION = 2;
const CUM_POSITION = 3;

@Component({
  selector: 'app-summary-graph',
  imports: [BaseChartDirective, FormatTimePipe],
  template: `
    <div class=title>
        @let comp = competitor();
        <span>{{comp.name}}</span> 
        <span>{{comp.club}}</span> 
        <span>{{comp.classPosition}} / {{maxCompetitors()}}</span>
        <span>Total {{comp.totalTime | formatTime}}</span>
        <span>{{ behind() }}</span>
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
      justify-content: center;
      gap: 20px;
      font: var(--mat-sys-title-medium);
      padding-top: 7px;
   }
   `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummaryGraph {

  competitor = input.required<Competitor>();
  maxCompetitors = input.required<number>();
  maxSplits = input.required<number>();

  behind = computed(() => {
    const comp = this.competitor();
    const winner = comp.courseClass.competitors[0];

    if (!comp.totalTime || !winner.totalTime) {
      return '';
    }
    const diff = comp.totalTime - winner.totalTime;
    return (diff === 0) ? '' : TimeUtilities.formatTime(diff) + ' behind';
  });

  legLabels = computed(() => {
    const ret = this.competitor().splitRanks.map((_, i) => (i + 1).toString());
    ret[this.competitor().splitRanks.length - 1] = 'F';
    return ret;
  });

  chart = viewChild.required<BaseChartDirective<'bar'>>(BaseChartDirective);

  barChartOptions = computed<BarChartOptions>(() => ({
    scales: {
      x: {
        title: {
          display: true,
          text: 'Control'
        },
        stacked: true
      },
      y: {
        position: 'left',
        min: 0, max: 4.0,
        title: { text: 'Time (min)', display: true },
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
      tooltip: {
        callbacks: {
          label: (context: TooltipItem<"bar">) => {
            const label = context.dataset.label + ': ';
            const value = context.raw as number;
            switch (context.datasetIndex) {
              case TIME_LOSS:
              case TIME_GAIN:
                return label + TimeUtilities.formatTime(value * 60);
              case POSITION:
              case CUM_POSITION:
                return label + value.toString();
              default:
                return ' Errror unexpected index';
            }
          },
          title: (context: TooltipItem<"bar">[]) =>
            (context[0].label === 'F') ? 'Finish' : 'Control ' + context[0].label,
        },
      },
    },
  }));

  timeLossMins = computed(() => this.competitor().timeLosses.map(loss => loss > 0 ? loss / 60 : 0));
  timeGainMins = computed(() => this.competitor().timeLosses.map(loss => loss < 0 ? -loss / 60 : 0));

  barChartData = computed<MixedChartData>(() => ({
    labels: this.legLabels(),
    datasets: [
      {
        data: this.timeLossMins(),
        label: 'Time loss',
        yAxisID: 'y',
        borderColor: RED,
        backgroundColor: RED_30,
      },
      {
        data: this.timeGainMins(),
        label: 'Time Gain',
        yAxisID: 'y',
        borderColor: BLUE,
        backgroundColor: BLUE_30,
      },
      {
        data: this.competitor().splitRanks.map(pos => pos ?? 0),
        label: 'Position',
        type: 'line',
        yAxisID: 'y1',
        borderColor: PURPLE,
        backgroundColor: PURPLE_30,
      },
      {
        data: this.competitor().cumRanks.map(pos => pos ?? 0),
        label: 'Cumulative Position',
        type: 'line',
        yAxisID: 'y1',
      }
    ],
  })) as any; //cast way type information to avoid typing issue with mixed charts in ng-chart

  public chartClicked(params: { event?: ChartEvent, elements?: Object; }) {
    console.log(params.event, params.elements);
  }
}
