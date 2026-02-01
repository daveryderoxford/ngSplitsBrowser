/**
 * Splitsbrowser Google clould functions exports
 */
import "./firebase-config.js";
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

export {
   getResultsFile,
   saveResultsFile,
} from "./results/results.js"

export {
   resultsProxy
} from "./proxy.js";

export {
   uploadResults
} from "./results/uploadResultsHttp.js";

export {
   importUsers
} from './user/import_users.js'; 

export {
   exportUsers
} from './user/export_users.js';
