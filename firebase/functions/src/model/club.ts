/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { makeClubKey } from '../club/club-index.js';

export interface Club {
  key: string;
  name: string;
  nationality: string;
  numEvents: number;
  numSplits: number;
  lastEvent: Date;
}

export function createClub(partialClub: Partial<Club>): Club {
  const defaults: Club = {
    key: 'defaultkey--',
    name: 'DEFAULTCLUB',
    nationality: 'XXX',
    numEvents: 0,
    numSplits: 0,
    lastEvent: new Date(),
  };

  const club = { ...defaults, ...partialClub };

  // If name and nationality are provided (or defaulted), generate the key
  if (club.name && club.nationality) {
    club.key = makeClubKey(club.name, club.nationality);
  }

  return club;
}
