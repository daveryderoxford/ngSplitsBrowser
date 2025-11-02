
import { CallableRequest } from "firebase-functions/v2/https";
type AuthData = CallableRequest['auth'];

export const SUPER_USER_UID = 'l8Rex76EDGTME2i44gbpcF7EKOH2';

export function isAdmin(uid: string): boolean {
   return uid === SUPER_USER_UID;
}

export function isAuthorised(userId: string, auth: AuthData): boolean {
   return auth ?
      isAdmin(auth.uid) || auth.uid === userId :
      false;
}
