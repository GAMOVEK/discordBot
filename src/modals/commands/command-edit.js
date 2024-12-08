import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js'

export default {
	data: {
		name: 'command-edit',
	},
	interaction: async (modal, client) => {
		// Acquisition du nom, des alias et du contenu
		const nom = modal.fields.getTextInputValue('name-command-edit').trim().replace(/\s+/g, '-')

		const aliases = modal.fields
			.getTextInputValue('aliases-command-edit')
			.trim()
			.toLowerCase()
			.replace(/\s+/g, ',')

		const active = modal.fields.getTextInputValue('active-command-edit').trim().toLowerCase()

		if (active !== '0' && active !== '1')
			return modal.reply({
				content: 'Le champ activation doit être défini sur 0 ou 1 😕',
				ephemeral: true,
			})

		const contenu = modal.fields.getTextInputValue('content-command-edit').trim()
		const buttonInfos = modal.fields
			.getTextInputValue('button-command-edit')
			.trim()
			.split(/\|\|\|*/)

		let textLinkButton = ''
		let linkButton = ''

		if (buttonInfos[0] === '') {
			textLinkButton = null
			linkButton = null
		} else {
			textLinkButton = buttonInfos[0]
			linkButton = buttonInfos[1]
		}

		// Acquisition de la base de données
		const bdd = client.config.db.pools.userbot
		if (!bdd)
			return modal.reply({
				content: 'Une erreur est survenue lors de la connexion à la base de données 😕',
				ephemeral: true,
			})

		// Vérification si la commande existe
		let command = {}
		try {
			const sql = 'SELECT * FROM commands WHERE name = ?'
			const data = [nom]
			const [result] = await bdd.execute(sql, data)
			command = result[0]
		} catch (error) {
			return modal.reply({
				content: 'Une erreur est survenue lors de la vérification du nom de la commande 😕',
				ephemeral: true,
			})
		}

		// Vérification que la commande existe bien
		if (!command)
			return modal.reply({
				content: `La commande **${nom}** n'existe pas 😕`,
				ephemeral: true,
			})

		// Sinon, mise à jour de la commande en base de données
		try {
			const sql =
				'UPDATE commands SET aliases = ?, active = ?, content = ?, textLinkButton = ?, linkButton = ?, lastModificationBy = ?, lastModificationAt = ? WHERE name = ?'
			const data = [
				aliases ? aliases : null,
				active,
				contenu,
				textLinkButton,
				linkButton,
				modal.user.id,
				Math.round(new Date() / 1000),
				nom,
			]

			await bdd.execute(sql, data)
		} catch (error) {
			return modal.reply({
				content:
					'Une erreur est survenue lors de la modification de la commande en base de données 😕',
				ephemeral: true,
			})
		}

		// On prépare un embed avec un bouton de redirection
		let button = []
		if (textLinkButton !== null && linkButton !== null)
			button = new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setLabel(textLinkButton)
					.setURL(linkButton)
					.setStyle(ButtonStyle.Link),
			)

		if (active === '0') {
			if (button.length === 0)
				return modal.reply({
					content: `La commande **${nom}** a bien été modifiée et est **désactivée** 👌\n${
						aliases ? `\n__Alias :__\n\`\`\`${aliases}\`\`\`` : ''
					}\n__Prévisualisation :__\n\n${contenu}`,
				})

			return modal.reply({
				content: `La commande **${nom}** a bien été modifiée et est **désactivée** 👌\n${
					aliases ? `\n__Alias :__\n\`\`\`${aliases}\`\`\`` : ''
				}\n__Prévisualisation :__\n\n${contenu}`,
				components: [button],
			})
		}

		if (button.length === 0)
			return modal.reply({
				content: `La commande **${nom}** a bien été modifiée et est **activée** 👌\n${
					aliases ? `\n__Alias :__\n\`\`\`${aliases}\`\`\`` : ''
				}\n__Prévisualisation :__\n\n${contenu}`,
			})

		return modal.reply({
			content: `La commande **${nom}** a bien été modifiée et est **activée** 👌\n${
				aliases ? `\n__Alias :__\n\`\`\`${aliases}\`\`\`` : ''
			}\n__Prévisualisation :__\n\n${contenu}`,
			components: [button],
		})
	},
}
