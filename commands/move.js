const {GuildMember, ApplicationCommandOptionType} = require('discord.js');
const {useQueue} = require("discord-player");
const {isInVoiceChannel} = require("../utils/voicechannel");

const messageEmbed = new EmbedBuilder().setColor('#142c3c');

module.exports = {
    name: 'move',
    description: 'Mueve la posicion de una canción en la lista!',
    options: [
        {
            name: 'track',
            type: ApplicationCommandOptionType.Integer,
            description: 'N. de la canción que quieres mover',
            required: true,
        },
        {
            name: 'position',
            type: ApplicationCommandOptionType.Integer,
            description: 'Posicion a donde quieres moverla',
            required: true,
        },
    ],
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

        const queueNumbers = [interaction.options.getInteger('track') - 1, interaction.options.getInteger('position') - 1];

        if (queueNumbers[0] > queue.tracks.size || queueNumbers[1] > queue.tracks.size)
            return void interaction.followUp({
                embed: [messageEmbed.setDescription('❌ | N. de canción mayor al valor maximo en la lista!')],
            });

        try {
            const track = queue.node.remove(queueNumbers[0]);
            queue.node.insert(track, queueNumbers[1]);
            return void interaction.followUp({
                embed: [messageEmbed.setDescription(`✅ | Se movio **${track}**!`)],
            });
        } catch (error) {
            console.log(error);
            return void interaction.followUp({
                embed: [messageEmbed.setDescription('❌ | Algo salio mal!')],
            });
        }
    },
};
