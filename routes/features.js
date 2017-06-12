var features = {};
var db = require('./db.js');

features.signin = function(req, callback) {
  var id = req.body.id;
  var password = req.body.password;

  db.signin(req.body, function(err, result) {
    console.log('result : ',result);
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

features.customer.lookup_all = function(options, callback) {
    db.customer_lookup_all(options, function(err, result) {
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

features.customer.enroll = function(options, callback) {
    db.customer_count(function(err, customer_code) {
        options.customer_code = customer_code;
        db.customer_enroll(options, function(err, result) {
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
};

features.customer.modify = function(options, callback) {
    db.customer_modify(options, function(err, result) {
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

features.customer.delete = function(options, callback) {
    db.customer_delete(options, function(err, result) {
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
  db.item_lookup(options, function(err, result) {
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

features.item.lookup_all = function(options, callback) {
    db.item_lookup_all(options, function(err, result) {
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

features.item.modify = function(options, callback) {
    db.item_modify(options, function(err, result) {
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

features.item.delete = function(options, callback) {
    db.item_delete(options, function(err, result) {
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

features.branch_item.enroll = function(options, callback) {
    db.branch_item_enroll(options, function(err,result) {
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

features.branch_item.delete = function(options, callback) {
    db.branch_item_delete(options, function(err,result) {
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

features.branch_item.modify = function(options, callback) {
    db.branch_item_modify(options, function(err,result) {
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
};

/* 이벤트 */

features.event = {};

features.event.enroll = function(options, callback) {
    db.event_count(function(err, event_code) {
        options.event_code = event_code;

        db.event_enroll(options, function(err, result) {

            db.event_item_enroll(options, function(err, result) {
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

features.event.lookup_all = function(options, callback) {
    db.event_lookup_all(options, function(err, result) {
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

/* 이벤트 아이템 */

features.event_item = {};

features.event_item.lookup = function(options, callback) {
    db.event_item_lookup(options, function(err, result) {
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

features.event_item.modify = function(options, callback) {
    db.event_item_modify(options, function(err, result) {
        db.event_modify(options, function(err, result) {
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
};

features.event_item.delete = function(options, callback) {
    db.event_item_delete(options, function(err, result) {
        db.event_delete(options, function(err, result) {
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
};

module.exports = features;
