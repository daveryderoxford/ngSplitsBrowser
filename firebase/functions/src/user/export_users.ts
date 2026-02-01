import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

const EXPORT_FILE_PATH = 'users-export.json';

export const exportUsers = onCall<void>(async (request) => {
  
  console.log('Starting user export...');
  const usersToExport: any[] = [];

  try {

    const auth = getAuth();

    const list = await auth.listUsers();

    for (const user of list.users) {

      const userData = {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName,
        photoURL: user.photoURL,
        disabled: user.disabled,
        phoneNumber: user.phoneNumber,
        // Export password hash/salt if available (base64 strings)
        passwordHash: user.passwordHash,
        passwordSalt: user.passwordSalt,
        // Export provider data (e.g. Google)
        providerData: user.providerData.map((provider) => ({
          uid: provider.uid,
          displayName: provider.displayName,
          email: provider.email,
          photoURL: provider.photoURL,
          providerId: provider.providerId,
        })),
        customClaims: user.customClaims,
      };

      usersToExport.push(userData);
    }

    const bucket = getStorage().bucket();
    await bucket.file(EXPORT_FILE_PATH).save(JSON.stringify(usersToExport, null, 2), {
      contentType: "application/json",
    });
    console.log(`Successfully exported ${usersToExport.length} users to ${EXPORT_FILE_PATH}`);

  } catch (error) {
    console.error('Error exporting users:', error);
    throw new HttpsError('internal', 'Failed to export users', error);
  }
});