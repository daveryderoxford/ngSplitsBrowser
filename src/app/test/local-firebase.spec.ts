import { TestBed } from "@angular/core/testing";
import { Auth, signInWithEmailAndPassword, UserCredential } from '@angular/fire/auth';
import { collection, collectionData, deleteDoc, doc, Firestore, setDoc } from '@angular/fire/firestore';
// import { testUser1Password } from "app/app.firebase-config";
import { test_clubs, test_events, test_userdata } from './testdata.spec';


const testUser1Password = 'xxxxx';

/** Local Firebase test database angular firestore */

export class FirestoreTestUtil {

   afAuth: Auth;
   afs: Firestore;

   constructor() {
      this.afAuth = TestBed.get(Auth);
      if (!this.afAuth) {
         throw new Error("Auth service reference no found");
      }

      this.afs = TestBed.get(Firestore);
      if (!this.afs) {
         throw new Error("Firestore service reference no found");
      }
   }

   /** Login to test database */
   async logon(): Promise<UserCredential> {
      const user = 'michelle@theryderclan.co.uk';
      const password = testUser1Password;
      const p = await signInWithEmailAndPassword(this.afAuth, user, password);
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
         await setDoc(doc(this.afs, "users", ud.key), ud);
      }

      // set events
      console.log('Setting default event data');
      for (const event of test_events) {
         await setDoc(doc(this.afs, "users", event.key), event);
      }

      // clubs
      console.log('Setting default club data');
      for (const club of test_clubs) {
         await setDoc(doc(this.afs, "clubs", club.key), club);
      }
   }

   /**
    * Delete all documents in specified collections.
    *
    * @param {string} collections Collection names
    * @return {Promise<number>} Total number of documents deleted (from all collections)
    */
   async deleteCollections(...collections: string[]) {
      for (const col of collections) {
         const data = await collectionData<any>(collection(this.afs, col)).toPromise();
         for (const d of data) {
            await deleteDoc(doc(this.afs, col, d.key));
         }
      }
   }
}
