/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { FirebaseError } from '@angular/fire/app';

/**
 * Translates Firebase authentication error codes into human-readable messages.
 * @param error The FirebaseError object.
 * @returns A human-readable error message.
 */
export function getFirebaseErrorMessage(error: FirebaseError): string {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'This email address is already in use by another account.';
    case 'auth/invalid-email':
      return 'The email address is not valid.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled. Please contact support.';
    case 'auth/weak-password':
      return 'The password is too weak. Please choose a stronger password.';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/user-not-found':
    case 'auth/wrong-password': // Often used for login failures where you don't want to reveal if email exists
    case 'auth/invalid-credential': // Newer generic credential error
      return 'Invalid email or password.';
    case 'auth/requires-recent-login':
      return 'This operation requires recent authentication. Please log in again.';
    default:
      console.error('Unhandled Firebase error code:', error.code, error.message);
      return 'An unexpected error occurred. Please try again.';
  }
}
