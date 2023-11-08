const {GuildMember, EmbedBuilder} = require("discord.js");
const config = require('./config.json');

const messageEmbed = new EmbedBuilder().setColor(config.color);

const isInVoiceChannel = (interaction) => {
    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
       interaction.reply({
            embeds:[messageEmbed.setDescription('No estas en un Canal de Voz!')],
            ephemeral: true,
       });
       return false;
    }

    if (
        interaction.guild.members.me.voice.channelId &&
        interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId
    ) {
        interaction.reply({
            embeds: [messageEmbed.setDescription('No estas en mi Canal de Voz!')],
            ephemeral: true,
        });
        return false;
    }

    return true;
}

exports.isInVoiceChannel = isInVoiceChannel;