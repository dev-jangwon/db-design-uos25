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
	}
};
