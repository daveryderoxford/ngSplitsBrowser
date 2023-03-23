import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogsService } from './shared';

/** Global error handler */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

   private zone: NgZone = this.injector.get( NgZone );
   private ds: DialogsService = this.injector.get( DialogsService );
   private snackBar: MatSnackBar = this.injector.get( MatSnackBar );

   // Error handling is important and needs to be loaded first.
   // Because of this we should manually inject the services with Injector.
   constructor (private injector: Injector) { }


   handleError( error: Error | HttpErrorResponse ) {

      // Always log errors
      // TODO add logging on server
     // logger.logError( message, stackTrace );

      console.error( error );

      if ( error instanceof HttpErrorResponse ) {
         this._handleHTTPError( error );
      } else if ( error.message && error.message.startsWith("ExpressionChangedAfterItHasBeenCheckedError" )) {
         this._showError( error );
      } else {
         this._showError(error);
      }
   }

   private _showError( error: Error ) {
      if (this.ds) {
         this.zone.run( () =>
            this.ds.message(
               error?.name,
               `Message ${error?.message || 'Undefined client error'} \n ${error?.stack}` ));
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
            this._showError( error );
            break;
         case 404: // Not found
            this._showError( error );
            break;
         case 400: // bad request
            this._showError( error );
            break;
         case 408: // Request timeout
            this._showError( error );
            break;
         default:
            this._refreshPageMessage();
      }
   }
}
