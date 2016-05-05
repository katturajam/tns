//third party plugin
import observable = require("data/observable");
import { Label } from "ui/label";
import { FormattedString } from "text/formatted-string";
import { Span } from "text/span"
import { Color } from "color";

var Parser = require("simple-text-parser");
var parser = new Parser();

export class ParseHelper extends observable.Observable {
        public static structure: Array<any> = [];
        private  _content: string;
        private _linkColor: string = '#BB1919';
        constructor(content: string) {
            this._content = content;
            ParseHelper._addParseRule();
        }
        private static _addParseRule() {
                // Define a rule using a regular expression 
                parser.addRule(/(\n|\r\n)+/m, function(tag, clean_tag) {
                      return { type: "newline", text: null, tag: clean_tag }; 
                });

                parser.addRule(/\www.[\S]+/m, function(tag, clean_tag) {
                        var text = tag.substr(1);   
                        return { type: "href", text: text, tag: clean_tag };
                });
        }

        public loadText(content: string) {
             let trimmedContent = content.trim();
             this._content = "\r\n" + trimmedContent;
             //ParseHelper._addParseRule();
        }

        public get content() {
            return this._content;
        }
        
        public set linkColor(color: string) {
            this._linkColor = color;
        }
                
        public get linkColor() {
            return this._linkColor;
        }

        public getRender() {
            return parser.render(this._content);
        }

        public getParseToTree() {
            return parser.toTree(this._content);
        }

        public doParse() {
            let dataArray: Array<any> = this.getParseToTree();
           
            dataArray.forEach(function(object, i: number) {       
                let structureTop = ParseHelper.structure[ParseHelper.structure.length - 1]; 
                //object.text = object.text.trim();
                switch (object.type) {
                    case "text":
                            if(object.text.trim() =="") return;

                            if(structureTop instanceof Label) {
                                let span = new Span();
                                span.text = object.text;
                                (<Label>structureTop).formattedText.spans.push(span);
                                ParseHelper.structure[ParseHelper.structure.length - 1] = structureTop; 
                            }
                            break;
                    case "newline":
                            let paragraph = new Label();
                            paragraph.textWrap = true;
                            paragraph.cssClass = "paragraph";
                            paragraph.formattedText = new FormattedString();
                            ParseHelper.structure.push(paragraph);
                            break;
                    case "href":
                            if(structureTop instanceof Label) {
                                var linkStartPosition = (<Label>structureTop).formattedText.toString().length;
                                let span = new Span();
                                span.text = object.text;
                                span.underline = 1;
                                span.foregroundColor = new Color("#BB1919");
                                (<Label>structureTop).formattedText.spans.push(span);

                                if(!(<Label>structureTop).hasOwnProperty('hrefObj')) {
                                     (<Label>structureTop).hrefObj = [];
                                }

                                var urlObj = {
                                      start: linkStartPosition,
                                      length: object.text.toString().length,
                                      url: object.text
                                };
                                (<Label>structureTop).hrefObj.push(urlObj);                        
                                ParseHelper.structure[ParseHelper.structure.length - 1] = structureTop;
                            }
                            break;
                    default:
                            console.log("UNKNOW TAG: " + object.type);
                            break;
                }
            });
            //return structured ui component
            return ParseHelper.structure;
        }
}