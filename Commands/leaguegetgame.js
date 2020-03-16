const Discord = require('discord.js');
const WebSocket = require('ws');
const champions = require('../Files/champions.json');

module.exports = {

    leaguegetgame: async function (message) {

        const ws = new WebSocket('ws://leftdoge.de:60001'); //Connection to Server

        name = getleagueName(message);

        ws.on('open', function open() { //Request

            ws.send('LeagueAPI ' + name);

        });

        ws.on('message', function incoming(data) { //Answer

            if (data == 'ERROR') {
                message.channel.send('An Error occured or Player isn`t ingame');
                return;
            }

            activeGames = JSON.parse(data);

            let mes = new Discord.RichEmbed();
            mes.setTitle('LEAGUE GAME');

            for (var x = 0; x < activeGames.participants.length; x++) {
                let Link = '[' + activeGames.participants[x].summonerName + '](' + 'https://euw.op.gg/summoner/userName=' + activeGames.participants[x].summonerName.replace(/ /g, '_') + ')';
                mes.addField(getChamp(activeGames.participants[x].championId), Link);
            }
            message.channel.send(mes);
        });
    }
}

function getChamp(ID) {
    for (var champ in champions.data) {
        if (champions.data[champ].key == ID) {
            return champ;
        }
    }
}

function getleagueName(message) { //Gives back a NameString 

    let contentArgs = message.content.split(" ");

    if (contentArgs[1] == null) { //Hardcoded Names
        return require('./name').getName('lol',message.author.username); //Get name from local/names.json
    } else {
        return message.content.substring(contentArgs[0].length+1);  //When Name given
    }
}