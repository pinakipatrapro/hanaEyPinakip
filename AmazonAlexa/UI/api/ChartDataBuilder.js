sap.ui.define([
	"sap/ui/core/Control"
], function (Control) {
	"use strict";

	var ChartBuilder = Control.extend("pinaki.ey.com.AlexaDisplay.api.ChartDataBuilder", {
		metadata: {
			properties: {
				dataset: {
					type: "any"
				},
				property: {
					type: "any"
				},
				feed: {
					type: "any"
				}
			}
		},
		constructor: function (jsonData) {
			var chartData = {
				rawData: null,
				configuration: {
					dataType: null,
					dataSource: null
				},
				dataset: {
					dimensions: null,
					measures: null,
					data: null
				},
				properties: null,
				feedItems: null
			};
			chartData.rawData = jsonData;
			this._segMesDim(chartData);
			this._generateModel(chartData);
			this._generateDimension(chartData);
			this._generateMeasure(chartData);
			this._generateProperties(chartData);
			this._generateFeedAxis(chartData);
			return chartData;

		},
		_segMesDim: function (chartData) {
			var aKey = [],
				aDimension = [],
				aMeasure = [];
			Object.keys(chartData.rawData[0]).forEach(function (key, index) {
				aKey.push(key);
				if (key === '__metadata') {

				} else if (parseFloat(chartData.rawData[0][key])) {
					aMeasure.push(key);
				} else {
					aDimension.push(key);
				}
			});
			chartData.configuration.dataType = {
				aKey: aKey,
				aMeasure: aMeasure,
				aDimension: aDimension
			};
		},
		_generateModel: function (chartData) {
			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setData({
				dataPath: chartData.rawData
			});
			chartData.configuration.dataSource = {
				path: '/dataPath',
				model: oModel
			};
			chartData.dataset.data = {
				path: '/dataPath'
			};
		},
		_generateDimension: function (chartData) {
			var aDimension = [];
			chartData.configuration.dataType.aDimension.forEach(function (e) {
				aDimension.push({
					name: e,
					value: "{" + e + "}"
				});
			});
			chartData.dataset.dimensions = aDimension;
		},
		_generateMeasure: function (chartData) {
			var aMeasure = [];
			chartData.configuration.dataType.aMeasure.forEach(function (e) {
				aMeasure.push({
					group: 1,
					name: e,
					value: "{" + e + "}"
				});
			});
			chartData.dataset.measures = aMeasure;
		},
		_generateProperties: function (chartData) {
			chartData.properties = {
				plotArea: {
					showGap: true
				},
				title: {
					text: "Alexa Response"
				}
			};
		},
		_generateFeedAxis: function (chartData) {
			var aFeeItems = [];

			chartData.configuration.dataType.aDimension.forEach(function (e) {
				aFeeItems.push({
					'uid': 'categoryAxis',
					'type': "Dimension",
					'values': [e]
				})
			});
			chartData.configuration.dataType.aMeasure.forEach(function (e) {
				aFeeItems.push({
					'uid': 'valueAxis',
					'type': "Measure",
					'values': [e]
				})
			});
			chartData.feedItems = aFeeItems;
		},
		setProperties: function (chartData) {
			this.dataset(chartData.dataset);
		}.bind(this)
	});
	return ChartBuilder;
});