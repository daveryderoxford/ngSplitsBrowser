import { computed, inject, Injectable, linkedSignal, signal } from "@angular/core";
import { Competitor, Course, CourseClass, Results } from "./model";
import { ResultsDataService } from './results-data.service ';


/** 
 * Selected competitorss, control and courses
 * */
@Injectable({
   providedIn: 'root',
})
export class ResultsSelectionService {

   private rd = inject(ResultsDataService);

   private _competitors = linkedSignal<Results, Competitor[]>({
      source: this.rd.results,
      computation: () => [] as Competitor[],
   });

   // When results change set default class to the first class
   private _oclass = linkedSignal<CourseClass | undefined>( () => 
      (this.rd.results() && this.rd.results().classes.length > 0) ? 
       this.rd.results().classes[0]: 
       undefined);

   course = computed<Course | undefined>(() => this._oclass()?.course);

   private _control = linkedSignal<Course, string | undefined>({
      source: this.course,
      computation: () => undefined
   });

   private _courseOrClass = signal(false);

   public competitors = this._competitors.asReadonly();
   public control = this._control.asReadonly();
   public oclass = this._oclass.asReadonly();
   public courseOrClass = this._courseOrClass.asReadonly();

   /** Competitors currently selected for the selected course/class*/
   selectedCompetitors = computed(() =>
      this.competitors().filter(comp =>
         this.courseOrClass() ?
            comp.courseClass.course.name === this.course().name :
            comp.courseClass.name === this.oclass().name));

   /** All competitors on course or class */
   displayedCompetitors = computed(() =>
      this.courseOrClass() ?
         this.course()?.competitors :
         this.oclass()?.competitors
   );

   /** Select a competitor or array of competitors */
   selectCompetitors(...comp: Competitor[]) {
      let competitors = this._competitors().concat(comp);
      competitors = competitors.sort((a, b) => a.totalTime - b.totalTime);
      this._competitors.set(competitors);
   }

   /** Deselect the supplied competitors
    * If a competitor is not selected then it is ignored.
    */
   deselectCompetitors(...compToRemove: Competitor[]) {
      let competitors = this._competitors();
      competitors = competitors.filter(value => {
         return !compToRemove.includes(value);
      });
      this._competitors.set(competitors);
   }

   clearCompetitors() {
      this._competitors.set([]);
   }

   /** Toggle selected cometitor */
   toggleCompetitor(comp: Competitor) {
      const competitors = this._competitors();

      if (competitors.includes(comp)) {
         this.deselectCompetitors(comp);
      } else {
         this.selectCompetitors(comp);
      }
   }

   selectCrossingRunners(target: Competitor) {
      const crossingRunners = this.displayedCompetitors().filter(comp => target.crosses(comp));  
      this.selectCompetitors(...crossingRunners);
   } 

   public isCompetitorSelected = (comp: Competitor) => this._competitors().includes(comp);

   selectControl(code: string) {
      this._control.set(code);
   }

   selectClass(courseclass: CourseClass) {
      console.log(`Class selected${courseclass.name}`);
      this._oclass.set(courseclass);
   }

   /** Display all competitors for the course or just the selected class */
   setCourseOrClass(showCourse: boolean) {
      this._courseOrClass.set(showCourse);
   }
}
