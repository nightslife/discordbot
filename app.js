const Discord = require('discord.js');
// const config = require("./config.json")
const client = new Discord.Client();

const clientBotId = process.env.BOT_TOKEN
const applicationMessagedeleteTime = 1;

let forwardOfficerID = process.env.officerID;

function pasteToOfficer(message) {
    let user = message.member.user;
    if(message.member.roles.cache.find(role => role.name === 'officers')){
        return
    }
    let officerChannel = message.guild.channels.cache.find(ch => ch.name === process.env.application_channel)
    let officerRole = message.channel.guild.roles.cache.find(role => role.name === 'officers');
    const embed = new Discord.MessageEmbed()
        .setTitle(`${user.username}#${user.discriminator}`)
        .setDescription(message.content);
    officerChannel.send("<@&"+officerRole.id+"> New Recruit",{embed:embed})
    user.createDM().then((channel) => {
        channel.send(`Hello ${user.username}`);
        channel.send({embed: embed});
    }).catch((err) =>{
        console.log(err)
    })
    message.delete({timeout: applicationMessagedeleteTime})
}


function relayDMs(message) {
    let user = message.author;
    if(client.user.id === message.author.id)return
    const embed = new Discord.MessageEmbed()
        .setTitle(`${user.username}#${user.discriminator}`)
        .setDescription(message.content);
    client.users.cache.get(forwardOfficerID).send({embed: embed}).catch((err) => {console.log(err)})

}
client.on('ready', () => {
    console.log('I am ready');
});

client.on('message', message => {
    if (!message.channel) return;
    // console.log(message)
    if (message.channel.id === process.env.applicationChannelID) pasteToOfficer(message)
    if (message.channel.type === 'dm') relayDMs(message)
});

client.login(clientBotId)