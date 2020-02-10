const Logger = require('../Admin.js');
const snoowrap = require('snoowrap');
const apiKey = require('../Dependencies/RedditAPI.json');
const redditAPI = new snoowrap({
    userAgent: 'my user-agent',
    clientId: apiKey.clientId,
    clientSecret: apiKey.clientSecret,
    username: apiKey.username,
    password: apiKey.password
});

const talkedRecently = new Set();

module.exports = {
    neko: function (message) {

        if (!Logger.canspamneko()) {
            if (talkedRecently.has(message.author.id)) {
                message.channel.send("Wait 15 Seconds before typing this again. - " + message.author);
            } else {
                execneko(message);

                talkedRecently.add(message.author.id);
                setTimeout(() => {
                    // Removes the user from the set after a minute
                    talkedRecently.delete(message.author.id);
                }, 15000);
            }
        } else {
            execneko(message);
        }


    }
}

function execneko(message) {
    if (Math.random() <= 0.5) {

        redditAPI.getSubreddit("neko").getRandomSubmission().then(submission => {
            message.channel.send("http://reddit.com" + submission.permalink);

        }).catch(error => {
            Logger.log(error);
            message.channel.send("An Error occured");
        })
    } else {

        redditAPI.getSubreddit("nekomimi").getRandomSubmission().then(submission => {
            message.channel.send("http://reddit.com" + submission.permalink);

        }).catch(error => {
            Logger.log(error);
            message.channel.send("An Error occured");
        })
    }
}
