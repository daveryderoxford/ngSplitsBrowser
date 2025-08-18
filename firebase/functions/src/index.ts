/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
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
