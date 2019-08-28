sap.ui.define([], function () {
	"use strict";
	return {
		myFormatter: function (orderedtime) {
			var dates = new Date(orderedtime);
			return dates;
		},
		
		deliveryTime: function(deliveredtime) {
			var dates = new Date(deliveredtime);
			return dates;
		}

	};
});