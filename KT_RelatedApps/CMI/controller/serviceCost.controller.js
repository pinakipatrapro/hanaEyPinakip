var serviceCostView, adata=[], ddata=[];
var tab2Data;
var duplicacyCheckListCSP;
var cspSaveVersionDialog;
sap.ui.controller("controllers.serviceCost", {

	onInit: function() { 
	    	 this.router = sap.ui.core.UIComponent.getRouterFor(this);
			serviceCostView = this;
			
				var sccModel = new sap.ui.model.json.JSONModel();
			     sccModel.setData({});
				 serviceCostView.getView().byId("sccTab").setModel(sccModel);
					var cspModel = new sap.ui.model.json.JSONModel({});
				serviceCostView.getView().byId("cspTable").setModel(cspModel);
			 
			   sap.ui.controller("controllers.serviceCost").initialiseVersions();
			  
      Man.Man.declarations.main.controlobject.detailWindowPage.setShowHeader(true);
      Man.Man.declarations.main.controlobject.sideNav.setVisible(true); 
			  
			 },
	
	
	onAfterRendering: function(){
	},
	
	
	initialiseVersions: function(){
      var serviceVersions, costVersions;
      
      var serviceSelect = serviceCostView.byId("serviceVersionSelector");
      var costSelect = serviceCostView.byId("costVersionSelector");

      	$.ajax({
			url: "services/getManageTableVersions.xsjs?TableName=" + 'SC',
			method: "GET",
            async: false,
			     success : function(data, textStatus, jqXHR) {
			         data.splice(0,1);
			    	serviceVersions = data;
				     var serviceModel = new sap.ui.model.json.JSONModel(serviceVersions);
				     
					var serviceSelectTemplate = new sap.ui.core.Item({
						text: "{VERSION}",
						key: "{KEY}"
					});
             
					serviceSelect.setModel(serviceModel);

					serviceSelect.bindAggregation(
						"items",
						"/",
						serviceSelectTemplate);
				    
				    	costSelect.setModel(serviceModel);

					costSelect.bindAggregation(
						"items",
						"/",
						serviceSelectTemplate);
			     },
			     error: function(xhr, status)
			     {		var errorCode = xhr.status;
			    		var errorDesc = xhr.statusText;
			           console.error(errorCode + ":" + errorDesc);    
			           	sap.m.MessageToast.show('Error ' + errorCode + ":" + errorDesc);
			     },
			     complete : function(xhr,status) {			           
			           console.log("Complete"); 			           
			     }
		    }); 
		    
		
  },
  
 changeVersion: function(e){
      debugger;
      var version = e.getSource().getSelectedItem().getText();
      var selectorId = e.getSource().sId.split("--")[1];
      var table = e.getSource().getParent().getParent().getContent()[1];
      var tableName;
      
       var rows = table.getItems();
      
	  switch(selectorId){
	      case "serviceVersionSelector": tableName = "ServiceCost";
	      	                                for (var rowInd=0; rowInd<rows.length; rowInd++){
                                              var currRow = rows[rowInd];
                                              currRow.getCells()[2].removeStyleClass("showInputChange");
                                              currRow.getCells()[4].removeStyleClass("showInputChange");
                                              currRow.getCells()[5].removeStyleClass("showInputChange");
                                              currRow.getCells()[6].removeStyleClass("showInputChange");
                                          }
	                                 break;

	      case "costVersionSelector": tableName = "CostByLegalEntity";
	      	                              for (var rowInd=0; rowInd<rows.length; rowInd++){
                                              var currRow = rows[rowInd];
                                              currRow.getCells()[5].removeStyleClass("showInputChange");
                                          }
	                                 break;	      
	  }
      
      $.ajax({
			url: "services/" + 'USStoryDummy.xsjs?TableName=' + tableName + '&Version=' + version,
			method: "GET",
            async: false,
			     success : function(data, textStatus, jqXHR) {
			    	adata = data.results;
						table.getModel().setProperty("/",adata);
			     },
			     error: function(xhr, status)
			     {		var errorCode = xhr.status;
			    		var errorDesc = xhr.statusText;
			           console.error(errorCode + ":" + errorDesc);    
			           	sap.m.MessageToast.show('Error ' + errorCode + ":" + errorDesc);
			     },
			     complete : function(xhr,status) {			           
			           console.log("Complete"); 			           
			     }
		});
  
  },
	
hideBusyIndicator: function(delay){
	setTimeout(function(){
		sap.ui.core.BusyIndicator.hide();
		 },delay);
	},

		onChangeFile: function(e) {
			files = e.getParameter("files");
			file = e.getParameter("files")[0];
		},
		
		onSubmitUpload: function() {
			
			if (files[0].name.split(".")[1]==="csv")
				{	this.importcsv(files && file);   }
			else
			    {this.importxlsx(files && file);}
		},

	addDollars: function(value){
	    if (value===null || value===undefined){
	        return value;
	    }
	     var parts = value.toString().split(".");
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                parts = parts.join(".");
                if (parts.indexOf("-")>-1){
                    
                    return "$" +  "("+parts.split('-')[1]+")";
                }
                else{
            	    return '$' + parts;
                }
	},
	

	saveCurrentState: function(tableName, payload, version){		 
			   //deleting existing data in the table
             var truncDetails = [
                  {"tableName": tableName,
                   "version": version
                  }
                  ];      
                     
                               jQuery.ajax({
                                url: "services/" + "deleteManageTableVersion.xsjs",
                                type: "GET",
                                dataType: "json",
                                async: "false",
                                headers: {
                                    "DataServiceVersion": "2.0",
                                    "X-CSRF-Token": "Fetch"
                                },
                                success: function(result, status, response) {
                                    var header_xcsrf_token = response.getResponseHeader('x-csrf-token');
                                    var oHeaders = {
                                        "x-csrf-token": header_xcsrf_token,
                                        "Accept": "application/json"
                                    };
                                     
                            
                                    var details = {
                                        "details": truncDetails
                                                };
                                    var sendDetails = {};
                                    sendDetails.data = JSON.stringify(details);
                                    jQuery.ajax({
                                        type: "POST",
                                         async: "false",
                                        url: "services/" + "deleteManageTableVersion.xsjs",
                                        data: sendDetails,
                                        headers: oHeaders,
                                        success: function(data, status, response) {
                                            console.log(data);
                                            
                                              },
                                          error: function(xhr, status)
											     {		var errorCode = xhr.status;
											    		var errorDesc = xhr.statusText;
											           console.error(errorCode + ":" + errorDesc);    
											           	sap.m.MessageToast.show('Error ' + errorCode + ":" + errorDesc);
											     }
                            
                                    });
                            
                                }
                            });
                            
         // now add newly imported data
            
          var details = [];
         //now all tables have been truncated, so add data to them now
          details.push({
                         "tableName": tableName,
                        "columns": payload
                    });
                    
                jQuery.ajax({
                url: "services/" + "insertData.xsjs",
                type: "GET",
                dataType: "json",
                 async: "false",
                headers: {
                    "DataServiceVersion": "2.0",
                    "X-CSRF-Token": "Fetch"
                },
                success: function(result, status, response) {
                    var header_xcsrf_token = response.getResponseHeader('x-csrf-token');
                    var oHeaders = {
                        "x-csrf-token": header_xcsrf_token,
                        "Accept": "application/json"
                    };
           
                    var detailss = {
                        "details": details
                    };
                    var sendDetails = {};
                    sendDetails.data = JSON.stringify(detailss);
                    jQuery.ajax({
                        type: "POST",
                         async: "false",
                        url: "services/" + "insertData.xsjs",
                        data: sendDetails,
                        headers: oHeaders,
                        success: function(data, status, response) {
                            console.log(data);
                            
                        },
                          error: function(xhr, status)
								     {		var errorCode = xhr.status;
								    		var errorDesc = xhr.statusText;
								           console.error(errorCode + ":" + errorDesc);    
								           	sap.m.MessageToast.show('Error ' + errorCode + ":" + errorDesc);
								     },
                        complete: function(){
                        		var msg =  Man.Man.formatter.supplyi18Names("saveToHanaSuccess");
							sap.m.MessageToast.show(msg);
                        }
            
                    });
            
                }
            });  
            
           
            
	/*			var msg =  Man.Man.formatter.supplyi18Names("saveToHanaSuccess");
							sap.m.MessageToast.show(msg);*/
	},
	onAfterRendering: function(){
			sap.ui.controller("controllers.serviceCost").getDefaultSettings(); 
	},
	
	getDefaultSettings: function(){
	     var sccTab = serviceCostView.getView().byId("sccTab");
		
	$.ajax({
			url: "services/" + 'USStoryDummy.xsjs?TableName=ServiceCost&Version=1.0',
			method: "GET",
            async: false,
			     success : function(data, textStatus, jqXHR) {
			    	adata = data.results;
						sccTab.getModel().setProperty("/",adata);
			     },
			     error: function(xhr, status)
			     {		var errorCode = xhr.status;
			    		var errorDesc = xhr.statusText;
			           console.error(errorCode + ":" + errorDesc);    
			           	sap.m.MessageToast.show('Error ' + errorCode + ":" + errorDesc);
			     },
			     complete : function(xhr,status) {			           
			           console.log("Complete"); 			           
			     }
		}); 
		
			$.ajax({
			url: "services/" + "USStoryDummy.xsjs?TableName=CostByLegalEntity&Version=1.0",
			method: "GET",
			     success : function(data, textStatus, jqXHR) {
			          ddata = data.results;
			             var cspTable = serviceCostView.getView().byId("cspTable");
		cspTable.getModel().setProperty("/",ddata);
					//	sap.ui.controller("controllers.serviceCost").setDataToCspTable();
			     },
			     error: function(xhr, status)
			     {		var errorCode = xhr.status;
			    		var errorDesc = xhr.statusText;
			           console.error(errorCode + ":" + errorDesc);    
			           	sap.m.MessageToast.show('Error ' + errorCode + ":" + errorDesc);
			     },
			     complete : function(xhr,status) {			           
			           console.log("Complete"); 			           
			     }
		   });
	},	

setDataToCspTable: function(){
	
	for (var i=0; i<adata.length; i++){
		adata[i].DriverQ = 0;
	}
	
	for (var i=0; i<adata.length; i++){
		for (var j=0; j<ddata.length; j++){
			if (adata[i].ProvidingEntity === ddata[j].ProvidingEntity && adata[i].ProvidingEntityID === ddata[j].ProvidingEntityID && adata[i].Driver === ddata[j].Driver){
			        var adriverqtty = parseFloat(ddata[j].DriverQ);
			        adata[i].DriverQ += adriverqtty;
			        continue;
			}
		}
	}
	
	for (var i=0; i<ddata.length; i++){
		var driverPerc;
		for (var j=0; j<adata.length; j++){
			if (adata[j].ProvidingEntity === ddata[i].ProvidingEntity && adata[j].ProvidingEntityID === ddata[i].ProvidingEntityID && adata[j].Driver === ddata[i].Driver){
				var ddriverqtty = parseFloat(ddata[i].DriverQ);
				var adriverqtty = parseFloat(adata[j].DriverQ);
				driverPerc = (ddriverqtty/adriverqtty) *100;
				ddata[i].DriverPerc = driverPerc.toFixed(2) + "%";
				var servicePrice = parseFloat(adata[j].ServicePrice);
				if (servicePrice){
				var dcost = (driverPerc/100)*servicePrice;
				ddata[i].Cost = "$"  + dcost.toFixed(2);
				}
				else{
					ddata[i].Cost = "$"  + "0";
				}
				
			}
		}
	}
	
	var legalKeys = {};
	for (var k =0; k<ddata.length; k++){
			var legalEntity = parseInt(ddata[k].LegalEntityID);
			ddata[k].LegalEntityID = legalEntity;
		  if (!legalKeys.hasOwnProperty(legalEntity)){
		     	legalKeys[legalEntity] = 0;
		  }
	}
	
	for (var i=0; i<ddata.length; i++){
          var legalNo =  ddata[i].LegalEntityID;
          var cost = parseFloat(ddata[i].Cost.substr(1));
		  legalKeys[legalNo] += cost;
	}
	
	for (var i=0; i<ddata.length; i++){
          var legalNo =  ddata[i].LegalEntityID;
		  ddata[i].TotalCost =  "$" + legalKeys[legalNo].toFixed(2);     
		  ddata[i].ProvidingEntityID = parseInt(ddata[i].ProvidingEntityID);
	}

        var cspTable = serviceCostView.getView().byId("cspTable");
		cspTable.getModel().setProperty("/",ddata);
	},
	
		onChangeFile: function(e) {
			files = e.getParameter("files");
			file = e.getParameter("files")[0];
		},
		
		onSubmitUpload: function() {
			
			if (files[0].name.split(".")[1]==="csv")
				{	this.importcsv(files && file);   }
			else
			    {this.importxlsx(files && file);}
		},
		
		importcsv: function(file){
				var oData = [];
            if (file && window.FileReader) {

                var reader = new FileReader();
                var that = this;

                reader.onload = function(e) {

                    var strCSV = e.target.result;
                    sap.ui.controller("controllers.serviceCost").CSVToArray(strCSV);
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
    sap.ui.controller("controllers.serviceCost").CSV2JSON(arrData);
    return (arrData);
},

driverValueChanged: function(e){
	var changedValue = e.getSource().getValue();
	changedValue = parseFloat(changedValue);
	var sPath = e.getSource().getBindingContext().sPath;
	var table = serviceCostView.getView().byId("cspTable");
	var rowData = table.getModel().getProperty(sPath);


	for (var i=0; i<adata.length; i++){
		adata[i].DriverQ = 0;
	}
	
	for (var i=0; i<adata.length; i++){
		for (var j=0; j<ddata.length; j++){
			var adataProvidingEntityID = parseFloat(adata[i].ProvidingEntityID);
			if (adata[i].ProvidingEntity === ddata[j].ProvidingEntity && adataProvidingEntityID === ddata[j].ProvidingEntityID && adata[i].Driver === ddata[j].Driver){
			        var adriverqtty = parseFloat(ddata[j].DriverQ);
			        adata[i].DriverQ += adriverqtty;
			        continue;
			}
		}
	}
	
	for (var i=0; i<ddata.length; i++){
		var driverPerc;
		for (var j=0; j<adata.length; j++){
				var adataProvidingEntityID = parseFloat(adata[j].ProvidingEntityID);
			if (adata[j].ProvidingEntity === ddata[i].ProvidingEntity && adataProvidingEntityID === ddata[i].ProvidingEntityID && adata[j].Driver === ddata[i].Driver){
				var ddriverqtty = parseFloat(ddata[i].DriverQ);
				var adriverqtty = parseFloat(adata[j].DriverQ);
				driverPerc = (ddriverqtty/adriverqtty) *100;
				ddata[i].DriverPerc = driverPerc.toFixed(2) + "%";
				var servicePrice = parseFloat(adata[j].ServicePrice);
				if (servicePrice){
				var dcost = (driverPerc/100)*servicePrice;
				ddata[i].Cost = "$"  + dcost.toFixed(2);
				}
				else{
					ddata[i].Cost = "$"  + "0";
				}
				
			}
		}
	}
	
/*	var legalKeys = {};
	for (var k =0; k<ddata.length; k++){
			var legalEntity = parseInt(ddata[k].LegalEntityID);
			ddata[k].LegalEntityID = legalEntity;
		  if (!legalKeys.hasOwnProperty(legalEntity)){
		     	legalKeys[legalEntity] = 0;
		  }
	}
	
	for (var i=0; i<ddata.length; i++){
          var legalNo =  ddata[i].LegalEntityID;
          var cost = parseFloat(ddata[i].Cost.substr(1));
		  legalKeys[legalNo] += cost;
	}
	
	for (var i=0; i<ddata.length; i++){
          var legalNo =  ddata[i].LegalEntityID;
		  ddata[i].TotalCost =  "$" + legalKeys[legalNo].toFixed(2);     
		  ddata[i].ProvidingEntityID = parseInt(ddata[i].ProvidingEntityID);
	}
	  */  
	  
	  var legalentityId = rowData.LegalEntityID;
	  var totalCost = 0;
	  for (var i=0; i<ddata.length; i++){
	  	if (ddata[i].LegalEntityID === legalentityId){
	  		var cost = parseFloat(ddata[i].Cost.substr(1));
	  		totalCost += cost;
	  	}
	  }
	  
	  for (var j=0; j<ddata.length; j++){
	  		if (ddata[j].LegalEntityID === legalentityId){
	  	         ddata[j].TotalCost =  "$" + totalCost.toFixed(2);    
	  		}
	  }
		table.getModel().setProperty("/", ddata);
		table.getModel().refresh(); 
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
	
    sap.ui.controller("controllers.serviceCost").jsonToXml(objArray);
},
		
		importxlsx: function(file) {
		
				var result,data;
					
			if (file && window.FileReader) {
				var reader = new FileReader();
			
				reader.onload = function(e) {
					data = e.target.result;
					var wb = XLSX.read(data, {
						type: 'binary'
					});
					
					wb.Strings.splice(0,3);  //removed category account and actuals header names
					delete wb.Sheets[wb.SheetNames]["K1"];
					delete wb.Sheets[wb.SheetNames]["J1"]
					delete wb.Sheets[wb.SheetNames]["I1"];
					delete wb.Sheets[wb.SheetNames]["H1"];
					delete wb.Sheets[wb.SheetNames]["G1"];
					delete wb.Sheets[wb.SheetNames]["G2"];
					
					wb.Sheets[wb.SheetNames]["!ref"] = "A3:K12";
					wb.Sheets[wb.SheetNames]["K3"] = wb.Sheets[wb.SheetNames]["K2"];
					delete wb.Sheets[wb.SheetNames]["K2"];
					wb.Sheets[wb.SheetNames]["J3"] = wb.Sheets[wb.SheetNames]["J2"];
					delete wb.Sheets[wb.SheetNames]["J2"];
					wb.Sheets[wb.SheetNames]["I3"] = wb.Sheets[wb.SheetNames]["I2"];
					delete wb.Sheets[wb.SheetNames]["I2"];
					wb.Sheets[wb.SheetNames]["H3"] = wb.Sheets[wb.SheetNames]["H2"];
					delete wb.Sheets[wb.SheetNames]["H2"];
					
					wb.SheetNames.forEach(function(sheetName) {
						result = XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
						if (result.length > 0) {
							var msg =  Man.Man.formatter.supplyi18Names("conversionSuccessful");
							sap.m.MessageToast.show(msg);
						  }
					});
					tab2Data = result;
					sap.ui.controller("controllers.serviceCost").tab2Function();
			//		return result;
				};
				reader.readAsBinaryString(file);
				
			}
		
		},
tab2Function: function(){
		
		var    
		      appSer = 'Application Services',
		      collOp = 'Collections Operations',
		      WorkCap = 'Deliver Workforce Capability',
		      appSerVar = 0,
		      collOpVar = 0,
		      WorkCapVar = 0,
		      
		      costProvEnt = 0;
		      
		
		var inputConvertedXML = ''
		var request = '';
	var	aJSONData = tab2Data;
	var data = tab2Data;
				
				for(var k  = 0 ; k <data.length;k++){
					 
					   var serviceCost = parseFloat(parseFloat(data[k]["Service Cost"]).toFixed(2));
					   data[k]["Service Cost"] = serviceCost;
				    if (data[k]["Level 2 Service"] === appSer){
				        appSerVar += serviceCost; 
				    } else if (data[k]["Level 2 Service"] === collOp){
				        collOpVar += serviceCost; 
				    } else if (data[k]["Level 2 Service"] === WorkCap){
				        WorkCapVar += serviceCost; 
				    } 
				
				}
				
				for(var k  = 0 ; k <data.length;k++){
					var percService =  parseFloat(data[k][ "%ofService" ]);
					var markUpPerc = parseFloat(data[k][ "Mark up %" ]);
					 var serviceCost;
					 
					 
				    if (data[k]["Level 2 Service"] === appSer){
				        serviceCost = appSerVar * percService;   
				    } else if (data[k]["Level 2 Service"] === collOp){
				    	 serviceCost = collOpVar * percService;    
				    } else if (data[k]["Level 2 Service"] === WorkCap){
				    	 serviceCost =  WorkCapVar * percService; 
				    } 
				    
				     data[k]["Cost for Service"] =  parseFloat(serviceCost.toFixed(2));
				    var dollar = data[k]["Cost for Service"] * ( 1 + markUpPerc);
				    data[k]["$"] = parseFloat(dollar.toFixed(2));
				    
				    if (data[k]["Materinal entity"] === "Y" && data[k]["Critical ServiceDim"] === "Y"){
				        data[k]["Service Price"] = data[k]["$"] ;
				    } else {
				        data[k]["Service Price"] = 0;
				    }
				    
				}
			
					var dataToBind = [];
					var totalKeys = Object.keys(data[0]);
					for (var ind=0;ind<data.length; ind++){
						var obj = {};
						
						for (var keyno=0; keyno<totalKeys.length; keyno++){
								var key = totalKeys[keyno].replace(/ /g,'');
								if (totalKeys[keyno] === "Service Price"){
									var sum = data[ind][totalKeys[keyno]];
									obj[key] = sap.ui.controller("controllers.serviceCost").addDollars(sum);
									continue;
								}
								obj[key] = data[ind][totalKeys[keyno]];
						}
						
						dataToBind[ind] = obj;
					
					}
				   
					serviceCostView.getView().byId("sccTab").getModel().setProperty("/",dataToBind);

	},
	
	addDollars: function(value){
	    if (value===null || value===undefined){
	        return value;
	    }
	     var parts = value.toString().split(".");
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                parts = parts.join(".");
                if (parts.indexOf("-")>-1){
                    
                    return "$" +  "("+parts.split('-')[1]+")";
                }
                else{
            	    return '$' + parts;
                }
	},
	
	checkForDuplicacies: function(e){
	      var text = e.getSource().getValue();
	   
	   if (duplicacyCheckListCSP.indexOf(text)>-1){
	      e.getSource().getParent().getParent().getItems()[2].setVisible(true);
	   }
	   else{
	       e.getSource().getParent().getParent().getItems()[2].setVisible(false);
	   }
	},
	
	saveSCCToHana: function(e){
	    
         var tableId = e.getSource().getParent().getParent().getContent()[1].getId();
         var tableShortId = tableId.split("--")[1];
	    // var tableData = table.getModel().getProperty("/");
	     var versionData = serviceCostView.byId("serviceVersionSelector").getModel().getData();
        var versionDataToUse = [];
        for (var ind=1; ind<versionData.length; ind++){
            versionDataToUse.push(versionData[ind]);
        }
	   
	     duplicacyCheckListCSP = [];
	     if(versionData.length>0){
	     for (var i=0; i<versionData.length; i++) { 
	         duplicacyCheckListCSP.push(versionData[i].VERSION); 
	           }
	     }
		if (!cspSaveVersionDialog) {
			    	cspSaveVersionDialog = sap.ui.xmlfragment("Man.Man.fragment.cspSaveVersionDialog", serviceCostView);
			          serviceCostView.getView().addDependent(serviceCostView.cspSaveVersionDialog);
		            	}
		   
			cspSaveVersionDialog.open();
			
			   var versionModel = new sap.ui.model.json.JSONModel(versionDataToUse);
				     
					var versionSelectTemplate = new sap.ui.core.Item({
						text: "{VERSION}",
						key: "{KEY}"
					});
					
                    var versionSelect = cspSaveVersionDialog.getContent()[0].getItems()[1].getItems()[1];
	            	versionSelect.setModel(versionModel);
					versionSelect.bindAggregation(
						"items",
						"/",
						versionSelectTemplate);
			 cspSaveVersionDialog.data = tableShortId;
	},
	
	cancelSaveVersion: function(){
	    cspSaveVersionDialog.close();
	},
	
	gotVersionName: function(e){
	    
	    	//	 var tableOnUi = e.getSource().getParent().getParent().getContent()[1];
		var dialogVersionSelect = e.getSource().getParent().getContent()[0].getItems()[1].getItems()[1];
	    var versionName;
	    	 var tableOnUI_id = cspSaveVersionDialog.data;
			 var tableOnUi =  serviceCostView.byId(tableOnUI_id);
	        var versionSelect = tableOnUi.getParent().getContent()[0].getContentRight()[1];
			 var selectData = versionSelect.getModel().getData();
			 var keyIndex = selectData.length;
			 
		if (dialogVersionSelect.getVisible()){
		    versionName = dialogVersionSelect.getSelectedItem().getText();
		    var existingVersionKey = dialogVersionSelect.getSelectedKey();
		     versionSelect.setSelectedKey(existingVersionKey);
		    }
		 else{
		    versionName  = dialogVersionSelect.getParent().getItems()[2].getValue();
		     selectData.push({"VERSION" : versionName, "KEY":keyIndex});
			 versionSelect.getModel().refresh();
			 versionSelect.setSelectedKey(keyIndex);
		 }
			cspSaveVersionDialog.close();
			
			var tableName;
			    var runUploadTableData = [];
			 if (tableOnUI_id.indexOf("sccTab")>-1){
			     tableName = "ServiceCost";
			   
			    var tableData = tableOnUi.getModel().getData();
		      for (var i=0; i<tableData.length; i++){
		    	var obj = {};
			 	obj.Driver = tableData[i].Driver;
			 	obj.MARKUP_PERCENT =  tableData[i].MARKUP_PERCENT;
			 	obj.PERCENT_SERVICE =  tableData[i].PERCENT_SERVICE;
			 	obj.Critical = tableData[i].Critical;
			 	obj.Service = tableData[i].SERVICE_NAME;
			 	obj.MaterialEntity = tableData[i].MaterialEntity;
			 	obj.ProvidingEntity = tableData[i].PROVIDING_ENTITY_NAME;
			 	obj.ProvidingEntityID = tableData[i].PROVIDING_ENTITY_ID;
			 	obj.VERSION = versionName;
			 	runUploadTableData.push(obj);
			 }
			 
		
			 }
			  if (tableOnUI_id.indexOf("cspTable")>-1){
			       tableName = "CostByLegalEntity";
			   
    			  var tableData = tableOnUi.getModel().getData();
    		      for (var i=0; i<tableData.length; i++){
    		    	var obj = {};
    			 	obj.Driver = tableData[i].Driver;
    			 	obj.LegalEntityID =  tableData[i].LegalEntityID;
    			 	obj.LegalEntity =  tableData[i].LegalEntity;
    			 	obj.DriverQ = tableData[i].DriverQ;
    			 	obj.DriverP = tableData[i].DriverP;
    			 	obj.Cost = tableData[i].Cost;
    			 	obj.ProvidingEntity = tableData[i].ProvidingEntity;
    			 	obj.ProvidingEntityID = tableData[i].ProvidingEntityID;
    			 	obj.VERSION = versionName;
    			 	runUploadTableData.push(obj);
			 }
			  }
			 sap.ui.controller("controllers.manageData").saveCurrentState(tableName,runUploadTableData,versionName);

	},
	
	  radioBtnOfSaveVersionChgd: function(e){
      var selectedBtn = e.getSource().getSelectedButton().getText();
      var inputAndSelectBox =   e.getSource().getParent().getParent().getItems()[1];
    
      switch(selectedBtn){
        case  Man.Man.formatter.supplyi18Names("overwriteExisting"): inputAndSelectBox.getItems()[0].setText(Man.Man.formatter.supplyi18Names("selectVersionName"));
                                                                  inputAndSelectBox.getItems()[2].setVisible(false);
                                                                  inputAndSelectBox.getItems()[1].setVisible(true);  break;

        case  Man.Man.formatter.supplyi18Names("newVersion"):    inputAndSelectBox.getItems()[0].setText(Man.Man.formatter.supplyi18Names("enterVersionName"))
                                                                  inputAndSelectBox.getItems()[1].setVisible(false);
                                                                  inputAndSelectBox.getItems()[2].setVisible(true);  break;                                                                  
      }
  },
	
	saveCSPToHana: function(){
			 var tableName = "CostByLegalEntity";

			  var runUploadTableData = [];
			  var cspTable = serviceCostView.getView().byId("cspTable");
			 var tableData = 	cspTable.getModel().getData();
			 
			 for (var i=0; i<tableData.length; i++){
			 	var editedDriverP = tableData[i].DriverPerc.replace("%", "");
			 	editedDriverP = parseFloat(editedDriverP);
			 	editedDriverP = editedDriverP*0.01;
			 	var obj = {};
			 	obj.Cost = tableData[i].Cost.substr(1);
			 	obj.Driver = tableData[i].Driver;
			 	obj.DriverP = editedDriverP.toString();
			 	obj.DriverQ = parseFloat(tableData[i].DriverQ);
			 	obj.LegalEntity = tableData[i].LegalEntity;
			 	obj.LegalEntityID = tableData[i].LegalEntityID;
			 	obj.ProvidingEntity = tableData[i].ProvidingEntity;
			 	obj.ProvidingEntityID = tableData[i].ProvidingEntityID;
			 	runUploadTableData.push(obj);
			 }
			 sap.ui.controller("controllers.serviceCost").saveCurrentState(tableName,runUploadTableData);
	},
	
	saveCurrentState: function(tableName, payload, version){		 
			   //deleting existing data in the table
             var truncDetails = [
                  {"tableName": tableName,
                   "version": version
                  }
                  ];      
                     
                              jQuery.ajax({
                                url: "services/" + "deleteManageTableVersion.xsjs",
                                type: "GET",
                                dataType: "json",
                                async: "false",
                                headers: {
                                    "DataServiceVersion": "2.0",
                                    "X-CSRF-Token": "Fetch"
                                },
                                success: function(result, status, response) {
                                    var header_xcsrf_token = response.getResponseHeader('x-csrf-token');
                                    var oHeaders = {
                                        "x-csrf-token": header_xcsrf_token,
                                        "Accept": "application/json"
                                    };
                                     
                            
                                    var details = {
                                        "details": truncDetails
                                                };
                                    var sendDetails = {};
                                    sendDetails.data = JSON.stringify(details);
                                    jQuery.ajax({
                                        type: "POST",
                                         async: "false",
                                        url: "services/" + "deleteManageTableVersion.xsjs",
                                        data: sendDetails,
                                        headers: oHeaders,
                                        success: function(data, status, response) {
                                            console.log(data);
                                            
                                              },
                                          error: function(xhr, status)
											     {		var errorCode = xhr.status;
											    		var errorDesc = xhr.statusText;
											           console.error(errorCode + ":" + errorDesc);    
											           	sap.m.MessageToast.show('Error ' + errorCode + ":" + errorDesc);
											     }
                            
                                    });
                            
                                }
                            });
                            
         // now add newly imported data
            
          var details = [];
         //now all tables have been truncated, so add data to them now
          details.push({
                         "tableName": tableName,
                        "columns": payload
                    });
                    
                jQuery.ajax({
                url: "services/" + "insertData.xsjs",
                type: "GET",
                dataType: "json",
                 async: "false",
                headers: {
                    "DataServiceVersion": "2.0",
                    "X-CSRF-Token": "Fetch"
                },
                success: function(result, status, response) {
                    var header_xcsrf_token = response.getResponseHeader('x-csrf-token');
                    var oHeaders = {
                        "x-csrf-token": header_xcsrf_token,
                        "Accept": "application/json"
                    };
           
                    var detailss = {
                        "details": details
                    };
                    var sendDetails = {};
                    sendDetails.data = JSON.stringify(detailss);
                    jQuery.ajax({
                        type: "POST",
                         async: "false",
                        url: "services/" + "insertData.xsjs",
                        data: sendDetails,
                        headers: oHeaders,
                        success: function(data, status, response) {
                            console.log(data);
                            
                        },
                          error: function(xhr, status)
								     {		var errorCode = xhr.status;
								    		var errorDesc = xhr.statusText;
								           console.error(errorCode + ":" + errorDesc);    
								           	sap.m.MessageToast.show('Error ' + errorCode + ":" + errorDesc);
								     },
                        complete: function(){
                        		var msg =  Man.Man.formatter.supplyi18Names("saveToHanaSuccess");
							sap.m.MessageToast.show(msg);
                        }
            
                    });
            
                }
            });  
            
           
            
	/*			var msg =  Man.Man.formatter.supplyi18Names("saveToHanaSuccess");
							sap.m.MessageToast.show(msg);*/
	},
	
	autoPressTab1Toggle: function(value){
		var pressed = (value==='Y'?true:false);
		return pressed;
	},
	
	onTab1TogglePress: function(e){
		var pressed = e.getParameter("pressed");
		 var hasChangeStyleClass =  e.getSource().hasStyleClass("showInputChange"); //boolean
		 
		 if (!hasChangeStyleClass){
		     e.getSource().addStyleClass("showInputChange");
		 }
		  else{
		      e.getSource().removeStyleClass("showInputChange");
		 }
		if (pressed){
		   e.getSource().setText("Y");
		}
		else{
			e.getSource().setText("N");
		}
		sap.ui.controller("controllers.serviceCost").updateServicePrice(e);
	},
	
updateServicePrice: function(e){
		var sPath = e.getSource().getBindingContext().sPath;
		var sccModel = e.getSource().getParent().getParent().getModel();
		var rowContext = sccModel.getProperty(sPath);
		var Materinalentity = rowContext.Materinalentity;
		var CriticalServiceDim = rowContext.CriticalServiceDim;
		
		switch(Materinalentity){
			case 'Y': if (CriticalServiceDim==='Y'){
						rowContext.ServicePrice = sap.ui.controller("controllers.serviceCost").addDollars(rowContext.$);
						}
					  else if(CriticalServiceDim==='N'){
					  		rowContext.ServicePrice = "$0";
					  }
						break;
			case 'N': rowContext.ServicePrice = "$0";
						break;
			
		}
			sccModel.setProperty(sPath, rowContext);
						sccModel.refresh();
	},

 goToHome: function(){
	     mainRoutes.navTo("home", false);
	    Man.Man.declarations.main.controlobject.detailWindowPage.setShowHeader(false);
        Man.Man.declarations.main.controlobject.sideNav.setVisible(false); 
	     
  },
  
  changeTabBreadcrumb: function(e){
     var selectedTabKey = e.getSource().mProperties.selectedKey;
     var selectedTabi18Name = Man.Man.formatter.supplyi18Names(selectedTabKey);
     serviceCostView.byId("tabName").setText(selectedTabi18Name);
  },
  
  makePercent: function(e){
      var val = e*100;
      val = val.toFixed(2);
      val = val + "%";
      return val;
  },
  
    showInputChange: function(e){
      var originalValue = e.getSource().getPlaceholder();
      var newValue = e.getSource().getValue();
      var hasChangeStyleClass =  e.getSource().hasStyleClass("showInputChange"); //boolean
         if (!hasChangeStyleClass){
           e.getSource().addStyleClass("showInputChange");
         }
  }
		
	

	
	
});