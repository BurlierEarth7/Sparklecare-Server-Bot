const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("check")
    .setDescription("Check if a user is viable for verification")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to check")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false),

  // End of command builder
  async execute(interaction) {
    var reply = "User's verification status: \n";
    var canVerify = true;
    const user = interaction.options.getUser("user");
    // Check if account is older than 1 week
    if (Date.now() - user.createdAt < 604800000) {
      canVerify = false;
      reply += "# WARNING\nAccount ***IS*** under 1 week old!.\n";
    }

    // Get user's messages in this channel, check for a number
    const messages = await interaction.channel.messages.fetch({ limit: 100 }); // Get last 100 messages
    var age = -1;
    await messages.every(function (message) {
      if (message.author.id == user.id) {
        if (message.content.match(/[0-9]/g)) {
          age = parseInt(message.content.replace(/[^0-9]/g, ""));
          if (age < 16) {
            canVerify = false;
            reply += "## Caution\nUser is **POSSIBLY** under 16 years old.\n";
          } else if (age > 60) {
            reply += "### Notice:\nAge gathered may be incorrect, as it is past the age of 60.\n(They might also just be old though)\n";
          }


          return false; // Stop going through messages
        }
      }
      return true; // Keep going through messages
    }); // End of messages.every

    if (age == -1) {
      reply +=
        "## Caution\nCould not find a message from the user containing their age.\n *Are you running the command in the ticket?*\n";
      canVerify = false;
    }

    if (canVerify) {
      reply += "User is **LIKELY** eligible for verification.";
    } else {
      reply += "User is **LIKELY NOT** eligible for verification.";
    }

    await interaction.reply({
      content: reply,
      ephemeral: true,
    });
  }, // End of execute
}; // End of module.exports
