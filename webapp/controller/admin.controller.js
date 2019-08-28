sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/base/Log",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"fapp/foodApp/controller/formatter"
], function (Controller, Log, MessageToast, JSONModel, MessageBox, formatter) {
	// "use strict";
	// var driverNameForm, driverEmailForm, driverContactForm, driverDLForm;
	var assignedDriver;
	var oHeader = {
		"Content-Type": "application/json"
	};
	var oFormModel;
	return Controller.extend("fapp.foodApp.controller.view1", {
		formatter: formatter,

		onInit: function () {
			oFormModel = new JSONModel();
			this.getView().setModel(oFormModel, "oFormModel");
			// <-------------customer data using global model------------>
			var oCustModel = this.getOwnerComponent().getModel("oTableModel");
			var customerList = oCustModel.getData();
			this.getView().setModel(oCustModel, "oCustModel");
			oCustModel.setData({
				custList: customerList
			});
			// Restaurant Model
			var oRestModel = this.getOwnerComponent().getModel("oRestModel");
			var restList = oRestModel.getData();
			this.getView().setModel(oRestModel, "oRestModel");
			oRestModel.setData({
				restList: restList
			});

			var oRPendingModel = this.getOwnerComponent().getModel("oRPendingModel");
			var rPendingList = oRPendingModel.getData();
			this.getView().setModel(oRPendingModel, "oRPendingModel");
			oRPendingModel.setData({
				rPendingList: rPendingList
			});
			// <-----------------------driver display-------------------->

			var oDAuthenModel = this.getOwnerComponent().getModel("oDAuthenModel");
			oDAuthenModel.refresh();
			var dAuthenList = oDAuthenModel.getData();
			this.getView().setModel(oDAuthenModel, "oDAuthenModel");
			oDAuthenModel.setData({
				dAuthenList: dAuthenList
			});

			// $.ajax({
			// 	url: "/path/driver/driverdisplayauthenticate",
			// 	type: "GET",
			// 	contentType: "application/json",
			// 	dataType: "json",
			// 	success: function (data) {
			// 		var temp = [];
			// 		temp["dAuthenList"] = data;
			// 		oDAuthenModel.setData(temp);
			// 		this.getView().setModel(oDAuthenModel, "oDAuthenModel");
			// 	},
			// 	error: function (error) {
			// 		MessageBox.alert("this is not working");
			// 	}
			// });

			// driver pending details
			var oDPendingModel = this.getOwnerComponent().getModel("oDPendingModel");
			var dPendingList = oDPendingModel.getData();
			this.getView().setModel(oDPendingModel, "oDriverPendingModel");
			oDPendingModel.setData({
				dPendingList: dPendingList
			});

			//Orders Details
			var oOrdersModel = this.getOwnerComponent().getModel("oOrdersModel");
			var ordersList = oOrdersModel.getData();
			this.getView().setModel(oOrdersModel, "oOrdersModel");
			oOrdersModel.setData({
				ordersList: ordersList
			});

			//Orders Waiting for driver assign Model
			var oOrdersWaitingModel = this.getOwnerComponent().getModel("oOrdersWaitingModel");
			var ordersWaitingList = oOrdersWaitingModel.getData();
			this.getView().setModel(oOrdersWaitingModel, "oOrdersWaitingModel");
			oOrdersWaitingModel.setData({
				ordersWaitingList: ordersWaitingList
			});

			//Available drivers to take order Model
			var oAvailableDriverDisplay = this.getOwnerComponent().getModel("oAvailableDriverDisplay");
			var availableDriverList = oAvailableDriverDisplay.getData();
			this.getView().setModel(oAvailableDriverDisplay, "oAvailableDriverDisplay");
			oAvailableDriverDisplay.setData({
				availableDriverList: availableDriverList
			});
		},

		onListItemPress: function (oEvent) {
			var sToPageId = oEvent.getParameter("listItem").getCustomData()[0].getValue();
			this.getSplitAppObj().toDetail(this.createId(sToPageId));
		},
		getSplitAppObj: function () {
			var result = this.byId("SplitApp");
			if (!result) {
				Log.info("SplitApp object can't be found");
			}
			return result;
		},

		onClickAddDriver: function () {
			this.Dialog = sap.ui.xmlfragment("fapp.foodApp.fragments.addDriver", this);
			this.getView().addDependent(this.Dialog);
			this.Dialog.open();
		},

		onEditDriverDetails: function () {
			this.Dialog = sap.ui.xmlfragment("fapp.foodApp.fragments.addDriver", this);
			this.getView().addDependent(this.Dialog);
			this.Dialog.open();
		},

		onClickCancel: function () {
			this.Dialog.close();
		},

		// dNameForm: function (oEvent) {
		// 	driverNameForm = oEvent.getParameter("value");
		// },
		// dEmailForm: function (oEven) {
		// 	driverEmailForm = oEven.getParameter("value");
		// },
		// dContactForm: function (oEven) {
		// 	driverContactForm = oEven.getParameter("value");
		// },
		// dDLForm: function (oEvent) {
		// 	driverDLForm = oEvent.getParameter("value");
		// },

		onSubmitAddDriver: function () {
			// var oFormModel = new JSONModel();
			var oInput = this.getView().getModel("oFormModel");
			var oData = oInput.getData();
			var jsonData = JSON.stringify(oData);
			var serviceUrl = "/path/driver/driverdetails";
			oFormModel.loadData(serviceUrl, jsonData, true, "POST", false, false, oHeader);

			// using ajax call- WORKING----------------------
			// $.ajax({
			// 	url: "/path/driver/driverdetails",
			// 	type: "POST",
			// 	contentType: "application/json",
			// 	dataType: "json",
			// 	data:jsonData
			// });
		},

		onDeleteDriver: function (oEvent) {
			var tableModel = this.getView().getModel("oDAuthenModel");
			var oSelectedItem = oEvent.getSource();
			var sPath = oSelectedItem.getBindingContext("oDAuthenModel").getPath("driverid");
			var selectedId = tableModel.getProperty(sPath);
			var data = {
				driverid: selectedId
			};
			var jsonData = JSON.stringify(data);
			var sUrl = "/path/driver/removedriver";
			tableModel.loadData(sUrl, jsonData, true, "POST", false, false, oHeader);
			tableModel.refresh();
		},

		onApprovalDriver: function (oEvent) {
			var tableModel = this.getView().getModel("oDPendingModel");
			var oSelectedItem = oEvent.getSource();
			var sPath = oSelectedItem.getBindingContext("oDriverPendingModel").getPath("driverid");
			var selectedId = tableModel.getProperty(sPath);
			var data = {
				driverid: selectedId
			};
			var jsonData = JSON.stringify(data);
			var sUrl = "/path/driver/driverauthent";
			tableModel.loadData(sUrl, jsonData, true, "POST", false, false, oHeader);
			tableModel.attachRequestCompleted(function (oEvnt) {
				var checkStatus = oEvnt.mParameters.errorobject.responseText;
				if (checkStatus === "accepted") {
					MessageToast.show("Driver Approved");
				}
			});
			tableModel.refresh();
		},

		onClickApproveRestaurant: function (oEvent) {
			var tableModel = this.getView().getModel("oRPendingModel");
			var oSelectedItem = oEvent.getSource();
			var sPath = oSelectedItem.getBindingContext("oRPendingModel").getPath("restid");
			var selectedId = tableModel.getProperty(sPath);
			var data = {
				restid: selectedId
			};
			var jsonData = JSON.stringify(data);
			var sUrl = "/path/resto/restorauthent";
			tableModel.loadData(sUrl, jsonData, true, "POST", false, false, oHeader);
			tableModel.refresh();
		},

		onClickDeleteRestaurant: function (oEvent) {
			var tableModel = this.getView().getModel("oRPendingModel");
			var oSelectedItem = oEvent.getSource();
			var sPath = oSelectedItem.getBindingContext("oRPendingModel").getPath("restid");
			var selectedId = tableModel.getProperty(sPath);
			var data = {
				restid: selectedId
			};
			var jsonData = JSON.stringify(data);
			var sUrl = "/path/resto/removerest";
			tableModel.loadData(sUrl, jsonData, true, "POST", false, false, oHeader);
			tableModel.attachRequestCompleted(function (oEvnt) {
				var checkStatus = oEvnt.mParameters.errorobject.responseText;
				if (checkStatus === "deleted") {
					MessageToast.show("Driver has been deleted");
				}
			});
			tableModel.refresh();
		},

		onDriverAssign: function (oEvent) {
			var sPath = oEvent.getParameter("selectedItem").getBindingContext("oAvailableDriverDisplay").getObject();
			assignedDriver = sPath.drivername;
		},

		onClickAssignDriver: function (oEvent) {
			var tableModel = this.getView().getModel("oOrdersWaitingModel");
			var oSelectedRow = oEvent.getSource();
			var sPath = oSelectedRow.getBindingContext("oOrdersWaitingModel").getPath("orderid");
			var orderid = tableModel.getProperty(sPath);
			var data = {
				orderid: orderid,
				deliveryperson: assignedDriver
			};
			var oDriverAssignModel = new JSONModel();
			oDriverAssignModel.loadData("/path/order/assign", JSON.stringify(data), true, "POST", false, false, oHeader);
			oDriverAssignModel.refresh();
		},

		onClickLogout: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Routelogin");
			location.reload();
		},
		
		onFilterRestaurant: function() {
			
		}
	});
});