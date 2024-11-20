/** Various utility functions for Splitsbrowser */
import uniqBy from 'lodash/uniqBy';

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

   /** Pad a string to a specified length by adding char on the right of it.
    * char defaults to - if it is not specified
    */
   static padRight(str: string, length: number, char = '-'): string {
      while (str.length < length) {
         str = str + char;
      }
      return str;
   }

   /** Remove duplicate objects from an array based on the object property values*/
   static removeDuplicates(array: Array<Object>): Array<Object> {
      return uniqBy(array, function (object) {
         return JSON.stringify(object);
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

   static isInStandaloneMode = () =>
      (window.matchMedia('(display-mode: standalone)').matches) ||
      ((window.navigator as any).standalone) ||
      document.referrer.includes('android-app://')
}
