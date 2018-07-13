jQuery.sap.declare("Man.Man.util.functions");

Man.Man.functions = {
	
	setWindowHeight: function(){
		return (win_hgt-80) + "px";
	},
	
	setWindowWidth: function(){
		return (win_wdt-65) + "px";
	},
	
//----------------TO IMPORT CSV ----------------//
	importcsv: function(file){
				var oData = [];
            if (file && window.FileReader) {

                var reader = new FileReader();
                var that = this;

                reader.onload = function(e) {

                    var strCSV = e.target.result;
                      Man.Man.functions.CSVToArray(strCSV);
                };

                reader.readAsText(file, 'ISO-8859-1');
                          }
                else{
                		var msg =  Man.Man.formatter.supplyi18Names("csvError");
                	sap.m.MessageToast.show(msg);
                }
		},
		
    		
CSVToArray:	function(strData, strDelimiter) {
    strData = strData.trim();
    strDelimiter = (strDelimiter || ",");
    var objPattern = new RegExp((
    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
    "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
    var arrData = [[]];
    var arrMatches = null;
    while (arrMatches = objPattern.exec(strData)) {
        var strMatchedDelimiter = arrMatches[1];
 
        if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
            arrData.push([]);
        }
        if (arrMatches[2]) {
            var strMatchedValue = arrMatches[2].replace(
            new RegExp("\"\"", "g"), "\"");
        } else {
            var strMatchedValue = arrMatches[3];
        }
        arrData[arrData.length - 1].push(strMatchedValue);
    }
    Man.Man.functions.CSV2JSON(arrData);
},

CSV2JSON: function(array) //this will get the csv in the form of an array
{
    var objArray = [];
    for (var i = 1; i < array.length; i++) {
        objArray[i - 1] = {};
        for (var k = 0; k < array[0].length && k < array[i].length; k++) {
            var key = array[0][k];
            objArray[i - 1][key] = array[i][k];
        }
    }
    
    var jsonObj = objArray;
		var table = sap.ui.getCore().byId(visibleManagedDataTableID);
		var columns = table.getColumns();
			aDetails = table.getModel().data;
			
				var keys = [];
						for (var k in aDetails[0]) {

							keys.push(k);
						}
						var keysNew = [];
						for (var j in jsonObj[0]) {
							keysNew.push(j);
						}

						var is_same = (aDetails.length === keysNew.length) && aDetails.every(function(element, index) {
							return element === keysNew[index];
						});
						if (is_same === true) {
						    var oModel2 = table.getModel();
						    console.log(jsonObj);
						  
						  
						  	var dataToBind = [];
							var totalKeys = Object.keys(jsonObj[0]);
									for (var ind=0;ind<jsonObj.length; ind++){
										var obj = {};
										
										for (var keyno=0; keyno<totalKeys.length; keyno++){
												var key = totalKeys[keyno].replace(/ /g,'');
												obj[key] = jsonObj[ind][totalKeys[keyno]];
										}
										
										dataToBind[ind] = obj;
									
									}
						    
						    
							oModel2.setProperty("/", dataToBind);
							
							oModel2.refresh(true);
							table.getParent().getParent().setIconColor("Positive");
							var msg =  "Uploaded Successfully!";
					    	sap.m.MessageToast.show(msg);
}
},




//--------------------TO IMPORT XML --------------------------//

importxml: function(xml) {
	debugger
	// Create the return object
	var obj = {};

	if (xml.nodeType === 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType === 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) === "undefined") {
				obj[nodeName] = Man.Man.functions.importxml(item);
			} else {
				if (typeof(obj[nodeName].push) === "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(Man.Man.functions.xmlToJson(item));
			}
		}
	}
	console.log(obj);
}
		
};
 