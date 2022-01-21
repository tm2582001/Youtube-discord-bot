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
let membersCount;

// function for selecting random new member
function getLuckyMember() {
    console.log(memberJoined.length + ' Length of memberJoined');
    console.log(memberJoined);
    let luckyNumber = Math.floor(Math.random() * memberJoined.length);
    console.log(luckyNumber);
    return memberJoined[luckyNumber];
}

// saving new members data
function addMemberJoined(Username, Id) {
    let newMember = {
        Username: Username,
        Id: Id
    }

    memberJoined.push(newMember);

}

// removing member who leaves the server
function removeMemberJoined(id) {
    memberJoined = memberJoined.filter(member =>  (member.Id !==id));
}

// an interval for updating youtube title
setInterval(() => {
    console.log("updated");

    luckyMember = getLuckyMember();
    memberJoined = [];  // removing previous time frame data

    if (luckyMember) {
        // pinging special member
        client.channels.cache.get(channelId).send("Congratulation <@" + luckyMember.Id + "> you will see your name at my youtube title");

        // calling youtube authentication
        authorize(membersCount, luckyMember.Username);
        console.log(membersCount + " new member");
    } else {

        // caling youtube authentication
        authorize(membersCount);
        console.log(membersCount + " no new member");
    }

}, 600000);

// sending request to discord after starting bot
client.once('ready', () => {

    let myGuild = client.guilds.cache.get(guildId);
    membersCount = myGuild.memberCount;

    console.log(membersCount);
    authorize(membersCount);


});

// this event will trigger after a new member joint this sever
client.on('guildMemberAdd', (member) => {

    // extracting new member data
    let newMemberUsername = member.user.username;
    let newMemberId = member.user.id;

    addMemberJoined(newMemberUsername, newMemberId);

    // updating member count
    let myGuild = client.guilds.cache.get(guildId);
    membersCount = myGuild.memberCount;
    console.log(membersCount);

    // sending message to see it is working
    member.guild.channels.cache.get(channelId).send("Welcome");

});

// this event will trigger when member is removed
client.on("guildMemberRemove", (member) => {

    // saving data of member who left this server
    let leftMemberId = member.user.id;

    removeMemberJoined(leftMemberId);

    //updating member count 
    let myGuild = client.guilds.cache.get(guildId);
    membersCount = myGuild.memberCount;
    console.log(membersCount);

    // sending message to see bot is running or not
    member.guild.channels.cache.get(channelId).send("bye");
});


client.login(token);