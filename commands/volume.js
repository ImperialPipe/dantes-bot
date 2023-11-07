const {GuildMember, ApplicationCommandOptionType} = require('discord.js');
const {useQueue} = require("discord-player");
const {isInVoiceChannel} = require("../utils/voicechannel");

module.exports = {
    name: 'volume',
    description: 'Cambia el Volumen!',
    options: [
        {
            name: 'volume',
            type: ApplicationCommandOptionType.Integer,
            description: 'Numero entre 0-200',
            required: true,
        },
    ],
    async execute(interaction) {
        const inVoiceChannel = isInVoiceChannel(interaction)
        if (!inVoiceChannel) {
            return
        }

        await interaction.deferReply();
        const queue = useQueue(interaction.guild.id);
        if (!queue || !queue.currentTrack)
            return void interaction.followUp({
                content: '❌ | No hay musica reproduciendose!',
            });

        let volume = interaction.options.getInteger('volume');
        volume = Math.max(0, volume);
        volume = Math.min(200, volume);
        const success = queue.node.setVolume(volume);

        return void interaction.followUp({
            content: success ? `🔊 | Volumen al ${volume}!` : '❌ | Algo salio mal!',
        });
    },
};
