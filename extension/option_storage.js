/* Option Storage */

function OptionStorage(initial_values) {
  // writes initial_values into storage
  this.storage = initial_values;
  if (typeof storage === "undefined")
    this.storage = {};

  // if true, new values will get written to localstorage automatically
  this.autoWriteToLocalStorage = true;

  // get property by key. if not available return default_value
  this.get = function(key, default_value) {
    if (!this.storage.hasOwnProperty(key)) return default_value;
    return this.storage[key];
  }

  // set property
  this.set = function(key, value) {
    this.storage[key] = value;
    if (this.autoWriteToLocalStorage)
      localStorage[key] = value;
  }

  // write propertys to localstorage
  this.saveToLocalStorage = function() {
    for (var key in this.storage) {
      localStorage[key] = this.storage[key];
    }
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
    var obj = JSON.parse(str_options);
    for (var key in obj) {
      this.set(key, obj[key]);
    }
  }
}
