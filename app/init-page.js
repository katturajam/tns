"use strict";
var frameModule = require("ui/frame");
var topmost = frameModule.topmost;
// Event handler for Page "navigatingTo" event attached in main-page.xml
function navigatingTo(args) {
    var page = args.object;
}
exports.navigatingTo = navigatingTo;
function myTap(args) {
    topmost().navigate("main-page");
}
exports.myTap = myTap;
