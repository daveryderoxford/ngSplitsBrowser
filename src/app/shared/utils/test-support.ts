/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable, inject } from '@angular/core';


@Injectable()
export class SBTestSupport {
      private auth = inject(AngularFireAuth);
}
