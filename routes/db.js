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
	// 판매 조회
  sales_lookup: function(callback) {
    async.waterfall([
      connect_db,
      function(db, next) {
        db.execute(
          'SELECT *' +
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

    // 물품 등록
    item_enroll: function(options, callback) {
        console.log(options);
        async.waterfall([
            connect_db,
            function(db, next) {
                db.execute(
                    "INSERT INTO ITEM (ITEM_CODE, ITEM_BARCODE, ITEM_NAME, ITEM_PRICE, ITEM_EXPIRATION_DATE, ITEM_CLASSIFICATION) " +
                    "VALUES (:item_code, :item_barcode, :item_name, :item_price, :item_expiration_date, :item_classification)",
                    options,
                    {
                        outFormat: oracledb.OBJECT,
                        autoCommit: true
                    },
                    function(err, result) {
                        console.log(err);
                        console.log(result);
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
		// console.log('$!@#!@#!$!@$!@12123123123$');
		// console.log(options);
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
          { outFormat: oracledb.OBJECT,
						autoCommit: true },
        function(err, result) {
					if(err) {
						console.log(err);
					}else{
						console.log('success!!!');
					}
          db.close();
          next(null, result);
        });
      }
    ], function(err, result) {
      callback(err, result);
    });
	},

	//selling_code를 받아서 selling_item 등록
	selling_item_enroll: function(options, callback) {
		var selling_item_object = {};
		
		console.log("selling item enroll ^^^^^^^^^^^^6");
		console.log(options);
		async.waterfall([
			connect_db,
      function(db, next) {
        db.execute(
					"INSERT INTO SELLING_ITEM(SELLING_CODE, ITEM_CODE, SELLING_ITEM_COUNT)" +
					" VALUES(:array)",
					[options.selling_code,options.selling_item],
					{ outFormat: oracledb.OBJECT,
						autoCommit: true },
        function(err, result) {
					if (err) {
						console.log(err);
					}
        });
      }
    ], function(err, result) {

    });
	}
};
