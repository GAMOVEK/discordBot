/* eslint-disable no-case-declarations */
/* eslint-disable default-case */
import { writeFile } from 'fs/promises'

export default {
	data: {
		name: 'setup',
	},
	interaction: async (modal, client) => {
		// Acquisition du nom et du contenu
		const nom = modal.components[0].components[0].customId
		let contenu = modal.fields.getTextInputValue(nom).trim()
		const regexId = /\d+/g
		const regexIds = /[\d\s,]+/g

		switch (nom) {
			case 'LEAVE_JOIN_CHANNEL_ID':
				const matches_LEAVE_JOIN_CHANNEL_ID = contenu.match(regexId)
				if (!matches_LEAVE_JOIN_CHANNEL_ID || matches_LEAVE_JOIN_CHANNEL_ID.length > 1)
					return modal.reply({
						content: "Tu n'as pas donné un ID valide 😕",
						ephemeral: true,
					})
				break

			case 'REPORT_CHANNEL_ID':
				const matches_REPORT_CHANNEL_ID = contenu.match(regexId)
				if (!matches_REPORT_CHANNEL_ID || matches_REPORT_CHANNEL_ID.length > 1)
					return modal.reply({
						content: "Tu n'as pas donné un ID valide 😕",
						ephemeral: true,
					})
				break

			case 'LOGS_MESSAGES_CHANNEL_ID':
				const matches_LOGS_MESSAGES_CHANNEL_ID = contenu.match(regexId)
				if (
					!matches_LOGS_MESSAGES_CHANNEL_ID ||
					matches_LOGS_MESSAGES_CHANNEL_ID.length > 1
				)
					return modal.reply({
						content: "Tu n'as pas donné un ID valide 😕",
						ephemeral: true,
					})
				break

			case 'LOGS_BANS_CHANNEL_ID':
				const matches_LOGS_BANS_CHANNEL_ID = contenu.match(regexId)
				if (!matches_LOGS_BANS_CHANNEL_ID || matches_LOGS_BANS_CHANNEL_ID.length > 1)
					return modal.reply({
						content: "Tu n'as pas donné un ID valide 😕",
						ephemeral: true,
					})
				break

			case 'LOGS_ROLES_CHANNEL_ID':
				const matches_LOGS_ROLES_CHANNEL_ID = contenu.match(regexId)
				if (!matches_LOGS_ROLES_CHANNEL_ID || matches_LOGS_ROLES_CHANNEL_ID.length > 1)
					return modal.reply({
						content: "Tu n'as pas donné un ID valide 😕",
						ephemeral: true,
					})
				break

			case 'MEDIATION_CHANNEL_ID':
				const matches_MEDIATION_CHANNEL_ID = contenu.match(regexId)
				if (!matches_MEDIATION_CHANNEL_ID || matches_MEDIATION_CHANNEL_ID.length > 1)
					return modal.reply({
						content: "Tu n'as pas donné un ID valide 😕",
						ephemeral: true,
					})
				break

			case 'CONFIG_CHANNEL_ID':
				const matches_CONFIG_CHANNEL_ID = contenu.match(regexId)
				if (!matches_CONFIG_CHANNEL_ID || matches_CONFIG_CHANNEL_ID.length > 1)
					return modal.reply({
						content: "Tu n'as pas donné un ID valide 😕",
						ephemeral: true,
					})
				break

			case 'UPGRADE_CHANNEL_ID':
				const matches_UPGRADE_CHANNEL_ID = contenu.match(regexId)
				if (!matches_UPGRADE_CHANNEL_ID || matches_UPGRADE_CHANNEL_ID.length > 1)
					return modal.reply({
						content: "Tu n'as pas donné un ID valide 😕",
						ephemeral: true,
					})
				break

			case 'BLABLA_CHANNEL_ID':
				const matches_BLABLA_CHANNEL_ID = contenu.match(regexId)
				if (!matches_BLABLA_CHANNEL_ID || matches_BLABLA_CHANNEL_ID.length > 1)
					return modal.reply({
						content: "Tu n'as pas donné un ID valide 😕",
						ephemeral: true,
					})
				break

			case 'FREE_GAMES_CHANNEL_ID':
				const matches_FREE_GAMES_CHANNEL_ID = contenu.match(regexId)
				if (!matches_FREE_GAMES_CHANNEL_ID || matches_FREE_GAMES_CHANNEL_ID.length > 1)
					return modal.reply({
						content: "Tu n'as pas donné un ID valide 😕",
						ephemeral: true,
					})
				break

			case 'MEMBER_ROLE_ID':
				const matches_MEMBER_ROLE_ID = contenu.match(regexId)
				if (!matches_MEMBER_ROLE_ID || matches_MEMBER_ROLE_ID.length > 1)
					return modal.reply({
						content: "Tu n'as pas donné un ID valide 😕",
						ephemeral: true,
					})
				break

			case 'JOIN_ROLE_ID':
				const matches_JOIN_ROLE_ID = contenu.match(regexId)
				if (!matches_JOIN_ROLE_ID || matches_JOIN_ROLE_ID.length > 1)
					return modal.reply({
						content: "Tu n'as pas donné un ID valide 😕",
						ephemeral: true,
					})
				break

			case 'MUTED_ROLE_ID':
				const matches_MUTED_ROLE_ID = contenu.match(regexId)
				if (!matches_MUTED_ROLE_ID || matches_MUTED_ROLE_ID.length > 1)
					return modal.reply({
						content: "Tu n'as pas donné un ID valide 😕",
						ephemeral: true,
					})
				break

			case 'STAFF_EDITEURS_ROLE_ID':
				const matches_STAFF_EDITEURS_ROLE_ID = contenu.match(regexId)
				if (!matches_STAFF_EDITEURS_ROLE_ID || matches_STAFF_EDITEURS_ROLE_ID.length > 1)
					return modal.reply({
						content: "Tu n'as pas donné un ID valide 😕",
						ephemeral: true,
					})
				break

			case 'MODO_ROLE_ID':
				const matches_MODO_ROLE_ID = contenu.match(regexId)
				if (!matches_MODO_ROLE_ID || matches_MODO_ROLE_ID.length > 1)
					return modal.reply({
						content: "Tu n'as pas donné un ID valide 😕",
						ephemeral: true,
					})
				break

			case 'CERTIF_ROLE_ID':
				const matches_CERTIF_ROLE_ID = contenu.match(regexId)
				if (!matches_CERTIF_ROLE_ID || matches_CERTIF_ROLE_ID.length > 1)
					return modal.reply({
						content: "Tu n'as pas donné un ID valide 😕",
						ephemeral: true,
					})
				break

			case 'NOTIF_GAMES_ROLE_ID':
				const matches_NOTIF_GAMES_ROLE_ID = contenu.match(regexId)
				if (!matches_NOTIF_GAMES_ROLE_ID || matches_NOTIF_GAMES_ROLE_ID.length > 1)
					return modal.reply({
						content: "Tu n'as pas donné un ID valide 😕",
						ephemeral: true,
					})
				break

			case 'VOICE_MANAGER_CHANNELS_IDS':
				const matches_VOICE_MANAGER_CHANNELS_IDS = contenu.match(regexIds)
				if (!matches_VOICE_MANAGER_CHANNELS_IDS)
					return modal.reply({
						content: "Tu n'as pas donné un / des ID(s) valide(s) 😕",
						ephemeral: true,
					})
				break

			case 'NOLOGS_MANAGER_CHANNELS_IDS':
				const matches_NOLOGS_MANAGER_CHANNELS_IDS = contenu.match(regexIds)
				if (!matches_NOLOGS_MANAGER_CHANNELS_IDS)
					return modal.reply({
						content: "Tu n'as pas donné un / des ID(s) valide(s) 😕",
						ephemeral: true,
					})
				break

			case 'NOTEXT_MANAGER_CHANNELS_IDS':
				const matches_NOTEXT_MANAGER_CHANNELS_IDS = contenu.match(regexIds)
				if (!matches_NOTEXT_MANAGER_CHANNELS_IDS)
					return modal.reply({
						content: "Tu n'as pas donné un / des ID(s) valide(s) 😕",
						ephemeral: true,
					})
				break

			case 'THREADS_MANAGER_CHANNELS_IDS':
				const matches_THREADS_MANAGER_CHANNELS_IDS = contenu.match(regexIds)
				if (!matches_THREADS_MANAGER_CHANNELS_IDS)
					return modal.reply({
						content: "Tu n'as pas donné un / des ID(s) valide(s) 😕",
						ephemeral: true,
					})
				break

			case 'FEUR_MANAGER_CHANNELS_IDS':
				const matches_FEUR_MANAGER_CHANNELS_IDS = contenu.match(regexIds)
				if (!matches_FEUR_MANAGER_CHANNELS_IDS)
					return modal.reply({
						content: "Tu n'as pas donné un / des ID(s) valide(s) 😕",
						ephemeral: true,
					})
				break
		}

		if (contenu === '') contenu = null

		switch (nom) {
			// Guild
			case 'RICH_PRESENCE_TEXT':
				client.config.bot.richPresenceText = contenu
				if (contenu && contenu !== '')
					await client.user.setPresence({
						activities: [
							{
								name: contenu,
								type: 0,
							},
						],
						status: 'online',
					})
				else await client.user.setPresence({ activities: [], status: 'online' })
				break

			case 'TIMEOUT_JOIN':
				client.config.guild.TIMEOUT_JOIN = contenu
				break

			case 'COMMANDS_PREFIX':
				client.config.guild.COMMANDS_PREFIX = contenu
				break

			// Salons
			case 'LEAVE_JOIN_CHANNEL_ID':
				client.config.guild.channels.LEAVE_JOIN_CHANNEL_ID = contenu
				break

			case 'REPORT_CHANNEL_ID':
				client.config.guild.channels.REPORT_CHANNEL_ID = contenu
				break

			case 'LOGS_MESSAGES_CHANNEL_ID':
				client.config.guild.channels.LOGS_MESSAGES_CHANNEL_ID = contenu
				break

			case 'LOGS_BANS_CHANNEL_ID':
				client.config.guild.channels.LOGS_BANS_CHANNEL_ID = contenu
				break

			case 'LOGS_ROLES_CHANNEL_ID':
				client.config.guild.channels.LOGS_ROLES_CHANNEL_ID = contenu
				break

			case 'MEDIATION_CHANNEL_ID':
				client.config.guild.channels.MEDIATION_CHANNEL_ID = contenu
				break

			case 'CONFIG_CHANNEL_ID':
				client.config.guild.channels.CONFIG_CHANNEL_ID = contenu
				break

			case 'UPGRADE_CHANNEL_ID':
				client.config.guild.channels.UPGRADE_CHANNEL_ID = contenu
				break

			case 'BLABLA_CHANNEL_ID':
				client.config.guild.channels.BLABLA_CHANNEL_ID = contenu
				break

			case 'FREE_GAMES_CHANNEL_ID':
				client.config.guild.channels.FREE_GAMES_CHANNEL_ID = contenu
				break

			// Rôles
			case 'MEMBER_ROLE_ID':
				client.config.guild.roles.MEMBER_ROLE_ID = contenu
				break

			case 'JOIN_ROLE_ID':
				client.config.guild.roles.JOIN_ROLE_ID = contenu
				break

			case 'MUTED_ROLE_ID':
				client.config.guild.roles.MUTED_ROLE_ID = contenu
				break

			case 'STAFF_EDITEURS_ROLE_ID':
				client.config.guild.roles.STAFF_EDITEURS_ROLE_ID = contenu
				break

			case 'MODO_ROLE_ID':
				client.config.guild.roles.MODO_ROLE_ID = contenu
				break

			case 'CERTIF_ROLE_ID':
				client.config.guild.roles.CERTIF_ROLE_ID = contenu
				break

			case 'NOTIF_GAMES_ROLE_ID':
				client.config.guild.roles.NOTIF_GAMES_ROLE_ID = contenu
				break

			// Managers
			case 'VOICE_MANAGER_CHANNELS_IDS':
				client.config.guild.managers.VOICE_MANAGER_CHANNELS_IDS = contenu
				break

			case 'NOLOGS_MANAGER_CHANNELS_IDS':
				client.config.guild.managers.NOLOGS_MANAGER_CHANNELS_IDS = contenu
				break

			case 'NOTEXT_MANAGER_CHANNELS_IDS':
				client.config.guild.managers.NOTEXT_MANAGER_CHANNELS_IDS = contenu
				break

			case 'THREADS_MANAGER_CHANNELS_IDS':
				client.config.guild.managers.THREADS_MANAGER_CHANNELS_IDS = contenu
				break

			case 'FEUR_MANAGER_CHANNELS_IDS':
				client.config.guild.managers.FEUR_MANAGER_CHANNELS_IDS = contenu
				break
		}

		const config = {
			timezone: client.config.timezone,
			richPresenceText: client.config.bot.richPresenceText,
			guild: {
				GUILD_ID: client.config.guild.GUILD_ID,
				TIMEOUT_JOIN: client.config.guild.TIMEOUT_JOIN,
				COMMANDS_PREFIX: client.config.guild.COMMANDS_PREFIX,
				channels: {
					LEAVE_JOIN_CHANNEL_ID: client.config.guild.channels.LEAVE_JOIN_CHANNEL_ID,
					REPORT_CHANNEL_ID: client.config.guild.channels.REPORT_CHANNEL_ID,
					LOGS_MESSAGES_CHANNEL_ID: client.config.guild.channels.LOGS_MESSAGES_CHANNEL_ID,
					LOGS_BANS_CHANNEL_ID: client.config.guild.channels.LOGS_BANS_CHANNEL_ID,
					LOGS_ROLES_CHANNEL_ID: client.config.guild.channels.LOGS_ROLES_CHANNEL_ID,
					MEDIATION_CHANNEL_ID: client.config.guild.channels.MEDIATION_CHANNEL_ID,
					CONFIG_CHANNEL_ID: client.config.guild.channels.CONFIG_CHANNEL_ID,
					UPGRADE_CHANNEL_ID: client.config.guild.channels.UPGRADE_CHANNEL_ID,
					BLABLA_CHANNEL_ID: client.config.guild.channels.BLABLA_CHANNEL_ID,
					FREE_GAMES_CHANNEL_ID: client.config.guild.channels.FREE_GAMES_CHANNEL_ID,
				},
				roles: {
					MEMBER_ROLE_ID: client.config.guild.roles.MEMBER_ROLE_ID,
					JOIN_ROLE_ID: client.config.guild.roles.JOIN_ROLE_ID,
					MUTED_ROLE_ID: client.config.guild.roles.MUTED_ROLE_ID,
					STAFF_EDITEURS_ROLE_ID: client.config.guild.roles.STAFF_EDITEURS_ROLE_ID,
					MODO_ROLE_ID: client.config.guild.roles.MODO_ROLE_ID,
					CERTIF_ROLE_ID: client.config.guild.roles.CERTIF_ROLE_ID,
					NOTIF_GAMES_ROLE_ID: client.config.guild.roles.NOTIF_GAMES_ROLE_ID,
				},
				managers: {
					VOICE_MANAGER_CHANNELS_IDS:
						client.config.guild.managers.VOICE_MANAGER_CHANNELS_IDS,
					NOLOGS_MANAGER_CHANNELS_IDS:
						client.config.guild.managers.NOLOGS_MANAGER_CHANNELS_IDS,
					NOTEXT_MANAGER_CHANNELS_IDS:
						client.config.guild.managers.NOTEXT_MANAGER_CHANNELS_IDS,
					THREADS_MANAGER_CHANNELS_IDS:
						client.config.guild.managers.THREADS_MANAGER_CHANNELS_IDS,
					FEUR_MANAGER_CHANNELS_IDS:
						client.config.guild.managers.FEUR_MANAGER_CHANNELS_IDS,
				},
			},
		}

		await writeFile('./config/env/config.json', JSON.stringify(config, null, 2))

		return modal.reply({
			content: `La configuration de **${nom}** a bien été modifiée 👌`,
		})
	},
}
