/**
 * Splitsbrowser Google clould functions exports
 */
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as sysAdmin from "./admin/admin";
import * as clubIndex from "./club-index";
import * as entry from "./entry/entry";
import { Fixtures } from "./fixtures/fixtures";
import * as user from "./user/user";


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

export const grantAdmin = sysAdmin.grantAdmin;

export const createEntry = entry.createEntry;
export const deleteEntry = entry.deleteEntry;
export const changeEntry = entry.changeClass;

export const createUsder = user.createUser;
export const deleteUsder = user.deleteUser;
