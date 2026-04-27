export default {
	permalink: (data) => {
		const slug = data.page.fileSlug;
		return `/blog/${slug}/`;
	},
	layout: "layouts/post.njk",
};
