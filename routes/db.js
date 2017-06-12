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
					'ORDER BY APPLICANT_CODE',
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
						function(err) {
								data.db.close();
								next(err);
						});
			}
		], function(err) {
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

    event_modify: function(options, callback) {
        async.waterfall([
            connect_db,
            function(db, next) {
                db.execute(
                    'UPDATE EVENT ' +
                    'SET EVENT_NAME = :event_name, ' +
                    'EVENT_DESC = :event_desc, ' +
                    'EVENT_TERM = :event_term ' +
                    'WHERE EVENT_CODE = :event_code',
                    [options.event_name, options.event_desc, options.event_term, options.event_code],
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

    event_delete: function(options, callback) {
        async.waterfall([
            connect_db,
            function(db, next) {
                db.execute(
                    'DELETE FROM EVENT ' +
                    'WHERE EVENT_CODE = :event_code',
                    [options.event_code],
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

    event_item_modify: function(options, callback) {
        async.waterfall([
            connect_db,
            function(db, next) {
                db.execute(
                    'UPDATE ITEM_EVENT ' +
                    'SET EVENT_INFO = :event_info ' +
                    'WHERE EVENT_CODE = :event_code',
                    [options.event_info, options.event_code],
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

    event_item_delete: function(options, callback) {
        async.waterfall([
            connect_db,
            function(db, next) {
                db.execute(
                    'DELETE FROM ITEM_EVENT ' +
                    'WHERE EVENT_CODE = :event_code',
                    [options.event_code],
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

    /* 예외물품 관련 */

    exception_enroll: function(options, callback) {
        async.waterfall([
            connect_db,
            function(db, next) {
                db.execute(
                    "INSERT INTO EXCEPT_ITEM (EXCEPT_ITEM_CODE, EXCEPT_DO_DATE, ITEM_CODE, EXCEPT_TYPE_CODE, BRANCH_CODE, CUSTOMER_CODE, EXCEPT_ITEM_COUNT) " +
                    "VALUES (:except_item_code, :except_do_date, :item_code, :except_type_code, :branch_code, :customer_code, :except_item_count)",
                    [options.except_item_code, options.except_do_date, options.item_code, options.except_type_code, options.branch_code, options.customer_code, options.except_item_count],
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

    exception_count: function(callback) {
        async.waterfall([
            connect_db,
            function(db, next) {
                db.execute(
                    "SELECT COUNT(*) FROM EXCEPT_ITEM",
                    [],
                    { outFormat: oracledb.OBJECT },
                    function(err, result) {
                        var count = result.rows[0]['COUNT(*)'] + 1;
                        var except_item_code = 'EC' + count;
                        db.close();
                        next(null, except_item_code);
                    }
                );
            }
        ], function(err, item_code) {
            callback(err, item_code);
        });
    }
};
