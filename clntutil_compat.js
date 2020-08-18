//<script>
// Cross-browser compatibility layer.

var Compat = { };
var XmlHttp = { };
var XmlDoc = { };

Compat.isIE = (window.ActiveXObject != null);
Compat.isMoz = (document.implementation != null && document.implementation.createDocument != null);
Compat.isChrome = (navigator.userAgent.match(/Chrome/) != null);

Compat.getVersionIE = function()
{
	var version = window.navigator.appVersion;
	version = version.substr(version.indexOf("MSIE") + 5, 1);
	return version;
}

Compat.for_each = function(obj, fn)
{
	for (var prop in obj)
		fn(prop, obj[prop]);
}

Compat.translateProperties = function(source, target, nameTranslations)
{
	Compat.for_each(source, function(name, value)
	{
		if (name in nameTranslations)
			name = nameTranslations[name];
		if (name != null)
			target[name] = value;
	});
	return target;
}

// Note the difference between htmlEncode() and xmlEncode(): "&apos;" is not an HTML entity!
Compat.htmlEncode = function(s)
{
	return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

Compat.xmlEncode = function(s)
{
	return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&apos;");
}

Compat.selectOption = function(oSelect, aValue)
{
	var options = oSelect.options;
	for (var i = 0; i < options.length; i++)
		if (options.item(i).value == aValue) {
			oSelect.selectedIndex = i;
			return true;
		}
}

Compat.addKeyHandler = function(node, type, keyCode, handler, eventCapturing)
{
	if (eventCapturing == null)
		eventCapturing = false;
	var handleEvent = function(event) {
		var e = Compat.getEvent(event);
		var f = node._keyHandlers[e.type][e.keyCode];
		if (f != null)
			f(e);
	}
	if (node._keyHandlers == null)
		node._keyHandlers = { keydown: null, keyup: null, keypress: null };
	if (node._keyHandlers[type] == null)
	{
		node._keyHandlers[type] = new Array;
		if (node.addEventListener)
			node.addEventListener(type, handleEvent, eventCapturing);
		else switch (type) {
				case "keydown":  node.onkeydown  = handleEvent; break;
				case "keyup":    node.onkeyup    = handleEvent; break;
				case "keypress": node.onkeypress = handleEvent; break;
			}
	}
	node._keyHandlers[type][keyCode] = handler;
}

Compat.makeObjectDefinition = function(attributes, parameters)
{
	function makeAttr(name, value) {
		return " " + name + "=\"" + Compat.htmlEncode(new String(value)) + "\"";
	}
	function makeParam(name, value)	{
		return "<param name=\"" + name + "\" value=\"" + Compat.htmlEncode(new String(value)) + "\">\n";
	}
	
	var attrs = "", params = "";
	Compat.for_each(attributes, function(name, value) { attrs += makeAttr(name, value); });
	Compat.for_each(parameters, function(name, value) { params += makeParam(name, value); });
	return "<obj" + "ect" + attrs + ">\n" + params + "</obj" + "ect>\n";
}

Compat.writeObjectDefinition = function(doc, attributes, parameters)
{
	doc.write(Compat.makeObjectDefinition(attributes, parameters));
}

Compat.makeTag = function(tagName, attrs, content)
{
	function quoteValue(v) { return "\"" + Compat.xmlEncode(new String(v)) + "\""; }
	var s = "<" + tagName;
	Compat.for_each(attrs, function(name, value) { s += " " + name + "=" + quoteValue(value); });
	s += (content == null || content == "") ? "/>" : ">" + content + "</" + tagName + ">";
	return s;
}

Compat.findParent = function(node, fn_test)
{
	while (node != null && !fn_test(node))
		node = node.parentNode;
	return node;
}

Compat.findParentByTagName = function(node, tagName)
{
	return Compat.findParent(node, function(n) { return (n.tagName == tagName); });
}

Compat.printf = function(sText, oArgs)
{
	for (var oArgument in oArgs) {
		sText = sText.replace(oArgument, oArgs[oArgument]);
	}
	return sText;
}

Compat.createDocument = function()
{
	var o = document.createElement("iframe");
	o.style.display = "none";
	document.body.appendChild(o);
	return o.contentWindow.document;
}

Compat.getFrame = function(id)
{ 
	var elem = top.document.getElementById(id);
	return (elem?elem.contentWindow:elem);
}

Compat.translateFeatures = function(oFeatures)
{
	var ar = new Array();
	Compat.for_each(oFeatures, function(name, value) { ar.push(name + "=" + value); });
	return ar.join(",");
}

Compat.openWindow = function(oParams, oFeatures)
{
	var sFeatures = Compat.translateFeatures(oFeatures);
	// Do not call window.open() from a dialog, it doesn't work in FireFox; use window.opener instead.
	var o = window.opener;
	if (o == null)
		o = window;
	var w = o.open(oParams.url, oParams.name, sFeatures);
	if (oParams.focus)
	{
		try { w.focus(); } catch (e) { }
	}
	return w;
}

if (Compat.isIE)
{
	Compat.getEvent = function(e)
	{
	    if(!e)
		    e = window.event;
		e.target = e.srcElement;
		e.preventDefault = function() { this.returnValue = false; }
		e.stopPropagation = function() { this.cancelBubble = true; }
		return e;
	}
	
	Compat.selectElement = function(elem)
	{
		var range = eval("document.body." + "create" + "Text" + "Range()");
		range.moveToElementText(elem);
		range.select();
	}

	Compat.fixDialogSize = function(dimensions)
	{
		if (Compat.getVersionIE() > 6)
			dimensions.height = dimensions.heightIE7;
		else
			dimensions.height = dimensions.heightIE;

		return dimensions;
	}
	
	Compat.showModalDialog = function(sURL, arguments, objFeatures, onReturn)
	{
		var f = Compat.translateProperties(objFeatures,
			{ help: 0, status: 0 },	// default features
			{ width: "dialogWidth", height: "dialogHeight", top: "dialogTop", left: "dialogLeft" } // translations
		);
		
		for (var prop in { dialogWidth:0, dialogHeight:0, dialogTop:0, dialogLeft:0 })
			if (prop in f) f[prop] = parseInt(f[prop]) + "px";
		
		var ar = new Array();
		Compat.for_each(f, function(name, value) { if (value != null) ar.push(name + ":" + value); });
		var sFeatures = ar.join(";");
		var ret = window.showModalDialog(sURL, arguments, sFeatures); 
		if (typeof(onReturn) == "function")
			onReturn(ret);
		// For compatibility with Mozilla, the only way to get return value is by specifying onReturn.
		// That's why we don't return (ret) here.
	}

	Compat.getDialogArguments = function()
	{
		return window.dialogArguments;
	}

	Compat.isActiveXEnabled = function()
	{
		try { var o = new ActiveXObject("htmlfile"); return true; } catch (e) { return false; }
	}

	Compat.checkActiveX = function()
	{
		if (Compat.isActiveXEnabled())
			return true;
		var msg = "Your current security settings prohibit running ActiveX controls on this page. " +
			"As a result, the page may not display properly.";
		alert(msg);
		return false;
	}

	Compat.createObject = function(progID)
	{
		try {
			return new ActiveXObject(progID);
		} catch (e) {
			if (e.number == -2146827859)//Automation Server can't create object
				Compat.checkActiveX();
		}
	}
    Compat.getWindow = function(doc)
	{
		return doc.parentWindow;
	}

	Compat.getDocument = function(elem)
	{
		return elem.document;
	}

	XmlDoc.createNew = function() { return Compat.createObject("MSXML2.DOMDocument"); }
	XmlDoc.loadXml = function(strXml)
	{
		var doc = XmlDoc.createNew();
		doc.loadXML(strXml);
		return doc;
	}

	XmlDoc.load = function(doc, url, onload)
	{
		doc.async = false;
		if (typeof(onload) == "function")
		{
			doc.async = true;
			XmlDoc.addPendingRequest(url, doc);
			doc.onreadystatechange = function()
			{
				if (doc.readyState == 4 || doc.readyState == "complete")
				{
					XmlDoc.removePendingRequest(url);
					onload(doc);
				}
			}
		}
		return doc.load(url);
	}
	XmlHttp.createNew = function() { return Compat.createObject("MSXML2.XMLHTTP"); }
	XmlHttp.setOnloadHandler = function(xmlhttp, onload)
	{
		xmlhttp.onreadystatechange = function() { if (xmlhttp.readyState == 4) onload(xmlhttp); }
	}

	Compat.init = function(doc) { }
}
if (Compat.isMoz)
{
	function removeWS(node)
	{
		var re = new RegExp();
		re.compile("^\\s*$");
		for (var kid = node.firstChild; kid != null; kid = nextKid)
		{
			var nextKid = kid.nextSibling;
			if (kid.nodeType == 1)
				removeWS(kid);
			else if (kid.nodeType == 3 && re.test(kid.nodeValue))
				node.removeChild(kid);
		}
	}

	Compat.getEvent = function(e)
	{
		var o = e.target;
		// In Mozilla, text nodes (nodeType=1) may generate events.
		// We are always interested in element nodes.
		if (o != null && o.nodeType != 1)
			e.target = o.parentNode;
		return e;
	}

	Compat.selectElement = function(elem)
	{
		var	range =	document.createRange();
		range.selectNodeContents(elem);
		var	selection =	window.getSelection();
		selection.removeAllRanges();
		selection.addRange(range);
	}

	Compat.fixDialogSize = function(dimensions)
	{
		// do nothing	
		return dimensions;
	}

	Compat.showModalDialog = function(sURL, arguments, objFeatures, onReturn)
	{
		var f = Compat.translateProperties(objFeatures,
			{ titlebar: 0, toolbar: 0, directories: 0, menubar: 0, resizable: 0, modal: 1, dialog: "yes" },	// default features
			{ top: "screenY", left: "screenX", scroll: "scrollbars" }	// name translations
		);
		if (f.width && !f.screenX) f.screenX = Math.round((screen.availWidth - f.width)/2);
		if (f.height && !f.screenY) f.screenY = Math.round((screen.availHeight - f.height)/2);

		var ar = new Array();
		Compat.for_each(f, function(name, value) { if (value != null) ar.push(name + "=" + value); });
		var sFeatures = ar.join(",");

		// unload event is sent when loading; therefore need to count to 2.
		var count = 0;
		function unloadHandler()
		{
			if (++count == 2 && Compat.dialogWindow != null) {
				if (typeof(onReturn) == "function")
					onReturn(Compat.dialogWindow.returnValue);
				Compat.dialogWindow = null;
			}
		}

		var w = Compat.dialogWindow;
		if (w != null) {
			// Close the currently open dialog, making sure its' onReturn handler won't be called.
			Compat.dialogWindow = null;
			w.close();
		}
		// When opening a dialog from safeview-protected document,
		// window.opener is the document itself in Mozilla, and the container (safeview wrapper) page in Netscape.
		// E.g., when opening an export/print dialog from result list,
		// window.opener is srvrutil_resultlistClient.aspx in Mozilla and sfvw_resultlist.aspx in Netscape.
		// To overcome this inconsistency, always put dialog arguments in the container page. 
		var papa = getContainerDocument();
		papa.childArguments = arguments;
		try {
			w = window.open(sURL, "_blank", sFeatures);
		} catch (e) {
			try {
				w = papa.open(sURL, "_blank", sFeatures);
			} catch (e) {
				return;	// we did our best, sorry
			}
		}
		w.addEventListener("unload", unloadHandler, true);
		Compat.dialogWindow = w;
	}

	Compat.getDialogArguments = function()
	{
		var o = window.opener;
		var papa = o.getContainerDocument();
		return papa.childArguments;
	}
    Compat.getWindow = function(doc)
	{
		return doc.defaultView;
	}

	Compat.getDocument = function(elem)
	{
		return elem.ownerDocument;
	}

	HTMLElement.prototype.__defineSetter__("innerText", function (sText)
	{
		this.innerHTML = Compat.htmlEncode(sText.toString());
	});

	HTMLElement.prototype.__defineGetter__("innerText", function ()
	{
		return (this.innerHTML.replace(/<[^>]+>/g,""));
	});

	HTMLDocument.prototype.__defineGetter__("parentWindow", function()
	{
		return this.defaultView;
	});

	XmlDoc.createNew = function()
	{
		var doc = document.implementation.createDocument("", "", null);
		if(!doc.readyState)
		    doc.readyState = 4;	// to be consistent with MSXML, where a new document is in ready state 4.
		doc.parseError = { errorCode: 0, reason: "" };
		return doc;
	}

	XmlDoc.loadXml = function(strXml)
	{
		var oParser = new DOMParser();
		var doc = oParser.parseFromString(strXml, "text/xml");
		return doc;
	}
  //add the loadXML() method to the Document class
	Document.prototype.loadXML = function(strXML) 
	{      
		try
		{
			var objDOMParser = new DOMParser();
			var objDoc = objDOMParser.parseFromString(strXML, "text/xml");

			//make sure to remove all nodes from the document
			while (this.hasChildNodes())
			  this.removeChild(this.lastChild);
				
			//add the nodes from the new document
			for (var i=0; i < objDoc.childNodes.length; i++) 
			{            
				//import the node
				var objImportedNode = this.importNode(objDoc.childNodes[i], true);

				//append the child to the current document
				this.appendChild(objImportedNode);
			}
			return true;
		}catch(e){return false;}
	}

	XmlDoc.load = function(doc, url, onload)
	{
		function loadHandler(doc)
		{
			doc.readyState = 4;
			var root = doc.documentElement;
			if (root == null)
				return false;
			if ((root.tagName == "parsererror") && (root.namespaceURI == "http://www.mozilla.org/newlayout/xml/parsererror.xml")){
				doc.parseError.errorCode = { errorCode: -99999, reason: root.childNodes[0].nodeValue };
				return false;
		}
			removeWS(root);
			return true;
		}
		doc.async = false;
		if (typeof(onload) == "function")
		{
			doc.async = true;
			doc.readyState = 1;
			doc.addEventListener("load", function()
			{
				XmlDoc.removePendingRequest(url);
				loadHandler(this);
				onload(this);
			}, false);

			XmlDoc.addPendingRequest(url, doc);
		}
		try {
			doc.load(url);
		} catch (e) {
			doc.parseError = { errorCode: -99999, reason: "XMLDocument.load() threw an exception" };
			return false;
		}
		return (doc.async) ? true : loadHandler(doc);
	}

	XmlHttp.createNew = function() 	{ return new XMLHttpRequest(); }
	XmlHttp.setOnloadHandler = function(xmlhttp, onload)
	{
		xmlhttp.addEventListener("load", function() { onload(xmlhttp); }, false);
	}

	function __collectText(node)
	{
		var s = "";
		for (var kid = node.firstChild; kid != null; kid = kid.nextSibling)
		{
			switch (kid.nodeType)
			{
				case 1: s += __collectText(kid); break;
				case 3: s += kid.nodeValue; break;
			}
		}
		return s;
	}

	function __getXml(node)
	{
		return (new XMLSerializer()).serializeToString(node);
	}

	function __applyTransform(node, xslDoc)
	{
		var p = new XSLTProcessor();
		p.importStylesheet(xslDoc);
		var out = p.transformToDocument(node);
		var root = out.documentElement;
		if (root == null) return "";
		var s = new XMLSerializer();
		if (root.tagName != "transformiix:result")
			return s.serializeToString(root);
		var ar = [];
		for (var child = root.firstChild; child != null; child = child.nextSibling)
			ar.push(s.serializeToString(child));
		return ar.join("");
	}
	
	function __selectNodes(doc, sExpr, contextNode)
	{
		var resultType = XPathResult.ORDERED_NODE_SNAPSHOT_TYPE;
		var oResult = doc.evaluate(sExpr, contextNode, doc.createNSResolver(doc.documentElement), resultType, null);
		return oResult;
	};

	function __selectSingleNode(doc, sExpr, contextNode)
	{
		var ret = __selectNodes(doc, sExpr, contextNode);
		return (ret.snapshotLength) ? ret.snapshotItem(0) : null;
	}

    Compat.initPrototype = function()
    {
	    // For IE compatibility
	    XMLDocument.prototype.parseError = { errorCode: 0, reason: "" };
	    XMLDocument.prototype.setProperty = function(propName, propValue) { /* does nothing */ }

	    XMLDocument.prototype.__defineGetter__("text", function ()	{ return __collectText(this.documentElement); });
	    XMLDocument.prototype.__defineGetter__("xml", function ()	{ return __getXml(this.documentElement); });

	    XMLDocument.prototype.transformNode = function(xslDoc)		{ return __applyTransform(this.documentElement, xslDoc); }
	    XMLDocument.prototype.selectNodes = function(sExpr)			{ return __selectNodes(this, sExpr, this.documentElement); }
	    XMLDocument.prototype.selectSingleNode = function(sExpr)	{ return __selectSingleNode(this, sExpr, this.documentElement); }

	    // Define "length" and "item()" as aliases for "snapshotLength" and "snapshotItem()"
	    XPathResult.prototype.__defineGetter__("length",  function() { return this.snapshotLength; });
	    XPathResult.prototype.item = XPathResult.prototype.snapshotItem;
    	
	    Node.prototype.__defineGetter__("text", function()		{ return __collectText(this); });
	    Node.prototype.__defineGetter__("xml", function ()		{ return __getXml(this); });

	    Node.prototype.transformNode = function(xslDoc)			{ return __applyTransform(this, xslDoc); }
	    Node.prototype.selectNodes = function(sExpr)			{ return __selectNodes(this.ownerDocument, sExpr, this); }
	    Node.prototype.selectSingleNode = function(sExpr)		{ return __selectSingleNode(this.ownerDocument, sExpr, this); }

	    Element.prototype.__defineGetter__("text", function()	{ return __collectText(this); });
	    Element.prototype.__defineGetter__("xml", function ()	{ return __getXml(this); });

	    Element.prototype.transformNode = function(xslDoc)		{ return __applyTransform(this, xslDoc); }
	    Element.prototype.selectNodes = function(sExpr)			{ return __selectNodes(this.ownerDocument, sExpr, this); }
	    Element.prototype.selectSingleNode = function(sExpr)	{ return __selectSingleNode(this.ownerDocument, sExpr, this); }

	    Error.prototype.number = -99999;
	    Error.prototype.__defineGetter__("description", function() {
		    return this.message + "\nFile: " + this.fileName + "\nLine: " + this.lineNumber;
	    });
    }

    Compat.initReadyState = function(doc)
    {
        if (doc == null)
            doc = document;
        var w = Compat.getWindow(doc);
	    // Mozilla doesn't support readyState. Set it on loading.
	    w.addEventListener("load", function() { doc.readyState = "complete"; }, false);
    }
    
    Compat.init = function(doc)
    {
        Compat.initPrototype();
        Compat.initReadyState(doc);
    }
}

XmlDoc.createIsland = function(url, onload)
{
	var request = XmlHttp.createNew();
	XmlHttp.setOnloadHandler(request,
		function() {
			onload(request.responseXML);
		});
	request.open("GET", url, true);
	request.send("");	
}

XmlDoc.addPendingRequest = function(url, doc)
{
	var ar = this.pendingRequests;
	if (ar == null)
		ar = this.pendingRequests = new Array();
	ar[url] = doc;
}

XmlDoc.removePendingRequest = function(url)
{
	var ar = this.pendingRequests;
	if (ar != null)
		ar[url] = null;
}

XmlDoc.getPendingRequests = function()
{
	var ar = this.pendingRequests;
	if (ar == null)
		return null;
	var ret = new Array();
	for (var url in ar)
		if (ar[url] != null)
			ret.push(url);
	return ret;
}

Compat.init(document);	   
