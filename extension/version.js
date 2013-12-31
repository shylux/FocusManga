/* Version class to parse and compare versions
 * by Shylux
 */

function Version(version_input) {
  /** VARIABLES **/
  major = 0;
  minor = 0;
  patch = 0;

  /** FUNCTIONS **/
  this.parse = function(version_input) {
    if (typeof version_input == "string") {
      var x = version_input.split('.');
      // parse from string or default to 0 if can't parse
      this.major = parseInt(x[0]) || 0;
      this.minor = parseInt(x[1]) || 0;
      this.patch = parseInt(x[2]) || 0;
    } else if (typeof version_input == "object") {
      this.major = version_input.major;
      this.minor = version_input.minor;
      this.patch = version_input.patch;
    } else {
      console.warn("Please call Version() with the version string or an object with major, minor and patch attributes.");
    }
  }

  this.toString = function() {
    return [this.major, this.minor, this.patch].join('.');
  }

  this.isNewerThan = function(other) {
    if (this.major > other.major ||
        this.minor > other.minor ||
        this.patch > other.patch) return true;
    return false;
};

  /** CONSTRUCTOR **/
  
  this.parse(version_input);
}

/*
v = new Version("1.2.3");
vold = new Version("0.9");
vnew = new Version("1.2.5");
console.log(v.toString());
console.log("Newer check (expect true): "+v.isNewerThan(vold));
console.log("Older check (expect false): "+v.isNewerThan(vnew));
/**/
