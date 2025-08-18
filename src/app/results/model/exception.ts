/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
export class SplitsbrowserException {
    public name: string;

    constructor(public message: string) {
        this.message = message;
    }

    public toString(): string {
        return this.name + ": " + this.message;
    }
}

export class UnexpectedError extends SplitsbrowserException {
    constructor(message: string) {
        super(message);
        this.name = "UnexpectedError";
    }
}

export class InvalidData extends SplitsbrowserException {

    constructor(message: string) {
        super(message);
        this.name = "InvalidData";
    }
}

export class WrongFileFormat extends SplitsbrowserException {

    constructor(message: string) {
        super(message);
        this.name = "WrongFileFormat";
    }
}
