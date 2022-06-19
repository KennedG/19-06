
//Requirimentos
const Discord = require("discord.js"); 
const {Client, Collection, Intents } = require('discord.js');
let cpuStat = require("cpu-stat");
const mongoose = require("mongoose");
const express = require('express');
const db = require('quick.db');
const colors = require('colors');
const config = require("./config.json");
const client = new Discord.Client({intents: 32767});
const discordModals = require("discord-modals");

//Começo index

client.once('ready', async () => {
})
module.exports = client;
client.commands = new Discord.Collection();
client.slashCommands = new Discord.Collection();
const { glob } = require("glob");
const { promisify } = require("util");
const globPromise = promisify(glob);

client.on("interactionCreate", async (interaction) => {

    if (!interaction.guild) return;
  
    if (interaction.isCommand()) {

        const cmd = client.slashCommands.get(interaction.commandName);

        if (!cmd)
            return;

        const args = [];

        for (let option of interaction.options.data) {

            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }

        cmd.run(client, interaction, args);
    }

    if (interaction.isContextMenu()) {
        await interaction.deferReply({ ephemeral: false });
        const command = client.slashCommands.get(interaction.commandName);
        if (command) command.run(client, interaction);
        
    }
});

//RECONECTANDO SHARD 
client.on('ready', () => {

    const logs = client.channels.cache.get('966110468563419206') // ID do canal que ira mandar a msg

    logs.send({
        embeds: [
            new Discord.MessageEmbed()
            .setColor('#000000')
            .setTitle('SHARD STATUS')
            .setThumbnail('https://i.imgur.com/OjgBomX.jpeg') // Link da imagem que vc queira
            .setDescription('Shard 1 reconectada com sucesso!')
        ]
    })
}) 


//Recebendo ping
const app = express();

app.get('/', (request, response) => {
	const ping = new Date();
	ping.setHours(ping.getHours() - 3);
	console.log(
		`Ping recebido às ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`
	);
		response.sendStatus(200);
	});
	app.listen(process.env.PORT); // Recebe solicitações que o deixa online

//sistema de call temp...
	client.on("voiceStateUpdate", async (oldChannel, newChannel) => {
    
		let canal_nome = "Clique aqui ✅";
	
		if (oldChannel.channel || newChannel.channel || !oldChannel.channel || !newChannel.channel) { // Verificando quando o usuário entra ou sai de uma call
	
			if (!oldChannel.channel && newChannel.channel/* || newChannel.channel && oldChannel.channel*/) { // Verificando quando o usuário entra em uma call
	
				if (newChannel.channel.name === canal_nome) { // Verificando o nome do canal
	
					await newChannel.channel.guild.channels.create(`${client.users.cache.get(newChannel.id).username}`, {type: "GUILD_VOICE", // Criando call personalizada
					permissionOverwrites: [ // Setando permissões
						{
							id: newChannel.id,
							allow: "MANAGE_CHANNELS",
						}
					] }).catch(e=>{}).then(channel => {
						newChannel.setChannel(channel.id).catch(e=>{});
					})
	
				}
			} else if (!newChannel.channel || newChannel.channel && oldChannel.channel) { // Verificando quando o usuário sai de uma call
	
				if (oldChannel.channel.name === client.users.cache.get(newChannel.id).username) { // Verificando quando o usuário sai da call personalizada
	
					oldChannel.channel.delete().catch(e=>{}); // Excluindo a call personalizada
	
				}
	
			}
	
		}
	})
    
    
    /**
     * @param {Client} client
     */
    module.exports = async (client) => {
    
        const slashCommands = await globPromise(
            `${process.cwd()}/SlashCommands/*/*.js`
        );
    
        const arrayOfSlashCommands = [];
        slashCommands.map((value) => {
            const file = require(value);
            if (!file?.name) return;
            client.slashCommands.set(file.name, file);
    
            if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
            arrayOfSlashCommands.push(file);
        });
        client.on("ready", async () => {
            await client.application.commands.set(arrayOfSlashCommands);
    
        });
    
    };

    //status
  
client.on("ready", () => {
  let activities = [
      `Reinciando Shard!`,
    ],
    i = 0;
  setInterval( () => client.user.setActivity(`${activities[i++ % activities.length]}`, {
        type: "LISTENING"
      }), 30000); // Aqui e o tempo de troca de status, esta e mili segundos 
  client.user
      .setStatus("")
});

