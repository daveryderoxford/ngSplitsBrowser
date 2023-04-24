
// Utility functions to from routegadget URLs

export function reotegadgetURL( baseURL: string, eventId?: string): string {

   return eventId ? baseURL + "rg2#" + eventId : baseURL + "rg2";
}

export function reotegadgetMapURL( baseURL: string, mapId: string): string {
   return baseURL + "karta/" + mapId;
}