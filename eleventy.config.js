import pluginRss from "@11ty/eleventy-plugin-rss";

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default function(eleventyConfig) {
	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPassthroughCopy({ "./public/": "/" });
	eleventyConfig.addWatchTarget("css/**/*.css");

	const parseYearMonth = (value) => {
		if (typeof value !== "string") {
			return Number.POSITIVE_INFINITY;
		}
		const match = value.match(/^(\d{4})-(\d{2})$/);
		if (!match) {
			return Number.NEGATIVE_INFINITY;
		}
		const year = Number.parseInt(match[1], 10);
		const month = Number.parseInt(match[2], 10);
		if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
			return Number.NEGATIVE_INFINITY;
		}
		return year * 100 + month;
	};

	const byTitle = (a, b) => {
		return String(a.data.title || "").localeCompare(String(b.data.title || ""));
	};

	eleventyConfig.addCollection("blog", (collectionApi) => {
		return collectionApi
			.getFilteredByGlob("content/blog/*.md")
			.sort((a, b) => b.date - a.date);
	});

	eleventyConfig.addCollection("experience", (collectionApi) => {
		return collectionApi
			.getFilteredByGlob("content/experience/*.md")
			.sort((a, b) => {
				const endA = parseYearMonth(a.data.timeframe?.end);
				const endB = parseYearMonth(b.data.timeframe?.end);
				if (endA !== endB) {
					return endB - endA;
				}

				const startA = parseYearMonth(a.data.timeframe?.start);
				const startB = parseYearMonth(b.data.timeframe?.start);
				if (startA !== startB) {
					return startB - startA;
				}
				return byTitle(a, b);
			});
	});

	eleventyConfig.addCollection("sideProjects", (collectionApi) => {
		return collectionApi
			.getFilteredByGlob("content/side-projects/*.md")
			.sort((a, b) => {
				const orderA = Number.isFinite(a.data.order) ? a.data.order : Number.MAX_SAFE_INTEGER;
				const orderB = Number.isFinite(b.data.order) ? b.data.order : Number.MAX_SAFE_INTEGER;
				if (orderA !== orderB) {
					return orderA - orderB;
				}
				return byTitle(a, b);
			});
	});

	eleventyConfig.addFilter("displayDate", (value) => {
		if (!value) {
			return "";
		}
		return new Intl.DateTimeFormat("en", {
			year: "numeric",
			month: "short",
			day: "2-digit"
		}).format(value);
	});

	eleventyConfig.addFilter("excerpt", (html, maxLength = 160) => {
		if (!html) {
			return "";
		}
		const text = String(html)
			.replace(/<[^>]*>/g, " ")
			.replace(/\s+/g, " ")
			.trim();
		if (text.length <= maxLength) {
			return text;
		}
		return `${text.slice(0, maxLength).trimEnd()}...`;
	});

	eleventyConfig.addFilter("displayTimeframe", (timeframe) => {
		if (!timeframe || typeof timeframe !== "object") {
			return "";
		}

		const format = (value) => {
			const match = typeof value === "string" ? value.match(/^(\d{4})-(\d{2})$/) : null;
			if (!match) {
				return "";
			}
			const date = new Date(Date.UTC(Number.parseInt(match[1], 10), Number.parseInt(match[2], 10) - 1, 1));
			return new Intl.DateTimeFormat("en", { month: "short", year: "numeric", timeZone: "UTC" }).format(date);
		};

		const start = format(timeframe.start);
		const end = !timeframe.end || timeframe.end === "9999-12" ? "present" : format(timeframe.end);

		if (!start && !end) {
			return "";
		}
		if (!start) {
			return end;
		}
		if (!end) {
			return start;
		}
		return `${start} - ${end}`;
	});
};

export const config = {
	templateFormats: [
		"md",
		"njk",
		"html",
		"liquid",
		"11ty.js",
	],
	markdownTemplateEngine: "njk",
	htmlTemplateEngine: "njk",
	dir: {
		input: "content",
		includes: "../_includes",
		data: "../_data",
		output: "_site"
	}
};
