import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, ViewEncapsulation, computed, effect, inject, signal, viewChild } from "@angular/core";
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, debounceTime } from 'rxjs';
import { FastestPanelComponent } from "../fastest-panel/fastest-panel.component";
import { CourseClassSet } from '../model';
import { Navbar } from "../navbar/navbar";
import { ResultsDataService } from '../results-data.service ';
import { ResultsSelectionService } from "../results-selection.service";
import { CompareWithSelect } from './splitsbrowser/compare-with-select';
import { LabelFlagSelect } from './label-flags-select';
import { Chart, ChartDisplayData, StatsVisibilityFlags } from './splitsbrowser/chart';
import { ChartTypeClass } from './splitsbrowser/chart-types';
import { ALL_COMPARISON_OPTIONS } from './splitsbrowser/comparision-options';
import { Sidebar } from '../sidebar/sidebar';

interface SplitsBrowserOptions {
  defaultLanguage?: boolean;
  containerElement?: string;
  topBar?: string;
}

@Component({
  selector: "app-graph",
  templateUrl: "./graph-page.html",
  styleUrls: ["./graph-page.scss"],
  // To avoid angular re-writting style names that will be used by graphs view.
  // These styles will just get appended to the global styles file
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Navbar, FastestPanelComponent, CompareWithSelect, LabelFlagSelect, Sidebar]
})
export class GraphPage implements AfterViewInit {
  destroyRef = inject(DestroyRef);

  protected rs = inject(ResultsSelectionService);
  protected rd = inject(ResultsDataService);
  protected activeRoute = inject(ActivatedRoute);

  showFastestPanel = signal(true);
  legIndex = signal(0);
  raceTiime = signal(0);

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
    this.rs.selectedCompetitors().map(comp => this.courseClassSet().allCompetitors.indexOf(comp))
  );

  referenceCumTimes = computed(() => {
    const opt = this.comparisonOptions();
    // TODO need to actually use opt here
    return this.courseClassSet().getFastestCumTimesPlusPercentage(5);
  });

  chartData = computed<ChartDisplayData>(() => {

    return {
      eventData: this.rd.results(),
      courseClassSet: this.courseClassSet(),
      referenceCumTimes: this.referenceCumTimes(),
      fastestCumTimes: this.courseClassSet().getFastestCumTimes(),
      chartData: this.courseClassSet().getChartData(this.referenceCumTimes(), this.selectedIndices(), this.chartType())
    };
  });

  size$ = new BehaviorSubject({ width: 0, height: 0 });
  observer = new ResizeObserver(entries => 
    this.size$.next(entries[0].contentRect)
  );

  chart: Chart;
  chartElement = viewChild.required<ElementRef>('chart');

  constructor() {

    /** Effect to create chart */
    effect(() => {

      if (this.chartElement().nativeElement) {
        const element = this.chartElement().nativeElement;

        if (!this.chart) {
          this.chart = new Chart(element);
          this.chart.registerEventHandlers(
            (leg) => this.legIndex.set(leg),
            (time) => this.raceTiime.set(time)
          );
        }

        if (this.rd.results()) {
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
    this.size$.unsubscribe();
  }
}