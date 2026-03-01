import { kebabCase, removeVersionNumbers } from "./strings";
import type {
	FormatContext,
	FormatConverter,
	VibeModel,
	VibeProvider,
} from "./types";

export const vibeConverter: FormatConverter = {
	name: "vibe",
	extension: "toml",
	convert({ provider, models }: FormatContext): string {
		const providerSlug = kebabCase(provider.name);
		const firstEnvVar = provider.env[0] ?? "";

		const vibeProvider: VibeProvider = {
			name: providerSlug,
			api_base: provider.api ?? "",
			api_key_env_var: firstEnvVar,
			api_style: "openai",
			backend: "generic",
		};

		const vibeModels: VibeModel[] = models.map((model) => ({
			name: model.id,
			provider: providerSlug,
			alias: removeVersionNumbers(model.name),
			temperature: 0.2,
			input_price: model.cost?.input ?? 0,
			output_price: model.cost?.output ?? 0,
		}));

		// Build TOML output manually
		let output = "[[providers]]\n";
		output += `name = "${vibeProvider.name}"\n`;
		output += `api_base = "${vibeProvider.api_base}"\n`;
		output += `api_key_env_var = "${vibeProvider.api_key_env_var}"\n`;
		output += `api_style = "${vibeProvider.api_style}"\n`;
		output += `backend = "${vibeProvider.backend}"\n`;

		for (const model of vibeModels) {
			output += "\n[[models]]\n";
			output += `name = "${model.name}"\n`;
			output += `provider = "${model.provider}"\n`;
			output += `alias = "${model.alias}"\n`;
			output += `temperature = ${model.temperature}\n`;
			output += `input_price = ${model.input_price}\n`;
			output += `output_price = ${model.output_price}\n`;
		}

		return output;
	},
};
