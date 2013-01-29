[ 'delay'
  , 'mailCommand'
  , 'mail'].forEach(function (path) {
  	var module = require('./' + path);
  	for (var i in module) {
  		exports[i] = module[i];
    }
});

var emailQueue = {};

// Map all values to the exports value
for(var name in exports) {
  emailQueue[name] = exports[name];
}

// Set our exports to be the connect function
module.exports = emailQueue;
