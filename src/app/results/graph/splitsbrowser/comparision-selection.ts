
import $ from 'jquery';
import { Lang } from "./lang";
import { select as d3_select } from "d3-selection";
import { range as d3_range } from "d3-array";
import { ALL_COMPARISON_OPTIONS } from "./comparision-options";
import { Competitor, CourseClassSet } from '../../model';

const getMessage = Lang.getMessage;
const getMessageWithFormatting = Lang.getMessageWithFormatting;

// Default selected index of the comparison function.
export const DEFAULT_COMPARISON_INDEX = 1; // 1 = fastest time.

// The id of the comparison selector.
export const COMPARISON_SELECTOR_ID = "comparisonSelector";
// The id of the runner selector
export const RUNNER_SELECTOR_ID = "runnerSelector";

export class ComparisonSelector {
    changeHandlers: any[];
    currentRunnerIndex: number | null;
    courseClassSet: CourseClassSet;
    previousCompetitorList: Competitor[];
    parent: HTMLElement;
    alerter: ( arg0: string ) => void;
    hasWinner: boolean;
    previousSelectedIndex: number;
    comparisonSelectorLabel: any;
    dropDown: any;
    optionsList: any;
    runnerDiv: any;
    runnerSpan: any;
    runnerDropDown: any;

    /**
    * A control that wraps a drop-down list used to choose what to compare
    * times against.
    * @sb-param {HTMLElement} parent - The parent element to add the control to.
    * @sb-param {Function} alerter - Function to call with any messages to show to
    *     the user.
    */
    constructor ( parent: HTMLElement, alerter ) {
        this.changeHandlers = [];
        this.currentRunnerIndex = null;
        this.previousCompetitorList = null;
        this.parent = parent;
        this.alerter = alerter;
        this.hasWinner = false;
        this.previousSelectedIndex = -1;

        const div = d3_select( parent ).append( "div" )
            .classed( "topRowStart", true );

        this.comparisonSelectorLabel = div.append( "span" )
            .classed( "comparisonSelectorLabel", true );


        const outerThis = this;
        this.dropDown = div.append( "select" )
            .attr( "id", COMPARISON_SELECTOR_ID )
            .node();

        $( this.dropDown ).bind( "change", function () { outerThis.onSelectionChanged(); } );

        this.optionsList = d3_select( this.dropDown ).selectAll( "option" )
            .data( ALL_COMPARISON_OPTIONS );
        this.optionsList.enter().append( "option" );

        this.optionsList = d3_select( this.dropDown ).selectAll( "option" )
            .data( ALL_COMPARISON_OPTIONS );
        this.optionsList.attr( "value", function ( _opt, index ) { return index.toString(); } );

        this.optionsList.exit().remove();

        this.runnerDiv = d3_select( parent ).append( "div" )
            .classed( "topRowStart", true )
            .style( "display", "none" )
            .style( "padding-left", "20px" );

        this.runnerSpan = this.runnerDiv.append( "span" )
            .classed( "comparisonSelectorLabel", true );

        this.runnerDropDown = this.runnerDiv.append( "select" )
            .attr( "id", RUNNER_SELECTOR_ID )
            .node();

        $( this.runnerDropDown ).bind( "change", function () { outerThis.onSelectionChanged(); } );

        this.dropDown.selectedIndex = DEFAULT_COMPARISON_INDEX;
        this.previousSelectedIndex = DEFAULT_COMPARISON_INDEX;

        this.setMessages();
    }

    /**
    * Sets the messages in this control, following its creation or a change of
    * selected language.
    */
    setMessages() {
        this.comparisonSelectorLabel.text( getMessage( "ComparisonSelectorLabel" ) );
        this.runnerSpan.text( getMessage( "CompareWithAnyRunnerLabel" ) );
        this.optionsList.text( function ( opt ) { return getMessageWithFormatting( opt.nameKey, { "$$PERCENT$$": opt.percentage } ); } );
    }

    /**
    * Add a change handler to be called whenever the selected class is changed.
    *
    * The function used to return the comparison result is returned.
    *
    * @sb-param {Function} handler - Handler function to be called whenever the class
    *                   changes.
    */
    registerChangeHandler( handler ) {
        if ( this.changeHandlers.indexOf( handler ) === -1 ) {
            this.changeHandlers.push( handler );
        }
    }

    /**
    * Returns whether the 'Any Runner...' option is selected.
    * @sb-return {boolean} True if the 'Any Runner...' option is selected, false
    *     if any other option is selected.
    */
    isAnyRunnerSelected() {
        return this.dropDown.selectedIndex === ALL_COMPARISON_OPTIONS.length - 1;
    }

    /**
    * Sets the course-class set to use.
    * @sb-param {CourseClassSet} courseClassSet - The course-class set to set.
    */
    setCourseClassSet( courseClassSet: CourseClassSet ) {
        this.courseClassSet = courseClassSet;
        this.setRunners();
    }

