/*Load Project data*/

function loadData(dataGenerator){
	var counter = 0;
	var connection = $.db.getConnection();
	var aDistinctProjectId = genObj.getTableColumnAsDistinctArray('"PINAKIP"."analyticscloud.db.CIO::Projects"','ProjectID',' 1=1 ');

	for(var i = 0 ; i < genObj.wbs.length; i++){

		var sql = 	"insert into \"PINAKIP\".\"analyticscloud.db.CIO::WBS\" values(?,?,?,?,?,?)";
		var statement = connection.prepareStatement(sql);

		var wbsId =  genObj.generateRandomAlphaNum(11,{
			aPossibilities : '1234567890',
			prefix : "WBS-"
		});
		
		var wbsName  = genObj.wbs[i];
		
		var projId = genObj.generateRandomAlphaNum(1,{
			aPossibilities : aDistinctProjectId,
			prefix : ""
		});
		var wbsProjName = genObj.generateRandomAlphaNum(1,{
			aPossibilities : genObj.wbsProjName,
			prefix : ""
		});
		var projManager = genObj.generateRandomAlphaNum(1,{
			aPossibilities : genObj.distinctNames,
			prefix : ""
		});
		var expType = genObj.generateRandomAlphaNum(1,{
			aPossibilities : genObj.wbsExpenseType,
			prefix : ""
		});
		
		statement.setString(1,wbsId);
		statement.setString(2,wbsName);
		statement.setString(3,projId);
		statement.setString(4,wbsProjName);
		statement.setString(5,projManager);
		statement.setString(6,expType);


		var resultSet= statement.executeQuery();
		connection.commit();
		counter++;
	}

	genObj.addMessage("Total number of WBS generated : "+ counter , "Success")
	connection.close();
}
