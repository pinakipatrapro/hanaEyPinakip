/*Load Cost Pool data*/

function loadData(dataGenerator){
	var counter = 0;
	var aDistinctChartOfAccounts = genObj.getTableColumnAsDistinctArray('"PINAKIP"."analyticscloud.db.CIO::CostPool"','ChartsofAccountID',' 1=1 ');
	var aDistinctGLAccountNumber = genObj.getTableColumnAsDistinctArray('"PINAKIP"."analyticscloud.db.CIO::CostPool"','GLAccountNumber',' 1=1 ');

	for(var i = 0 ; i < aDistinctGLAccountNumber.length; i++){

		var sql = 	"insert into \"PINAKIP\".\"analyticscloud.db.CIO::ChartofAccounts\" values(?,?,?,?)";
		var statement = genObj.connection.prepareStatement(sql);

		var ChartOfAccountsID = aDistinctChartOfAccounts[i];
		var GLAccountNumber = aDistinctGLAccountNumber[i];
		
		var GLAccountName = genObj.generateRandomAlphaNum(8,{
			aPossibilities : '1234567890',
			prefix : "GL_AC"
		});
		var GLAccountGroup = genObj.generateRandomAlphaNum(8,{
			aPossibilities : '1234567890',
			prefix : "GL_GR"
		});

		statement.setString(1,ChartOfAccountsID);
		statement.setString(2,GLAccountNumber);
		statement.setString(3,GLAccountName);
		statement.setString(4,GLAccountGroup);
		
		var resultSet= statement.executeQuery();
		counter++;
	}
	genObj.addMessage("Total number of chart of account generated : "+ counter , "Success")
	genObj.connection.commit();
}