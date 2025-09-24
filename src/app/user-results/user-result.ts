import { CourseSummary, EventInfo, OEvent } from 'app/events/model/oevent';
import { Competitor } from 'app/results/model';

export interface UserResult {
   key: string;
   event: EventInfo;
   ecardId: string;
   firstname: string;
   surname: string;
   club: string;
   totalTime: number;
   course: {
      name: string;
      distance: number;
      climb: number;
      numCompetitors: number;
      winner: string;
      winningTime: number;
      position: number;
   },
   oclass?: {
      position: number;
      numCompetitors: number;
      winner: string;
      winningTime: number;
   }
}

export function createUserResult(oevent: OEvent,
   competitor: Competitor): UserResult {

   const oclass = competitor.courseClass;
   const course = oclass?.course;

   const courseWinner = course?.competitors[0];
   const classWinner = oclass?.competitors[0];

   return {
      key: `${oevent.key}-${competitor.key}`,
      ecardId: competitor.ecardId || '',
      event: eventInfo(oevent),
      firstname: competitor.firstname,
      surname: competitor.surname,
      club: competitor.club,
      totalTime: competitor.totalTime,
      course: {
         name: course.name || '',
         distance: course.length || 0,
         climb: course.climb || 0,
         numCompetitors: course.competitors.length,
         winner: courseWinner.name || '',
         winningTime: courseWinner.totalTime || 0,
         position: competitor.coursePosition,
      },
      oclass: {
         position: competitor.classPosition,
         numCompetitors: oclass.competitors.length,
         winner: classWinner?.name || '',
         winningTime: classWinner?.totalTime || 0,
      }
   };

   function eventInfo(event: OEvent): EventInfo {
      return({
         name: event.name,
         nationality: event.nationality,
         date: event.date,
         club: event.club,
         grade: event.grade,
         type: event.type,
         discipline: event.discipline,
         webpage: event.webpage,
         email: event.email,
         controlCardType: event.controlCardType,
      })
   }
}
