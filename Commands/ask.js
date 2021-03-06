const Logger = require('./Logger.js');

/**
 * @usage !ask <question>
 * @does will executed given Command
 * @Shortcut a
 */
module.exports = {
    ask: function(message) {
        const Answers = [
            "So it would seem.",
            "As I see it, yes.",
            "Don't count on it",
            "It is certain",
            "It is decidedly so.",
            "Most likely",
            "My reply is no",
            "My sources say no.",
            "Outlook not so good",
            "Outlook good",
            "Signs point to yes",
            "Very doubtful.",
            "Without a doubt",
            "Yes.",
            "Yes - definitely.",
            "You may rely on it"
        ];
        try {
            message.channel.send(Answers[Math.floor(Math.random() * Answers.length)]);
        }catch (err) {
            Logger.log(err);
            message.channel.send("There was a problem, please try again");
        }
    }
}
