const tmi = require("tmi.js");
const { fuzzyFindMoveDetails } = require("./fuzzyFindMoveDetails");

// Define configuration options
require("dotenv").config();

const opts = {
  identity: {
    username: process.env.TWITCH_USERNAME,
    password: process.env.TWITCH_PASSWORD,
  },
  channels: process.env.TWITCH_CHANNELS.split(","),
};

// Create a client with the configuration
const client = new tmi.client(opts);

// Register event handlers
client.on("message", onMessageHandler);
client.on("connected", onConnectedHandler);

// Connect to Twitch
client.connect();

// Message handler
function parseCommand(message) {
  const regex = /"([^"]+)"|\S+/g;
  let match;
  const params = [];

  while ((match = regex.exec(message)) !== null) {
    params.push(match[1] || match[0].replace(/"/g, ""));
  }

  return params;
}

async function onMessageHandler(channel, context, msg, self) {
  if (self) {
    return; // Ignore messages from the bot
  }

  // Parse the command and parameters
  if (msg.trim().startsWith("!framedata") || msg.trim().startsWith("!fd")) {
    const params = parseCommand(msg);
    if (params.length < 4) {
      client.say(
        channel,
        'To retrieve character frame data, use the command: !framedata or !fd "character alias/name" "move name" "property". For example, you can type: !framedata SO 5K damage or !fd AS 2D startup. For more details, check out the command usage on GitHub: https://github.com/orctamer/twitch-dustloop-bot?tab=readme-ov-file#bot-commands'
      );
      return;
    }

    const [, character, move, property] = params;
    const data = await fuzzyFindMoveDetails(character, move, property);
    client.say(channel, data);
  }
}

// Connected handler
function onConnectedHandler(addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
