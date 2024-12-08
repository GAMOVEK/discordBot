import { SlashCommandBuilder, EmbedBuilder } from 'discord.js'

export default {
	data: new SlashCommandBuilder().setName('bvn').setDescription('bvn'),
	interaction: interaction => {
		const embed = new EmbedBuilder()
			.setColor('3366FF')
			.setTitle("Bienvenue sur le serveur de GAMOVEK")
			.setDescription(
 			`Soyez le bienvenue sur le serveur\n\nLe serveur n'est pas dédier a un domaine précis. Il y a notamment la moto, l'informatique et bien d'autres sujets.\n\nℹ️ **__INFOS PRATIQUES__**\n\nUne fois le règlement validé, vous pouvez définir vos accès selon vos envies. Pour cela il faut vous rendre tout en haut de la liste des salons, dans l'onglet <id:customize>. Vous pourrez ainsi choisir les rôles que vous souhaitez !\n\n📌 **__SUIVRE GAMOVEK__**\n\n<:instagram:1305272494025867377> [Instagram](https://www.instagram.com/gamorider)\r\n\n <:youtube:1305235958991552582> [YouTube](https://www.youtube.com/@gamovek)\r`,
			)

		return interaction.channel.send({
			embeds: [embed],
			files: [`./config/bvn.png`],
		})
	},
}
