/* Basic Timer with progress feedback
 * by Shylux
 */

(function ($) {
  $.timer = function() {
    return jQuery.extend(true, {}, $.timer_prototype);
  }
  $.timer_prototype = {
    delay: 0, // time in ms after the timer activates

    checkingInterval: 50, // interval to check if the timer should activate
    autoStart: true,
    action: function() {},

    startMarker: 0, // time at which timer started in ms

    start: function(options) {
      $.extend(this, options);
      this.startMarker = this.ms();
      var that = this;
      this.intervalId = setInterval(function() {that.onInterval();}, this.checkingInterval);
    },

    stop: function() {
      if (this.isRunning())
        clearInterval(this.intervalId);
      this.intervalId = undefined;
    },

    isRunning: function() {
      if (typeof this.intervalId === "undefined")
        return false;
      return true;
    },

    getProgressFracture: function() {
      if (!this.isRunning()) return false;
      var prog_ms = this.ms() - this.startMarker;
      return prog_ms / this.delay;
    },

    getProgressPercentage: function() {
      if (!this.isRunning()) return false;
      return Math.round(this.getProgressFracture() * 100);
    },

    onInterval: function() {
      var ms = this.ms();
      if (this.ms() > this.endMarker()) {
        this.action();
        this.stop();
      } else {
        this.onProgress(this.getProgressPercentage());
      }
    },

    // override to register listener
    onProgress: function(percent) {},

    /* helper functions */
    ms: function() {
      return new Date().getTime();
    },
    endMarker: function() {
      return this.startMarker + this.delay;
    },
  }
}(jQuery));

/* testing stuff
var timer = $.timer();
var timer2 = $.timer();
timer2.action = function() {
  console.log("Should not be called.");
}
console.log(timer.isRunning());
timer.start({
  delay: 2000, // 2 seconds
  action: function() {
    console.log("action");
  },
  onProgress: function(percentage) {
    console.log("Progress: "+percentage+"%");
  }
});
console.log(timer.isRunning());
timer.stop();
console.log(timer.isRunning());
timer.start();
setTimeout(function() {
  console.log(timer.getProgressFracture());
  console.log(timer.getProgressPercentage());
}, 1000);
*/
