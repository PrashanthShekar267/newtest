/*global QUnit*/

sap.ui.define([
	"fapp/foodApp/controller/login.controller"
], function (oController) {
	"use strict";

	QUnit.module("login Controller");

	QUnit.test("I should test the login controller", function (assert) {
		var oAppController = new oController();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});