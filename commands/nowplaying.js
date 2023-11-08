const {EmbedBuilder} = require('discord.js');
const {useQueue} = require("discord-player");
const {isInVoiceChannel} = require("../utils/voicechannel");
const config = require('../config.json');

const messageEmbed = new EmbedBuilder().setColor(config.color);

module.exports = {
    name: 'nowplaying',
    description: 'Muestra el nombre de la canción reproduciendose actualmente.',
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
        const progress = queue.node.createProgressBar()
        const perc = queue.node.getTimestamp();

        const playingEmbed = new EmbedBuilder()
        .setTitle('Reproduciendo')
        .setDescription(`🎶 | **${queue.current.title}**! (\`${perc.progress}%\`)`)
        .setFields([{
            name: '\u200b',
            value: progress,
        }])

        return void interaction.followUp({
            embeds: [playingEmbed],
        });
    },
};
