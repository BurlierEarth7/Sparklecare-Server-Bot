// Imports
const { Events } = require("discord.js");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    // Check if interaction is a valid command
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName); //Get interaction command's name

      // Check if command exists
      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      } // End of if

      // Try/Catch function to execute command, if fails, alert user
      try {
        await command.execute(interaction);
      } // End of try

      catch (error) {
        console.log(error); // Log error

        if (interaction.replied || interaction.deferred) { // If interaction has already been replied to, follow up instead
          await interaction.followUp({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        } // End of if

        else { // Else directly reply
          await interaction.reply({
            content: "There was an error while executing this command!",
            ephemeral: true,
          });
        } // End of else

      } // End of catch
    } // End of if
  }, // End of execute
}; // End of exports
