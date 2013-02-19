var specHelper = require('./specHelper.js'),
    emailQueue = specHelper.emailQueue;

describe("delay", function() {
  var called;

  it('should delay the execution of a function.', function() {
    runs(function(){
      called = false;
      emailQueue.delay(1000, function(){
        called = true;
      });
    });
    waitsFor(function(){ return called; }, "The function should have been called", 1005);
    runs(function(){
      expect(called).toBeTruthy();
    });
  });
});
