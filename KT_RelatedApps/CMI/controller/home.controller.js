sap.ui.controller("controllers.home", {
  
   onInit:function(){
      
     /* this.getView().byId("sideNavigation").setVisible(false);*/
      Man.Man.declarations.main.controlobject.detailWindowPage.setShowHeader(false);
      Man.Man.declarations.main.controlobject.sideNav.setVisible(false); 
  },
  
  onAfterRendering:function(){
    Man.Man.declarations.main.controlobject.detailWindowPage.setShowHeader(false);
      Man.Man.declarations.main.controlobject.sideNav.setVisible(false); 
  },
  
   
  handleTile1:function(evt){
  	 var sideNav =  sap.ui.getCore().byId('__xmlview0--sideNavigation');
        	     var list = sideNav.getItem();
  	var currentSideNavItem = list.getItems()[1];
		list.setSelectedItem(currentSideNavItem);
		
		 Man.Man.declarations.main.controlobject.detailWindowPage.setShowHeader(true);
      Man.Man.declarations.main.controlobject.sideNav.setVisible(true); 
      
    mainRoutes.navTo("manageData", false);
  },
  
  	
hideBusyIndicator: function(delay){
	setTimeout(function(){
		sap.ui.core.BusyIndicator.hide();
		 },delay);
	},
  
 handleTile3:function(evt){
  	  	 var sideNav =  sap.ui.getCore().byId('__xmlview0--sideNavigation');
        var list = sideNav.getItem();
  	var currentSideNavItem = list.getItems()[3];
		list.setSelectedItem(currentSideNavItem);
		
  	  Man.Man.declarations.main.controlobject.detailWindowPage.setShowHeader(true);
      Man.Man.declarations.main.controlobject.sideNav.setVisible(false); 
        mainRoutes.navTo("analytics", false);
   //    window.open("https://be-ey.eu1.sapbusinessobjects.cloud/sap/fpa/ui/tenants/024/app.html#;view_id=digital-boardroom-view;presentationId=8680F55A9835EA27E10000000A4E73C2;topicId=8980F55A9835EA27E10000000A4E73C2;storyId=805AF55A9835EA27E10000000A4E73C2;pageId=48909aae-3321-4d5e-809d-1daf08b640e4");
     
  },
  navToQuickGuide: function(evt){
       
  }
  

});