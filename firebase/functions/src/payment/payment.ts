/**

 */
'use strict';

/** Stripe customer - used to store Stripe transactions and tokens that point to credit cards */
export interface StripeCustomer {
   email: string;         // Email is used to link the Stripe customer with a user
   customer_id: string;
}

/** Payment via Stripe */
export interface StripePayment {
   amount: number;
   currency: object;
   customer: object;
   source?: string;
}

import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
// import * as logging from '@google-cloud/logging';

const stripe = require( 'stripe' )( functions.config().stripe.testkey );

const currency = functions.config().stripe.currency || 'USD';

/**  Charge the Stripe customer whenever a charge object is created in Cloud Firestore */
export const createStripeCharge = functions.firestore
   .document( 'stripe_customers/{userId}/charges/{id}' )
   .onCreate( async ( snap, context ) => {

      const val = snap.data();
      try {
         // Look up the Stripe customer id written in createStripeCustomer
         const snapshot = await admin.firestore().collection( `stripe_customers` ).doc( context.params.userId ).get();
         const snapval = snapshot.data();
         const customer = snapval.customer_id;

         // Create a charge using the pushId as the idempotency key protecting against double charges
         const amount = val.amount;
         const idempotencyKey = context.params.id;
         const charge: StripePayment = { amount, currency, customer };
         if ( val.source !== null ) {
            charge.source = val.source;
         }
         const response = await stripe.charges.create( charge, { idempotency_key: idempotencyKey } );
         // If the result is successful, write it back to the database
         return snap.ref.set( response, { merge: true } );
      } catch ( error ) {
         // We want to capture errors and render them in a user-friendly way, while
         // still logging an exception with StackDriver
         console.log( error );
         await snap.ref.set( { error: userFacingMessage( error ) }, { merge: true } );
         return reportError( error, { user: context.params.userId } );
      }
   } );

// When a user is created, register them with Stripe
export const createStripeCustomer = functions.auth.user().onCreate( async ( user ) => {
   const customer = await stripe.customers.create( { email: user.email } );
   return admin.firestore().collection( 'stripe_customers' ).doc( user.uid ).set( { customer_id: customer.id } );
} );

// Add a payment source (card) for a user by writing a stripe payment source token to Cloud Firestore
export const addPaymentSource = functions.firestore
   .document( '/stripe_customers/{userId}/tokens/{pushId}' )
   .onCreate( async ( snap, context ) => {

      const source = snap.data();
      const token = source.token;
      if ( source === null ) {
         return null;
      }

      try {
         const snapshot = await admin.firestore().collection( 'stripe_customers' ).doc( context.params.userId ).get();
         const customer = snapshot.data().customer_id;
         const response = await stripe.customers.createSource( customer, { source: token } );
         return admin.firestore().collection( 'stripe_customers' )
                     .doc( context.params.userId )
                     .collection( "sources" )
                     .doc( response.fingerprint )
                     .set( response, { merge: true } );

      } catch ( error ) {
         await snap.ref.set( { 'error': userFacingMessage( error ) }, { merge: true } );
         return reportError( error, { user: context.params.userId } );
      }
   } );

// When a user deletes their account, clean up after them
export const cleanupUser = functions
            .auth.user()
            .onDelete( async ( user ) => {

   const snapshot = await admin.firestore().collection( 'stripe_customers' ).doc( user.uid ).get();
   const customer = snapshot.data();
   await stripe.customers.del( customer.customer_id );
   return admin.firestore().collection( 'stripe_customers' ).doc( user.uid ).delete();
} );

// To keep on top of errors, we should raise a verbose error report with Stackdriver rather
// than simply relying on console.error. This will calculate users affected + send you email
// alerts, if you've opted into receiving them.
// [START reporterror]
function reportError( err, context = {} ) {
   console.error( err);
/*   // This is the name of the StackDriver log stream that will receive the log
   // entry. This name can be any valid log stream name, but must contain "err"
   // in order for the error to be picked up by StackDriver Error Reporting.
   const logName = 'errors';
   const log = logging.log( logName );

   // https://cloud.google.com/logging/docs/api/ref_v2beta1/rest/v2beta1/MonitoredResource
   const metadata = {
      resource: {
         type: 'cloud_function',
         labels: { function_name: process.env.FUNCTION_NAME },
      },
   };

   // https://cloud.google.com/error-reporting/reference/rest/v1beta1/ErrorEvent
   const errorEvent = {
      message: err.stack,
      serviceContext: {
         service: process.env.FUNCTION_NAME,
         resourceType: 'cloud_function',
      },
      context: context,
   };

   // Write the error log entry
   return new Promise( ( resolve, reject ) => {
      log.write( log.entry( metadata, errorEvent ), ( error ) => {
         if ( error ) {
            return reject( error );
         }
         return resolve();
      } );
   } ); */
}

// Sanitize the error message for the user
function userFacingMessage( error ): string {
   return error.type ? error.message : 'An error occurred, developers have been alerted';
}