//HANDLER
client.on('messageCreate', message => {
        if (message.author.bot) return;
        if (message.channel.type == 'dm') return;
        if (!message.content.toLowerCase().startsWith(config.prefix.toLowerCase())) return;
        if (message.content.startsWith(`<@!${client.user.id}>`) || message.content.startsWith(`<@${client.user.id}>`)) return;
   
       const args = message.content
           .trim().slice(config.prefix.length)
           .split(/ +/g);
       const command = args.shift().toLowerCase();

       db.add(`comandos`, 1)
   
   const embedi = new Discord.MessageEmbed()
   
             .setTitle("Logs Commands")
             .setColor("#0060EE")
             .addFields(
               {
                 name: `Servidor que foi Usado`,
                 value: `**${message.guild.name}** \`( ${message.guild.id} )\``,
               },
               {
                 name: `Author do Comando`,
                 value: `**${message.author.tag}** \`( ${message.author.id} )\``,
               },
               {
                 name: `O que foi executado`,
                 value: `**\`G!${command} ${args.join(" ")}\`**`,
               },
               
             )
             .setTimestamp()
             .setFooter(
               `${message.author.id}`,
               message.author.displayAvatarURL({ dynamic: true })
             
             );
   
           client.channels.cache.get("944666903874502676").send({ embeds: [embedi] });
     
       try {
           const commandFile = require(`./commands/${command}.js`)
           commandFile.run(client, message, args);
       } catch (err) {
       console.error('Erro:' + err);
     }
});


//Contador sever

client.on("guildMemberAdd", (member) => {
    let id = db.get(`contador_${member.guild.id}`);
    let canal = member.guild.channels.cache.get(id);
    if (!canal) return;

    let membros = member.guild.memberCount;
    canal.setName(`👥 Membros: ${membros}`)
})
client.on("guildMemberRemove", (member) => {
    let id = db.get(`contador_${member.guild.id}`);
    let canal = member.guild.channels.cache.get(id);
    if (!canal) return;

    let membros = member.guild.memberCount;
    canal.setName(`👥 Membros: ${membros}`)
})

//antilink

client.on('messageCreate', async (message) => {

    if (message.author.bot) return;
    if (message.channel.type == 'dm') return;

    let verificando = db.get(`antilink_${message.guild.id}`);
    if (!verificando || verificando === "off" || verificando === null || verificando === false) return;

    if (verificando === "on") {

        if (message.member.permissions.has("MANAGE_GUILD")) return;
        if (message.member.permissions.has("ADMINISTRATOR")) return;

        if (message.content.includes("https".toLowerCase() || "http".toLowerCase() || "www".toLowerCase() || ".com".toLowerCase() || ".br".toLowerCase())) {

        message.delete();
        message.channel.send(`${message.author} **Você não pode enviar links aqui!** <:az_moderador_old:909264644168900629>`)

        }


    }

})

// ANTICLASH
	process.on('unhandledRejection', (reason, p) => {
		console.log(' [ ANTICLASH ] | SCRIPT REJEITADO');
		console.log(reason, p);
	});
	process.on("uncaughtException", (err, origin) => {
		console.log(' [ ANTICLASH] | CATCH ERROR');
		console.log(err, origin);
	})
	process.on('uncaughtExceptionMonitor', (err, origin) => {
		console.log(' [ ANTICLASH ] | BLOQUEADO');
		console.log(err, origin);
	});
	process.on('multipleResolves', (type, promise, reason) => {
		console.log(' [ ANTICLASH ] | VÁRIOS ERROS');
		console.log(type, promise, reason);
	});
    process.on('uncaughtException', error => {
        console.error(colors.red("[Info]")+" Ocorreu um erro na aplicação! Detalhes embaixo:");
        console.error(error.stack);
    });


