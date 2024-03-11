// Imports
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("serverdetails")
    .setDescription("Replies with information about the server!"),
  // End of command builder
  async execute(interaction) {
    const USER = {
      NAME: interaction.user.tag,
      AVATAR: interaction.user.displayAvatarURL(),
    };

    const SERVER_DETAILS = {
      SERVER_ICON: interaction.guild.iconURL(),
      MEMBER_COUNT: interaction.guild.memberCount,
      SERVER_NAME: interaction.guild.name,
      SERVER_OWNER: await interaction.guild.fetchOwner(),
      SERVER_REGION: interaction.guild.preferredLocale,
      SERVER_CREATED: interaction.guild.createdAt,
      SERVER_VERIFICATION: interaction.guild.verificationLevel,
    };

    const MESSAGE = new EmbedBuilder()
      .setColor(0x7289DA)
      .setTitle(SERVER_DETAILS.SERVER_NAME)
      .setAuthor({
        name: "Server Details",
        iconURL: SERVER_DETAILS.SERVER_ICON,
      })
      .setDescription(`Information about ${SERVER_DETAILS.SERVER_NAME}`)
      .setThumbnail(SERVER_DETAILS.SERVER_ICON)
      .addFields(
        { name: "Server Created", value: `${SERVER_DETAILS.SERVER_CREATED}` },
        {
          name: "Server Owner",
          value: `${SERVER_DETAILS.SERVER_OWNER}`,
          inline: true,
        },
        {
          name: "Server Region",
          value: `${SERVER_DETAILS.SERVER_REGION}`,
          inline: true,
        },
        {
          name: "Member Count",
          value: `${SERVER_DETAILS.MEMBER_COUNT}`,
          inline: true,
        }
      )
      .setFooter({
        text: `Requested by ${USER.NAME}`,
        iconURL: USER.AVATAR,
      })
      .setTimestamp();
    await interaction.reply({ embeds: [MESSAGE] });
  }, // End of execute
}; // End of exports
