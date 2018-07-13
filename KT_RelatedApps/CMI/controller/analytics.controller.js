sap.ui.controller("controllers.analytics", {
  
   onInit:function(){
      
     /* this.getView().byId("sideNavigation").setVisible(false);*/
      Man.Man.declarations.main.controlobject.detailWindowPage.setShowHeader(true);
      Man.Man.declarations.main.controlobject.sideNav.setVisible(false); 
  },
  
  onAfterRendering:function(){
    Man.Man.declarations.main.controlobject.detailWindowPage.setShowHeader(true);
      Man.Man.declarations.main.controlobject.sideNav.setVisible(false); 
  },
  
  	
hideBusyIndicator: function(delay){
	setTimeout(function(){
		sap.ui.core.BusyIndicator.hide();
		 },delay);
	},
	
goToHome: function(){
	     mainRoutes.navTo("home", false);
	    Man.Man.declarations.main.controlobject.detailWindowPage.setShowHeader(false);
        Man.Man.declarations.main.controlobject.sideNav.setVisible(false); 
	     
  }
		
  

  

});