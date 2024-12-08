import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'

export default {
	data: new SlashCommandBuilder().setName('rules').setDescription('rules'),
	interaction: async interaction => {
		const embed = new EmbedBuilder()
			.setColor('3366FF')
			.setDescription(
				`📃 **__Règles générales__**\n\n0️⃣ - Vous devez respecter les Conditions Générales d'Utilisation de Discord.\n\n1️⃣ - Ne mentionnez personne inutilement.\n\n2️⃣ - Aucune attaque personnelle, insultes, nom de famille, ou autres formes de harcèlement. Racisme / sexisme / insultes / discours de haine ou tout discours visant négativement une personne ou un groupe de personnes de manière négative ne sera toléré.\n\n3️⃣ - Interdiction de flood et de spammer le chat.\n\n4️⃣ - Pornographie, gore et contenu illégaux en tout types interdit.\n\n5️⃣ - Toute forme de pub est sévèrement sanctionnée. La publicité en message privée l'est aussi.\n\n6️⃣ - Ayez un pseudonyme correct. Pas de pub, d'insultes, de liens dans le pseudo, de caractères spéciaux.\n\n7️⃣ - Vous devrez avoir une pdp respectueuse (conformément aux règles (ToS) de Discord).\n\n8️⃣ - Toutes ces règles s'appliquent dans les salons vocaux.\n\n9️⃣ - On se respecte dans la joie et la bonne humeur\n\n 🔟 - Vous serez tenus seul responsable du contenu que vous postez.\n\n1️⃣1️⃣ - Pas de message ou MP qui implique : un paiement, un cashprize, un don monétaire, une publicité, un recrutement hors clan, une demande d'abonnement, un lien sponsorisé, un concours, etc.\n\n1️⃣2️⃣ - Have fun !`,
			)



		await interaction.channel.send({
			embeds: [embed],
			files: [`./config/rules.png`],
		})

		await interaction.channel.send({
			embeds: [embed1],
		})

		return message.react('✅');
		})
	},
}
