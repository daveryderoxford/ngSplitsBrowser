
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable( {
  providedIn: 'root'
} )
export class PaymentService {

  userId: string;

  constructor ( private afs: AngularFirestore, private afAuth: AngularFireAuth ) {
    this.afAuth.authState.subscribe( ( auth ) => {
      if ( auth )  {
        this.userId = auth.uid;
      }
    } );
  }


  async processPayment( token: any, amount: number ): Promise<void> {
    const payment = { token, amount };

    // this.afs.doc(''

  //  return this.db.list( `/payments/${this.userId}` ).push( payment )
  }

}
