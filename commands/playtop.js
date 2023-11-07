const {GuildMember, ApplicationCommandOptionType} = require('discord.js');
const {QueryType, useQueue, useMainPlayer} = require('discord-player');
const {isInVoiceChannel} = require("../utils/voicechannel");

module.exports = {
    name: 'playtop',
    description: 'Reproduce tu canción antes de la lista existente!',
    options: [
        {
            name: 'query',
            type: ApplicationCommandOptionType.String,
            description: 'La canción que quieres agregar',
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
                    searchEngine: QueryType.AUTO,
                })
                .catch(() => {
                });
            if (!searchResult || !searchResult.tracks.length)
                return void interaction.followUp({content: 'No se encontro la canción!'});

            const queue = useQueue(interaction.guild.id)

            try {
                if (!queue.connection) await queue.connect(interaction.member.voice.channel);
            } catch {
                return void interaction.followUp({
                    content: 'No pude entrar a tu Canal de Voz!',
                });
            }

            await interaction.followUp({
                content: `⏱ | Cargando tu ${searchResult.playlist ? 'playlist' : 'canción'}...`,
            });
            searchResult.playlist ? queue.node.insert(searchResult.tracks, 0) : queue.node.insert(searchResult.tracks[0], 0);
            if (!queue.currentTrack) await player.play();
        } catch (error) {
            console.log(error);
            await interaction.followUp({
                content: 'Ocurrio un error ejecutando el comando: ' + error.message,
            });
        }
    },
};
