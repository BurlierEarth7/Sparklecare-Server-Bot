// Imports
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
    // End of command builder
  async execute(interaction) {
    await interaction.reply("Pong!");
  }, // End of execute
}; // End of exports
