/* eslint-disable no-mixed-operators */
/* eslint-disable no-case-declarations */
/* eslint-disable default-case */
import { SlashCommandBuilder, EmbedBuilder, ButtonStyle } from 'discord.js'
import { convertDateForDiscord } from '../../util/util.js'
import { Pagination } from 'pagination.djs'
import ms from 'ms'

export default {
	data: new SlashCommandBuilder()
		.setName('remind')
		.setDescription('Gère les rappels')
		.addSubcommand(subcommand =>
			subcommand.setName('view').setDescription('Voir la liste de ses rappels'),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('create')
				.setDescription('Crée un rappel')
				.addStringOption(option =>
					option
						.setName('temps')
						.setDescription(
							"Temps avant le rappel (précisez l'unité de temps en minutes / heures / jours : 1m, 2h, 3d)",
						)
						.setRequired(true),
				)
				.addStringOption(option =>
					option.setName('rappel').setDescription('Rappel').setRequired(true),
				)
				.addBooleanOption(option =>
					option.setName('private').setDescription('En privé ?').setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('edit')
				.setDescription('Modifie un rappel')
				.addStringOption(option =>
					option.setName('id').setDescription('ID du rappel').setRequired(true),
				)
				.addStringOption(option =>
					option
						.setName('temps')
						.setDescription(
							"Temps avant le rappel (précisez l'unité de temps en minutes / heures / jours : 1m, 2h, 3d)",
						)
						.setRequired(true),
				)
				.addStringOption(option =>
					option.setName('rappel').setDescription('Rappel').setRequired(true),
				)
				.addBooleanOption(option =>
					option.setName('private').setDescription('En privé ?').setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('del')
				.setDescription('Supprime un rappel')
				.addStringOption(option =>
					option.setName('id').setDescription('ID du rappel').setRequired(true),
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
			// Visualisation des rappels
			case 'view':
				let reminders = []
				try {
					const sql = 'SELECT * FROM reminders WHERE discordID = ?'
					const data = [interaction.user.id]
					const [result] = await bdd.execute(sql, data)
					reminders = result
				} catch (error) {
					return interaction.reply({
						content:
							'Une erreur est survenue lors de la récupération des rappels en base de données 😕',
						ephemeral: true,
					})
				}

				if (reminders.length === 0)
					return interaction.reply({
						content: "Aucun rappel n'a été créé 😕",
						ephemeral: true,
					})

				// Boucle d'ajout des champs
				const fieldsEmbedView = []
				reminders.forEach(reminder => {
					fieldsEmbedView.push({
						name: `Rappel #${reminder.id}`,
						value: `Message : ${reminder.reminder}\nDate : ${convertDateForDiscord(
							reminder.timestampEnd * 1000,
						)}`,
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

				paginationView.setTitle('Mes rappels')
				paginationView.setDescription(`**Total : ${reminders.length}**`)
				paginationView.setColor('#C27C0E')
				paginationView.setFields(fieldsEmbedView)
				paginationView.setFooter({ text: 'Page : {pageNumber} / {totalPages}' })
				paginationView.paginateFields(true)

				// Envoi de l'embed
				return paginationView.render()

			// Création d'un rappel
			case 'create':
				const temps = interaction.options.getString('temps')
				const rappel = interaction.options.getString('rappel')
				const prive = interaction.options.getBoolean('private')

				if (isNaN(ms(temps)))
					return interaction.reply({
						content: 'Le délai est invalide 😬',
						ephemeral: true,
					})

				// Insertion du rappel en base de données
				const timestampStart = Math.round(Date.now() / 1000)
				const timestampEnd = timestampStart + ms(temps) / 1000

				const delay = (timestampEnd - timestampStart) * 1000

				if (delay.toString(2).length > 31)
					return interaction.reply({
						content: 'Le délai est trop grand : supérieur à 24 jours 😬',
						ephemeral: true,
					})

				const timeout = setTimeout(async () => {
					try {
						const sql = 'DELETE FROM reminders WHERE timestampEnd = ?'
						const data = [timestampEnd]
						await bdd.execute(sql, data)

						const member = interaction.guild.members.cache.get(interaction.user.id)

						const embed = new EmbedBuilder()
							.setColor('#C27C0E')
							.setTitle('Rappel')
							.setDescription(rappel)

						if (prive)
							return member.send({
								embeds: [embed],
							})

						return interaction.channel.send({
							content: `Rappel pour ${interaction.user} : ${rappel}`,
						})
					} catch (error) {
						console.log(error)
					}
				}, delay)

				try {
					const sql =
						'INSERT INTO reminders (discordID, reminder, timestampEnd, channel, private, timeoutId) VALUES (?, ?, ?, ?, ?, ?)'
					const data = [
						interaction.user.id,
						rappel,
						timestampEnd,
						interaction.channel.id,
						prive ? 1 : 0,
						Number(timeout),
					]
					await bdd.execute(sql, data)
				} catch (error) {
					return interaction.reply({
						content:
							'Une erreur est survenue lors de la création du rappel en base de données 😬',
						ephemeral: true,
					})
				}

				return interaction.reply({
					content: `Rappel créé 👌\nRappel : ${rappel}\nProgrammé le ${convertDateForDiscord(
						timestampEnd * 1000,
					)}`,
					ephemeral: prive,
				})

			// Modification d'un rappel
			case 'edit':
				const idEdit = interaction.options.getString('id')
				const tempsEdit = interaction.options.getString('temps')
				const rappelEdit = interaction.options.getString('rappel')
				const priveEdit = interaction.options.getBoolean('private')

				// Acquisition de l'id du rappel
				// Fetch du rappel
				let fetchReminderEdit = {}
				try {
					const sql = 'SELECT * FROM reminders WHERE id = ?'
					const data = [idEdit]
					const [result] = await bdd.execute(sql, data)
					fetchReminderEdit = result[0]
				} catch {
					return interaction.reply({
						content:
							'Une erreur est survenue lors de la modification du rappel en base de données 😬',
						ephemeral: true,
					})
				}

				// Vérification si le rappel existe
				if (!fetchReminderEdit)
					return interaction.reply({
						content: "Ce rappel ne n'existe pas 😬",
						ephemeral: true,
					})

				// Vérification si le rappel appartient bien au membre
				if (fetchReminderEdit.discordID !== interaction.user.id)
					return interaction.reply({
						content: "Ce rappel ne t'appartient pas 😬",
						ephemeral: true,
					})

				if (isNaN(ms(tempsEdit)))
					return interaction.reply({
						content: 'Le délai est invalide 😬',
						ephemeral: true,
					})

				// Modification du rappel en base de données
				const timestampStartEdit = Math.round(Date.now() / 1000)
				const timestampEndEdit = timestampStartEdit + ms(tempsEdit) / 1000

				const delayEdit = (timestampEndEdit - timestampStartEdit) * 1000

				if (delayEdit.toString(2).length > 32)
					return interaction.reply({
						content: 'Le délai est trop grand : supérieur à 24 jours 😬',
						ephemeral: true,
					})

				const timeoutEdit = setTimeout(async () => {
					try {
						const sql = 'DELETE FROM reminders WHERE id = ?'
						const data = [fetchReminderEdit.id]
						await bdd.execute(sql, data)

						const member = interaction.guild.members.cache.get(interaction.user.id)

						const embed = new EmbedBuilder()
							.setColor('#C27C0E')
							.setTitle('Rappel')
							.setDescription(rappelEdit)

						if (priveEdit)
							return member.send({
								embeds: [embed],
							})

						return interaction.channel.send({
							content: `Rappel pour ${interaction.user} : ${rappelEdit}`,
						})
					} catch (error) {
						console.log(error)
					}
				}, delayEdit)

				try {
					const sql =
						'UPDATE reminders SET reminder = ?, timestampEnd = ?, channel = ?, private = ?, timeoutId = ? WHERE id = ?'
					const data = [
						rappelEdit,
						timestampEndEdit,
						interaction.channel.id,
						priveEdit ? 1 : 0,
						Number(timeoutEdit),
						fetchReminderEdit.id,
					]
					await bdd.execute(sql, data)
				} catch (error) {
					return interaction.reply({
						content:
							'Une erreur est survenue lors de la modification du rappel en base de données 😬',
						ephemeral: true,
					})
				}

				clearTimeout(fetchReminderEdit.timeoutId)

				return interaction.reply({
					content: `Rappel modifié 👌\nRappel : ${rappelEdit}\nProgrammé le ${convertDateForDiscord(
						timestampEndEdit * 1000,
					)}`,
					ephemeral: priveEdit,
				})

			// Suppression d'un rappel
			case 'del':
				// Acquisition de l'id du rappel
				// Fetch du rappel
				let fetchReminder = {}
				try {
					const id = interaction.options.getString('id')
					const sql = 'SELECT * FROM reminders WHERE id = ?'
					const data = [id]
					const [result] = await bdd.execute(sql, data)
					fetchReminder = result[0]
				} catch {
					return interaction.reply({
						content:
							'Une erreur est survenue lors de la suppression du rappel en base de données 😬',
						ephemeral: true,
					})
				}

				// Vérification si le rappel existe
				if (!fetchReminder)
					return interaction.reply({
						content: "Le rappel n'existe pas 😬",
						ephemeral: true,
					})

				// Vérification si le rappel appartient bien au membre
				if (fetchReminder.discordID !== interaction.user.id)
					return interaction.reply({
						content: "Ce rappel ne t'appartient pas 😬",
						ephemeral: true,
					})

				// Suppression en base de données
				let deleteReminder = {}
				try {
					const id = interaction.options.getString('id')
					const sql = 'DELETE FROM reminders WHERE id = ?'
					const data = [id]
					const [result] = await bdd.execute(sql, data)
					deleteReminder = result
				} catch {
					return interaction.reply({
						content:
							'Une erreur est survenue lors de la suppression du rappel en base de données 😬',
						ephemeral: true,
					})
				}

				clearTimeout(fetchReminder.timeoutId)

				if (deleteReminder.affectedRows === 1)
					return interaction.reply({
						content: 'Le rappel a bien été supprimé 👌',
						ephemeral: true,
					})
		}
	},
}
