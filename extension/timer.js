/* Basic Timer with progress feedback
 * by Shylux
 */

(function ($) {
  $.timer = function(options) {
    return jQuery.extend(true, {}, $.timer_prototype).set(options);
  };
  $.timer_prototype = {
    name: "UNNAMED",
    delay: 0, // time in ms after the timer activates

    checkingInterval: 50, // interval to check if the timer should activate
    autoStart: true,
    action: function() {},

    startMarker: 0, // time at which timer started in ms

    // set options
    set: function(options) {
      $.extend(this, options);
      return this;
    },

    start: function(options) {
      this.startMarker = this.ms();
      let that = this;
      this.intervalId = setInterval(function() {that.onInterval();}, this.checkingInterval);
      return this;
    },

    stop: function() {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
      return this;
    },

    restart: function() {
      this.stop();
      this.start();
    },

    isRunning: function() {
      return typeof this.intervalId !== "undefined";
    },

    getProgressFracture: function() {
      if (!this.isRunning()) return false;
      let prog_ms = this.ms() - this.startMarker;
      return prog_ms / this.delay;
    },

    getProgressPercentage: function() {
      if (!this.isRunning()) return false;
      return Math.round(this.getProgressFracture() * 100);
    },

    onInterval: function() {
      if (this.ms() > this.endMarker() && typeof this.intervalId !== "undefined") {
        this.action();
        this.stop();
      } else {
        this.onProgress(this.getProgressPercentage());
      }
      return this;
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

    seconds_to_pretty_time: function(seconds) {
      let pretty_string = "";
      let minutes = Math.floor(seconds/60);
      if (minutes > 0) {
        pretty_string += minutes+"m ";
        seconds -= minutes * 60;
      }
      if (seconds > 0 || pretty_string.length === 0)
        pretty_string += seconds+"s";

      return pretty_string;
    },

    pretty_string_to_seconds: function(pretty) {
      let seconds = 0;
      let reg_m_result = /(\d+)m/.exec(pretty);
      if (reg_m_result) {
        seconds += 60 * parseInt(reg_m_result[1]);
      }
      let reg_s_result = /(\d+)s/.exec(pretty);
      if (reg_s_result) {
        seconds += parseInt(reg_s_result[1]);
      }
      return seconds;
    }
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
