class BaseException {
    protected name: string;

    constructor(protected message: string) {
        this.message = message;
    }

    public toString(): string {
        return this.name + ": " + this.message;
    }
}

export class UnexpectedError extends BaseException {
    constructor(message: string) {
        super(message);
        this.name = "UnexpectedError";
    }
}

export class InvalidData extends BaseException {

    constructor(message: string) {
        super(message);
        this.name = "InvalidData";
    }
}

export class WrongFileFormat extends BaseException {

    constructor(message) {
        super(message);
        this.name = "WrongFileFormat";
    }
}
