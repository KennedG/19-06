const Discord = require("discord.js");
const db = require("quick.db")

module.exports.run = async (client, message, args) => {
     if (!message.member.permissions.has("KICK_MEMBERS")) return message.reply("Você não tem permissão para isso.");
  
  let member = message.mentions.users.first()
  if(!member) return message.channel.send("Mencione o usuário a ter a advertência removida!");
  

  let warns = await db.get(`warnsCount_${message.guild.id}-${member.id}`)
  
  if(!args[1]) return message.channel.send("Você precisa colocar o número de advertências que deseja remover!")
  
  if(message.content.includes(" -")) return message.channel.send("Você não pode retirar uma quantia negativa de advertências!")
  
  if(member.id === message.author.id) return message.channel.send("Você não pode retirar advertências de você mesmo!")
  
  
  if(warns < args[1]) return message.channel.send("Você não pode retirar advertências que o membro não possui!")
  
  const rwarns = new Discord.MessageEmbed()
  .setTitle("Remoção de Advertência")
  .setColor("RANDOM")
  .setFooter(`Removoção efetuada`, message.author.displayAvatarURL({format: "png"}))
  .addField("Removida de:", `\`${member.tag}\``)
  .addField("Removido por:", `\`${message.author.username}\``)
  .addField("Quantidade:", `\`${args[1]}\``)
 
  
  db.subtract(`warnsCount_${message.guild.id}-${member.id}`, args[1])

    message.channel.send({ embeds: [rwarns]} )
  
}