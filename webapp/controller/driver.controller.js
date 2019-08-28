sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (Controller, JSONModel, MessageBox, MessageToast) {
	"use strict";
	var oHeader = {
		"Content-Type": "application/json"
	};
	var oModel = new JSONModel();
	return Controller.extend("fapp.foodApp.controller.driver", {

		onInit: function (evnt) {
			this.getView().setModel(oModel, "oModel");

			var inputModel = this.getOwnerComponent().getModel("oLoginModel");
			this.getView().setModel(inputModel, "inputModel");
			var user = inputModel.getProperty("/oData/user");
			var userData = {
				deliveryperson: user
			};
			
			var oOrderListDriver = this.getOwnerComponent().getModel("oOrderListDriver");
			oOrderListDriver.loadData("/path/order/orderdetailsassignedtodriver", JSON.stringify(userData), true, "POST", false, false, oHeader);
			this.getView().setModel(oOrderListDriver, "oOrderListDriver");
			oOrderListDriver.refresh();
		},

		onClickDriverLogout: function () {
			this.Dialog = sap.ui.xmlfragment("fapp.foodApp.fragments.driverLogout", this);
			this.getView().addDependent(this.Dialog);
			this.Dialog.open();
		},

		onSubmitDriverLogout: function () {
			var oData = oModel.getData();
			var jsonData = JSON.stringify(oData);
			var that = this;
			oModel.loadData("/path/driver/drivercheckout", jsonData, true, "POST", false, false, oHeader);
			oModel.attachRequestCompleted(function (oEvent) {
				var checkStatus = oEvent.mParameters.errorobject.responseText;
				if (checkStatus === "success") {
					var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
					oRouter.navTo("Routelogin");
					MessageBox.alert("Thank You");
					location.reload();
				} else {
					MessageBox.alert("Incorrect Phone Number");
				}
			}.bind(that));
		},

		onClickDelivered: function (oEvent) {
			var oOrderListDriver = this.getOwnerComponent().getModel("oOrderListDriver");
			var oSelectedItem = oEvent.getSource();
			var sPathId = oSelectedItem.getBindingContext("oOrderListDriver").getPath("orderid");
			var selectedId = oOrderListDriver.getProperty(sPathId);
			var data = {
				orderid: selectedId
			};
			oModel.loadData("/path/order/delivered", JSON.stringify(data), true, "POST", false, false, oHeader);
			oModel.attachRequestCompleted(function (oEvnt) {
				var checkStatus = oEvnt.mParameters.errorobject.responseText;
				if (checkStatus === "delivered") {
					MessageToast.show("SuccessFully Delivered");
				}
			});

		}
	});
});