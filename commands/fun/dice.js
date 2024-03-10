// Imports
const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roll") // Name of command
    .setDescription("Roll a 6 sided or 20 sided die") // Decription of command
    .addIntegerOption(
      (option) =>
        option
          .setName("sides") // Name of the option
          .setDescription("Number of sides on the die") // Description of the option
          .setRequired(true) // Is the parameter required?
          .addChoices({ name: "6", value: 6 }, { name: "20", value: 20 }) // Possible choices
    ), // End of addIntegerOption

  // End of command builder
  async execute(interaction) {
    const random =
      Math.floor(Math.random() * interaction.options.getInteger("sides")) + 1; // Random number between 1 and sides
    await interaction.reply(`You rolled a(n) ${random}!`); // Tell user results
  }, // End of execute
}; // End of exports
