var features = {};
var db = require('./db.js');

features.signin = function(req, callback) {
  var id = req.body.id;
  var password = req.body.password;

  db.signin(req.body, function(err, result) {
    if (err) {
      callback({
        result: false
      });
    } else {
      if (password == result.EMPLOYEE_PASSWORD) {
        req.session.user_data = result;

        callback({
          result: true
        });
      } else {
        callback({
          result: false
        });
      }
    }
  });
};

features.sales = {};

features.sales.lookup = function(callback) {
  db.sales_lookup(function(err, result) {
    if (err) {
      callback({
        result: false
      });
    } else {
      callback({
        result: true,
        data: result
      });
    }
  });
};

features.sales.enroll = function() {

};



module.exports = features;
