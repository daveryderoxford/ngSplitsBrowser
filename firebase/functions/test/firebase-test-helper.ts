// Test helpers to initialise Firebase to use the emulator and never a live database.
import test from 'firebase-functions-test';
import { initializeApp, getApps, deleteApp } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { beforeAll, afterAll, afterEach } from 'vitest';
import { getStorage, Storage } from 'firebase-admin/storage';
import { CallableRequest } from 'firebase-functions/v2/https';
import { DecodedIdToken } from 'firebase-admin/auth';

// Set environment variables to use emulators.
// This ensures that tests do not interact with live production data.
process.env['FIRESTORE_EMULATOR_HOST'] = 'localhost:8080';
process.env['FIREBASE_AUTH_EMULATOR_HOST'] = 'localhost:9099';
export const projectId = 'demo-splitsbrowser-b5948';
process.env['GCLOUD_PROJECT'] = projectId;

export const testEnv = test({ projectId });

type FunctionsModule = typeof import('../src/index.js');

export interface TestContext {
	db: Firestore;
	storage: Storage;
	myFunctions: FunctionsModule;
}

/**
 * Initialises Firebase enulator, lazy-loading of functions.
 */
export function initialiseFirebaseEmulator(): TestContext {
	const context: Partial<TestContext> = {};

	beforeAll(async () => {
		initializeApp({ 
			projectId, 
			storageBucket: `splitsbrowser-b5948.appspot.com`
		});
		context.db = getFirestore();
		context.storage = getStorage();
		// Dynamically import functions only after the app is initialized. 
		// Avoids initialisation function being called
		context.myFunctions = await import('../src/index.js');
	});

	afterAll(async () => {
		testEnv.cleanup();
		// Ensure the app is deleted to prevent state leakage between test files.
		if (getApps().length) {
			await deleteApp(getApps()[0]);
		}
	});

	afterEach(async () => {
		// Using the recommended method for clearing the emulator, 
		// is faster but has been found to casuse intermittenmt failure of tests
		// TODO Maybe look into using this later
		// testEnv.clearFirestore();
		try {
			await claenFirestoreDatabase(context);
		} catch (error: any) {
			console.log('\n ****** afterEach:  Error in aftereach\n', error.toString());
		}
	});

	return context as TestContext;
}

/** 
Deletes all Firestore collections.
The offical method to delete Firestore emulator collections 
is testEnv.clearFirestore() but it has been found to casuse 
intermittenmt failure of tests
*/
async function claenFirestoreDatabase(context: Partial<TestContext>) {
	const db = context.db!;
	const collections = await db.listCollections();
	for (const collection of collections) {
		await db.recursiveDelete(collection);
	}
}

/** Creates a mock Cloud functionsV2 callable request */
export function mockV2CallableRequest<T>(data: T, uid = 'auth-user-id'): CallableRequest<T> {
	const request: CallableRequest<T> = {
		data: data,
		auth: { uid: uid, token: {} as DecodedIdToken },
	} as CallableRequest<T>;
	return request
}

/**
 * Mocks an HTTP request and response for testing onRequest functions.
 * @param method The HTTP method (e.g., 'POST', 'GET').
 * @param body The request body.
 * @returns A mock request and a mock response handler.
 */
export function mockHttpRequest(method: string, body: any, query: any = {}, headers: any = {}) {
	const req = {
		method,
		body,
		query,
		headers,
		get: (header: string) => headers[header] || headers[header.toLowerCase()],
	};

	let status = 200;
	let sentBody: any;

	const res = {
		status: (s: number) => {
			status = s;
			return res;
		},
		send: (b: any) => {
			sentBody = b;
		},
		json: (b: any) => {
			sentBody = b;
		},
		set: (field: string, value: any) => { },
		setHeader: (field: string, value: any) => { },
		getHeader: (field: string) => { },
		on: (event: string, cb: any) => { },
		getSent: () => ({ status, body: sentBody }),
	};

	return { req, res };
}