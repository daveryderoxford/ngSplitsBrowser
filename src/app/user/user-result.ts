/*! 
*  @license
*  Copyright (C) 2025 Dave Ryder, Reinhard Balling, Andris Strazdins, Ed Nash, Luke Woodward
*  Use of this source code is governed by an MIT-style license that can be
*  found in the LICENSE file at https://github.com/daveryderoxford/ngSplitsBrowser/blob/master/LICENSE
*/
import { OEvent } from 'app/events/model/oevent';
import { Competitor } from 'app/results/model';

export interface UserResult {
   ecardId: string;
   event: OEvent;
   firstname: string;
   surname: string;
   club: string;
   result: {
      course: string;
      courseclass: string;
      coursePosition: number;
      classPosition: number;
      totalTime: number;
      distance: number;
      climb: number;
      courseWinner: string;
      courseWinningTime: number;
      classWinner: string;
      classWinningTime: number;
   };
}

function createUserResult(eventDetails: OEvent,
   competitor: Competitor): UserResult {

   const oclass = competitor.courseClass;
   const course = oclass?.course;

   const courseWinner = course.competitors[0];
   const classWinner = oclass?.competitors[0];

   return {
      ecardId: competitor.ecardId || '',
      event: eventDetails,
      firstname: competitor.firstname,
      surname: competitor.surname,
      club: competitor.club,
      result: {
         course: course.name,
         courseclass: oclass.name,
         coursePosition: competitor.coursePosition,
         classPosition: competitor.classPosition,
         totalTime: competitor.totalTime,
         distance: course.length || 0,
         climb: course.climb,
         courseWinner: courseWinner?.name || '',
         courseWinningTime: courseWinner?.totalTime || 0,
         classWinner: classWinner?.name || '',
         classWinningTime: classWinner?.totalTime || 0
      }
   };
}
