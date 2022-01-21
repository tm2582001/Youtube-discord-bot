let { google } = require('googleapis');
let OAuth2 = google.auth.OAuth2;
var profanity = require("profanity-hindi");
var Filter = require('bad-words'),
    filter = new Filter();
let winner;

function authorize(memberCount,luckyMember) {
    console.log("I was called");
    var clientSecret = process.env.CLIENT_SECRET;
    var clientId = process.env.CLIENT_ID;
    var redirectUrl = process.env.REDIRECT_URI;
    var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

    oauth2Client.credentials = JSON.parse(process.env.OAUTH_TOKEN);
    updateVideo(oauth2Client,memberCount,luckyMember);
}

function updateVideo(auth,memberCount,luckyMember = " ") {
    if(luckyMember !== " "){
        winner = profanity.maskBadWords(filter.clean(luckyMember));
    }
    var service = google.youtube('v3');
    service.videos.update({
        auth: auth,
        part: [
            "snippet"
        ],
        resource: {
            id: process.env.VIDEO_ID,
            snippet: {
                categoryId: 24,
                defaultLanguage: "hi",
                description: `So My Discord Server Has The Same Amount Of Members As Title! 
                
To See If Is Your Name Came Or Not Check Back After 10 Minutes 🙃 And If You Got Your Name Here Share Its Screenshot on Your Story At Instagram And Mention Me (@DilGoZian), I will Re-Share it 😊

Thanks to TSR PlayZ For Making The Bot ❤️
    
His Channel- https://www.youtube.com/c/TSRPlayZ
________________
Follow Me on Instagram:-
https://instagram.com/Dilgozian
    
My discord server- https://dsc.gg/dilgozian
    
Join this channel to get access to perks:
https://www.youtube.com/channel/Dilgozian/join
________________
Thanks To-


Red devil
Shreevardhan Katore
AdITtYaOP
DAM Ayushmaan
LightingTurbo
sus
Gamer Dude 1.0
Sudeepta Dash
Nikhil Mutreja
Factopedia Alt
I AM || XV
RaggyPlayZ
Subid Prusty
Zaco OP
Red devil
God gamer
Shilpa Shilpa
UNIQUE MINECRAFTER
DEVILS GAMING

For Joining This Channel :3
________________`,
                
                tags: ["Discord,Discord Server,discord server,discord mods,discord memes,Discord Server Has The Same Amount Of Members As Title,Discord Server Has This Number Of Members,Discord Server Has This Amount Of Members,discord server has this number of members,discord,discord tutorial,Discord Bot,discord bot,discord bot tutorial,best discord bots,how to make a discord bot,Dilgozian,Dilgozian SMP"],
                
                
                title: `This DISCORD SERVER Has ${memberCount} Members!!! ${winner} Thanks For Joining ♥️`
            }
        }
    });
}

module.exports = authorize;