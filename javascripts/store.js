export var ItemStore = class extends EventTarget {
	constructor(storageKey) {
		super();
		this.storageKey = storageKey;
		this.getStorage();

		window.addEventListener(
			"storage",
			() => {
				this.getStorage();
				this.save();
			},
			false
		);

		this.get = id => this.items.find(item => item.id === id);
		this.isAllCompleted = () => this.items.every(item => item.completed);
		this.hasCompleted = () => this.items.some(item => item.completed);
		this.all = filter =>
			filter === "active"
				? this.items.filter((item) => !item.completed)
				: filter === "completed"
				? this.items.filter((item) => item.completed)
				: this.items;
	}

	getStorage() {
		this.items = JSON.parse(window.localStorage.getItem(this.storageKey) || "[]");
	}

	create(item) {
		this.items.push({
			completed: false,
			title: item.title,
			id: window.crypto.randomUUID()
		});
		this.save();
	}

	save() {
		window.localStorage.setItem(
			this.storageKey,
			JSON.stringify(this.items)
		);

		this.dispatchEvent(new CustomEvent("save"));
	}

	toggle({id}) {
		this.items = this.items.map((item) =>
			item.id === id ? { ...item, completed: !item.completed } : item
		);
		this.save();
	}

	destroy({id}) {
		this.items = this.items.filter((item) => item.id !== id);
		this.save();
	}

	clearCompleted() {
		this.items = this.items.filter((item) => !item.completed);
		this.save();
	}

	toggleAll() {
		var completed = !this.hasCompleted() || !this.isAllCompleted();
		this.items = this.items.map((item) => ({ ...item, completed }));
		this.save();
	}

	update(item) {
		this.items = this.items.map((t) => (t.id === item.id ? item : t));
		this.save();
	}
};
