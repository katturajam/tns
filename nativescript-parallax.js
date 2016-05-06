"use strict";
var app = require('application');
var Platform = require('platform');
var scroll_view_1 = require('ui/scroll-view');
var grid_layout_1 = require('ui/layouts/grid-layout');
var absolute_layout_1 = require('ui/layouts/absolute-layout');
var view_1 = require('ui/core/view');
var stack_layout_1 = require('ui/layouts/stack-layout');
var utilities_1 = require('./utilities');
var Header = (function (_super) {
    __extends(Header, _super);
    function Header() {
        _super.apply(this, arguments);
    }
    return Header;
}(stack_layout_1.StackLayout));
exports.Header = Header;
var Anchored = (function (_super) {
    __extends(Anchored, _super);
    function Anchored() {
        _super.call(this);
        this.dropShadow = false;
    }
    Object.defineProperty(Anchored.prototype, "dropShadow", {
        get: function () {
            return this._dropShadow;
        },
        set: function (value) {
            this._dropShadow = value;
        },
        enumerable: true,
        configurable: true
    });
    return Anchored;
}(stack_layout_1.StackLayout));
exports.Anchored = Anchored;
var Content = (function (_super) {
    __extends(Content, _super);
    function Content() {
        _super.apply(this, arguments);
    }
    return Content;
}(stack_layout_1.StackLayout));
exports.Content = Content;
var ParallaxView = (function (_super) {
    __extends(ParallaxView, _super);
    function ParallaxView() {
        var _this = this;
        _super.call(this);
        this._addChildFromBuilder = function (name, value) {
            if (value instanceof view_1.View) {
                _this._childLayouts.push(value);
            }
        };
        this._childLayouts = [];
        var headerView;
        var contentView;
        var scrollView = new scroll_view_1.ScrollView();
        var viewsToFade;
        var maxTopViewHeight;
        var controlsToFade;
        var anchoredRow = new absolute_layout_1.AbsoluteLayout();
        var row = new grid_layout_1.ItemSpec(2, grid_layout_1.GridUnitType.star);
        var column = new grid_layout_1.ItemSpec(1, grid_layout_1.GridUnitType.star);
        var invalidSetup = false;
        this._minimumHeights = utilities_1.ParallaxUtilities.getMinimumHeights();
        if (this.bounce == null) {
            this.bounce = false; //disable bounce by default.
        }
        //must set the vertical alignmnet or else there is issues with margin-top of 0 being the middle of the screen.
        this.verticalAlignment = 'top';
        scrollView.verticalAlignment = 'top';
        anchoredRow.verticalAlignment = 'top';
        this._includesAnchored = false;
        this._topOpacity = 1;
        this._loaded = false;
        this.on(grid_layout_1.GridLayout.loadedEvent, function (data) {
            //prevents re adding views on resume in android.
            if (!_this._loaded) {
                _this._loaded = true;
                _this.addRow(row);
                _this.addColumn(column);
                _this.addChild(scrollView);
                _this.addChild(anchoredRow);
                grid_layout_1.GridLayout.setRow(scrollView, 1);
                grid_layout_1.GridLayout.setRow(anchoredRow, 0);
                grid_layout_1.GridLayout.setColumn(scrollView, 1);
                grid_layout_1.GridLayout.setColumn(anchoredRow, 0);
                //creates a new stack layout to wrap the content inside of the plugin.
                var wrapperStackLayout_1 = new stack_layout_1.StackLayout();
                scrollView.content = wrapperStackLayout_1;
                _this._childLayouts.forEach(function (element) {
                    if (element instanceof Header) {
                        wrapperStackLayout_1.addChild(element);
                        headerView = element;
                    }
                });
                _this._childLayouts.forEach(function (element) {
                    if (element instanceof Content) {
                        wrapperStackLayout_1.addChild(element);
                        contentView = element;
                    }
                });
                _this._childLayouts.forEach(function (element) {
                    if (element instanceof Anchored) {
                        anchoredRow.addChild(element);
                        if (element.dropShadow) {
                            anchoredRow.height = element.height;
                            anchoredRow.addChild(utilities_1.ParallaxUtilities.addDropShadow(element.height, element.width));
                        }
                        else {
                            anchoredRow.height = element.height;
                        }
                        element.verticalAlignment = 'top';
                        _this._includesAnchored = true;
                    }
                });
                if (headerView == null || contentView == null) {
                    utilities_1.ParallaxUtilities.displayDevWarning(_this, 'Parallax ScrollView Setup Invalid. You must have Header and Content tags', headerView, contentView, contentView);
                    return;
                }
                if (isNaN(headerView.height)) {
                    utilities_1.ParallaxUtilities.displayDevWarning(_this, 'Header MUST have a height set.', headerView, anchoredRow, contentView);
                    return;
                }
                if (_this._includesAnchored && isNaN(anchoredRow.height)) {
                    utilities_1.ParallaxUtilities.displayDevWarning(_this, 'Anchor MUST have a height set.', anchoredRow, headerView, contentView);
                    return;
                }
                maxTopViewHeight = headerView.height;
                if (_this._includesAnchored) {
                    anchoredRow.marginTop = maxTopViewHeight;
                    if (app.android) {
                        anchoredRow.marginTop = anchoredRow.marginTop - 5; // get rid of white line that happens on android
                    }
                    //pushes content down a to compensate for anchor.
                    contentView.marginTop = anchoredRow.height;
                }
                //disables bounce/overscroll defaulted to false
                if (_this.bounce === false) {
                    if (app.ios) {
                        scrollView.ios.bounces = false;
                    }
                    else if (app.android) {
                        scrollView.android.setOverScrollMode(2);
                    }
                }
                viewsToFade = [];
                //scrollView = <ScrollView>this;
                if (_this.controlsToFade == null) {
                    controlsToFade = [];
                }
                else {
                    controlsToFade = _this.controlsToFade.split(',');
                }
                controlsToFade.forEach(function (id) {
                    var newView = headerView.getViewById(id);
                    if (newView != null) {
                        viewsToFade.push(newView);
                    }
                });
                var prevOffset_1 = -10;
                //set the min height on load
                utilities_1.ParallaxUtilities.setMinimumHeight(contentView, anchoredRow, Platform.screen.mainScreen.heightDIPs, _this._includesAnchored);
                app.on(app.orientationChangedEvent, function (args) {
                    //sets the content view to have a min height so that scroll always allows full coverage of header, with or without anchor.
                    utilities_1.ParallaxUtilities.setMinimumHeight(contentView, anchoredRow, _this._minimumHeights[args.newValue], _this._includesAnchored);
                });
                scrollView.on(scroll_view_1.ScrollView.scrollEvent, function (args) {
                    if (_this._includesAnchored) {
                        anchoredRow.marginTop = utilities_1.ParallaxUtilities.getAnchoredTopHeight(maxTopViewHeight, scrollView.verticalOffset);
                    }
                    headerView.height = utilities_1.ParallaxUtilities.getTopViewHeight(maxTopViewHeight, scrollView.verticalOffset);
                    //fades in and out label in topView
                    utilities_1.ParallaxUtilities.fadeViews(maxTopViewHeight, scrollView.verticalOffset, viewsToFade, _this._topOpacity);
                    //leaving in the up/down detection as it may be handy in the future.
                    if (prevOffset_1 <= scrollView.verticalOffset) {
                    }
                    else {
                    }
                    prevOffset_1 = scrollView.verticalOffset;
                });
            }
        });
    }
    Object.defineProperty(ParallaxView.prototype, "bounce", {
        get: function () {
            return this._bounce;
        },
        set: function (value) {
            this._bounce = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParallaxView.prototype, "controlsToFade", {
        get: function () {
            return this._controlsToFade;
        },
        set: function (value) {
            this._controlsToFade = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParallaxView.prototype, "android", {
        get: function () {
            return;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ParallaxView.prototype, "ios", {
        get: function () {
            return;
        },
        enumerable: true,
        configurable: true
    });
    return ParallaxView;
}(grid_layout_1.GridLayout));
exports.ParallaxView = ParallaxView;
//# sourceMappingURL=nativescript-parallax.js.map