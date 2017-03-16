var test = require('./build/Release/test');
test.hello('test', function(data) {
  console.log(data);
});

