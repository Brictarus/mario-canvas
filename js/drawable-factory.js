var DrawableFactory = {
	createFromName: function(name, options) {
		options = options || {};
		options.dbgColor = getTileColor(name);
		var DrawableClass;
		switch(name) {
			// if (k == "mario" || k == "ballmonster" || k == "greenturtle") {
			case "ballmonster":
			case "greenturtle":
				DrawableClass = Entity;
				break;
			case "mario":
				DrawableClass = Hero;
				break;
			default:
				DrawableClass = Ground;
		}
		return new DrawableClass(options);
	}
};