    /**
    * Populates the drop-down list of runners from a course-class set.
    */
    setRunners() {
        const competitors = this.courseClassSet.allCompetitors;
        const completingCompetitorIndexes = d3_range( competitors.length ).filter( function ( idx ) {
            return competitors[ idx ].completed();
        });
        const completingCompetitors = competitors.filter( function ( comp ) { return comp.completed(); } );

        this.hasWinner = ( completingCompetitors.length > 0 );

        let optionsList = d3_select( this.runnerDropDown ).selectAll( "option" )
            .data( completingCompetitors );

        optionsList.enter().append( "option" );
        optionsList = d3_select( this.runnerDropDown ).selectAll( "option" )
            .data( completingCompetitors );
        optionsList.attr( "value", function ( _comp, complCompIndex ) { return completingCompetitorIndexes[ complCompIndex ].toString(); })
            .text( function ( comp: any ) { return comp.name; } );
        optionsList.exit().remove();

        if ( this.previousCompetitorList === null ) {
            this.currentRunnerIndex = 0;
        } else if ( this.hasWinner ) {
            const oldSelectedRunner = this.previousCompetitorList[ this.currentRunnerIndex ];
            const newIndex = this.courseClassSet.allCompetitors.indexOf( oldSelectedRunner );
            this.currentRunnerIndex = Math.max( newIndex, 0 );
        } else if ( ALL_COMPARISON_OPTIONS[ this.dropDown.selectedIndex ].requiresWinner ) {
            // We're currently viewing a comparison type that requires a
            // winner.  However, there is no longer a winner, presumably
            // because there was a winner but following the removal of a class
            // there isn't any more.  Switch back to the fastest time.
            this.setComparisonType( 1, null );
        }

        this.runnerDropDown.selectedIndex = this.currentRunnerIndex;

        this.previousCompetitorList = this.courseClassSet.allCompetitors;
    }

    /**
    * Sets whether the control is enabled.
    * @sb-param {boolean} isEnabled - True if the control is enabled, false if
    *      disabled.
    */
    setEnabled( isEnabled ) {
        d3_select( this.parent ).selectAll( "span.comparisonSelectorLabel" )
            .classed( "disabled", !isEnabled );

        this.dropDown.disabled = !isEnabled;
        this.runnerDropDown.disabled = !isEnabled;
    }

    /**
    * Returns the function that compares a competitor's splits against some
    * reference data.
    * @sb-return {Function} Comparison function.
    */
    getComparisonFunction() {
        if ( this.isAnyRunnerSelected() ) {
            const outerThis = this;
            return function ( courseClassSet ) { return courseClassSet.getCumulativeTimesForCompetitor( outerThis.currentRunnerIndex ); };
        } else {
            return ALL_COMPARISON_OPTIONS[ this.dropDown.selectedIndex ].selector;
        }
    }

    /**
    * Returns the comparison type.
    * @sb-return {Object} Object containing the comparison type (type index and runner).
    */
    getComparisonType() {
        const typeIndex = this.dropDown.selectedIndex;
        let runner;
        if ( typeIndex === ALL_COMPARISON_OPTIONS.length - 1 ) {
            if ( this.runnerDropDown.selectedIndex < 0 ) {
                this.runnerDropDown.selectedIndex = 0;
            }

            runner = this.courseClassSet.allCompetitors[ this.runnerDropDown.selectedIndex ];
        } else {
            runner = null;
        }

        return { index: typeIndex, runner: runner };
    }

    /**
    * Sets the comparison type.
    * @sb-param {Number} typeIndex - The index of the comparison type.
    * @sb-param {Competitor|null} runner - The selected 'Any runner', or null if
    *     Any Runner has not been selected.
    */
    setComparisonType( typeIndex, runner ) {
        if ( 0 <= typeIndex && typeIndex < ALL_COMPARISON_OPTIONS.length ) {
            if ( typeIndex === ALL_COMPARISON_OPTIONS.length - 1 ) {
                const runnerIndex = this.courseClassSet.allCompetitors.indexOf( runner );
                if ( runnerIndex >= 0 ) {
                    this.dropDown.selectedIndex = typeIndex;
                    this.runnerDropDown.selectedIndex = runnerIndex;
                    this.onSelectionChanged();
                }
            } else {
                this.dropDown.selectedIndex = typeIndex;
                this.onSelectionChanged();
            }
        }
    }

    /**
    * Handle a change of the selected option in either drop-down list.
    */
    onSelectionChanged() {
        const runnerDropdownSelectedIndex = Math.max( this.runnerDropDown.selectedIndex, 0 );
        const option = ALL_COMPARISON_OPTIONS[ this.dropDown.selectedIndex ];
        if ( !this.hasWinner && option.requiresWinner ) {
            // No winner on this course means you can't select this option.
            this.alerter( getMessageWithFormatting( "CannotCompareAsNoWinner", { "$$OPTION$$": getMessage( option.nameKey ) } ) );
            this.dropDown.selectedIndex = this.previousSelectedIndex;
        } else {
            this.runnerDiv.style( "display", ( this.isAnyRunnerSelected() ) ? null : "none" );
            this.currentRunnerIndex = ( this.runnerDropDown.options.length === 0 ) ? 0 :
                parseInt( this.runnerDropDown.options[ runnerDropdownSelectedIndex ].value, 10 );
            this.previousSelectedIndex = this.dropDown.selectedIndex;
            this.changeHandlers.forEach( function ( handler ) { handler( this.getComparisonFunction() ); }, this );
        }
    }
}
