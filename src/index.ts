import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the jupyterlab_autologout_v2 extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_autologout_v2:plugin',
  description: 'A JupyterLab extension to autologout users after some time.',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab_autologout_v2 is activated!');
    // Get the config file for the timeout plugin
    // The time is in seconds
    var config = require('./logout_conf.json');
    var timeoutInMiliseconds = config.logout_time * 1000; // Convert in miliseconds

    var timeoutId;
    var lastTrigeredTime = 0;

    function startTimer() { 
      timeoutId = window.setTimeout(doInactive, timeoutInMiliseconds);
    }

    function resetTimer() {
      // Timer reset every 10 seconds on event trigered
      if (Date.now() - lastTrigeredTime > 10000) {
        console.log("[autologout] logout timer reset");
        lastTrigeredTime = Date.now();
        window.clearTimeout(timeoutId);
        startTimer();
      }
    }

    function doInactive() {
      console.log("[autologout] logout trigered due to user inactivity");
      window.location.href = "/hub/logout";
    }

    function setupTimers () {
      document.addEventListener("mousemove", resetTimer);
      document.addEventListener("mousedown", resetTimer);
      document.addEventListener("keypress", resetTimer);
      document.addEventListener("touchmove", resetTimer);
       
      startTimer();
    }
    console.log("[autologout] the URL of this page is: " + window.location.href);

    var link = window.location.href;
    var is_ignored = link.includes(config.ignored_url.toString());
    if (!is_ignored || (config.ignored_url.toString() === "")) {
      console.log("[autologout] setup timer");
      setupTimers();
    } else {
      console.log("[autologout] extension ignored for current host")
    }
  }
};

export default plugin;
