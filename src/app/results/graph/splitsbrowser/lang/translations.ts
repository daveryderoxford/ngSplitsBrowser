
import { messages } from "./messages";

export class Lang {
    private static instance: Lang | null = null;

    // Whether a warning about missing messages has been given.  We don't
    // really want to irritate the user with many alert boxes if there's a
    // problem with the messages.
    private static warnedAboutMessages = true;

    // The currently-chosen language, English by default
    private static currentLanguage = "en_gb";

    // The list of all languages read in, or null if none.
    private static allLanguages = null;

    // Default alerter function, just calls window.alert.
    private static alertFunc = function (message) { window.alert(message); };

    /**
    * Issue a warning about the messages, if a warning hasn't already been
    * issued.
    * @sb-param {String} warning - The warning message to issue.
    */
    public static warn(warning: string) {
        if (!this.warnedAboutMessages) {
            this.alertFunc(warning);
            this.warnedAboutMessages = true;
        }
    }

    /**
    * Sets the alerter to use when a warning message should be shown.
    *
    * This function is intended only for testing purposes.
    * @sb-param {Function} alerter - The function to be called when a warning is
    *     to be shown.
    */
    public static setMessageAlerter(alerter) {
        this.alertFunc = alerter;
    }

    /**
    * Attempts to get a message, returning a default string if it does not
    * exist.
    * @sb-param {String} key - The key of the message.
    * @sb-param {String} defaultValue - Value to be used
    * @sb-return {String} The message with the given key, if the key exists,
    *     otherwise the default value.
    */
    public static tryGetMessage(key: string, defaultValue: string): string {
        const currentLanguage = Lang.currentLanguage;
        return (currentLanguage !== null && messages[currentLanguage].hasOwnProperty(key)) ? Lang.getMessage(key) : defaultValue;
    }

    /**
    * Returns the message with the given key.
    * @sb-param {String} key - The key of the message.
    * @sb-return {String} The message with the given key, or a placeholder string
    *     if the message could not be looked up.
    */
    public static getMessage(key: string): string {
        const currentLanguage = Lang.currentLanguage;

        if (Lang.allLanguages === null) {
            Lang.initialiseMessages();
        }

        if (currentLanguage !== null) {
            if (messages[currentLanguage].hasOwnProperty(key)) {
                return messages[currentLanguage][key];
            } else {
                // eslint-disable-next-line @typescript-eslint/quotes
                this.warn("Message not found for key '" + key + '\' in language \'' + currentLanguage + "'");
                return "?????";
            }
        } else {
            this.warn("No messages found.  Has a language file been loaded?");
            return "?????";
        }
    }

    /**
    * Returns the message with the given key, with some string formatting
    * applied to the result.
    *
    * The object 'params' should map search strings to their replacements.
    *
    * @sb-param {String} key - The key of the message.
    * @sb-param {Object} params - Object mapping parameter names to values.
    * @sb-return {String} The resulting message.
    */
    public static getMessageWithFormatting(key: string, params: any): string {
        let message = Lang.getMessage(key);

        for (const paramName in params) {
            if (params.hasOwnProperty(paramName)) {
                // Irritatingly there isn't a way of doing global replace
                // without using regexps.  So we must escape any magic regex
                // metacharacters first, so that we have a regexp that will
                // match a single static string.
                const paramNameRegexEscaped = paramName.replace(/([.+*?|{}()^$\[\]\\])/g, "\\$1");
                message = message.replace(new RegExp(paramNameRegexEscaped, "g"), params[paramName]);
            }
        }

        return message;
    }

    /**
    * Returns an array of codes of languages that have been loaded.
    * @sb-return {Array} Array of language codes.
    */
    public static getAllLanguages(): Array<string> {
        return Lang.allLanguages.slice(0);
    }

    /**
    * Returns the language code of the current language, e.g. "en_gb".
    * @sb-return {String} Language code of the current language.
    */
    public static getLanguage(): string {
        return Lang.currentLanguage;
    }

    /**
    * Returns the name of the language with the given code.
    * @sb-param {String} language - The code of the language, e.g. "en_gb".
    * @sb-return {String} The name of the language, e.g. "English".
    */
    public static getLanguageName(language: string): string {
        if (messages.hasOwnProperty(language) && messages[language].hasOwnProperty("Language")) {
            return messages[language].Language;
        } else {
            return "?????";
        }
    }

    /**
    * Sets the current language.
    * @sb-param {String} language - The code of the new language to set.
    */
    public static setLanguage(language: string) {
        if (messages.hasOwnProperty(language)) {
            Lang.currentLanguage = language;
        }
    }

    /**
    * Initialises the messages from those read in.
    *
    * @sb-param {String} defaultLanguage - (Optional) The default language to choose.
    */
    public static initialiseMessages(defaultLanguage?: string) {

        this.allLanguages = [] as Array<string>;

        for (const messageKey in messages) {
            if (messages.hasOwnProperty(messageKey)) {
                this.allLanguages.push(messageKey);
            }
        }

        if (this.allLanguages.length === 0) {
            this.warn("No messages files were found.");
        } else if (defaultLanguage && messages.hasOwnProperty(defaultLanguage)) {
            this.currentLanguage = defaultLanguage;
        } else {
            this.currentLanguage = this.allLanguages[0];
        }
    }
}
