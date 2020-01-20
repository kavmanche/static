//<script>
// Flags for copyFrom() and makeCopy()

var globalSettings = 1;
var searchSettings = 2;
var resultSettings = 4;

var FieldFlags =
{
	WILDCARD: 1,
	PROXIMITY: 2,
	EXPRESSION: 4,
	NUMERIC: 8,
	DATE: 16,
	FLOAT: 32
}

function getSafeViewObject()
{
	// IE test
	try { window.external.Test(); return window.external; } catch (e) { }
	// Mozilla test
	var o = document.getElementsByTagName("object");
	for (var i = 0; i < o.length; i++)
		if (o[i].type == "application/x-safeview")
			return o[i];
	return null;
}

function getContainerDocument()
{
	var oSafeView = getSafeViewObject();
	if (oSafeView == null || oSafeView.Parent == null)
		return document;
	var doc = oSafeView.Parent.document;
	return (doc == null) ? oSafeView.Parent.Document : doc;
}

function isInSafeView()
{
	return (getSafeViewObject() != null);
}

// NetisQuery constructor

function NetisQuery()
{
	this.terms = "";
	this.dbID = "";
	
	// Application-dependent URLs (search form, result list, document view)
	this.appRoot = "";
	this.searchURL = "";
	this.resultURL = "";
	this.docURL = "";
	this.loginURL = "";
	this.regMode = 0;
	this.returnPage = "";

	// Result list settings
	this.resultColumns = "";
	this.sortField = "";
	this.sortOrder = "desc";
	this.sortField2 = "";
	this.sortOrder2 = "desc";
	this.maxRecordCount = "";
	this.resultsPerPage = 20;
	this.page = "";
	this.qid = "";
	this.key = "";
	// Keeep the selected results in string
	this.selectedResults = "";
	//keep the docids of the current query
	this.documentsIds = "";
	this.template = "";
	this.resultsCount = 0;
	this.docNo = 0;
	this.queryType = "";
	this.docID = "";
	this.form = null;
	this.hl = 0;
	this.submitFrame = document;
}

NetisQuery.prototype.copyFrom = function(q, flags)
{
	if (flags == null)
		flags = globalSettings + resultSettings + searchSettings;	// default: copy all settings

	with (this)  {
		if (flags & globalSettings) {
			dbID = q.dbID;
			appRoot = q.appRoot;
			searchURL = q.searchURL;
			resultURL = q.resultURL;
			docURL = q.docURL;
			loginURL = q.loginURL;
			regMode = q.regMode;
		}
		if (flags & searchSettings) {
			dbID = q.dbID;
			terms = q.terms;
			qid = q.qid;
			key = q.key;
			page = q.page;
			resultsCount = q.resultsCount;
			docNo = q.docNo;
			selectedResults = q.selectedResults;
			queryType = q.queryType;
			returnPage = q.returnPage;
		}
		if (flags & resultSettings) {
			resultColumns = q.resultColumns;
			sortField = q.sortField;
			sortOrder = q.sortOrder;
			sortField2 = q.sortField2;
			sortOrder2 = q.sortOrder2;
			maxRecordCount = q.maxRecordCount;
			resultsPerPage = q.resultsPerPage;
			template = q.template;
			docID = q.docID;
			hl = q.hl;
		}
	}
}

NetisQuery.prototype.makeCopy = function(flags)
{
	// Full copy by default
	if (arguments.length < 1)
		flags = globalSettings | searchSettings | resultSettings;
	var q = new NetisQuery();
	q.copyFrom(this, flags);
	return q;
}

// Reset search parameters
NetisQuery.prototype.newSearch = function()
{
	with (this) {
		resultsCount = 0;
		terms = "";
		qid = "";
		page = 1;
		docNo = 0;
		selectedResults = "";
		queryType = "";
	}
}

function ParsedURL(sUrl)
{
	this.protocol = "";
	this.server = "";
	this.path = sUrl;
	
	var re = /^(\w+:)\/\/([^\/]+)(\/.*)?/;
	if (sUrl.match(re))
	{
		this.protocol = RegExp.$1;
		this.server = RegExp.$2;
		this.path = RegExp.$3;
	}
}

ParsedURL.prototype.isAbsolute = function()		{ return (this.protocol.length && this.server.length); }
ParsedURL.prototype.setBase = function(oBase)	{ this.protocol = oBase.protocol; this.server = oBase.server; }

