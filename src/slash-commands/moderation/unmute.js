/* eslint-disable default-case */
/* eslint-disable no-case-declarations */
import { SlashCommandBuilder, GuildMember, EmbedBuilder, RESTJSONErrorCodes } from 'discord.js'

export default {
	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription("Lève le mute d'un ou plusieurs membres")
		.addSubcommand(subcommand =>
			subcommand
				.setName('member')
				.setDescription("Lève le mute d'un membre")
				.addUserOption(option =>
					option.setName('membre').setDescription('Membre').setRequired(true),
				),
		)
		.addSubcommand(subcommand =>
			subcommand
				.setName('members')
				.setDescription('Lève le mute de plusieurs membres')
				.addStringOption(option =>
					option.setName('membres').setDescription('Membres').setRequired(true),
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

		// On diffère la réponse pour avoir plus de 3 secondes
		await interaction.deferReply()

		// Acquisition du rôle Muted
		const mutedRole = client.config.guild.roles.MUTED_ROLE_ID
		if (!mutedRole)
			return interaction.editReply({
				content: "Il n'y a pas de rôle Muted 😕",
			})

		// Acquisition du message d'unmute
		let unmuteDM = ''
		try {
			const sql = 'SELECT * FROM forms WHERE name = ?'
			const data = ['unmute']
			const [result] = await bdd.execute(sql, data)

			unmuteDM = result[0].content
		} catch (error) {
			console.error(error)
			return interaction.editReply({
				content:
					"Une erreur est survenue lors de la récupération du message d'unmute en base de données 😬",
			})
		}

		switch (interaction.options.getSubcommand()) {
			case 'member':
				// Acquisition du membre
				const user = interaction.options.getUser('membre')
				const member = interaction.guild.members.cache.get(user.id)
				if (!member)
					return interaction.editReply({
						content:
							"Je n'ai pas trouvé cet utilisateur, vérifie la mention ou l'ID 😕",
					})

				// Vérification si le membre a bien le rôle Muted
				if (!member.roles.cache.has(mutedRole))
					return interaction.editReply({
						content: "Le membre n'est pas muté 😕",
					})

				// On ne peut pas se démute soi-même
				if (member.id === interaction.user.id)
					return interaction.editReply({
						content: 'Tu ne peux pas te démute toi-même 😕',
					})

				// Envoi du message d'unmute en message privé
				const embed = new EmbedBuilder()
					.setColor('#C27C0E')
					.setTitle('Mute terminé')
					.setDescription(unmuteDM)
					.setAuthor({
						name: interaction.guild.name,
						iconURL: interaction.guild.iconURL({ dynamic: true }),
						url: interaction.guild.vanityURL,
					})

				const DMMessage = await member
					.send({
						embeds: [embed],
					})
					.catch(error => {
						console.error(error)
					})

				// Vérification si déjà mute en base de données
				let mutedMember = {}
				try {
					const sql = 'SELECT * FROM mute WHERE discordID = ?'
					const data = [member.id]
					const [result] = await bdd.execute(sql, data)

					mutedMember = result[0]
				} catch (error) {
					console.error(error)
					return interaction.editReply({
						content:
							'Une erreur est survenue lors de la levé du mute du membre en base de données 😬',
					})
				}

				// Si oui alors on lève le mute en base de données
				if (mutedMember) {
					try {
						const sql = 'DELETE FROM mute WHERE discordID = ?'
						const data = [member.id]
						await bdd.execute(sql, data)
					} catch {
						if (DMMessage) DMMessage.delete()
						return interaction.editReply({
							content:
								'Une erreur est survenue lors de la levée du mute du membre en base de données 😬',
						})
					}

					// Action d'unmute du membre
					const unmuteAction = await member.roles.remove(mutedRole).catch(error => {
						// Suppression du message privé envoyé
						// car action de mute non réalisée
						if (DMMessage) DMMessage.delete()

						// Réinsertion du mute en base de données
						try {
							const sql =
								'INSERT INTO mute (discordID, timestampStart, timestampEnd) VALUES (?, ?, ?)'
							const data = [
								mutedMember.discordID,
								mutedMember.timestampStart,
								mutedMember.timestampEnd,
							]

							bdd.execute(sql, data)
						} catch {
							return interaction.editReply({
								content:
									'Une erreur est survenue lors de la levée du mute du membre en base de données 😬',
							})
						}

						if (error.code === RESTJSONErrorCodes.MissingPermissions)
							return interaction.editReply({
								content: "Je n'ai pas les permissions pour unmute ce membre 😬",
							})

						console.error(error)
						return interaction.editReply({
							content:
								'Une erreur est survenue lors de la levée du mute du membre 😬',
						})
					})

					// Si pas d'erreur, message de confirmation de l'unmute
					if (unmuteAction instanceof GuildMember)
						return interaction.editReply({
							content: `🔊 \`${member.user.tag}\` est démuté`,
						})

					// Si au moins une erreur, throw
					if (unmuteAction instanceof Error || DMMessage instanceof Error)
						throw new Error(
							"L'envoi d'un message et / ou l'unmute d'un membre a échoué. Voir les logs précédents pour plus d'informations.",
						)
				}

				// Action d'unmute du membre
				const unmuteAction = await member.roles.remove(mutedRole).catch(error => {
					// Suppression du message privé envoyé
					// car action de mute non réalisée
					if (DMMessage) DMMessage.delete()

					if (error.code === RESTJSONErrorCodes.MissingPermissions)
						return interaction.editReply({
							content: "Je n'ai pas les permissions pour unmute ce membre 😬",
						})

					console.error(error)
					return interaction.editReply({
						content: 'Une erreur est survenue lors de la levée du mute du membre 😬',
					})
				})

				// Si pas d'erreur, message de confirmation de l'unmute
				if (unmuteAction instanceof GuildMember)
					return interaction.editReply({
						content: `\`${member.user.tag}\` n'est pas muté en base de données, mais le rôle a été retiré 😬`,
					})

				// Si au moins une erreur, throw
				if (unmuteAction instanceof Error || DMMessage instanceof Error)
					throw new Error(
						"L'envoi d'un message et / ou l'unmute d'un membre a échoué. Voir les logs précédents pour plus d'informations.",
					)

				return

			case 'members':
				// Acquisition des membres
				const users = interaction.options.getString('membres')
				const usersArray = users.split(',')
				let unmuteMessage = ''

				if (usersArray.length < 2)
					return interaction.editReply({
						content: "Tu n'as pas unmute plusieurs membres 😕",
					})

				await Promise.all(
					usersArray.map(async userGroup => {
						// Acquisition du membre
						const memberGroup = await interaction.guild.members.fetch(userGroup)
						if (!memberGroup) return

						// Vérification si le membre a déjà le rôle Muted
						if (!memberGroup.roles.cache.has(mutedRole)) return

						// On ne peut pas se mute soi-même
						if (memberGroup.id === interaction.user.id)
							return interaction.editReply({
								content: "Tu ne peux pas t'unmute toi-même 😕",
							})

						// Envoi du message d'unmute en message privé
						const embedUnmuteGroup = new EmbedBuilder()
							.setColor('#C27C0E')
							.setTitle('Mute terminé')
							.setDescription(unmuteDM)
							.setAuthor({
								name: interaction.guild.name,
								iconURL: interaction.guild.iconURL({ dynamic: true }),
								url: interaction.guild.vanityURL,
							})
						const DMMessageGroup = await memberGroup
							.send({
								embeds: [embedUnmuteGroup],
							})
							.catch(error => {
								console.error(error)
							})

						// Vérification si déjà mute en base de données
						let mutedGroup = {}
						try {
							const sql = 'SELECT * FROM mute WHERE discordID = ?'
							const data = [memberGroup.id]
							const [result] = await bdd.execute(sql, data)
							mutedGroup = result[0]
						} catch {
							if (DMMessageGroup) DMMessageGroup.delete()
							return interaction.editReply({
								content:
									"Une erreur est survenue lors de l'unmute du membre en base de données 😬",
							})
						}

						// Si oui alors on lève le mute en base de données
						if (mutedGroup)
							try {
								const sql = 'DELETE FROM mute WHERE discordID = ?'
								const data = [memberGroup.id]
								await bdd.execute(sql, data)
							} catch {
								if (DMMessageGroup) DMMessageGroup.delete()
								return interaction.editReply({
									content:
										"Une erreur est survenue lors de l'unmute du membre en base de données 😬",
								})
							}

						// Action d'unmute du membre
						const unmuteActionGroup = await memberGroup.roles
							.remove(mutedRole)
							.catch(error => {
								// Suppression du message privé envoyé
								// car action de mute non réalisée
								if (DMMessageGroup) DMMessageGroup.delete()

								if (error.code === RESTJSONErrorCodes.MissingPermissions)
									return interaction.editReply({
										content:
											"Je n'ai pas les permissions pour unmute ce membre 😬",
									})

								console.error(error)
								return interaction.editReply({
									content:
										'Une erreur est survenue lors de la levée du mute du membre 😬',
								})
							})

						// Si pas d'erreur, message de confirmation de l'unmute
						if (unmuteActionGroup instanceof GuildMember)
							unmuteMessage = unmuteMessage.concat(
								' ',
								`\`${memberGroup.user.tag}\`,`,
							)

						// Si au moins une erreur, throw
						if (unmuteActionGroup instanceof Error || DMMessageGroup instanceof Error)
							throw new Error(
								"L'envoi d'un message et / ou l'unmute d'un membre a échoué. Voir les logs précédents pour plus d'informations.",
							)
					}),
				)

				// Si pas d'erreur, message de confirmation du mute
				if (unmuteMessage !== '')
					return interaction.editReply({
						content: `🔊 ${unmuteMessage} sont démutés`,
					})

				return interaction.editReply({
					content: `🔊 Les membres sont démutés`,
				})
		}
	},
}
