type ISODateString = string;

export interface Club {
  key: string;
  name: string;
  nationality: string;
  numEvents: number;
  lastEvent: ISODateString;
}
