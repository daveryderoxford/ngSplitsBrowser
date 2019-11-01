/**
 * Splitsbrowser Google clould functions exports
 */

import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as clubIndex from "./club-index";
import { Fixtures } from "./fixtures/fixtures";
import * as mapReg from "./fixtures/mapRegistration";
import * as sysAdmin from "./admin/admin";


const firebaseAdmin = admin.initializeApp();

/** Run to perfrom maintenance tasks once/day */
export const maintenance = functions.pubsub.topic( 'maintenance' ).onPublish( async ( message ) => {

   console.log( "Maintenance task starting");

   try {
      await new Fixtures(firebaseAdmin.storage()).processFixtures();
   } catch ( e ) {
      console.error( "Maintainance task error:  " + e.toString() );
   }
});

export const eventClubReferencesCreate = clubIndex.created;
export const eventClubReferencesUpdate = clubIndex.updated;
export const eventClubReferencesDelete = clubIndex.deleted;
export const rebuildClubs = clubIndex.rebuildClubs;

export const userUpdated = mapReg.userUpdated;

export const grantAdmin = sysAdmin.grantAdmin;
