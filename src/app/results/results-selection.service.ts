import { computed, inject, Injectable, signal } from "@angular/core";
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

   private _selectedCompetitors = signal<Competitor[]>([]);
   private _selectedControl = signal<string>(null);
   private _selectedCourse = signal<Course>(null);
   private _selectedClass = signal<CourseClass>(null);
   private _courseCompetitorsDisplayed = signal(false);

   public selectedCompetitors = this._selectedCompetitors.asReadonly();
   public selectedControl = this._selectedControl.asReadonly();
   public selectedCourse = this._selectedCourse.asReadonly();
   public selectedClass = this._selectedClass.asReadonly();
   public courseCompetitorsDisplayed = this._courseCompetitorsDisplayed.asReadonly();

   selectedCompetitorsDisplayed = computed(() =>
      this.selectedCompetitors().filter(comp =>
         this.courseCompetitorsDisplayed() ?
            comp.courseClass.course.name === this.selectedCourse().name :
            comp.courseClass.name === this.selectedClass().name)
   );

   constructor() {
      this.rd.selectedResults.subscribe(results => {
         this._selectedCompetitors.set([]);
         this._selectedControl.set(null);

         if (results.classes.length > 0) {
            this.selectClass(results.classes[0]);
         } else {
            this._selectedCourse.set(null);
            this._selectedClass.set(null);
         }
      });
   }

   /** Select a competitor or array of competitors */
   selectCompetitors(...comp: Competitor[]) {
      let competitors = this._selectedCompetitors().concat(comp);
      competitors = competitors.sort((a, b) => a.totalTime - b.totalTime);
      this._selectedCompetitors.set(competitors);
   }

   /** Deselect the supplied competitors
    * If a competitor is not selected then it is ignored.
    */
   deselectCompetitors(...compToRemove: Competitor[]) {
      let competitors = this._selectedCompetitors();
      competitors = competitors.filter(value => {
         return !compToRemove.includes(value);
      });
      this._selectedCompetitors.set(competitors);
   }

   clearSelectedCompetitors() {
      this._selectedCompetitors.set([]);
   }

   /** Toggle selected cometitor */
   toggleSelectedSelectedCompetitor(comp: Competitor) {
      let competitors = this._selectedCompetitors();

      if (competitors.includes(comp)) {
         this.deselectCompetitors(comp);
      } else {
         this.selectCompetitors(comp);
      }
   }

   public isCompetitorSelected = (comp: Competitor) => this._selectedCompetitors().includes(comp);

   selectControl(code: string) {
      this._selectedControl.set(code);
   }

   selectCourse(course: Course) {
      console.log('Course selected' + course.name);
      // If course has changed then reset the selected control
      if (course !== this._selectedCourse()) {
         this.selectControl(null);
      }
      this._selectedCourse.set(course);
   }

   selectClass(courseclass: CourseClass) {
      console.log('Class selected' + courseclass.name);
      this.selectCourse(courseclass.course);
      this._selectedClass.set(courseclass);
   }

   /** Display all competitors for the course or just the selected class */
   displayAllCourseCompetitors(showCourse: boolean) {
      this._courseCompetitorsDisplayed.set(showCourse);
   }
}