//Log remove
client.on("guildDelete", async (guild) => {
    let canal = client.guilds.cache.get(`644991505873895434`).channels.cache.get(`925169349264830484`) // ID do servidor suporte e ID do chat respectivamente.

    let embed = new Discord.MessageEmbed()
    .setColor("FF0000")
    .setAuthor(client.user.username, client.user.displayAvatarURL())
    .setDescription(`**Me removeram de um novo servidor!**`)

    let button = new Discord.MessageActionRow()
    .addComponents(
        
        new Discord.MessageButton()
        .setCustomId("1")
        .setEmoji("🔥")
        .setLabel(`Detalhes`)
        .setStyle("DANGER")
    )

    canal.send({embeds: [embed], components: [button]}).then(msg => {
        const filter = (i) => {
            return i.isButton() && i.message.id == msg.id
        }

        const collector = msg.createMessageComponentCollector({
            filter: filter,
            time: 60000,
        }).on("collect", async(interaction) => {

            switch(interaction.customId) {

                case "1": {
                    const embed2 = new Discord.MessageEmbed()
                    .setColor("FF0000")
                    .setAuthor(client.user.username, client.user.displayAvatarURL())
                    .setDescription(`**Detalhes do servidor:**`)
                    .addFields(
                        {
                            name: "⠀",
                            value: `
> __Nome:__ \`${guild.name}\`

> __ID:__ \`${guild.id}\`
                            
> __Membros:__ \`${guild.members.cache.size}\`
                            
> __Dono:__ ${await guild.fetchOwner()}
                            
> __Dono ID:__ \`${guild.ownerId}\``
                        },
                    );

                    let button_off = new Discord.MessageActionRow()
                    .addComponents(new Discord.MessageButton()
                     .setCustomId("1")
                     .setEmoji("🔥")
                     .setLabel(`Detalhes`)
                     .setStyle("DANGER")
                     .setDisabled(true)
                     )

                    interaction.update({embeds: [embed2], components: [button_off]})

                    break
                }
            }
        })
    })
})

client.on("guildCreate", async(guild) => {
    let canal = client.guilds.cache.get(`644991505873895434`).channels.cache.get(`907751959254167583`) // ID do servidor suporte e ID do chat respectivamente.

    let embed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setAuthor(client.user.username, client.user.displayAvatarURL())
    .setDescription(`**Me adicionaram em um novo servidor!**`)

    let button = new Discord.MessageActionRow()
    .addComponents(
        
        new Discord.MessageButton()
        .setCustomId("1")
        .setEmoji("🔥")
        .setLabel(`Detalhes`)
        .setStyle("SECONDARY")
    )

    canal.send({embeds: [embed], components: [button]}).then(msg => {
        const filter = (i) => {
            return i.isButton() && i.message.id === msg.id
        }

        const collector = msg.createMessageComponentCollector({
            filter: filter,
            time: 60000,
        }).on("collect", async(interaction) => {

            switch(interaction.customId) {

                case "1": {
                    const embed2 = new Discord.MessageEmbed()
                    .setColor("RANDOM")
                    .setAuthor(client.user.username, client.user.displayAvatarURL())
                    .setDescription(`**Detalhes do servidor:**`)
                    .addFields(
                        {
                            name: "⠀",
                            value: `
> __Nome:__ \`${guild.name}\`

> __ID:__ \`${guild.id}\`
                            
> __Membros:__ \`${guild.members.cache.size}\`
                            
> __Dono:__ ${await guild.fetchOwner()}
                            
> __Dono ID:__ \`${guild.ownerId}\``
                        },
                    );

                    let button_off = new Discord.MessageActionRow()
                    .addComponents(new Discord.MessageButton()
                     .setCustomId("1")
                     .setEmoji("🔥")
                     .setLabel(`Detalhes`)
                     .setStyle("SECONDARY")
                     .setDisabled(true)
                     )

                    interaction.update({embeds: [embed2], components: [button_off]})
                }
            }
        })
    })
});


/*============================= |ONLINE CONSOLE | =========================================*/
const    
bright = "\x1b[1m",
blink = "\x1b[5m",
preto = "\x1b[30m",
vermelho = "\x1b[31m",
verde = "\x1b[32m",
amarelo = "\x1b[33m",
azul = "\x1b[34m",
roxo = "\x1b[35m",
ciano = "\x1b[36m",
branco = "\x1b[37m"

/*======================== |CONSOLE LOG COLORIDO||=========================================*/
const cfonts = require('cfonts');
    const banner = cfonts.render((`Kenned`), {
        font: 'block',
        color: 'rgb',
        align: 'left',
        gradient: ["red","blue"],
        lineHeight: 3
    });    

console.log(banner.string);

