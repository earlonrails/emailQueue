var mailConfig = require('./mailConfig.json');

switch (mailConfig.mailFunction) {
  case "mutt":
    var mailCommand =  function(body, subject, from, to){
      return "echo '" + body + "' | EMAIL='" + from + "' mutt -s '" + subject + "' -- '" + to + "'";
    };
  break;
  case "mail":
    var mailCommand =  function(body, subject, from, to){
      return "echo '" + body + "' | mail -s '" + subject + "' '" + to + "' -f '" + from + "'";
    };
  break;
  default:
    var mailCommand =  function(body, subject, from, to){
      console.log("body: " + body + " subject: " + subject + " from: " + from + " to: " + to);
      return "echo '" + body + " subject " + subject + " from " + from + " to " + to + "'";
    };
}

exports.mailCommand = mailCommand;