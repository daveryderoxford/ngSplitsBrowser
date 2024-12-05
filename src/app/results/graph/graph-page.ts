import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewEncapsulation, computed, effect, inject, signal, viewChild } from "@angular/core";
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from "@angular/router";
import { UntilDestroy } from '@ngneat/until-destroy';
import { BehaviorSubject, debounceTime } from 'rxjs';
import { CompetitorList } from '../competitor-list/competitor-list';
import { FastestPanelComponent } from "../fastest-panel/fastest-panel.component";
import { CourseClassSet } from '../model';
import { Navbar } from "../navbar/navbar";
import { ResultsDataService } from '../results-data.service ';
import { ResultsSelectionService } from "../results-selection.service";
import { CompareWithSelect } from './compare-with-select';
import { LabelFlagSelect } from './label-flags-select';
import { Chart, ChartDisplayData, StatsVisibilityFlags } from './splitsbrowser/chart';
import { ChartTypeClass } from './splitsbrowser/chart-types';
import { ALL_COMPARISON_OPTIONS } from './splitsbrowser/comparision-options';

interface SplitsBrowserOptions {
  defaultLanguage?: boolean;
  containerElement?: string;
  topBar?: string;
}

@UntilDestroy({ checkProperties: true })
@Component({
  selector: "app-graph",
  templateUrl: "./graph-page.html",
  styleUrls: ["./graph-page.scss"],
  // To avoid angular re-writting style names that will be used by graphs view.
  // These styles will just get appended to the global styles file
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [Navbar, CompetitorList, FastestPanelComponent, CompareWithSelect, LabelFlagSelect]
})
export class GraphPage implements AfterViewInit {

  protected rs = inject(ResultsSelectionService);
  protected rd = inject(ResultsDataService);
  protected activeRoute = inject(ActivatedRoute);

  results = toSignal(this.rd.selectedResults);
  oevent = toSignal(this.rd.selectedEvent);

  showFastestPanel = signal(true);

  comparisonOptions = signal(ALL_COMPARISON_OPTIONS[0]);

  leftLabelFlags = signal<StatsVisibilityFlags>({
    totalTime: false,
    splitTime: true,
    behindFastest: false,
    timeLoss: true
  });

  url = toSignal(this.activeRoute.url);

  chartType = computed(() =>
    this.url()[0].path.includes('race') ?
      ChartTypeClass.chartTypes.RaceGraph :
      ChartTypeClass.chartTypes.SplitsGraph
  );

  courseClassSet = computed(() =>
    this.rs.courseOrClass() ?
      new CourseClassSet(this.rs.course().classes) :
      new CourseClassSet([this.rs.oclass()])
  );

  /** index of competitors in displayed competitor list */
  selectedIndices = computed(() =>
    this.rs.competitors().map(comp => this.courseClassSet().allCompetitors.indexOf(comp)
  ));

  referenceCumTimes = computed(() => {
    const opt = this.comparisonOptions();
    return this.courseClassSet().getFastestCumTimesPlusPercentage(5);
  });


  chartData = computed<ChartDisplayData>(() => {

    const data: ChartDisplayData = {
      eventData: this.results(),
      courseClassSet: this.courseClassSet(),
      referenceCumTimes: this.referenceCumTimes(),
      fastestCumTimes: this.courseClassSet().getFastestCumTimes(),
      chartData: this.courseClassSet().getChartData(this.referenceCumTimes(), this.selectedIndices(), this.chartType())
    };
    return data;
  });

  size$ = new BehaviorSubject({ width: 0, height: 0 });
  observer = new ResizeObserver(entries => {
    const element = this.chartElement().nativeElement;
    this.chart.setSize(element.clientWidth, element.clientHeight);
    this.redrawChart();
  });

  chart: Chart;
  chartElement = viewChild.required<ElementRef>('chart');

  constructor() {

    /** Effect to create chart */
    effect(() => {

      if (this.chartElement().nativeElement) {
        const element = this.chartElement().nativeElement;

        if (!this.chart) {
          this.chart = new Chart(element);
        }

        if (this.results()) {
          this.chart.setSize(element.clientWidth, element.clientHeight);
          this.redrawChart();
        } else {
          console.log('graph componennt null results');
        }
      }
    });
  }

  ngAfterViewInit() {

    this.observer.observe(this.chartElement().nativeElement);

    this.size$.pipe(debounceTime(100)).subscribe(rect => {
      const element = this.chartElement().nativeElement;
      this.chart.setSize(element.clientWidth, element.clientHeight);
      this.redrawChart();
    });

  }

  redrawChart() {
    this.chart.drawChart(
      this.chartData(),
      this.selectedIndices(),
      this.leftLabelFlags(),
      this.chartType()
    );
  }

  ngOnDestroy() {
    this.observer.unobserve(this.chartElement()?.nativeElement);
  }
}

