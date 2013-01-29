var fs             = require('fs'),
    path           = require('path'),
    redis          = require('redis'),
    express        = require('express'),
    emailQueue     = require('./lib/emailQueue')
    redisClient    = redis.createClient(),
    app            = express();

var PUBLIC_DIR = path.dirname(__filename) + '/public',
    SHARED_DIR = path.dirname(__filename) + '/shared';

var port    = process.argv[2] || '8000',
    secure  = process.argv[3] === 'ssl',
    sslOpts = { key:  fs.readFileSync(SHARED_DIR + '/server.key'),
                cert: fs.readFileSync(SHARED_DIR + '/server.crt')
    },
    protocol = secure ? 'https' : 'http';

var getEmailList = function(){
  var emailArray = []
  redisClient.hgetall("email", function(err, email){
    emailArray.push(email);
  });
  return emailArray;
};

app.use(express.bodyParser());
app.set('view engine', 'ejs');

app.post('/email', function(req, res){
  var body      = req.param('body', null),
      from      = req.param('from', null),
      to        = req.param('to', null),
      subject   = req.param('subject', null),
      delayTime = req.param('delayTime', null),
      envelope  = { body : body, from : from, to : to, subject : subject, delayTime : delayTime },
      delayKey = emailQueue.delay(delayTime, function(){ emailQueue.mail(envelope) });
      envelope.delayKey = delayKey;

  redisClient.hset(String(delayKey), envelope, redis.print);
  res.send(delayKey);
});

app.get('/stop', function(req, res){
  var delayKey = req.param('delayKey', null);
  clearTimeout(delayKey);
  redisClient.del(delayKey);
});

app.get('/email', function(req, res){
  var emailList = getEmailList();
  res.render('index', { emailList : emailList });
});

app.listen(Number(port));

if (!port && !secure) {
  console.log('Usage: node emailQueue.js 8000 ssl # default port and optional security setting');
}

console.log('Listening on ' + port + " " + protocol);
