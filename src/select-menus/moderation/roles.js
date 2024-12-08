import { EmbedBuilder } from 'discord.js'
import { displayNameAndID } from '../../util/util.js'

export default {
	data: {
		name: 'roles',
	},
	interaction: async (menu, client) => {
		// Acquisition des rôles à proposer
		const staffEditeurs = await menu.guild.roles.fetch(
			client.config.guild.roles.STAFF_EDITEURS_ROLE_ID,
		)
		const modo = await menu.guild.roles.fetch(client.config.guild.roles.MODO_ROLE_ID)
		const certifie = await menu.guild.roles.fetch(client.config.guild.roles.CERTIF_ROLE_ID)

		const rolesArray = [staffEditeurs.id, modo.id, certifie.id]

		// Acquisition du membre
		const member = menu.guild.members.cache.get(menu.user.id)

		// Acquisition de la raison
		let reason = ''
		client.cache.staffRolesReason.forEach(async entry => {
			if (entry.memberId === menu.user.id) reason = entry.reason
			const message = entry.message
			await message.delete()
			client.cache.staffRolesReason.delete(entry)
		})

		// Acquisition du salon de logs
		const rolesLogs = menu.guild.channels.cache.get(
			client.config.guild.channels.LOGS_ROLES_CHANNEL_ID,
		)

		// Vérification si aucun rôle parmis Modos et Certifiés
		if (!menu.values.includes(modo.id) && !menu.values.includes(certifie.id))
			return menu.reply({
				content: 'Tu dois sélectionner au minimum le rôle Modos ou le rôle Certifiés 😬',
				ephemeral: true,
			})

		// Suppression des rôles actuels
		const rolesRemove = []
		rolesArray.forEach(role => {
			if (member.roles.cache.has(role)) rolesRemove.push(role)
		})

		await member.roles.remove(rolesRemove)

		// Ajout des rôles choisis
		let description = ''
		const rolesAdd = []
		await menu.values.forEach(role => {
			rolesAdd.push(role)
			description = description.concat(`- <@&${role}>\n`)
		})

		await member.roles.add(rolesAdd)

		description = description.concat(`\n**Raison :** ${reason}`)

		// Envoi du message de logs
		const embed = new EmbedBuilder()
			.setColor('00FF00')
			.setTitle('Rôles modifiés')
			.setDescription(description)
			.setAuthor({
				name: displayNameAndID(menu.member),
				iconURL: menu.user.displayAvatarURL({ dynamic: true }),
			})
			.setTimestamp()

		await rolesLogs.send({ embeds: [embed] })

		return menu.reply({ content: 'Les rôles ont bien été mis à jour 👌', ephemeral: true })
	},
}
