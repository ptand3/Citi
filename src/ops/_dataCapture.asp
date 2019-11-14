<!-- #include virtual="/cbol/_includes/globals.asp" -->
<%

var bSuccess = true;
var failureMessage = "";
var zip;

if (Request.ServerVariables("REQUEST_METHOD") == "POST") {
	if (Request.Form("zip").Count == 1) {
		try {
			zip = new String(Request.Form("zip"));

			if (!/^\d{5}$/.test(zip)) {
				bSuccess = false;
				failureMessage += "Invalid \"zip\" parameter.";
			}
		}
		catch (error) {
			bSuccess = false;
			failureMessage += "-errCode Invalid Form parameters";
		}
	} else {
		failureMessage += "-errCode \"zip\" Not Provided!";
		bSuccess = false;
	}


	if (bSuccess) {
		try {
			var rx = requestData(zip);
			
		} catch (error) {
			bSuccess = false;
			failureMessage+="-errCode  Failure";
		}

		if (!rx.valid) {
			bSuccess = false;
			failureMessage+="-errCode " + rx.error;
		}

		if (!bSuccess) {
			Response.Write("	failureMessage:" + failureMessage);
		}
		else {
			Response.Write(formatResponse(rx.data));
		}
	}
	else {
		Response.Write("	failureMessage:" + failureMessage);
	}
}
else {
	//Response.Write("POST Request Expected!!!");
}

//=========================================================================================================
//==Functions

function requestData(zip) {
	Debug_WriteLine("<br>Entering requestData......<br>");

	var rs;
	var szSQL;
	var data = {};

	try {
		szSQL = "EXEC ECRM.DBO.CBNA_ZIP_STATE_BTA_LOOKUP @ZIP=" + SQL_String(zip);
		Debug_WriteLine("szSQL = " + szSQL + "<br>");
		rs = ExecuteSQL_eCRM_Recordset( szSQL, true );

		if (rs != null && !rs.eof) {	
			data.zip = rs.Fields("zip").Value;
			data.state = rs.Fields("state").Value;
			data.bta = rs.Fields("bta").Value;
			data.gs = rs.Fields("gs").Value;
			Debug_WriteLine('rs.Fields("zip").Value: ' + data.zip + "<br>");
			Debug_WriteLine('rs.Fields("state").Value: ' + data.state + "<br>");
			Debug_WriteLine('rs.Fields("bta").Value: ' + data.bta + "<br>");
			Debug_WriteLine('rs.Fields("gs").Value: ' + data.gs + "<br>");
			return { valid:true, data:data };
		}

		if (rs != null) {
			rs.Close();
			rs = null;
		}

	} catch (error) {
		Debug_WriteLine( "ERR ECRM.DBO.CBNA_ZIP_STATE_BTA_LOOKUP: " + error.description );
		return {
			valid: false,
			error: error.description
		};
	}
}

function formatResponse (data) {
	return '{"zip":"' + data.zip + '", "state":"' + data.state + '", "bta":"' + data.bta + '", "gs": "' + data.gs + '"}';
}

//=========================================================================================================
%>