#!/usr/bin/env bun
import type { Model, Provider } from "models.dev";
import path from "node:path";
import { getConverter, listFormats } from "./formats/index";

interface ApiJson {
	[providerName: string]: Provider & {
		models: Record<string, Model>;
	};
}

function printUsage(): void {
	console.log("Usage: bun run convert <provider-name> --format <format>");
	console.log("");
	console.log("Formats:");
	for (const format of listFormats()) {
		console.log(`  ${format}`);
	}
	console.log("");
	console.log("Examples:");
	console.log("  bun run convert openai --format crush");
	console.log("  bun run convert zenmux --format goose");
	console.log("  bun run convert huggingface --format vibe");
	console.log("");
}

function parseArgs(
	args: string[],
): { provider: string; format: string } | null {
	if (args.length < 2) {
		return null;
	}

	const provider = args[0];
	const formatIndex = args.indexOf("--format");

	if (formatIndex === -1 || formatIndex + 1 >= args.length) {
		return null;
	}

	const format = args[formatIndex + 1];

	return { provider, format };
}

async function loadApiJson(): Promise<ApiJson> {
	const apiPath = path.join(process.cwd(), "api.json");
	const file = Bun.file(apiPath);

	if (!(await file.exists())) {
		throw new Error(
			"api.json not found. Please download using `bun run download`",
		);
	}

	const content = await file.text();
	return JSON.parse(content) as ApiJson;
}

async function main(): Promise<void> {
	const args = process.argv.slice(2);

	if (args.includes("--help") || args.includes("-h")) {
		printUsage();
		process.exit(0);
	}

	const parsed = parseArgs(args);

	if (!parsed) {
		printUsage();
		process.exit(1);
	}

	const { provider: providerName, format } = parsed;

	const converter = getConverter(format);

	if (!converter) {
		console.error(`Error: Unknown format "${format}"`);
		console.log("");
		console.log("Available formats:");
		for (const f of listFormats()) {
			console.log(`  ${f}`);
		}
		process.exit(1);
	}

	try {
		const apiData = await loadApiJson();
		const providerData = apiData[providerName];

		if (!providerData) {
			console.error(`Error: Provider "${providerName}" not found in api.json`);
			console.log("");
			console.log("Available providers:");
			for (const p of Object.keys(apiData).sort()) {
				console.log(`  ${p}`);
			}
			process.exit(1);
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

		if (models.length === 0) {
			console.error(`Error: No models found for provider "${providerName}"`);
			process.exit(1);
		}

		const output = converter.convert({ provider, models });
		console.log(output);
	} catch (error) {
		console.error("Error:", error instanceof Error ? error.message : error);
		process.exit(1);
	}
}

main();
