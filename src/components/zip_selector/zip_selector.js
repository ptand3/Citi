//////////////////////////////////////////////
// ZIP Selector                             //
//////////////////////////////////////////////
import callAspFile from '../citi-call-aspfile/call-aspfile';
import '../citi-zip-selector/zip-selector.css';
import ZipSelector from '../citi-zip-selector/zip-selector';

function init() {
    
    const zipSelectorObj = new ZipSelector(
        {
            node: document.querySelector('.zs-dialog'),
            zip:  window.btVars.geoZip,
            getZipData: getZipData,
            callback: processZipSelecResult,
        }
    );

    if(!/^\d{5}$/.test(window.btVars.geoZip)) {        
        // Show the ZIP Selector dialog and pass the element that should be focused after closing the dialog
        const headingNode = document.querySelector(".hero .box h1");
        zipSelectorObj.openDialog(headingNode);
        headingNode.setAttribute("tabindex", -1);
        headingNode.addEventListener("blur", removeTabindex);

        function removeTabindex(event) {
            event.target.removeAttribute("tabindex");
            event.target.removeEventListener("blur", removeTabindex);
        }
    } else {
        document.querySelector("#detectedZip").innerHTML = window.btVars.geoZip;
    }
}

//////////////////////////////////////////////
// Get ZIP Data
//////////////////////////////////////////////
function getZipData(zip) {
    if (process.env.NODE_ENV === "development") {
        // Local development code
        return new Promise((resolve, undefined) => {
            resolve({"zip":zip, "state":"FL", "bta":"IN", "gs": "FL"})
            //resolve({"zip":"", "state":"FL", "bta":"IN", "gs": "FL"})   // To add any 6 digits zip to the bogus ZIPs list
        })
    } else {
        // Production code
        return callAspFile("ops/_dataCapture.asp", {"zip": zip}, "json"); // IMPORTANT: This returns a Promise
    }
}

//////////////////////////////////////////////
// Use the ZIP selector results
//////////////////////////////////////////////
function processZipSelecResult(data) {
    window.btVars.zipSelectorData = {
        bta: data.bta,
        gs: data.gs,
        state: data.state,
        zip: data.zip
    }

    document.querySelector("#detectedZip").innerHTML = data.zip;
}

export default init;