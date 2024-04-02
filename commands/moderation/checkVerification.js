//TODO: get age part to work
//* Why. WHY DOES THIS NOT WORK AAAA

const { SlashCommandBuilder } = require("discord.js");

var reply = "User's verification status: \n";
var canVerify = true;
module.exports = {
  data: new SlashCommandBuilder()
    .setName("check")
    .setDescription("Check if a user is viable for verification")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to check")
        .setRequired(true)
    ),

  // End of command builder
  async execute(interaction) {
    //check if user is older than 16
    const user = interaction.options.getUser("user");
    client.channels.cache
      .get(interaction.channel.id)
      .messages.fetch({ limit: 100 })
      .then((messages) => {

        for (const message of messages.values()) {
          if (message.author.id == user) {
            if (!isNaN(parseInt(message.content.replace(/([^0-9])/g, "")))) {
              var age = message.content.replace(/([^0-9])/g, "");
              if (parseInt(age) < 16) {
                //user less than 16
                setVerify(false);
                addReply(
                  "## Caution \nThis user is likely **NOT** 16 years old or older.\n"
                );
              }
            }
          }
        }
        if (Date.now() - user.createdTimestamp < 1000 * 60 * 60 * 24 * 7) {
          setVerify(false);
          addReply(
            "# Warning \nThis user's account **IS** less than 1 week old.\n"
          );
        }
        canVerify == true
          ? addReply("This user is eligible for verification.")
          : addReply("**This user is likely not eligible for verification.**");
      });
      say(interaction, reply);
  },
}; // End of module.exports

function setVerify(b) {
  canVerify = b;
}
function addReply(m) {
   reply += m;
}

async function say(interaction, msg) {
  await interaction.reply({ content: msg, ephemeral: true });
}


/*
function olderThan16(interaction, user, canVerify, reply) {
  client.channels.cache
    .get(interaction.channel.id)
    .messages.fetch({ limit: 100 })
    .then(function (messages) {
      // find first message with a number
      for (const message of messages.values()) {
        if (message.author == user) {
          if (parseInt(message.content.replace(/[^0-9]/g, "")) < 16) {
            canVerify = false;
            reply +=
              "## Caution \nThis user **MAY** be less than 16 years old, due to one of their messages including a number less than 16, or no numbers being found.\n";
          }
        }
      }
    });
}
*/
