/*Load Cost Pool data*/

function loadData(dataGenerator){
	var counter = 0;
	var connection = $.db.getConnection();

	var tableName = '"PINAKIP"."analyticscloud.db.CIO::PurchaseOrders"';
	var aCreditorAccountNum = genObj.getTableColumnAsArray(tableName,'CreditorAccNumber',' 1=1 ');
	var poDocNumber = genObj.getTableColumnAsArray(tableName,'PODocNumber',' 1=1 ');
	var poLineItemId = genObj.getTableColumnAsArray(tableName,'POLineItemID',' 1=1 ');
	
	var POLineItemOrderUnit = genObj.getTableColumnAsArray(tableName,'POLineItemOrderUnit',' 1=1 ');
	var POLineItemOrderQuantity = genObj.getTableColumnAsArray(tableName,'POLineItemOrderQuantity',' 1=1 ');
	var POLineItemUnitPrice = genObj.getTableColumnAsArray(tableName,'POLineItemUnitPrice',' 1=1 ');
	var POLineItemPrice = genObj.getTableColumnAsArray(tableName,'POLineItemPrice',' 1=1 ');
	var OrderDate = genObj.getTableColumnAsArray(tableName,'OrderDate',' 1=1 ');
	
	for(var i = 0 ; i < poDocNumber.length; i++){

		var sql = 	"insert into \"PINAKIP\".\"analyticscloud.db.CIO::Invoices\" values(?,?,?,?,?,?,?,?,?,?,?)";
		var statement = connection.prepareStatement(sql);

		var InvDocNum = genObj.generateRandomAlphaNum(11,{
			aPossibilities : '1234567890',
			prefix : "80"
		});
		var invItemId = poLineItemId[i];
		
		var credAcNumber = aCreditorAccountNum[i];
		var poId = poDocNumber[i];
		var poiItemId = poLineItemId[i];
		
		var invLineText = "Invoice for " + genObj.generateRandomAlphaNum(1,{
			aPossibilities : genObj.productName,
			prefix : ""
		});
		
		var invUnit = POLineItemOrderUnit[i];
		var qty = POLineItemOrderQuantity[i];
		var unitPrice = POLineItemUnitPrice[i];
		var price = POLineItemPrice[i];
		var date = OrderDate[i];
		
		statement.setString(1,InvDocNum);
		statement.setString(2,invItemId);
		statement.setString(3,credAcNumber);
		statement.setString(4,poId);
		statement.setString(5,poiItemId);
		
		statement.setString(6,invLineText);
		statement.setString(7,invUnit);
		statement.setDecimal(8,qty);
		statement.setDecimal(9,unitPrice);
		statement.setDecimal(10,price);
		statement.setString(11,date);
		
		
		var resultSet= statement.executeQuery();
		counter++;
	}
	connection.commit();
	genObj.addMessage("Total number of invoice documents generated : "+ counter , "Success")
	connection.close();
}
