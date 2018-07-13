var subHeaderLevelOne,subHeaderLevelTwo,subHeaderLevelThree;
var subHeaderLevelOneNode, subHeaderLevelTwoNode;
var listItemSelected = 0;
sap.ui.controller("controllers.main", {

onInit: function() { 
    
    var contentContainer = this.getView().byId("navContainerBox");
    contentContainer.setHeight(Man.Man.functions.setWindowHeight());
    contentContainer.setWidth(Man.Man.functions.setWindowWidth());
      Man.Man.declarations.main.controlobject.detailWindowPage =  sap.ui.getCore().byId("__xmlview0--detailWindowPage");
        Man.Man.declarations.main.controlobject.sideNav = sap.ui.getCore().byId("__xmlview0--sideNavigation");
    this.router = sap.ui.core.UIComponent.getRouterFor(this);
       
     
      mainRoutes.navTo("home",false);
 
	},
	
	onAfterRendering:function(){
	  /*
	     subHeaderLevelOne = sap.ui.getCore().byId("__xmlview3--subHeaderLevelOne");
        subHeaderLevelTwo = sap.ui.getCore().byId("__xmlview3--subHeaderLevelTwo");
        subHeaderLevelThree = sap.ui.getCore().byId("__xmlview3--subHeaderLevelThree");
        subHeaderLevelOneNode= "";
        subHeaderLevelTwoNode= "";
        */
	},

	  _handleRouteMatched : function(evt)
    {
        var pageName = evt.mParameters.name;
        var viewPath = evt.mParameters.view.sViewName;
    	var targetVBox = this.getView().byId("navContainerBox");
    	
             if(!sap.ui.getCore().byId(pageName))
             {    targetVBox.removeAllPages();
               targetVBox.addPage(
               sap.ui.view({id:pageName, viewName : viewPath, type: sap.ui.core.mvc.ViewType.XML})
                   );
             }
             
        	else 
        	 {  targetVBox.removeAllPages();
               targetVBox.addPage(sap.ui.getCore().byId(pageName));
              }
              mainRoutes.navTo(pageName,false);
 
	},

	 handleSideNav:function(oEvent){
      
        var side = Man.Man.declarations.main.controlobject.sideNav;
          side.setVisible(true);
        var exp = !side.getExpanded();

        if(exp){
             sap.ui.getCore().byId('__xmlview0--sideNavigation').removeStyleClass('clsSideExpColl2');
            sap.ui.getCore().byId('__xmlview0--sideNavigation').addStyleClass('clsSideExpColl1');
            
        }
        else
        {
            sap.ui.getCore().byId('__xmlview0--sideNavigation').removeStyleClass('clsSideExpColl1');
            sap.ui.getCore().byId('__xmlview0--sideNavigation').addStyleClass('clsSideExpColl2');
            
        }
        side.setExpanded(exp);
    },

	navigateToSelectedPage: function(evt){
		sap.ui.core.BusyIndicator.show(0);
	  var pageName = evt.mParameters.item.getText();
		var targetVBox = this.getView().byId("navContainerBox");
		
		  var sideNav =  sap.ui.getCore().byId('__xmlview0--sideNavigation');
           var list = sideNav.getItem();
           var isSideNavExp = sideNav.getExpanded();
	
		switch(pageName)
		{       
		        case  Man.Man.formatter.supplyi18Names("home") :
		        	  mainRoutes.navTo("home", false);
					  sap.ui.controller("controllers.home").hideBusyIndicator(400);
                      break;
		    
                case Man.Man.formatter.supplyi18Names("tile1Title") :
					  mainRoutes.navTo("manageData", false);
					  sap.ui.controller("controllers.manageData").hideBusyIndicator(400);
                      break;
                      
                case Man.Man.formatter.supplyi18Names("tile3Title"):
                    	sap.ui.core.BusyIndicator.hide();
                    window.open("https://be-ey.eu1.sapbusinessobjects.cloud/sap/fpa/ui/tenants/024/app.html#;view_id=digital-boardroom-view;presentationId=8680F55A9835EA27E10000000A4E73C2;topicId=8980F55A9835EA27E10000000A4E73C2;storyId=805AF55A9835EA27E10000000A4E73C2;pageId=48909aae-3321-4d5e-809d-1daf08b640e4 ");
                   /* mainRoutes.navTo("analytics", false);
                   sap.ui.controller("controllers.analytics").hideBusyIndicator(400);*/
                      break;
                   
	} 
	    
	},
	
	navToServiceCost: function(){
	  mainRoutes.navTo("serviceCost", false);
  //    sap.ui.controller("content.controller.Plan").fnSetSubHeaderText("Home","Plan",null);
  	},
	
	navToSAC: function(){
	       window.open("https://be-ey.eu1.sapbusinessobjects.cloud/sap/fpa/ui/tenants/024/app.html#;view_id=digital-boardroom-view;presentationId=8680F55A9835EA27E10000000A4E73C2;topicId=8980F55A9835EA27E10000000A4E73C2;storyId=805AF55A9835EA27E10000000A4E73C2;pageId=48909aae-3321-4d5e-809d-1daf08b640e4 ");
                  
	    //mainRoutes.navTo("analytics", false);
    //    sap.ui.controller("content.controller.Monitor").fnSetSubHeaderText("Home","Monitor",null); 
	},

	 goToHome: function(){
	     mainRoutes.navTo("home", false);
	    Man.Man.declarations.main.controlobject.detailWindowPage.setShowHeader(false);
        Man.Man.declarations.main.controlobject.sideNav.setVisible(false); 
	     
  },
	
		
	onNavBack : function () {
		var oHistory, sPreviousHash;
		 
		oHistory = new sap.ui.core.routing.History.getInstance();
		sPreviousHash = oHistory.getPreviousHash();

		if (sPreviousHash !== undefined) {
			window.history.go(-1);
		} else {
			mainRoutes.navTo("main", {}, true /*no history*/);
		}
	}
	



});