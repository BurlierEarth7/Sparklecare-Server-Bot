const { SlashCommandBuiler } = require("discord.js");

module.exports = {
  data: new SlashCommandBuiler()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};
