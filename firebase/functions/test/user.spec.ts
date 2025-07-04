// Initialize the test environment. This must be done before importing the functions file.
import test from 'firebase-functions-test';
import { initializeApp, getApps, deleteApp } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { expect } from 'chai';
import { before, after, describe, it, afterEach } from 'mocha';
import { UserData } from '../src/model/user.js';
import { userConverter } from '../src/model/user-firebase-converters.js';

const projectId = 'splitsbrowser-b5948';
const testEnv = test({ projectId });

// Dynamically import the functions in the `before()` hook to ensure the app is initialized first.
let myFunctions: typeof import('../src/index.js');

/* UTILITY FUNCTIONS */

async function saveUser(db: Firestore, user: UserData): Promise<void> {
   const ref = db.collection('users').doc(user.key).withConverter(userConverter);
   await ref.set(user);
}

async function readUser(db: Firestore, uid: string): Promise<UserData | undefined> {
   const ref = db.collection('users').doc(uid).withConverter(userConverter);
   const doc = await ref.get();
   return doc.data() as UserData | undefined;
}

/* TEST FUNCTIONS */

describe('User Cloud Functions', function () {

   // Set a default timeout of 5 seconds for all tests and hooks in this suite.
   this.timeout(5000);

   let db: Firestore;

   before(async () => {
      // Initialize the Firebase Admin SDK *first*. This creates the default app.
      initializeApp({ projectId });

      // Now that the app is initialized, we can dynamically import our functions
      // file. The guarded initializeApp() in `src/index.ts` will be skipped.
      myFunctions = await import('../src/index.js');

      db = getFirestore();
   });

   after(async () => {
      testEnv.cleanup();
      // Delete the app to prevent state leakage between test files.
      await deleteApp(getApps()[0]);
   });

   afterEach(async () => {
      // Using `clearFirestoreData` as it was found to be unreliable (different project Id?)
      try {
         const collections = await db.listCollections();
         for (const collection of collections) {
            await db.recursiveDelete(collection);
         }
      } catch (error: any) {
         console.log('\n ****** afterEach:  Error in aftereach\n', error.toString());
      }
   });

   describe('createUser', () => {
      it('should create a new user data document when a user is created', async () => {
         // Create a mock user object.
         const user = testEnv.auth.makeUserRecord({
            uid: 'test-uid-create',
            email: 'create@example.com',
         });

         // 2. Wrap the function.
         const wrapped = testEnv.wrap(myFunctions.createUser);
         // For v1 Auth triggers, the user record is passed directly.
         await wrapped(user);

         // 4. Read the user data from Firestore.
         const userData = await readUser(db, user.uid);

         // 5. Assertions.
         expect(userData).to.not.be.undefined;
         if (userData) {
            expect(userData.key).to.equal(user.uid);
            expect(userData.email).to.equal(user.email);
            expect(userData.firstname).to.equal('');
            expect(userData.surname).to.equal('');
         }
      });
   });

   describe('deleteUser', () => {
      it('should mark the user data document as archived when a user is deleted', async () => {
         // Create a mock user object and initial user data in Firestore.
         const user = testEnv.auth.makeUserRecord({
            uid: 'test-uid-delete',
            email: 'delete@example.com',
         });
         const initialUserData: UserData = {
            key: user.uid,
            email: user.email!,
            firstname: 'Test',
            surname: 'User',
            club: 'TEST',
            nationality: 'GBR',
            nationalId: '',
            results: [],
            postcode: '',
         };
         await saveUser(db, initialUserData);

         // Call function
         const wrapped = testEnv.wrap(myFunctions.deleteUser);
         // For v1 Auth triggers, the user record is passed directly.
         await wrapped(user);

         // Verify updated user has archived set
         const userData = await readUser(db, user.uid);

         expect(userData).to.not.be.undefined;
         expect((userData as any).archived).to.be.true;
      });
   });
});