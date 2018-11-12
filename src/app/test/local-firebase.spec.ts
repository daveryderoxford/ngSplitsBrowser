import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, QueryDocumentSnapshot } from "@angular/fire/firestore";
import { testUser1Password } from "app/app.firebase-config";
import { Observable, Observer, from } from "rxjs";
import { events, results, userdata } from './testdata.spec';
import { TestBed } from "@angular/core/testing";
import { concatMap, bufferCount } from "rxjs/operators";

/** Local Firebase test database angular firestore */

export class FirestoreTestUtil {

   afAuth: AngularFireAuth;
   afs: AngularFirestore;

   constructor() {
      this.afAuth = TestBed.get(AngularFireAuth);
      this.afs = TestBed.get(AngularFirestore);

   }

   /** Login to test database */
   async logon(): Promise<firebase.auth.UserCredential> {
      return this.afAuth.auth.signInWithEmailAndPassword('user1', testUser1Password);
   }

   /** Clean all collections from test database */
   async cleanup(): Promise<any> {
      await this.deleteCollections('users', 'events', 'results', 'clubs');
   }

   /** Load default test data into test database */
   async loadDefaultData(): Promise<void> {

      // set user data
      for (const ud of userdata) {
         await this.afs.doc('users/' + ud.key).set(ud);
      }

      // set events
      for (const event of events) {
         await this.afs.doc('events/' + event.key).set(event);
      }

      // set results
      for (const result of results) {
         await this.afs.doc('events/' + result.key).set(result);
      }

      // clubs
      for (const club of results) {
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
