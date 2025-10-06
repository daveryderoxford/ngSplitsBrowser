/**
 * Splitsbrowser Google clould functions exports
 */
import { getApps, initializeApp } from "firebase-admin/app";  // Need to explicitly reference app for ESM 

if (getApps().length === 0) {
   const app = initializeApp();
   console.log('Initialized Firebase app: ' + app.name);
}

export {
   clubsEventCreated,
   clubsEventUpdated,
   clubsEventDeleted,
   rebuildClubs,
} from "./club/club-index.js";

export { 
   createUser, 
   deleteUser 
} from "./user/user.js";