function makeAbsolute(baseURL, url, customProtocol)
{
	var oUrl = new ParsedURL(url);
	with (oUrl)
	{
		if (!isAbsolute())
		{
			var oBase = new ParsedURL(baseURL);
			setBase(oBase);				// this sets protocol and server; we deal with path separately.
			if (!/^\//.test(path))		// if path doesn't start with slash (i.e., it's a relative path)
			{
				var slash = (/\/$/.test(oBase.path))? "" : "/";		// add a slash if oBase.path doesn't end with one
				path = oBase.path + slash + path;
			}
		}		
		if (!isAbsolute())
		{
			if (customProtocol != null)
				protocol = customProtocol + ":";
			else
				protocol = document.location.protocol;
			
			server = document.location.host;
		}
		
		return protocol + "//" + server + path;
	}
}

NetisQuery.prototype.addParsedTerm = function(term) {
    if (term != "")
        this.terms += "~";
    this.terms += term.replace(/\n/gm, ""); 	// make sure to remove newlines!
}

// For cases when parsing is not required
NetisQuery.prototype.makeTerm = function(fieldName, term, termType)
{
	if (termType == null) termType = "word";
	return Compat.makeTag("t", { f: fieldName, v: term, type: termType});
}
// This makes it easy to override default parsing on a field-by-field basis
NetisQuery.prototype.createParser = function(fieldName, fieldFlags)
{
	return new QueryParser(fieldName, fieldFlags);
}

NetisQuery.prototype.parseTerm = function(fieldName, term, sFlags)
{
	if (term == "") return "";
	if (sFlags == null)
		sFlags = "twpe";		// default is a text field with all extras
	// Translate field flags to a bit mask
	var fieldFlags = 0;
	for (var i = 0; i < sFlags.length; ++i)
		switch (sFlags.charAt(i)) {
			case "w": fieldFlags += FieldFlags.WILDCARD; break;
			case "p": fieldFlags += FieldFlags.PROXIMITY; break;
			case "e": fieldFlags += FieldFlags.EXPRESSION; break;
			case "n": fieldFlags += FieldFlags.NUMERIC; break;
			case "d": fieldFlags += FieldFlags.DATE; break;
			case "f": fieldFlags += FieldFlags.NUMERIC + FieldFlags.FLOAT; break;
		}
	var oParser = this.createParser(fieldName, fieldFlags);
	return oParser.parseTerm(term);
}

NetisQuery.prototype.addTerm = function(fieldName, term, sFlags) {
    if (term == "")
        return;
    if (this.terms != "")
        this.terms += "~";
    this.terms += fieldName + ":" + term.replace(/\n/gm, "");
//netis:    var t = this.parseTerm(fieldName, term, sFlags);
//netis:    this.addParsedTerm(t);
}


/* sort : Sets the sorting order for result list.
		  FieldName must be the name of a sortable field.
		  sortOrder is 1 for ascending sort, -1 for descending.
		  Only the last call to that function we be considere... */
		  
NetisQuery.prototype.sortBy = function(fieldName,sortOrder)
{
    if (sortOrder == "" || sortOrder == undefined)					// only field name specified
	{
		if (this.sortField == fieldName)
			this.sortOrder = (this.sortOrder == "desc") ? "asc" : "desc";			// same field, toggle sort order
		else {
			this.sortField = fieldName;
			this.sortOrder = (fieldName == "ReferrersCount" || fieldName == "ChildId" || fieldName == "Pages") ? "desc" : "asc";
		}
	}
	else {
		this.sortField = fieldName;
		this.sortOrder = sortOrder;
	}
}

/*
	Submits the query to the specified URL.

	The trick here is that a nameless form is dynamically created and appended to the document.
 */
NetisQuery.prototype.submitTo = function(submitURL, protocol)
{
	if (submitURL.match(/\.(htm|html)$/)) {
		this.submitFrame.location.href = submitURL;	// use GET rather than POST for html pages
		return;
	}

	with (this)
	{
		createForm();
		addParam("dbID", dbID);
		addParam("terms", escape(terms));
		addParam("searchURL", searchURL);
		addParam("resultURL", resultURL);
		addParam("docURL", docURL);
		addParam("loginURL", loginURL);
		addParam("resultColumns", resultColumns);
		addParam("resultsCount", resultsCount);
		addParam("sortField", sortField);
		addParam("sortOrder", sortOrder);
		addParam("sortField2", sortField2);
		addParam("sortOrder2", sortOrder2);
		addParam("maxRecordCount", maxRecordCount);
		addParam("resultsPerPage", resultsPerPage);
		addParam("page", page);
		addParam("qid", qid);
		addParam("key", key);
		addParam("selectedResults", selectedResults);
		addParam("documentsIds", documentsIds);
		addParam("template", template);
		addParam("docNo", docNo);
		addParam("docID", docID);
		addParam("hl", hl);
		addParam("queryType", queryType);
		addParam("returnPage", returnPage);
	}
	if (protocol == null)
		protocol = "http";
	var url = makeAbsolute(this.appRoot, submitURL, protocol);	
	var myForm = this.form;
	if (this.useHTML)
	{
		var s1 = "<form method=\"POST\" action=\"" + url + "\">" + myForm.innerHTML + "</form>"; 
		var s2 = [
			"<scr" + "ipt type=\"text/javascript\">",
			"var f = document.forms[document.forms.length - 1];",
			"f.submit();",
			"</scr" + "ipt>"
		].join("\n");
		var o = getSafeViewObject();
		o.InsertHTML(s1);
		o.InsertHTML(s2);
		this.useHTML = false;
	}
	else
	{
		var isNewForm = (myForm.parentNode == null || myForm.parentNode.nodeType != 1);
		if (isNewForm && this.submitFrame.body != null)
			this.submitFrame.body.appendChild(myForm);
		myForm.action = url;
		myForm.submit();
		if (isNewForm && this.submitFrame.body != null)
			this.submitFrame.body.removeChild(myForm);
	}
	this.form = null;	// next submit() will use a new form
}

// Returns true if query is empty (has no search terms), false otherwise.
NetisQuery.prototype.isEmpty = function()
{
	return (this.terms.length == 0);
}

NetisQuery.prototype.getQueryXML = function()
{
	return "<query><queryDef v=\"1.0\" dbID=\"" + this.dbID + "\">" + this.terms + "</queryDef></query>";
}

NetisQuery.prototype.createForm = function()
{
	if (this.form == null)
	{
		// When opened in SafeView, use the external document as the submit frame.
		if (this.submitFrame == document)
			this.submitFrame = getContainerDocument();
		while (true)
		{
			try {
				this.form = this.submitFrame.createElement("FORM");
				break;
			} catch (e) {
				if (this.useHTML)
					throw e;
				this.useHTML = true;
				this.submitFrame = document;
			}
		}
		this.form.method = "POST";
		this.form.style.display = "none";
		this.form.charset = "windows-1255";
	}
}

NetisQuery.prototype.addParam = function(paramName, paramValue)
{
//	if (paramValue == "") return;
	this.createForm();
	var f = this.form;
	var doc = f.document;	// IE
	if (doc == null)
		doc = f.ownerDocument;	// Mozilla
	var elem = doc.createElement("INPUT");
	with (elem) {
		type = "hidden";
		name = paramName;
		value = paramValue;
	}
	f.appendChild(elem);
}

NetisQuery.prototype.showPage = function(pageID, bReload)
{
	switch (pageID)
	{
		case "search" : this.showSearch(); break;
		case "results" :
			if (this.qid.length == 0)
				this.showResultsDRM();
			else
				this.showResults();
			break;
		case "document": this.showDoc(this.docNo); break;
		default: this.submitTo(pageID); break;
	}
}

NetisQuery.prototype.showResults = function()
{
	this.submitTo(this.resultURL);
}

NetisQuery.prototype.showSearch = function()
{
	this.newSearch();
	this.submitTo(this.searchURL);
}

NetisQuery.prototype.showDoc = function(docNo)
{
	if (docNo != null && docNo != this.docNo)
	{
		this.docNo = docNo;
		this.docID = "";
	}
	this.submitTo(this.docURL);
}

NetisQuery.prototype.showFile = function(docID, fileName)
{
	this.docNo = 0;
	this.submitTo(this.docURL + "?f=" + fileName + "&docID=" + docID);
}

NetisQuery.prototype.showLogin = function(returnPage, bReload)
{
	if (returnPage != null)
		this.setReturnPage(returnPage, bReload);
	this.submitTo(this.loginURL);
}

NetisQuery.prototype.setReturnPage = function(returnPage, bReload)
{
	if (returnPage == null || returnPage == "")
	{
		this.returnPage = "";
	}
	else
	{
		var c = (bReload || (bReload == null)) ? "!" : ".";
		if (returnPage.charAt(0) != c)
			returnPage = c + returnPage;
		this.returnPage = returnPage;
	}
}

NetisQuery.prototype.showReturnPage = function()
{
	var s = this.returnPage;
	if (s == null || s == "")
		return;
	this.returnPage = "";
	var c = s.charAt(0);
	switch (c)
	{
		case "!":
			this.showPage(s.substr(1, s.length - 1), true);
			break;
		case ".":
			this.showPage(s.substr(1, s.length - 1), false);
			break;
		default:
			this.showPage(s, true);
	}
}

NetisQuery.prototype.showCollectionProducts = function(dbID)
{
	if (dbID == null)
		dbID = this.dbID;
//	this.submitTo("CollectionInfo.aspx?dbID=" + dbID);		// does not return
	this.submitTo("TitleInfo.aspx");		// does not return
}

NetisQuery.prototype.showDocumentProducts = function(titleID)
{
	this.submitTo("TitleInfo.aspx?tid=" + titleID);		// does not return
}

NetisQuery.prototype.goBack = function()
{
	history.back(1);
}

// ------------------------------------------------------------------------------------//
// Result list DRM
// ------------------------------------------------------------------------------------//

NetisQuery.prototype.isEcommerceOn = function()	{ return (this.regMode == 2); }

// Returns true if the user wants to proceed with query, false otherwise
NetisQuery.prototype.verifyCost = function(total, cost, balance)
{
	if (cost <= 0 || balance < 0)	// negative balance = no limit
		return true;
		
	if (cost <= balance)
	{
		var msg = "Your query returned " + total + " results\nYour current balance is: " + balance +
		"\nBalance after viewing results will be: " + (balance - cost) + "\n\nDo you want to proceed?";
		return confirm(msg);
	}
	else
	{
		var msg = "Your query returned " + total + " results\nYour current balance is: " + balance;
		if (this.isEcommerceOn()) {
			msg += "\nYou need to buy some of our products, or refine your search criteria.";
			msg += "\n\nDo you want to buy something?"
			if (confirm(msg))
			{
				this.showCollectionProducts();
				return false;
			}
		} else {
			msg += "\nPlease contact the site administrator.";
			alert(msg);
		}
		return false;
	}
}

NetisQuery.prototype.onNoResults = function()
{
	alert(MSG_NO_RESULTS);
}

NetisQuery.prototype.checkResponse = function(elem) {
    var total = new Number(elem.getAttribute("total"));
    if (total == 0) {
        this.onNoResults();
        return false;
    }
    else if (total == 1) {
        this.docNo = 1; 
        this.documentsIds = elem.getAttribute("documentId");
    }
    var qid = elem.getAttribute("qid");
    var cost = new Number(elem.getAttribute("cost"));
    var balance = new Number(elem.getAttribute("balance"));
    if (!this.verifyCost(total, cost, balance))
        return false;

    this.resultsCount = total;
    this.qid = qid;
    this.showResults();
    return true;
}

NetisQuery.prototype.showResultsDRM = function() {
    if (this.terms.length == 0)
        throw MSG_ENTER_TERMS;

    var oRequest = XmlHttp.createNew();
    if (oRequest == null) {
        // Either ActiveX is disabled altogether, or we don't have XMLHTTP.
        if (Compat.isActiveXEnabled())
            throw "XMLHTTP not available.\nPlease install IE 5 or greater.";
        return;
    }

    var re = /^folderId:([0-9]+)~searchId:([0-9]+)$/;
    var arr = re.exec(this.terms)
    var methodName = (arr == null) ?
			        "GetResults?queryId=" + this.key + "&queryString=" + this.terms
                    :
                    "GetResultsDetailsFromSavedQuery?folderId=" + arr[1] + "&userQueryId=" + arr[2] + "&queryId=" + this.key;
    //var sURL = makeAbsolute(this.appRoot, "NetisUtils/srvrutil_xmlquery.aspx?key=" + this.key);
    var sURL = makeAbsolute(this.appRoot, "Service/SearchEngineService.asmx/" + methodName + "&useCache=true");
    oRequest.open("GET", sURL, false);
    //oRequest.send(this.getQueryXML());
    oRequest.send();

    var doc = oRequest.responseXML;
    var root = doc.documentElement;
    if (root == null)
        throw "Empty server response.";

    switch (root.tagName) {
        case "login":
            alert(MSG_LOGIN_FIRST);
            this.showLogin("search", true);
            return;
            break;
        case "error": throw "Server error:\n\n" + root.text; 	// the server threw an exception
        case "info": throw root.text; 							// server wants to tell us something
        case "query": this.checkResponse(root); break;
        default: throw "Unexpected server response";
    }
}

NetisQuery.prototype.addDocumentIds = function(xmlDoc) {
    var nodes = xmlDoc.selectNodes("//item/@DocumentId");
    var arr = new Array();
    for (var i = 0; i < nodes.length; i++)
        arr.push(nodes.item(i).text);

    if (arr.length > 0)
        q.documentsIds = arr.join(",");
}

// ------------------------------------------------------------------------------------//
// General purpose functions (not members of NetisQuery)
// ------------------------------------------------------------------------------------//

function setSortImage(img, value)
{
	if (value == "desc") {
		img.src = img.getAttribute("imgDown");
		img.value = "desc";
		img.title = MSG_SORTED_DESC;
	} else {
		img.src = img.getAttribute("imgUp");
		img.value = "asc";
		img.title = MSG_SORTED_ASC;
	}
}

function toggleSortImage(img)	{ setSortImage(img, -img.value); }

function getSelectedRadio(name)
{
	var coll = document.getElementsByName(name);
	for (var i = 0; i < coll.length; ++i) {
		var item = coll.item(i);
		if (item.checked)
			return item.value;
	}
	return null;
}
