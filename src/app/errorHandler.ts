import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';


/** Global error handler */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

   // Error handling is important and needs to be loaded first.
   // Because of this we should manually inject the services with Injector.
   constructor ( private injector: Injector ) { }

   snackBar = this.injector.get( MatSnackBar );
//   router = this.injector.get( Router );

   handleError( error: Error | HttpErrorResponse ) {

      // Always log errors
      // TODO add logging on server
     // logger.logError( message, stackTrace );

      console.error( error );

      if ( error instanceof HttpErrorResponse ) {
         this._handleHTTPError( error );
      } else if ( error.message && error.message.startsWith("ExpressionChangedAfterItHasBeenCheckedError" )) {

      } else {
         this._showError("An unexpected error occurred");
      }
   }

   private _showError( message: string ) {
      if ( this.snackBar ) {
         this.snackBar.open( message, "Dismiss", {} );
      }
   }

   private _refreshPageMessage() {
      if ( this.snackBar ) {
         this.snackBar.open( "An error occurred processing request", "Refresh", {} ).onAction().subscribe( () => {
            location.reload();
         });
      }
   }

   private _handleHTTPError( error: HttpErrorResponse ) {

      const httpErrorCode = error.status;

      switch ( httpErrorCode ) {
         case 401:  // Unauthorised navigate to login page if not logged in.
         //   this.router.navigateByUrl( "/login" );
            break;
         case 403: // Forbidden
            this._showError( error.message );
            break;
         case 404: // Not found
            this._showError( error.message );
            break;
         case 400: // bad request
            this._showError( error.message );
            break;
         case 408: // Request timeout
            this._showError( error.message );
            break;
         default:
            this._refreshPageMessage();
      }
   }
}
