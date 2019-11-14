<!-- #include virtual="/cbol/checking-tiered-offer/ops/_datacapture.asp" --> 
<!-- #include virtual="/cbol/_includes/globals.asp" -->
<!-- #include virtual="/_platform/json2.asp" -->
<%
CheckSecure();

//==GEO ZIP Identification
var szGeoZip = "";
if (g_szIPGEO_ZipCode != null && g_szIPGEO_ZipCode != "-") {
	szGeoZip = new String(g_szIPGEO_ZipCode);
	if (g_bDebugging) {
		Response.Write("<BR>Detected Geo ZIP: " + szGeoZip + "<BR><BR>");
	}
}

//==Query String Driven
var bSuccess = true;
var szDB_Response = "";
var szFormatted_Response = "";
var zipSelectorData = "";
var bZipDetected = 0;
	
if( szGeoZip != "" && szGeoZip != null && szGeoZip != undefined )
{
	bZipDetected = 1;
	if(g_bDebugging)
	{
		Response.Write("<BR>bZipDetected: " + bZipDetected + "<BR>");
	}
	
	try {
		szDB_Response = requestData(szGeoZip);
	} catch (error) {
		bSuccess = false;
	}
	
	if(g_bDebugging)
	{
		Response.Write("szGeoZip: " + szGeoZip + "<BR>");
		Response.Write("szDB_Response: " + JSON.stringify(szDB_Response) + "<BR><BR>");
	}

	if (!szDB_Response.valid) {
		bSuccess = false;
		if(g_bDebugging)
		{
			Response.Write("szDB_Response.error: " + szDB_Response.error );
		}
	}

	if (!bSuccess) {
		szGeoZip = "";
	}
	else {
		zipSelectorData = {
			bta: szDB_Response.data.bta,
			gs: szDB_Response.data.gs,
			state: szDB_Response.data.state,
			zip: szDB_Response.data.zip
		}
		
		zipSelectorData = JSON.stringify(zipSelectorData);
		
		if(g_bDebugging)
		{
			Response.Write("<BR>zipSelectorData: " + zipSelectorData + "<BR><BR>");
		}
	}
}

//=====================================================================================

//=========================================================================================
//==Dynamic Variables
var szPromoCode = "";
var szAppPromoCode = "";
//========================================================================================================
//==Link Pixels
var szSourceCode = "";
var szChannel = "";
var szImpressionPix = "";

//==Main
var szApplyNow200MainPix = "";
var szApplyNow400MainPix = "";
var szApplyNow400RegularMainPix = "";
var szApplyNow400InterestMainPix = "";
var szApplyNow700MainPix = "";
var szApplyNow700RegularMainPix = "";
var szApplyNow700InterestMainPix = "";
//==Get Started
var szApplyNow200GetStartedPix = "";
var szApplyNow400GetStartedPix = "";
var szApplyNow400RegularGetStartedPix = "";
var szApplyNow400InterestGetStartedPix = "";
var szApplyNow700GetStartedPix = "";
var szApplyNow700RegularGetStartedPix = "";
var szApplyNow700InterestGetStartedPix = "";
//==Sticky
var szApplyNow200StickyPix = "";
var szApplyNow400StickyPix = "";
var szApplyNow400RegularStickyPix = "";
var szApplyNow400InterestStickyPix = "";
var szApplyNow700StickyPix = "";
var szApplyNow700RegularStickyPix = "";
var szApplyNow700InterestStickyPix = "";

var szOfferCode200 = "4EDYNGQ8JVDEFT";
var szOfferCode400 = "4EDYNGQ8JVDEFT";
var szOfferCode700 = "4EDYNGQ8JVDEFT";

if (Request.QueryString("channel").Count > 0){
    
	szChannel = new String(Request.QueryString("channel")).toLowerCase();
	if ( g_bDebugging )
		Response.Write("<BR>Incoming szChannel: " + szChannel + "<BR>");
}
else 
{
	szChannel = "";
	if ( g_bDebugging )
		Response.Write("<BR>NO Incoming Channel FOUND!<BR>");
}

