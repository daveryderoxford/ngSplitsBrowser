/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import {
   FirestoreDataConverter,
   DocumentData,
   QueryDocumentSnapshot,
   Timestamp,
} from 'firebase-admin/firestore';
import { UserData, UserResult } from './user.js';

/** Helper function to safely convert a Firestore Timestamp to a JS Date. */
function dateFromFireStore(raw: any): Date {
   if (!raw) return new Date(0); // Return epoch if no date is present
   return (raw instanceof Timestamp) ? raw.toDate() : new Date(raw);
}

export const userConverter: FirestoreDataConverter<UserData> = {
   toFirestore(user: UserData): DocumentData {
      // Spread to ensure all properties are included, even if undefined in the model
      return { ...user };
   },
   fromFirestore(
      snapshot: QueryDocumentSnapshot): UserData {
      const data = snapshot.data();

      // Recursively convert Timestamps back to Dates within the nested results array.
      const results = (data.results || []).map((res: any): UserResult => {
         if (res.event) {
            res.event.date = dateFromFireStore(res.event.date);
         }
         return res as UserResult;
      });

      return {
         ...data,
         results: results,
      } as UserData;
   },
};
