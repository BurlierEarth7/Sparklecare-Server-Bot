const { Events } = require("discord.js");
const { prefix } = require("../configuration.json");

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;
    if (message.channel.type === "DM") return;
    if (message.content.startsWith(prefix)) {
      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const command = args.shift().toLowerCase();
      console.log(command);
    }
  },
};
