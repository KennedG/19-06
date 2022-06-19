// npm i discord.js glob util
const Discord = require("discord.js"); 
const client = new Discord.Client({intents: 32767});


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


const express = require('express');
const { Client } = require("discord.js");
const db = require('quick.db');
const config = require('./config.json')

const handler = require("./index.js");

//Recebendo ping
const app = express();
app.get('/', (req, res) => res.send('Gizmo foi ligado com sucesso! mais informações na console do bot. mensagem de reinicialização foi enviada.🟢'));
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
     
       try {
           const commandFile = require(`./commands/${command}.js`)
           commandFile.run(client, message, args);
       } catch (err) {
       console.error('Erro:' + err);
     }
});




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
	
    console.log(colorful(branco, `⊱ ============ ⊱ [LOGS] ⊰ ============ ⊰`))
});

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


client.on('interactionCreate', (interaction) => {


    if(interaction.customId == '1') {
       
    const canal = interaction.guild.channels.create(`Vendas-${interaction.user.tag}`, {
        parent: "987117928551960646", // Coloque o ID da Categoria de Tickets
        reason: `${interaction.user.tag} abriu um ticket!`,
        type: "GUILD_TEXT",
        topic: interaction.user.id,
    

    permissionOverwrites: [
    {
    id: interaction.guild.roles.everyone,
    deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MENTION_EVERYONE']
    },
    {
    id: interaction.user.id,
    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES']
    } 
    

    ]
                                                                    
    }).then(emb1 => {
    
    let buttons1 = new Discord.MessageActionRow()
    .addComponents(
    new Discord.MessageButton()
    .setCustomId('2')
    .setStyle('DANGER')
    .setLabel('FECHAR TICKET')
    .setEmoji("❌")
    )
    
    
    let enviar1 = new Discord.MessageEmbed()
    .setColor("DARK_AQUA")
    message.send(`${interaction.author}`)
    .setThumbnail(interaction.guild.iconURL({ dynamic: true}))
    .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({format: "png"}))
    .setDescription(`**Olá ${interaction.user} VOCÊ CRIOU UM TICKET DE COMPRA!\n\nPIX: **Guilherme.MR13@gmail.com**\n\n Após o pagamento envie o comprovante**`) // colocar seu pix
    emb1.send({ embeds: [enviar1], components: [buttons1]})
    
    interaction.reply({content: `Canal Criado com sucesso!`, ephemeral: true})
    })
  
    }
        
    if(interaction.customId == '2') {
        
    interaction.channel.delete()
        
    }
    
    })

client.login(process.env.TOKEN);
