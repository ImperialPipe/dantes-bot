const {EmbedBuilder, ApplicationCommandOptionType} = require('discord.js');
const {QueueRepeatMode, useQueue} = require('discord-player');
const {isInVoiceChannel} = require("../utils/voicechannel");
const config = require('./config.json');

const messageEmbed = new EmbedBuilder().setColor(config.color);

module.exports = {
    name: 'loop',
    description: 'Establece el modo loop',
    options: [
        {
            name: 'mode',
            type: ApplicationCommandOptionType.Integer,
            description: 'Loop type',
            required: true,
            choices: [
                {
                    name: 'No',
                    value: QueueRepeatMode.OFF,
                },
                {
                    name: 'Canción',
                    value: QueueRepeatMode.TRACK,
                },
                {
                    name: 'Lista',
                    value: QueueRepeatMode.QUEUE,
                },
                {
                    name: 'Autoplay',
                    value: QueueRepeatMode.AUTOPLAY,
                },
            ],
        },
    ],
    async execute(interaction) {
        try {
            const inVoiceChannel = isInVoiceChannel(interaction)
            if (!inVoiceChannel) {
                return
            }

            await interaction.deferReply();

            const queue = useQueue(interaction.guild.id)
            if (!queue || !queue.currentTrack) {
                return void interaction.followUp({content: '❌ | No hay musica reproduciendose!'});
            }

            const loopMode = interaction.options.getInteger('mode');
            queue.setRepeatMode(loopMode);
            const mode = loopMode === QueueRepeatMode.TRACK ? '🔂' : loopMode === QueueRepeatMode.QUEUE ? '🔁' : '▶';

            return void interaction.followUp({
                embeds: [messageEmbed.setDescription(`${mode} | Modo de loop actualizado!!`)] 
            });
        } catch (error) {
            console.log(error);
            return void interaction.followUp({
                content: 'Ocurrio un error ejecutando el comando: ' + error.message,
            });
        }
    },
};
