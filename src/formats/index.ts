import { crushConverter } from "./crush";
import { gooseConverter } from "./goose";
import type { FormatConverter } from "./types";
import { vibeConverter } from "./vibe";

export * from "./strings";

export const converters: Record<string, FormatConverter> = {
	crush: crushConverter,
	goose: gooseConverter,
	vibe: vibeConverter,
};

export function getConverter(format: string): FormatConverter | undefined {
	return converters[format.toLowerCase()];
}

export function listFormats(): string[] {
	return Object.keys(converters);
}

export type { FormatContext, FormatConverter } from "./types";
