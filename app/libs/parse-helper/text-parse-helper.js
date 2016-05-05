"use strict";
//third party plugin
var observable = require("data/observable");
var label_1 = require("ui/label");
var formatted_string_1 = require("text/formatted-string");
var span_1 = require("text/span");
var color_1 = require("color");
var Parser = require("simple-text-parser");
var parser = new Parser();
var ParseHelper = (function (_super) {
    __extends(ParseHelper, _super);
    function ParseHelper(content) {
        this._linkColor = '#BB1919';
        this._content = content;
        ParseHelper._addParseRule();
    }
    ParseHelper._addParseRule = function () {
        // Define a rule using a regular expression 
        parser.addRule(/(\n|\r\n)+/m, function (tag, clean_tag) {
            return { type: "newline", text: null, tag: clean_tag };
        });
        parser.addRule(/\www.[\S]+/m, function (tag, clean_tag) {
            var text = tag.substr(1);
            return { type: "href", text: text, tag: clean_tag };
        });
    };
    ParseHelper.prototype.loadText = function (content) {
        var trimmedContent = content.trim();
        this._content = "\r\n" + trimmedContent;
        //ParseHelper._addParseRule();
    };
    Object.defineProperty(ParseHelper.prototype, "content", {
        get: function () {
            return this._content;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParseHelper.prototype, "linkColor", {
        get: function () {
            return this._linkColor;
        },
        set: function (color) {
            this._linkColor = color;
        },
        enumerable: true,
        configurable: true
    });
    ParseHelper.prototype.getRender = function () {
        return parser.render(this._content);
    };
    ParseHelper.prototype.getParseToTree = function () {
        return parser.toTree(this._content);
    };
    ParseHelper.prototype.doParse = function () {
        //public static structure: Array<any> = [];
        var structure = [];
        var dataArray = this.getParseToTree();
        dataArray.forEach(function (object, i) {
            var structureTop = structure[structure.length - 1];
            //object.text = object.text.trim();
            switch (object.type) {
                case "text":
                    if (object.text.trim() == "")
                        return;
                    if (structureTop instanceof label_1.Label) {
                        var span = new span_1.Span();
                        span.text = object.text;
                        structureTop.formattedText.spans.push(span);
                        structure[structure.length - 1] = structureTop;
                    }
                    break;
                case "newline":
                    var paragraph = new label_1.Label();
                    paragraph.textWrap = true;
                    paragraph.cssClass = "paragraph";
                    paragraph.formattedText = new formatted_string_1.FormattedString();
                    structure.push(paragraph);
                    break;
                case "href":
                    if (structureTop instanceof label_1.Label) {
                        var linkStartPosition = structureTop.formattedText.toString().length;
                        var span = new span_1.Span();
                        span.text = object.text;
                        span.underline = 1;
                        span.foregroundColor = new color_1.Color("#BB1919");
                        structureTop.formattedText.spans.push(span);
                        if (!structureTop.hasOwnProperty('hrefObj')) {
                            structureTop.hrefObj = [];
                        }
                        var urlObj = {
                            start: linkStartPosition,
                            length: object.text.toString().length,
                            url: object.text
                        };
                        structureTop.hrefObj.push(urlObj);
                        structure[structure.length - 1] = structureTop;
                    }
                    break;
                default:
                    console.log("UNKNOW TAG: " + object.type);
                    break;
            }
        });
        //return structured ui component
        return structure;
    };
    return ParseHelper;
}(observable.Observable));
exports.ParseHelper = ParseHelper;
