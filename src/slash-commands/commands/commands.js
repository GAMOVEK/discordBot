/* eslint-disable no-case-declarations */
/* eslint-disable default-case */
import { SlashCommandBuilder, EmbedBuilder, ButtonStyle } from 'discord.js'
import { convertDateForDiscord } from '../../util/util.js'
import { Pagination } from 'pagination.djs'

export default {
	data: new SlashCommandBuilder()
		.setName('commands')
		.setDescription('Commandes personnalisées')
		.addSubcommand(subcommand =>
			subcommand
				.setName('view')
				.setDescription('Voir la liste des commandes')
				.addStringOption(option =>
					option.setName('nom').setDescription('Nom de la commande'),
				),
		),
	interaction: async (interaction, client) => {
		// Acquisition de la base de données
		const bdd = client.config.db.pools.userbot
		if (!bdd)
			return interaction.reply({
				content: 'Une erreur est survenue lors de la connexion à la base de données 😕',
				ephemeral: true,
			})

		switch (interaction.options.getSubcommand()) {
			// Visualisation des commandes
			case 'view':
				// Acquisition du nom
				const nom = interaction.options.getString('nom')

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

				if (nom) {
					// Vérification que la commande existe bien
					if (!commandBdd)
						return interaction.reply({
							content: `La commande **${nom}** n'existe pas 😕`,
							ephemeral: true,
						})

					const commandAuthor = interaction.guild.members.cache.get(commandBdd.author)
					const commandEditor = interaction.guild.members.cache.get(
						commandBdd.lastModificationBy,
					)

					let creationText = ''
					let modificationText = ''

					if (commandAuthor)
						creationText = `Créée par ${
							commandAuthor.user.tag
						} (${convertDateForDiscord(commandBdd.createdAt * 1000)})\n`
					else
						creationText = `Créée le ${convertDateForDiscord(
							commandBdd.createdAt * 1000,
						)}\n`

					if (commandBdd.lastModificationAt !== null && commandEditor)
						modificationText = `Dernière modification par ${
							commandEditor.user.tag
						} (${convertDateForDiscord(commandBdd.lastModificationAt * 1000)})\n`
					else if (commandBdd.lastModificationAt !== null)
						modificationText = `Dernière modification le ${convertDateForDiscord(
							commandBdd.lastModificationAt * 1000,
						)}\n`

					const escapedcontent = commandBdd.content.replace(/```/g, '\\`\\`\\`')

					const embed = new EmbedBuilder()
						.setColor('C27C0E')
						.setTitle(`Commande personnalisée "${commandBdd.name}"`)
						.addFields([
							{
								name: 'Contenu',
								value: `\`\`\`${escapedcontent}\`\`\``,
							},
						])

					if (commandBdd.aliases)
						embed.data.fields.push({
							name: 'Alias',
							value: `\`\`\`${commandBdd.aliases}\`\`\``,
						})

					if (commandBdd.linkButton)
						embed.data.fields.push({
							name: 'Lien externe',
							value: `\`\`\`${commandBdd.linkButton}\`\`\``,
						})

					embed.data.fields.push({
						name: 'Activation',
						value: `${commandBdd.active === 0 ? 'Désactivée' : 'Activée'}`,
					})

					embed.data.fields.push({
						name: 'Historique',
						value: `${creationText}${modificationText}Utilisée ${commandBdd.numberOfUses} fois`,
					})

					return interaction.reply({ embeds: [embed] })
				}

				// Récupération des commandes
				let commands = []
				try {
					const sql = 'SELECT * FROM commands'
					const [result] = await bdd.execute(sql)
					commands = result
				} catch (error) {
					return interaction.reply({
						content: 'Une erreur est survenue lors de la récupération des commandes 😕',
						ephemeral: true,
					})
				}

				if (commands.length === 0)
					return interaction.reply({
						content: "Aucune commande n'a été créée 😕",
						ephemeral: true,
					})

				// Boucle d'ajout des champs
				const fieldsEmbedView = []

				commands = commands.filter(command => command.active)
				commands.forEach(command => {
					if (!command.active) return

					const commandContent = String.raw`${command.content}`
					let commandContentCut = ''

					if (commandContent.length < 100)
						commandContentCut = `${command.content.substr(0, 100)}`
					else commandContentCut = `${command.content.substr(0, 100)} [...]`

					fieldsEmbedView.push({
						name: command.name,
						value: `${commandContentCut}`,
					})
				})

				// Configuration de l'embed
				const paginationView = new Pagination(interaction, {
					firstEmoji: '⏮',
					prevEmoji: '◀️',
					nextEmoji: '▶️',
					lastEmoji: '⏭',
					limit: 5,
					idle: 120000,
					ephemeral: true,
					prevDescription: '',
					postDescription: '',
					buttonStyle: ButtonStyle.Secondary,
					loop: false,
				})

				paginationView.setTitle('Commandes personnalisées')
				paginationView.setDescription(
					`**Total : ${commands.length}\nPréfixe : \`${client.config.guild.COMMANDS_PREFIX}\`**`,
				)
				paginationView.setColor('#C27C0E')
				paginationView.setFields(fieldsEmbedView)
				paginationView.setFooter({ text: 'Page : {pageNumber} / {totalPages}' })
				paginationView.paginateFields(true)

				// Envoi de l'embed
				return paginationView.render()
		}
	},
}
