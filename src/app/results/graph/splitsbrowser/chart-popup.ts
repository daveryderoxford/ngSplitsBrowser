// file chart-popup.js

import { select as d3_select, Selection } from "d3-selection";
import * as $ from "jquery";
import { TimeUtilities } from "../../model";

let outerThis;

export class ChartPopup {
    private _shown: boolean;
    private _mouseIn: boolean;
    private _popupDiv: Selection<any, any, any, any>;
    private _dataHeader: any;
    private _dataTable: any;

    /**
    * Creates a ChartPopup control.
    * @constructor
    * @sb-param {HTMLElement} parent - Parent HTML element.
    * @sb-param {Object} handlers - Object that maps mouse event names to handlers.
    */
    constructor( parent: HTMLElement, handlers ) {

        outerThis = this;

        this._shown = false;
        this._mouseIn = false;
        this._popupDiv = d3_select( parent ).append( "div" );
        this._popupDiv.classed( "chartPopup", true )
            .style( "display", "none" )
            .style( "position", "absolute" );

        this._dataHeader = this._popupDiv.append( "div" )
            .classed( "chartPopupHeader", true )
            .append( "span" );

        const tableContainer = this._popupDiv.append( "div" )
            .classed( "chartPopupTableContainer", true );


        this._dataTable = tableContainer.append( "table" );

        this._popupDiv.selectAll( ".nextControls" ).style( "display", "none" );

        // At this point we need to pass through mouse events to the parent.
        // This is solely for the benefit of IE < 11, as IE11 and other
        // browsers support pointer-events: none, which means that this div
        // receives no mouse events at all.
        for ( const eventName in handlers ) {
            if ( handlers.hasOwnProperty( eventName ) ) {
                $( this._popupDiv.node() ).on( eventName, handlers[ eventName ] );
            }
        }

        $( this._popupDiv.node() ).mouseenter( function () { outerThis._mouseIn = true; } );
        $( this._popupDiv.node() ).mouseleave( function () { outerThis._mouseIn = false; } );
    }

    /**
    * Returns whether the popup is currently shown.
    * @sb-return {boolean} True if the popup is shown, false otherwise.
    */
    isShown() {
        return this._shown;
    }

    /**
    * Returns whether the mouse is currently over the popup.
    * @sb-return {boolean} True if the mouse is over the popup, false otherwise.
    */
    isMouseIn() {
        return this._mouseIn;
    }

    /**
    * Populates the chart popup with data.
    *
    * 'competitorData' should be an object that contains a 'title', a 'data'
    * and a 'placeholder' property.  The 'title' is a string used as the
    * popup's title.  The 'data' property is an array where each element should
    * be an object that contains the following properties:
    * * time - A time associated with a competitor.  This may be a split time,
    *   cumulative time or the time of day.
    * * className (Optional) - Name of the competitor's class.
    * * name - The name of the competitor.
    * * highlight - A boolean value which indicates whether to highlight the
    *   competitor.
    * The 'placeholder' property is a placeholder string to show if there is no
    * 'data' array is empty.  It can be null to show no such message.
    * @sb-param {Object} competitorData - Array of data to show.
    * @sb-param {boolean} includeClassNames - Whether to include class names.
    */
    setData( competitorData, includeClassNames ) {
        this._dataHeader.text( competitorData.title );

        let rows = this._dataTable.selectAll( "tr" )
            .data( competitorData.data );

        rows.enter().append( "tr" );

        rows = this._dataTable.selectAll( "tr" )
            .data( competitorData.data );
        rows.classed( "highlighted", function ( row ) { return row.highlight; } );

        rows.selectAll( "td" ).remove();
        rows.append( "td" ).text( function ( row ) { return TimeUtilities.formatTime( row.time ); } );
        if ( includeClassNames ) {
            rows.append( "td" ).text( function ( row ) { return row.className; } );
        }
        rows.append( "td" ).text( function ( row ) { return row.name; } );

        rows.exit().remove();

        if ( competitorData.data.length === 0 && competitorData.placeholder !== null ) {
            this._dataTable.append( "tr" )
                .append( "td" )
                .text( competitorData.placeholder );
        }
    }

    /**
    * Sets the next-controls data.
    *
    * The next-controls data should be an object that contains two properties:
    * * thisControl - The 'current' control.
    * * nextControls - Array of objects, each with 'course' and 'nextControl'
    *   properties.
    *
    * @sb-param {Object} nextControlsData - The next-controls data.
    */
    setNextControlData( nextControlsData ) {
        this._dataHeader.text( nextControlsData.thisControl );

        const rows = this._dataTable.selectAll( "tr" )
            .data( nextControlsData.nextControls );
        rows.enter().append( "tr" );

        rows.selectAll( "td" ).remove();
        rows.classed( "highlighted", false );
        rows.append( "td" ).text( function ( nextControlData ) { return nextControlData.course.name; } );
        rows.append( "td" ).text( "-->" );
        rows.append( "td" ).text( function ( nextControlData ) { return nextControlData.nextControls; } );

        rows.exit().remove();
    }

    /**
    * Adjusts the location of the chart popup.
    *
    * The location object should contain "x" and "y" properties.  The two
    * coordinates are in units of pixels from top-left corner of the viewport.
    *
    * @sb-param {Object} location - The location of the chart popup.
    */
    setLocation( location ) {
        this._popupDiv.style( "left", location.x + "px" )
            .style( "top", location.y + "px" );
    }

    /**
    * Shows the chart popup.
    *
    * The location object should contain "x" and "y" properties.  The two
    * coordinates are in units of pixels from top-left corner of the viewport.
    *
    * @sb-param {Object} location - The location of the chart popup.
    */
    show( location ) {
        this._popupDiv.style( "display", null );
        this._shown = true;
        this.setLocation( location );
    }

    /**
    * Hides the chart popup.
    */
    hide() {
        this._popupDiv.style( "display", "none" );
        this._shown = false;
    }

    /**
    * Returns the height of the popup, in units of pixels.
    * @sb-return {Number} Height of the popup, in pixels.
    */
    height() {
        return $( this._popupDiv.node() ).height();
    }
}

