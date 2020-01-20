var bAddExceptionFlag = false;
//var appDomain = "http://takdin.hashavim.co.il/searchg/";
//var appDomain = "http://localhost/Hashavim.Web.Takdin.takdinlight/";
var sHomeUrl = getsHomeUrl();

MaximizeWin();

function getsHomeUrl() {
    var tempUrl = document.location.href;
    for (var i = 0; i < 4; i++) {
        tempUrl = tempUrl.substring(tempUrl.indexOf("/") + 1);
    }
    return document.location.href.substring(0, document.location.href.length - tempUrl.length - 1);
}

function trim(s)
{
	return s.replace(/^\s+/g, "").replace(/\s+$/g, "");
}

function sendQuery() {
    //חדש
    var tblPorfolio = document.getElementById("tblPorfolio");
    tblPorfolio.style.display = "none";
	var o = document.getElementById("searchTerm");
	var s = o.value;
	s = trim(s);
	if(s == "")
	{
		alert("נא הכנס ערך לחיפוש");
		o.focus();
		return;
	}
	var sUrl = encodeURI(s.replace(/\//g, "~~").replace(/^\"(.+?)\"$/g,"[$1]").replace(/"/g,"")) + ".html";
	if(bAddExceptionFlag)
	    sUrl += "&e=yes";
	top.document.location.replace(sUrl);
}

function checkKey(evnt, sName)
{
	// checks whether the ENTER key is pressed 
	// If Yes - sendquery
	if (!evnt)
		evnt = window.event;
	var evt = Compat.getEvent(evnt);

	if (evt.target.id == "comments")
		return;

	if (evt.keyCode == 13)  
	{
		evt.stopPropagation();
		switch(sName)
		{
	   		case "searchform": sendQuery(); break;
	   		case "shop": submitShop(); break;
	   		case "remove": submitRemove(); break;	   		
	   		case "thanks":	   goDoc();break;	   		
	   		case "contact":	   submitContactForm();break;
	   	}
	}
}


function init()
{
    document.getElementById("searchTerm").focus();   
}
//////////////////////////shop////////////////////////////////
//Load shop
function initShop()
{
    loadComboYears("CreditCardExpirationYear");
    document.getElementById("CreditCardNumber").focus();
}

function loadComboYears(cbName)
{
	try{
		var oOption;
		var sDate = new Date();
		var sYear = sDate.getFullYear();
		var shortYear;
		// add first empty line to CB
		oOption = document.createElement("option");
		oOption.text = "בחר שנה";
		oOption.value = "";	
		var oCB = document.getElementById(cbName);
		oCB.options.add(oOption);
			
		// now, lets add next 10 years
		for (var i = 0; i < 10; ++i) {
			
			oOption = document.createElement("option");
			oOption.text = sYear;
			shortYear = new String(sYear);
			oOption.value = shortYear.substr(2, 2);
			oCB.options.add(oOption);
			sYear++;
		}
	}catch(e){alert(e.description);}
}

//validate shop
function checkObligatoryFields(oForm)
{
	var oElements = oForm.elements;
	var oElement;
	var sValue;
	for(var i = 0; i < oElements.length; i++)
	{ 
		oElement = oElements[i];
		if(oElement.getAttribute("must") == "yes")
		{
			sValue = getElementValue(oElement);
			if(isEmpty(sValue, oElement))
				return false;
			if(oElement.id == "email")
				if(!isValidEmail(sValue, oElement))
					return false;
			if (oElement.id == "emailConfirm")
			    if (!isMatchEmail(sValue, oElement))
			        return false;
			if(oElement.getAttribute("isnumeric") == "yes")
				if(!checkIsNumeric(oElement))
					return false;
		}
	}
	return true;
}

function getElementValue(o)
{
	switch(o.type)
	{
		case "textarea":
		case "select-one":
		case "text":   return o.value;
		case "radio":  return getSelectedRadio(o);
		default :	   return "";
	}
}

// Email address validation
function isValidEmail(s, o)
{
    if (!((s.search(/^.+@.+\..+/) > -1) && (s.search(/[א-ת ]/i) == -1))) 		// match e-mail pattern
	{
		alert("כתובת דוא\"ל לא חוקית");
		o.focus();
		return false;
	}
	return true;
}

function isMatchEmail(s, o)
	{
	    var p = document.getElementById("email");
	    if(s != p.value)
	    {
	        alert("הכתובת בשדה [אימות אימייל] אינה זהה לכתובת בשדה [אימייל].\n אנא תקנו ונסו שנית");
	        o.focus();
	        return false;
	    }
	    return true;    
	}

function isEmpty(s, o)
{
	if(trim(s) == "")
	{
		alert("יש למלא שדה [ " + o.getAttribute("title") + "]");
		o.focus();
		return true;
	}
	return false;
}

function checkIsNumeric(o)
{
    var re = new RegExp("[^0-9]");        
	var creditCard =  document.getElementById("CreditCardNumber").value;   
	if (re.test(o.value))	
	{
		alert("השדה " + "[" + o.getAttribute("title") + "]" + " יכול להכיל רק ערכים מספריים 0-9");
		o.focus();
		return false;
	}
	if (o.name == "identinum")
	{
		if(o.value.length > 9)
		{
			alert("אורך מקסימלי של 9 ספרות לשדה תעודת זהות");
			o.focus();
			return false;
		}
	}
	if (o.name == "cvv2")
	{
		if(o.value.length != 4 && o.value.length != 3)
		{
			alert("השדה [3 ספרות אחרונות בגב הכרטיס] הינו מספר באורך של 3 או 4 ספרות הנמצאות בגב הכרטיס");
			o.focus();
			return false;
		}

		if ((o.value == creditCard.substr(creditCard.length - 4)) || (o.value == creditCard.substr(creditCard.length - 3)))
		{
		    if (!confirm("אנא ודא כי הוזנו 3 הספרות האחרונות מגב הכרטיס ולא 3 הספרות האחרונות של מספר כרטיס אשראי.\n האם להמשיך?"))
		    return;
		}
	}
	return true;
}

function getSelectedRadio(o)
{
	var CB = document.getElementsByName(o.name);
	for (var i = 0; i < CB.length; ++i) {
		if (CB.item(i).checked)
			return CB.item(i).value;
	}
	return "";
}

//validate suubmit form 
var bFirst = true;
function oSubmitShop()
{
    if(!bFirst)
    {
        bFirst = true;
        return false;
    }
    bFirst = false;

	var oForm = document.getElementById("CustDetails");  
    return checkObligatoryFields(oForm);
    if (Compat.isIE)
		bFirst = true;
    return false;
    
}
//submit shop
function submitShop()
{
	var oForm = document.getElementById("CustDetails");
	if (oForm.onsubmit())
    {
		document.getElementById("did").value = did;
		document.getElementById("docTitle").value = docTitle;
		oForm.submit();
     }
}

function goToShop() {
    //window.location.replace("https://secure.hashavim.co.il/TakdinOnlinePurchase/PayForm.aspx?docId=" + did + "&prodid=14&action=1");
    window.location.assign("https://secure.hashavim.co.il/TakdinOnlinePurchase/PayForm.aspx?docId=" + did + "&prodid=14&action=1");
}

function oSubmitRemove() {
    if (!bFirst) {
        bFirst = true;
        return false;
    }
    

    var oForm = document.getElementById("CustDetails");
    if (!checkObligatoryFields(oForm))
        return false;
    var oCondition = document.getElementById("cbConditions");
    if (!oCondition.checked) {
        alert("לא סימנת \"קראתי והבנתי את תהליך הסרת המסמך, ואני מאשר את תנאי השימוש.\"");
        return false;
    }
    bFirst = false;
    return true;
}
//submit remove
function submitRemove() {
    var oForm = document.getElementById("CustDetails");
    if (oForm.onsubmit()) {
        document.getElementById("docURL").value = docURL;
        document.getElementById("docTitle").value = docTitle;
        oForm.submit();
    }
}

function getSEOUrl(s) {
    var lastIndexOf = s.lastIndexOf("/");
    if (lastIndexOf != -1)
        s = s.substring(lastIndexOf + 1);
    return s;
}

function goContactToRemove() {
 
    //var q = new NetisQuery();
    //q.addParam("docTitle", document.getElementById("docTitle").innerText);
    var seoURL = getSEOUrl(window.location.href);
    //q.addParam("dateDoc", dateDoc);
    //q.submitTo("http://www.takdin.co.il/search/searchg/searchgcontactfrm.aspx");
    window.location.replace(sHomeUrl + "/searchgcontactfrm.aspx?docURL=" + escape(seoURL));
}

function RemoveDeny(element) {
    element.innerHTML = "לקוח יקר, לא ניתן להסיר מסמך זה מאחר שהוא פורסם על ידי בית המשפט העליון או בית הדין הארצי לעבודה. במידה שהנך מעוניין לפנות אלינו בנושא, אנא פנה אלינו במייל<br/><a style='text-decoration:underline;' href='mailto:Takdin@hashavim.co.il'>Takdin@hashavim.co.il</a>";
}
function goToRemove(bFromDoc) {
    var seoUrl = (bFromDoc) ? getSEOUrl(window.location.href) : docURL;
    window.location.replace("https://secure.hashavim.co.il/TakdinOnlinePurchase/PayForm.aspx?docId=" + did + "&prodid=14&action=2&seoUrl=" + escape(seoUrl));
}

function isResponseError(oXml)
{
	return oXml.documentElement.tagName.toLowerCase() == "error";
}

function responseContent(oXml)
{
	return oXml.documentElement.text;
}

function openCvv2()
{
	var sUrl = "searchgcvv2.html";
	Compat.openWindow({ url: sUrl, name:"_blank", focus: true },{ width:460, height:450, menubar:"no"});
}

function openWin(sUrl)
{
	window.open(sUrl,"_blank");
}

//submit contact form
//submit shop
function submitContactForm()
{
	var oForm = document.getElementById("searchgContact");
	var oElements = oForm.elements;
	if (checkObligatoryFields(oForm))
	{
	    if (document.getElementById("sendAdv").checked) {

	        document.getElementById("buttons").style.display = "none";
	        document.getElementById("msg").value = document.getElementById("contactContent").innerHTML;
	        oForm.submit();
	    }
	    else {
            alert("עליך לאשר הסכם שימוש ואחריות")
	    }

	}
}

//cancel purchase
function cancelPurchase(evt)
{
    evt = Compat.getEvent(evt);
    evt.stopPropagation();
    evt.preventDefault();	

    window.location.replace("http://www.takdin.co.il/searchg");
}

function displayCVV(bOn, evt)
{
	evt = Compat.getEvent(evt);
	evt.stopPropagation();
	var element = evt.target;
	var newCvv = document.getElementById("newCvv");

	if (bOn)
	    newCvv.style.visibility = "visible";
	else
		newCvv.style.visibility = "hidden";
}

function onScrolling()
{
    try{
        var iTop = (navigator.appName == "Microsoft Internet Explorer") ? document.body.scrollTop : window.pageYOffset;
        document.getElementById("adv1").style.top = iTop;
        document.getElementById("adv2").style.top = iTop;
    }catch(e){}
}

function MaximizeWin() {
    try {
        window.moveTo(0, 0);
        window.resizeTo(screen.width, screen.height);
    } catch (e) { }
}

window.onload = function ()
{
    var DomainLink = "http://" + window.location.hostname;

    if (typeof document.getElementById("Contact") !== "undefined") {
        document.getElementById("Contact").setAttribute("href", DomainLink + "/Contact.aspx");
    }
   
    if (typeof document.getElementById("Portal") !== "undefined") {
        document.getElementById("Portal").setAttribute("href", DomainLink);
    }

    if (typeof document.getElementById("Maagar") !== "undefined") {
        document.getElementById("Maagar").setAttribute("href", DomainLink + "/search");
    }

    if (typeof document.getElementById("LegalNews") !== "undefined") {
        document.getElementById("LegalNews").setAttribute("href", DomainLink + "/Pages/LegalNews.aspx");
    }

    if (typeof document.getElementById("Lawyers") !== "undefined") {
        document.getElementById("Lawyers").setAttribute("href", DomainLink + "/LawyerPortfolios/Pages/SearchResult.aspx");
    }

    if (typeof document.getElementById("Students") !== "undefined") {
        document.getElementById("Students").setAttribute("href", DomainLink + "/Pages/RegisterStudent.aspx");
    }

    if (typeof document.getElementById("Contracts") !== "undefined") {
        document.getElementById("Contracts").setAttribute("href", DomainLink + "/Hozim/Pages/Default.aspx");
    }

    if (typeof document.getElementById("Taktzirim") !== "undefined") {
        document.getElementById("Taktzirim").setAttribute("href", DomainLink + "/Pages/Summaries.aspx");
    }

    if (typeof document.getElementById("TakdinLight") !== "undefined") {
        document.getElementById("TakdinLight").setAttribute("href", DomainLink + "/searchg/");
    }

}

function NewContact(){   
    var company = $('#company').val();        
    var fullName = $('#fullName').val();
    var phone = $('#phone').val();
    var email = $('#email').val();

    if (!Required(fullName)) {
        alert("אנא הזן שם מלא");
        return false;
    }
   
    if (!Required(phone)) {
        alert("אנא הזן טלפון");
        return false;
    }
    else {
        if (!IsPhone(phone)) {
            alert("מספר טלפון אינו חוקי");
            return false;
        }
    }
    
    if (!Required(email)) {
        alert("אנא הזן כתובת מייל");
        return false;
    }
    else {
        if (!IsEmail(email)) {
            alert("כתובת מייל אינה חוקית");
            return false;
        }
    }
    var webMethod = "service/SearchLightEngineService.asmx/NewContact";
    var parameters = "{'company':'" + company + "','fullName':'" + fullName + "','phone':'" + phone + "','email':'" + email + "'}";

    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            window.location = "http://www.takdin.co.il/RequestConfirmation.aspx?status=true&department=experience";
        },
        error: function (e) {
            alert("Unavailable");
        }
    });
}

function IsEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function IsPhone(phone) {
    var regex = /^([0-9\-\(\)\s]+$)/;
    return regex.test(phone);
}

function Required(item) {
    if (item.length > 0) {
        return true;
    }
    return false;
}

