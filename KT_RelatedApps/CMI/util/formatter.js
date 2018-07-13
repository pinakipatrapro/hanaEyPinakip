jQuery.sap.declare("Man.Man.util.Formatter");

Man.Man.formatter = {
    
    date : function(value){
        if(value !== null){
            var year = value.substring(0,4);
            var month = value.substring(4,6);
            var day = value.substring(6,8);
            var date = month +'/'+ day +'/'+ year;
            return date;
        }
        
    },
    
    supplyi18Names: function(runningName){
         runningName = runningName.split(" ").join(""); 
          var oBundle =  Man.Man.declarations.common.controlobject.oBundle;
          var sRecipient = Man.Man.declarations.common.controlobject.sRecipient;
          
		    var editedName =  oBundle.getText(runningName, [sRecipient]);
		    return editedName;
		}
    
};