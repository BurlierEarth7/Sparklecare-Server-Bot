// Imports
const fs = require("fs");
const path = require("node:path");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientID, guildID, token } = require("./configuration.json");

// Declare constants
const commands = [];
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);
const rest = new REST({ version: "9" }).setToken(token);

// Grab all command files from ./commands directory
for (const folder of commandFolders) {
  // Setup temporary constants
  const commandPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandPath)
    .filter((file) => file.endsWith(".js"));

  // Grab SlashCommandBuilder#toJSON() output of each command's data
  for (const file of commandFiles) {
    // Setup temporary constants
    const filePath = path.join(commandPath, file);
    const command = require(filePath);

    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } // End of if
    else {
      console.log(
        `!!!WARNING: command at ${filePath} is missing 'data' or 'execute' property!!!`
      );
    } // End of else
  } // End of for
} // End of for

// Asynchronous try function
(async () => {
  // Register slash commands for a specific guild
  try {
    await rest.put(Routes.applicationGuildCommands(clientID, guildID), {
      body: commands,
    });

    console.log("Successfully registered application commands.");
  } catch (error) {
    // End of try

    // Log errors
    console.error(error);
  } // End of catch
})(); // End of Async try
