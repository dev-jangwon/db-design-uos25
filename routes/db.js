var oracledb = require('oracledb');
oracledb.autoCommit = true;
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

	// 지원자 조회
	employee_get_applicant: function(branch_code, callback) {
		async.waterfall([
      connect_db,
      function(db, next) {
        db.execute(
          'SELECT * ' +
          'FROM APPLICANT ' +
					'WHERE BRANCH_CODE=:code ' +
					'ORDER BY APPLICANT_DATE',
          [branch_code],
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

	// 직원 조회
	employee_get_employee: function(branch_code, callback) {
		async.waterfall([
			connect_db,
			function(db, next) {
				db.execute(
					'SELECT * ' +
					'FROM EMPLOYEE ' +
					'WHERE BRANCH_CODE=:code ' +
					'ORDER BY EMPLOYEE_CODE',
					[branch_code],
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

	employee_add_applicant: function(options, callback) {
		var name = options.name;
		var id_card = options.id_card;
		var resume = options.resume;
		var date = options.date;
		var branch_code = options.branch_code;

		async.waterfall([
			connect_db,
			function(db, next) {
				db.execute(
          'SELECT APPLICANT_CODE ' +
          'FROM APPLICANT ' +
					'ORDER BY APPLICANT_DATE',
          [],
          { outFormat: oracledb.OBJECT },
        function(err, result) {
          next(null, {
						rows: result.rows,
						db: db
					});
        });
			},
			function(data, next) {
				var last_code = data.rows[data.rows.length - 1].APPLICANT_CODE;
				var new_code = 'AP' + (parseInt(last_code.replace('AP', ''), 10) + 1);

				data.db.execute(
						"INSERT INTO APPLICANT (APPLICANT_CODE, APPLICANT_DATE, APPLICANT_ID_CARD, APPLICANT_NAME, APPLICANT_RESUME, BRANCH_CODE) " +
						"VALUES (:applicant_code, :applicant_date, :applicant_id_card, :applicant_name, :applicant_resume, :applicant_branch_code)",
						[new_code, date, id_card, name, resume, branch_code],
						{
								outFormat: oracledb.OBJECT,
								autoCommit: true
						},
						function(err, result) {
								data.db.close();
								next(null, result);
						});
			}
		], function(err, result) {
			callback(err);
		});
	},

	employee_accept: function(options, callback) {
		var code = options.code;
		var name = options.name;
		var date = options.date;
		var branch_code = options.branch_code;

		async.waterfall([
			connect_db,
			function(db, next) {
				db.execute(
          'DELETE FROM APPLICANT ' +
					'WHERE APPLICANT_CODE=:code',
          [code],
        function(err, result) {
          next(err, db);
        });
			},
			function(db, next) {
				db.execute(
          'SELECT EMPLOYEE_CODE ' +
          'FROM EMPLOYEE ' +
					'ORDER BY EMPLOYEE_CODE',
          [],
          { outFormat: oracledb.OBJECT },
        function(err, result) {
          next(err, {
						rows: result.rows,
						db: db
					});
        });
			},
			function(data, next) {
				var last_code = data.rows[data.rows.length - 1].EMPLOYEE_CODE;
				var new_code = 'EP' + (parseInt(last_code.replace('EP', ''), 10) + 1);

				data.db.execute(
						"INSERT INTO EMPLOYEE (EMPLOYEE_CODE, EMPLOYEE_NAME, EMPLOYEE_SALARY, EMPLOYEE_RANK, WORK_START_DATE, BRANCH_CODE, EMPLOYEE_PASSWORD) " +
						"VALUES (:employee_code, :employee_name, :employee_salary, :employee_rank, :employee_date, :employee_branch_code, :employee_password)",
						[new_code, name, 8000, 'employee', date, branch_code, '1234'],
						{
								outFormat: oracledb.OBJECT,
								autoCommit: true
						},
						function(err) {
								data.db.close();
								next(err);
						});
			}
		], function(err) {
			callback(err);
		});
	},

	employee_reject: function(options, callback) {
		var code = options.code;

		async.waterfall([
			connect_db,
			function(db, next) {
				db.execute(
					'DELETE FROM APPLICANT ' +
					'WHERE APPLICANT_CODE=:code',
					[code],
				function(err) {
					db.close();
					next(err);
				});
			},
		], function(err) {
			callback(err);
		});
	},

	employee_fire: function(options, callback) {
		var code = options.code;

		async.waterfall([
			connect_db,
			function(db, next) {
				db.execute(
					'DELETE FROM EMPLOYEE ' +
					'WHERE EMPLOYEE_CODE=:code',
					[code],
				function(err) {
					db.close();
					next(err);
				});
			},
		], function(err, result) {
			callback(err);
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
		async.waterfall([
			connect_db,
            function(db, next) {
                db.execute(
					options.query,
					[],
					{
					    outFormat: oracledb.OBJECT,
						autoCommit: true
                    }, function(err, result) {
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
	}
};
