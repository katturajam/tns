"use strict";
var app = require('application');
var Platform = require('platform');
var label_1 = require('ui/label');
var stack_layout_1 = require('ui/layouts/stack-layout');
var color_1 = require('color');
var ParallaxUtilities = (function () {
    function ParallaxUtilities() {
    }
    ParallaxUtilities.setMinimumHeight = function (contentView, anchoredRow, minHeight, includesAnchored) {
        if (includesAnchored) {
            minHeight = minHeight - (anchoredRow.height * 0.9); //0.9 is to give it a little bit extra space.
        }
        contentView.minHeight = minHeight;
    };
    ParallaxUtilities.getMinimumHeights = function () {
        var height1 = Platform.screen.mainScreen.heightDIPs;
        var height2 = Platform.screen.mainScreen.widthDIPs;
        //if the first hieght is lager than the second hiehgt it's the portrait views min hieght.
        if (height1 > height2) {
            return {
                portrait: height1,
                landscape: height2
            };
        }
        else {
            return {
                portrait: height2,
                landscape: height1
            };
        }
    };
    ParallaxUtilities.addDropShadow = function (marginTop, width) {
        var wrapper = new stack_layout_1.StackLayout();
        wrapper.width = width;
        wrapper.height = 3;
        wrapper.marginTop = marginTop;
        wrapper.addChild(this.shadowView(0.4, width));
        wrapper.addChild(this.shadowView(0.2, width));
        wrapper.addChild(this.shadowView(0.05, width));
        return wrapper;
    };
    ParallaxUtilities.shadowView = function (opacity, width) {
        var shadowRow = new stack_layout_1.StackLayout();
        shadowRow.backgroundColor = new color_1.Color('black');
        shadowRow.opacity = opacity;
        shadowRow.height = 1;
        return shadowRow;
    };
    ParallaxUtilities.fadeViews = function (topHeight, verticalOffset, viewsToFade, topOpacity) {
        if (verticalOffset < topHeight) {
            topOpacity = parseFloat((1 - (verticalOffset * 0.01)).toString());
            if (topOpacity > 0 && topOpacity <= 1) {
                //fade each control
                viewsToFade.forEach(function (view) {
                    view.opacity = topOpacity;
                });
            }
        }
    };
    ParallaxUtilities.getAnchoredTopHeight = function (topHeight, verticalOffset) {
        var marginTop;
        if (verticalOffset <= topHeight) {
            marginTop = topHeight - (verticalOffset * 2);
            if (marginTop > topHeight) {
                marginTop = topHeight;
            }
            if (app.android) {
                marginTop = marginTop - 5; // get rid of white line that happens on android
            }
        }
        else {
            marginTop = 0;
        }
        if (marginTop < 0) {
            marginTop = 0;
        }
        return marginTop;
    };
    //calcutes the top views height  using the scrollview's verticalOffset
    ParallaxUtilities.getTopViewHeight = function (topHeight, verticalOffset) {
        if ((topHeight - verticalOffset) >= 0) {
            return topHeight - verticalOffset;
        }
        else {
            return 0;
        }
    };
    ParallaxUtilities.displayDevWarning = function (parent, message) {
        var viewsToCollapse = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            viewsToCollapse[_i - 2] = arguments[_i];
        }
        var warningText = new label_1.Label();
        warningText.text = message;
        warningText.color = new color_1.Color('red');
        warningText.textWrap = true;
        warningText.marginTop = 50;
        parent.addChild(warningText);
        viewsToCollapse.forEach(function (view) {
            if (view != null) {
                view.visibility = 'collapse';
            }
        });
    };
    return ParallaxUtilities;
}());
exports.ParallaxUtilities = ParallaxUtilities;
//# sourceMappingURL=utilities.js.map