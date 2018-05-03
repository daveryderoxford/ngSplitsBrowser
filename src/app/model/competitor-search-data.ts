/** Competitor data stored in database principally for search purposes */
export interface CompetitorSearchData {
    key: string;   // Formed from Event and ecard.
    eventKey: string;
    ecardId: string;
    first: string;
    surname: string;
    club: string;
}
