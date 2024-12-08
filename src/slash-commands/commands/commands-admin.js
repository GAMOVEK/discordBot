/* eslint-disable no-case-declarations */
/* eslint-disable default-case */
import {
	SlashCommandBuilder,
	ModalBuilder,
	TextInputBuilder,
	ActionRowBuilder,
	TextInputStyle,
} from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('commands-admin')
		.setDescription('Gère les commandes personnalisées')
		.addSubcommand(subcommand =>
			subcommand.setName('create').setDescription('Crée une nouvelle commande'),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('edit')
				.setDescription('Modifie une commande')
				.addStringOption(option =>
					option
						.setName('nom')
						.setDescription('Nom de la commande à modifier')
						.setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('del')
				.setDescription('Supprime une commande')
				.addStringOption(option =>
					option
						.setName('nom')
						.setDescription('Nom de la commande à supprimer')
						.setRequired(true),
				),
		),
	interaction: async (interaction, client) => {
		// Acquisition du nom
		const nom = interaction.options.getString('nom')

		// Acquisition de la base de données
		const bdd = client.config.db.pools.userbot
		if (!bdd)
			return interaction.reply({
				content: 'Une erreur est survenue lors de la connexion à la base de données 😕',
				ephemeral: true,
			})

		// Vérification si la commande existe
		let commandBdd = {}
		try {
			const sql = 'SELECT * FROM commands WHERE name = ?'
			const data = [nom]
			const [result] = await bdd.execute(sql, data)
			commandBdd = result[0]
		} catch (error) {
			return interaction.reply({
				content:
					'Une erreur est survenue lors de la récupération de la commande en base de données 😕',
				ephemeral: true,
			})
		}

		switch (interaction.options.getSubcommand()) {
			// Nouvelle commande
			case 'create':
				const modalCreate = new ModalBuilder()
					.setCustomId('command-create')
					.setTitle("Création d'une nouvelle commande")
					.addComponents(
						new ActionRowBuilder().addComponents(
							new TextInputBuilder()
								.setCustomId('name-command-create')
								.setLabel('Nom de la commande')
								.setStyle(TextInputStyle.Short)
								.setMinLength(1)
								.setMaxLength(255)
								.setRequired(true),
						),
					)
					.addComponents(
						new ActionRowBuilder().addComponents(
							new TextInputBuilder()
								.setCustomId('aliases-command-create')
								.setLabel('Alias de la commande')
								.setStyle(TextInputStyle.Paragraph)
								.setMinLength(1)
								.setRequired(false),
						),
					)
					.addComponents(
						new ActionRowBuilder().addComponents(
							new TextInputBuilder()
								.setCustomId('active-command-create')
								.setLabel('Activation de la commande')
								.setStyle(TextInputStyle.Short)
								.setValue('1')
								.setMinLength(1)
								.setMaxLength(1)
								.setRequired(true),
						),
					)
					.addComponents(
						new ActionRowBuilder().addComponents(
							new TextInputBuilder()
								.setCustomId('content-command-create')
								.setLabel('Contenu de la commande')
								.setStyle(TextInputStyle.Paragraph)
								.setMinLength(1)
								.setRequired(true),
						),
					)
					.addComponents(
						new ActionRowBuilder().addComponents(
							new TextInputBuilder()
								.setCustomId('button-command-create')
								.setLabel('Infos du bouton de la commande')
								.setStyle(TextInputStyle.Short)
								.setRequired(false),
						),
					)

				return interaction.showModal(modalCreate)

			// Modifie une commande
			case 'edit':
				// Vérification que la commande existe bien
				if (!commandBdd)
					return interaction.reply({
						content: `La commande **${nom}** n'existe pas 😕`,
						ephemeral: true,
					})

				const modalEdit = new ModalBuilder()
					.setCustomId('command-edit')
					.setTitle("Modification d'une commande")
					.addComponents(
						new ActionRowBuilder().addComponents(
							new TextInputBuilder()
								.setCustomId('name-command-edit')
								.setLabel('Nom de la commande')
								.setStyle(TextInputStyle.Short)
								.setValue(commandBdd.name)
								.setMinLength(1)
								.setMaxLength(255)
								.setRequired(true),
						),
					)
					.addComponents(
						new ActionRowBuilder().addComponents(
							new TextInputBuilder()
								.setCustomId('aliases-command-edit')
								.setLabel('Alias de la commande')
								.setStyle(TextInputStyle.Paragraph)
								.setValue(commandBdd.aliases ? commandBdd.aliases : '')
								.setRequired(false),
						),
					)
					.addComponents(
						new ActionRowBuilder().addComponents(
							new TextInputBuilder()
								.setCustomId('active-command-edit')
								.setLabel('Activation de la commande')
								.setStyle(TextInputStyle.Short)
								.setValue(commandBdd.active.toString())
								.setMinLength(1)
								.setMaxLength(1)
								.setRequired(true),
						),
					)
					.addComponents(
						new ActionRowBuilder().addComponents(
							new TextInputBuilder()
								.setCustomId('content-command-edit')
								.setLabel('Nouveau contenu de la commande')
								.setStyle(TextInputStyle.Paragraph)
								.setValue(commandBdd.content)
								.setMinLength(1)
								.setRequired(true),
						),
					)
					.addComponents(
						new ActionRowBuilder().addComponents(
							new TextInputBuilder()
								.setCustomId('button-command-edit')
								.setLabel('Infos du nouveau bouton de la commande')
								.setStyle(TextInputStyle.Short)
								.setValue(
									`${
										commandBdd.textLinkButton === null
											? ''
											: `${commandBdd.textLinkButton}|||`
									}${
										commandBdd.linkButton === null ? '' : commandBdd.linkButton
									}`,
								)
								.setRequired(false),
						),
					)

				return interaction.showModal(modalEdit)

			// Supprime une commande
			case 'del':
				// Vérification que la commande existe bien
				if (!commandBdd)
					return interaction.reply({
						content: `La commande **${nom}** n'existe pas 😕`,
						ephemeral: true,
					})

				// Si oui, alors suppression de la commande en base de données
				try {
					const sql = 'DELETE FROM commands WHERE name = ?'
					const data = [nom]

					await bdd.execute(sql, data)
				} catch {
					return interaction.reply({
						content:
							'Une erreur est survenue lors de la suppression de la commande en base de données 😬',
						ephemeral: true,
					})
				}

				return interaction.reply({
					content: `La commande **${nom}** a bien été supprimée 👌`,
				})
		}
	},
}
