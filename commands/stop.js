const {EmbedBuilder} = require('discord.js');
const {useQueue} = require("discord-player");
const {isInVoiceChannel} = require("../utils/voicechannel");
const config = require('./config.json');

const messageEmbed = new EmbedBuilder().setColor(config.color);

module.exports = {
    name: 'stop',
    description: 'Detiene y elimina las canciones en la lista!',
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
        queue.node.stop()
        return void interaction.followUp({
            embed: [messageEmbed.setDescription('🛑 | Reproductor detenido!')]
        });
    },
};
