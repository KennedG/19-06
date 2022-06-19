const Discord = require("discord.js");
const db = require("quick.db");

module.exports.run = async (client, message, args) => {
  
  let member = message.mentions.members.first() || message.member;
  
 let warnings = await db.get(`warnsCount_${message.guild.id}-${member.id}`) || 0;
  
  
  const avisos = new Discord.MessageEmbed()
  .setAuthor(`Advertências`, message.guild.iconURL())
  .setDescription(`**${member.user} Possui \`${warnings}\` advertência(s)**`)
  .setColor("RANDOM")
  .setThumbnail(member.displayAvatarURL())
  .setFooter(`Comando feito por: ${message.author.username}`, message.author.displayAvatarURL({format: "png"}))
      message.channel.send({ embeds: [avisos]} )
}