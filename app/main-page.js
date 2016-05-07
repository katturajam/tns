"use strict";
var stack_layout_1 = require("ui/layouts/stack-layout");
var label_1 = require("ui/label");
var gestures = require("ui/gestures");
var gestureHelper = require("./libs/gesture-helper/gesture-helper");
var text_parse_helper_1 = require("./libs/parse-helper/text-parse-helper");
var frameModule = require("ui/frame");
var text = "\r\n The scene will now shift to WWW.demo.org obtaining enough instruments of ratification HTTP://WWW.google.com to bring the agreement into force before 2020, the first year of HTTPS://tvsi.com its proposed implementation. \r\n  The agreement will enter into force with the ratification of at least 55 countries, whose aggregate greenhouse gas (GHG) emissions constitute at least 55 per cent of global emissions.   \r\n One will need to watch what happens in the United States after the forthcoming presidential elections. \r\n There is a real risk that the Kyoto Protocol drama may be repeated with the U.S. Congress rejecting an agreement that the U.S. administration has signed. Were this to happen, other countries may withhold ratification since the U.S. is the second largest emitter of GHGs after China. \r\n India should not be in a hurry to ratify the Agreement until there is clarity on the U.S. position.";
var topmost = frameModule.topmost;
// Event handler for Page "navigatingTo" event attached in main-page.xml
function navigatingTo(args) {
    var page = args.object;
    var scrollview = page.getViewById("sv");
    var stacklayout = new stack_layout_1.StackLayout();
    stacklayout.cssClass = "stackLayout";
    //initialize text parser
    var TextParser = new text_parse_helper_1.ParseHelper();
    TextParser.loadText(text);
    var viewComponent = TextParser.doParse();
    viewComponent.forEach(function (object, i) {
        if (viewComponent[i] instanceof label_1.Label) {
            viewComponent[i].on(gestures.GestureTypes.tap, myTap);
            stacklayout.addChild(viewComponent[i]);
        }
    });
    scrollview.content = stacklayout;
}
exports.navigatingTo = navigatingTo;
function myTap(args) {
    if (args.object.hasOwnProperty('hrefObj')) {
        var urls_1 = args.object.hrefObj;
        var charIndex_1 = gestureHelper.getCharIndexAtTouchPoint(args);
        urls_1.forEach(function (object, i) {
            var urlObj = urls_1[i];
            if (charIndex_1 >= urlObj.start && charIndex_1 < urlObj.start + urlObj.length) {
                console.log("Success: " + urlObj.url);
                topmost().goBack();
            }
            else {
            }
        });
    }
}
exports.myTap = myTap;
