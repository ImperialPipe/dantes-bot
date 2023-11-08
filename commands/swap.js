const {EmbedBuilder, ApplicationCommandOptionType} = require('discord.js');
const {useQueue} = require("discord-player");
const {isInVoiceChannel} = require("../utils/voicechannel");
const config = require('./config.json');

const messageEmbed = new EmbedBuilder().setColor(config.color);

module.exports = {
    name: 'swap',
    description: 'Cambia el lugar de una canción en la lista!',
    options: [
        {
            name: 'track1',
            type: ApplicationCommandOptionType.Integer,
            description: 'N. de Canción que quieres cambiar',
            required: true,
        },
        {
            name: 'track2',
            type: ApplicationCommandOptionType.Integer,
            description: 'N. de Canción que quieres cambiar',
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
        if (!queue || !queue.currentTrack) return void interaction.followUp({content: '❌ | No hay musica reproduciendose!'});
        const queueNumbers = [interaction.options.getInteger('track1') - 1, interaction.options.getInteger('track2') - 1];
        // Sort so the lowest number is first for swap logic to work
        queueNumbers.sort(function (a, b) {
            return a - b;
        });
        if (queueNumbers[1] > queue.getSize())
            return void interaction.followUp({
                embed: [messageEmbed.setDescription('❌ | N. de canción mayor al valor maximo en la lista!')]
                
            });

        try {
            const track2 = queue.node.remove(queueNumbers[1]); // Remove higher track first to avoid list order issues
            const track1 = queue.node.remove(queueNumbers[0]);
            queue.node.insert(track2, queueNumbers[0]); // Add track in lowest position first to avoid list order issues
            queue.node.insert(track1, queueNumbers[1]);
            return void interaction.followUp({
                embed: [messageEmbed.setDescription(`✅ | Se cambio **${track1}** y **${track2}**!`)],
            });
        } catch (error) {
            console.log(error);
            return void interaction.followUp({
                embed: [messageEmbed.setDescription('❌ | Algo salio mal!')],
            });
        }
    },
};
