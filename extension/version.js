/* Version class to parse and compare versions
 * by Shylux
 */

function Version(version_string) {
  /** VARIABLES **/
  major = 0;
  minor = 0;
  patch = 0;

  /** FUNCTIONS **/
  this.parse = function(version_string) {
    var x = version_string.split('.');
    // parse from string or default to 0 if can't parse
    this.major = parseInt(x[0]) || 0;
    this.minor = parseInt(x[1]) || 0;
    this.patch = parseInt(x[2]) || 0;
  }

  this.toString = function() {
    return [this.major, this.minor, this.patch].join('.');
  }

  this.isNewerThan = function(other) {
    if (this.major > other.major) return true;
    if (this.minor > other.minor) return true;
    if (this.patch > other.patch) return true;
    return false;
};

  /** CONSTRUCTOR **/
  if (typeof version_string != "string") throw "Please call Version() with the version string.";
  this.parse(version_string);
}

/*
v = new Version("1.2.3");
vold = new Version("0.9");
vnew = new Version("1.2.5");
console.log(v.toString());
console.log("Newer check (expect true): "+v.isNewerThan(vold));
console.log("Older check (expect false): "+v.isNewerThan(vnew));
/**/
