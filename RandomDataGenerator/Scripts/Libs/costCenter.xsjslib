/**
 * Auto generates data for the CostCenter table
 * @param dataGenerator 
 * @returns
 */
function loadData(dataGenerator){
	var counter = 0;
	for(var i = 0 ; i < genObj.distinctCostCenteres.length; i++){
		
		var sql = 	"insert into \"PINAKIP\".\"analyticscloud.db.CIO::CostCenter\" values(?,?,?,?,?)";
		var statement = genObj.connection.prepareStatement(sql);
		
		var costCenterID = genObj.generateRandomAlphaNum(8,{
			aPossibilities : '1234567890',
			prefix : "CC-"
		});
		var costCenterName = genObj.generateRandomAlphaNum(1,{
			aPossibilities : [genObj.distinctCostCenteres[i]],
			prefix : ""
		});
		var costCenterOwner = genObj.generateRandomAlphaNum(1,{
			aPossibilities : genObj.distinctNames,
			prefix : ""
		});
		var levelCCHierarchy = genObj.generateRandomDecimal(2,3)
		var parentCostCenter = genObj.getDistinctFromTableColumn('"PINAKIP"."analyticscloud.db.CIO::CostCenter"','CostCenterID',' "LevelInCCHierarchy" < '+ levelCCHierarchy);
		
		if(!parentCostCenter){
			var parentCostCenter = genObj.generateRandomAlphaNum(8,{
				aPossibilities : '1234567890',
				prefix : "CC-"
			});
		}
		
		statement.setString(1,costCenterID);
		statement.setString(2,costCenterName);
		statement.setString(3,costCenterOwner);
		statement.setInteger(4,levelCCHierarchy);
		statement.setString(5,parentCostCenter);
		var resultSet= statement.executeQuery();
		genObj.connection.commit();
		counter++;
	}
	

	genObj.addMessage("Total number of cost centers generated : "+ counter , "Success")
}