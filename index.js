// Imports
const Discord = require("discord.js");
const { Collection, Events, GatewayIntentBits } = require("discord.js");
const config = require("./configuration.json");
const path = require("path");
const fs = require("fs");

// Setup client
const client = new Discord.Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Command Handler
client.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  // Grab all command files from ./commands directory
  const commandPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandPath)
    .filter((file) => file.endsWith(".js"));
  // Grab SlashCommandBuilder#toJSON() output of each command's data
  for (const file of commandFiles) {
    // Setup temporary constants
    const filePath = path.join(commandPath, file);
    const command = require(filePath);
    //if data and execute exists within the command, set command to be name and command
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } // End of if
    else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    } // End of else
  } // End of for
} // End of for
// End of Command Handler

// Event Handler
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  // If once flag true, only execute command once
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } // End of if
  //Else execute command
  else {
    client.on(event.name, (...args) => event.execute(...args));
  } // End of else
} // End of for
// End of Event Handler

// Log into Discord with client
client.login(config.token);
