/*Load Cost Center data*/

function loadData(dataGenerator){
	var counter = 0;
	for(var i = 0 ; i < 100; i++){
		
		var sql = 	"insert into \"PINAKIP\".\"analyticscloud.db.CIO::ITVendors\" values(?,?,?,?,?)";
		var statement = genObj.connection.prepareStatement(sql);
		
		var vendorId = genObj.generateRandomAlphaNum(10,{
			aPossibilities : '1234567890',
			prefix : "300"
		});
		var creditorAccNumber = genObj.generateRandomAlphaNum(10,{
			aPossibilities : '1234567890',
			prefix : "400"
		});
		var vendorName = "Vendor-"+vendorId;
		
		var VendorFunction = genObj.generateRandomAlphaNum(1,{
			aPossibilities : genObj.states,
			prefix : ""
		});
		var VendorType = genObj.countries[genObj.states.indexOf(VendorFunction)];
		
		statement.setString(1,vendorId);
		statement.setString(2,creditorAccNumber);
		statement.setString(3,vendorName);
		statement.setString(4,VendorFunction);
		statement.setString(5,VendorType);
		
		var resultSet= statement.executeQuery();
		genObj.connection.commit();
		counter++;

	}
	genObj.addMessage("Total number of Vendors generated : "+ counter , "Success")
}