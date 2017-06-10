var features = {};
var db = require('./db.js');

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
    console.log('db options############3');
    console.log(options);
    db.selling_enroll(options, function(err,result) {
      db.selling_item_enroll(options, function(err,result) {
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
};

module.exports = features;
