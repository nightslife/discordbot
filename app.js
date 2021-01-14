const Discord = require('discord.js');
// const config = require("./config.json")
const client = new Discord.Client();

const clientBotId = process.env.BOT_TOKEN
const applicationMessagedeleteTime = 1;

let forwardOfficerID = process.env.officerID;

function pasteToOfficer(message) {
    let user = message.member.user;
    if(message.member.roles.cache.find(role => role.name === 'Officer')){
        return
    }
    let officerChannel = message.guild.channels.cache.find(ch => ch.name === process.env.application_channel)
    let officerRole = message.channel.guild.roles.cache.find(role => role.name === 'Officer');
    const embed = new Discord.MessageEmbed()
        .setTitle(`${user.username}#${user.discriminator}`)
        .setDescription(message.content);
    officerChannel.send("<@&"+officerRole.id+"> New Recruit",{embed:embed})
    user.createDM().then((channel) => {
        channel.send(`Hello ${user.username}. Thank you for your interest in joining Delusions of Grandeur - Zul'Jin. Your application has been moved to the review channel and the officers have been notified. 
        Below is a copy of the application that was sent. If you wish to edit, update, or just want to reach out to the officers, please reply to me instead of submitting another message in our discord. Thank you again 
        for your interest and good luck.`);
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