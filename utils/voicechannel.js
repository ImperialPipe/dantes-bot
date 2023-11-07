const {GuildMember} = require("discord.js");

const isInVoiceChannel = (interaction) => {
    if (!(interaction.member instanceof GuildMember) || !interaction.member.voice.channel) {
       interaction.reply({
            content: 'No estas en un Canal de Voz!',
            ephemeral: true,
       });
       return false;
    }

    if (
        interaction.guild.members.me.voice.channelId &&
        interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId
    ) {
        interaction.reply({
            content: 'No estas en mi Canal de Voz!',
            ephemeral: true,
        });
        return false;
    }

    return true;
}

exports.isInVoiceChannel = isInVoiceChannel;