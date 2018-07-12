const { riotKey } = require('../config.json');
const rp = require('request-promise');

module.exports = {
    name: 'lol',
    description: 'Lol commands',
    async execute(message, args) {

        const urlRequestSummonerData = (region, name) => {
            // Official riot API https://developer.riotgames.com/api-methods/#summoner-v3/GET_getBySummonerName
            let url = 'https://' + region + '1.api.riotgames.com';
            url = url + '/lol/summoner/v3/summoners/by-name/' + name + '?api_key=' + riotKey;
            return url;
        };

        const urlRequestRankedData = (region, id) => {
            let url = 'https://' + region + '1.api.riotgames.com';
            url = url + '/lol/league/v3/positions/by-summoner/' + id + '?api_key=' + riotKey;
            return url;
        };

        const urlRequestMatchData = (region, id) => {
            let url = 'https://' + region + '1.api.riotgames.com';
            url = url + '/lol/spectator/v3/active-games/by-summoner/' + id + '?api_key=' + riotKey;
            return url;
        };

        // possible subcommands in "lol" command
        switch(args[0].toLowerCase()) {
            case 'match':
                rp(urlRequestSummonerData(args[1], args[2]), { json: true })
                .then(({ id }) => {
                    rp(urlRequestMatchData(args[1], id), { json: true })
                    .then(obj => {
                        let ret = '```';
                        ret += '==== Blue  Team ====\n';
                        obj.participants.filter(elm => elm.teamId == '100').forEach(elm => {
                            ret += elm.summonerName + '\n';
                        });

                        ret += '==== Red  Team ====\n';
                        obj.participants.filter(elm => elm.teamId == '200').forEach(elm => {
                            ret += elm.summonerName + '\n';
                        });
                        message.channel.send(ret + '```');
                    }).catch(() => {
                        message.reply('there was an error trying to execute that command!');
                    });
                })
                .catch(() => {
                    message.reply('there was an error trying to execute that command!');
                });
                break;

            case 'ranked':
                if(!args[1] || !args[2]) return message.channel.send('Invalid argumments!');

                rp(urlRequestSummonerData(args[1], args[2]), { json: true })
                .then(({ id }) => {
                    rp(urlRequestRankedData(args[1], id), { json: true })
                    .then(obj => {
                        let ret = '```';
                        obj.forEach(element => {
                            ret += `\nRanked type: ${element['queueType'].split('_'[1])}\n`;
                            ret += `${element['tier']} - ${element['rank']}\n`;
                            ret += `W: ${element['wins']} / L: ${element['losses']}\n`;
                        });
                        message.channel.send(ret + '```');
                    });
                });
                break;
        }
    } };