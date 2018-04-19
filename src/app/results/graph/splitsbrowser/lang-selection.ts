// file language-selector.js

import d3 = require("d3");
import * as $ from "jquery";

import { Lang } from "./lang";

const getMessage = Lang.getMessage;
    const getLanguage = Lang.getLanguage;
    const getLanguageName = Lang.getLanguageName;
    const setLanguage = Lang.setLanguage;

    /**
    * A control that wraps a drop-down list used to choose the language to view.
    * @sb-param {HTMLElement} parent - The parent element to add the control to.
    */
    export function LanguageSelector(parent) {
        this.changeHandlers = [];
        this.label = null;
        this.dropDown = null;

        this.allLanguages = Lang.getAllLanguages();

        if (this.allLanguages.length < 2) {
            // User hasn't loaded multiple languages, so no point doing
            // anything further here.
            return;
        }

        d3.select(parent).append("div")
            .classed("topRowStartSpacer", true);

        const div = d3.select(parent).append("div")
            .classed("topRowStart", true);

        this.label = div.append("span");

        const outerThis = this;
        this.dropDown = div.append("select").node();
        $(this.dropDown).bind("change", function () { outerThis.onLanguageChanged(); });

        let optionsList = d3.select(this.dropDown).selectAll("option").data(this.allLanguages);
        optionsList.enter().append("option");

        optionsList = d3.select(this.dropDown).selectAll("option").data(this.allLanguages);
        optionsList.attr("value", function (language: string): string { return language; })
            .text(function (language: string) { return getLanguageName(language); });

        optionsList.exit().remove();

        this.setLanguage(getLanguage());
        this.setMessages();
    }

    /**
    * Sets the text of various messages in this control, following either its
    * creation or a change of language.
    */
    LanguageSelector.prototype.setMessages = function () {
        this.label.text(getMessage("LanguageSelectorLabel"));
    };

    /**
    * Add a change handler to be called whenever the selected language is changed.
    *
    * The handler function is called with no arguments.
    *
    * @sb-param {Function} handler - Handler function to be called whenever the
    *                             language changes.
    */
    LanguageSelector.prototype.registerChangeHandler = function (handler) {
        if (this.changeHandlers.indexOf(handler) === -1) {
            this.changeHandlers.push(handler);
        }
    };

    /**
    * Sets the language.  If the language given is not recognised, nothing
    * happens.
    * @sb-param {String} language - The language code.
    */
    LanguageSelector.prototype.setLanguage = function (language) {
        const index = this.allLanguages.indexOf(language);
        if (index >= 0) {
            this.dropDown.selectedIndex = index;
            this.onLanguageChanged();
        }
    };

    /**
    * Handle a change of the selected option in the drop-down list.
    */
    LanguageSelector.prototype.onLanguageChanged = function () {
        setLanguage(this.dropDown.options[this.dropDown.selectedIndex].value);
        this.changeHandlers.forEach(function (handler) { handler(); });
    };
