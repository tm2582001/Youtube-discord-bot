require('dotenv').config();

const discord = require("discord.js");
const { Client } = require('discord.js');

const authorize = require('./title-updater');
// saving important keys i variables
const token = process.env.Discord_TOKEN;
const guildId = process.env.GUILD_ID;
const channelId = process.env.CHANNEL_ID;

// asking for permissions
const intents = ["GUILDS", "GUILD_MEMBERS", "GUILD_PRESENCES", "GUILD_MESSAGES"];
const client = new Client({ intents: intents, ws: { intents: intents } });

// some global variable
let memberJoined = [];
let luckyMember = " ";
let timeOut = false;

// function for selecting random new member
function getLuckyMember(){
    let luckyNumber = Math.floor(Math.random()*memberJoined.length);
    console.log(luckyNumber);
    return memberJoined[luckyNumber];
}

// saving new members data
function addMemberJoined(Username,Id){
    let newMember = {
        Username: Username,
        Id: Id
    }

    memberJoined.push(newMember);

}

// removing member who leaves the server
function removeMemberJoined(id){
    memberJoined = memberJoined.filter(member => member.Id !== id);
}

// an interval for allowing permission to send request
setInterval(() => {
    console.log("timeout");
    timeOut = false;
}, 50000)

// sending request to discord after starting bot
client.once('ready', () => {
    if (!timeOut) {
        let myGuild = client.guilds.cache.get(guildId);
        let membersCount = myGuild.memberCount;
        authorize(membersCount, luckyMember);
        console.log(membersCount);
        timeOut = true;
    }

});

// this event will trigger after a new member joint this sever
client.on('guildMemberAdd', (member) => {

    // extracting new member data
    let newMemberUsername = member.user.username;
    let newMemberId = member.user.id;
    addMemberJoined(newMemberUsername,newMemberId);
    

    if (!timeOut) {
        
        luckyMember = getLuckyMember();
        memberJoined = [];  // removing previous time frame data
        
        if(luckyMember){
            // pinging specail member
            member.guild.channels.cache.get(channelId).send("Congratulation <@" + luckyMember.Id + "> you will see your name at my youtube title");
            
            // for member count
            let myGuild = client.guilds.cache.get(guildId);
            let membersCount = myGuild.memberCount;
            // calling youtube authentication
            authorize(membersCount, luckyMember.Username);
            console.log(membersCount);
        }else{
            // this is practical imposible but it is here for specail case 
            let myGuild = client.guilds.cache.get(guildId);
            let membersCount = myGuild.memberCount;
            authorize(membersCount);
            console.log(membersCount);
        }
        
        timeOut = true;
    }
});

client.on("guildMemberRemove", (member) => {

    // saving data of member who left this server
    let leftMemberId = member.user.id;
    
    removeMemberJoined(leftMemberId);

    if (!timeOut) {
        luckyMember = getLuckyMember();
        memberJoined = [];

        if(luckyMember){
            member.guild.channels.cache.get(channelId).send("Congratulation <@" + luckyMember.Id + "> you will see your name at my youtube title");
            
            // for member count
            let myGuild = client.guilds.cache.get(guildId);
            let membersCount = myGuild.memberCount;

            // calling youtube authentication
            authorize(membersCount, luckyMember.Username);
            console.log(membersCount);
        }else{
            let myGuild = client.guilds.cache.get(guildId);
            let membersCount = myGuild.memberCount;
            authorize(membersCount);
            console.log(membersCount);
        }
        
        timeOut = true;
    }

});


client.login(token);