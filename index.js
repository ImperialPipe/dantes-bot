const fs = require('fs');
const Discord = require('discord.js');
const Client = require('./client/Client');
const config = require('./config.json');
const {Player} = require('discord-player');

const client = new Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
const messageEmbed = new Discord.EmbedBuilder().setColor(config.color)

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

console.log(client.commands);

const player = new Player(client);

player.extractors.loadDefault().then(r => console.log('Extractors loaded successfully'))

// Still needs to be refactored for 0.6
/*player.events.on('connection', (queue) => {
    queue.connection.connec.voiceConnection.on('stateChange', (oldState, newState) => {
      const oldNetworking = Reflect.get(oldState, 'networking');
      const newNetworking = Reflect.get(newState, 'networking');

      const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
        const newUdp = Reflect.get(newNetworkState, 'udp');
        clearInterval(newUdp?.keepAliveInterval);
      }

      oldNetworking?.off('stateChange', networkStateChangeHandler);
      newNetworking?.on('stateChange', networkStateChangeHandler);
    });
});*/

player.events.on('audioTrackAdd', (queue, track) => {
    const trackEmbed = new Discord.EmbedBuilder()
    .setColor(config.color)
    .setTitle('🎶 | Se Agrego:')
    .setDescription(`**[${track.title}](${track.url})**!`)

    queue.metadata.channel.send({embeds: [trackEmbed]});
});

player.events.on('audioTracksAdd', (queue, track) => {
    const playlistEmbed = new Discord.EmbedBuilder()
    .setColor(config.color)
    .setTitle('🎶 | Playlist:')
    .setDescription(`Agregada correctamente!`)
       
    queue.metadata.channel.send({embeds: [playlistEmbed] }); 
});

player.events.on('playerStart', (queue, track) => {
    //TODO: test auto delete previous message
    const playEmbed = new Discord.EmbedBuilder()
    .setColor(config.color)
    .setTitle('▶ | Reproduciendo:')
    .setDescription(`**[${track.title}](${track.url})**!`)

    queue.metadata.channel.send({embeds: [playEmbed]});
});

player.events.on('disconnect', queue => {
    queue.metadata.channel.send({embeds: [messageEmbed.setDescription('❌ | Desconectado manualmente del canal de voz, limpiando la lista!')] });
});

player.events.on('emptyChannel', queue => {
    queue.metadata.channel.send({embeds: [messageEmbed.setDescription('❌ | No hay nadie en el canal de voz, saliendo...')] });
});

player.events.on('emptyQueue', queue => {
    queue.metadata.channel.send({embeds: [messageEmbed.setDescription('✅ | Lista terminada!')] });
});

player.events.on('error', (queue, error) => {
    console.log(`[${queue.guild.name}] Error emitted from the connection: ${error.message}`);
});

// For debugging
/*player.on('debug', async (message) => {
    console.log(`General player debug event: ${message}`);
});

player.events.on('debug', async (queue, message) => {
    console.log(`Player debug event: ${message}`);
});

player.events.on('playerError', (queue, error) => {
    console.log(`Player error event: ${error.message}`);
    console.log(error);
});*/

client.on('ready', function () {
    console.log('Ready!');
    client.user.presence.set({
        activities: [{name: config.activity, type: Number(config.activityType)}],
        status: Discord.Status.Ready
    })
});

client.once('reconnecting', () => {
    console.log('Reconnecting!');
});

client.once('disconnect', () => {
    console.log('Disconnect!');
});

client.on('messageCreate', async message => {
    if (message.author.bot || !message.guild) return;
    if (!client.application?.owner) await client.application?.fetch();

    if (message.content === '!deploy' && message.author.id === client.application?.owner?.id) {
        await message.guild.commands
            .set(client.commands)
            .then(() => {
                message.reply('Deployed!');
            })
            .catch(err => {
                message.reply('Could not deploy commands! Make sure the bot has the application.commands permission!');
                console.error(err);
            });
    }
});

client.on('interactionCreate', async interaction => {
    const command = client.commands.get(interaction.commandName.toLowerCase());

    try {
        if (interaction.commandName == 'ban' || interaction.commandName == 'userinfo') {
            command.execute(interaction, client);
        } else {
            command.execute(interaction);
        }
    } catch (error) {
        console.error(error);
        await interaction.followUp({
            content: 'Ocurrio un error ejecutando el comando!',
        });
    }
});

client.login(config.Discord_Token)

/* 
Ejemplo de config.json:
{
    "Discord_Token": "TOKEN",
    "activityType": 0,
    "activity": "Reproduciendo tus canciones"
    "color": "#142c3c"
}
*/
