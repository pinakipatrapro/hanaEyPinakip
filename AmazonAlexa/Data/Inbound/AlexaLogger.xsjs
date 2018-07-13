var postData = JSON.parse($.request.body.asString());

function initialize(){
	return $.db.getConnection();
}
function insertIntoTable(conn){
	var st = conn.prepareStatement("insert into \"PINAKIP\".\"ALEXA_DISPLAY\" values((select sysuuid from dummy),(select current_user from dummy),(select current_timestamp from dummy)"+
								",'"+$.util.codec.encodeBase64(postData.RESPONSE)+"','"+postData.RESPONSE_TEXT+"','"+postData.MODEL_NAME+"','"+postData.SERVICE_URL+"','')");
	st.execute();
}
function updateTable(conn){
	var st = conn.prepareStatement("update \"PINAKIP\".\"ALEXA_DISPLAY\" set STATUS = 'X' where CREATED_BY = (select current_user from dummy)");
	st.execute();
}
function updateAllTable(conn){
	var st = conn.prepareStatement("update \"PINAKIP\".\"ALEXA_DISPLAY\" set STATUS = 'X' ");
	st.execute();
}
function exit(conn){
	conn.commit();
	conn.close();
}

var conn = initialize();
if(postData.resetAll){
	updateAllTable(conn);
}else{
	updateTable(conn);
	insertIntoTable(conn);
}	
exit(conn);