var ScrollBanners = {};
ScrollBanners.lastScrollVal = 0;
ScrollBanners.getScrollTop = function() {
    var st = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
    return Math.max(st, document.documentElement.scrollTop);
}
ScrollBanners.getDocHeight = function() {
    var D = document;
    return Math.max(
                    Math.max(D.body.scrollHeight, D.documentElement.scrollHeight),
                    Math.max(D.body.offsetHeight, D.documentElement.offsetHeight),
                    Math.max(D.body.clientHeight, D.documentElement.clientHeight)
                 );
}
$(window).scroll(function() {
    //if (ScrollBanners.getScrollTop() > jQuery("#Table1").position().top + 180 && ScrollBanners.getScrollTop() < jQuery(".footerLogo").position().top - 690) {
    if (ScrollBanners.getScrollTop() > (jQuery("#upperAnchor").position().top + jQuery("#LatestNewPortfolio2").height() - 50) && ScrollBanners.getScrollTop() < jQuery(".footerLogo").position().top - 690) {
        jQuery("#slideme2").stop().animate({ top: String(ScrollBanners.getScrollTop() - 200) }, 150);
        jQuery("#slideme1").stop().animate({ top: String(ScrollBanners.getScrollTop() - 200) }, 150);
    }
    else if (ScrollBanners.getScrollTop() < jQuery(".footerLogo").position().top - 690) {
        jQuery("#slideme2").stop().animate({ top: (jQuery("#upperAnchor").position().top) }, 150);
        var newTop = String(jQuery("#upperAnchor").position().top + jQuery("#leagalNewsWrapper").height()
                    - eval(jQuery("#leagalNewsWrapper").css("padding-top").replace("px", ""))
                    - eval(jQuery("#leagalNewsWrapper").css("padding-bottom").replace("px", "")) - 242);
        jQuery("#slideme1").stop().animate({ top: newTop }, 150);
    }
});
jQuery(function() {
    //jQuery("#slideme2").css("top", String(jQuery("#upperAnchor").position().top));
    var newTop = String(jQuery("#upperAnchor").position().top + jQuery("#LatestNewPortfolio2").height()
                - eval(jQuery("#LatestNewPortfolio2").css("padding-top").replace("px", ""))
                - eval(jQuery("#LatestNewPortfolio2").css("padding-bottom").replace("px", "")) - 242);
    jQuery("#slideme2").css("top", String(newTop) + "px");
    newTop = String(jQuery("#upperAnchor").position().top + jQuery("#leagalNewsWrapper").height()
                - eval(jQuery("#leagalNewsWrapper").css("padding-top").replace("px", ""))
                - eval(jQuery("#leagalNewsWrapper").css("padding-bottom").replace("px", "")) - 242);
    jQuery("#slideme1").css("top", String(newTop) + "px");
});