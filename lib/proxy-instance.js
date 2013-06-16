var l = console.log;
var i = require("util").inspect;

var util = require("util");
var assert = require("assert");
var enumerable = require("./enumerable");

function ProxyInstance(interceptor, callback) {

	var self = this;

	self.interceptor = interceptor;

	self.whenCalled = function(target) {

		if (!interceptor.instance.__scarlet) {

			interceptor.instance.__scarlet = {};

			enumerable.forEach(interceptor.instance, function(member, memberName) {

				if (member instanceof(Function)) {
					self.interceptor.instance.__scarlet[memberName] = self.interceptor.instance[memberName];
					var originalMethod = self.interceptor.instance.__scarlet[memberName];
					self.interceptor.instance[memberName] = function() {
						return target(originalMethod, arguments);
					};
				}

			});
		}

		return interceptor.instance;
	};

	self.unwrap = function() {

		if (interceptor.instance.__scarlet) {

			enumerable.forEach(interceptor.instance, function(member, memberName) {

				if (member instanceof Function) {
					var originalMethod = interceptor.instance.__scarlet[memberName];
					interceptor.instance[memberName] = originalMethod;
				}

			});
		}

	};

}

module.exports = ProxyInstance;