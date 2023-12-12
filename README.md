# Twitch Bot for Dust Loop Character Frame Data Lookup

This Twitch bot allows users to retrieve frame data information for various characters in Dust Loop games using simple commands. It utilizes the Dust Loop wiki's data and provides users with character-specific information.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Bot Commands](#bot-commands)
- [Character Aliases](#character-aliases)
- [Move Properties](#move-properties)
- [Configuration](#configuration)
- [Caching](#caching)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before running the Twitch bot, you'll need the following:

- Node.js: Make sure you have Node.js installed on your machine.
- Twitch Account: Create a Twitch account for your bot.
- Twitch Developer Application: Create a Twitch Developer application to obtain the necessary credentials.
- Environment Variables: Set up environment variables for your Twitch bot's username and password.

## Installation

1. Clone the repository to your local machine:

`git clone https://github.com/orctamer/twitch-dustloop-bot.git`

2. Navigate to the project directory:

`cd twitch-dustloop-bot`

3. Install the required Node.js packages:

`npm install`

## Usage

To start the Twitch bot, run the following command:

`npm start`

The bot will connect to the specified Twitch channel(s) and listen for user commands.

## Bot Commands

The bot responds to the following commands in the Twitch chat:

- `!framedata "character name" "move name" "property"`: Retrieve frame data information for a character's move. Replace `"character name"`, `"move name"`, and `"property"` with the desired values.
- `!fd "character name" "move name" "property"`: A shorter alias for the framedata command.

Example Usage:

`!framedata SO 5K damage`

## Character Aliases

You can use either the alias or the full name when looking up character information.

| Alias | Character Name |
| ----- | -------------- |
| AN    | Anji           |
| AS    | Asuka          |
| AX    | Axl            |
| BA    | Baiken         |
| BE    | Bedman         |
| BR    | Bridget        |
| CH    | Chipp          |
| EL    | Elphelt        |
| FA    | Faust          |
| GI    | Giovanna       |
| GO    | Goldlewis      |
| HA    | Happy          |
| IN    | I-No           |
| JC    | Jack-O         |
| JO    | Johnny         |
| KY    | Ky             |
| LE    | Leo            |
| MA    | May            |
| MI    | Millia         |
| NA    | Nagoriyuki     |
| PO    | Potemkin       |
| RA    | Ramlethal      |
| SI    | Sin            |
| SO    | Sol            |
| TE    | Testament      |
| ZA    | Zato           |

## Move Properties

You can use these property names to specify the information you want to retrieve when searching for character data.

| Property | Description                                           |
| -------- | ----------------------------------------------------- |
| damage   | Retrieves the damage dealt by the move.               |
| guard    | Retrieves the guard type of the move.                 |
| startup  | Retrieves the startup frames of the move.             |
| active   | Retrieves the active frames of the move.              |
| recovery | Retrieves the recovery time of the move.              |
| onblock  | Retrieves the advantage on block of the move.         |
| onhit    | Retrieves the advantage on hit of the move.           |
| invul    | Retrieves the invulnerability properties of the move. |
| type     | Retrieves the type or category of the move.           |

## Configuration

Configuration for the bot is done through environment variables. Create a `.env` file in the project directory and set the following variables:

- `TWITCH_USERNAME`: Your Twitch bot's username.
- `TWITCH_PASSWORD`: Your Twitch bot's password.
- `TWITCH_CHANNELS`: A comma-separated list of channels the bot should join (e.g., `channel1,channel2`).

## Caching

To reduce the load on the Dust Loop website and improve response times, the bot implements data caching. Cached data is stored in a `cachedData.json` file. Data is fetched from the website and stored in the cache for an hour (`cacheDurationMs` variable).

## Contributing

Contributions to this bot are welcome! Feel free to submit pull requests, open issues, or suggest improvements.

## License

This bot is open-source and licensed under the [MIT License](LICENSE).
