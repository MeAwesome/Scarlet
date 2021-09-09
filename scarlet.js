/**
 * Scarlet is a voice assistant that is able to integrate
 * with a variety of services and is designed to be open
 * source for easy integration into other enviornments
 * 
 * @author Isaac Robbins <isaacprobbins@gmail.com>
 * @class Scarlet
 */

class Scarlet {
    /**
     * Main configuration for the voice engine
     * 
     * @property {string} wakeWord - Name to listen for before commands are executed
     * @property {string} voice - Voice type to use for speech synthesis
     * @property {string} language - Language that is understood by the speech recognition
     * @property {boolean} continuous - Whether to continuously listen for speech input or not
     * @property {boolean} interimResults - Whether to have speech recognition output continuous guesses for what has been said
     */
    config = {
        wakeWord: "Scarlet",
        voice: "UK English Female",
        language: "en-US",
        continuous: true,
        interimResults: true
    }
    /**
     * Creates the Scarlet voice assistant
     * 
     * @constructor
     */
    constructor() {
        //Set responsive voice debug to false so console isn't flooded with messages
        responsiveVoice.debug = false;
        //Starts speech recognition inside of Google Chrome
        this.recognizer = new webkitSpeechRecognition();
        //Sets the speech recognition options to those defined in the config
        this.recognizer.continuous = this.config.continuous;
        this.recognizer.interimResults = this.config.interimResults;
        this.recognizer.lang = this.config.language;
    }
    /**
     * Synthesize speech from text
     * 
     * @param {string} message - Text to have Scarlet speak
     * @returns {void}
     * 
     * @todo modify onstart and onend functions to give data about speaking
     */
    speak(message)  {
        /**
         * Called once speech synthesis has started
         * 
         * @function
         * @returns {void}
         */
        var _onstart = function() {};
        /**
         * Called once speech synthesis has ended
         *
         * @function
         * @returns {void}
         */
        var _onend = function() {};
        responsiveVoice.speak(message, this.config.voice, { onstart: _onstart, onend: _onend });
    }
    /**
     * Listen for speech to convert to text and emit the corresponding events
     * 
     * @returns {void}
     * 
     * @todo add way to check user intent
     * @todo emit events using this.emit instead of dispatching an event
     * @todo combine speechResults() with this function to keep everything together
     */
    listen(){
        var that = this; //this is bullshit
        /**
         * Called once speech recognition has started
         *
         * @function
         * @returns {void}
         */
        var _onstart = function () {

        }
        /**
         * Called once speech recognition is able to process speech into text
         *
         * @function
         * @returns {void}
         */
        var _onresult = function(e) {
            var data = {
                resultJSON: e,
                resultValue: e.returnValue,
                resultString: e.results[e.results.length - 1][0].transcript.trim().toLowerCase(),
                resultConfidence: e.results[e.results.length - 1][0].confidence
            }
            that.speechResults(data);
        }
        /**
         * Called if speech recognition encounters an error
         *
         * @function
         * @returns {void}
         */
        var _onerror = function() {

        }
        /**
         * Called once speech recognition has ended
         *
         * @function
         * @returns {void}
         */
        var _onend = function () {
            that.recognizer.start();
        }
        this.recognizer.onstart = _onstart;
        this.recognizer.onresult = _onresult;
        this.recognizer.onerror = _onerror;
        this.recognizer.onend = _onend;
        this.recognizer.start();
    }
    /**
     * 
     * @todo move this function into listen() to keep everything together
     */
    speechResults(e){
        if (e.resultValue){
            if (e.resultString.contains("melody")){
                window.dispatchEvent(new CustomEvent("melodyNameRecognized"));
            }
            // TODO: if statement below shouldnt run unless scarlet as been recognized
            if (e.resultJSON.results[e.resultJSON.resultIndex].isFinal){
                window.dispatchEvent(new CustomEvent("melodyFinalResults", {
                    detail: e.resultString
                }));
            } else {
                window.dispatchEvent(new CustomEvent("melodyInterimResults", {
                    detail: e.resultString
                }));
            }
        }
    }
}

//This might not be needed but for now it is critical
String.prototype.contains = function (string) {
    return this.indexOf(string) > -1;
}