/* Notes:
 * - History management is currently done using window.location.hash.  This could easily be changed to use Push State instead.
 * - jQuery dependency for now. This could also be easily removed.
 */

function PageSlider(container) {

    var container = container,
        currentPage,
        stateHistory = [];

    // Use this function if you want PageSlider to automatically determine the sliding direction based on the state history
    this.slidePage = function(page, modeIn, modeReturnIn, modeReturnOut, modeOut) {

        var l = stateHistory.length,
            state = window.location.hash;

        var _modeReturnIn = modeReturnIn || "fadeInLeft";
        var _modeIn = modeIn || "fadeInRight";
        var _modeOut = modeOut || "fadeOutLeft";
        var _modeReturnOut = modeReturnOut || "fadeOutRight";

        if (l === 0) {
            stateHistory.push(state);
            this.slidePageFrom(page, _modeIn);
            return;
        }
        if (state === stateHistory[l-2]) {
            stateHistory.pop();
            this.slidePageFrom(page, _modeReturnOut, _modeReturnIn);
        } else {
            stateHistory.push(state);
            this.slidePageFrom(page, _modeOut, _modeIn);
        }

    };

    // Use this function directly if you want to control the sliding direction outside PageSlider
    this.slidePageFrom = function(page, animationOut, animationIn) {

        container.append(page);

        if(animationIn === undefined || animationIn === null) {
            animationIn = "fadeInRight";
        }

        if (!currentPage || !animationOut) {
            window.console.log("no page");
            page.attr("class", "page center");
            currentPage = page;
            return;
        }

        // Position the page at the starting position of the animation
        page.attr("class", "page " + animationOut);

        currentPage.one('webkitTransitionEnd', function(e) {
            var mt = $(e.target);
            // If the user presses back while the animation is in progress, this prevents it from breaking since the app changes classes before 'webkitTransitionEnd'
            if (!(mt.hasClass("center"))){
                mt.remove();
            };
        });

        currentPage.one('webkitAnimationEnd', function(e) {
            var mt = $(e.target);
            // If the user presses back while the animation is in progress, this prevents it from breaking since the app changes classes before 'webkitTransitionEnd'
            if (!(mt.hasClass("center"))){
                mt.remove();
            };
        });

        // Force reflow. More information here: http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/
        container[0].offsetWidth;

        // Position the new page and the current page at the ending position of their animation with a transition class indicating the duration of the animation
        page.attr("class", "page transition animated " + animationIn );
        currentPage.attr("class", "page transition animated " + (animationOut === "left" ? "left" : animationOut));
        currentPage = page;
    };

}
