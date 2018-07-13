/*Load Cost Pool data*/

function loadData(dataGenerator){
	var counter = 0;
	var connection = $.db.getConnection();
	for(var i = 0 ; i < genObj.costPoolName.length; i++){
		
		var sql = 	"insert into \"PINAKIP\".\"analyticscloud.db.CIO::CostPool\" values(?,?,?,?,?)";
		var statement = connection.prepareStatement(sql);
		
		var costPoolID = genObj.generateRandomAlphaNum(7,{
			aPossibilities : '1234567890',
			prefix : "CP-"
		});
		var costPoolName = genObj.generateRandomAlphaNum(1,{
			aPossibilities : [genObj.costPoolName[i]],
			prefix : ""
		});
		var subCostPoolName = genObj.generateRandomAlphaNum(10);
		var ChartsofAccountID = genObj.generateRandomAlphaNum(8,{
			aPossibilities : '1234567890',
			prefix : "7000000"
		});
		var GLAccountNumber = genObj.generateRandomAlphaNum(8,{
			aPossibilities : '1234567890',
			prefix : "7100000"
		});
		
		statement.setString(1,costPoolID);
		statement.setString(2,costPoolName);
		statement.setString(3,subCostPoolName);
		statement.setString(4,ChartsofAccountID);
		statement.setString(5,GLAccountNumber);
		var resultSet= statement.executeQuery();
		connection.commit();
		counter++;
	}
	
	genObj.addMessage("Total number of cost pools generated : "+ counter , "Success")
	connection.close();
}