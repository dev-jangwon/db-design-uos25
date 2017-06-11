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
					'SELECT EMPLOYEE_PASSWORD ' +
					'FROM EMPLOYEE ' +
					'WHICH EMPLOYEE_CODE=:id',
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
				callback(null, result);
			}
		});
	},

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
  }
};
