
/* ============== DFP for Super Adv tools ============== */

// Function for creating background image for Tapet
// Function created by Total Media for DFP Tapet
if (typeof (tmo_util) != "object") { tmo_util = {} }
if (typeof (tmo_data) != "object") { tmo_data = {} }
tmo_util.startBackgroundImage = function (DC_BackgroundImageUrl, DC_ContentWidth, DC_BannerWidth, DC_BannerHeight, DC_TopStart, DC_ContentMargin, DC_Toppadding) {
    window.DC_BackgroundImageUrl = DC_BackgroundImageUrl
    tmo_data.ContentWidth = DC_ContentWidth + DC_ContentMargin * 2;
    tmo_data.BannerWidth = DC_BannerWidth;
    tmo_data.BannerHeight = DC_BannerHeight;
    tmo_data.TopStart = DC_TopStart;
    tmo_data.TopPadding = DC_Toppadding;
    window.DC_callback = function (e) {
        var ev = e || window.event;
        var IE = document.all ? true : false
        var CW = document.body.clientWidth
        if (IE) { tempX = ev.clientX + document.body.scrollLeft; tempY = ev.clientY + document.body.scrollTop; }
        else { tempX = e.pageX; tempY = e.pageY }
        var LeftStart = (CW - tmo_data.ContentWidth) / 2;
        var RightStart = (CW + tmo_data.ContentWidth) / 2;
        var LeftEnd = (CW - tmo_data.ContentWidth) / 2 - tmo_data.BannerWidth;
        var RightEnd = (CW + tmo_data.ContentWidth) / 2 + tmo_data.BannerWidth;
        if (LeftEnd < 0) { LeftEnd = 0 }
        if (IE) { if (RightEnd > (CW - 17)) { RightEnd = CW - 17 } }
        else { if (RightEnd > CW) { RightEnd = CW } }
        if (tmo_data.BackgroundStat == "on") {
            if (((tempX > LeftEnd && tempX < LeftStart) || (tempX > RightStart && tempX < RightEnd)) && (tempY > tmo_data.TopStart && tempY < tmo_data.BannerHeight)) { adWindow = window.open(DC_BackgroundImageUrl, ''); }
            else if (tempY > tmo_data.TopStart && tempY <= tmo_data.TopPadding) { adWindow = window.open(DC_BackgroundImageUrl, ''); }
        }
    }
    window.DC_mousemove = function (e) {
        var ev = e || window.event;
        var IE = document.all ? true : false
        var CW = document.body.clientWidth
        if (IE) { tempX = ev.clientX + document.body.scrollLeft; tempY = ev.clientY + document.body.scrollTop }
        else { tempX = e.pageX; tempY = e.pageY }
        var LeftStart = (CW - tmo_data.ContentWidth) / 2;
        var RightStart = (CW + tmo_data.ContentWidth) / 2;
        var LeftEnd = (CW - tmo_data.ContentWidth) / 2 - tmo_data.BannerWidth;
        var RightEnd = (CW + tmo_data.ContentWidth) / 2 + tmo_data.BannerWidth;
        if (LeftEnd < 0) { LeftEnd = 0 }
        if (IE) { if (RightEnd > (CW - 17)) { RightEnd = CW - 17 } }
        else { if (RightEnd > CW) { RightEnd = CW } }
        if (tmo_data.BackgroundStat == "on") {
            if (((tempX > LeftEnd && tempX < LeftStart) || (tempX > RightStart && tempX < RightEnd)) && (tempY > tmo_data.TopStart && tempY < tmo_data.BannerHeight)) { document.body.style.cursor = 'pointer'; }
            else if (tempY > tmo_data.TopStart && tempY <= tmo_data.TopPadding) { document.body.style.cursor = 'pointer'; }
            else { document.body.style.cursor = 'auto'; }
        }
    }
    var IE = document.all ? true : false
    if (document.addEventListener && IE == false) { document.addEventListener("click", DC_callback, false); document.addEventListener("mousemove", DC_mousemove, false); }
    else { attachEvent("onclick", DC_callback); attachEvent("onmousemove", DC_callback); }
    if (IE) { document.onmousedown = DC_callback; document.onmousemove = DC_mousemove; }
    tmo_data.BackgroundStat = "on"
}


