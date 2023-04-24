/**
 * Splitsbrowser Google clould functions exports
 */
import * as admin from "firebase-admin";
import * as sysAdmin from "./admin/admin";
import * as user from "./user/user";


const firebaseAdmin = admin.initializeApp();

export const grantAdmin = sysAdmin.grantAdmin;

export const createUser = user.createUser;
export const deleteUsser = user.deleteUser;
