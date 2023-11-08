const {EmbedBuilder, ApplicationCommandOptionType } = require('discord.js');
const {useQueue} = require("discord-player");
const {isInVoiceChannel} = require("../utils/voicechannel");
const config = require('../config.json');

const messageEmbed = new EmbedBuilder().setColor(config.color);

module.exports = {
  name: 'remove',
  description: 'Remueve una canción de la lista!',
  options: [
    {
      name: 'number',
      type: ApplicationCommandOptionType.Integer,
      description: 'N. de la canción que quieres remover',
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
    const number = interaction.options.getInteger('number') - 1;
    if (number > queue.tracks.size)
      return void interaction.followUp({
        embed: [messageEmbed.setDescription('❌ | N. de canción mayor al valor maximo en la lista!')]
      });
    const removedTrack = queue.node.remove(number);
    return void interaction.followUp({
      embed: [messageEmbed.setDescription(removedTrack ? `✅ | Se elimino **${removedTrack}** de la lista!` : '❌ | Algo salio mal!')],
    });
  },
};
