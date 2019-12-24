import { Component, OnInit, HostListener, Input } from '@angular/core';
import { PaymentService } from '../payment.service';

declare var StripeCheckout;

/** Button component that displays stripe payment dialog that captures card details and saves entry
     details on the headend that triggers charging the card */
@Component( {
   selector: 'make-payment',
   templateUrl: './make-payment.component.html',
   styleUrls: ['./make-payment.component.scss']
} )
export class MakePaymentComponent implements OnInit {
   @Input() amount: number;

   handler: any;

   constructor ( private paymentSvc: PaymentService ) { }

   ngOnInit() {
      this.handler = StripeCheckout.configure( {
         key: 'sk_test_BF573NobVn98OiIsPAv7A04K',
       //  image: '/your/awesome/logo.jpg',
         locale: 'auto',
         token: token => {
            this.paymentSvc.processPayment( token, this.amount );
         }
      } );
   }

   handlePayment() {
      this.handler.open( {
         name: 'Splitsbrowser',
         excerpt: 'Event entry payment',
         amount: this.amount
      } );
   }

   @HostListener( 'window:popstate' )
   onPopstate() {
      this.handler.close();
   }
}
