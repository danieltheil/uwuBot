const Music = require('./Music.js');

/**
 * @usage !pause
 * @does pauses current Song
 */
module.exports = {
    pause: function (message) {

        Music.pause(message); //All Logic is in Music
    }
}
