import { Channel, Client, Intents, TextChannel } from "discord.js";
import util from "minecraft-server-util";
import * as dotenv from "dotenv";
dotenv.config();

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

const minecraftServer = process.env.SERVER_ADDRESS;

export default async function StartBot() {
  client.login(process.env.BOT_TOKEN);

  client.on("ready", async () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

  client.on("messageCreate", async ({ author, content, channel }) => {
    if (author.bot) return;

    if (content === `!call`) {
      (channel as TextChannel).send(
        `@here, ${author.username} está te chamando para jogar Minecraft!`,
      );
    }
    if (content.startsWith(`!players`)) {
      try {
        const response = await util.status(minecraftServer, {
          port: 25565,
          timeout: 20000,
        });
        if (response.onlinePlayers === 0) {
          channel.send(`Não há jogadores online! :( `);
        } else if (content.substr(content.indexOf(" ") + 1) === "list") {
          const playersList = response.samplePlayers.map(
            (player) => player.name,
          );
          (channel as TextChannel).send(
            `Estes são os jogadores online: ${JSON.stringify(playersList)}`,
          );
        } else {
          channel.send(
            `Há ${response.onlinePlayers} jogador${
              response.onlinePlayers > 1 ? "es" : ""
            } online!`,
          );
        }
      } catch (err) {
        console.log(err);
        channel.send("Ops, aconteceu algo de errado, avise NoJoke sobre isso!");
      }
    }

    if (content === `!status`) {
      try {
        const response = await util.status(minecraftServer);
        if (response) {
          (channel as TextChannel).send("Servidor está online!");
        } else {
          (channel as TextChannel).send(
            "Ops, parece que o servidor está off! :( ",
          );
        }
      } catch (err) {
        (channel as TextChannel).send(
          "Ops, parece que o servidor está off! :( ",
        );
      }
    }

    if (content === `!ip`) {
      (channel as TextChannel).send(String(minecraftServer));
    }
    if (content === `!help`) {
      (channel as TextChannel).send(`

      !call - Chama todos do discord para jogar.
      !status - Mostra o status do servidor.
      !ip - Mostra o ip do servidor.
      !players - Mostra o número de jogadores online no servidor.
      !players list - Mostra a lista de jogadores online.

      `);
    }
  });
}