colorful = (color, string, reset = '\x1b[5m') => color + string + reset;
client.once("ready", (member) => {
  client.user.setActivity("Estou Online", {
    
  });
    console.log(colorful(vermelho, `⊱ ============ ⊱ [LOGS INCIAIS] ⊰ ============ ⊰`)),
 console.log("✅ - Logado em "+client.user.username+" com sucesso!")
	console.log(colorful(branco, `[LOGS] Estava tomando um café.`)),
	console.log(colorful(vermelho, `[LOGS] Ligando meu sistema....`)),
	console.log(colorful(roxo, `[LOGS] Aguarde...`)),
	console.log(colorful(ciano, `[LOGS] INICIADO!`)),		

			 console.log(colorful(vermelho, `⊱ ============ ⊱ [LOGS INFOS] ⊰ ============ ⊰`)),
			
  console.log(colorful(amarelo, `[LOGS] ${client.user.tag} Está online! `)),
  console.log(colorful(verde, `[LOGS] Estou em ${client.guilds.cache.size} servidores.`)), 
  console.log(colorful(azul, `[LOGS] Cuidando de ${client.users.cache.size} membros.`)),
	console.log(colorful(vermelho, `[LOGS] Database MongoDB conectada!`)),
	
    console.log(colorful(branco, `⊱ ============ ⊱ [LOGS] ⊰ ============ ⊰`))
});



//Moongose

mongoose.connect(process.env['mongo'])

const database = "mongodb+srv://KennedG:Z6pQzuuIlQoG17C5@gizmo.ubpu2.mongodb.net/Gizmo?retryWrites=true&w=majority" // LINK DE CONEXÃO DA DATABASE

