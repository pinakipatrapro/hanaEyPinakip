var manageDataView, file, files;
var  jsonObj = [];
var duplicacyCheckList = [];
var visibleManagedDataTableID = "manageFnsTable";
var saveSettingsDialog, saveVersionDialog, createScenarioDialog;
sap.ui.controller("controllers.manageData", {

	onInit: function() { 
	    	 this.router = sap.ui.core.UIComponent.getRouterFor(this);
			manageDataView = this;
			  Man.Man.declarations.manageData.controlobject.uploadDataBtn = manageDataView.getView().byId("uploadDataBtn");
			   Man.Man.declarations.manageData.controlobject.downloadDTempateBtn = manageDataView.getView().byId("downloadDTempateBtn");
			   Man.Man.declarations.manageData.controlobject.saveDataBtn = manageDataView.getView().byId("saveDataBtn");

Man.Man.declarations.manageData.controlobject.financialDataTab = manageDataView.getView().byId("financialDataTab");
Man.Man.declarations.manageData.controlobject.serviceCatalogTab = manageDataView.getView().byId("serviceCatalogTab");
Man.Man.declarations.manageData.controlobject.servicePriceCalcTab = manageDataView.getView().byId("servicePriceCalcTab");
Man.Man.declarations.manageData.controlobject.costByLegalEntityTab = manageDataView.getView().byId("costByLegalEntityTab");
Man.Man.declarations.manageData.controlobject.breakoutTab = manageDataView.getView().byId("breakoutTab");
			   
Man.Man.declarations.manageData.controlobject.financialDataTab.columns = ["FH_3","FUNCTION_3","DRIVER","FH_4","FUNCTION_4","EXP_AMOUNT","PERIOD","VERSION"];
Man.Man.declarations.manageData.controlobject.serviceCatalogTab.columns = ["SC_ID", "SCL1", "SCL2", "SCL3", "DRIVER","QDRIVER", "PERIOD", "VERSION"];
Man.Man.declarations.manageData.controlobject.servicePriceCalcTab.columns = ["PENT", "P_ENT_NAME", "MENT", "SCL2", "CS", "SERV_PCT", "SERV_MP", "DRIVER_ALLOC", "QDRIVER_ALLOC", "PERIOD","VERSION"];
Man.Man.declarations.manageData.controlobject.costByLegalEntityTab.columns = ["PENT", "P_ENT_NAME", "DRIVER_ALLOC", "R_ENT", "R_ENT_NAME", "QDRIVER_ALLOC","PERIOD","VERSION"];

      Man.Man.declarations.main.controlobject.detailWindowPage.setShowHeader(true);
      Man.Man.declarations.main.controlobject.sideNav.setVisible(true); 
      
      manageDataView.initialiseScenario();
      
      
      
      finModel = new sap.ui.model.json.JSONModel({});
       serviceCatalogModel = new sap.ui.model.json.JSONModel({});
        servicePriceModel = new sap.ui.model.json.JSONModel({});
         costByLegalModel = new sap.ui.model.json.JSONModel({});
         
         Man.Man.declarations.manageData.controlobject.financialDataTab.setModel(finModel);
Man.Man.declarations.manageData.controlobject.serviceCatalogTab.setModel(serviceCatalogModel);
Man.Man.declarations.manageData.controlobject.servicePriceCalcTab.setModel(servicePriceModel);
Man.Man.declarations.manageData.controlobject.costByLegalEntityTab.setModel(costByLegalModel);

manageDataView.changeVersion('Base_Scenario');
			  
			 },
			 
initialiseScenario: function(){
var dropdown = manageDataView.byId("globalVersionSelector");

var serviceVersions;
      	$.ajax({
			url: "/analyticscloud/models/USStory/ms/" + "getManageTableVersions.xsjs?TableName=" + 'SC1_FH1',
			method: "GET",
            async: false,
			     success : function(data, textStatus, jqXHR) {
			        data.splice(0,1);
			    	serviceVersions = data;
			    	for (var h=0; h<data.length; h++){
			    	  	duplicacyCheckList.push(data[h].VERSION);
			    	  }
				     var serviceModel = new sap.ui.model.json.JSONModel(serviceVersions);
				     
					var serviceSelectTemplate = new sap.ui.core.Item({
						text: "{VERSION}",
						key: "{KEY}"
					});
             
					dropdown.setModel(serviceModel);

					dropdown.bindAggregation(
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
			debugger;
			if (files[0].name.split(".")[1]==="csv")
				{	Man.Man.functions.importcsv(files && file);   }
			else if (files[0].name.split(".")[1]==="xml")
				{	Man.Man.functions.importxml(files && file);   }
			else
			    {this.importxlsx(files && file);}
		},

	
	checkForDuplicacies: function(e){
	   var text = e.getSource().getValue();
	   
	   if (duplicacyCheckList.indexOf(text)>-1){
	      e.getSource().getParent().getParent().getItems()[2].setVisible(true);
	      e.getSource().getParent().getParent().getParent().getButtons()[0].setEnabled(false);
	   }
	   else{
	       e.getSource().getParent().getParent().getItems()[2].setVisible(false);
	       e.getSource().getParent().getParent().getParent().getButtons()[0].setEnabled(true);
	   }
	},

	saveCurrentState: function(tableName, payload, version){		 
			   //deleting existing data in the table
             var truncDetails = [
                  {"tableName": tableName,
                   "version": version,
                   "period": '2018'
                  }
                  ];      
                     
                               jQuery.ajax({
                                url: "/analyticscloud/models/USStory/ms/" + "deleteManageTableVersion.xsjs",
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
                                        url: "/analyticscloud/models/USStory/ms/" + "deleteManageTableVersion.xsjs",
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
                url: "/analyticscloud/models/USStory/ms/" + "insertData.xsjs",
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
                        url: "/analyticscloud/models/USStory/ms/" + "insertData.xsjs",
                        data: sendDetails,
                        headers: oHeaders,
                        success: function(data, status, response) {
                            console.log(data);
                            //	var msg =  Man.Man.formatter.supplyi18Names("saveToHanaSuccess");
                            var msg = "Saved Data to " + version;
							sap.m.MessageToast.show(msg);
                            
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
            
           
            
	/*			var msg =  Man.Man.formatter.supplyi18Names("saveToHanaSuccess");
							sap.m.MessageToast.show(msg);*/
	},
	

downloadTemplate: function(e){
var reportTitle = e.getSource().getText().substr(11);
var templatePath;

 switch(reportTitle){
 	case Man.Man.formatter.supplyi18Names("financialDataTab"): templatePath = "model/financialTemplate.json"; break;
 	case Man.Man.formatter.supplyi18Names("serviceCatalogTab"): templatePath = "model/serviceCatalogTemplate.json"; break;
 	case Man.Man.formatter.supplyi18Names("servicePriceCalcTab"): templatePath = "model/servicePriceCalcTemplate.json"; break;
 	case Man.Man.formatter.supplyi18Names("costByLegalEntityTab"): templatePath = "model/costByLegalEntTemplate.json"; break;
 	case Man.Man.formatter.supplyi18Names("breakoutTab"): templatePath = "model/breakoutTemplate.json"; break;
 }
   var sampleArr = new Array();
   $.getJSON(templatePath, function (data) {
        sampleArr = data;
        sap.ui.controller("controllers.manageData").jSONToXlsxConvertor(sampleArr,reportTitle,true);
    }).error(function(){
            console.log('error: json not loaded');
        });
			
			 var msg =   Man.Man.formatter.supplyi18Names("templateDownloaded");
		      sap.m.MessageToast.show(msg);

},

jSONToXlsxConvertor: function(JSONData, ReportTitle, ShowLabel) {
		
		/* make the worksheet */
var ws = XLSX.utils.json_to_sheet(JSONData);

/* add to workbook */
var wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "ReportTitle");
var filename = ReportTitle + ".xlsx";
XLSX.writeFile(wb, filename);

		},
		
massUpload: function(e){
  var tableName = e.getSource().getParent().getParent().getContent()[2].getSelectedKey();
		if (!saveSettingsDialog) {
			    	saveSettingsDialog = sap.ui.xmlfragment("Man.Man.fragment.saveSettings", manageDataView);
			          manageDataView.getView().addDependent(manageDataView.saveSettingsDialog);
		            	}
		            	var dialogTitle = e.getSource().getText();
		   
			saveSettingsDialog.open();
			 saveSettingsDialog.setTitle(dialogTitle);
			 saveSettingsDialog.data = tableName;
		
},

massUploadConfirm: function(){
		visibleManagedDataTableID = saveSettingsDialog.data;

			switch(visibleManagedDataTableID){
		   	case "financialDataTab": Man.Man.declarations.manageData.controlobject.resetFinancialData = files && file;
			 						 break;		
			 							
			 	case "serviceCatalogTab": Man.Man.declarations.manageData.controlobject.resetServiceCatalog = files && file;
			 	                          break;
			 							
			 	case "servicePriceCalcTab": Man.Man.declarations.manageData.controlobject.resetServicePriceCalc = files && file;
			 						   break;
			 							
			 	case "costByLegalEntityTab": Man.Man.declarations.manageData.controlobject.resetCostByLegalEntity = files && file
			 						 break;
			 							
			 	case "breakoutTab": Man.Man.declarations.manageData.controlobject.resetBreakout = files && file;
			 		              break;
			}
	
		  	if (files[0].name.split(".")[1]==="csv")
				{ Man.Man.functions.importcsv(files && file);   }
			else
			    {manageDataView._import(files && file);}
			saveSettingsDialog.close();
},

closeMassUploader: function(){
	saveSettingsDialog.close();
},

_import: function(file) {
	    var msg;
	    
	    	var selelctedTabKey = visibleManagedDataTableID;
	
	    	var table = Man.Man.declarations.manageData.controlobject[selelctedTabKey];
	debugger;
			var aDetails=[];

		aDetails = table.columns;
	    
			if (file && window.FileReader) {
				var reader = new FileReader();
				var result = {},
					data;
				reader.onload = function(e) {
					data = e.target.result;
					var wb = XLSX.read(data, {
						type: 'binary'
					});
					wb.SheetNames.forEach(function(sheetName) {
						var roa = XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
						if (roa.length > 0) {
							result[sheetName] = roa;
								jsonObj = result[sheetName];
						}
					});
				
					if (jsonObj === undefined) {
					     msg =  "Invalid Structure!";
						sap.m.MessageToast.show(msg);
					} else {
						//Validate if same structure
						
						var keysNew = [];
						for (var j in jsonObj[0]) {
							keysNew.push(j);
						}

						var is_same = (aDetails.length === keysNew.length) && aDetails.every(function(element, index) {
							return element === keysNew[index];
						});
						if (is_same === true) {
							
							if (selelctedTabKey === "financialDataTab"){
								
								var driverdata = {};
								 for (var ind=0; ind<jsonObj.length;ind++){
									var driverName = jsonObj[ind].DRIVER;
									var expense = jsonObj[ind].EXP_AMOUNT;
									if (isNaN(expense)){
									    msg =  "Error: Please enter numbers for EXPENSE (eg: 10000)";
					    	            sap.m.MessageToast.show(msg);
					    	            return;
						   			}
						   			if (isNaN(jsonObj[ind].PERIOD)){
						   				msg =  "Error: Please enter numbers for PERIOD (eg: 2018)";
					    	            sap.m.MessageToast.show(msg);
					    	            return;
						   			}
										expense = expense.replace(/[, ]+/g, "").trim();
										expense = parseFloat(expense);
										jsonObj[ind].EXP_AMOUNT = expense;
									if (driverdata.hasOwnProperty(driverName)){
										driverdata[driverName] += expense;
									}
									else{
											driverdata[driverName] = expense;
									}
								}
								
								 for (var ind=0; ind<jsonObj.length;ind++){
								 	var driverName = jsonObj[ind].DRIVER;
								   jsonObj[ind].Total_Expenses = driverdata[driverName];
								}
							}
							
							else if(selelctedTabKey ==="serviceCatalogTab"){
									 for (var sc=0; sc<jsonObj.length; sc++){
									 	var qDriver = jsonObj[sc].QDRIVER;
									 	
									if (isNaN(qDriver)){
									    msg =  "Error: Please enter numbers for QDRIVER (eg: 100)";
					    	            sap.m.MessageToast.show(msg);
					    	            return;
						   			}
						   			if (isNaN(jsonObj[sc].PERIOD)){
						   				msg =  "Error: Please enter numbers for Period column (eg: 2018)";
					    	            sap.m.MessageToast.show(msg);
					    	            return;
						   			}
									 }
						    	}
						
							else if (selelctedTabKey === "servicePriceCalcTab"){
										var serviceCostByLevel2 = {};
										 for (var s=0; s<jsonObj.length; s++){
										 	 if (isNaN(jsonObj[s].SERV_PCT)){
										 	 	 msg =  "Error: Please enter decimals for SERV_PCT (eg: 0.5)";
							    	            sap.m.MessageToast.show(msg);
							    	            return;
										 	 }
										 	 
										 	  if (isNaN(jsonObj[s].SERV_MP)){
										 	 	 msg =  "Error: Please enter decimals for SERV_MP (eg: 0.5)";
							    	            sap.m.MessageToast.show(msg);
							    	            return;
										 	 }
										 	 
										 	  if (isNaN(jsonObj[s].QDRIVER_ALLOC)){
										 	 	 msg =  "Error: Please enter numbers for QDRIVER_ALLOC (eg: 100)";
							    	            sap.m.MessageToast.show(msg);
							    	            return;
										 	 }
										 	 
										 	  if (isNaN(jsonObj[s].PERIOD)){
										 	 	 msg =  "Error: Please enter numbers for PERIOD (eg: 2018)";
							    	            sap.m.MessageToast.show(msg);
							    	            return;
										 	 }
										 	
										 	 if (jsonObj[s].MENT ==='N' || jsonObj[s].CS==='N'){
										 	    jsonObj[s].servicePrice = 0; continue;
										     }
										     
										   var servicePerc;
										   var level2Service = jsonObj[s].SCL2;
										        servicePerc = jsonObj[s].SERV_PCT.replace("%","");
										   	    servicePerc = parseFloat(servicePerc);
										   	var servicePrice;
										   	    
										   if (serviceCostByLevel2.hasOwnProperty(level2Service)){
										   	  servicePrice = serviceCostByLevel2[level2Service]*servicePerc;
										   	   jsonObj[s].servicePrice = servicePrice.toFixed(2);
										   }
										   else{
											    var scdata = Man.Man.declarations.manageData.controlobject.serviceCatalogTab.getModel().getData();
											    var serviceCostTotal = 0;
											    
											    var dataOfLevel2Service =  scdata.filter(function(entry) {
												    return entry.SCL2 === level2Service;
												});
												
												for (var filterInd=0; filterInd<dataOfLevel2Service.length; filterInd++){
													if(dataOfLevel2Service[filterInd].hasOwnProperty("ServiceCost")){
														var sclevel2 = parseFloat(dataOfLevel2Service[filterInd].ServiceCost);
														serviceCostTotal += sclevel2;
													}
												}
												serviceCostByLevel2[level2Service] = serviceCostTotal;
											     servicePrice = serviceCostTotal*servicePerc;
										   	     jsonObj[s].servicePrice = servicePrice.toFixed(2);
										   }
									   }
							}
							
								else if (selelctedTabKey === "costByLegalEntityTab"){
									 for (var cbl=0; cbl<jsonObj.length; cbl++){
										   if (isNaN(jsonObj[cbl].QDRIVER_ALLOC)){
										 	 	 msg =  "Error: Please enter numbers for QDRIVER_ALLOC (eg: 100)";
							    	            sap.m.MessageToast.show(msg);
							    	            return;
										 	 }
										 	 
										 	  if (isNaN(jsonObj[cbl].PERIOD)){
										 	 	 msg =  "Error: Please enter numbers for PERIOD (eg: 2018)";
							    	            sap.m.MessageToast.show(msg);
							    	            return;
										 	 }
									 }
								}
							
						    var oModel = new sap.ui.model.json.JSONModel(jsonObj);
							table.setModel(oModel);
							
							if (selelctedTabKey === "costByLegalEntityTab"){
									 for (cbl=0; cbl<jsonObj.length; cbl++){
									 	var sPath = "/" + cbl;
									 	manageDataView.calcCostByLegalValues(sPath);
									 }
							}
							
							else if(selelctedTabKey ==="serviceCatalogTab"){
									 for (var sc=0; sc<jsonObj.length; sc++){
									 		var sPath = "/" + sc;
							           	manageDataView.serviceCatalogNumDriverChanged(sPath);
									 }
							}
							
							oModel.refresh();
							table.getParent().getParent().setIconColor("Positive");
							 msg =  "Uploaded Successfully!";
					    	sap.m.MessageToast.show(msg);
						} else {
						  msg =  "Invalid Structure!";
						sap.m.MessageToast.show(msg);
						}
					}
					return result;
				};
				reader.readAsBinaryString(file);
			}
		},
		
	autoPressEntityToggle:  function (value){
			var pressed = (value==='Material'?true:false);
	    	return pressed;
	},
	
	onEntityTogglePress: function(e){
		var pressed = e.getParameter("pressed");
		var hasChangeStyleClass =  e.getSource().hasStyleClass("showInputChange"); //boolean
		 
		 if (!hasChangeStyleClass){
		     e.getSource().addStyleClass("showInputChange");
		 }
		 else{
		      e.getSource().removeStyleClass("showInputChange");
		 }
		if (pressed){
		   e.getSource().setText("Material");
		}
		else{
			e.getSource().setText("Receiving");
		}
	},
	
    yesNoToggle: function(value){
		var pressed = (value==='Y'?true:false);
		return pressed;
	},
	
	onYesNoTogglePressSP   : function(e){
		var pressed = e.getParameter("pressed");
		 var hasChangeStyleClass =  e.getSource().hasStyleClass("showInputChange"); //boolean
		 var sPath;
		 sPath = e.getSource().getBindingContext().sPath;
		 var rowData =  Man.Man.declarations.manageData.controlobject.servicePriceCalcTab.getModel().getProperty(sPath);
		if (pressed){
		   e.getSource().setText("Y");
		   if (rowData.MENT==="Y" && rowData.CS==="Y"){
		     sap.ui.controller("controllers.manageData").calculateServicePrice(sPath);
		   }
		}
		else{
			e.getSource().setText("N");
			Man.Man.declarations.manageData.controlobject.servicePriceCalcTab.getModel().getProperty(sPath).servicePrice = 0;
		}
	/*	sap.ui.controller("controllers.serviceCost").updateServicePrice(e);*/
	},
	 goToHome: function(){
	     mainRoutes.navTo("home", false);
	    Man.Man.declarations.main.controlobject.detailWindowPage.setShowHeader(false);
        Man.Man.declarations.main.controlobject.sideNav.setVisible(false); 
	     
  },
  
  calculateServicePrice: function(sPath){
  		var ment, cs;
		   	ment = 	Man.Man.declarations.manageData.controlobject.servicePriceCalcTab.getModel().getProperty(sPath).MENT;
		   	cs = 	Man.Man.declarations.manageData.controlobject.servicePriceCalcTab.getModel().getProperty(sPath).CS;
		   	if (ment==='Y' && cs==='Y'){
		   		var servicePerc = 	Man.Man.declarations.manageData.controlobject.servicePriceCalcTab.getModel().getProperty(sPath).SERV_PCT;
		   		servicePerc = servicePerc.replace("%","");
		   		var SCL2 = 	Man.Man.declarations.manageData.controlobject.servicePriceCalcTab.getModel().getProperty(sPath).SCL2;
		   		var scdata = Man.Man.declarations.manageData.controlobject.serviceCatalogTab.getModel().getData();
		   		 var relevantData =  scdata.filter(function(entry) {
										    return entry.SCL2 === SCL2;
										});
		   		 var totalSC = 0;
		   		 for (var i=0; i<relevantData.length;i++){
		   		 	if (relevantData[i].hasOwnProperty("ServiceCost")){
		   		 	     var serviceCost = parseFloat(relevantData[i].ServiceCost);
		   		 	     totalSC += serviceCost;
		   		 	}
		   		 }
		   		 
		   		 var servicePrice = servicePerc*totalSC;
		   		 servicePrice = servicePrice.toFixed(2);
		   		 	Man.Man.declarations.manageData.controlobject.servicePriceCalcTab.getModel().getProperty(sPath).servicePrice = servicePrice;
		   		 
		   	}
  	
  },
  
  servicePercentChanged: function(e){
  	var sPath = e.getSource().getBindingContext().sPath;
  	sap.ui.controller("controllers.manageData").calculateServicePrice(sPath);
  },
  
  markupPercentChanged: function(e){
  	
  },
  
  changeTabBreadcrumb: function(e){
     var selectedTabKey = e.getSource().mProperties.selectedKey;
     var selectedTabi18Name = Man.Man.formatter.supplyi18Names(selectedTabKey);
     manageDataView.byId("tabName").setText(selectedTabi18Name);
     
     var uploadText = "Upload " + selectedTabi18Name;
     var downloadText = "Template - " + selectedTabi18Name;
     
     Man.Man.declarations.manageData.controlobject.uploadDataBtn.setText(uploadText);
	 Man.Man.declarations.manageData.controlobject.downloadDTempateBtn.setText(downloadText);
  },
  

  changeVersion: function(e){
      var version;
      if(e.length){
       version = e;
      }
      else{
      	version = e.getSource().getSelectedItem().getText();
      }
     
      	$.ajax({
			url: "/analyticscloud/models/USStory/ms/" + "getScenarioData.xsjs?version=" + version,
			method: "GET",
            async: false,
			     success : function(data, textStatus, jqXHR) {
			     	//For finding total expenses in Financial Data Tab
							     	var finData = data.financialData;
							     	var totalExpenses = {};
							     	
							     	for (var i=0; i<finData.length; i++){
							     		var driver = finData[i].DRIVER;
							     		if (totalExpenses.hasOwnProperty(driver)){
							     			totalExpenses[driver] += parseFloat(finData[i].EXP_AMOUNT);
							     		}
							     		else{
							     			totalExpenses[driver]= parseFloat(finData[i].EXP_AMOUNT);
							     		}
							     	}
							     	
			     	
			     	//For finding total drivers in Service Catalog
			     					
			     					var servCatData = data.serviceCatalog;
			     					var totalDrivers = {};
			     					var totalServiceCostBySCL2 = {};
			     					for (var j=0; j<servCatData.length;j++){
			     							var driver = servCatData[j].DRIVER;
							     		if (totalDrivers.hasOwnProperty(driver)){
							     			totalDrivers[driver] += parseFloat(servCatData[j].QDRIVER);
							     		}
							     		else{
							     			totalDrivers[driver]= parseFloat(servCatData[j].QDRIVER);
							     		}
							     		if (totalServiceCostBySCL2.hasOwnProperty(servCatData[j].SCL2)){
							     		   continue;
							     		}
							     		else{
							     				totalServiceCostBySCL2[servCatData[j].SCL2] = 0;
							     		}
			     					}
			     	
			     
			     	//Calculated Value Assignment
			     	 	for (i=0; i<finData.length; i++){
			     	 		            var driver = finData[i].DRIVER;
							     		finData[i].Total_Expenses = totalExpenses[driver];
							     		finData[i].Total_QDRIVER = totalDrivers[driver];
							     		var expense = parseFloat(finData[i].EXP_AMOUNT);
							     			var numDriverFin = (expense/totalExpenses[driver])*totalDrivers[driver];
												numDriverFin = numDriverFin.toFixed(2);
												finData[i].QDRIVER_ALLOC = numDriverFin;
							     	}
					    
					    for (j=0;j<servCatData.length;j++){
					    	var driver = servCatData[j].DRIVER;
					    	var numDriver = parseFloat(servCatData[j].QDRIVER);
					    	var totalDriverNum = totalDrivers[driver];
					    	servCatData[j].DriverPerc = numDriver/totalDriverNum;
					    	servCatData[j].ServiceCost = servCatData[j].DriverPerc*totalExpenses[driver];
					    		totalServiceCostBySCL2[servCatData[j].SCL2] += servCatData[j].ServiceCost;
					    }
					    
					 	//For finding the service Price in Service Price Calc Tab
			     	            var servPriceData = data.servicePrice;
								 for (var s=0; s<servPriceData.length; s++){
											 	 if (servPriceData[s].MENT ==='N' || servPriceData[s].CS==='N'){
											 	    servPriceData[s].servicePrice = 0; continue;
											     }
								   var servicePerc;
								   var level2Service = servPriceData[s].SCL2;
								        servicePerc = servPriceData[s].SERV_PCT.replace("%","");
								   	    servicePerc = parseFloat(servicePerc);
								   	    
								   	var servicePrice;
								   	  servicePrice = totalServiceCostBySCL2[level2Service]*servicePerc;
								   	   servPriceData[s].servicePrice = servicePrice.toFixed(2);
								 
									}   
						var costByLegalData = data.costByLegal;	     	
			       Man.Man.declarations.manageData.controlobject.financialDataTab.getModel().setProperty("/", finData);
			       Man.Man.declarations.manageData.controlobject.serviceCatalogTab.getModel().setProperty("/", servCatData);
			      Man.Man.declarations.manageData.controlobject.servicePriceCalcTab.getModel().setProperty("/", servPriceData);
			       Man.Man.declarations.manageData.controlobject.costByLegalEntityTab.getModel().setProperty("/", costByLegalData);
			       
			       for (var i=0;i<servPriceData.length;i++){
			       	var sPath = "/" + i;
			       	manageDataView.calculateServicePrice(sPath);
			       }
			       
			       
			       // FOR Cost By Legal 
			        for (var j=0;j<costByLegalData.length;j++){
			       	var sPath = "/" + j;
			       	 manageDataView.calcCostByLegalValues(sPath);
			       }
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
  
  showInputChange: function(e){
      
      var originalValue = e.getSource().getPlaceholder();
      var newValue = e.getSource().getValue();
        var hasChangeStyleClass =  e.getSource().hasStyleClass("showInputChange"); //boolean
         if (!hasChangeStyleClass){
           e.getSource().addStyleClass("showInputChange");
         }
 
  },
  
  serviceCatalogNumDriverChanged: function(e){
  if(e.length){
  	sPath = e;
  }
  else{
  	sPath = e.getSource().getBindingContext().sPath;
  }
    var table = Man.Man.declarations.manageData.controlobject.serviceCatalogTab;
    var tableModel = table.getModel();
    var data = tableModel.getData();
    var driverName = tableModel.getProperty(sPath).DRIVER;
    var driverValue = parseFloat(tableModel.getProperty(sPath).QDRIVER);
    
    var totalDriver = 0;
    
    var relevantData =  data.filter(function(entry) {
						    return entry.DRIVER === driverName;
						});
	for (var i=0; i<relevantData.length; i++){
		if (relevantData[i].QDRIVER){
		var driverNum = parseFloat(relevantData[i].QDRIVER);
		totalDriver += driverNum;
		}
	}
	
	var financialModel = Man.Man.declarations.manageData.controlobject.financialDataTab.getModel();
	var financialData = financialModel.getData();
	   var totalExpenseOfDriver;
	for (i=0;i<financialData.length; i++){
		if (financialData[i].DRIVER===driverName){
			financialData[i].Total_QDRIVER = totalDriver;
				var expense = financialData[i].EXP_AMOUNT;
				if (typeof expense === 'string'){
				expense = expense.replace(/[, ]+/g, "").trim();
				expense = parseFloat(expense);
				}
			    totalExpenseOfDriver = parseFloat(financialData[i].Total_Expenses);
			var numDriverFin = (expense/totalExpenseOfDriver)*totalDriver;
			numDriverFin = numDriverFin.toFixed(2);
			financialData[i].QDRIVER_ALLOC = numDriverFin;
		}
	}

	financialModel.refresh();
	
	
	for (i=0;i<data.length;i++){
		var driverNum = parseFloat(data[i].QDRIVER);
		if (data[i].DRIVER === driverName){
			if (driverNum){
			data[i].DriverPerc = driverNum/totalDriver;
			var serviceCost = data[i].DriverPerc*totalExpenseOfDriver;
			data[i].ServiceCost = serviceCost.toFixed(2);
			}
			else{
				data[i].DriverPerc = 0;
			}
		}
	}
	tableModel.refresh();
   
  },
  
  percentValue: function(value){
  	if (value==="" || value===undefined || value===0 || value==="n/a"){
  		return "0%";
  	}
  	else {
  		value=parseFloat(value);
  		value = (value*100);
  		value = value.toFixed(2);
  		value += "%";
  		return value;
  	}
  },
  
  	addComma: function(value){
  
		 if (value===null || value===undefined || value===0 || value==="n/a"){
	        return "0";
	    }
	     var parts = value.toString().split(".");
                parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                parts = parts.join(".");
                if (parts.indexOf("-")>-1){
                    
                    return "("+parts.split('-')[1]+")";
                }
                else{
            	    return  parts;
                }
	},
	
		addDollars: function(value){
	    if (value===null || value===undefined || value===0 || value==="n/a"){
	        return "$0";
	    }
	    value = parseFloat(value).toFixed(2);
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
	
	resetTable: function(e){
		var iconTabBar = manageDataView.byId("idIconTabBar");
		var selectedKey = iconTabBar.getSelectedKey();
		var resetFile, table;
		visibleManagedDataTableID = selectedKey;
		
		if (Man.Man.declarations.manageData.controlobject.resetFinancialData){
		 switch(selectedKey){
			 	case "financialDataTab": resetFile = Man.Man.declarations.manageData.controlobject.resetFinancialData;
			 						        break;
			 							
			 	case "serviceCatalogTab": resetFile = Man.Man.declarations.manageData.controlobject.resetServiceCatalog;
			 							break;
			 							
			 	case "servicePriceCalcTab": resetFile = Man.Man.declarations.manageData.controlobject.resetServicePriceCalc; 
			 						 break;
			 							
			 	case "costByLegalEntityTab": resetFile = Man.Man.declarations.manageData.controlobject.resetCostByLegalEntity;
			 						 break;
			 							
			 	case "breakoutTab": resetFile = Man.Man.declarations.manageData.controlobject.resetBreakout;
			 		           break;
			 }
		
			 manageDataView._import(resetFile); 
		}
		else{
			manageDataView.changeVersion('Base_Scenario');
		}
			 
	},
	
	createNewScenario: function(e){
		
		
			if (!createScenarioDialog) {
			    	createScenarioDialog = sap.ui.xmlfragment("Man.Man.fragment.createScenario", manageDataView);
			          manageDataView.getView().addDependent(manageDataView.createScenarioDialog);
		            	}
		   
			createScenarioDialog.open();
			
		var dropdown = manageDataView.byId("globalVersionSelector");
		var dropdownData = dropdown.getModel().getData()
		
		  var versionModel = new sap.ui.model.json.JSONModel(dropdownData);
				     
		    var versionSelectTemplate = new sap.ui.core.Item({
						text: "{VERSION}",
						key: "{KEY}"
					});
		var dialogDropdown = createScenarioDialog.getContent()[0].getItems()[0].getItems()[1];
		dialogDropdown.setModel(versionModel);
		dialogDropdown.bindAggregation(
						"items",
						"/",
						versionSelectTemplate);
					
	},
	
	closeCreateScenario: function(){
		createScenarioDialog.close();
	},
	
	saveNewScenario: function(e){
		var scenarioName = createScenarioDialog.getContent()[0].getItems()[1].getItems()[1].getValue();
		var baseScenarioName = createScenarioDialog.getContent()[0].getItems()[0].getItems()[1].getSelectedItem().getText();
		var dropdown = manageDataView.byId("globalVersionSelector");
		
		  var truncDetails = [
                  {"baseScenario": baseScenarioName,
                   "newScenario": scenarioName
                  }
                  ];      
                     
                               jQuery.ajax({
                                url: "/analyticscloud/models/USStory/ms/" + "createScenarioFinancial.xsjs",
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
                                        url: "/analyticscloud/models/USStory/ms/" + "createScenarioFinancial.xsjs",
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
                            
                 jQuery.ajax({
                                url: "/analyticscloud/models/USStory/ms/" + "createScenarioServiceCatalog.xsjs",
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
                                        url: "/analyticscloud/models/USStory/ms/" + "createScenarioServiceCatalog.xsjs",
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
                            
                 jQuery.ajax({
                                url: "/analyticscloud/models/USStory/ms/" + "createScenarioServicePricing.xsjs",
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
                                        url: "/analyticscloud/models/USStory/ms/" + "createScenarioServicePricing.xsjs",
                                        data: sendDetails,
                                        headers: oHeaders,
                                        success: function(data, status, response) {
                                            console.log(data);
                                            	manageDataView.initialiseScenario();
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
                            
                            
                  jQuery.ajax({
                                url: "/analyticscloud/models/USStory/ms/" + "createScenarioCostByLegal.xsjs",
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
                                        url: "/analyticscloud/models/USStory/ms/" + "createScenarioCostByLegal.xsjs",
                                        data: sendDetails,
                                        headers: oHeaders,
                                        success: function(data, status, response) {
                                            console.log(data);
                                            manageDataView.changeVersion(scenarioName);
                                            manageDataView.initialiseScenario();
                                            var dropdownData = dropdown.getModel().getData();
                                            var keyToSet = dropdownData.length;
                                            dropdown.setSelectedKey(keyToSet);
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
              var msg = "Created " + scenarioName + " !";
			sap.m.MessageToast.show(msg);
			
		
		createScenarioDialog.close();
	},
	
	saveTableToHANA: function(e){
		var iconTabBar = manageDataView.byId("idIconTabBar");
		var selectedKey = iconTabBar.getSelectedKey();
		var table, backendTableName;
		 switch(selectedKey){
			 	case "financialDataTab": table = Man.Man.declarations.manageData.controlobject.financialDataTab;
			 								backendTableName = "SC1_FH1";
			 						        break;
			 							
			 	case "serviceCatalogTab": table = Man.Man.declarations.manageData.controlobject.serviceCatalogTab;
			 							backendTableName = "SC1_SC1";
			 							break;
			 							
			 	case "servicePriceCalcTab": table = Man.Man.declarations.manageData.controlobject.servicePriceCalcTab; 
			 		backendTableName = "SC1_PENT";
			 						 break;
			 							
			 	case "costByLegalEntityTab": table = Man.Man.declarations.manageData.controlobject.costByLegalEntityTab;
			 		backendTableName = "SC1_R_ENT_ALLOC";
			 						 break;
			 							
			 	case "breakoutTab": table = Man.Man.declarations.manageData.controlobject.breakoutTab;
			 		           break;
			 }
			 
	

			   var runUploadTableData = [];
		  	 var tableData = table.getModel().getData();
		  	 var keys = table.columns;
			 
			 for (var i=0; i<tableData.length; i++){
			 	var obj = {};
			       for (var j=0; j<keys.length; j++){
			           obj[keys[j]] = tableData[i][keys[j]];
			           }
			 	runUploadTableData.push(obj);
			 }
			 var versionName;
		      
		      versionName = tableData[0].VERSION;
			 sap.ui.controller("controllers.manageData").saveCurrentState(backendTableName,runUploadTableData,versionName);
			 
	},
	

costByLegalDriverAllocChanged: function(e){
   var sPath =  e.getSource().getBindingContext().sPath;
	manageDataView.calcCostByLegalValues(sPath);
},

calcCostByLegalValues: function(sPath){

	var rowData = Man.Man.declarations.manageData.controlobject.costByLegalEntityTab.getModel().getProperty(sPath);
		var numDriver = parseFloat(rowData.QDRIVER_ALLOC);
		
	var servPriceData = Man.Man.declarations.manageData.controlobject.servicePriceCalcTab.getModel().getProperty("/");
	var relevantDataOfServCatalog =  servPriceData.filter(function(entry) {
										    return (entry.DRIVER_ALLOC === rowData.DRIVER_ALLOC && entry.PENT === rowData.PENT);
										});
	var totalDriver = parseFloat(relevantDataOfServCatalog[0].QDRIVER_ALLOC);
	var driverPercOfRow = numDriver/totalDriver;
	rowData.DriverP = driverPercOfRow.toFixed(2);
	
	var servicePrice = parseFloat(relevantDataOfServCatalog[0].servicePrice);
	var costOfRow = rowData.DriverP*servicePrice;
	rowData.Cost = costOfRow.toFixed(2);
	
     var costByLegalEntData = Man.Man.declarations.manageData.controlobject.costByLegalEntityTab.getModel().getProperty("/");
	var rowsWithSamePEnLE = costByLegalEntData.filter(function(entry) {
										    return (entry.PENT === rowData.PENT && entry.R_ENT === rowData.R_ENT);
										});
	var totalCost = 0;
	for (var i=0; i<rowsWithSamePEnLE.length; i++){
		if(!rowsWithSamePEnLE[i].Cost){
			rowsWithSamePEnLE[i].Cost = 0;
		}
		totalCost += parseFloat(rowsWithSamePEnLE[i].Cost);
	}
	
	for (i=0; i<rowsWithSamePEnLE.length; i++){
		rowsWithSamePEnLE[i].TOTALCOST = totalCost.toFixed(2);
	}
	 Man.Man.declarations.manageData.controlobject.costByLegalEntityTab.getModel().refresh();
}
	
	
	
	

	
	
});