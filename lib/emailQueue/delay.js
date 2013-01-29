var delay = function(ms, func){
  var timeout = setTimeout(func, ms);
  return timeout;
};

exports.delay = delay;
