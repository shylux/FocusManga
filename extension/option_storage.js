/* Option Storage */

function OptionStorage(initial_values) {
  // localStorage key
  this.key = "optionsstorage";

  // get property by key. if not available return default_value
  this.get = function(key, default_value) {
    if (!this.storage.hasOwnProperty(key)) return default_value;
    return this.storage[key];
  };

  // set property
  this.set = function(key, value) {
    this.storage[key] = value;
    localStorage[this.key] = this.export();
  };

  // check if key exists
  this.hasKey = function(key) {
    return this.storage.hasOwnProperty(key);
  };

  // return a string representing all propertys
  this.printAll = function() {
    let str = "Options:\n";
    for (let key in this.storage) {
      str += key + ": " + this.storage[key] + "\n";
    }
    return str;
  };

  // return storage as json string
  this.export = function() {
    return JSON.stringify(this.storage);
  };

  // update with propertys from json string or object
  this.import = function(options) {
    if (typeof options === "string") {
      try {
        options = JSON.parse(options);
      } catch(err) {console.error(err); return;}
    }
    for (let key in options) {
      this.set(key, options[key]);
    }
  };

  // writes initial_values into storage
  this.storage = {};
  this.import(localStorage[this.key]);

  for (let key in initial_values)
      this.storage[key] = initial_values[key];

}
