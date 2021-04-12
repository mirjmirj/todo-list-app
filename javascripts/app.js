import { ItemStore } from "./store.js";
import { assign, getURL } from "./utilities.js";

// var Items = new ItemStore("items");

var Main = {
	$: {
		toggleAll: document.querySelector('[data-item="toggle-items"]'),
		input: document.querySelector('[data-item="new"]'),
		list: document.querySelector('[data-item="list"]'),
		clear: document.querySelector('[data-item="clear-completed"]'),

		displayMain(display) {
			document.querySelector('[data-item="main"]').style.display = display ? "block" : "none";
		},

		displayClear(display) {
			Main.$.clear.style.display = display ? "block" : "none";
		},

		displayFooter(display) {
			document.querySelector('[data-item="footer"]').style.display = display ? "block" : "none";
		}
	},

	init() {

	createItem(item) {
		var li = document.createElement("li");
		li.dataset.id = item.id;

		if (item.completed) {
			li.classList.add("completed");
		}

    let renderedHTML = `
			<div class="view">
				<input data-item="toggle" class="toggle" type="checkbox" ${item.completed ? "checked" : ""}>
				<label data-item="label"></label>
				<button class="destroy" data-item="destroy"></button>
			</div>
			<input class="edit" data-item="edit">
    `;

    li.insertAdjacentHTML('afterbegin', renderedHTML);

		li.querySelector('[data-item="label"]').textContent = item.title;
		li.querySelector('[data-item="edit"]').value = item.title;
		return li;
	},

	render() {
		var number = Items.all().length;
		Main.$.setFilter(Main.filter);
		Main.$.list.replaceChildren(...Items.all(Main.filter).map((item) => Main.createItem(item)));
		Main.$.displayMain(number);
		Main.$.displayFooter(number);
		Main.$.displayClear(Items.hasCompleted());
		Main.$.toggleAll.checked = Items.isAllCompleted();
		Main.$.displayNumber(Items.all("active").length);
	},
};

Main.init();
