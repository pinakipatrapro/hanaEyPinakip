/*Load Project data*/

function loadData(dataGenerator){
	var counter = 0;

	for(var i = 0 ; i < genObj.projectName.length; i++){

		var sql = 	"insert into \"PINAKIP\".\"analyticscloud.db.CIO::Projects\" values(?,?,?,?,?,?,?,?,?,?,?,?)";
		var statement = genObj.connection.prepareStatement(sql);

		var projectId = genObj.generateRandomAlphaNum(11,{
			aPossibilities : '1234567890',
			prefix : "PJ-"
		});
		var projName = genObj.projectName[i];
		var projMgr = genObj.generateRandomAlphaNum(1,{
			aPossibilities : genObj.distinctNames,
			prefix : ""
		});
		var projCat = genObj.generateRandomAlphaNum(1,{
			aPossibilities : genObj.projectCategory,
			prefix : ""
		});

		var fundingType = genObj.generateRandomAlphaNum(1,{
			aPossibilities : genObj.projectFundType,
			prefix : ""
		});



		var projectBudgetCurrency = genObj.generateRandomAlphaNum(1,{
			aPossibilities : genObj.projBudgetCurrency,
			prefix : ""
		});

		var projectBudget = genObj.generateRandomDecimal(1,100)*10000;



		var plannedStartDate = genObj.generateRandDate('20170101','20181231');
		var plannedEndDate = genObj.generateRandDate(plannedStartDate,'20181231');

		var actualStartDate = genObj.generateRandDate(plannedStartDate,plannedEndDate);
		var actualEndDate = genObj.generateRandDate(actualStartDate,'20191231');

		var tempCurrentDate = new Date().toISOString().slice(0,10).replace(/-/g,"");

		var projectStatus = 'Unavailable';

		if(tempCurrentDate > actualEndDate){
			projectStatus = 'Closed'
		}else if(tempCurrentDate < actualEndDate){
			projectStatus = 'Ongoing'
		}else if(tempCurrentDate < actualStartDate){
			projectStatus = 'Planned'
		}

		statement.setString(1,projectId);
		statement.setString(2,projName);
		statement.setString(3,projMgr);
		statement.setString(4,projCat);
		statement.setString(5,fundingType);
		statement.setString(6,projectStatus);

		statement.setDecimal(7,projectBudget);
		statement.setString(8,plannedStartDate);
		statement.setString(9,plannedEndDate);
		statement.setString(10,actualStartDate);
		statement.setString(11,actualEndDate);
		statement.setString(12,projectBudgetCurrency);

		var resultSet= statement.executeQuery();
		counter++;

	}
	genObj.connection.commit();
	genObj.addMessage("Total number of projects generated : "+ counter , "Success");
}
