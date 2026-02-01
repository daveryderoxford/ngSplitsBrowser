// scripts/import-users.js

import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getAuth, UserImportRecord } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";
import { defineSecret } from "firebase-functions/params";

const IMPORT_FILE_PATH = 'users-export.json';
const SIGNER_KEY = defineSecret("SIGNER_KEY");
const SALT_SEPARATOR = defineSecret("SALT_SEPARATOR");

export const importUsers = onCall<void>({ cors: true, secrets: [SIGNER_KEY, SALT_SEPARATOR] }, async (request) => {

   const auth = getAuth();
   const HASH_CONFIG = {
      algorithm: 'SCRYPT' as const,
      // IMPORTANT: These parameters must come from the SOURCE project (where the users were exported from).
      // Do NOT use the keys from the target project.
      // Find them in Firebase Console (Source Project) -> Authentication -> Users -> 3 dots -> Password hash parameters
      key: Buffer.from(SIGNER_KEY.value(), 'base64'),
      saltSeparator: Buffer.from(SALT_SEPARATOR.value(), 'base64'),
      rounds: 8,
      memoryCost: 14,
   };

   try {
      const bucket = getStorage().bucket();
      const file = bucket.file(IMPORT_FILE_PATH);
      const [exists] = await file.exists();

      if (!exists) {
         throw new Error(`Import file not found at ${IMPORT_FILE_PATH}`);
      }

      const [content] = await file.download();
      const usersFromFile = JSON.parse(content.toString());

      console.log(`Loaded ${usersFromFile.length} users from file. Starting import...`);


      // Delete existing users to avoid duplicates
      const uids = usersFromFile.map((u: any) => u.uid);
      const del = await auth.deleteUsers(uids);
      console.log(`Import result:  Deleting users: ${del.successCount} Failures: ${del.failureCount} Errors: ${del.errors}`);

      // Transform JSON data into UserImportRecord format
      const usersToImport = usersFromFile.map((user: any) => {

         const importRecord: UserImportRecord = {
            uid: user.uid,
            email: user.email,
            emailVerified: user.emailVerified,
            displayName: user.displayName,
            photoURL: user.photoURL,
            disabled: user.disabled,
            phoneNumber: user.phoneNumber,
            providerData: user.providerData, // Google provider data is compatible as-is
            customClaims: user.customClaims,
         };

         // Handle Password Users
         if (user.passwordHash) {
            // Convert base64 strings back to Buffers for the SDK
            importRecord.passwordHash = Buffer.from(user.passwordHash, 'base64');
            importRecord.passwordSalt = user.passwordSalt ? Buffer.from(user.passwordSalt, 'base64') : undefined;
         }

         return importRecord;
      });

      const result = await auth.importUsers(usersToImport, { hash: HASH_CONFIG });

      console.log(`Import result:  Sucess: ${result.successCount} Failures: ${result.failureCount} Errors: ${result.errors}`);

   } catch (error) {
      console.error('Error importing users:', error);
      throw new HttpsError('internal', 'Failed to import users', error);
   }
});
