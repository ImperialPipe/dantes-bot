const {EmbedBuilder, ApplicationCommandOptionType} = require('discord.js');
const {QueryType,useMainPlayer} = require('discord-player');
const {isInVoiceChannel} = require("../utils/voicechannel");
const config = require('../config.json');

const messageEmbed = new EmbedBuilder().setColor(config.color);

module.exports = {
    name: 'play',
    description: 'Reproduce algo en tu canal de voz!',
    options: [
        {
            name: 'query',
            type: ApplicationCommandOptionType.String,
            description: 'Link o nombre de la canción',
            required: true,
        },
    ],
    async execute(interaction) {
        try {
            const inVoiceChannel = isInVoiceChannel(interaction)
            if (!inVoiceChannel) {
                return
            }

            await interaction.deferReply();

            const player = useMainPlayer()
            const query = interaction.options.getString('query');
            const searchResult = await player
                .search(query, {
                    requestedBy: interaction.user,
                    searchEngine: QueryType.YOUTUBE,
                })
                .catch(() => {});
            if (!searchResult.hasTracks())
                return void interaction.followUp({embed: [messageEmbed.setDescription('No se encontro la canción!')],});

            try {
                const res = await player.play(interaction.member.voice.channel.id, searchResult, {
                    nodeOptions: {
                        metadata: {
                            channel: interaction.channel,
                            client: interaction.guild?.members.me,
                            requestedBy: interaction.user.username
                        },
                        leaveOnEmptyCooldown: 300000,
                        leaveOnEmpty: true,
                        leaveOnEnd: false,
                        bufferingTimeout: 0,
                        volume: 10,
                        //defaultFFmpegFilters: ['lofi', 'bassboost', 'normalizer']
                    }
                });

                await interaction.followUp({
                    content: `⏱ | Cargando tu ${searchResult.playlist ? 'playlist' : 'canción'}...`,
                });
            } catch (error) {
                await interaction.editReply({
                    embed: [messageEmbed.setDescription('Ocurrio un error!')],
                })
                return console.log(error);
            }
        } catch (error) {
            await interaction.reply({
                content: 'Ocurrio un error ejecutando el comando: ' + error.message,
            });
        }
    },
};
