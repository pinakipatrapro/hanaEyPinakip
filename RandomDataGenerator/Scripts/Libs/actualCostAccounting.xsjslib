/*Load Cost Pool data*/

function loadData(dataGenerator){
	var counter = 0;
	//Declare F-Key Tables
	var invDocTable = '"PINAKIP"."analyticscloud.db.CIO::Invoices"';
	var reportingUnitTable = '"PINAKIP"."analyticscloud.db.CIO::ReportingUnit"';
	var creditorAccTable = '"PINAKIP"."analyticscloud.db.CIO::CreditorAccount"';
	var costCenterTable = '"PINAKIP"."analyticscloud.db.CIO::CostCenter"';
	var wbsTable = '"PINAKIP"."analyticscloud.db.CIO::WBS"';
	var chartOfAccTable = '"PINAKIP"."analyticscloud.db.CIO::ChartofAccounts"';
	
	
	// Pre-load Table Data
	
	var aCompanyCodes = genObj.getTableColumnAsDistinctArray(reportingUnitTable,'CompanyCode',' 1=1 ');
	var aCreditorAccountNumber = genObj.getTableColumnAsDistinctArray(creditorAccTable,'CreditorAccNumber',' 1=1 ');
	var aCostCenterId = genObj.getTableColumnAsDistinctArray(costCenterTable,'CostCenterID',' 1=1 ');
	var aWbsTable = genObj.getTableColumnAsDistinctArray(wbsTable,'WBSElementID',' 1=1 ');
	
	var aInvDocNumber = genObj.getTableColumnAsArray(invDocTable,'InvoiceDocNumber',' 1=1 ');
	var aInvDocItemNumber = genObj.getTableColumnAsArray(invDocTable,'InvoiceLineItemID',' 1=1 ');
	var aAmount = genObj.getTableColumnAsArray(invDocTable,'InvoiceLineItemPrice',' 1=1 ');
	
	var aGlAccNumber = genObj.getTableColumnAsDistinctArray(chartOfAccTable,'GLAccountNumber',' 1=1 ');
	var aChartOfAccId = genObj.getTableColumnAsDistinctArray(chartOfAccTable,'ChartsofAccountID',' 1=1 ');
	
	//Loop PO for 1:1 Mapping
	for(var i = 0 ; i < aInvDocItemNumber.length; i++){

		var sql = 	"insert into \"PINAKIP\".\"analyticscloud.db.CIO::AccountingDocumentsActuals\" values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		var statement = genObj.connection.prepareStatement(sql);

		var companyCode = genObj.generateRandomAlphaNum(1,{
			aPossibilities : aCompanyCodes,
			prefix : ""
		});
		
		var fiscalYear = "" + genObj.generateRandomDecimal(2016,2018);
		
		var accountingDocNumber = genObj.generateRandomAlphaNum(11,{
			aPossibilities : '1234567890',
			prefix : "90"
		});
		var lineItemNumber = aInvDocItemNumber[i];
		var lineItemText   = genObj.generateRandomAlphaNum(1,{
			aPossibilities : genObj.productName,
			prefix : ""
		});
		
		var creditorAccountNumber = genObj.generateRandomAlphaNum(1,{
			aPossibilities : aCreditorAccountNumber,
			prefix : ""
		});
		
		var debitorAccountNumber = genObj.generateRandomAlphaNum(10,{
			aPossibilities : '1234567890',
			prefix : "DA-"
		});
		
		var mainAssetNumber = genObj.generateRandomAlphaNum(10,{
			aPossibilities : '1234567890',
			prefix : "MA-"
		});
		var costCenterID = genObj.generateRandomAlphaNum(1,{
			aPossibilities : aCostCenterId,
			prefix : ""
		});
		var wbsElementId = genObj.generateRandomAlphaNum(1,{
			aPossibilities : aWbsTable,
			prefix : ""
		});
		var invDocNumber = aInvDocNumber[i];
		var invLineItemNumber = aInvDocItemNumber[i];
		
		var postingPeriod  = fiscalYear;
		var postingDate = genObj.generateRandDate(fiscalYear + '0101', fiscalYear + '1231');
		
		var postingUser  =  genObj.generateRandomAlphaNum(1,{
			aPossibilities : genObj.distinctNames,
			prefix : ""
		});
		
		var amount = aAmount[i];
		var currency  =  genObj.generateRandomAlphaNum(1,{
			aPossibilities : genObj.projBudgetCurrency,
			prefix : ""
		});
		
		var glAccNumber =  genObj.generateRandomAlphaNum(1,{
			aPossibilities : aGlAccNumber,
			prefix : ""
		});
		var chartOfAccId =  genObj.generateRandomAlphaNum(1,{
			aPossibilities : aChartOfAccId,
			prefix : ""
		});
		
		
		
		
		
		statement.setString(1,companyCode);
		statement.setString(2,fiscalYear);
		statement.setString(3,accountingDocNumber);
		statement.setString(4,lineItemNumber);
		statement.setString(5,lineItemText);
		
		statement.setString(6,creditorAccountNumber);
		statement.setString(7,debitorAccountNumber);
		statement.setString(8,mainAssetNumber);
		statement.setString(9,costCenterID);
		statement.setString(10,wbsElementId);
		
		statement.setString(11,invDocNumber);
		statement.setString(12,invLineItemNumber);
		statement.setString(13,postingPeriod);
		statement.setString(14,postingDate);
		statement.setString(15,postingUser);
		
		statement.setDecimal(16,amount);
		statement.setString(17,currency);
		statement.setString(18,glAccNumber);
		statement.setString(19,chartOfAccId);
		
		
		var resultSet= statement.executeQuery();
		counter++;
		genObj.connection.commit();

	}

	genObj.addMessage("Total number of actual cost accounting generated : "+ counter , "Success")
}
