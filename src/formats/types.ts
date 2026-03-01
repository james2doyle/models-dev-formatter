import type { Model, Provider } from "models.dev";

export interface FormatContext {
	provider: Provider;
	models: Model[];
}

export interface FormatConverter {
	name: string;
	extension: "json" | "toml";
	convert(context: FormatContext): string;
}

export interface CrushModel {
	id: string;
	name: string;
	cost_per_1m_in: number;
	cost_per_1m_out: number;
	cost_per_1m_in_cached: number | null;
	cost_per_1m_out_cached: number | null;
	context_window: number;
	default_max_tokens: number;
	can_reason: boolean;
	supports_attachments: boolean;
	options: Record<string, never>;
}

export interface CrushProvider {
	name: string;
	id: string;
	api_key: string;
	base_url: string;
	type: string;
	models: CrushModel[];
}

export interface CrushOutput {
	[providerSlug: string]: CrushProvider;
}

export interface GooseModel {
	name: string;
	context_limit: number;
	input_token_cost: number;
	output_token_cost: number;
	currency: "USD";
	supports_cache_control: null;
}

export interface GooseOutput {
	name: string;
	engine: "openai";
	display_name: string;
	description: string;
	api_key_env: string;
	base_url: string;
	models: GooseModel[];
	headers: null;
	timeout_seconds: null;
	supports_streaming: true;
	requires_auth: true;
}

export interface VibeProvider {
	name: string;
	api_base: string;
	api_key_env_var: string;
	api_style: "openai";
	backend: "generic";
}

export interface VibeModel {
	name: string;
	provider: string;
	alias: string;
	temperature: 0.2;
	input_price: number;
	output_price: number;
}

export interface VibeOutput {
	providers: VibeProvider[];
	models: VibeModel[];
}
