/* eslint-disable no-case-declarations */
/* eslint-disable default-case */
import {
	SlashCommandBuilder,
	ModalBuilder,
	TextInputBuilder,
	ActionRowBuilder,
	TextInputStyle,
	EmbedBuilder,
	RESTJSONErrorCodes,
} from 'discord.js'
import fetch from 'node-fetch'

export default {
	data: new SlashCommandBuilder()
		.setName('bp')
		.setDescription('Crée un bon-plan')
		.addSubcommand(subcommand =>
			subcommand.setName('create').setDescription('Crée un nouveau bon-plan'),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('end')
				.setDescription('Clôture un bon-plan')
				.addStringOption(option =>
					option
						.setName('id')
						.setDescription('ID du bon-plan à clôturer')
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('del')
				.setDescription('Supprime un bon-plan')
				.addStringOption(option =>
					option
						.setName('id')
						.setDescription('ID du bon-plan à supprimer')
						.setRequired(true),
				),
		),
	interaction: async (interaction, client) => {
		// Acquisition du salon
		const bpChannel = interaction.guild.channels.cache.get(
			client.config.guild.channels.BP_CHANNEL_ID,
		)

		switch (interaction.options.getSubcommand()) {
			// Créer un bon-plan
			case 'create':
				const modalCreate = new ModalBuilder()
					.setCustomId('bp')
					.setTitle('Création de bon-plan')
					.addComponents(
						new ActionRowBuilder().addComponents(
							new TextInputBuilder()
								.setCustomId('bp-titre')
								.setLabel('Donnez un titre à votre bon-plan')
								.setStyle(TextInputStyle.Short)
								.setMinLength(1)
								.setRequired(true),
						),
					)
					.addComponents(
						new ActionRowBuilder().addComponents(
							new TextInputBuilder()
								.setCustomId('bp-description')
								.setLabel('Donnez une description courte du bon-plan')
								.setStyle(TextInputStyle.Short)
								.setMinLength(1)
								.setRequired(true),
						),
					)
					.addComponents(
						new ActionRowBuilder().addComponents(
							new TextInputBuilder()
								.setCustomId('bp-lien')
								.setLabel('Donnez le lien du bon-plan')
								.setStyle(TextInputStyle.Short)
								.setMinLength(1)
								.setRequired(true),
						),
					)

				return interaction.showModal(modalCreate)

			// Clôturer un bon-plan
			case 'end':
				const receivedIDEnd = interaction.options.getString('id')
				const matchIDEnd = receivedIDEnd.match(/^(\d{17,19})$/)
				if (!matchIDEnd)
					return interaction.reply({
						content: "Tu ne m'as pas donné un ID valide 😕",
						ephemeral: true,
					})

				// Fetch du message
				const messageEnd = await bpChannel.messages.fetch(matchIDEnd[0]).catch(error => {
					if (error.code === RESTJSONErrorCodes.UnknownMessage) {
						interaction.reply({
							content: `Je n'ai pas trouvé ce message dans le salon <#${bpChannel.id}> 😕`,
							ephemeral: true,
						})

						return error
					}

					throw error
				})

				// Handle des mauvais cas
				if (messageEnd instanceof Error) return
				if (
					!messageEnd.embeds[0] ||
					!messageEnd.embeds[0].data.footer.text.startsWith('Bon-plan')
				)
					return interaction.reply({
						content: "Le message initial n'est pas un bon-plan 😕",
						ephemeral: true,
					})

				// Clôture du bon-plan
				const embedEdit = new EmbedBuilder()
					.setColor('#8DA1AC')
					.setTitle('[TERMINÉ] ' + messageEnd.embeds[0].data.title)
					.setURL(messageEnd.embeds[0].data.url)
					.setDescription(messageEnd.embeds[0].data.description)
					.setFooter({
						iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
						text: `Bon-plan proposé par ${interaction.user.tag}`,
					})

				await messageEnd.edit({
					embeds: [embedEdit],
				})

				return interaction.reply({
					content: 'Le bon-plan a bien été clôturé 👌',
					ephemeral: true,
				})

			// Supprimer un bon-plan
			case 'del':
				const receivedIDDel = interaction.options.getString('id')
				const matchIDDel = receivedIDDel.match(/^(\d{17,19})$/)
				if (!matchIDDel)
					return interaction.reply({
						content: "Tu ne m'as pas donné un ID valide 😕",
						ephemeral: true,
					})

				// Fetch du message
				const messageDel = await bpChannel.messages.fetch(matchIDDel[0]).catch(error => {
					if (error.code === RESTJSONErrorCodes.UnknownMessage) {
						interaction.reply({
							content: `Je n'ai pas trouvé ce message dans le salon <#${bpChannel.id}> 😕`,
							ephemeral: true,
						})

						return error
					}

					throw error
				})

				// Handle des mauvais cas
				if (messageDel instanceof Error) return

				await messageDel.delete()

				return interaction.reply({
					content: 'Le bon-plan a bien été supprimé 👌',
					ephemeral: true,
				})
		}
	},
}