switch(szChannel) {
	case "onsite":
		szImpressionPix = "62522";
		szApplyNow200MainPix = "62480"; szApplyNow400MainPix = "62486"; szApplyNow400RegularMainPix = "62488"; szApplyNow400InterestMainPix = "62490"; szApplyNow700MainPix = "62504"; szApplyNow700RegularMainPix = "62506"; szApplyNow700InterestMainPix = "62508";
		szApplyNow200GetStartedPix = "62484"; szApplyNow400GetStartedPix = "62498"; szApplyNow400RegularGetStartedPix = "62500"; szApplyNow400InterestGetStartedPix = "62502"; szApplyNow700GetStartedPix = "62516"; szApplyNow700RegularGetStartedPix = "62518"; szApplyNow700InterestGetStartedPix = "62520";
		szApplyNow200StickyPix = "62482"; szApplyNow400StickyPix = "62492"; szApplyNow400RegularStickyPix = "62494"; szApplyNow400InterestStickyPix = "62496"; szApplyNow700StickyPix = "62510"; szApplyNow700RegularStickyPix = "62512"; szApplyNow700InterestStickyPix = "62514";
		
		if (Request.QueryString("sc").Count > 0){
			
			szSourceCode = new String(Request.QueryString("sc")).toLowerCase();
			if ( g_bDebugging )
				Response.Write("<BR>Incoming szSourceCode: " + szSourceCode + "<BR>");
		}
		else 
		{
			szSourceCode = "";
			if ( g_bDebugging )
				Response.Write("<BR>NO Incoming SourceCode FOUND!<BR>");
		}

		switch(szSourceCode) {
			case "onsite-hp":
				szOfferCode200 = "4EDYNGQ8JVCHPA"; szOfferCode400 = "4EDYNGQ8JVCHPA"; szOfferCode700 = "4EDYNGQ8JVCHPA";
				break;
			case "onsite-pb-chk":
				szOfferCode200 = "4EDYNGQ8JVCPBA"; szOfferCode400 = "4EDYNGQ8JVCPBA"; szOfferCode700 = "4EDYNGQ8JVCPBA";
				break;
			case "onsite-pb-sav":
				szOfferCode200 = "4EDYNGQ8JVCPBB"; szOfferCode400 = "4EDYNGQ8JVCPBB"; szOfferCode700 = "4EDYNGQ8JVCPBB";
				break;
			case "onsite-pb-cd":
				szOfferCode200 = "4EDYNGQ8JVCPBC"; szOfferCode400 = "4EDYNGQ8JVCPBC"; szOfferCode700 = "4EDYNGQ8JVCPBC";
				break;
			case "onsite-sop1":
				szOfferCode200 = "4EDYNGQ8JVCSOA"; szOfferCode400 = "4EDYNGQ8JVCSOA"; szOfferCode700 = "4EDYNGQ8JVCSOA";
				break;
			case "onsite-sop3":
				szOfferCode200 = "4EDYNGQ8JVCSOC"; szOfferCode400 = "4EDYNGQ8JVCSOC"; szOfferCode700 = "4EDYNGQ8JVCSOC";
				break;
			case "onsite-sop4":
				szOfferCode200 = "4EDYNGQ8JVCSOD"; szOfferCode400 = "4EDYNGQ8JVCSOD"; szOfferCode700 = "4EDYNGQ8JVCSOD";
				break;
			case "onsite-la-ms":
				szOfferCode200 = "4EDYNGQ8JVCLAM"; szOfferCode400 = "4EDYNGQ8JVCLAM"; szOfferCode700 = "4EDYNGQ8JVCLAM";
				break;
			case "onsite-nyc-ms":
				szOfferCode200 = "4EDYNGQ8JVCNYM"; szOfferCode400 = "4EDYNGQ8JVCNYM"; szOfferCode700 = "4EDYNGQ8JVCNYM";
				break;
			case "onsite-mia-ms":
				szOfferCode200 = "4EDYNGQ8JVCMMM"; szOfferCode400 = "4EDYNGQ8JVCMMM"; szOfferCode700 = "4EDYNGQ8JVCMMM";
				break;
			case "onsite-cbaw-mp":
				szOfferCode200 = "4EDYNGQ8JVCBWM"; szOfferCode400 = "4EDYNGQ8JVCBWM"; szOfferCode700 = "4EDYNGQ8JVCBWM";
				break;
			case "onsite-vny":
				szOfferCode200 = "4EDYNGQ8JVCVAT"; szOfferCode400 = "4EDYNGQ8JVCVAT"; szOfferCode700 = "4EDYNGQ8JVCVAT";
				break;
			case "onsite-cc-hp":
				szOfferCode200 = "4EDYNGQ8JVCCHP"; szOfferCode400 = "4EDYNGQ8JVCCHP"; szOfferCode700 = "4EDYNGQ8JVCCHP";
				break;
			case "onsite-ces-op":
				szOfferCode200 = "4EDYNGQ8JVCETS"; szOfferCode400 = "4EDYNGQ8JVCETS"; szOfferCode700 = "4EDYNGQ8JVCETS";
				break;
			case "onsite-ex2":
				szOfferCode200 = "4EDYNGQ8JVCXAA"; szOfferCode400 = "4EDYNGQ8JVCXAA"; szOfferCode700 = "4EDYNGQ8JVCXAA";
				break;
			case "onsite-ex3":
				szOfferCode200 = "4EDYNGQ8JVCXBB"; szOfferCode400 = "4EDYNGQ8JVCXBB"; szOfferCode700 = "4EDYNGQ8JVCXBB";
				break;
		}
		break;
	
	case "btl-display":
		szImpressionPix = "62523";
		szApplyNow200MainPix = "62481"; szApplyNow400MainPix = "62487"; szApplyNow400RegularMainPix = "62489"; szApplyNow400InterestMainPix = "62491"; szApplyNow700MainPix = "62505"; szApplyNow700RegularMainPix = "62507"; szApplyNow700InterestMainPix = "62509";
		szApplyNow200GetStartedPix = "62485"; szApplyNow400GetStartedPix = "62499"; szApplyNow400RegularGetStartedPix = "62501"; szApplyNow400InterestGetStartedPix = "62503"; szApplyNow700GetStartedPix = "62517"; szApplyNow700RegularGetStartedPix = "62519"; szApplyNow700InterestGetStartedPix = "62521";
		szApplyNow200StickyPix = "62483"; szApplyNow400StickyPix = "62493"; szApplyNow400RegularStickyPix = "62495"; szApplyNow400InterestStickyPix = "62497"; szApplyNow700StickyPix = "62511"; szApplyNow700RegularStickyPix = "62513"; szApplyNow700InterestStickyPix = "62515";
		
		if (Request.QueryString("sc").Count > 0){
			
			szSourceCode = new String(Request.QueryString("sc")).toLowerCase();
			if ( g_bDebugging )
				Response.Write("<BR>Incoming szSourceCode: " + szSourceCode + "<BR>");
		}
		else 
		{
			szSourceCode = "";
			if ( g_bDebugging )
				Response.Write("<BR>NO Incoming SourceCode FOUND!<BR>");
		}

		switch(szSourceCode) {
			case "btl-rem-td":
				szOfferCode200 = "4EDYNGQ8JVDRTD"; szOfferCode400 = "4EDYNGQ8JVDRTD"; szOfferCode700 = "4EDYNGQ8JVDRTD";
				break;
			case "btl-pro-csl":
				szOfferCode200 = "4EDYNGQ8JVDPCA"; szOfferCode400 = "4EDYNGQ8JVDPCA"; szOfferCode700 = "4EDYNGQ8JVDPCA";
				break;
			case "btl-pro-exp":
				szOfferCode200 = "4EDYNGQ8JVDPEX"; szOfferCode400 = "4EDYNGQ8JVDPEX"; szOfferCode700 = "4EDYNGQ8JVDPEX";
				break;
			case "btl-pro-vzn":
				szOfferCode200 = "4EDYNGQ8JVDPVZ"; szOfferCode400 = "4EDYNGQ8JVDPVZ"; szOfferCode700 = "4EDYNGQ8JVDPVZ";
				break;
			case "btl-pro-mbt":
				szOfferCode200 = "4EDYNGQ8JVAMBT"; szOfferCode400 = "4EDYNGQ8JVAMBT"; szOfferCode700 = "4EDYNGQ8JVAMBT";
				break;
			case "btl-pro-gbr":
				szOfferCode200 = "4EDYNGQ8JVAGBR"; szOfferCode400 = "4EDYNGQ8JVAGBR"; szOfferCode700 = "4EDYNGQ8JVAGBR";
				break;
			case "btl-pro-qst":
				szOfferCode200 = "4EDYNGQ8JVAPQS"; szOfferCode400 = "4EDYNGQ8JVAPQS"; szOfferCode700 = "4EDYNGQ8JVAPQS";
				break;
		}
		break;
	
	case "ps":
		szImpressionPix = "61821";
		szApplyNow200MainPix = "61822"; szApplyNow400MainPix = "61825"; szApplyNow400RegularMainPix = "61826"; szApplyNow400InterestMainPix = "61827"; szApplyNow700MainPix = "61834"; szApplyNow700RegularMainPix = "61835"; szApplyNow700InterestMainPix = "61836";
		szApplyNow200GetStartedPix = "61824"; szApplyNow400GetStartedPix = "61831"; szApplyNow400RegularGetStartedPix = "61832"; szApplyNow400InterestGetStartedPix = "61833"; szApplyNow700GetStartedPix = "61840"; szApplyNow700RegularGetStartedPix = "61841"; szApplyNow700InterestGetStartedPix = "61842";
		szApplyNow200StickyPix = "61823"; szApplyNow400StickyPix = "61828"; szApplyNow400RegularStickyPix = "61829"; szApplyNow400InterestStickyPix = "61830"; szApplyNow700StickyPix = "61837"; szApplyNow700RegularStickyPix = "61838"; szApplyNow700InterestStickyPix = "61839";
		
		if (Request.QueryString("sc").Count > 0){
			
			szSourceCode = new String(Request.QueryString("sc")).toLowerCase();
			if ( g_bDebugging )
				Response.Write("<BR>Incoming szSourceCode: " + szSourceCode + "<BR>");
		}
		else 
		{
			szSourceCode = "";
			if ( g_bDebugging )
				Response.Write("<BR>NO Incoming SourceCode FOUND!<BR>");
		}

		switch(szSourceCode) {
			case "ps-ggl-br":
				szOfferCode200 = "4EDYNGQ8JVSGBR"; szOfferCode400 = "4EDYNGQ8JVSGBR"; szOfferCode700 = "4EDYNGQ8JVSGBR";
				break;
			case "ps-ggl-nbr":
				szOfferCode200 = "4EDYNGQ8JVSGNB"; szOfferCode400 = "4EDYNGQ8JVSGNB"; szOfferCode700 = "4EDYNGQ8JVSGNB";
				break;
			case "ps-ggl-gml":
				szOfferCode200 = "4EDYNGQ8JVSGGL"; szOfferCode400 = "4EDYNGQ8JVSGGL"; szOfferCode700 = "4EDYNGQ8JVSGGL";
				break;
			case "ps-msn-br":
				szOfferCode200 = "4EDYNGQ8JVSBBR"; szOfferCode400 = "4EDYNGQ8JVSBBR"; szOfferCode700 = "4EDYNGQ8JVSBBR";
				break;
			case "ps-msn-nbr":
				szOfferCode200 = "4EDYNGQ8JVSBNB"; szOfferCode400 = "4EDYNGQ8JVSBNB"; szOfferCode700 = "4EDYNGQ8JVSBNB";
				break;
			case "ps-fcs":
				szOfferCode200 = "4EDYNGQ8JVSFCS"; szOfferCode400 = "4EDYNGQ8JVSFCS"; szOfferCode700 = "4EDYNGQ8JVSFCS";
				break;
		}
		break;
	
	default:
		szImpressionPix = "61284";
		szApplyNow200MainPix = "61283"; szApplyNow400MainPix = "61287"; szApplyNow400RegularMainPix = "61288"; szApplyNow400InterestMainPix = "61289"; szApplyNow700MainPix = "61296"; szApplyNow700RegularMainPix = "61297"; szApplyNow700InterestMainPix = "61298";
		szApplyNow200GetStartedPix = "61286"; szApplyNow400GetStartedPix = "61293"; szApplyNow400RegularGetStartedPix = "61294"; szApplyNow400InterestGetStartedPix = "61295"; szApplyNow700GetStartedPix = "61302"; szApplyNow700RegularGetStartedPix = "61303"; szApplyNow700InterestGetStartedPix = "61304";
		szApplyNow200StickyPix = "61285"; szApplyNow400StickyPix = "61290"; szApplyNow400RegularStickyPix = "61291"; szApplyNow400InterestStickyPix = "61292"; szApplyNow700StickyPix = "61299"; szApplyNow700RegularStickyPix = "61300"; szApplyNow700InterestStickyPix = "61301";
}

