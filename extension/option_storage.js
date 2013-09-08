/* Option Storage */

function OptionStorage(initial_values) {
  // localStorage key
  this.key = "optionsstorage";

  // get property by key. if not available return default_value
  this.get = function(key, default_value) {
    if (!this.storage.hasOwnProperty(key)) return default_value;
    return this.storage[key];
  }

  // set property
  this.set = function(key, value) {
    this.storage[key] = value;
    localStorage[this.key] = this.export();
  }

  // return a string representing all propertys
  this.printAll = function() {
    var str = "Options:\n";
    for (var key in this.storage) {
      str += key + ": " + this.storage[key] + "\n";
    }
    return str;
  }

  // return storage as json string
  this.export = function() {
    return JSON.stringify(this.storage);
  }

  // import propertys from json string
  this.import = function(str_options) {
    try {
      var obj = JSON.parse(str_options);
      for (var key in obj) {
        this.set(key, obj[key]);
      }
    } catch(err) {}
  }

  // writes initial_values into storage
  this.storage = {};
  this.import(localStorage[this.key]);

  for (var key in initial_values)
      this.storage[key] = initial_values[key];

}
