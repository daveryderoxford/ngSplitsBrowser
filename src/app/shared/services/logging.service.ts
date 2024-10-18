import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {
  error( message: string, stack: string ) {
    console.error( message);
  }

 warn( message: string, stack: string ) {
    console.warn( message );
  }

  message( message: string, stack: string ) {
    console.warn( message );
  }

}
