import { CallableRequest } from 'firebase-functions/v2/https';

const SUPER_USER_UID = 'l8Rex76EDGTME2i44gbpcF7EKOH2';

export function isAdmin(uid: string): boolean {
   return uid === SUPER_USER_UID;
}

export function isAuthorised(userId: string, request: CallableRequest): boolean {
   return request.auth ? 
      isAdmin(request.auth.uid) || request.auth.uid === userId : 
      false;
}
