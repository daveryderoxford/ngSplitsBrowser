export class SplitsbrowserException {
    public name: string ='';

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
