const {EmbedBuilder} = require('discord.js');
const {useQueue} = require("discord-player");
const {isInVoiceChannel} = require("../utils/voicechannel");
const config = require('./config.json');

const messageEmbed = new EmbedBuilder().setColor(config.color);

module.exports = {
    name: 'resume',
    description: 'Continua la canción actual!',
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
        const success = queue.node.resume()
        return void interaction.followUp({
            embed: [messageEmbed.setDescription(success ? '▶ | Resumiendo!' : '❌ | Algo salio mal!')],
        });
    },
};
