// Imports
const { Events, ActivityType } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);
    client.user.setStatus("online");
    client.user.setActivity("Sparklecare | Type / for a list of commands!", { type: ActivityType.Watching });

  }, // End of execute
}; // End of exports
