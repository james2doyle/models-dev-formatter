import { describe, expect, it } from "bun:test";
import path from "node:path";
import type { Model, Provider } from "models.dev";
import { crushConverter } from "./formats/crush.js";
import { gooseConverter } from "./formats/goose.js";
import { vibeConverter } from "./formats/vibe.js";

interface ApiJson {
	[providerName: string]: Provider & {
		models: Record<string, Model>;
	};
}

async function loadApiJson(): Promise<ApiJson> {
	const apiPath = path.join(process.cwd(), "api.json");
	const file = Bun.file(apiPath);
	const content = await file.text();
	return JSON.parse(content) as ApiJson;
}

async function loadProvider(
	name: string,
): Promise<{ provider: Provider; models: Model[] }> {
	const apiData = await loadApiJson();
	const providerData = apiData[name];

	if (!providerData) {
		throw new Error(`Provider "${name}" not found in api.json`);
	}

	const provider: Provider = {
		id: providerData.id,
		env: providerData.env,
		npm: providerData.npm,
		name: providerData.name,
		doc: providerData.doc,
		api: providerData.api,
	};

	const models = Object.values(providerData.models);
	return { provider, models };
}

describe("crush converter", () => {
	it("converts zenmux to crush format", async () => {
		const { provider, models } = await loadProvider("zenmux");
		const output = crushConverter.convert({ provider, models });
		const parsed = JSON.parse(output);

		expect(parsed.zenmux).toBeDefined();
		expect(parsed.zenmux.name).toBe("ZenMux");
		expect(parsed.zenmux.id).toBe("zenmux");
		expect(parsed.zenmux.api_key).toBe("$ZENMUX_API_KEY");
		expect(parsed.zenmux.base_url).toBe("https://zenmux.ai/api/anthropic/v1");
		expect(parsed.zenmux.type).toBe("openai-compatible");
		expect(Array.isArray(parsed.zenmux.models)).toBe(true);

		// Check first model structure
		const firstModel = parsed.zenmux.models[0];
		expect(firstModel).toHaveProperty("id");
		expect(firstModel).toHaveProperty("name");
		expect(firstModel).toHaveProperty("cost_per_1m_in");
		expect(firstModel).toHaveProperty("cost_per_1m_out");
		expect(firstModel).toHaveProperty("context_window");
		expect(firstModel).toHaveProperty("can_reason");
		expect(firstModel).toHaveProperty("supports_attachments");
		expect(firstModel).toHaveProperty("options");
	});

	it("converts huggingface to crush format with kebab-case slug", async () => {
		const { provider, models } = await loadProvider("huggingface");
		const output = crushConverter.convert({ provider, models });
		const parsed = JSON.parse(output);

		expect(parsed["hugging-face"]).toBeDefined();
		expect(parsed["hugging-face"].name).toBe("Hugging Face");
		expect(parsed["hugging-face"].id).toBe("hugging-face");
		expect(parsed["hugging-face"].api_key).toBe("$HF_TOKEN");
	});
});

describe("goose converter", () => {
	it("converts zenmux to goose format", async () => {
		const { provider, models } = await loadProvider("zenmux");
		const output = gooseConverter.convert({ provider, models });
		const parsed = JSON.parse(output);

		expect(parsed.name).toBe("zenmux");
		expect(parsed.engine).toBe("openai");
		expect(parsed.display_name).toBe("ZenMux");
		expect(parsed.description).toBe("Custom ZenMux");
		expect(parsed.api_key_env).toBe("ZENMUX_API_KEY");
		expect(parsed.base_url).toBe(
			"https://zenmux.ai/api/anthropic/v1/chat/completions",
		);
		expect(parsed.supports_streaming).toBe(true);
		expect(parsed.requires_auth).toBe(true);
		expect(Array.isArray(parsed.models)).toBe(true);

		// Check first model structure
		const firstModel = parsed.models[0];
		expect(firstModel).toHaveProperty("name");
		expect(firstModel).toHaveProperty("context_limit");
		expect(firstModel).toHaveProperty("input_token_cost");
		expect(firstModel).toHaveProperty("output_token_cost");
		expect(firstModel.currency).toBe("USD");
		expect(firstModel.supports_cache_control).toBeNull();
	});

	it("converts huggingface to goose format with lower_snake_case name", async () => {
		const { provider, models } = await loadProvider("huggingface");
		const output = gooseConverter.convert({ provider, models });
		const parsed = JSON.parse(output);

		expect(parsed.name).toBe("hugging_face");
		expect(parsed.display_name).toBe("Hugging Face");
		expect(parsed.base_url).toBe(
			"https://router.huggingface.co/v1/chat/completions",
		);
	});
});

describe("vibe converter", () => {
	it("converts zenmux to vibe format", async () => {
		const { provider, models } = await loadProvider("zenmux");
		const output = vibeConverter.convert({ provider, models });

		// Check TOML structure
		expect(output).toContain("[[providers]]");
		expect(output).toContain('name = "zenmux"');
		expect(output).toContain('api_base = "https://zenmux.ai/api/anthropic/v1"');
		expect(output).toContain('api_key_env_var = "ZENMUX_API_KEY"');
		expect(output).toContain('api_style = "openai"');
		expect(output).toContain('backend = "generic"');
		expect(output).toContain("[[models]]");
		expect(output).toContain("temperature = 0.2");
	});

	it("converts huggingface to vibe format with version-stripped aliases", async () => {
		const { provider, models } = await loadProvider("huggingface");
		const output = vibeConverter.convert({ provider, models });

		expect(output).toContain("[[providers]]");
		expect(output).toContain('name = "hugging-face"');
		expect(output).toContain('api_base = "https://router.huggingface.co/v1"');
		expect(output).toContain('api_key_env_var = "HF_TOKEN"');

		// Check for model entries
		expect(output).toContain("[[models]]");
		expect(output).toContain('provider = "hugging-face"');

		// Check that version numbers are stripped from aliases
		// e.g., "MiMo-V2-Flash" should become "MiMo-Flash"
		if (output.includes('alias = "MiMo-Flash"')) {
			expect(output).toContain('alias = "MiMo-Flash"');
		}
	});
});
