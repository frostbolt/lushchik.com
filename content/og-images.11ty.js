import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "fs";
import { resolve } from "path";

const fonts = [
	{ name: "Inter", data: readFileSync(resolve("_fonts/inter-400.ttf")), weight: 400, style: "normal" },
	{ name: "Inter", data: readFileSync(resolve("_fonts/inter-500.ttf")), weight: 500, style: "normal" },
	{ name: "Inter", data: readFileSync(resolve("_fonts/inter-700.ttf")), weight: 700, style: "normal" },
];

async function renderOG(title, excerpt) {
	const node = {
		type: "div",
		props: {
			style: {
				display: "flex",
				flexDirection: "column",
				width: "1200px",
				height: "630px",
				background: "#0d0d0d",
				fontFamily: "Inter",
				position: "relative",
			},
			children: [
				// Left stripe — stops before bottom bar
				{
					type: "div",
					props: {
						style: {
							position: "absolute",
							left: 8,
							top: 0,
							width: 8,
							height: 548,
							background: "#f0f0f0",
						},
					},
				},
				// Main content area — vertically centered
				{
					type: "div",
					props: {
						style: {
							display: "flex",
							flexDirection: "column",
							flex: 1,
							height: 548,
							paddingLeft: 80,
							paddingRight: 80,
							justifyContent: "center",
							gap: 0,
						},
						children: [
							{
								type: "div",
								props: {
									style: {
										color: "#f0f0f0",
										fontSize: 64,
										fontWeight: 700,
										lineHeight: 1.15,
										marginBottom: 28,
									},
									children: title,
								},
							},
							{
								type: "div",
								props: {
									style: {
										width: 52,
										height: 2,
										background: "#606060",
										marginBottom: 20,
									},
								},
							},
							{
								type: "div",
								props: {
									style: {
										color: "#606060",
										fontSize: 20,
										fontWeight: 400,
										lineHeight: 1.5,
										maxWidth: 860,
									},
									children: excerpt,
								},
							},
						],
					},
				},
				// Bottom separator
				{
					type: "div",
					props: {
						style: {
							position: "absolute",
							bottom: 82,
							left: 0,
							width: 1200,
							height: 1,
							background: "#1e1e1e",
						},
					},
				},
				// Bottom bar
				{
					type: "div",
					props: {
						style: {
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
							height: 82,
							paddingLeft: 80,
							paddingRight: 80,
							background: "#131313",
						},
						children: [
							{
								type: "div",
								props: {
									style: { color: "#606060", fontSize: 12, fontWeight: 400 },
									children: "lushchik.com",
								},
							},
							{ type: "div", props: { style: { flex: 1 } } },
							{
								type: "div",
								props: {
									style: { color: "#f0f0f0", fontSize: 12, fontWeight: 500 },
									children: "Sergei Lushchik",
								},
							},
						],
					},
				},
			],
		},
	};

	const svg = await satori(node, { width: 1200, height: 630, fonts });
	const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } });
	return resvg.render().asPng();
}

export default class OGImages {
	data() {
		return {
			pagination: {
				data: "collections.blog",
				size: 1,
				alias: "post",
			},
			permalink: (data) => `img/og/${data.post.fileSlug}.png`,
			eleventyExcludeFromCollections: true,
		};
	}

	async render(data) {
		const title = data.post.data.title ?? "";
		const excerpt = data.post.data.excerpt ?? data.post.data.description ?? "";
		return renderOG(title, excerpt);
	}
}
