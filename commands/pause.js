const {EmbedBuilder} = require('discord.js');
const {useQueue} = require("discord-player");
const {isInVoiceChannel} = require("../utils/voicechannel");
const config = require('../config.json');

const messageEmbed = new EmbedBuilder().setColor(config.color);

module.exports = {
    name: 'pause',
    description: 'Pausa la canción reproduciendose!',
    async execute(interaction) {
        const inVoiceChannel = isInVoiceChannel(interaction)
        if (!inVoiceChannel) {
            return
        }

        await interaction.deferReply();
        const queue = useQueue(interaction.guild.id)
        if (!queue || !queue.currentTrack)
            return void interaction.followUp({
                embed: [messageEmbed.setDescription('❌ | No hay musica reproduciendose!')],
            });
        const success = queue.node.pause()
        return void interaction.followUp({
            embed: [messageEmbed.setDescription(success ? '⏸ | Pausa!' : '❌ | Algo salio mal!')],
        });
    },
};