mongoose.connection.once("disconnected", async () => {
    try {
        await mongoose.connect(database, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then (() => {
            console.log("Reconectado a database com sucesso.")
        }).catch((err) => {
            console.log(err)
        })
    } catch (e) {
        console.log(e)
    }
})

//Log canal de voz


  client.on("voiceStateUpdate", (oldMember, newMember) => {
    
    let channel = client.channels.cache.get("950241682597740614");
    let oldvoice = oldMember.channel;

    if(oldvoice == null) {
        let join = new Discord.MessageEmbed()
        .setTitle(`📁[LOGS]📁`)
        .setDescription(`<@${newMember.id}> **entrou no canal de voz** ${newMember.channel}`)
        .setColor(`#00ffc0`)
        .setTimestamp()
        .setFooter(({ text: '[LOGS]'}))
    
    console.log(`${newMember.id} entrou num canal de voz`)
    channel.send({ embeds: [join]})
    }
}) 

client.on('messageCreate', message => {

    if (message.channel.id === "904768859028992020") {
        message.react('<a:boost2:897137122216132648>');
        
  
  // não obrigatório ter 2 emojis, apenas 1, e tenha limites de emojis que seu BOT irá botar pro discord não achar que é spam
  
    }
  }); 





const ms = require("ms")

//AntiFake
client.on("guildMemberAdd", async (member) => {

    let minAge = ms("7 days")

    let createdAt = new Date(member.user.createdAt).getTime();

    let diff = new Date() - createdAt

    let antifake = db.fetch(`antifake_${member.guild.id}`)

    if( antifake === null ) antifake = "off"

    let dias = Math.floor( diff / 86400000)

    let loganti = db.fetch(`logantifake_${member.guild.id}`)



    let embed = new MessageEmbed()

    .setAuthor(`${member.user.tag} / (${member.user.id})`)

    .setDescription(`**${member.user.tag} foi expulso**`)

    .addField(`**Motivo:**`, `> \`Filtro anti-fake ativado\``)

    .addField(`**Conta criada há**`, `> \`${dias} dias\``)

    .setThumbnail( member.user.avatarURL({ dynamic: true, size: 2048 }))

    .setFooter(member.guild.name, member.guild.iconURL({ dynamic: true }))

    .setColor("RED")

    .setTimestamp();



    if( antifake === "off" ) return;



    if( antifake === "on" ) {

        if( minAge > diff ) {

            member.kick();

            if(loganti == null ) return;

            const log = client.channels.cache.get(loganti)

            log.send({ embeds:[embed]})        

        }

    } 

})


const { MessageActionRow, Modal, TextInputComponent } = require('discord.js');

const guild = '644991505873895434'; // ID do servidor onde esta o canal.
const channel = '910345808845611010'; // Canal onde sera enviada a mensagem com o conteudo coletado.

client.on('interactionCreate', interaction => {
	if (interaction.customId.startsWith('modals_button-report-bugs')) {

		let textinput_comando = new TextInputComponent()
			.setCustomId('textinput-comando_bug')
			.setLabel('O erro está em qual comando?')
			.setStyle('SHORT')
			//.setMinLength(1)
			//.setMaxLength(30)
			.setPlaceholder('Digite o nome do comando.')
			.setRequired(false) // Nao e obrigatorio
		let textinput_descricao = new TextInputComponent()
			.setCustomId('textinput-descricao_bug')
			.setLabel('Descrição do bug/erro')
			.setStyle('LONG')
			//.setMinLength(5)
			//.setMaxLength(800)
			.setPlaceholder('Realize uma breve descrição do erro.')
			.setRequired(true) // Obrigatorio
		let textinput_print = new TextInputComponent()
			.setCustomId('textinput-print_bug')
			.setLabel('Prints/Videos')
			.setStyle('LONG')
			//.setMinLength(5)
			//.setMaxLength(350)
			.setPlaceholder('Insira o link de prints/videos caso deseje.')
			.setRequired(false) // Nao e obrigatorio
		let textinput_extras = new TextInputComponent()
			.setCustomId('textinput-extras_bug')
			.setLabel('Extras')
			.setStyle('LONG')
			//.setMinLength(5)
			//.setMaxLength(800)
			.setPlaceholder('Caso tenha algo a mais, digite aqui.')
			.setRequired(false) // Nao e obrigatorio
		let textinput_ser_notificado = new TextInputComponent()
			.setCustomId('textinput-ser_notificado_bug')
			.setLabel('Deseja ser notificado?')
			.setStyle('LONG')
			//.setMinLength(2)
			//.setMaxLength(7)
			.setPlaceholder('Digite SIM caso queira receber uma resposta da equipe.')
			.setRequired(false) // Nao e obrigatorio

		const modal = new Modal()
			.setCustomId('modal-reportbugs')
			.setTitle('Reportar Erros')
            .addComponents([ textinput_comando, textinput_descricao, textinput_print, textinput_extras, textinput_ser_notificado ]);

		showModal(modal, {
			client: client,
			interaction: interaction
		});
	}
})
client.on('modalSubmit', async (modal) => {
	if (modal.customId === 'modal-reportbugs') {
		const comando = modal.getTextInputValue('textinput-comando_bug');
		const descricao = modal.getTextInputValue('textinput-descricao_bug');
		const print = modal.getTextInputValue('textinput-print_bug');
		const extras = modal.getTextInputValue('textinput-extras_bug');
		const ser_notificado = modal.getTextInputValue('textinput-ser_notificado_bug');

		const canal = client.guilds.cache.get(guild).channels.cache.get(channel);

		const embed_1 = new Discord.MessageEmbed()
			.setAuthor(`🛡️ | Novo erro reportado:`)
			.setDescription(`Enviado por: ${modal.user}`)
			.setTimestamp()
			.setColor("GREEN")
		const embed_2 = new Discord.MessageEmbed()
			.setAuthor(`1️⃣ | Comando com erro:`)
			.setDescription(`\`${comando}\``)
			.setColor("DARK_PURPLE")
		const embed_3 = new Discord.MessageEmbed()
			.setAuthor(`2️⃣ | Descrição do erro:`)
			.setDescription(`\`${descricao}\``)
			.setColor("DARK_PURPLE")
		const embed_4 = new Discord.MessageEmbed()
			.setAuthor(`3️⃣ | Prints/Videos:`)
			.setDescription(`\`${print}\``)
			.setColor("DARK_PURPLE")
		const embed_5 = new Discord.MessageEmbed()
			.setAuthor(`4️⃣ | Extras:`)
			.setDescription(`\`${extras}\``)
			.setColor("DARK_PURPLE")
		const embed_6 = new Discord.MessageEmbed()
			.setAuthor(`5️⃣ | Deseja ser notificado?`)
			.setDescription(`\`${ser_notificado}\``)
			.setColor("DARK_PURPLE")
		canal.send({ embeds: [embed_1, embed_2, embed_3, embed_4, embed_5, embed_6] })
	}
})

client.login(process.env.TOKEN);
discordModals(client);

