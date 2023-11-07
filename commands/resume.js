const {GuildMember} = require('discord.js');
const {useQueue} = require("discord-player");
const {isInVoiceChannel} = require("../utils/voicechannel");

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
                content: '❌ | No hay musica reproduciendose!',
            });
        const success = queue.node.resume()
        return void interaction.followUp({
            content: success ? '▶ | Resumiendo!' : '❌ | Algo salio mal!',
        });
    },
};
