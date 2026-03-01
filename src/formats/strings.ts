export function kebabCase(str: string): string {
	return str
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

export function lowerSnakeCase(str: string): string {
	return str
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "_")
		.replace(/^_+|_+$/g, "");
}

export function toUpperSnake(str: string): string {
	return str.replace(/[^a-zA-Z0-9]+/g, "_").toUpperCase();
}

export function removeVersionNumbers(name: string): string {
	// Remove version patterns like -V2, -3.5, -20241022, etc.
	return name
		.replace(/-[vV]?\d+(\.\d+)*(-\d{4}.*)?$/g, "")
		.replace(/\s+\d+(\.\d+)*/g, "")
		.trim();
}
