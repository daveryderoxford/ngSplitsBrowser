
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';


@Injectable()
class SBTestSupport {

    static testFirebaseConfig = {
        apiKey: "AIzaSyCht99i3Nsn0WNv8t6skBaq1GY-xlHoZoY",
        authDomain: "splitsbrowsertest.firebaseapp.com",
        databaseURL: "https://splitsbrowsertest.firebaseio.com",
        projectId: "splitsbrowsertest",
        storageBucket: "splitsbrowsertest.appspot.com",
        messagingSenderId: "751003486699"
    };

    constructor(private auth: AngularFireAuth) {

    }
    


}
