/*Load Cost Pool data*/

function loadData(dataGenerator){
	var counter = 0;
	var connection = $.db.getConnection();
	var aDistinctCreditorAccountNum = genObj.getTableColumnAsDistinctArray('"PINAKIP"."analyticscloud.db.CIO::CreditorAccount"','CreditorAccNumber',' 1=1 ');

	for(var i = 0 ; i < 5; i++){

		var sql = 	"insert into \"PINAKIP\".\"analyticscloud.db.CIO::PurchaseOrders\" values(?,?,?,?,?,?,?,?,?)";
		var statement = connection.prepareStatement(sql);
		
		var poDocNum = genObj.generateRandomAlphaNum(11,{
			aPossibilities : '1234567890',
			prefix : "900001"
		});
		
		var noLineItems = genObj.generateRandomDecimal(1,9);
		for(var j=1;j<noLineItems;j++){
			
			var poDocLineId = ""+j;
			
			var creditorAccountNumber = genObj.generateRandomAlphaNum(1,{
				aPossibilities : aDistinctCreditorAccountNum,
				prefix : ""
			});
			var poText =  genObj.generateRandomAlphaNum(1,{
				aPossibilities : genObj.productName,
				prefix : ""
			});
			var poUnit = genObj.generateRandomAlphaNum(1,{
				aPossibilities : genObj.uom,
				prefix : ""
			});
			
			var orderQuantity = genObj.generateRandomDecimal(1,100) ;
			var unitPrice = genObj.generateRandomDecimal(10,10000)/195;
			var linePrice = (orderQuantity * unitPrice);
			var orderDate = genObj.generateRandDate('20170101','20180331');
			
			statement.setString(1,poDocNum);
			statement.setString(2,poDocLineId);
			statement.setString(3,creditorAccountNumber);
			statement.setString(4,poText);
			statement.setString(5,poUnit);
			statement.setDecimal(6,orderQuantity);
			statement.setDecimal(7,unitPrice);
			statement.setDecimal(8,linePrice);
			statement.setString(9,orderDate);
			var resultSet= statement.executeQuery();
			counter++;
		}
		
		
		
	}
	genObj.addMessage("Total number of purchase orders generated : "+ counter , "Success")
	connection.commit();
	connection.close();
}