if ( g_bDebugging )
{
	Response.Write("<BR>szImpressionPix: " + szImpressionPix + "<BR>");
	Response.Write("szApplyNow200MainPix: " + szApplyNow200MainPix + "<BR>");
	Response.Write("szApplyNow200GetStartedPix: " + szApplyNow200GetStartedPix + "<BR>");
	Response.Write("szApplyNow200StickyPix: " + szApplyNow200StickyPix + "<BR>");
	Response.Write("szApplyNow400MainPix: " + szApplyNow400MainPix + "<BR>");
	Response.Write("szApplyNow400GetStartedPix: " + szApplyNow400GetStartedPix + "<BR>");
	Response.Write("szApplyNow400StickyPix: " + szApplyNow400StickyPix + "<BR>");
	Response.Write("szApplyNow700MainPix: " + szApplyNow700MainPix + "<BR>");
	Response.Write("szApplyNow700GetStartedPix: " + szApplyNow700GetStartedPix + "<BR>");
	Response.Write("szApplyNow700StickyPix: " + szApplyNow700StickyPix + "<BR>");
	Response.Write("szOfferCode200: " + szOfferCode200 + "<BR>");
	Response.Write("szOfferCode400: " + szOfferCode400 + "<BR>");
	Response.Write("szOfferCode700: " + szOfferCode700 + "<BR>");
}
	
var szHost = Request.ServerVariables("SERVER_NAME");
	szHost = new String(szHost);
	szHost = szHost.toLowerCase();
	
if ( g_bDebugging )
{
	Response.Write("<BR>Host: " + szHost + "<BR>");
}	

function redirectHome()
{
	var pDefault = new Parameters( "http://citi.com", null );
	//pDefault.AddQS( );
	Redir (pDefault.GetURL());
}
%>