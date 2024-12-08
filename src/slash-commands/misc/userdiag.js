import { ContextMenuCommandBuilder } from 'discord.js'

export default {
	contextMenu: new ContextMenuCommandBuilder().setName('userdiag').setType(2),
	interaction: async (interaction, client) => {
		// On diffère la réponse pour avoir plus de 3 secondes
		await interaction.deferReply()

		// Acquisition du membre
		const member = interaction.guild.members.cache.get(interaction.targetUser.id)
		if (!member)
			return interaction.editReply({
				content: "Je n'ai pas trouvé cet utilisateur, vérifie la mention ou l'ID 😕",
			})

		// Acquisition de la base de données
		const bdd = client.config.db.pools.userbot
		if (!bdd)
			return interaction.editReply({
				content: 'Une erreur est survenue lors de la connexion à la base de données 😕',
			})

		// Acquisition du message
		let userdiagMessage = ''
		try {
			const sql = 'SELECT content FROM commands WHERE name = ?'
			const data = ['userdiag']
			const [result] = await bdd.execute(sql, data)

			userdiagMessage = result[0].content
		} catch {
			return interaction.editReply({
				content:
					'Une erreur est survenue lors de la récupération du message UserDiag en base de données 😬',
			})
		}

		// Envoi du message
		return interaction.editReply({
			content: `${member}, suis les instructions ci-dessous :\n\n${userdiagMessage}`,
		})
	},
}
