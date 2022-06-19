const Discord = require("discord.js");
const db = require("quick.db")

module.exports = {
    name: "warn",
    aliases: ['avisar'],  
    run: async(client, message, args) => {

    if (!message.member.permissions.has("KICK_MEMBERS")) return message.reply("Você não tem permissão para isso.");

    let warns = db.fetch(`warns_${message.author.id}`)
      if(!warns) warns = "0"

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    const autor = message.author
    let reason = args.splice(1, args.length).join(' ');
    let canal = client.channels.cache.get(''); //ID do canal

    if (!member) return message.reply("Você precisa selecionar alguém para advertir.");
    if (member.id === message.author.id) return message.reply("Você não pode da warn em si mesmo.");
    if (!reason) reason = 'Não informado.'
    
    try {
    } catch {
        return await message.reply("Ocorreu algum erro no meu sistema... Chama o meu criador, por favor?");
    }
    db.add(`warns_${message.author.id}`, 1)
    let avatarautor = autor.avatarURL({ size: 4096 })

    let warnEMBED = new Discord.MessageEmbed()
    .setTitle(`⚠️ Advertências:`)
    .setThumbnail(member.user.avatarURL({ dynamic: true, format: 'png' }))
    .addField(`🏵️ - Tag do Usuário:`, `${member.user.tag}`)
    .addField(`🆔 - ID do Usuário:`, `${member.user.id}`)
    .addField(`🌟 - Autor:`, `${message.author}`)
    .setColor(`RANDOM`)
    .addField(`📄 - Motivo:`, `${reason}`)
    .setFooter(`${message.author.username}`, avatarautor)
       .setTimestamp()
      
      db.add(`warnsCount_${message.guild.id}-${member.id}`, 1)
   
     message.channel.send(`${member} você foi advertido!`)
    message.channel.send({ embeds: [warnEMBED]} )
 }
}