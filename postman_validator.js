/**
* @Author Abhijit Kane
* Main validator file
*/
 
var program = require('commander'),
	fs      = require('fs'),
	jsface	= require("jsface"),
	JSV 	= require("JSV").JSV;

var global_schema = require('./json-schemas/globals.schema.json');
var env_schema = require('./json-schemas/environment.schema.json');
var collection_schema = require('./json-schemas/collection.schema.json');

var schemas = {
	'c': collection_schema,
	'g': global_schema,
	'e': env_schema
};

var postman_validator = jsface.Class({
	$singleton: true,

	validate: function (schemaCode, input) {
		var schema = schemas[schemaCode];
		if(typeof schema === "undefined") {
			this.printError("Invalid schema code\n");
		}
		input = this._loadJSONfile(input);
		var env = JSV.createEnvironment();
		var report = env.validate(input, schema);
		if(report.errors.length) {
			process.stdout.write("Validation failed\n");
			return report.errors;
		}
		process.stdout.write("Validation successful\n");
	},

	printError: function(str) {
		process.stdout.write(str);
		process.exit(1);
	},

	_loadJSONfile: function(filename, encoding) {
		if(!fs.existsSync(filename)) {
			this.printError("File " + filename+" could not be found\n");
		}
		var contents=null;
		try {
			if (typeof (encoding) == 'undefined') encoding = 'utf8';
			var contents = fs.readFileSync(filename, encoding);
		} catch (err) {
			process.stdout.write(err);
			process.exit(-1);
		}

		try {
			return JSON.parse(contents);
		} catch(err) {
			process.stdout.write("Invalid json\n");
			process.exit(-1);
		}
	}

});

module.exports = postman_validator;


