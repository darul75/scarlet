var assert = require("assert")
var dummies = require("./dummies");
var enumerable = require("../../../lib/extensions/enumerable");

function ScarletBuilder(scarlet){
	
	var BuilderLogger = require("./builder-logger");
	var AssertionBuilder = require("./assertion-builder");
	var InterceptorBuilder = require("./interceptor-builder");

	var self = this;
	self.results = [];
	self.instances = [];
	self.interceptor = null;
	self.scarlet = scarlet;
	self.log = new BuilderLogger();

	self.withNamedFunction = function(){
		var instance = new dummies.NamedFunc(self);
		self.log.info(ScarletBuilder, "withNamedFunction", "Creating Named Function", [instance]);
		self.instances.push(new dummies.NamedFunc(self));
		return self;
	}

	self.withObjectLiteral = function(){
		var instance = dummies.ObjectLiteral(self);
		self.log.info(ScarletBuilder, "withObjectLiteral", "Creating Object Literal", [instance]);
		self.instances.push(instance);
		return self;
	};

	self.withPrototypeFunction = function(){
		var instance = new dummies.PrototypeFunc(self);
		self.log.info(ScarletBuilder, "withPrototypeFunction", "Creating Prototype Function", [instance]);
		self.instances.push(instance);
		return self;
	};

	self.withUnamedFunction = function(){
		var instance = new dummies.UnnamedFunc(self);
		self.log.info(ScarletBuilder, "withUnamedFunction", "Creating Unamed Function", [instance]);
		self.instances.push(instance);
		return self;
	};

	self.withInstances = function(){
		self.withNamedFunction();
		self.withObjectLiteral();
		self.withPrototypeFunction();
		self.withUnamedFunction();
		return self;
	};

	self.withInterceptor = function() {
		assert(self.instances.length != 0, "Please make sure you allocate an instance first using 'withNamedFunction()', 'withObjectLiteral()', 'withPrototypeFunction()' or 'withUnamedFunction()'");
		self.interceptor = new InterceptorBuilder(self, self.instances, function(proxiedInstances){ self.instances = proxiedInstances; });
		self.log.info(ScarletBuilder, "withInterceptor", "Creating Interceptor", [self.interceptor]);
		return self;
	};

	self.withCustomInterceptor = function(interceptor){
		assert(self.instances.length != 0, "Please make sure you allocate an instance first using 'withNamedFunction()', 'withObjectLiteral()', 'withPrototypeFunction()' or 'withUnamedFunction()'");
		self.log.info(ScarletBuilder, "withCustomInterceptor", "Creating Custom Interceptor", [interceptor]);
		self.interceptor = interceptor;
		return self;
	};

	self.invokeMethod = function(){
		self.log.debug(ScarletBuilder, "invokeMethod", "Invoking Methods");
		enumerable.forEach(self.instances, function(instance){
			self.log.debug(instance, "method", "Before Invoking Instance Method", [instance]);
			instance.method();
			self.log.debug(instance, "method", "After Invoking Instance Method", [instance]);
		});
		return self;
	};

	self.invokeMethodWithReturn = function(){
		self.results = [];
		self.log.debug(ScarletBuilder, "invokeMethodWithReturn", "Invoking Methods with Return Values");
		enumerable.forEach(self.instances, function(instance){
			self.log.debug(instance, "methodWithReturn", "Before Invoking Instance Method With Return", [instance]);
			var result = instance.methodWithReturn();
			self.log.debug(instance, "methodWithReturn", "After Invoking Instance Method With Return", [instance, result]);
		});
		self.log.debug(self, "methodWithReturn", "Return Values from Methods", [self.results]);
		return self;
	};

	self.invokeAll = function(){
		self.invokeMethod();
		self.invokeMethodWithReturn();
		return self;
	};

	self.assert = function(){
		var assertBuilder = new AssertionBuilder(self, self.instances, self.interceptor);
		self.log.debug(ScarletBuilder, "assert", "Creating Assertion Builder", [assertBuilder]);
		return assertBuilder;
	};
};

ScarletBuilder.for = function(scarlet){
	return new ScarletBuilder(scarlet);
};

module.exports = ScarletBuilder;