//== function will be called by DFP templates on click oneach premium tool close button
function closePremiumTool() {

    if (typeof PremiumDFPAd == 'undefined' || PremiumDFPAd == null) {
        return;
    }
    if (typeof googletag == 'undefined' || googletag == null) {
        return;
    }

    googletag.pubads().refresh([PremiumDFPAd]);
}
	




/* ========== Popunder ===============*/


if (typeof tmo_util != "object") {
    tmo_util = {};
}
if (typeof tmo_prop != "object") {
    tmo_prop = {};
}
tmo_prop.IE = (navigator.userAgent.indexOf("MSIE") >= 0) ? true : false;
if (navigator.userAgent.indexOf(".NET4.0E; .NET4.0C;") >= 0) { tmo_prop.IE = true }
tmo_util.stlPopUnder = function (adcode, specification, Targetwindow, pop, ife, Height, Width) {
    tmo_prop.TM_PopUnder = "off";
    tmo_prop.TM_PopUnderData = adcode
    tmo_prop.TM_PopUnderHeight = Height;
    tmo_prop.TM_PopUnderWidth = Width;
    tmo_prop.TM_Targetwindow = Targetwindow
    tmo_prop.TM_PopUnderSpecification = specification
    top.isPopDone_ = false;
    window.TM_openWin = function () {
        if (tmo_prop.TM_PopUnder == "off") {
            tmo_prop.TM_PopUnder = "on"
            myWindow = window.open('', tmo_prop.TM_Targetwindow, tmo_prop.TM_PopUnderSpecification);
            myWindow.document.write('<html><head><title>&nbsp;Advertisement</title></head><body marginheight=0 marginwidth=0 leftmargin=0 topmargin=0>' + tmo_prop.TM_PopUnderData + '</body></html>');
            if (!tmo_prop.IE) {
                myWindow.window.open('about:blank').close();
            }
            if (pop = "Pop-under") {
                myWindow.blur();
                window.focus();
            }
        }
    }
    if (!tmo_prop.IE) {
        document.addEventListener("click", window.TM_openWin, false);
    }
    if (!tmo_prop.IE) {
        document.addEventListener("mouseup", function () {
            if (top.isPopDone_)
                return;
            var rand = Math.random();
            var a = document.createElement("a");
            a.href = "data:text/html," + unescape('%3Cscript%3E') + "window.close();" + unescape('%3C/script%3E'),
            document.getElementsByTagName("body")[0].appendChild(a);
            var e = document.createEvent("MouseEvents");
            e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, true, false, false, true, 0, null);
            a.dispatchEvent(e);
            a.parentNode.removeChild(a);
            window.open("about:blank", "_tab" + rand.toString()).close();
            top.isPopDone_ = true;
        }, false);
    } else {
        setTimeout(window.TM_openWin, 250);
    }
}
var tm = {
    tm_pop: function (l, x) {
        var p = x.cap || 1;
        var k = x.wait || 4;
        var j = x.cookie || "__.tm";
        var y = x.width;
        var e = x.height;
        var x = "";
        var m = {
            tm_initializefun: function () {
                this.ua.tm_initializefun()
            },
            ua: {
                tm_initializefun: function () {
                    this.browser = this.tm_Stringsearchfun(this.list_browser) || "unknown";
                    this.version = this.tm_Versionsearchfun(navigator.userAgent) || this.tm_Versionsearchfun(navigator.appVersion) || "unknown";
                    this.os = this.tm_Stringsearchfun(this.list_os) || "unknown";
                    if (this.browser == "Chrome" || this.browser == "chrome") {
                        y = y || window.innerWidth;
                        e = e || window.innerHeight
                    } else if (this.browser == "Explorer" || this.browser == "explorer") {
                        y = y || window.innerWidth;
                        e = e || window.innerHeight
                    } else {
                        y = y || screen.width;
                        e = e || screen.height
                    }
                    x = "width=" + y + ",height=" + e + ",resizable=no,toolbar=no,location=no,directories=no,status=no,menubar=no,copyhistory=no,scrollbars=yes,top=0,left=0"
                },
                list_browser: [{
                    str: navigator.userAgent,
                    subStr: "Chrome",
                    id: "Chrome"
                }, {
                    str: navigator.userAgent,
                    subStr: "OmniWeb",
                    versionSearch: "OmniWeb/",
                    id: "OmniWeb"
                }, {
                    str: navigator.vendor,
                    subStr: "Apple",
                    id: "Safari",
                    versionSearch: "Version"
                }, {
                    prop: window.opera,
                    id: "Opera",
                    versionSearch: "Version"
                }, {
                    str: navigator.vendor,
                    subStr: "iCab",
                    id: "iCab"
                }, {
                    str: navigator.vendor,
                    subStr: "KDE",
                    id: "Konqueror"
                }, {
                    str: navigator.userAgent,
                    subStr: "Firefox",
                    id: "Firefox"
                }, {
                    str: navigator.vendor,
                    subStr: "Camino",
                    id: "Camino"
                }, {
                    str: navigator.userAgent,
                    subStr: "Netscape",
                    id: "Netscape"
                }, {
                    str: navigator.userAgent,
                    subStr: "MSIE",
                    id: "Explorer",
                    versionSearch: "MSIE"
                }, {
                    str: navigator.userAgent,
                    subStr: "Gecko",
                    id: "Mozilla",
                    versionSearch: "rv"
                }, {
                    str: navigator.userAgent,
                    subStr: "Mozilla",
                    id: "Netscape",
                    versionSearch: "Mozilla"
                }
                ],
                list_os: [{
                    str: navigator.platform,
                    subStr: "Win",
                    id: "Windows"
                }, {
                    str: navigator.platform,
                    subStr: "Mac",
                    id: "Mac"
                }, {
                    str: navigator.userAgent,
                    subStr: "iPhone",
                    id: "iPhone/iPod"
                }, {
                    str: navigator.platform,
                    subStr: "Linux",
                    id: "Linux"
                }
                ],
                tm_Stringsearchfun: function (l) {
                    for (var x = 0; x < l.length; x++) {
                        var p = l[x].str;
                        var k = l[x].prop;
                        this.versionSearchString = l[x].versionSearch || l[x].id;
                        if (p) {
                            if (p.indexOf(l[x].subStr) != -1) {
                                return l[x].id
                            }
                        } else {
                            if (k) {
                                return l[x].id
                            }
                        }
                    }
                },
                tm_Versionsearchfun: function (l) {
                    var x = l.indexOf(this.versionSearchString);
                    if (x == -1) {
                        return
                    }
                    return parseFloat(l.substr(x + this.versionSearchString.length + 1))
                }
            },
            cookie: {
                tm_get: function (l, x) {
                    var p = new Date;
                    p.setTime(p.getTime());
                    var k = (new Date(p.getTime() + 1e3 * 60 * 60 * x)).toGMTString();
                    var j = document.cookie.split(";");
                    var y = "";
                    var e = "";
                    var m = [0, k];
                    for (var a = 0; a < j.length; a++) {
                        y = j[a].split("=");
                        e = y[0].replace(/^\s+|\s+$/g, "");
                        if (e == l) {
                            b_cookie_found = true;
                            if (y.length > 1) {
                                m = unescape(y[1]).split("|");
                                if (m.length == 1) {
                                    m[1] = k
                                }
                            }
                            return m
                        }
                        y = null;
                        e = ""
                    }
                    return m
                },
                tm_set: function (l, x, p) {
                    document.cookie = l + "=" + escape(x + "|" + p) + ";expires=" + p + ";path=/"
                }
            },
            listener: {
                tm_addfun: function (l, x, p) {
                    var k = "on" + x;
                    if (typeof l.addEventListener != "undefined") {
                        l.addEventListener(x, p, arguments.callee)
                    } else {
                        if (typeof l.attachEvent != "undefined") {
                            l.attachEvent(k, p)
                        } else {
                            if (typeof l[k] != "function") {
                                l[k] = p
                            } else {
                                var j = l[k];
                                l["old_" + k] = j;
                                l[k] = function () {
                                    j();
                                    return p()
                                }
                            }
                        }
                    }
                },
                tm_removefun: function (l, x, p) {
                    var k = "on" + x;
                    if (typeof l.removeEventListener != "undefined") {
                        l.removeEventListener(x, p, false)
                    } else {
                        if (typeof l.detachEvent != "undefined") {
                            l.detachEvent(k, p)
                        } else {
                            if (typeof l["old_" + k] != "function") {
                                l[k] = null
                            } else {
                                l[k] = l["old_" + k]
                            }
                        }
                    }
                }
            },
            format: {},
            random: function () {
                return Math.floor(Math.random() * 1000001)
            }
        };
        m.tm_initializefun();
        m.format.popunder = {
            settings: {
                url: l,
                times: p,
                hours: k,
                cookie: j
            },
            config: x,
            isBinded: false,
            isTriggered: false,
            tm_initializefun: function () {
                var l = m.cookie.tm_get(m.format.popunder.settings.cookie, m.format.popunder.settings.hours);
                this.cookie = {};
                this.cookie.times = !isNaN(Number(l[0])) ? Number(l[0]) : 0;
                this.cookie.expires = !isNaN(Date.parse(l[1])) ? l[1] : (new Date).toGMTString();
                if (document.readyState == "complete") {
                    setTimeout(m.format.popunder.bind, 1)
                } else {
                    m.listener.tm_addfun(document, "DOMContentLoaded", function () {
                        m.listener.tm_removefun(document, "DOMContentLoaded");
                        m.format.popunder.bind()
                    });
                    m.listener.tm_addfun(document, "onreadystatechange", function () {
                        if (document.readyState == "complete") {
                            m.listener.tm_removefun(document, "onreadystatechange");
                            m.format.popunder.bind()
                        }
                    });
                    m.listener.tm_addfun(window, "load", m.format.popunder.bind)
                }
            },
            bind: function () {
                if (m.format.popunder.isBinded) {
                    return
                }
                m.format.popunder.isBinded = true;
                if (m.format.popunder.cookie.times >= m.format.popunder.settings.times) {
                    return
                }
                var l = {};
                for (var x in m.format.popunder.binders) {
                    var p = m.format.popunder.binders[x];
                    var k = x.split("");
                    var j = "",
                    y = "";
                    var e = 1,
                    a;
                    for (var f = 0; f < k.length; f++) {
                        var ll = k[f];
                        if (ll.match(/[a-z0-9]/) == null) {
                            continue
                        }
                        a = ll.search(/[a-z]/) == 0;
                        if (a) {
                            if (a != e) {
                                l[j][y] = p;
                                j = ll
                            } else {
                                j += ll
                            }
                        } else {
                            if (a != e || parseInt(f) + 1 == k.length) {
                                if (a != e) {
                                    if (typeof l[j] != "object") {
                                        l[j] = {}

                                    }
                                    y = ll
                                }
                                if (parseInt(f) + 1 == k.length) {
                                    l[j][a == e ? y + ll : y] = p
                                }
                            } else {
                                y += ll
                            }
                        }
                        e = a
                    }
                }
                var c = l[m.ua.browser.toLowerCase()] || l.all;
                var h = Object.keys(c);
                h.sort();
                for (var p = 0; p < h.length; p++) {
                    var y = h[p];
                    if (m.ua.version <= y) {
                        break
                    }
                }
                c[y]()
            },
            binders: {
                chrome37: function () {
                    m.listener.tm_addfun(document, "mousedown", m.format.popunder.triggers.tm_anchor_trigg)
                },
                chrome30: function () {
                    m.listener.tm_addfun(document, "click", m.ua.os == "Windows" ? m.format.popunder.triggers.tm_fullscreen_trigg : m.format.popunder.triggers.tm_triple_trigg)
                },
                chrome28: function () {
                    m.listener.tm_addfun(document, "click", m.format.popunder.triggers.tm_triple_trigg)
                },
                firefox12_chrome21: function () {
                    m.listener.tm_addfun(document, "click", m.format.popunder.triggers.tm_double_trigg)
                },
                explorer0: function () {
                    m.listener.tm_addfun(document, "click", m.format.popunder.triggers.tm_singledelay)
                },
                all0: function () {
                    m.listener.tm_addfun(document, "click", m.format.popunder.triggers.tm_single)
                }
            },
            triggers: {
                tm_fullscreen_trigg: function () {
                    m.listener.tm_removefun(document, "click", m.format.popunder.triggers.tm_fullscreen_trigg);
                    if (!m.format.popunder.tm_register_trigg()) {
                        return
                    }
                    document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                    window.open(m.format.popunder.settings.url, "pu_" + m.random(), m.format.popunder.config);
                    document.webkitCancelFullScreen()
                },
                tm_triple_trigg: function () {
                    m.listener.tm_removefun(document, "click", m.format.popunder.triggers.tm_triple_trigg);
                    if (!m.format.popunder.tm_register_trigg()) {
                        return
                    }
                    window.open("javascript:window.focus()", "_self");
                    var l = window.open("about:blank", "pu_" + m.random(), m.format.popunder.config);
                    var x = document.createElement("a");
                    x.setAttribute("href", "data:text/html,<scr" + "ipt>window.close();</scr" + "ipt>");
                    x.style.display = "none";
                    document.body.appendChild(x);
                    var p = document.createEvent("MouseEvents");
                    p.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, true, false, false, true, 0, null);
                    x.dispatchEvent(p);
                    document.body.removeChild(x);
                    l.document.open().write("<scr" + 'ipt type="text/javascript">window.location="' + m.format.popunder.settings.url + '";</scr' + "ipt>");
                    l.document.close()
                },
                tm_anchor_trigg: function () {
                    m.listener.tm_removefun(document, "mousedown", m.format.popunder.triggers.tm_triple_trigg);
                    if (!m.format.popunder.tm_register_trigg()) {
                        return
                    }
                    var anchor = document.createElement("A");
                    anchor.href = m.format.popunder.settings.url;
                    document.body.appendChild(anchor);

                    var e = document.createEvent("MouseEvents");
                    e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, true, false, false, true, 0, null);
                    anchor.dispatchEvent(e);
                    anchor.parentNode.removeChild(anchor);

                },

                tm_double_trigg: function (l) {
                    m.listener.tm_removefun(document, "click", m.format.popunder.triggers.tm_double_trigg);
                    if (!m.format.popunder.tm_register_trigg() && l != "i") {
                        return
                    }
                    var x = window.open(m.format.popunder.settings.url, "pu_" + m.random(), m.format.popunder.config);
                    if (x) {
                        x.blur();
                        try {
                            var p = x.window.open("about:blank");
                            p.close()
                        } catch (k) { }
                        if (m.ua.browser == "Firefox")
                            window.showModalDialog("javascript:window.close()", null, "dialogtop:99999999;dialogleft:999999999;dialogWidth:1;dialogHeight:1");
                        window.focus()
                    }
                },
                tm_singledelay: function () {
                    m.listener.tm_removefun(document, "click", m.format.popunder.triggers.tm_singledelay);
                    if (!m.format.popunder.tm_register_trigg())
                        return;
                    var l = window.open(m.format.popunder.settings.url, "pu_" + m.random(), m.format.popunder.config);
                    window.setTimeout(window.focus, 750);
                    window.setTimeout(window.focus, 850);
                    if (l)
                        l.blur()
                },
                tm_single: function (l) {
                    m.listener.tm_removefun(document, "click", m.format.popunder.triggers.tm_single);
                    if (!m.format.popunder.tm_register_trigg() && l != "i") {
                        return
                    }
                    var x = window.open(m.format.popunder.settings.url, "pu_" + m.random(), m.format.popunder.config);
                    if (x) {
                        x.blur();
                        window.focus()
                    }
                }
            },
            tm_register_trigg: function () {
                if (m.format.popunder.isTriggered) {
                    return false
                }
                m.format.popunder.isTriggered = true;
                if (m.format.popunder.settings.hours > 0) {
                    m.cookie.tm_set(m.format.popunder.settings.cookie, ++m.format.popunder.cookie.times, m.format.popunder.cookie.expires)
                }
                return true
            }
        };
        m.format.popunder.tm_initializefun();
        if (!Object.keys) {
            Object.keys = function () {
                var l = Object.prototype.hasOwnProperty,
                x = !{
                    toString: null
                }
                .propertyIsEnumerable("toString"),
                p = ["toString", "toLocaleString", "valueOf", "hasOwnProperty", "isPrototypeOf", "propertyIsEnumerable", "constructor"],
                k = p.length;
                return function (j) {
                    if (typeof j !== "object" && typeof j !== "function" || j === null)
                        throw new TypeError("Object.keys called on non-object");
                    var y = [];
                    for (var e in j) {
                        if (l.call(j, e)) {
                            y.push(e)
                        }
                    }
                    if (x) {
                        for (var m = 0; m < k; m++) {
                            if (l.call(j, p[m]))
                                y.push(p[m])
                        }
                    }
                    return y
                }
            }
            ()
        }
    }
}