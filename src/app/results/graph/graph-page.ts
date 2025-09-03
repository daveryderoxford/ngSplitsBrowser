import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, HostListener, ViewEncapsulation, computed, effect, inject, signal, viewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, debounceTime } from 'rxjs';
import { ResultsError } from '../loading/results-error';
import { ResultsLoading } from '../loading/results-loading';
import { Competitor, CourseClassSet, sbTime } from '../model';
import { Navbar } from "../navbar/navbar";
import { ResultsDataService } from '../results-data.service ';
import { ResultsPageState } from '../results-page-state';
import { ResultsSelectionService } from "../results-selection.service";
import { SelectionSidebarButton } from "../selection-sidebar/selection-sidebar-button";
import { Sidebar } from '../selection-sidebar/sidebar';
import { CompareWithCompetitorSelect } from "./comparison-algorithm-select/compare-with-competitor-select";
import { CompareWithSelect } from './comparison-algorithm-select/compare-with-select';
import { LabelFlagSelect } from './label-flags-select';
import { Chart, ChartDisplayData, StatsVisibilityFlags } from './splitsbrowser/chart';
import { ChartTypeClass } from './splitsbrowser/chart-types';
import { ALL_COMPARISON_OPTIONS } from './splitsbrowser/comparision-options';

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
   imports: [Navbar, CompareWithSelect, LabelFlagSelect, Sidebar, CompareWithCompetitorSelect,
    ResultsLoading, ResultsError, SelectionSidebarButton]
})
export class GraphPage {
   destroyRef = inject(DestroyRef);

   protected rs = inject(ResultsSelectionService);
   protected rd = inject(ResultsDataService);
   protected activeRoute = inject(ActivatedRoute);
   protected ps = inject(ResultsPageState);

   legIndex = signal(0);
   raceTiime = signal(0);

   comparisonOptions = signal(ALL_COMPARISON_OPTIONS[1]);
   comparisonCompetitor = signal<Competitor | undefined>(undefined);

   leftLabelFlags = signal<StatsVisibilityFlags>({
      totalTime: false,
      splitTime: true,
      behindFastest: false,
      timeLoss: true
   });

   chartType = computed(() =>
      (this.ps.pageDisplayed().type === 'race') ?
         ChartTypeClass.chartTypes.RaceGraph :
         ChartTypeClass.chartTypes.SplitsGraph
   );

   courseClassSet = computed(() =>
      this.rs.courseOrClass() ?
         new CourseClassSet(this.rs.course()?.classes) :
         new CourseClassSet([this.rs.oclass()])
   );

   /** index of competitors in displayed competitor list */
   selectedIndices = computed(() =>
      this.rs.selectedCompetitors().map(comp => this.courseClassSet().allCompetitors.indexOf(comp))
   );

   referenceCumTimes = computed<sbTime[]>(() => {

      const opt = this.comparisonOptions();
      switch (opt.nameKey) {
         case 'CompareWithWinner':
            return this.courseClassSet().getWinnerCumTimes();
         case 'CompareWithFastestTime':
            return this.courseClassSet().getFastestCumTimes();
         case 'CompareWithFastestTimePlusPercentage':
            return this.courseClassSet().getFastestCumTimesPlusPercentage(opt.percentage);
         case 'CompareWithAnyRunner':
            /** index of competitors in displayed competitor list */
            const index = this.courseClassSet().allCompetitors.indexOf(this.comparisonCompetitor());
            return this.courseClassSet().getCumulativeTimesForCompetitor(index);
         default:
            throw new Error(`Unknown comparison option: ${opt.nameKey}`);
      }
   });

   chartData = computed<ChartDisplayData>(() => {

      return {
         results: this.rd.results(),
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

   sizeChange$ = this.size$.pipe(debounceTime(100)).subscribe(rect => {
      if (this.chart) {
         const element = this.chartElement().nativeElement;
         this.chart.setSize(element.clientWidth, element.clientHeight);
         this.redrawChart();
      }
   });

   chart: Chart;
   chartElement = viewChild<ElementRef>('chart');

   constructor() {  

      /** Effect to create and redraw the chart when its data or container becomes available. */
      effect(() => {

         const chartContainer = this.chartElement();

         // Exit if the chart container isn't ready or if results are still loading.
         if (!chartContainer || this.rd.isLoading()) {
            return;
         }

         const chartDisplayData = this.chartData();

         // One-time initialization of the chart instance.
         if (!this.chart) {
            this.chart = new Chart(chartContainer.nativeElement);
            this.chart.registerEventHandlers(
               (leg) => this.legIndex.set(leg),
               (time) => this.raceTiime.set(time)
            );
            this.observer.observe(this.chartElement().nativeElement);
         }

         if (chartDisplayData) {
            // Redraw the chart with the latest data.
            const element = chartContainer.nativeElement;
            this.chart.setSize(element.clientWidth, element.clientHeight);
            this.redrawChart();
         }
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
      if (this.chartElement()) {
         this.observer.unobserve(this.chartElement().nativeElement);
         this.size$.unsubscribe();
      }
   }

   @HostListener('document:mouseup')
   onDocumentMouseUp() {
      if (this.chart && this.chart.popup) {
         this.chart.popup.hide();
      }
   }
}