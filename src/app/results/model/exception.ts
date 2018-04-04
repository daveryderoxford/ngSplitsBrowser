export class SplitsBrowserException {
    protected name: string;

    constructor(protected message: string) {
        this.message = message;
    }

    public toString(): string {
        return this.name + ": " + this.message;
    };
}

export class InvalidData extends SplitsBrowserException {

    constructor(message: string) {
        super(message);
        this.name = "InvalidData";
    }
}

export class WrongFileFormat extends SplitsBrowserException {

    constructor(message) {
        super(message);
        this.name = "WrongFileFormat";
    }
}
