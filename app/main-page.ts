import {EventData} from "data/observable"; 
import {Page} from "ui/page"; 
import {ScrollView} from "ui/scroll-view"; 
import {StackLayout} from "ui/layouts/stack-layout";
import { Label } from  "ui/label";
import gestures = require("ui/gestures");
import gestureHelper = require("./libs/gesture-helper/gesture-helper");
import {ParseHelper} from "./libs/parse-helper/text-parse-helper"; 
import frameModule = require("ui/frame");

var text = "\r\n The scene will now shift to WWW.demo.org obtaining enough instruments of ratification HTTP://WWW.google.com to bring the agreement into force before 2020, the first year of HTTPS://tvsi.com its proposed implementation. \r\n  The agreement will enter into force with the ratification of at least 55 countries, whose aggregate greenhouse gas (GHG) emissions constitute at least 55 per cent of global emissions.   \r\n One will need to watch what happens in the United States after the forthcoming presidential elections. \r\n There is a real risk that the Kyoto Protocol drama may be repeated with the U.S. Congress rejecting an agreement that the U.S. administration has signed. Were this to happen, other countries may withhold ratification since the U.S. is the second largest emitter of GHGs after China. \r\n India should not be in a hurry to ratify the Agreement until there is clarity on the U.S. position.";
var topmost = frameModule.topmost;
// Event handler for Page "navigatingTo" event attached in main-page.xml
export function navigatingTo(args: EventData) {
    let page:Page = <Page> args.object;
    let scrollview:ScrollView= <ScrollView> page.getViewById("sv");
    let stacklayout:StackLayout = new StackLayout();
    stacklayout.cssClass = "stackLayout";
    //initialize text parser
    let TextParser = new ParseHelper();
    TextParser.loadText(text); 
    let viewComponent: Array<any> = TextParser.doParse();      
    viewComponent.forEach(function(object,i){
          if(viewComponent[i] instanceof Label) {    
              <Label>viewComponent[i].on(gestures.GestureTypes.tap, myTap);       
              stacklayout.addChild(<Label>viewComponent[i]);
          }
    });
   
    scrollview.content = stacklayout;
}

export function myTap(args: gestures.GestureEventData) {
    if((<Label>args.object).hasOwnProperty('hrefObj')) {
       let urls: Array<any> = (<Label>args.object).hrefObj;   
       let charIndex = gestureHelper.getCharIndexAtTouchPoint(args);
        urls.forEach(function(object, i) {
            let urlObj = urls[i];
            if (charIndex >= urlObj.start && charIndex < urlObj.start + urlObj.length ) {
                console.log("Success: " + urlObj.url);
                topmost().goBack();
                //console.log("\r\nUrl is matched: " + urlObj.url + " , Tap character length is: " + charIndex  + "\r\nUrl starting position is: " + urlObj.start + " + Url length is: " + urlObj.length + " = " + (urlObj.start + urlObj.length)); 
            } else {
                //console.log("\r\nUrl is no matched: " + urlObj.url + ", Tap character length is: " + charIndex  +  "\r\nUrl starting position is: " + urlObj.start + " + Url length is: " + urlObj.length + " = " + (urlObj.start + urlObj.length)); 
            }
        });    
       
    }
}