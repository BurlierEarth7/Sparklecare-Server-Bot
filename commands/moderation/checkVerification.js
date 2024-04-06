//TODO: Get deny Modal to show up, get info from modal and send reason
const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

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
    var canVerify = true;
    const user = interaction.options.getUser("user");
    const channel = client.guilds.cache
      .get(interaction.guildId)
      .channels.cache.find(
        (chan) =>
          chan.name.toLowerCase() == `ticket-${user.username.toLowerCase()}`
      );
    if (!channel) {
      await interaction.reply({
        content: "Could not find a ticket channel for this user.",
        ephemeral: true,
      });
      return false;
    }

    const reply = new EmbedBuilder().setTitle(
      user.globalName + "'s verification status:"
    );
    // Check if account is older than 1 week
    if (Date.now() - user.createdAt < 604800000) {
      canVerify = false;
      reply.addFields({
        name: "WARNING",
        value: "Account ***IS*** under 1 week old!.",
        inline: true,
      });
    }

    // Get user's messages in ticket channel (name of channel == user name), check for a number
    const messages = await channel.messages.fetch({ limit: 100 }); // Get last 100 messages
    var age = -1;
    await messages.every(function (message) {
      if (message.author.id == user.id) {
        if (message.content.match(/[0-9]/g)) {
          age = parseInt(message.content.replace(/[^0-9]/g, ""));
          if (age < 16) {
            canVerify = false;
            reply.addFields({
              name: "Caution",
              value: "User is **POSSIBLY** under 16 years old.",
              inline: true,
            });
          }

          return false; // Stop going through messages
        }
      }
      return true; // Keep going through messages
    }); // End of messages.every

    if (age == -1) {
      reply.addFields({
        name: "Caution",
        value: "Could not find a message from the user containing their age.",
        inline: true,
      });
      canVerify = false;
    }

    if (canVerify) {
      reply.setFooter({
        text: "User is **LIKELY** eligible for verification.",
      });
    } else {
      reply.setFooter({
        text: "User is **LIKELY NOT** eligible for verification.",
      });
    }

    // Add buttons
    const verify = new ButtonBuilder()
      .setCustomId("verify")
      .setLabel("Verify")
      .setStyle(ButtonStyle.Success);

    const deny = new ButtonBuilder()
      .setCustomId("deny")
      .setLabel("Deny")
      .setStyle(ButtonStyle.Danger);

    const goToTicket = new ButtonBuilder()
      .setLabel("View Channel")
      .setURL(
        `https://discord.com/channels/${interaction.guildId}/${channel.id}`
      )
      .setStyle(ButtonStyle.Link);

    const row = new ActionRowBuilder().addComponents(verify, deny, goToTicket);

    const response = await interaction.reply({
      embeds: [reply],
      components: [row],
    });

    // Button actions
    const filter = (i) => i.user.id === interaction.user.id; // Only allow the user who ran the command to interact with the buttons
    try {
      const verification = await response.awaitMessageComponent({
        filter: filter,
        time: 3_600_000,
      }); // Wait for 1 hour for a button to be clicked

      if (verification.customId == "verify") {
        await channel.send("?v " + user.id);
        await channel.send(
          "You have been verified! This ticket will be closed manually by a staff member shortly."
        );
        await interaction.editReply({
          content: "User has been verified. Make sure to close the ticket!",
          components: [],
        });
      } else if (verification.customId == "deny") {
        const denyReason = new ModalBuilder()
          .setTitle("Deny Reason")
          .setCustomId("denyReason");

        const rsn = new TextInputBuilder()
          .setCustomId("reason")
          .setPlaceholder("Reason for denial")
          .setStyle(TextInputStyle.Short)
          .setMaxLength(255);
        denyReason.addComponents(rsn);
        await verification.showModal(denyReason);
        await verification.editReply({
          content:
            "User has been denied verification. Make sure to close the ticket!",
          components: [],
        });
      } else if (verification.customId == "denyReason") {
        const rsn = verification.fields.getTextInputValue("reason");
        await channel.send(
          "You have been denied verification. Reason: " + rsn == ""
            ? "No reason provided."
            : rsn
        ); // Send the reason to the user
        await interaction.editReply({
          content:
            "User has been denied verification. Make sure to close the ticket!",
          components: [],
        });
      }
    } catch (err) {
      await interaction.editReply({
        content:
          "Embed Component's timed out automatically after 1 hour of inactivity. Please run /check again to view again.",
        components: [],
      });
      console.log(err);
    }
  }, // End of execute
}; // End of module.exports
