const Discord = require('discord.js');
const Logger = require("./Logger");
const fh = require('./FileHandler');
const annotations = require('annotations');
const requireDir = require('require-dir')

/**
 * @usage !help <optional: command>
 * @does gives you a list of commands to use
 */
module.exports = {
    help: function (message) {
        switch (message.content.substring(5).toLowerCase()) {
            case 'music':
                musicHelp(message);
                break;
            case 'whattodraw':
                whatToDrawHelp(message);
                break;
            case 'name':
                nameHelp(message);
                break;
            case 'admin':
                adminHelp(message);
                break;
            default:
                normalHelp(message);
                break;
        }
    }
}

function normalHelp(message) {

    try {
        let msgcounter = 0;
        let helpcounter = 0;
        let emb = new Discord.MessageEmbed().setTitle('General Settings');
        let adminprefix = fh.get("../Files/local/adminprefix.json");
        let prefix = fh.get("../Files/local/" + message.guild.id + "/prefix.json");

        for (let command in requireDir('.')) {

            let res = annotations.getSync('./Commands/' + command + '.js');

            if (!res.module) {
                Logger.log('Error at ' + command);
                message.channel.send("Error in help.js, check Log for Details");
            }

            if (command.charAt(0) == command.charAt(0).toLowerCase() || command == 'Admin') {

                let tmpstring = '';

                for (let annotation in res.module) {

                    tmpstring += (annotation ? annotation.charAt(0).toUpperCase() + annotation.slice(1) : 'No AnnotationName') + ': ';

                    if (annotation.toLowerCase() == "usage") {
                        if (command == 'Admin') {
                            tmpstring += (res.module[annotation] ? adminprefix + res.module[annotation].slice(11) : 'No AnnotationText') + '\n';
                        } else {
                            tmpstring += (res.module[annotation] ? prefix + res.module[annotation].slice(1) : 'No AnnotationText') + '\n';
                        }
                    } else {
                        tmpstring += (res.module[annotation] ? res.module[annotation] : 'No AnnotationText') + '\n';
                    }
                }

                if (tmpstring == '')
                    tmpstring = 'Error: No Annotations';

                emb.addField('Command: ' + command, tmpstring);

                helpcounter++;

                if (helpcounter == 25) {
                    message.channel.send(emb);
                    msgcounter++;
                    emb = new Discord.MessageEmbed().setTitle('General Settings ' + msgcounter);
                }
            }
        }

        if (helpcounter > 0)
            message.channel.send(emb);

    } catch (error) {
        Logger.log(error);
    }
}

function musicHelp(message) { //prints all Shortcuts in MusicShortcut.json
    try {
        let musicShortcut = fh.get('../Files/MusicShortcut.json'); //Get File
        const music = fh.get('../Files/helpFiles/musicHelp.json');
        let msgcounter = 0;
        let helpcounter = 0;
        let emb = new Discord.MessageEmbed().setTitle('Music Settings');

        for (let com in music) {

            let comm = music[com];

            if (com == "play") {
                emb.addField("Command:   " + com, 'Usage:           '.concat(comm.usage).concat('\nDoes:             ').concat(comm.does).concat('\nRandomisedPlaylist: ').concat(comm.RandomisedPlaylists));
            } else {
                emb.addField("Command:   " + com, 'Usage:           '.concat(comm.usage).concat('\nDoes:             ').concat(comm.does));
            }

            helpcounter++;

            if (helpcounter == 25) {
                message.channel.send(emb);
                msgcounter++;
                emb = new Discord.MessageEmbed().setTitle('Music Settings ' + msgcounter);;
            }
        }

        let shortcuts = '';
        for (let com in musicShortcut) {

            if (shortcuts.concat(com + '\n') >= 256) {
                emb.addField('Shortcuts', shortcuts);
                shortcuts = com + '\n';
            } else {
                shortcuts = shortcuts.concat(com + '\n');
            }

        }
        emb.addField('Shortcuts', shortcuts);
        message.channel.send(emb);

    } catch (error) {
        Logger.log(error);
        message.channel.send("Error in MusicShortcut.json orr musicHelp.json");
    }
}

function whatToDrawHelp(message) {
    try {
        const whatToDraw = fh.get('../Files/helpFiles/whatToDrawHelp.json'); //Get File
        let msgcounter = 0;
        let helpcounter = 0;
        let emb = new Discord.MessageEmbed().setTitle('whatToDraw Settings');

        for (let com in whatToDraw) {

            let comm = whatToDraw[com];

            emb.addField("Command:   " + com, 'Usage:           '.concat(comm.usage).concat('\nDoes:             ').concat(comm.does));

            helpcounter++;

            if (helpcounter == 25) {
                message.channel.send(emb);
                msgcounter++;
                emb = new Discord.MessageEmbed().setTitle('whatToDraw Settings ' + msgcounter);;
            }
        }

        if (helpcounter > 0) {
            message.channel.send(emb);
        }
    } catch (error) {
        Logger.log(error);
        message.channel.send("Error in whatToDrawHelp.json");
    }
}

function nameHelp(message) {
    try {
        const names = fh.get('../Files/helpFiles/nameHelp.json'); //Get File
        let msgcounter = 0;
        let helpcounter = 0;
        let emb = new Discord.MessageEmbed().setTitle('Name Settings');

        for (let com in names) {

            let comm = names[com];

            emb.addField("Command:   " + com, 'Usage:           '.concat(comm.usage).concat('\nDoes:             ').concat(comm.does));

            helpcounter++;

            if (helpcounter == 25) {
                message.channel.send(emb);
                msgcounter++;
                emb = new Discord.MessageEmbed().setTitle('Name Settings ' + msgcounter);;
            }
        }

        let { validGames } = require('./name');
        let tmp = 'All valid Games that can be added to the List:\n';


        for (let game of validGames) {
            tmp = tmp.concat(game + '\n');
        }

        emb.addField('Valid Games', tmp);
        message.channel.send(emb);

    } catch (error) {
        Logger.log(error);
        message.channel.send("Error in nameHelp.json");
    }
}

function adminHelp(message) {

    try {
        const functions = annotations.getSync('./Commands/Admin.js');
        let msgcounter = 0;
        let helpcounter = 0;
        let emb = new Discord.MessageEmbed().setTitle('Admin Settings');

        for (let func in functions) {

            if (Object.keys(functions[func]).length == 0 || func == 'module') {
                continue;
            }

            let tmpstring = '';

            for (let annotation in functions[func]) {
                tmpstring = tmpstring.concat('\n' + annotation.charAt(0).toUpperCase() + annotation.slice(1) + ': ' + functions[func][annotation]);
            }

            emb.addField('Command: ' + func, tmpstring);
            helpcounter++;

            if (helpcounter == 25) {
                message.channel.send(emb);
                msgcounter++;
                emb = new Discord.MessageEmbed().setTitle('Admin Settings ' + msgcounter);;
            }
        }

        if (helpcounter > 0) {
            message.channel.send(emb);
        }
    } catch (error) {
        Logger.log(error);
        message.channel.send("Error in Admin.js");
    }
}