// Initialize the test environment. This must be done before importing the functions file.
import { expect } from 'chai';
import { Firestore } from 'firebase-admin/firestore';
import { describe, it } from 'mocha';
import { userConverter } from '../src/model/user-firebase-converters.js';
import { UserData } from '../src/model/user.js';
import { setupMochaHooks, testEnv } from './firebase-test-helper.js';

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

   const context = setupMochaHooks();

   describe('createUser', () => {
      it('should create a new user data document when a user is created', async () => {

         const user = testEnv.auth.makeUserRecord({
            uid: 'test-uid-create',
            email: 'create@example.com',
         });

         const wrapped = testEnv.wrap(context.myFunctions.createUser);
         // For v1 Auth triggers, the user record is passed directly.
         await wrapped(user);

         const userData = await readUser(context.db, user.uid);

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
         await saveUser(context.db, initialUserData);

         const wrapped = testEnv.wrap(context.myFunctions.deleteUser);
         // For v1 Auth triggers, the user record is passed directly.
         await wrapped(user);

         // Verify updated user has archived set
         const userData = await readUser(context.db, user.uid);

         expect(userData).to.not.be.undefined;
         expect((userData as any).archived).to.be.true;
      });
   });
});