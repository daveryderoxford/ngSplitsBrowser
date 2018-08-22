/** Competitor data stored in database principally for search purposes
 * eventkey and ecardid uniquely identifies the result.
 * for events without a ecardId the ecard is formed using class + position
*/
export interface CompetitorSearchData {
    eventKey: string;
    ecardId: string;
    first: string;
    surname: string;
    club: string;
}
