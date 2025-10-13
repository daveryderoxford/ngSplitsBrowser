
import type {User} from '@firebase/auth';

export function resultsPath( userId: string, key: string) {

   const path = isInteger(key) ? 
      `results/legacy/${key}` : 
      `results/${userId}/${key}-results`;

   return path;

}

/**
 * Checks if a string contains only digits.
 * @param value The string to check.
 * @returns `true` if the string is a valid integer, `false` otherwise.
 */
function isInteger(value: string): boolean {
   return /^\d+$/.test(value);
}