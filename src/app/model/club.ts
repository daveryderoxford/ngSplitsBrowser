import { ISODateString } from "./date";

export interface Club {
  key: string;
  name: string;
  nationality: string;
  numEvents: number;
  lastEvent: ISODateString;
}
