var express = require('express')
var cors = require('cors')
const axios = require('axios')

var app = express();

app.use(cors());

const API_KEY = "RGAPI-dbd3f619-b53c-49c2-9f47-b4b30cd890b0"


function getPlayerPUUID(playerName){
    const playerNameValue = playerName.searchText
    console.log('playername: ', playerNameValue)
    // return axios.get("https://euw1.api.riotgames.com" + "/lol/summoner/v4/by-name/" + playerName + "?api_key=" + API_KEY)
    let url ="https://euw1.api.riotgames.com" + "/lol/summoner/v4/summoners/by-name/" + playerNameValue + "?api_key=" + API_KEY
    return axios.get(url)
    .then(response => {
        console.log(response.data);
        return response.data.puuid
    }).catch(err => err);
}

function getPlayerID(playerName){
    const playerNameValue = playerName.searchText
    console.log('playername: ', playerNameValue)
    // return axios.get("https://euw1.api.riotgames.com" + "/lol/summoner/v4/by-name/" + playerName + "?api_key=" + API_KEY)
    let url ="https://euw1.api.riotgames.com" + "/lol/summoner/v4/summoners/by-name/" + playerNameValue + "?api_key=" + API_KEY
    return axios.get(url)
    .then(response => {
        console.log(response.data);
        return response.data.id
    }).catch(err => err);
}

//GET past5Games
//Get localhost:4000/past5Games

app.get('/past5Games', async (req,res) => {
    const playerName = req.query.username
    // PUUID
    const PUUID = await getPlayerPUUID(playerName)
    console.log('PUUID', PUUID)
    const API_CALL = 'https://europe.api.riotgames.com' + "/lol/match/v5/matches/by-puuid/" + PUUID + "/ids" + "?api_key=" + API_KEY
    //console.log('api call value: ', API_CALL)
    //get API_CALL
    //its goiing to give us a list of game ID's
    const gameIDs = await axios.get(API_CALL)
    .then(response => response.data)
    .catch(err => err)

    // A list of game ID strings
    //console.log(gameIDs)

    //loop through game ID'q
    // at each loop, get the information based off ID (API CALL)
    var matchDataArray = [];
    for(var i = 0; i < gameIDs.length - 15; i++){
        const matchID = gameIDs[i];
        const matchData = await axios.get('https://europe.api.riotgames.com' + "/lol/match/v5/matches/" + matchID + "?api_key=" + API_KEY)
        .then(response => response.data)
        .catch(err => err)
        matchDataArray.push(matchData)
    }

    // save information above in an array, give array as JSON response to user
    res.json(matchDataArray)
})


app.get('/ChampionMastery', async (req,res) => {
    const playerName = req.query.username
    const ID = await getPlayerID(playerName)
    console.log('ID', ID)
    const API_CALL = 'https://euw1.api.riotgames.com' + "/lol/champion-mastery/v4/champion-masteries/by-summoner/" + ID + "?api_key=" + API_KEY
    console.log('api call value: ', API_CALL)
    //get API_CALL
    //its goiing to give us a list of game ID's
    const champMastery = await axios.get(API_CALL)
    .then(response => response.data)
    .catch(err => err)

       // A list of champMastery strings
    //console.log(champMastery)

    //loop through game ID's
    // at each loop, get the information based off ID (API CALL)
    /*var champMasteryArray = [];
    for(var i = 0; i < champMastery.length - 154; i++){
        const matchID = champMastery[i];
        const matchData = await axios.get('https://euw1.api.riotgames.com' + "/lol/champion-mastery/v4/champion-masteries/by-summoner/" + matchID + "?api_key=" + API_KEY)
        .then(response => response.data)
        .catch(err => err)
        champMasteryArray.push(matchData)
    }*/

    // save information above in an array, give array as JSON response to user
    res.json(champMastery)
})

app.get('/GameId', async (req,res) => {
    const Gameid = req.query.username
    const GameidValue = Gameid.GameId
    console.log(GameidValue)
    
        const matchData = await axios.get('https://europe.api.riotgames.com/lol/match/v5/matches/' + GameidValue + '?api_key=' + API_KEY)
        .then(response => response.data)
        .catch(err => err)

    // save information above in an array, give array as JSON response to user
    console.log(matchData)
    res.json(matchData)
})

app.listen(4000, function () {
    console.log("Server started on port 4000")
});