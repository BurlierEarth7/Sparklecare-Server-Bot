const fs = require("fs");
const path = require("node:path");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientID, guildID, token } = require("./configuration.json");

const commands = [];

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  // grab all command files from commands dir
  const commandPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandPath)
    .filter((file) => file.endsWith(".js"));
  // grab slashcommandbuilder#toJSON() output of each command's data
  for (const file of commandFiles) {
    const filePath = path.join(commandPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `!!!WARNING: command at ${filePath} is missing 'data' or 'execute' property!!!`
      );
    }
  }
}

console.log(commands);
const rest = new REST({ version: "9" }).setToken(token);

(async () => {
  try {
    // Register slash commands for a specific guild
    await rest.put(Routes.applicationGuildCommands(clientID, guildID), {
      body: commands,
    });

    console.log("Successfully registered application commands.");
  } catch (error) {
    console.error(error);
  }
})();
