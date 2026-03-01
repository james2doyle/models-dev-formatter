import { lowerSnakeCase } from "./strings";
import type {
	FormatContext,
	FormatConverter,
	GooseModel,
	GooseOutput,
} from "./types";

export const gooseConverter: FormatConverter = {
	name: "goose",
	extension: "json",
	convert({ provider, models }: FormatContext): string {
		const providerSlug = lowerSnakeCase(provider.name);
		const firstEnvVar = provider.env[0] ?? "";

		const gooseModels: GooseModel[] = models.map((model) => ({
			name: model.id,
			context_limit: model.limit.context,
			input_token_cost: model.cost?.input ?? 0,
			output_token_cost: model.cost?.output ?? 0,
			currency: "USD",
			supports_cache_control: null,
		}));

		const baseUrl = provider.api ? `${provider.api}/chat/completions` : "";

		const output: GooseOutput = {
			name: `custom_${providerSlug}`,
			engine: "openai",
			display_name: provider.name,
			description: `Custom ${provider.name}`,
			api_key_env: firstEnvVar,
			base_url: baseUrl,
			models: gooseModels,
			headers: null,
			timeout_seconds: null,
			supports_streaming: true,
			requires_auth: true,
		};

		return JSON.stringify(output, null, 2);
	},
};
