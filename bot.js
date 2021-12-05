require('dotenv').config();
const discord = require("discord.js");
const { Client } = require('discord.js');
const authorize = require('./title-updater');

const token = process.env.Discord_TOKEN;
const guildId = process.env.GUILD_ID;
const channelId = process.env.CHANNEL_ID;

const intents = ["GUILDS", "GUILD_MEMBERS", "GUILD_PRESENCES", "GUILD_MESSAGES"];
const client = new Client({ intents: intents, ws: { intents: intents } });

let luckyMember = " ";
let timeOut = false;

setInterval(() => {
    console.log("timeout");
    timeOut = false;
}, 50000)

client.once('ready', () => {
    if (!timeOut) {
        let myGuild = client.guilds.cache.get(guildId);
        let membersCount = myGuild.memberCount;
        authorize(membersCount, luckyMember);
        console.log(membersCount);
        timeOut = true;
    }

});

client.on('guildMemberAdd', (member) => {
    if (!timeOut) {
        luckyMember = member.user.username
        member.guild.channels.cache.get(channelId).send("kuni aa gya");
        let myGuild = client.guilds.cache.get(guildId);
        let membersCount = myGuild.memberCount;
        authorize(membersCount, luckyMember);
        console.log(membersCount);
        timeOut = true;
    }
});

client.on("guildMemberRemove", (member) => {
    if (!timeOut) {
        member.guild.channels.cache.get(channelId).send("kuni bhag gya");
        let myGuild = client.guilds.cache.get(guildId);
        let membersCount = myGuild.memberCount;
        authorize(membersCount, luckyMember);
        console.log(membersCount);
        timeOut = true;
    }

});


client.login(token);