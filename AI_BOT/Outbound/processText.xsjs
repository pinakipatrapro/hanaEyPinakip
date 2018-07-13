try {
    //readDestination(package, destination_name)/Pinaki/AI_BOT/Outbound/recast.xshttpdest
    var destination = $.net.http.readDestination("Pinaki.AI_BOT.Outbound", "recast");
    var client = new $.net.http.Client();
   
     var request = new $.net.http.Request($.net.http.POST, "{\"text\":'zzzzzzzz'}");
     // api.github.com wants a user agent, so we have to provide it
     request.headers.set('Authorization', 'Token 36a7d19e0fdc86ded846632d49b976c9');
     
     var response = client.request(request, destination).getResponse();
     //The rest of the file (attached) is just a default forward of the response
  var myCookies = [], myHeader = [], myBody;
    //Cookies
    for(var c in response.cookies) {
        myCookies.push(response.cookies[c]);
    }
    //Headers
    for(var h in response.headers) {
         myHeader.push(response.headers[h]);
    }
    //Body
    if(response.body)
        try{
             myBody = JSON.parse(response.body.asString());
        }
        catch(e){
            myBody = response.body.asString();
        }
    $.response.contentType = "application/json";
    $.response.setBody(JSON.stringify({
        "status"    : response.status,
        "cookies"   : myCookies,
        "headers"   : myHeader,
        "body"      : myBody
        }));
}
catch (e) {
    $.response.setBody(e.message);
    $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
}