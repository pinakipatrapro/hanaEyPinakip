sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"pinaki/ey/com/AlexaDisplay/api/ChartDataBuilder"
	], function (Controller,ChartDataBuilder) {
	"use strict";

	return Controller.extend("pinaki.ey.com.AlexaDisplay.controller.Home", {
		onInit: function () {
			this.createPoll();
		},
		createPoll: function () {
			setInterval(function () {
				var that = this;
				$.ajax({
					url: "/Pinaki/AmazonAlexa/Data/Service/SuperstoreSales.xsodata/LiveResponse/$count",
					cache: false,
					success: function (data) {
						if (parseInt(data) > 0) {
							that.onNewItem();
						}
					}
				});
			}.bind(this), 3000);
		},
		onNewItem: function () {
			var that = this;
			this.getView().setBusy(true);
			var fetchData = new Promise(function (resolve, reject) {
				$.ajax({
					url: "/Pinaki/AmazonAlexa/Data/Service/SuperstoreSales.xsodata/LiveResponse?$format=json",
					cache: false,
					success: function (data) {
						that.parseData(data.d.results[0]);
					}
				});
			});
		},
		parseData: function (data) {
			var responseText = data.RESPONSE_TEXT || " ";
			var jsonData = JSON.parse(atob(atob(data.RESPONSE)));
			if(jsonData.constructor == String){
				this.createNumericContent(jsonData[0], responseText);
			}
			else if (jsonData.length === 1) {
				this.createNumericContent(jsonData[0], responseText);
			} else {
				this.createChartData(jsonData, responseText);
			}

		},
		replaceContent: function (content) {
			this.getView().byId('idResultContent').removeAllContent();
			this.getView().byId('idResultContent').addContent(content);
			this.getView().setBusy(false);
			var settings = {
					"async": true,
					"crossDomain": true,
					"url": "/Pinaki/AmazonAlexa/Data/Inbound/AlexaLogger.xsjs",
					"method": "POST",
					"headers": {
						"Content-Type": "application/json"
					},
					"processData": false,
					"data": "{\n\t\"resetAll\" : true\n\t\n}"
			};
			$.ajax(settings);
		},
		createNumericContent: function (data, responseText) {
			var nmContent = new sap.m.MessagePage({
				text: data[Object.keys(data)[1]] || ' ',
				description: responseText,
				showHeader: false,
				icon: "sap-icon://notification-2"
			});
			this.replaceContent(nmContent);
		},
		createChartData: function (data, responseText) {
			var chartData = new ChartDataBuilder(data);
			if(sap.ui.getCore().byId('chartContainerVizFrame') != undefined){
				sap.ui.getCore().byId('chartContainerVizFrame').destroy();
			}
			var vizFrame = new sap.viz.ui5.controls.VizFrame({
				id: "chartContainerVizFrame",
				// height: "700px",
				dataset : new sap.viz.ui5.data.FlattenedDataset(chartData.dataset),
				vizProperties  : chartData.properties
			});
			vizFrame.setModel(chartData.configuration.dataSource.model);
			this._addFeedItems(vizFrame,chartData.feedItems);

			var ChartContainerContent = new sap.suite.ui.commons.ChartContainerContent({
				icon: "sap-icon://line-chart",
				content: vizFrame
			});
			var container = new sap.suite.ui.commons.ChartContainer({
				// title : responseText
				content: ChartContainerContent,
				showFullScreen : true,
				showPersonalization:true,
				autoAdjustHeight:true,
				toolbar : new sap.m.Toolbar({
					visible : false
				})
			}).addStyleClass("sapUiSizeCompact");
			this.replaceContent(container);
		},
		_addFeedItems: function(vizFrame, feedItems) {
			for (var i = 0; i < feedItems.length; i++) {
				vizFrame.addFeed(new sap.viz.ui5.controls.common.feeds.FeedItem(feedItems[i]));
			}
		}

	});
});