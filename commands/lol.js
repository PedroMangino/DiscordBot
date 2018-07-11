const { riotKey } = require('../config.json');
const request = require('request');

module.exports = {
    name: 'lol',
    description: 'Lol commands',
    async execute(message, args) {        

        const requestSummonerData = (region, name, callback) => {
            // Official riot API https://developer.riotgames.com/api-methods/#summoner-v3/GET_getBySummonerName
            let url = 'https://' + region + '1.api.riotgames.com';
            url = url + '/lol/summoner/v3/summoners/by-name/' + name + '?api_key=' + riotKey;

            request(url, { json: true }, (err, res, body) => {
                if (err) { return console.log(err); }

                callback(body);
            });
        };

        const requestRankedData = (region, id, callback) => {
            let url = 'https://' + region + '1.api.riotgames.com';
            url = url + '/lol/league/v3/positions/by-summoner/' + id + '?api_key=' + riotKey;
            request(url, { json: true }, (err, res, body) => {
                if (err) { return console.log(err); }

                callback(body);
            });
        };
/*
 # requesting the ranked stats from a summoner
        if words[1].lower() == 'ranked' and words[2] and words[3]:
            sdJSON = requestSummonerData(words[2], words[3])
            ID = sdJSON['id']
            ID = str(ID)
            rdJSON = requestRankedData(words[2],ID)
            ret = '```'
            for i in range(len(rdJSON)):
                ret += "\nRanked type :"+rdJSON[i]['queueType'].split('_')[1].capitalize()\
                +'\n' + rdJSON[i]['tier'].capitalize() + ' - ' + rdJSON[i]['rank']\
                + '\nW: ' + str(rdJSON[i]['wins']) + ' / L: ' + str(rdJSON[i]['losses'])+'\n'

            await client.send_message(message.channel,ret + '```')
*/


        // possible subcommands in "lol" command
        switch(args[0].toLowerCase()) {
            case 'match':
                message.channel.send('Not implemented yet!');
                break;

            case 'ranked':
                if(!args[1] || !args[2]) return message.channel.send('Invalid argumments!');

                requestSummonerData(args[1], args[2], (sdJSON) =>{
                   requestRankedData(args[1], sdJSON.id, (rdJSON) =>{
                       // the ``` characther creates a code block on the chat
                        let ret = '```';
                        for (i in rdJSON) {
                            ret += `\nRanked type: ${rdJSON[i]['queueType'].split('_'[1])}\n${rdJSON[i]['tier']} - ${rdJSON[i]['rank']}\nW: ${rdJSON[i]['wins']} / L: ${rdJSON[i]['losses']}\n`;
                        }
                        message.channel.send(ret + '```');
                   });
                });
                break;
        }

    } };

/*
def requestSummonerData(region,name):
    # Pega os dados do invocador https://developer.riotgames.com/api-methods/#summoner-v3/GET_getBySummonerName
    url = 'https://'+region+'1.api.riotgames.com'
    url= url+'/lol/summoner/v3/summoners/by-name/'+name+'?api_key='+riotKEY
    print (url)
    response = requests.get(url)
    return response.json()


def requestRankedData(region,id):
    url = 'https://'+region+'1.api.riotgames.com'
    url = url +'/lol/league/v3/positions/by-summoner/'+id+'?api_key='+riotKEY
    print (url)
    response = requests.get(url)
    return response.json()

def requestMatchData(region,id):
    url =  'https://'+region+'1.api.riotgames.com'
    url += '/lol/spectator/v3/active-games/by-summoner/'+id+'?api_key='+riotKEY
    print(url)
    response = requests.get(url)
    return response.json()
    */