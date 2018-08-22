import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators, FormArray } from "@angular/forms";
import { Router } from "@angular/router";
import { AngularFireAuth } from "angularfire2/auth";
import { Nations } from "app/model/nations";
import { UserDataService } from "app/user/user-data.service";
import * as firebase from "firebase/app";
import { UserData, CompetitorSearchData, UserResultData, OEvent } from "app/model";
import { CompetitorDataService } from "../shared/services/competitor-data.service";
import { Utils } from "app/shared";
import { ResultsSelectionService } from "../results/results-selection.service";
import { EventService } from "app/events/event.service";
import { Results, Competitor } from "app/results/model";
import { map, switchMap } from "rxjs/operators";

@Component({
   selector: "app-user",
   templateUrl: "./user.component.html",
   styleUrls: ["./user.component.scss"]
})
export class UserComponent implements OnInit {
   originalUserData: UserData = null;
   userForm: FormGroup;
   error = "";

   showProgressBar = false;

   nations = Nations.getNations();

   constructor(
      private formBuilder: FormBuilder,
      private afAuth: AngularFireAuth,
      private router: Router,
      private userdata: UserDataService,
      private cds: CompetitorDataService,
      private rs: ResultsSelectionService,
      private es: EventService
   ) {
      this.userForm = this.formBuilder.group({
         firstName: [""],
         lastName: [""],
         yearOfBirth: [
            "",
            [Validators.min(1900), Validators.max(new Date().getFullYear())]
         ],
         club: [""],
         nationality: [""],
         nationalId: [""],
         ecardSI: [""],
         ecardEmit: [""],
         autoFind: [""]
      });
   }

   ngOnInit() {
      // monitor login/out
      this.afAuth.authState.subscribe(loggedIn => this.loginChanged(loggedIn));

      this.userdata.getUser().subscribe(userData => this.userChanged(userData));

      const t = this.userForm.controls["ecardEmit"].value;
   }

   async loginChanged(loggedIn: firebase.User) {
      if (!loggedIn) {
         this.router.navigate(["/"]);
      }
   }

   userChanged(userData) {
      this.originalUserData = userData;
      if (userData) {
         this.userForm.reset(userData);
      }
   }

   async save() {
      // Save the data
      const updatedUserData = await this.userdata.updateDetails(
         this.userForm.value
      );

      let foundResults = await this.findUserResults(updatedUserData);

      // Remove any results already in the users results
      for (const userResult of updatedUserData.results) {
         foundResults = foundResults.filter(found => {
            const duplicate =
               userResult.event.key === found.eventKey &&
               userResult.ecardId === found.ecardId;
            return !duplicate;
         });
      }

      // Display list of results to the user for them to add
      if (foundResults.length > 0) {
        foundResults = this.displayFoundResults(foundResults);
      }

      //  Finally create competitor results for each result found. s
      for (const found of foundResults) {
           // get the event
         let oevent: OEvent;
         let comp: Competitor;
         let user: UserData;

         this.es.getEvent(found.eventKey).pipe(
            map( oevent1 => oevent = oevent1),
            switchMap( (oevent1) => {
                return this.rs.downloadResultsFile(oevent1);
           }),
           switchMap( (file) => {
               const results = this.rs.parseSplits(file);
               comp = results.findCompetitorByECard(found.ecardId);

               return this.userdata.getUser();
           }),
           map( user1 => (user = user1)

           )). catch( error => {
            return Rx.Observable.of(3);
          });
           .switch( (user) => {
             this.userdata.addResult(user, comp, oevent ).then( () => {

             });
           })
           .catch(error => {
            return Rx.Observable.of(3);
          });
        }

   }

   displayFoundResults(foundResults:  CompetitorSearchData[]): CompetitorSearchData[] {
       // TODO to implement
       return [];
   }

   /** Finds results based on any unchanged field.
    * Matches based on ecard and first name/surname/club
    */
   async findUserResults(
      updatedUser: UserData
   ): Promise<CompetitorSearchData[]> {
      const originalUser = this.originalUserData;
      let resultsFound: Array<CompetitorSearchData> = [];

      // Find by ecard if it has changed
      if (!originalUser || originalUser.ecardEmit !== updatedUser.ecardEmit) {
         resultsFound = resultsFound.concat(
            await this.cds.searchResultsByECard(updatedUser.ecardEmit)
         );
      }

      if (!originalUser || originalUser.ecardSI !== updatedUser.ecardSI) {
         resultsFound = resultsFound.concat(
            await this.cds.searchResultsByECard(updatedUser.ecardSI)
         );
      }

      if (
         !originalUser ||
         originalUser.firstName !== updatedUser.firstName ||
         originalUser.lastName !== updatedUser.lastName ||
         originalUser.club !== updatedUser.club
      ) {
         resultsFound = resultsFound.concat(
            await this.cds.searchResultsByName(
               updatedUser.firstName,
               updatedUser.lastName,
               updatedUser.club
            )
         );
      }

      // Remove duplicated from found results as may have been found for ecard and name
      Utils.removeDuplicates(resultsFound);

      return resultsFound;
   }

   createECard(): FormGroup {
      return this.formBuilder.group({
         id: "",
         type: ""
      });
   }

   addEcard() {}

   removeECard() {}
}
