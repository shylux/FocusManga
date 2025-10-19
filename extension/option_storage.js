const delay = t => new Promise(resolve => setTimeout(resolve, t));

class OptionStorage extends EventTarget {
  static #isInitializing = false;
  static #instance;
  #storage = {
	  // default values
    'timer-delay': 20,
    'focusmanga-enabled': true,
    'timer-enabled': false,
    'translator': false,
    'page-numbers-enabled': true,
    'progressbar-enabled': true,
    'manhwa-autoscroll': true,
    'exif-rotation-correction-enabled': false,
    'version': '0.0.0'
  };
  
  async initialize() {
	  let values = await chrome.storage.local.get();
	  this.#storage = Object.assign(this.#storage, values);
  }
  
  static async getInstance() {
    if (this.#isInitializing) {
      return delay(100).then(() => OptionStorage.getInstance());
    }
    if (!this.#instance) {
      this.#isInitializing = true;
      this.#instance = new OptionStorage();
      await this.#instance.initialize();
      this.#isInitializing = false;
    }
    return this.#instance;
  }

  get(key, default_value) {
    return this.#storage[key] ?? default_value;
  };

  // set property
  set(key, value) {
    this.#storage[key] = value;
    chrome.storage.local.set({[key]: value});
  };

  // check if key exists
  hasKey(key) {
    return this.#storage.hasOwnProperty(key);
  };

  // return a string representing all propertys
  printAll() {
    let str = "Options:\n";
    for (let key in this.#storage) {
      str += key + ": " + this.#storage[key] + "\n";
    }
    return str;
  };

  // return storage as json string
  export() {
    return JSON.stringify(this.#storage);
  };
}
