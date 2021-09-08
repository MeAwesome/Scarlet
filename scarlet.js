//Developed By: Isaac Robbins

/**
 * Base class to start Speech Recognition and Speech Synthesis
 * 
 * @constructor
 */

class Scarlet {
    config = {
        wakeWord: "Scarlet",
        voice: "UK English Female",
        lang: "en-US",
        continuous: true,
        interimResults: true
    };
    constructor() {
        responsiveVoice.debug = false;
        this.recognizer = new webkitSpeechRecognition();
        this.recognizer.continuous = this.config.continuous;
        this.recognizer.interimResults = this.config.interimResults;
        this.recognizer.lang = this.config.lang;
    }
    /**
     * 
     * @param {string} message - Text to have Scarlet speak
     */
    speak(message){
        // TODO: create on start and on end functions to give data about speaking
        responsiveVoice.speak(message, this.config.voice, { onstart: _onstart, onend: _onend });
        var _onstart = function(){

        }
        var _onend = function () {

        }
    }
    listen(){
        var that = this; //this is bullshit
        var _onstart = function () {

        }
        var _onresult = function(e) {
            var data = {
                resultJSON: e,
                resultValue: e.returnValue,
                resultString: e.results[e.results.length - 1][0].transcript.trim().toLowerCase(),
                resultConfidence: e.results[e.results.length - 1][0].confidence
            }
            that.speechResults(data);
        }
        var _onerror = function() {

        }
        var _onend = function () {
            that.recognizer.start();
        }
        this.recognizer.onstart = _onstart;
        this.recognizer.onresult = _onresult;
        this.recognizer.onerror = _onerror;
        this.recognizer.onend = _onend;
        this.recognizer.start();
    }
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

String.prototype.contains = function (string) {
    return this.indexOf(string) > -1;
}