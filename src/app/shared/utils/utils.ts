/** Various utility functions for Splitsbrowser */
export class Utils {

    /** Async function to load a file from disk returning text string containing file contents */
    static async loadTextFile(file: File): Promise<string> {

        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event: any) => {
                const text = event.target.result;
                resolve(text);
            };

            reader.onerror = () => {
                reject(reader.error);
            };

            reader.readAsText(file);

        });
    }

    static padRight(str: string, length: number): string {
        while (str.length < length) {
            str = str + "-";
        }
        return str;
    }

    /** Remove duplicate items from an array */
    static removeDuplicates<T>(array: Array<T>): Array<T> {
        return array.filter((result, index) => {
            return array.indexOf(result) === index;
        });
    }

    /** Normalise a Firebase key */
    static encodeAsKey(string) {
        return string.replace(/\%/g, "%25")
            .replace(/\./g, "%2E")
            .replace(/\#/g, "%23")
            .replace(/\$/g, "%24")
            .replace(/\//g, "%2F")
            .replace(/\[/g, "%5B")
            .replace(/\]/g, "%5D");
    }
}


