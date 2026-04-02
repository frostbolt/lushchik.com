(function() {
	var key = "theme-preference";
	var buttonNodes = document.querySelectorAll("[data-theme-toggle]");

	function currentTheme() {
		return document.documentElement.getAttribute("data-theme") || "light";
	}

	function updateButtonLabel(theme) {
		buttonNodes.forEach(function(button) {
			button.textContent = theme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme";
		});
	}

	function setTheme(theme) {
		document.documentElement.setAttribute("data-theme", theme);
		localStorage.setItem(key, theme);
		updateButtonLabel(theme);
	}

	updateButtonLabel(currentTheme());

	buttonNodes.forEach(function(button) {
		button.addEventListener("click", function() {
			setTheme(currentTheme() === "dark" ? "light" : "dark");
		});
	});
})();
