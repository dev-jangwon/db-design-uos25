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

features.employee.add_applicant = function(options, callback) {
  db.employee_add_applicant(options, function(err) {
    if (err) {
      callback({
        result: false
      });
    } else {
      callback({
        result: true
      });
    }
  });
};

features.employee.accept = function(options, callback) {
  db.employee_accept(options, function(err) {
    if (err) {
      callback({
        result: false
      });
    } else {
      callback({
        result: true
      });
    }
  });
};

features.employee.reject = function(options, callback) {
  db.employee_reject(options, function(err) {
    if (err) {
      callback({
        result: false
      });
    } else {
      callback({
        result: true
      });
    }
  });
};

features.employee.fire = function(options, callback) {
  db.employee_fire(options, function(err) {
    if (err) {
      callback({
        result: false
      });
    } else {
      callback({
        result: true
      });
    }
  });
};

features.request = {};

features.request.get = function(options, callback) {
  db.request_get(options, function(err, data) {
    if (err) {
      callback({
        result: false
      });
    } else {
      callback({
        result: true,
        requests: data
      });
    }
  });
};

features.request.get_item = function(options, callback) {
  db.request_get_item(options, function(err, data) {
    if (err) {
      callback({
        result: false
      });
    } else {
      callback({
        result: true,
        data: data
      });
    }
  });
};

features.request.add = function(options, callback) {
  async.waterfall([
    function(next) {
      db.request_count(next);
    },
    function(new_code, next) {
      db.request_add({
        code: new_code,
        date: options.date,
        branch_code: options.branch_code
      }, next);
    },
    function(rq_code, next) {
      var item_list = options.data;
      async.map(item_list, function(item, _next) {
        db.request_item_add({
          rq_code: rq_code,
          code: item.item_code,
          count: item.item_count
        }, _next);
      }, function() {
        next();
      });
    }
  ], function(err) {
    if (err) {
      callback({
        result: false
      });
    } else {
      callback({
        result: true
      });
    }
  });
};

features.arrive = {};

features.arrive.get = function(options, callback) {
  db.arrive_get(options, function(err, data) {
    if (err) {
      callback({
        result: false
      });
    } else {
      callback({
        result: true,
        data: data
      });
    }
  });
};

features.arrive.get_item = function(options, callback) {
  var request_data = [];
  var arrive_data = [];

  async.waterfall([
    function(next) {
      db.request_get_item({
        code: options.request_code
      }, function(err, data) {
        next(err, data);
      });
    },
    function(rq_data, next) {
      request_data = rq_data;
      db.arrive_get_item({
        code: options.arrive_code
      }, function(err, data) {
        next(err, data);
      });
    }
  ], function(err, data) {
    arrive_data = data;
    if (err) {
      callback({
        result: false
      });
    } else {
      callback({
        result: true,
        request_item: request_data,
        arrive_item: arrive_data
      });
    }
  });
};

features.arrive.confirm = function(options, callback) {
  var arrive_code = options.code;
  var request_code = arrive_code.replace('AR', 'RQ');

  async.waterfall([
    function(next) {
      db.arrive_get_item({
        code: arrive_code
      }, function(err, data) {
        next(err, data);
      });
    },
    function(arrive_item, next) {
      async.map(arrive_item, function(item, _next) {
        db.arrive_confirm({
          item_code: item.ITEM_CODE,
          item_count: item.ARRIVE_ITEM_COUNT,
          item_expiration_date: item.ITEM_EXPIRATION_DATE
        }, _next);
      }, function(err) {
        next();
      });
    },
    function(next) {
      db.arrive_delete({
        code: arrive_code
      }, function(err) {
        next(err);
      });
    },
    function(next) {
      db.request_delete({
        code: request_code
      }, function(err) {
        next(err);
      });
    }
  ], function(err, data) {
    if (err) {
      callback({
        result: false
      });
    } else {
      callback({
        result: true
      });
    }
  });
};

features.arrive.rearrive = function(options, callback) {
  db.arrive_delete({
    code: options.code
  }, function(err) {
    if (err) {
      callback({
        result: false
      });
    } else {
      callback({
        result: true
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

//판매_물품 관련

features.selling_item = {};

features.selling_item.lookup = function(options, callback) {
  console.log('33333333333333333333');

  db.selling_item_lookup(options, function(err, result) {
    // item name을 구해야한다.
    console.log(result);
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
            if (options.customer_code != "" && options.customer_code != null && options.customer_code != undefined) {
                db.customer_modify_mileage(options, function(err, result) {
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
            } else {
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

features.event_item.event_item_lookup_item_code = function(options, callback) {
    db.event_item_lookup_item_code(options, function(err, result) {
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

/* 생활 서비스 */
features.service = {};

features.service.lookup = function(options, callback) {
  db.service_lookup(options, function(err, result) {
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

features.service.enroll = function(options, callback) {
  db.service_count(function(err, service_code) {
    options.service_code = service_code;
    db.service_enroll(options, function(err, result) {
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
  })
};

features.service.modify = function(options, callback) {
  db.service_modify(options, function(err,result) {
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
  })
};

features.service.delete = function(options, callback) {
  db.service_delete(options, function(err,result) {
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
}

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

/* 예외물품 */

features.exception = {};

features.exception.enroll = function(options, callback) {
    db.exception_count(function(err, except_item_code) {
        options.except_item_code = except_item_code;
        db.exception_enroll(options, function(err, result) {
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

features.exception.lookup_all = function(options, callback) {
    db.exception_lookup_all(options, function(err, result) {
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

features.exception.delete = function(options, callback) {
    db.exception_delete(options, function(err, result) {
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

/* 지불 */

features.payment = {};

features.payment.lookup = function(options, callback) {
    db.selling_lookup_sum(options, function(err, selling_sum) {
        if (err) {
            callback({
                result: false
            });
        } else {
            db.employee_lookup_sum(options, function(err, employee_sum) {
                if (err) {
                    callback({
                        result: false
                    });
                } else {
                    db.branch_get_info(options, function(err, branch_info) {
                        if (err) {
                            callback({
                                result: false
                            });
                        } else {
                            callback({
                                result: true,
                                data: {
                                    'selling_sum': selling_sum,
                                    'employee_sum': employee_sum,
                                    'branch_percent': branch_info[0].HEAD_OFFICE_PAYMENT_RATE,
                                    'branch_maintenance': branch_info[0].MONTH_MAINTENANCE,
                                    'payment': (selling_sum - employee_sum - branch_info[0].MONTH_MAINTENANCE) * branch_info[0].HEAD_OFFICE_PAYMENT_RATE
                                }
                            });
                        }
                    })
                }
            });
        }
    });
};

features.payment.enroll = function(options, callback) {
    db.payment_count(function(err, payment_code) {
        options.payment_code = payment_code;
        db.payment_enroll(options, function(err, result) {
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

features.stock = {};

features.stock.get = function(callback) {
  db.stock_get(function(err, data) {
    if (err) {
      callback({
        result: false
      });
    } else {
      callback({
        result: true,
        data: data
      });
    }
  });
};

features.stock.get_all = function(callback) {
  db.stock_get_all(function(err, data) {
    if (err) {
      callback({
        result: false
      });
    } else {
      callback({
        result: true,
        data: data
      });
    }
  });
};

features.stock.change = function(options, callback) {
  var items = options.data;

  async.map(items, function(item, next) {
    db.stock_change(item, next);
  }, function(err) {
    if (err) {
      callback({
        result: false
      });
    } else {
      callback({
        result: true
      });
    }
  });
};

module.exports = features;
