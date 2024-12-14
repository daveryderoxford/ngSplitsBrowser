import { computed, effect, inject, Injectable, signal } from "@angular/core";
import { Competitor, Course, CourseClass } from "./model";
import { ResultsDataService } from './results-data.service ';

/** 
 * Selected competitorss, control and courses
 * */
@Injectable({
   providedIn: 'root',
})
export class ResultsSelectionService {

   private rd = inject(ResultsDataService);

   private _competitors = signal<Competitor[]>([]);
   private _control = signal<string>(null);
   private _course = signal<Course>(null);
   private _oclass = signal<CourseClass>(null);
   private _courseOrClass = signal(false);

   public competitors = this._competitors.asReadonly();
   public control = this._control.asReadonly();
   public course = this._course.asReadonly();
   public oclass = this._oclass.asReadonly();
   public courseOrClass = this._courseOrClass.asReadonly();

   /** Competitors currently selected */
   selectedCompetitors = computed(() =>
      this.competitors().filter(comp =>
         this.courseOrClass() ?
            comp.courseClass.course.name === this.course().name :
            comp.courseClass.name === this.oclass().name)
   );

   /** Competitors avaluable for selection */
   displayedCompetitors = computed(() =>
      this.courseOrClass() ?
         this.course()?.competitors :
         this.oclass()?.competitors
   );

   constructor() {
      // TODO Change to linked sugnal when they are avaliable
      effect( () => {
         const results = this.rd.results();
         
    /*     this._competitors.set([]);
         this._control.set(null);

         if (results.classes.length > 0) {
            this.selectClass(results.classes[0]);
         } else {
            this._course.set(null);
            this._oclass.set(null);
         } */
      });
   }

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
      let competitors = this._competitors();

      if (competitors.includes(comp)) {
         this.deselectCompetitors(comp);
      } else {
         this.selectCompetitors(comp);
      }
   }

   public isCompetitorSelected = (comp: Competitor) => this._competitors().includes(comp);

   selectControl(code: string) {
      this._control.set(code);
   }

   selectCourse(course: Course) {
      console.log('Course selected' + course.name);
      // If course has changed then reset the selected control
      if (course !== this._course()) {
         this.selectControl(null);
      }
      this._course.set(course);
   }

   selectClass(courseclass: CourseClass) {
      console.log('Class selected' + courseclass.name);
      this.selectCourse(courseclass.course);
      this._oclass.set(courseclass);
   }

   /** Display all competitors for the course or just the selected class */
   setCourseOrClass(showCourse: boolean) {
      this._courseOrClass.set(showCourse);
   }
}
