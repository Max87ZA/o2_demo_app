Alloy.Globals.height = Ti.Platform.displayCaps.platformHeight;
Alloy.Globals.width = Ti.Platform.displayCaps.platformWidth;
require("alloyXL");
Alloy.Globals.events = _.clone(Backbone.Events);