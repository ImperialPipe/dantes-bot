const {GuildMember} = require('discord.js');
const {useQueue} = require("discord-player");
const {isInVoiceChannel} = require("../utils/voicechannel");

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
                embeds: [
                    {
                        title: 'Reproduciendo',
                        description: trimString(`Actualmente se esta reproduciendo 🎶 | **${queue.currentTrack.title}**! \n 🎶 | ${queue}! `, 4095),
                    }
                ]
            })
        } else {
            return void interaction.reply({
                content: 'No hay canciónes en la lista!'
            })
        }
    }
}
