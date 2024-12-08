/* eslint-disable default-case */
/* eslint-disable no-unused-vars */
import {
	SlashCommandBuilder,
	ModalBuilder,
	TextInputBuilder,
	ActionRowBuilder,
	ButtonStyle,
	TextInputStyle,
} from 'discord.js'
import { Pagination } from 'pagination.djs'

const subCommands = {
	'rich-presence-text': {
		richPresenceText: 'Texte de présence du bot',
	},
	'timeout-join': {
		TIMEOUT_JOIN: 'Temps du @Pas de blabla',
	},
	'commands-prefix': {
		COMMANDS_PREFIX: 'Préfixe des commandes personnalisées',
	},
	'leave-join-channel': {
		LEAVE_JOIN_CHANNEL_ID: 'Salon départs-arrivées',
	},
	'report-channel': {
		REPORT_CHANNEL_ID: 'Salon signalements',
	},
	'logs-messages-channel': {
		LOGS_MESSAGES_CHANNEL_ID: 'Salon logs messages',
	},
	'logs-bans-channel': {
		LOGS_BANS_CHANNEL_ID: 'Salon logs bans',
	},
	'logs-roles-channel': {
		LOGS_ROLES_CHANNEL_ID: 'Salon logs rôles',
	},
	'mediation-channel': {
		MEDIATION_CHANNEL_ID: 'Salon médiation',
	},
	'config-channel': {
		CONFIG_CHANNEL_ID: 'Salon config',
	},
	'upgrade-channel': {
		UPGRADE_CHANNEL_ID: 'Salon upgrade',
	},
	'blabla-channel': {
		BLABLA_CHANNEL_ID: 'Salon blabla-hs',
	},
	'free-games-channel': {
		FREE_GAMES_CHANNEL_ID: 'Salon jeux-epic-games',
	},
	'member-role': {
		JOIN_ROLE_ID: 'Rôle @Membres',
	},
	'join-role': {
		JOIN_ROLE_ID: 'Rôle @Pas de blabla',
	},
	'muted-role': {
		MUTED_ROLE_ID: 'Rôle @Muted',
	},
	'staff-editeurs-role': {
		STAFF_EDITEURS_ROLE_ID: 'Rôle @STAFF éditeurs',
	},
	'modo-role': {
		MODO_ROLE_ID: 'Rôle @Modos',
	},
	'certif-role': {
		CERTIF_ROLE_ID: 'Rôle @Certifiés',
	},
	'notif-games-role': {
		NOTIF_GAMES_ROLE_ID: 'Rôle @Notif jeux',
	},
	'voice-channels': {
		VOICE_MANAGER_CHANNELS_IDS: 'Salons vocaux',
	},
	'no-logs-channels': {
		NOLOGS_MANAGER_CHANNELS_IDS: 'Salons no-logs messages',
	},
	'no-text-channels': {
		NOTEXT_MANAGER_CHANNELS_IDS: 'Salons no-text messages',
	},
	'threads-channels': {
		THREADS_MANAGER_CHANNELS_IDS: 'Salons threads auto',
	},
	'feur-channels': {
		FEUR_MANAGER_CHANNELS_IDS: 'Salons avec réaction :feur: autorisée',
	},
}

const command = new SlashCommandBuilder()
	.setName('setup')
	.setDescription('Configuration du serveur')

for (const [subCommandName, subCommandContent] of Object.entries(subCommands))
	for (const [subCommandCode, subCommandDesc] of Object.entries(subCommandContent))
		command.addSubcommand(subCommand =>
			subCommand.setName(subCommandName).setDescription(subCommandDesc),
		)

