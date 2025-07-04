/**
 * Splitsbrowser Google clould functions exports
 */
import { getApps, initializeApp } from "firebase-admin/app";  // Need to explicitly reference app for ESM 

if (getApps().length === 0) {
   const app = initializeApp();
   console.log('Initialized Firebase app: ' + app.name);
}

// Export functions from their respective modules with clearer, grouped exports.
export {
   clubsEventCreated,
   clubsEventUpdated,
   clubsEventDeleted,
   rebuildClubs,
} from "./club/club-index.js";

export { grantAdmin } from "./admin/admin.js";

export { createUser, deleteUser } from "./user/user.js";
