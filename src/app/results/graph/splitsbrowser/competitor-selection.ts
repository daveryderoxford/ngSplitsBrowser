import * as $ from "jquery";
import { InvalidData } from "../../model/exception";
import { ascending as d3_ascending, range as d3_range } from "d3-array";
import { set as d3_set } from "d3-collection";
import { Competitor } from "app/results/model";

export interface CompetitorDetails {
    crosses: boolean;
    visible: boolean;
    competitor: Competitor;
}
export type  ChangeHandlerFunction = (indices: number[]) => void;
export class CompetitorSelection {

    // tslint:disable-next-line:no-shadowed-variable
    private static NUMBER_TYPE = typeof 0;

    currentIndexes: Array<number> = [];
    changeHandlers: ChangeHandlerFunction[] = [];

    /**
    * Represents the currently-selected competitors, and offers a callback
    * mechanism for when the selection changes.
    * @constructor
    * @sb-param {Number} count - The number of competitors that can be chosen.
    */
    constructor(public count: number) {
        if (typeof count !== CompetitorSelection.NUMBER_TYPE) {
            throw new InvalidData("Competitor count must be a number");
        } else if (count < 0) {
            throw new InvalidData("Competitor count must be a non-negative number");
        }
    }

    /**
    * Returns whether the competitor at the given index is selected.
    * @sb-param {Number} index - The index of the competitor.
    * @sb-returns {boolean} True if the competitor is selected, false if not.
    */
    public isSelected(index: number): boolean {
        return this.currentIndexes.indexOf(index) > -1;
    }

    /**
    * Returns whether the selection consists of exactly one competitor.
    * @sb-returns {boolean} True if precisely one competitor is selected, false if
    *     either no competitors, or two or more competitors, are selected.
    */
    public isSingleRunnerSelected(): boolean {
        return this.currentIndexes.length === 1;
    }

    /**
    * Returns the index of the single selected competitor.
    *
    * If no competitors, or more than two competitors, are selected, null is
    * returned
    *
    * @sb-return {Number|null} Index of the single selected competitor, or null.
    */
    public getSingleRunnerIndex(): number | null {
        return (this.isSingleRunnerSelected()) ? this.currentIndexes[0] : null;
    }

    /**
    * Given that a single runner is selected, select also all of the runners
    * that 'cross' this runner and are also marked as visible.
    * @sb-param {Array} competitorDetails - Array of competitor details to
    *     check within.
    */
    public selectCrossingRunners( competitorDetails: CompetitorDetails[]): void {
        if (this.isSingleRunnerSelected()) {
            const refCompetitor = competitorDetails[this.currentIndexes[0]].competitor;

            competitorDetails.forEach((compDetails, idx: number) => {
                if (compDetails.visible && compDetails.competitor.crosses(refCompetitor)) {
                    this.currentIndexes.push(idx);
                }
            });

            this.currentIndexes.sort(d3_ascending);
            this.fireChangeHandlers();
        }
    }

 /**
  * Select all of the competitors.
  */
    public selectAll(): void {
        this.currentIndexes = d3_range(this.count);
        this.fireChangeHandlers();
    }

    /**
    * Select none of the competitors.
    */
    public selectNone(): void {
        this.currentIndexes = [];
        this.fireChangeHandlers();
    }

    /**
    * Returns an array of all currently-selected competitor indexes.
    * @sb-return {Array} Array of selected indexes.
    */
    public getSelectedIndexes(): Array<number> {
        return this.currentIndexes.slice(0);
    }

    /**
    * Set the selected competitors to those in the given array.
    * @sb-param {Array} selectedIndex - Array of indexes of selected competitors.
    */
    public setSelectedIndexes(selectedIndexes: Array<any>) {
        if (selectedIndexes.every(function (index) { return 0 <= index && index < this.count; }, this)) {
            this.currentIndexes = selectedIndexes;
            this.fireChangeHandlers();
        }
    }

    /**
    * Register a handler to be called whenever the list of indexes changes.
    *
    * When a change is made, this function will be called, with the array of
    * indexes being the only argument.  The array of indexes passed will be a
    * copy of that stored internally, so the handler is free to store this
    * array and/or modify it.
    *
    * If the handler has already been registered, nothing happens.
    *
    * @sb-param {Function} handler - The handler to register.
    */
    public registerChangeHandler( handler: ChangeHandlerFunction) {
        if (this.changeHandlers.indexOf(handler) === -1) {
            this.changeHandlers.push(handler);
        }
    }

    /**
        * Fires all of the change handlers currently registered.
        */
    private fireChangeHandlers() {
        // Call slice(0) to return a copy of the list.
        this.changeHandlers.forEach((handler) => {
            handler(this.currentIndexes.slice(0));
        });
    }

