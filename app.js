var fs             = require('fs'),
    path           = require('path'),
    redis          = require('redis'),
    express        = require('express'),
    emailQueue     = require('./lib/emailQueue'),
    redisClient    = redis.createClient(),
    app            = express();

var PUBLIC_DIR = path.dirname(__filename) + '/public',
    SHARED_DIR = path.dirname(__filename) + '/shared';

var port      = process.argv[2] || '8000',
    secure    = process.argv[3] === 'ssl',
    sslOpts   = { key:  fs.readFileSync(SHARED_DIR + '/server.key'),
                cert: fs.readFileSync(SHARED_DIR + '/server.crt')
    },
    protocol  = secure ? 'https' : 'http',
    queue     = []
    emailList = [];

var getEmailList = function(callback){
  redisClient.hgetall("email", function(err, res){
    var items = [];
    for(i in res){
      items.push(JSON.parse(res[i]));
    }
    console.dir(items);
    callback(items);
  });
};

app.use(express.bodyParser());
app.set('view engine', 'ejs');

app.post('/email', function(req, res){
  var body        = req.param('body', null),
      from        = req.param('from', null),
      to          = req.param('to', null),
      subject     = req.param('subject', null),
      delayTime   = req.param('delayTime', null),
      envelope    = { 'body' : body, 'from' : from, 'to' : to, 'subject' : subject, 'delayTime' : delayTime, 'queueIndex' :  queue.length, 'delayKey' : (queue.length + new Date().valueOf()) },
      delayObject = emailQueue.delay(delayTime, function(){
        queue.slice(envelope.queueIndex);
        emailQueue.mail(envelope);
        redisClient.hdel("email", envelope.delayKey, redis.print);
      });
      queue.push(delayObject);

  redisClient.hset("email", envelope.delayKey, JSON.stringify(envelope), redis.print);
  res.send(String(envelope.delayKey));
});

app.get('/stop', function(req, res){
  var delayKey = req.param('delayKey', null);
  redisClient.hmget("email", delayKey, function(err, ele){
    if (err) {
      console.log(err);
    } else {
      var envelope = JSON.parse(ele);
      clearTimeout(queue[envelope.queueIndex]);
      redisClient.hdel("email", envelope.delayKey, redis.print);
    }
  });
});

app.get('/email_list', function(req, res){
  getEmailList(function(list){
    emailList = list;
  });
  console.log(emailList);
  res.render('index', { emailList : emailList, test : "test" });
});

app.listen(Number(port));

if (!port && !secure) {
  console.log('Usage: node emailQueue.js 8000 ssl # default port and optional security setting');
}

console.log('Listening on ' + port + " " + protocol);
