/** Async function to load a file from disk returning text string containing file contents */

export class Utils {

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
            str = str + '-';
        }
        return str;
    }

    static decreasingTimeIndex(dateStr: string): string {
        const d1 = new Date('2050-01-01 00:00:00').getTime() / 1000;
        const d2 = new Date(dateStr).getTime() / 1000;
        const minusDate = d1 - d2;

        const str = Utils.padRight(minusDate.toString(), 15)
        return (str);
    }

    static encodeAsFirebaseKey(string) {
        return string.replace(/\%/g, '%25')
            .replace(/\./g, '%2E')
            .replace(/\#/g, '%23')
            .replace(/\$/g, '%24')
            .replace(/\//g, '%2F')
            .replace(/\[/g, '%5B')
            .replace(/\]/g, '%5D');
    };

    static getClubIndex(club: string, nationality: string): string {
        return (Utils.padRight(club.toLowerCase(), 10) + Utils.padRight(nationality, 3));
    }

    static getClubKey(club: string, nationality: string): string {
        let key = Utils.getClubIndex(club, nationality);
        key = Utils.encodeAsFirebaseKey(key);
        return (key);
    }
}
