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

	selling_enroll: function(options, callback) {
		// console.log(options);
		options.selling_price = Number(options.selling_price);
		var data = JSON.stringify(options);
		// data.selling_price = Number(options.selling_price);
		console.log(data);
		async.waterfall([
      connect_db,
      function(db, next) {
        db.execute(
          'INSERT INTO SELLING ' +
          'VALUES(:selling_code, :selling_price, :selling_date, :customer_code)',
          data,
          { outFormat: oracledb.OBJECT },
        function(err, result) {
					if(err) {
						console.log(err);
					}
          db.close();
          next(null);
        });
      }
    ], function(err, result) {
      callback(err, result);
    });
	}
};
