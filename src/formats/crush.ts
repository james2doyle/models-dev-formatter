import { kebabCase, toUpperSnake } from "./strings";
import type {
	CrushModel,
	CrushOutput,
	FormatContext,
	FormatConverter,
} from "./types";

export const crushConverter: FormatConverter = {
	name: "crush",
	extension: "json",
	convert({ provider, models }: FormatContext): string {
		const providerSlug = kebabCase(provider.name);
		const firstEnvVar = provider.env[0] ?? "";

		const crushModels: CrushModel[] = models.map((model) => ({
			id: model.id,
			name: model.name,
			cost_per_1m_in: model.cost?.input ?? 0,
			cost_per_1m_out: model.cost?.output ?? 0,
			cost_per_1m_in_cached: model.cost?.cache_read ?? 0,
			cost_per_1m_out_cached: model.cost?.cache_write ?? 0,
			context_window: model.limit.context,
			default_max_tokens: model.limit.output,
			can_reason: model.reasoning,
			supports_attachments: model.attachment,
			options: {},
		}));

		const output: CrushOutput = {
			[providerSlug]: {
				name: provider.name,
				id: providerSlug,
				api_key: `$${toUpperSnake(firstEnvVar)}`,
				base_url: provider.api ?? "",
				type: "openai-compatible",
				models: crushModels,
			},
		};

		return JSON.stringify(output, null, 2);
	},
};
