const Discord = require('discord.js');
const client = new Discord.Client();


const clientBotId = ;//<<insert a discord bot client id here>>;
const guildId = ;//discord server ID
const applicationChannelId = '790983281877057586'; //application channel ID
const officerChannelId = '219584056289918976'; //officer channel ID
const officerRoleId = '<@200357405119217684>'; // officer role ID after the @ sign
const officerForForwardingId = '205135006585061376'; //<id of the officer you want to bot to message> ;
const applicationMessagedeleteTime = 10;

let officerForForwarding;
let officerChannel;
let officerRole;

function pasteApplicationToOfficerChannel(message) {
  // Get the current user.
  let user = message.member.user;

  // Copy their message message into the officer channel using a rich text format for easy reading.
  const embed = new Discord.RichEmbed()
    .setTitle(`${user.username}#${user.discriminator}`)
    .setColor(0x00AE86)
    .setDescription(message.content);
  officerChannel.send({embed});

  // Notify the officers of the new message.
  officerChannel.send(officerRoleId.toString()+"New Recruit");

  // DM the applicant and let them know their message was received.
  user.createDM().then((channel) => {
    channel.send(`Hello ${user.username}, and thank you for your interest in joining <Delusions of Grandeur> - Runetotem! The officers have received your application, will review it and get back to you with a response as soon as possible. For your privacy, and ours, your application has been moved to an officer-only channel and deleted from public view. A copy of your application is below, and if you wish to edit or add to it, just reply here instead of making a new app and I will ensure the officers see it. Thanks again, and good luck =D !`);
	channel.send({embed});
  }).catch((err) => {
    console.log(err);
  });

  // Delete the message after a set time.
  message.delete(applicationMessagedeleteTime);
}

function relayDMsToOfficer(message) {
  // Do not forward messages that the bot is sending out
  if (client.user.id === message.author.id) return;
  let user = message.author;
  // Forward the message to the officer in charge
  officerForForwarding.createDM().then((channel) => {
    // Copy their message message into the DM using a rich text format for easy reading.
    const embed = new Discord.RichEmbed()
      .setTitle(`${user.username}#${user.discriminator}`)
      .setColor(0x00AE86)
      .setDescription(message.content);
    channel.send({embed});
  }).catch((err) => {
    console.log(err);
  });
}

client.on('ready', () => {
  officerRole = Array.from(client.guilds.get(guildId).roles.filter(role => role.name == 'Officer'))[0][1];
  console.log('I am ready!');
  officerChannel = client.channels.get(officerChannelId);
  officerForForwarding = client.guilds.get(guildId).members.get(officerForForwardingId).user;
});

client.on('message', message => {
  if (!message.channel) return;
  if (message.channel.id === applicationChannelId) pasteApplicationToOfficerChannel(message);
  if (message.channel.type === 'dm') relayDMsToOfficer(message);
});

client.login(clientBotId);