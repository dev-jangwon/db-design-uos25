var features = {};
var db = require('./db.js');
var async = require('async');

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

features.employee = {};

features.employee.get_info = function(options, callback) {
  var branch_code = options.branch_code;
  var applicant_data;

  async.waterfall([
    function(next) { // get applicants
      db.employee_get_applicant(branch_code, next);
    },
    function(applicants, next) { // get employees
      applicant_data = applicants;
      db.employee_get_employee(branch_code, next);
    }
  ], function(err, result) {
    if (err) {
      callback({
        result: false
      });
    } else {
      var employee_data = result;

      callback({
        result: true,
        applicant: applicant_data,
        employee: employee_data
      });
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
// 고객 관련
features.customer = {};

features.customer.lookup = function(options, callback) {
  db.customer_lookup(options, function(err, result) {
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

// 상품 관련
features.item = {};

features.item.lookup = function(options, callback) {
  // console.log('features-------------------item-------');
  // console.log('options : ');
  //options : item_code : IT01
  // console.log(options);
  db.item_lookup(options, function(err,result) {
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

features.item.enroll = function(options, callback) {
  db.item_count(function(err, item_code) {
      options.item_code = item_code;
      options.item_barcode = options.item_code + options.item_price;
      db.item_enroll(options, function(err, result) {
          console.log('feature.js item_enroll: ', result);
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
  });
}

/*편의점 전용 상품 관련*/
features.branch_item = {};

features.branch_item.lookup = function(options, callback) {
  db.branch_item_lookup(options, function(err,result) {
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

/* 판매 관련. */
features.selling = {};

features.selling.enroll = function(options, callback) {
  db.selling_count(function(err, selling_code) {
    options.selling_code = selling_code;

    db.selling_enroll(options, function(err, result) {
      var selling_item_object = options.selling_item_object;

      var make_query = function(callback) {
          var query =  "INSERT INTO SELLING_ITEM(SELLING_CODE, ITEM_CODE, SELLING_ITEM_COUNT) VALUES(':1', ':2', ':3')"
          var complete_query = "";
        for (var key in selling_item_object) {
          complete_query += query.replace(':1', options.selling_code).replace(':2', key).replace(':3', selling_item_object[key]);
          console.log(complete_query);
          if (key == Object.keys(selling_item_object)[Object.keys(selling_item_object).length - 1]) {
              callback(complete_query);
          }
        }
      };

      make_query(function(query) {
          options.query = query;
          db.selling_item_enroll(options, function(err, result) {
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
      });
    });
  });
};

module.exports = features;
