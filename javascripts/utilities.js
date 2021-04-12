export var assign = (element, selector, target, handler) => {
	element.addEventListener(target, (e) => {
		if (e.target.matches(selector)) handler(e, element);
	});
};

export var getURL = () => document.location.hash.replace(/^#\//, "");
