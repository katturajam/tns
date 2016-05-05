import {EventData} from "data/observable"; 
import {Page} from "ui/page"; 
import frameModule = require("ui/frame");
var topmost = frameModule.topmost;
// Event handler for Page "navigatingTo" event attached in main-page.xml
export function navigatingTo(args: EventData) {
    let page:Page = <Page> args.object;
  
}

export function myTap(args: gestures.GestureEventData) {
    topmost().navigate("main-page");
}