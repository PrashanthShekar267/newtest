sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (Controller, JSONModel, MessageBox, MessageToast) {
	"use strict";
	var ordereditem = [];
	var oModel, deliveryAddress;
	var oRestModel;
	var oHeader = {
		"Content-Type": "application/json"
	};
	return Controller.extend("fapp.foodApp.controller.restaurant", {
		onInit: function () {
			oModel = new JSONModel();
			this.getView().setModel(oModel, "oModel");
			
			// Restaurant Model
			oRestModel = this.getOwnerComponent().getModel("oRestModel");
			this.getView().setModel(oRestModel, "oRestModel");
			var restList = oRestModel.getData();
			oRestModel.setData({
				restList: restList
			});
			var oVBox = this.getView().byId("grid");
			oVBox.setModel(oRestModel);

			// Customer login Model			
			var oCustLoginModel = this.getOwnerComponent().getModel("oModel");
			this.getView().setModel(oCustLoginModel, "oCustLoginModel");
		},

		// To take the value of delivery address entered by customer		
		oInputDeliveryAddress: function (passw) {
			deliveryAddress = passw.getParameter("value");
		},

		// On click of menu button 
		viewMenu: function (oEvent) {
			var tableModel = this.getOwnerComponent().getModel("oRestModel");
			var oSelectedItem = oEvent.getSource();
			var sPathId = oSelectedItem.getBindingContext("oRestModel").getPath("restid");
			var sPathName = oSelectedItem.getBindingContext("oRestModel").getPath("restname");
			var sPathAddress = oSelectedItem.getBindingContext("oRestModel").getPath("restadd");
			var selectedId = tableModel.getProperty(sPathId);
			var selectedName = tableModel.getProperty(sPathName);
			var selectedAddress = tableModel.getProperty(sPathAddress);
			var data = {
				restid: selectedId
			};
			var jsonData = JSON.stringify(data);
			var sUrl = "/path/item/menu";
			var oMenuModel = new JSONModel();
			oMenuModel.loadData(sUrl, jsonData, true, "POST", false, false, oHeader);
			this.getView().setModel(oMenuModel, "oMenuModel");

			var oData = oModel.getData();
			oData.restname = selectedName;
			oData.restaddress = selectedAddress;
			oModel.setProperty("/", oData);
			this.Dialog = sap.ui.xmlfragment("fapp.foodApp.fragments.menu", this);
			this.getView().addDependent(this.Dialog);
			this.Dialog.open();
		},

		// On click of Add button, items will be added to the restaurant
		onClickAddItem: function (oEvent) {
			var oItemModel = this.getView().getModel("oMenuModel");
			var oSelectedItem = oEvent.getSource();
			var sPath = oSelectedItem.getBindingContext("oMenuModel").getPath("itemid");
			var selectedId = oItemModel.getProperty(sPath);
			var index = sPath.split("/")[1];
			var selectedItem = oItemModel.getData(selectedId)[index].item;
			var selectedPrice = oItemModel.getData(selectedId)[index].price;
			var selectedQuantity = oItemModel.getData(selectedId)[index].quantity;
			if (selectedQuantity === "" || selectedQuantity === undefined) {
				MessageBox.alert("Quantity must be specified");
			} else {
				var selectedData = {
					item: selectedItem,
					price: selectedPrice,
					quantity: selectedQuantity
				};
				ordereditem.push(selectedData);
				MessageToast.show(selectedItem + "" + "Added");
			}
		},

		// To calculate the totalpayment
		onClickTotalPayment: function () {
			this.getView().setModel(oModel, "oModel");
			var aLength = ordereditem.length;
			var i;
			var totalprice = 0;
			for (i = 0; i < aLength; i++) {
				var temp = ordereditem[i].price * ordereditem[i].quantity;
				totalprice += temp;
			}
			var data = oModel.getData();
			data.totalprice = totalprice;
			oModel.refresh();
		},

		// To open the view cart dialog box
		onClickViewCart: function (oEvent) {
			var data = oModel.getData();
			data.ordereditem = ordereditem;
			if (ordereditem.length === 0 || ordereditem === undefined) {
				MessageBox.alert("Cart is Empty");
			} else {
				this.Dialog.close();
				this.getView().setModel(oModel, oModel);
				this.Dialog = sap.ui.xmlfragment("fapp.foodApp.fragments.viewCart", this);
				this.getView().addDependent(this.Dialog);
				this.Dialog.open();
			}
		},

		onClickPlaceOrder: function (oEvent) {
			var oCartModel = this.getView().getModel("oModel");
			var data = oCartModel.getData();
			data.deliveryaddress = deliveryAddress;
			if (deliveryAddress === "" || deliveryAddress === undefined) {
				MessageBox.alert("Enter delivery Address");
			} else {
				var sData = oCartModel.getData();
				oModel.loadData("/path/order/orderinfo", JSON.stringify(sData), true, "POST", false, false, oHeader);
				oModel.attachRequestCompleted(function (oEvnt) {
					var checkStatus = oEvnt.mParameters.errorobject.responseText;
					if (checkStatus === "success") {
						this.Dialog.close();
						MessageToast.show("Succesfully placed Your Order!! Food is just Blink Away!");
					}
				});
			}
		},

		// On click Cancel button, To close the dialog box and to make the cart empty 
		onClickCancel: function () {
			this.Dialog.close();
			ordereditem.length = 0;
		}

	});
});