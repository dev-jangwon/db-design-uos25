var oracledb = require('oracledb');
var async = require('async');

var db_config = {
	user: 'jangwon',
	password: 'kh5329kh',
	connectString: 'dbdinstance.cn885wgifd0n.ap-northeast-2.rds.amazonaws.com:1521/UOS25'
};

var connect_db = function(callback) {
  oracledb.getConnection(db_config, function(err, connection) {
    if (err) {
      console.log('DB connection error:', err.message);
      callback(err);
    } else {
      callback(null, connection);
    }
  });
};

module.exports = {
	signin: function(options, callback) {
		var id = options.id;

		async.waterfall([
			connect_db,
			function(db, next) {
				db.execute(
					'SELECT * ' +
					'FROM EMPLOYEE ' +
					'WHERE EMPLOYEE_CODE=:id',
					[id],
					{ outFormat: oracledb.OBJECT },
				function(err, result) {
					db.close();
					if (err) {
						next(err);
					} else {
						next(null, result.rows);
					}
				});
			}
		], function(err, result) {
			if (err || result.length == 0) {
				callback(err);
			} else {
				callback(null, result[0]);
			}
		});
	},

	// 판매 조회
  sales_lookup: function(callback) {
    async.waterfall([
      connect_db,
      function(db, next) {
        db.execute(
          'SELECT * ' +
          'FROM SELLING',
          [],
          { outFormat: oracledb.OBJECT },
        function(err, result) {
          db.close();
          next(null, result.rows);
        });
      }
    ], function(err, result) {
      callback(err, result);
    });
  },

	// 고객 조회
	customer_lookup: function(options, callback) {
		var code = options.customer_code;
		async.waterfall([
          connect_db,
          function(db, next) {
            db.execute(
              'SELECT * ' +
              'FROM CUSTOMER ' +
                        'WHERE CUSTOMER_CODE=:code',
              [code],
              { outFormat: oracledb.OBJECT },
            function(err, result) {
              db.close();
              next(null, result.rows);
            });
          }
        ], function(err, result) {
          callback(err, result);
        });
	},

    // 고객 전체 조회
    customer_lookup_all: function(options, callback) {
        async.waterfall([
            connect_db,
            function(db, next) {
                db.execute(
                    'SELECT * ' +
                    'FROM CUSTOMER',
                    [],
                    { outFormat: oracledb.OBJECT },
                    function(err, result) {
                        db.close();
                        next(null, result.rows);
                    });
            }
        ], function(err, result) {
            callback(err, result);
        });
    },

    customer_count: function(callback) {
        async.waterfall([
            connect_db,
            function(db, next) {
                db.execute(
                    "SELECT count(*) FROM CUSTOMER",
                    [],
                    { outFormat: oracledb.OBJECT },
                    function(err, result) {
                        var count = result.rows[0]['COUNT(*)'] + 1;
                        var customer_code = 'CT' + count;
                        db.close();
                        next(null, customer_code);
                    });
            }
        ], function(err, result) {
            callback(err, result);
        });
    },

    customer_enroll: function(options, callback) {
        var code = options.customer_code;
        async.waterfall([
            connect_db,
            function(db, next) {
                db.execute(
                    "INSERT INTO CUSTOMER (CUSTOMER_CODE, CUSTOMER_NAME, CUSTOMER_PHONE_NUMBER, CUSTOMER_AGE, CUSTOMER_SEX, CUSTOMER_MILEAGE) " +
                    "VALUES (:customer_code, :customer_name, :customer_phone_number, :customer_age, :customer_sex, :customer_mileage)",
                    [options.customer_code, options.customer_name, options.customer_phone_number, options.customer_age, options.customer_sex, 0],
                    {
                        outFormat: oracledb.OBJECT,
                        autoCommit: true
                    },
                    function(err, result) {
                        if (err) {
                            console.log(err);
                        }
                        db.close();
                        next(null, result.rows);
                    });
            }
        ], function(err, result) {
            callback(err, result);
        });
    },

    customer_modify: function(options, callback) {
        async.waterfall([
            connect_db,
            function(db, next) {
                db.execute(
                    'UPDATE CUSTOMER ' +
                    'SET CUSTOMER_NAME = :customer_name, ' +
                    'CUSTOMER_PHONE_NUMBER = :customer_phone_number, ' +
                    'CUSTOMER_AGE = :customer_age, ' +
                    'CUSTOMER_SEX = :customer_sex, ' +
                    'CUSTOMER_MILEAGE = :customer_mileage ' +
                    'WHERE CUSTOMER_CODE = :customer_code',
                    [options.customer_name, options.customer_phone_number, options.customer_age, options.customer_sex, options.customer_mileage, options.customer_code],
                    {
                        outFormat: oracledb.OBJECT,
                        autoCommit: true
                    },
                    function(err, result) {
                        if (err) {
                            console.log(err);
                        }
                        db.close();
                        next(null, result.rows);
                    });
            }
        ], function(err, result) {
            callback(err, result);
        });
    },

    customer_delete: function(options, callback) {
        async.waterfall([
            connect_db,
            function(db, next) {
                db.execute(
                    'DELETE FROM CUSTOMER ' +
                    'WHERE CUSTOMER_CODE = :customer_code',
                    [options.customer_code],
                    {
                        outFormat: oracledb.OBJECT,
                        autoCommit: true
                    },
                    function(err, result) {
                        db.close();
                        next(null, result.rows);
                    });
            }
        ], function(err, result) {
            callback(err, result);
        });
    },

	// 물품 조회
	item_lookup: function(options, callback) {
		// var code = options.item_code;
		var code = options.item_code;
		async.waterfall([
          connect_db,
          function(db, next) {
            db.execute(
              'SELECT * ' +
              'FROM ITEM ' +
                        'WHERE ITEM_CODE=:code',
              [code],
              { outFormat: oracledb.OBJECT },
            function(err, result) {
              db.close();
              next(null, result.rows);
            });
          }
        ], function(err, result) {
          callback(err, result);
        });
	},

    // 물품 전체 조회
    item_lookup_all: function(options, callback) {
        async.waterfall([
            connect_db,
            function(db, next) {
                db.execute(
                    'SELECT * ' +
                    'FROM ITEM',
                    [],
                    { outFormat: oracledb.OBJECT },
                    function(err, result) {
                        db.close();
                        next(null, result.rows);
                    });
            }
        ], function(err, result) {
            callback(err, result);
        });
    },

    item_modify: function(options, callback) {
        async.waterfall([
            connect_db,
            function(db, next) {
                db.execute(
                    'UPDATE ITEM ' +
                    'SET ITEM_BARCODE = :item_barcode, ' +
                    'ITEM_NAME = :item_name, ' +
                    'ITEM_PRICE = :item_price, ' +
                    'ITEM_EXPIRATION_DATE = :item_expiration_date, ' +
                    'ITEM_CLASSIFICATION = :item_classification ' +
                    'WHERE ITEM_CODE = :item_code',
                    [options.item_barcode, options.item_name, options.item_price, options.item_expiration_date, options.item_classification, options.item_code],
                    {
                        outFormat: oracledb.OBJECT,
                        autoCommit: true
                    },
                    function(err, result) {
                        if (err) {
                            console.log(err);
                        }
                        db.close();
                        next(null, result.rows);
                    });
            }
        ], function(err, result) {
            callback(err, result);
        });
    },

    item_delete: function(options, callback) {
        async.waterfall([
            connect_db,
            function(db, next) {
                db.execute(
                    'DELETE FROM ITEM ' +
                    'WHERE ITEM_CODE = :item_code',
                    [options.item_code],
                    {
                        outFormat: oracledb.OBJECT,
                        autoCommit: true
                    },
                    function(err, result) {
                        db.close();
                        next(null, result.rows);
                    });
            }
        ], function(err, result) {
            callback(err, result);
        });
    },

    // 물품 등록
    item_enroll: function(options, callback) {
        async.waterfall([
            connect_db,
            function(db, next) {
                db.execute(
                    "INSERT INTO ITEM (ITEM_CODE, ITEM_BARCODE, ITEM_NAME, ITEM_PRICE, ITEM_EXPIRATION_DATE, ITEM_CLASSIFICATION) " +
                    "VALUES (:item_code, :item_barcode, :item_name, :item_price, :item_expiration_date, :item_classification)",
                    [options.item_code, options.item_barcode, options.item_name, options.item_price, options.item_expiration_date, options.item_classification],
                    {
                        outFormat: oracledb.OBJECT,
                        autoCommit: true
                    },
                    function(err, result) {
                        if (err) {
                            console.log(err);
                        }
                        db.close();
                        next(null, result);
                    });
            }
        ], function(err, result) {
            callback(err, result);
        });
    },

    item_count: function(callback) {
        async.waterfall([
            connect_db,
            function(db, next) {
                db.execute(
                    "SELECT COUNT(*) FROM ITEM",
                    [],
                    { outFormat: oracledb.OBJECT },
                    function(err, result) {
                        var count = result.rows[0]['COUNT(*)'] + 1;
                        var item_code = 'IT' + count;
                        db.close();
                        next(null, item_code);
                    }
                );
            }
        ], function(err, item_code) {
						if(err){
							console.log(err);
						}
            callback(err, item_code);
        });
    },

	// 편의점 전용 상품 조회
	branch_item_lookup: function(options, callback) {
		var code = options.item_code;
		async.waterfall([
          connect_db,
          function(db, next) {
            db.execute(
              'SELECT * ' +
              'FROM BRANCH_ITEM ' +
              'WHERE ITEM_CODE=:code',
              [code],
              { outFormat: oracledb.OBJECT },
                function(err, result) {
                  db.close();
                  next(null, result.rows);
                });
              }
            ], function(err, result) {
              callback(err, result);
            });
	},

    branch_item_enroll: function(options, callback) {
        async.waterfall([
            connect_db,
            function(db, next) {
                db.execute(
                    "INSERT INTO BRANCH_ITEM (ITEM_CODE, MILEAGE_RATE) " +
                    "VALUES(:item_code, :mileage_rate)",
                    [options.item_code, options.mileage_rate],
                    {
                        outFormat: oracledb.OBJECT,
                        autoCommit: true
                    },
                    function(err, result) {
                        if (err) {
                            console.log(err);
                        }
                        db.close();
                        next(null, result.rows);
                    });
            }
        ], function(err, result) {
            callback(err, result);
        });
    },

    branch_item_delete: function(options, callback) {
        async.waterfall([
            connect_db,
            function(db, next) {
                db.execute(
                    'DELETE FROM BRANCH_ITEM ' +
                    'WHERE ITEM_CODE = :item_code',
                    [options.item_code],
                    {
                        outFormat: oracledb.OBJECT,
                        autoCommit: true
                    },
                    function(err, result) {
                        if (err) {
                            console.log(err);
                        }
                        db.close();
                        next(null, result.rows);
                    });
            }
        ], function(err, result) {
            callback(err, result);
        });
    },

    branch_item_modify: function(options, callback) {
        async.waterfall([
            connect_db,
            function(db, next) {
                db.execute(
                    'UPDATE BRANCH_ITEM ' +
                    'SET MILEAGE_RATE = :mileage_rate ' +
                    'WHERE ITEM_CODE = :item_code',
                    [options.mileage_rate, options.item_code],
                    {
                        outFormat: oracledb.OBJECT,
                        autoCommit: true
                    },
                    function(err, result) {
                        if (err) {
                            console.log(err);
                        }
                        db.close();
                        next(null, result.rows);
                    });
            }
        ], function(err, result) {
            callback(err, result);
        });
    },
	/* 판매관련 */
	//selling count를 통해 selling_code 생성
	selling_count: function(callback) {
		async.waterfall([
			connect_db,
			function(db,next) {
				db.execute(
					"SELECT count(*) FROM SELLING",
					[],
                    { outFormat: oracledb.OBJECT },
					function(err, result) {
						var count = result.rows[0]['COUNT(*)'] + 1;
						var selling_code = 'SL' + count;
						db.close();
          	            next(null, selling_code);
					}
				);
			}
		], function(err, selling_code) {
            callback(err, selling_code);
		});
	},

	//selling_code를 받아서 selling 등록.
	selling_enroll: function(options, callback) {
		async.waterfall([
		    connect_db,
            function(db, next) {
                db.execute(
                    "INSERT INTO SELLING (SELLING_CODE, SELLING_PRICE, SELLING_DATE, CUSTOMER_CODE) " +
                    "VALUES(:selling_code, :selling_price, :selling_date, :customer_code)",
                    [options.selling_code, options.selling_price, options.selling_date, options.customer_code],
                    {
                        outFormat: oracledb.OBJECT,
                        autoCommit: true
                    },
                    function(err, result) {
                        if (err) {
                            console.log(err);
                        }
                        db.close();
                        next(null, result);
                    });
            }], function(err, result) {
                callback(err, result);
            });
    },

	//selling_code를 받아서 selling_item 등록
	selling_item_enroll: function(options, callback) {
        var selling_item_object = options.selling_item_object;
		async.waterfall([
			connect_db,
            function(db, next) {
		        async.forEachOf(selling_item_object, function(value, key, callback) {
                    db.execute(
                        "INSERT INTO SELLING_ITEM(SELLING_CODE, ITEM_CODE, SELLING_ITEM_COUNT) " +
                        "VALUES(:selling_code, :item_code, :selling_item_count)",
                        [options.selling_code, key, value],
                        {
                            outFormat: oracledb.OBJECT,
                            autoCommit: true
                        }, function(err, result) {
                            if (err) {
                               console.log(err);
                            }
                        callback();
                    });
                }, function(err) {
		            if (err) {
		                console.log(err);
                    }
                    db.close();
                    next(null);
                });
            }
        ], function(err) {
		    callback(err, true);
        });
	},
    /* 이벤트관련 */
    event_count: function(callback) {
        async.waterfall([
            connect_db,
            function(db,next) {
                db.execute(
                    "SELECT count(*) FROM EVENT",
                    [],
                    { outFormat: oracledb.OBJECT },
                    function(err, result) {
                        if (err) {
                            console.log(err);
                        }
                        var count = result.rows[0]['COUNT(*)'] + 1;
                        var event_code = 'EV' + count;
                        db.close();
                        next(null, event_code);
                    }
                );
            }
        ], function(err, event_code) {
            callback(err, event_code);
        });
    },

    event_enroll: function(options, callback) {
        async.waterfall([
            connect_db,
            function(db, next) {
                db.execute(
                    "INSERT INTO EVENT (EVENT_CODE, EVENT_NAME, EVENT_DESC, EVENT_TERM) " +
                    "VALUES(:event_code, :event_name, :event_desc, :event_term)",
                    [options.event_code, options.event_name, options.event_desc, options.event_term],
                    {
                        outFormat: oracledb.OBJECT,
                        autoCommit: true
                    },
                    function(err, result) {
                        if (err) {
                            console.log(err);
                        }
                        db.close();
                        next(null, result);
                    });
            }], function(err, result) {
            callback(err, result);
        });
    },

    event_item_enroll: function(options, callback) {
        var event_item_arr = options.event_items;
        async.waterfall([
            connect_db,
            function(db, next) {
                async.eachSeries(event_item_arr, function(item, callback) {
                    db.execute(
                        "INSERT INTO ITEM_EVENT (EVENT_CODE, ITEM_CODE, EVENT_INFO) " +
                        "VALUES(:event_code, :item_code, :event_info)",
                        [options.event_code, item, options.event_info],
                        {
                            outFormat: oracledb.OBJECT,
                            autoCommit: true
                        }, function(err, result) {
                            if (err) {
                                console.log(err);
                            }
                            callback();
                        });
                }, function(err) {
                    if (err) {
                        console.log(err);
                    }
                    db.close();
                    next(null);
                });
            }
        ], function(err) {
            callback(err, true);
        });
    },

    // 이벤트 전체 조회
    event_lookup_all: function(options, callback) {
        async.waterfall([
            connect_db,
            function(db, next) {
                db.execute(
                    'SELECT * ' +
                    'FROM EVENT',
                    [],
                    { outFormat: oracledb.OBJECT },
                    function(err, result) {
                        if (err) {
                            console.log(err);
                        }
                        db.close();
                        next(null, result.rows);
                    });
            }
        ], function(err, result) {
            callback(err, result);
        });
    },

    /* 이벤트 아이템 관련 */
    event_item_lookup: function(options, callback) {
        async.waterfall([
            connect_db,
            function(db, next) {
                db.execute(
                    'SELECT * from ITEM_EVENT, ITEM ' +
                    'WHERE EVENT_CODE = (:event_code)' +
                    'AND ITEM_EVENT.ITEM_CODE = ITEM.ITEM_CODE',
                    [options.event_code],
                    { outFormat: oracledb.OBJECT },
                    function(err, result) {
                        if (err) {
                            console.log(err);
                        }
                        db.close();
                        next(null, result.rows);
                    });
            }
        ], function(err, result) {
            callback(err, result);
        });
    },

		/* 생활서비스 관련 */

		service_count: function(callback) {
			async.waterfall([
					connect_db,
					function(db, next) {
							db.execute(
									"SELECT COUNT(*) FROM SERVICE",
									[],
									{ outFormat: oracledb.OBJECT },
									function(err, result) {
											var count = result.rows[0]['COUNT(*)'] + 1;
											var service_code = 'SV' + count;
											db.close();
											next(null, service_code);
									}
							);
					}
			], function(err, service_code) {
					callback(err, service_code);
			});
		},

		service_enroll: function(options, callback) {
			async.waterfall([
				connect_db,
				function(db,next) {
					db.execute(
						"INSERT INTO SERVICE(SERVICE_CODE,SERVICE_NAME,SERVICE_INFO,BRANCH_CODE) " +
						"VALUES (:service_code, :service_name, :service_info, :branch_code)",
						[options.service_code, options.service_name, options.service_info, options.branch_code],
						{
							outFormat: oracledb.OBJECT,
							autoCommit: true
						},
						function(err,result) {
							if(err) {
								console.log(err);
							}
							db.close();
							next(null,result);
						});
				}
			], function(err,result) {
				callback(err,result);
			});
		},

		service_lookup: function(options, callback) {
			var code = options.branch_code;
			async.waterfall([
        connect_db,
        function(db, next) {
          db.execute(
            'SELECT * ' +
            'FROM SERVICE ' +
            'WHERE BRANCH_CODE=:code ' +
						'ORDER BY SERVICE_NAME',
            [code],
            { outFormat: oracledb.OBJECT },
          function(err, result) {
            db.close();
            next(null, result.rows);
          });
        }
      ], function(err, result) {
        callback(err, result);
      });
		},

		service_modify: function(options, callback) {
			async.waterfall([
        connect_db,
        function(db, next) {
          db.execute(
            'UPDATE SERVICE ' +
						'SET SERVICE_NAME = :service_name, ' +
						'SERVICE_INFO = :service_info ' +
						'WHERE SERVICE_CODE = :service_code',
            [options.service_name, options.service_info, options.service_code],
            {
							outFormat: oracledb.OBJECT,
							autoCommit: true
						},
          function(err, result) {
						if(err){
							console.log(err);
						}
            db.close();
            next(null, result.rows);
          });
        }
      ], function(err, result) {
        callback(err, result);
      });
		},

		service_delete: function(options, callback) {
			async.waterfall([
        connect_db,
        function(db, next) {
          db.execute(
            'DELETE FROM SERVICE ' +
						'WHERE SERVICE_CODE = :service_code' ,
            [options.service_code],
            {
							outFormat: oracledb.OBJECT,
							autoCommit: true
						},
          function(err, result) {
            db.close();
            next(null, result.rows);
          });
        }
      ], function(err, result) {
        callback(err, result);
      });
		}
};
