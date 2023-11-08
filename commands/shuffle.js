const {EmbedBuilder} = require('discord.js');
const {useQueue} = require("discord-player");
const {isInVoiceChannel} = require("../utils/voicechannel");
const config = require('../config.json');

const messageEmbed = new EmbedBuilder().setColor(config.color);

module.exports = {
    name: 'shuffle',
    description: 'Mezcla la lista!',
    async execute(interaction) {
        const inVoiceChannel = isInVoiceChannel(interaction)
        if (!inVoiceChannel) {
            return
        }

        await interaction.deferReply();
        const queue = useQueue(interaction.guild.id)
        if (!queue || !queue.currentTrack) return void interaction.followUp({content: '❌ | No hay musica reproduciendose!'});
        try {
            queue.tracks.shuffle();
            const trimString = (str, max) => (str.length > max ? `${str.slice(0, max - 3)}...` : str);
            return void interaction.followUp({
                embeds: [messageEmbed
                    .setTitle ('Reproduciendo')
                    .setDescription (trimString(`Actualmente se esta reproduciendo 🎶 | **${queue.currentTrack.title}**! \n 🎶 | ${queue}! `, 4095,))
                ],
            });
        } catch (error) {
            console.log(error);
            return void interaction.followUp({
                embed: [messageEmbed.setDescription('❌ | Algo salio mal!')],
            });
        }
    },
};