export default {
	data: command,
	interaction: (interaction, client) => {
		let customId = ''
		let value = ''

		switch (interaction.options.getSubcommand()) {
			case 'rich-presence-text':
				customId = 'RICH_PRESENCE_TEXT'
				value = client.config.bot.richPresenceText
				break

			case 'timeout-join':
				customId = 'TIMEOUT_JOIN'
				value = client.config.guild.TIMEOUT_JOIN
				break

			case 'commands-prefix':
				customId = 'COMMANDS_PREFIX'
				value = client.config.guild.COMMANDS_PREFIX
				break

			// Salons
			case 'leave-join-channel':
				customId = 'LEAVE_JOIN_CHANNEL_ID'
				value = client.config.guild.channels.LEAVE_JOIN_CHANNEL_ID
				break

			case 'report-channel':
				customId = 'REPORT_CHANNEL_ID'
				value = client.config.guild.channels.REPORT_CHANNEL_ID
				break

			case 'logs-messages-channel':
				customId = 'LOGS_MESSAGES_CHANNEL_ID'
				value = client.config.guild.channels.LOGS_MESSAGES_CHANNEL_ID
				break

			case 'logs-bans-channel':
				customId = 'LOGS_BANS_CHANNEL_ID'
				value = client.config.guild.channels.LOGS_BANS_CHANNEL_ID
				break

			case 'logs-roles-channel':
				customId = 'LOGS_ROLES_CHANNEL_ID'
				value = client.config.guild.channels.LOGS_ROLES_CHANNEL_ID
				break

			case 'mediation-channel':
				customId = 'MEDIATION_CHANNEL_ID'
				value = client.config.guild.channels.MEDIATION_CHANNEL_ID
				break

			case 'config-channel':
				customId = 'CONFIG_CHANNEL_ID'
				value = client.config.guild.channels.CONFIG_CHANNEL_ID
				break

			case 'upgrade-channel':
				customId = 'UPGRADE_CHANNEL_ID'
				value = client.config.guild.channels.UPGRADE_CHANNEL_ID
				break

			case 'blabla-channel':
				customId = 'BLABLA_CHANNEL_ID'
				value = client.config.guild.channels.BLABLA_CHANNEL_ID
				break

			case 'free-games-channel':
				customId = 'FREE_GAMES_CHANNEL_ID'
				value = client.config.guild.channels.FREE_GAMES_CHANNEL_ID
				break

			// Rôles
			case 'member-role':
				customId = 'MEMBER_ROLE_ID'
				value = client.config.guild.roles.MEMBER_ROLE_ID
				break

			case 'join-role':
				customId = 'JOIN_ROLE_ID'
				value = client.config.guild.roles.JOIN_ROLE_ID
				break

			case 'muted-role':
				customId = 'MUTED_ROLE_ID'
				value = client.config.guild.roles.MUTED_ROLE_ID
				break

			case 'staff-editeurs-role':
				customId = 'STAFF_EDITEURS_ROLE_ID'
				value = client.config.guild.roles.STAFF_EDITEURS_ROLE_ID
				break

			case 'modo-role':
				customId = 'MODO_ROLE_ID'
				value = client.config.guild.roles.MODO_ROLE_ID
				break

			case 'certif-role':
				customId = 'CERTIF_ROLE_ID'
				value = client.config.guild.roles.CERTIF_ROLE_ID
				break

			case 'notif-games-role':
				customId = 'NOTIF_GAMES_ROLE_ID'
				value = client.config.guild.roles.NOTIF_GAMES_ROLE_ID
				break

			// Managers
			case 'voice-channels':
				customId = 'VOICE_MANAGER_CHANNELS_IDS'
				value = client.config.guild.managers.VOICE_MANAGER_CHANNELS_IDS
				break

			case 'no-logs-channels':
				customId = 'NOLOGS_MANAGER_CHANNELS_IDS'
				value = client.config.guild.managers.NOLOGS_MANAGER_CHANNELS_IDS
				break

			case 'no-text-channels':
				customId = 'NOTEXT_MANAGER_CHANNELS_IDS'
				value = client.config.guild.managers.NOTEXT_MANAGER_CHANNELS_IDS
				break

			case 'threads-channels':
				customId = 'THREADS_MANAGER_CHANNELS_IDS'
				value = client.config.guild.managers.THREADS_MANAGER_CHANNELS_IDS
				break

			case 'feur-channels':
				customId = 'FEUR_MANAGER_CHANNELS_IDS'
				value = client.config.guild.managers.FEUR_MANAGER_CHANNELS_IDS
				break
		}

		const modal = new ModalBuilder()
			.setCustomId('setup')
			.setTitle('Configuration du serveur')
			.addComponents(
				new ActionRowBuilder().addComponents(
					new TextInputBuilder()
						.setCustomId(customId)
						.setLabel(customId)
						.setStyle(TextInputStyle.Paragraph)
						.setValue(value ? value : '')
						.setRequired(true),
				),
			)

		switch (customId) {
			case 'RICH_PRESENCE_TEXT':
				modal.components[0].components[0].data.required = false
				break

			case 'NOLOGS_MANAGER_CHANNELS_IDS':
				modal.components[0].components[0].data.required = false
				break

			case 'NOTEXT_MANAGER_CHANNELS_IDS':
				modal.components[0].components[0].data.required = false
				break

			case 'THREADS_MANAGER_CHANNELS_IDS':
				modal.components[0].components[0].data.required = false
				break

			case 'FEUR_MANAGER_CHANNELS_IDS':
				modal.components[0].components[0].data.required = false
				break
		}

		return interaction.showModal(modal)
	},
}
