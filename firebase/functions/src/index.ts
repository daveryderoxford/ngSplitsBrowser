/**
 * Splitsbrowser Google clould functions exports
 */
import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import * as sysAdmin from "./admin/admin";
import * as clubIndex from "./club-index";
import * as user from "./user/user";

const firebaseAdmin = admin.initializeApp();

export const eventClubReferencesCreate = clubIndex.created;
export const eventClubReferencesUpdate = clubIndex.updated;
export const eventClubReferencesDelete = clubIndex.deleted;
export const rebuildClubs = clubIndex.rebuildClubs;

export const grantAdmin = sysAdmin.grantAdmin;

export const createUsder = user.createUser;
export const deleteUsder = user.deleteUser;
