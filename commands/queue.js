const {EmbedBuilder} = require('discord.js');
const {useQueue} = require("discord-player");
const {isInVoiceChannel} = require("../utils/voicechannel");

const messageEmbed = new EmbedBuilder().setColor('#142c3c');

module.exports = {
    name: 'queue',
    description: 'Muestra la lista de canciónes agregadas!',
    async execute(interaction) {
        const inVoiceChannel = isInVoiceChannel(interaction)
        if (!inVoiceChannel) {
            return
        }

        const queue = useQueue(interaction.guild.id)
        if (typeof (queue) != 'undefined') {
            const trimString = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str);
            return void interaction.reply({
                embeds: [messageEmbed
                    .setTitle('Reproduciendo')
                    .setDescription(trimString(`Actualmente se esta reproduciendo 🎶 | **${queue.currentTrack.title}**! \n 🎶 | ${queue}! `, 4095)), 
                ]
            })
        } else {
            return void interaction.reply({
                embed: [messageEmbed.setDescription('No hay canciónes en la lista!')]
            })
        }
    }
}
