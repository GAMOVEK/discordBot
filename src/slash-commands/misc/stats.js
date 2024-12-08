/* eslint-disable no-case-declarations */
/* eslint-disable default-case */

import { SlashCommandBuilder, ButtonStyle } from 'discord.js'
import { Pagination } from 'pagination.djs'

export default {
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Affiche les stats')
		.addSubcommand(subcommand =>
			subcommand.setName('commands').setDescription('Affiche les stats des commandes'),
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
			case 'commands':
				let commands = []
				try {
					const sql = 'SELECT * FROM commands ORDER BY numberOfUses DESC'
					const [result] = await bdd.execute(sql)
					commands = result
				} catch (error) {
					return interaction.reply({
						content:
							'Une erreur est survenue lors de la récupération des commandes en base de données 😕',
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
				let count = 1
				commands.forEach(command => {
					if (command.active === 0) return

					fieldsEmbedView.push({
						name: `${count}. ${command.name}`,
						value: `Utilisée ${command.numberOfUses} fois`,
					})

					count += 1
				})

				// Configuration de l'embed
				const paginationView = new Pagination(interaction, {
					firstEmoji: '⏮',
					prevEmoji: '◀️',
					nextEmoji: '▶️',
					lastEmoji: '⏭',
					limit: 5,
					idle: 120000,
					ephemeral: false,
					prevDescription: '',
					postDescription: '',
					buttonStyle: ButtonStyle.Secondary,
					loop: false,
				})

				paginationView.setTitle('Classement des commandes')
				paginationView.setColor('#C27C0E')
				paginationView.setFields(fieldsEmbedView)
				paginationView.setFooter({ text: 'Page : {pageNumber} / {totalPages}' })
				paginationView.paginateFields(true)

				// Envoi de l'embed
				return paginationView.render()
		}
	},
}
