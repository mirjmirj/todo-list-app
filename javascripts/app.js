import { ItemStore } from "./store.js";
import { assign, getURL } from "./utilities.js";

var Items = new ItemStore("items");

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
		},

		setFilter(filter) {
			document.querySelectorAll(`[data-item="filters"] a`).forEach((element) => {
				if (element.matches(`[href="#/${filter}"]`)) {
					element.classList.add("selected");
				} else {
					element.classList.remove("selected");
				}
			});
		},

		displayNumber(number) {
      let renderedHTML = `<strong>${number} item</strong>${number === 1 ? "" : "s"} left`;

      document.querySelector('[data-item="count"]').replaceChildren();
      document.querySelector('[data-item="count"]').insertAdjacentHTML('afterbegin', renderedHTML);
		},
	},

	init() {
		Items.addEventListener("save", Main.render);
		Main.filter = getURL();

		window.addEventListener("hashchange", () => {
			Main.filter = getURL();
			Main.render();
		});

		Main.$.input.addEventListener("keyup", (e) => {
			if (e.key === "Enter" && e.target.value.length) {
				Items.create({
					completed: false,
					title: e.target.value,
					id: window.crypto.randomUUID()
				});
				Main.$.input.value = "";
			}
		});

		Main.$.clear.addEventListener("click", (e) => {
			Items.clearCompleted();
		});

		Main.$.toggleAll.addEventListener("click", (e) => {
			Items.toggleAll();
		});

		Main.bindItemEvents();
		Main.render();
	},

	itemEvent(event, selector, handler) {
		assign(Main.$.list, selector, event, (e) => {
			let $el = e.target.closest("[data-id]");
			handler(Items.get($el.dataset.id), $el, e);
		});
	},

	bindItemEvents() {
		Main.itemEvent("click", '[data-item="destroy"]', (item) => Items.destroy(item));
		Main.itemEvent("click", '[data-item="toggle"]', (item) => Items.toggle(item));

		Main.itemEvent("dblclick", '[data-item="label"]', (_, $li) => {
			$li.classList.add("editing");
			$li.querySelector('[data-item="edit"]').focus();
		});
    
		Main.itemEvent("keyup", '[data-item="edit"]', (item, $li, e) => {
			let $input = $li.querySelector('[data-item="edit"]');

			if (e.key === "Enter" && $input.value) {
				$li.classList.remove("editing");
				Items.update({ ...item, title: $input.value });
			}

			if (e.key === "Escape") {
				document.activeElement.blur();
			}
		});

		Main.itemEvent("focusout", '[data-item="edit"]', (item, $li, e) => {
			if ($li.classList.contains("editing")) {
				Main.render();
			}
		});
	},

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
