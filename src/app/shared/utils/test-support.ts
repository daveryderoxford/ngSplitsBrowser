
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';


@Injectable()
export class SBTestSupport {


    constructor(private auth: AngularFireAuth) {

    }
}
