var validator = require('is-my-json-valid');

// TODO: add allowed range check
module.exports = {
  validate: function(name, varDef, data, callback) {
    var type  = varDef.dataType;
    var range = varDef.allowedValueRange;
    var errorMessage = null;

    if (!type) {
      errorMessage = 'cannot identify variable data type';
      callback(new Error('data ' + name + ' validation failed, reason: ' + errorMessage));
      return;
    }
    switch (type) {
      case 'number':
        if (typeof(data) !== 'number') {
          errorMessage = 'data is not a number';
        }
        break;
      case 'integer':
        if (typeof(data) !== 'number' && (data % 1) !== 0) {
          errorMessage = 'data is not an integer';
        }
        break;
      case 'string':
        if (typeof(data) !== 'string') {
          errorMessage = 'data is not a string';
        }
        break;
      case 'boolean':
        if (typeof(data) !== 'boolean') {
          errorMessage = 'data is not a boolean';
        }
        break;
      case 'object':
        if (typeof(data) !== 'object' && typeof(data) !== 'array') {
          errorMessage = 'data is not a object';
        } else {
          var schema = varDef.schema;
          if (!schema) {
            errorMessage = 'data has no schema';
          } else {
            // TODO: maybe better to pre-compile the schema
            var validate = validator(schema);
            try {
              if (!validate(data)) {
                errorMessage = validate.errors[0].field + ' ' + validate.errors[0].message;
              }
            } catch (e) {
              errorMessage = e.message;
            }
          }
        }
        break;
    }
    if (!errorMessage) {
      if (range) {
        if (data > range.maximum || data < range.minimum) {
          errorMessage = 'data exceeds allowed value range';
        }
      }
    }
    if (errorMessage) {
      callback(new Error('data ' + name + ' validation failed, reason: ' + errorMessage));
    } else {
      callback(null);
    }
  }
};