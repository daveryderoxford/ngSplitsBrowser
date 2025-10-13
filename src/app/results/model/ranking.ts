import { Competitor } from "./competitor";
import { sbTime } from "./time";

/**
 * The standard value used to represent an unranked position or rank.
 */
export const UNRANKED_VALUE = 999;

/**
 * Calculates and sets the overall position for a list of competitors.
 * handling ties and competiors that did not complete the course.
 * @param competitors List of competitorts sorted by total time
 * @param setPosition A callback to set the position on the competitor.
 */
export function calculatePositions(competitors: Competitor[],
  setPosition: (competitor: Competitor, position: number) => void) {

  const sorted = [...competitors].sort(Competitor.compareCompetitors);

  let currentPosition = 1;
  let previousTime: sbTime = -1;

  for (const [index, comp] of sorted.entries()) {
    if (comp.completed()) {
      if (comp.totalTime !== previousTime) {
        currentPosition = index + 1;
      }
      setPosition(comp, currentPosition);
      previousTime = comp.totalTime;
    } else {
      setPosition(comp, UNRANKED_VALUE);
    }
  }
}
