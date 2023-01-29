import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore, QueryDocumentSnapshot } from "@angular/fire/compat/firestore";
import { testUser1Password } from "app/app.firebase-config";
import { Observable, Observer, from } from "rxjs";
import { test_events, test_results, test_userdata, test_clubs } from './testdata.spec';
import { TestBed } from "@angular/core/testing";
import { concatMap, bufferCount } from "rxjs/operators";
import { User } from "firebase";
import { UserData } from "app/model";

/** Local Firebase test database angular firestore */

export class FirestoreTestUtil {

   afAuth: AngularFireAuth;
   afs: AngularFirestore;

   constructor() {
      this.afAuth = TestBed.get(AngularFireAuth);
      if (!this.afAuth) {
         throw new Error("Auth service reference no found");
      }

      this.afs = TestBed.get(AngularFirestore);
      if (!this.afs) {
         throw new Error("Firestore service reference no found");
      }
   }

   /** Login to test database */
   async logon(): Promise<firebase.auth.UserCredential> {
      const user = 'michelle@theryderclan.co.uk';
      const password = testUser1Password;
      const p = this.afAuth.auth.signInWithEmailAndPassword(user, password);
      return p;
   }

   /** Clean all collections from test database */
   async cleanup(): Promise<any> {
      await this.deleteCollections('users', 'events', 'results', 'clubs');
   }

   /** Load default test data into test database */
   async loadDefaultData(): Promise<void> {
    //  await this.cleanup();

      // set user data
      console.log('Setting default user data');
      for (const ud of test_userdata) {
         await this.afs.doc<UserData>('users/' + ud.key).set(ud);
      }

      // set events
      console.log('Setting default event data');
      for (const event of test_events) {
         await this.afs.doc('events/' + event.key).set(event);
      }

      // set results
      console.log('Setting default result data');
      for (const result of test_results) {
         await this.afs.doc('results/' + result.key).set(result);
      }

      // clubs
      console.log('Setting default club data');
      for (const club of test_clubs) {
         await this.afs.doc('clubs/' + club.key).set(club);
      }
   }

   /**
    * Delete all documents in specified collections.
    *
    * @param {string} collections Collection names
    * @return {Promise<number>} Total number of documents deleted (from all collections)
    */
   async deleteCollections(...collections: string[]) {
      let totalDeleteCount = 0;
      const batchSize = 500;
      return new Promise<number>((resolve, reject) => from(collections).pipe(
         concatMap(collection => from(this.afs.collection(collection).ref.get())),
         concatMap(q => from(q.docs)),
         bufferCount(batchSize),
         concatMap((docs: QueryDocumentSnapshot<any>[]) => Observable.create((o: Observer<number>) => {
            const batch = this.afs.firestore.batch();
            docs.forEach(doc => batch.delete(doc.ref));
            batch.commit()
               .then(() => {
                  o.next(docs.length);
                  o.complete();
               })
               .catch(e => o.error(e));
         }))
      )
         .subscribe(
            (batchDeleteCount: number) => totalDeleteCount += batchDeleteCount,
            e => reject(e),
            () => resolve(totalDeleteCount)
         ));
   }
}
