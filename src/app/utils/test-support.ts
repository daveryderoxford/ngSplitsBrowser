
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';


@Injectable()
class SBTestSupport {


    constructor(private auth: AngularFireAuth) {

    }
}
