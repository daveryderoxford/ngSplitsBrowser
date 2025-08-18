/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { getAuth } from "firebase-admin/auth";
import { HttpsError, onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";

// This ensures the admin SDK is initialized.
// It's safe to call this multiple times.
try {
  initializeApp();
} catch (e) {
  logger.info("Firebase Admin SDK already initialized.");
}

/**
 * Sets the 'admin' custom claim for a user, granting them admin privileges.
 *
 * This function is callable only by users who are already authenticated admins.
 * It expects a data payload containing the email of the user to be promoted.
 *
 * @param {object} data The data passed to the function, expecting `data.email`.
 * @param {onCall.CallableContext} context The context of the call, including auth information.
 * @throws `permission-denied` if the caller is not an admin.
 * @throws `invalid-argument` if the email is missing or invalid.
 * @throws `not-found` if the target user's email does not exist.
 * @throws `internal` for any other errors.
 */
export const setAdminClaim = onCall(async (request) => {
  // Check if the user calling the function is an admin.
  if (request.auth?.token?.admin !== true) {
    logger.error("Request to set admin claim without admin privileges", { uid: request.auth?.uid });
    throw new HttpsError("permission-denied", "You must be an admin to perform this action.");
  }

  // Validate the incoming data for a user's email.
  const email = request.data.email;
  if (typeof email !== "string" || email.length === 0) {
    throw new HttpsError("invalid-argument", "The function must be called with a valid 'email' argument.");
  }

  try {
    // Get the user record by email and set the custom claim.
    const user = await getAuth().getUserByEmail(email);
    await getAuth().setCustomUserClaims(user.uid, { admin: true });
    logger.info(`Successfully set admin claim for user: ${email} (${user.uid}) by admin: ${request.auth.uid}`);
    return { result: `Successfully made ${email} an admin.` };
  } catch (error: any) {
    logger.error(`Error setting admin claim for ${email}:`, error);
    throw new HttpsError(error.code === 'auth/user-not-found' ? 'not-found' : 'internal', error.message);
  }
});
