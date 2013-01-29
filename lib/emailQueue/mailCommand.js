var mailConfig = require('./mailConfig.json');

var mailCommand = function(body, subject, from, to){
  return "echo '" + body + "' | mail -s '" + subject + "' -r '" + from + "' '" + to + "'";
};

if (mailConfig.mailFunction != "mail") {
  var mailCommand = mailConfig.mailFunction;
}

exports.mailCommand = mailCommand;