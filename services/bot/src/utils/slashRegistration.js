import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { logger } from "#utils/logger";
import { config } from "#config/config";

/**
 * Registers slash commands with Discord API
 * @param {Soraku} client - The Discord client instance
 */
export async function registerSlashCommands(client) {
  const rest = new REST({ version: "10" }).setToken(config.token);

  try {
    const slashCommandsData = client.commandHandler.getSlashCommandsData();

    if (!slashCommandsData || slashCommandsData.length === 0) {
      logger.info("SlashRegistration", "No slash commands found to register.");
      return;
    }

    logger.info(
      "SlashRegistration",
      `Registering ${slashCommandsData.length} slash commands...`,
    );

    // Check existing commands first
    let existingCommands = [];
    try {
      existingCommands = await rest.get(
        Routes.applicationCommands(config.clientId),
      );
      logger.info(
        "SlashRegistration",
        `Found ${existingCommands.length} existing commands`,
      );
    } catch (e) {
      logger.warn(
        "SlashRegistration",
        "Could not fetch existing commands:",
        e.message,
      );
    }

    // Find entry point command (Discord default "Open" command)
    const entryPointCmd = existingCommands.find((cmd) => cmd.name === "Open");

    // Build commands to register - only custom commands, skip entry point
    // Entry point will be preserved automatically by Discord if not in the list
    const customCommands = slashCommandsData.filter(
      (cmd) => cmd.name !== "Open" && cmd.name !== "Entry Point",
    );

    logger.info(
      "SlashRegistration",
      `Registering ${customCommands.length} custom commands (excluding Entry Point)`,
    );

    // Register in bulk (without Entry Point - it gets preserved)
    await rest.put(Routes.applicationCommands(config.clientId), {
      body: customCommands,
    });

    logger.success(
      "SlashRegistration",
      `Successfully registered ${customCommands.length} slash commands globally.`,
    );
  } catch (error) {
    // Handle the specific Entry Point error
    if (error.code === 50240) {
      logger.error(
        "SlashRegistration",
        "Entry Point command conflict. This is a Discord limitation.",
        "Solution: Go to Discord Developer Portal -> Interactions Endpoint URL and set it, or manually delete the Open command.",
      );
    } else {
      logger.error(
        "SlashRegistration",
        `Failed to register slash commands: ${error.message || error}`,
      );
    }

    // Log the full error for debugging
    if (error.response) {
      logger.error("SlashRegistration", "Response:", error.response.data);
    }
  }
}
