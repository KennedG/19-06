const Discord = require("discord.js")

module.exports = {
    run: async(client, message, args) => {
        if(!message.member.permissions.has("ADMINISTATOR")) return message.reply("**Desculpa mas você não tem permissão de \`Funcionario\`!")

        let embedchat = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
        .setDescription("**Escreva o id do canal que sera enviado a embed de venda!** ")

        let embed1 = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
        .setDescription("**Escreva o nome do produto! **")

        let embed2 = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
        .setDescription("**Escreva a quantidade disponivel do produto! **")

        let embed_erro = new Discord.MessageEmbed()
        .setColor("FF0000")
        .setDescription(`${message.author} Não foi possível reconhecer um canal de texto.`);


        let embed3 = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(client.user.username, client.user.displayAvatarURL({ dynamic: true }))
        .setDescription("**Escreva o preço do produto! **")

        message.reply({ embeds: [embedchat] }).then(msg => {
            let coletor_1 = message.channel.createMessageCollector({ filter: mm => mm.author.id == message.author.id, max: 1 });
            coletor_1.on("collect", (p1) => {
                let chat = p1.mentions.channels.first() || message.guild.channels.cache.get(p1.content);
                if(!chat) {
                    p1.reply({ embeds: [embed_erro] })
                } else 
                if(chat) {
                message.reply({ embeds: [embed1] }).then(msg => {
                    let coletor_2 = message.channel.createMessageCollector({ filter: mm => mm.author.id == message.author.id, max: 1 });
                    coletor_2.on("collect", (p2) => {
                        let b2 = p2.content
                        message.reply({ embeds: [embed2] }).then(msg => {
                            let coletor_3 = message.channel.createMessageCollector({ filter: mm => mm.author.id == message.author.id, max: 1 });
                            coletor_3.on("collect", (p3) => {
                                let b3 = p3.content
                                message.reply({ embeds: [embed3] }).then(msg => {
                                    let coletor_4 = message.channel.createMessageCollector({ filter: mm => mm.author.id == message.author.id, max: 1 });
                                    coletor_4.on("collect", (p4)  => {
                                        let b4 = p4.content
                                        message.reply("**Sua embed de venda foi enviada para o canal!** ").then(msg => {


                                            let stockenvia = new Discord.MessageEmbed()
                                            .setColor("RANDOM")
                                            .setDescription(`**${message.guild.name} | Venda Automático**`)
                                            .setImage(message.guild.iconURL({ dynamic: true}))
                                            .addFields(
                                                {
                                                    name:   "✨ |  Nome: ",
                                                    value:  `**${b2}**`,
                                                },
                                                {
                                                    name:   "💰 | Stock: ",
                                                    value:  `**${b3}**`,
                                                },
                                                {
                                                    name:   "🛒 | Preço: ",
                                                    value:  `**${b4}**`,
                                                }
                                                
                                            )

                                            let buttons = new Discord.MessageActionRow()
                                            .addComponents(
                                                new Discord.MessageButton()
                                                    .setCustomId('1')
                                                    .setStyle('SUCCESS')
                                                    .setLabel('COMPRAR')
                                                    .setEmoji('✅')
                                                    .setDisabled(false),
                                            )
                                            chat.send({ embeds: [stockenvia], components: [buttons]})
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                          }
                        })
                    })
                }
              }