    /**
    * Unregister a handler from being called when the list of indexes changes.
    *
    * If the handler given was never registered, nothing happens.
    *
    * @sb-param {Function} handler - The handler to register.
    */
    public deregisterChangeHandler( handler: ChangeHandlerFunction) {
        const index = this.changeHandlers.indexOf(handler);
        if (index > -1) {
            this.changeHandlers.splice(index, 1);
        }
    }

    /**
    * Toggles whether the competitor at the given index is selected.
    * @sb-param {Number} index - The index of the competitor.
    */
    public toggle(index: number) {
        if (typeof index === CompetitorSelection.NUMBER_TYPE) {
            if (0 <= index && index < this.count) {
                const position = this.currentIndexes.indexOf(index);
                if (position === -1) {
                    this.currentIndexes.push(index);
                    this.currentIndexes.sort(d3_ascending);
                } else {
                    this.currentIndexes.splice(position, 1);
                }

                this.fireChangeHandlers();
            } else {
                throw new InvalidData("Index '" + index + "' is out of range");
            }
        } else {
            throw new InvalidData("Index is not a number");
        }
    }

    /**
    * Selects a number of competitors, firing the change handlers once at the
    * end if any indexes were added.
    * @sb-param {Array} indexes - Array of indexes of competitors to select.
    */
    private bulkSelect(indexes: number[]) {
        if (indexes.some(function (index) {
            return (typeof index !== CompetitorSelection.NUMBER_TYPE || index < 0 || index >= this.count);
        }, this)) {
            throw new InvalidData("Indexes not all numeric and in range");
        }

        // Remove from the set of indexes given any that are already selected.
        const currentIndexSet = d3_set(this.currentIndexes);
        indexes = indexes.filter(function (index) { return !currentIndexSet.has(index); });

        if (indexes.length > 0) {
            this.currentIndexes = this.currentIndexes.concat(indexes);
            this.currentIndexes.sort(d3_ascending);
            this.fireChangeHandlers();
        }
    }

    /**
    * Deselects a number of competitors, firing the change handlers once at the
    * end if any indexes were removed.
    * @sb-param {Array} indexes - Array of indexes of competitors to deselect.
    */
    private bulkDeselect( indexes: number[]) {
        if (indexes.some(function (index) {
            return (typeof index !== CompetitorSelection.NUMBER_TYPE || index < 0 || index >= this.count);
        }, this)) {
            throw new InvalidData("Indexes not all numeric and in range");
        }

        // Remove from the set of indexes given any that are not already selected.
        const currentIndexSet = d3_set(this.currentIndexes);
        let anyRemoved = false;
        for (let i = 0; i < indexes.length; i += 1) {
            if (currentIndexSet.has(indexes[i])) {
                currentIndexSet.remove(indexes[i]);
                anyRemoved = true;
            }
        }

        if (anyRemoved) {
            this.currentIndexes = currentIndexSet.values().map(function (index) { return parseInt(index, 10); });
            this.currentIndexes.sort(d3_ascending);
            this.fireChangeHandlers();
        }
    }

    /**
    * Migrates the selected competitors from one list to another.
    *
    * After the migration, any competitors in the old list that were selected
    * and are also in the new competitors list remain selected.
    *
    * Note that this method does NOT fire change handlers when it runs.  This
    * is typically used during a change of class, when the application may be
    * making other changes.
    *
    * @sb-param {Array} oldCompetitors - Array of Competitor objects for the old
    *      selection.  The length of this must match the current count of
    *      competitors.
    * @sb-param {Array} newCompetitors - Array of Competitor objects for the new
    *      selection.  This array must not be empty.
    */
    public migrate(oldCompetitors: Competitor[], newCompetitors: Competitor[]) {
        if (!$.isArray(oldCompetitors)) {
            throw new InvalidData("CompetitorSelection.migrate: oldCompetitors not an array");
        } else if (!$.isArray(newCompetitors)) {
            throw new InvalidData("CompetitorSelection.migrate: newCompetitors not an array");
        } else if (oldCompetitors.length !== this.count) {
            throw new InvalidData("CompetitorSelection.migrate: oldCompetitors list must have the same length as the current count");
        } else if (newCompetitors.length === 0 && this.currentIndexes.length > 0) {
            // tslint:disable-next-line:max-line-length
            throw new InvalidData("CompetitorSelection.migrate: newCompetitors list must not be empty if current list has competitors selected");
        }

        const selectedCompetitors = this.currentIndexes.map(function (index) { return oldCompetitors[index]; });

        this.count = newCompetitors.length;
        this.currentIndexes = [];
        newCompetitors.forEach(function (comp, idx: number) {
            if (selectedCompetitors.indexOf(comp) >= 0) {
                this.currentIndexes.push(idx);
            }
        }, this);
    }

}
