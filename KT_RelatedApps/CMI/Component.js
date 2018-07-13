jQuery.sap.declare("Man.Man.Component");
var mainRoutes;
sap.ui.localResources("util");
jQuery.sap.require("Man.Man.util.declarations");
jQuery.sap.require("Man.Man.util.formatter");
jQuery.sap.require("Man.Man.util.functions");
/*sap.ui.localResources("util");
jQuery.sap.require("ey.app.abf.util.declarations");
jQuery.sap.require("ey.app.abf.util.functions");
jQuery.sap.require("ey.app.abf.util.Formatter");
*/
sap.ui.localResources("i18n");

sap.ui.core.UIComponent.extend("Man.Man.Component",{
     metadata: {
               manifest: "json"
               	
             }
     });
     

Man.Man.Component.prototype.init  = function(){
    
	jQuery.sap.require("sap.ui.core.routing.History");
	jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
	sap.ui.core.UIComponent.prototype.init.apply(this);
	var langModel = new sap.ui.model.resource.ResourceModel({bundleName:"i18n.i18n", bundleLocale:"en"});
     sap.ui.getCore().setModel(langModel, "i18n");
//var oBundle = jQuery.sap.resources({url : "i18n/i18n_en.properties", locale: sap.ui.getCore().getConfiguration().getLanguage()});
  Man.Man.declarations.common.controlobject.oBundle = sap.ui.getCore().getModel("i18n").getResourceBundle();
	      Man.Man.declarations.common.controlobject.sRecipient = sap.ui.getCore().getModel("i18n").getProperty("/recipient/name");

	 mainRoutes = this.getRouter();
	this.routerHandler = new sap.m.routing.RouteMatchedHandler(mainRoutes);
	mainRoutes.initialize();
	mainRoutes.navTo("main", false);
};

Man.Man.Component.prototype.destroy = function(){
	if(this.routerHandler){
		this.routerHandler.destroy();
	}
	sap.ui.core.UIComponent.destroy.apply(this,arguments);
	
};

Man.Man.Component.prototype.createContent = function(){
	this.view = sap.ui.view({id:"app",viewName:"views.app",type:sap.ui.core.mvc.ViewType.XML,viewData : { component : this }  });
	return this.view;
};