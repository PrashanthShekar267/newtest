sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (Controller, JSONModel, MessageBox, MessageToast) {
	"use strict";
	
	var custEmail;
	var oHeader = {
		"Content-Type": "application/json",
		"dataType": "text"
	};
	
	return Controller.extend("fapp.foodApp.controller.login", {
		onInit: function () {
			
			
		},

		// ******************To get the input values**************//
		cEmail: function (oEvent) {
			custEmail = oEvent.getParameter("value");
			var mailregex = /^\w+[\w-+\.]*\@\w+\.[a-zA-Z]{2,}$/;
			if (custEmail === "" || !mailregex.test(custEmail)) {
				MessageBox.alert(custEmail + " is not a valid email address");
			}
		},

		// *********************End of Value Input*********************

		//Customer login and Register 
		loginClick: function () {
			this.Dialog = sap.ui.xmlfragment("fapp.foodApp.fragments.login", this);
			this.getView().addDependent(this.Dialog);
			this.Dialog.open();
		},

		//On submit of customer login
		onSubmitCustLogin: function () {
			var oModel = this.getOwnerComponent().getModel("oModel");
			var oData = oModel.getData();
			oData.role = "customer";
			var data = oData;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oModel.loadData("/path/path2/loginauthent", JSON.stringify(data), true, "POST", false, false, oHeader);
			oModel.attachRequestCompleted(function (oEvent) {
				var checkStatus = oEvent.mParameters.errorobject.responseText;
				if (checkStatus === "Success") {
					oRouter.navTo("Routerestaurant");
					MessageToast.show("Welcome");
				} else {
					MessageBox.alert("Incorrect Username or Password");
				}

			});
		},

		//To open the customer register fragment
		registerClick: function () {
			this.Dialog = sap.ui.xmlfragment("fapp.foodApp.fragments.register", this);
			this.getView().addDependent(this.Dialog);
			this.Dialog.open();
		},

		//on click submit register customer details
		onSubmitCustRegister: function () {
			var oModel = this.getOwnerComponent().getModel("oModel");
			var customeruser = oModel.getProperty("/user");
			var customeremail = oModel.getProperty("/customeremail");
			var customerphnum = oModel.getProperty("/customerphnum");
			var password = oModel.getProperty("/password");
			var oNewCustomer = {
				customername: customeruser,
				customeremail: customeremail,
				customerphnum: customerphnum
			};
			var customerJson = JSON.stringify(oNewCustomer);
			var userData = {
				user: customeruser,
				password: password
			};
			userData.role = "customer";
			var jsonData = JSON.stringify(userData);
			var sUrlSignUp = "/path/path2/signup";
			oModel.loadData(sUrlSignUp, jsonData, true, "POST", false, false, oHeader);

			var serviceUrl = "/path/customer/customerdetails";
			var oCustModel = new JSONModel();
			this.getView().setModel(oCustModel, "oCustModel");
			oCustModel.loadData(serviceUrl, customerJson, true, "POST", false, false, oHeader);
			oCustModel.attachRequestCompleted(function (oEvent) {
				MessageToast.show("Successfully Registered");
			});
			oModel.refresh();
			this.Dialog.close();
			oModel.destroy();
		},

		//Admin Login and Authentication
		onClickAdmin: function () {
			this.Dialog = sap.ui.xmlfragment("fapp.foodApp.fragments.adminLogin", this);
			this.getView().addDependent(this.Dialog);
			this.Dialog.open();
		},

		// Admin login part 	
		onSubmitAdminLogin: function () {
			var oRouter;
			var oModel = this.getOwnerComponent.getModel("oModel");
			var email = oModel.getProperty("/email");
			var password = oModel.getProperty("/password");
			if (email === "admin" && password === "admin") {
				oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("Routeadmin");
			} else {
				MessageBox.alert("Admin Email or password is invalid");
			}
		},

		//Driver Login and Authentication
		onClickDeliveryLogin: function () {
			this.Dialog = sap.ui.xmlfragment("fapp.foodApp.fragments.deliveryLogin", this);
			this.getView().addDependent(this.Dialog);
			this.Dialog.open();
		},

		// To Authen driver login 
		onSubmitDriverLogin: function () {
			var sUrl = "/path/path2/loginauthent";
			var oModel = this.getOwnerComponent().getModel("oModel");
			var oData = oModel.getData();
			oData.role = "driver";
			var data = oData;
			var jsonData = JSON.stringify(data);
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			oModel.loadData(sUrl, jsonData, true, "POST", false, false, oHeader);
			oModel.attachRequestCompleted(function (oEvent) {
				var checkStatus = oEvent.mParameters.errorobject.responseText;
				if (checkStatus === "Success") {
					oRouter.navTo("Routedriver");
					MessageToast.show("Welcome");
					var oLoginModel = this.getOwnerComponent().getModel("oLoginModel");
					oLoginModel.setData({
						oData: oData
					});
					oLoginModel.refresh();
				} else {
					MessageBox.alert("Incorrect Username or Password");
				}
			}.bind(this));
			oModel.refresh();
		},

		// To open driver register fragment 
		onClickDriverRegister: function () {
			this.Dialog.close();
			this.Dialog = sap.ui.xmlfragment("fapp.foodApp.fragments.driverRegister", this);
			this.getView().addDependent(this.Dialog);
			this.Dialog.open();
		},

		// On submission of driver register form
		onSubmitDriverRegister: function () {
			var oModel = this.getOwnerComponent().getModel("oModel");
			oModel.refresh();
			var user = oModel.getProperty("/user");
			var password = oModel.getProperty("/password");
			var driverphnum = oModel.getProperty("/driverphnum");
			var email = oModel.getProperty("/email");
			var idproof = oModel.getProperty("/idproof");
			var userData = {
				user: user,
				password: password
			};
			userData.role = "driver";
			var jsonData = JSON.stringify(userData);
			var sUrlSignUp = "/path/path2/signup";
			oModel.loadData(sUrlSignUp, jsonData, true, "POST", false, false, oHeader);

			var driverData = {
				drivername: user,
				driverphnum: driverphnum,
				email: email,
				idproof: idproof
			};
			var jsonDriverData = JSON.stringify(driverData);
			var serviceUrl = "/path/driver/driverdetails";
			var oDriverModel = new JSONModel();
			this.getView().setModel(oDriverModel, "oCustModel");
			oDriverModel.loadData(serviceUrl, jsonDriverData, true, "POST", false, false, oHeader);
			oDriverModel.attachRequestCompleted(function (oEvent) {
				MessageBox.alert("Successfully Registered");
			});
			oModel.refresh();
			this.Dialog.close();
			oModel.destroy();
		},

		//Restaurant registration and adding items
		onClickRestRegister: function () {
			this.Dialog = sap.ui.xmlfragment("fapp.foodApp.fragments.addRestaurant", this);
			this.getView().addDependent(this.Dialog);
			this.Dialog.open();
		},

		// To open the dialog box to add items to restaurant
		onClickAddItems: function () {
			this.Dialog = sap.ui.xmlfragment("fapp.foodApp.fragments.addFoodItems", this);
			this.getView().addDependent(this.Dialog);
			this.Dialog.open();
		},

		// On submit register restaurant
		onSubmitAddRestaurant: function () {
			var oFInput = this.getView().getModel("oModel");
			var oData = oFInput.getData();
			var item1 = {
				item: oData.item1,
				price: oData.price1
			};
			var item2 = {
				item: oData.item2,
				price: oData.price2
			};
			var item = [item1, item2];
			// item.push(item);
			var oInput = this.getView().getModel("oFormModel");
			var aData = oInput.getData();
			aData.item = item;
			var jsonData = JSON.stringify(aData);
			var oFormModel = new JSONModel();
			oFormModel.loadData("/path/resto/restdetails", jsonData, true, "POST", false, false, oHeader);
			this.Dialog.close();
		},

		// On submit of adding items to restaurant
		onSubmitAddItems: function () {
			this.getView().addDependent(this.Dialog);
			this.Dialog.close();
		},

		//To close the dialog box on click of close button
		onClickCancel: function () {
			this.Dialog.close();
		}

	});
});