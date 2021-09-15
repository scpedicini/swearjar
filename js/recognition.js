// Get the SpeechRecognition object, while handling browser prefixes
const errorSpeechSupport = "It looks like your browser doesn't support the speech recognition API. We recommend using Chrome on a PC/Laptop for best results";

console.log("Loading SpeechRecognition.js");

class PhraseFunction {
    constructor(phrase, fnptr) {
        this.Phrase = new RegExp(phrase, "i");
        this.Method = fnptr;
    }
}

function AppendText(t)
{
	let p = document.createElement('p');
	p.appendChild(document.createTextNode(t));
	document.body.appendChild(p);
}

function DrawCarlin()
{
    let img = document.createElement('img');
    img.className = 'fade-in';
    img.src = "assets/carlin.jpg";
    document.getElementsByClassName("content")[0].appendChild(img);
}


function WhatsTheWord() {
    peeweeSound.play();
}

function Scream() {

}


/******************* Initialization ****************/

document.getElementById('pediciniswitch').addEventListener('change', event => {
    profanityRegex = event.target.checked ? pediciniRegex : normalRegex;
});


const MIN_CONFIDENCE = 0.6;

const errorSound = new Audio('assets/error.wav');
const successSound = new Audio('assets/success.wav');

let profanityRegex;

(async () => {
    let response = await fetch('./assets/censored-words.txt');
    let contents = await response.text();
    profanityRegex = new RegExp(contents, "gi");
    initializeRecognitionSystem();
})();

function initializeRecognitionSystem() {

    if (!('webkitSpeechRecognition' in window)) {
        alert(errorSpeechSupport);
    } else if (!window.hasOwnProperty("webkitSpeechRecognition")) {
        alert(errorSpeechSupport);
    } else if (typeof (window.webkitSpeechRecognition) != "function") {
        alert(errorSpeechSupport);
    } else {
        const beepSound = new Audio('assets/beep.wav');
        const peeweeSound = new Audio('assets/secretword.wav');

        let curseIndex = -1;
        //const profanityRegex = /god|shit|\bass\b|asshole|prick|cunt|dick|damn|\*\*\*/gi;


        const Phrases = [];
        Phrases.push(new PhraseFunction("the secret word", WhatsTheWord));

//Phrases.push(new PhraseFunction("the secret word", WhatsTheWord));

        const recognition = new window.webkitSpeechRecognition();
        console.log("webkitSpeechRecognition instantiated");
        console.info(recognition);
        recognition.continuous = true; // keep processing input until stopped
        recognition.interimResults = true; // show interim results
        recognition.lang = "en-US"; // specify the language

        recognition.onresult = function (event) {
            console.log("onresult begin");
            let interim_transcript = '';
            let final_transcript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    if (event.results[i][0].confidence >= MIN_CONFIDENCE) {
                        final_transcript += event.results[i][0].transcript;
                        console.log("Resetting curse index");
                        curseIndex = -1;

                        // final transcript
                        for (let p of Phrases) {
                            if (p.Phrase.test(final_transcript)) {
                                p.Method();
                                break;
                            }
                        }
                    }
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
            }

            interim_transcript = interim_transcript.trim();
            final_transcript = final_transcript.trim();

            let mainstr = interim_transcript; // !== '' ? interim_transcript : final_transcript;

            let match = profanityRegex.exec(mainstr);

            // the problem with matching *** is that if the word is "f*** and then f******" it matches "ahead" later without
            // realizing its a separate word.
            if (match !== null && match.index > curseIndex) {
                curseIndex = match.index;
                //AppendText("BEEP");
                //DrawCarlin();
                //spawnCoins(activeScene, Math.floor(Math.random() * 4) + 1);
                spawnCoins(activeScene, getInclusive(1, 4));

                console.log("BEEP");

                beepSound.play();

            }

            console.log("Interim transcript: " + interim_transcript + ", Final transcript: " + final_transcript);

        };

        recognition.onend = function (event) {
            console.log("Restarting...");
            recognition.start(); // be careful to see if this is an error, or if the last restart was less than a second ago then wait a bit longer
        };

        recognition.onerror = function (event) {
            console.log("Error: " + event.error);
            console.info(event);
        };

        recognition.start();

    }
}