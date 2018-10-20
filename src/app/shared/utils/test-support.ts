
import { AngularFireAuth } from '@angular/fire/auth';
import { Injectable } from '@angular/core';


@Injectable()
export class SBTestSupport {


    constructor(private auth: AngularFireAuth) {

    }
}
