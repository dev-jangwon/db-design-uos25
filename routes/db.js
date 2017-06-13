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
          next(err, result.rows);
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
					next(err, result.rows);
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
				if (data.rows.length == 0) {
					last_code = 'AP0000';
				}
				var new_code = (parseInt(last_code.replace('AP', ''), 10) + 1).toString();
				var length = new_code.length;
				for (var i = 0; i < (4 - length); i++) {
					new_code = '0' + new_code;
				}
				new_code = 'AP' + new_code;

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
				if (data.rows.length == 0) {
					last_code = 'EP0000';
				}
				var new_code = (parseInt(last_code.replace('EP', ''), 10) + 1).toString();
				var length = new_code.length;
				for (var i = 0; i < (4 - length); i++) {
					new_code = '0' + new_code;
				}
				new_code = 'EP' + new_code;

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

	// 주문 목록 가져오기
	request_get: function(options, callback) {
		var branch_code = options.branch_code;

		async.waterfall([
			connect_db,
			function(db, next) {
				db.execute(
					'SELECT * ' +
					'FROM REQUEST ' +
					'WHERE BRANCH_CODE=:code ' +
					'ORDER BY REQUEST_CODE',
					[branch_code],
					{ outFormat: oracledb.OBJECT },
				function(err, result) {
					db.close();
					next(err, result.rows);
				});
			}
		], function(err, result) {
			callback(err, result);
		});
	},

	request_get_item: function(options, callback) {
		var code = options.code;

		async.waterfall([
			connect_db,
			function(db, next) {
				db.execute(
					'SELECT * ' +
					'FROM REQUEST_ITEM R, ITEM I ' +
					'WHERE R.REQUEST_CODE=:request_code ' +
					'AND R.ITEM_CODE=I.ITEM_CODE',
					[code],
					{ outFormat: oracledb.OBJECT },
				function(err, result) {
					db.close();
					next(err, result.rows);
				});
			}
		], function(err, result) {
			callback(err, result);
		});
	},

	request_delete: function(options, callback) {
		var request_code = options.code;

		async.waterfall([
			connect_db,
			function(db, next) {
				db.execute(
					'DELETE FROM REQUEST ' +
					'WHERE REQUEST_CODE=:rq_code',
					[request_code],
				function(err) {
					db.close();
					next(err);
				});
			},
		], function(err, result) {
			callback(err);
		});
	},

	request_count: function(callback) {
			async.waterfall([
					connect_db,
					function(db, next) {
							db.execute(
									'SELECT REQUEST_CODE ' +
									'FROM REQUEST ' +
									'ORDER BY REQUEST_CODE',
									[],
									{ outFormat: oracledb.OBJECT },
									function(err, result) {
											var last_code;
											if (result.rows.length == 0) {
													last_code = 'RQ0';
											} else {
													last_code = result.rows[result.rows.length - 1].REQUEST_CODE;
											}
											var new_code = (parseInt(last_code.replace('RQ', ''), 10) + 1).toString();
											var length = new_code.length;
											for (var i = 0; i < (4 - length); i++) {
												new_code = '0' + new_code;
											}
											new_code = 'RQ' + new_code;
											db.close();
											next(err, new_code);
									});
					}
			], function(err, result) {
					callback(err, result);
			});
	},

	request_add: function(options, callback) {
		async.waterfall([
				connect_db,
				function(db, next) {
					db.execute(
						'INSERT INTO REQUEST (REQUEST_CODE, REQUEST_DATE, BRANCH_CODE) ' +
						'VALUES (:rq_code, :rq_date, :br_code)',
						[options.code, options.date, options.branch_code],
						{ outFormat: oracledb.OBJECT },
					function(err) {
						db.close();
						next(err);
					});
				}
		], function(err) {
				callback(err, options.code);
		});
	},

	request_item_add: function(options, callback) {
		async.waterfall([
				connect_db,
				function(db, next) {
					db.execute(
						'INSERT INTO REQUEST_ITEM (REQUEST_CODE, REQUEST_ITEM_COUNT, ITEM_CODE) ' +
						'VALUES (:rq_code, :it_count, :it_code)',
						[options.rq_code, options.count, options.code],
						{ outFormat: oracledb.OBJECT },
					function(err) {
						db.close();
						next(err);
					});
				}
		], function(err) {
				callback(err);
		});
	},

	arrive_get: function(options, callback) {
		var code = options.code;

		async.waterfall([
			connect_db,
			function(db, next) {
				db.execute(
					'SELECT * ' +
					'FROM ARRIVE ' +
					'WHERE ARRIVE_CODE=:arrive_code ' +
					'ORDER BY ARRIVE_CODE',
					[code],
					{ outFormat: oracledb.OBJECT },
				function(err, result) {
					db.close();
					next(err, result.rows);
				});
			}
		], function(err, result) {
			callback(err, result);
		});
	},

	arrive_get_item: function(options, callback) {
		var code = options.code;

		async.waterfall([
			connect_db,
			function(db, next) {
				db.execute(
					'SELECT * ' +
					'FROM ARRIVE_ITEM A, ITEM I ' +
					'WHERE A.ARRIVE_CODE=:arrive_code ' +
					'AND A.ITEM_CODE=I.ITEM_CODE',
					[code],
					{ outFormat: oracledb.OBJECT },
				function(err, result) {
					db.close();
					next(err, result.rows);
				});
			}
		], function(err, result) {
			callback(err, result);
		});
	},

	arrive_confirm: function(options, callback) {
		var item_code = options.item_code;
		var item_count = options.item_count;
		var item_expiration_date = options.item_expiration_date;

		async.waterfall([
			connect_db,
			function(db, next) {
				db.execute(
					'SELECT WAREHOUSE_COUNT ' +
					'FROM ITEM_COUNT ' +
					'WHERE ITEM_CODE=:it_code AND ITEM_EXPIRATION_DATE=:it_date ',
					[item_code, item_expiration_date],
					{ outFormat: oracledb.OBJECT },
				function(err, result) {
					next(err, {
						db: db,
						rows: result ? result.rows : []
					});
				});
			},
			function(data, next) {
				if (data.rows.length > 0) {
					var new_count = parseInt(data.rows[0].WAREHOUSE_COUNT) + parseInt(item_count);

					data.db.execute(
						'UPDATE ITEM_COUNT ' +
						'SET WAREHOUSE_COUNT=:it_count ' +
						'WHERE ITEM_CODE=:it_code AND ITEM_EXPIRATION_DATE=:it_date ',
						[new_count, item_code, item_expiration_date],
						{ outFormat: oracledb.OBJECT },
					function(err) {
						data.db.close();
						next(err);
					});
				} else {
					data.db.execute(
						'INSERT INTO ITEM_COUNT (ITEM_CODE, DISPLAY_COUNT, WAREHOUSE_COUNT, ITEM_EXPIRATION_DATE) ' +
						'VALUES (:it_code, :d_count, :w_count, :it_date)',
						[item_code, 0, item_count, item_expiration_date],
						{ outFormat: oracledb.OBJECT },
					function(err) {
						data.db.close();
						next(err);
					});
				}
			}
		], function(err) {
			callback(err);
		});
	},

	arrive_delete: function(options, callback) {
		var arrive_code = options.code;

		async.waterfall([
			connect_db,
			function(db, next) {
				db.execute(
					'DELETE FROM ARRIVE ' +
					'WHERE ARRIVE_CODE=:ar_code',
					[arrive_code],
				function(err) {
					db.close();
					next(err);
				});
			},
		], function(err, result) {
			callback(err);
		});
	},

	arrive_item_delete: function(options, callback) {

	},


  employee_lookup_sum: function(options, callback) {
      async.waterfall([
          connect_db,
          function(db, next) {
              db.execute(
                  'SELECT SUM(EMPLOYEE_SALARY) AS SUM FROM EMPLOYEE',
                  [],
                  { outFormat: oracledb.OBJECT},
              function (err, result) {
                  db.close();
                  next(null, result.rows[0].SUM);
              });
          }
      ], function(err, result) {
          callback(err, result);
      });
  },

	// 판매 조회
  sales_lookup: function(callback) {
    async.waterfall([
      connect_db,
      function(db, next) {
        db.execute(
          'SELECT * ' +
          'FROM SELLING ' +
					'ORDER BY SELLING_DATE',
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

	//물품_판매 조회
	selling_item_lookup: function(options, callback) {
		var code = options.SELLING_CODE;
		async.waterfall([
      connect_db,
      function(db, next) {
        db.execute(
          'SELECT S.SELLING_ITEM_COUNT,I.ITEM_NAME, I.ITEM_PRICE ' +
          'FROM SELLING_ITEM S, ITEM I ' +
					'WHERE S.ITEM_CODE = I.ITEM_CODE ' +
					'AND S.SELLING_CODE = :code',
          [code],
          { outFormat: oracledb.OBJECT },
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
										'SELECT CUSTOMER_CODE ' +
										'FROM CUSTOMER ' +
										'ORDER BY CUSTOMER_CODE',
                    [],
                    { outFormat: oracledb.OBJECT },
                    function(err, result) {
                        var last_code;
                        if (result.rows.length == 0) {
                            last_code = 'CT0';
                        } else {
                            last_code = result.rows[result.rows.length - 1].CUSTOMER_CODE;
                        }
												var new_code = (parseInt(last_code.replace('CT', ''), 10) + 1).toString();
												var length = new_code.length;
												for (var i = 0; i < (4 - length); i++) {
													new_code = '0' + new_code;
												}
												new_code = 'CT' + new_code;
                        db.close();
                        next(err, new_code);
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
                        next(err, result.rows);
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
                        next(err, result.rows);
                    });
            }
        ], function(err, result) {
            callback(err, result);
        });
    },

    customer_modify_mileage: function(options, callback) {
        async.waterfall([
            connect_db,
            function(db, next) {
                db.execute(
                    'UPDATE CUSTOMER ' +
                    'SET CUSTOMER_MILEAGE = :mileage ' +
                    'WHERE CUSTOMER_CODE = :customer_code',
                    [options.mileage, options.customer_code],
                    {
                        outFormat: oracledb.OBJECT,
                        autoCommit: true
                    },
                    function(err, result) {
                        if (err) {
                            console.log(err);
                        }
                        db.close();
                        next(err, result.rows);
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
                        next(err, result.rows);
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
              'FROM ITEM, ITEM_COUNT ' +
			  'WHERE ITEM.ITEM_CODE = ITEM_COUNT.ITEM_CODE ' +
              'AND ITEM.ITEM_CODE = (:item_code)',
              [code],
              { outFormat: oracledb.OBJECT },
            function(err, result) {
              	if (err) {
              		console.log(err);
				}
              db.close();
              next(err, result.rows);
            });
          },
		  function(result, _callback) {
              	var obj = result[0];
				if (!obj || obj.ITEM_EXPIRATION_DATE == 0) {
                    _callback("no_stock");
				} else {
                    var temp_date = result[0].ITEM_EXPIRATION_DATE;
                    async.map(result, function (item, _next) {
                        if (item.ITEM_EXPIRATION_DATE < temp_date) {
                            temp_date = item.ITEM_EXPIRATION_DATE;
                            obj = item;
                        }
                        _next();
                    }, function () {
                        _callback(null, obj);
                    });
                }
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
                        next(err, result.rows);
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
                    'ITEM_CLASSIFICATION = :item_classification ' +
                    'WHERE ITEM_CODE = :item_code',
                    [options.item_barcode, options.item_name, options.item_price, options.item_classification, options.item_code],
                    {
                        outFormat: oracledb.OBJECT,
                        autoCommit: true
                    },
                    function(err, result) {
                        if (err) {
                            console.log(err);
                        }
                        db.close();
                        next(err, result.rows);
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
                        next(err, result.rows);
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
                    "INSERT INTO ITEM (ITEM_CODE, ITEM_BARCODE, ITEM_NAME, ITEM_PRICE, ITEM_CLASSIFICATION) " +
                    "VALUES (:item_code, :item_barcode, :item_name, :item_price, :item_classification)",
                    [options.item_code, options.item_barcode, options.item_name, options.item_price, options.item_classification],
                    {
                        outFormat: oracledb.OBJECT,
                        autoCommit: true
                    },
                    function(err, result) {
                        if (err) {
                            console.log(err);
                        }
                        db.close();
                        next(err, result);
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
										'SELECT ITEM_CODE ' +
										'FROM ITEM ' +
										'ORDER BY ITEM_CODE',
										[],
										{ outFormat: oracledb.OBJECT },
										function(err, result) {
                        var last_code;
                        if (result.rows.length == 0) {
                            last_code = 'IT0';
                        } else {
                            last_code = result.rows[result.rows.length - 1].ITEM_CODE;
                        }
												var new_code = (parseInt(last_code.replace('IT', ''), 10) + 1).toString();
												var length = new_code.length;
												for (var i = 0; i < (4 - length); i++) {
													new_code = '0' + new_code;
												}
												new_code = 'IT' + new_code;
												db.close();
												next(err, new_code);
										});
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
                  next(err, result.rows);
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
                        next(err, result.rows);
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
                        next(err, result.rows);
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
                        next(err, result.rows);
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
						'SELECT SELLING_CODE ' +
						'FROM SELLING ' +
						'ORDER BY SELLING_CODE',
						[],
						{ outFormat: oracledb.OBJECT },
						function(err, result) {
                var last_code;
                if (result.rows.length == 0) {
                    last_code = 'SL0';
                } else {
                    last_code = result.rows[result.rows.length - 1].SELLING_CODE;
                }
								var new_code = (parseInt(last_code.replace('SL', ''), 10) + 1).toString();
								var length = new_code.length;
								for (var i = 0; i < (4 - length); i++) {
									new_code = '0' + new_code;
								}
								new_code = 'SL' + new_code;
								db.close();
								next(err, new_code);
						});
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
                        next(err, result);
                    });
            }], function(err, result) {
                callback(err, result);
            });
    },

	//selling_code를 받아서 selling_item 등록
	selling_item_enroll: function(options, callback) {
        var selling_item_object = options.selling_item_object;
        var selling_item_ex_date = options.selling_item_ex_date;
		async.waterfall([
			connect_db,
            function(db, next) {
		        async.forEachOf(selling_item_object, function(value, key, _callback) {
		        	var ex_date = selling_item_ex_date[key];
		        	async.waterfall([
		        		function(_next) {
                            db.execute(
                                "INSERT INTO SELLING_ITEM(SELLING_CODE, ITEM_CODE, SELLING_ITEM_COUNT, ITEM_EXPIRATION_DATE) " +
                                "VALUES(:selling_code, :item_code, :selling_item_count, :item_ex_date)",
                                [options.selling_code, key, value, ex_date],
                                {
                                    outFormat: oracledb.OBJECT,
                                    autoCommit: true
                                }, function(err, result) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    _next(err);
                                });
						},
						function(_next) {
                            db.execute(
                                "SELECT DISPLAY_COUNT " +
								"FROM ITEM_COUNT " +
                                "WHERE ITEM_CODE=:it_code AND ITEM_EXPIRATION_DATE=:ex_date",
                                [key, ex_date],
                                {
                                    outFormat: oracledb.OBJECT
                                }, function(err, result) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    _next(err, result.rows[0]);
                                });
						},
						function(now_count, _next) {
		        			var new_count = parseInt(now_count.DISPLAY_COUNT) - parseInt(value);

                            db.execute(
                                "UPDATE ITEM_COUNT " +
                                "SET DISPLAY_COUNT=:d_count " +
                                "WHERE ITEM_CODE=:it_code AND ITEM_EXPIRATION_DATE=:ex_date",
                                [new_count, key, ex_date],
                                {
                                    outFormat: oracledb.OBJECT
                                }, function(err) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    _next(err);
                                });
						}
					], function(err) {
                        _callback(err);
					});
                }, function(err) {
		            if (err) {
		                console.log(err);
                    }
                    db.close();
                    next(err);
                });
            }
        ], function(err) {
		    callback(err, true);
        });
	},

    selling_lookup_sum: function(options, callback) {
        async.waterfall([
            connect_db,
            function(db, next) {
                db.execute(
                    "SELECT SUM(SELLING_PRICE) AS SUM " +
                    "FROM SELLING " +
                    "WHERE SELLING_DATE BETWEEN (:BEFORE_DATE) AND (:CURRENT_DATE)",
                    [options.before_date, options.current_date],
                    {
                        outFormat: oracledb.OBJECT
                    },
                    function(err, result) {
                        if (err) {
                            console.log(err);
                        }
                        db.close();
                        next(err, result.rows[0].SUM);
                    });
            }], function(err, result) {
            callback(err, result);
        });
    },

    /* 이벤트관련 */
    event_count: function(callback) {
        async.waterfall([
            connect_db,
            function(db,next) {
								db.execute(
										'SELECT EVENT_CODE ' +
										'FROM EVENT ' +
										'ORDER BY EVENT_CODE',
										[],
										{ outFormat: oracledb.OBJECT },
										function(err, result) {
                        var last_code;
                        if (result.rows.length == 0) {
                            last_code = 'EV0';
                        } else {
                            last_code = result.rows[result.rows.length - 1].EVENT_CODE;
                        }
												var new_code = (parseInt(last_code.replace('EV', ''), 10) + 1).toString();
												var length = new_code.length;
												for (var i = 0; i < (4 - length); i++) {
													new_code = '0' + new_code;
												}
												new_code = 'EV' + new_code;
												db.close();
												next(err, new_code);
										});
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
                        next(err, result);
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
                    next(err);
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
                        next(err, result.rows);
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
                        next(err, result.rows);
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
                        next(err, result.rows);
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
                        next(err, result.rows);
                    });
            }
        ], function(err, result) {
            callback(err, result);
        });
    },

    event_item_lookup_item_code: function(options, callback) {
        async.waterfall([
            connect_db,
            function(db, next) {
                db.execute(
                    'SELECT EVENT_INFO FROM ITEM_EVENT ' +
                    'WHERE ITEM_CODE = (:item_code)',
                    [options.item_code],
                    { outFormat: oracledb.OBJECT },
                    function(err, result) {
                        if (err) {
                            console.log(err);
                        }
                        db.close();
                        next(err, result.rows);
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
                        next(err, result.rows);
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
                        next(err, result.rows);
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
                        next(err, result.rows);
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
										'SELECT EXCEPT_ITEM_CODE ' +
										'FROM EXCEPT_ITEM ' +
										'ORDER BY EXCEPT_ITEM_CODE',
										[],
										{ outFormat: oracledb.OBJECT },
										function(err, result) {
                        var last_code;
                        if (result.rows.length == 0) {
                            last_code = 'EC0';
                        } else {
                            last_code = result.rows[result.rows.length - 1].EXCEPT_ITEM_CODE;
                        }
												var new_code = (parseInt(last_code.replace('EC', ''), 10) + 1).toString();
												var length = new_code.length;
												for (var i = 0; i < (4 - length); i++) {
													new_code = '0' + new_code;
												}
												new_code = 'EC' + new_code;
												db.close();
												next(err, new_code);
										});
            }
        ], function(err, item_code) {
            callback(err, item_code);
        });
    },

    exception_lookup_all: function(options, callback) {
        async.waterfall([
            connect_db,
            function(db, next) {
                db.execute(
                    'SELECT * ' +
                    'FROM EXCEPT_ITEM, EXCEPT_TYPE ' +
					'WHERE EXCEPT_ITEM.EXCEPT_TYPE_CODE = EXCEPT_TYPE.EXCEPT_TYPE_CODE',
                    [],
                    { outFormat: oracledb.OBJECT },
                    function(err, result) {
                        if (err) {
                            console.log(err);
                        }
                        db.close();
                        next(err, result.rows);
                    });
            }
        ], function(err, result) {
            callback(err, result);
        });
    },

    exception_delete: function(options, callback) {
        async.waterfall([
            connect_db,
            function(db, next) {
                db.execute(
                    'DELETE FROM EXCEPT_ITEM ' +
                    'WHERE EXCEPT_ITEM_CODE = :except_item_code',
                    [options.except_item_code],
                    {
                        outFormat: oracledb.OBJECT,
                        autoCommit: true
                    },
                    function(err, result) {
                        if (err) {
                            console.log(err);
                        }
                        db.close();
                        next(err, result.rows);
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
									"SELECT SERVICE_CODE FROM SERVICE " +
									"ORDER BY SERVICE_CODE",
									[],
									{ outFormat: oracledb.OBJECT },
									function(err, result) {
                      var last_code;
                      if (result.rows.length == 0) {
                          last_code = 'SV0';
                      } else {
                          last_code = result.rows[result.rows.length - 1].SERVICE_CODE;
                      }
											console.log('111111111111');
											console.log(last_code);
											var new_code = (parseInt(last_code.replace('SV', ''), 10) + 1).toString();
											var length = new_code.length;
											for (var i = 0; i < (4 - length); i++) {
												new_code = '0' + new_code;
											}
											new_code = 'SV' + new_code;
											db.close();
											next(null, new_code);
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
		},
    /* 지점 정보 조회 */
    branch_get_info: function(options, callback) {
        async.waterfall([
            connect_db,
            function(db, next) {
                db.execute(
                    'SELECT * FROM BRANCH ' +
                    'WHERE BRANCH_CODE = :BRANCH_CODE' ,
                    [options.branch_code],
                    {
                        outFormat: oracledb.OBJECT
                    },
                    function(err, result) {
                        if (err) {
                            console.log(err);
                        }
                        db.close();
                        next(err, result.rows);
                    });
            }
        ], function(err, result) {
            callback(err, result);
        });
    },

    /* 지불 */

    payment_count: function(callback) {
        async.waterfall([
            connect_db,
            function(db, next) {
                db.execute(
                    'SELECT PAYMENT_CODE ' +
                    'FROM PAYMENT ' +
                    'ORDER BY PAYMENT_CODE',
                    [],
                    { outFormat: oracledb.OBJECT },
                    function(err, result) {
                        var last_code;
                        if (result.rows.length == 0) {
                            last_code = 'PY0';
                        } else {
                            last_code = result.rows[result.rows.length - 1].PAYMENT_CODE;
                        }
												var new_code = (parseInt(last_code.replace('PY', ''), 10) + 1).toString();
												var length = new_code.length;
												for (var i = 0; i < (4 - length); i++) {
													new_code = '0' + new_code;
												}
												new_code = 'PY' + new_code;
                        db.close();
                        next(err, payment_code);
                    });
            }
        ], function(err, payment_code) {
            callback(err, payment_code);
        });
    },

    payment_enroll: function(options, callback) {
        async.waterfall([
            connect_db,
            function(db, next) {
                db.execute(
                    "INSERT INTO PAYMENT (PAYMENT_CODE, BRANCH_CODE, PAYMENT_PRICE, PAYMENT_DATE) " +
                    "VALUES (:payment_code, :branch_code, :payment_price, :payment_date)",
                    [options.payment_code, options.branch_code, options.payment_price, options.payment_date],
                    {
                        outFormat: oracledb.OBJECT,
                        autoCommit: true
                    },
                    function(err, result) {
                        if (err) {
                            console.log(err);
                        }
                        db.close();
                        next(err, result.rows);
                    });
            }
        ], function(err, result) {
            callback(err, result);
        });
    },

		stock_get: function(callback) {
			async.waterfall([
					connect_db,
					function(db, next) {
							db.execute(
								'SELECT I.ITEM_CODE, I.ITEM_NAME, I.ITEM_CLASSIFICATION, C.WAREHOUSE, C.DISPLAY ' +
								'FROM ITEM I, (SELECT ITEM_CODE, SUM(WAREHOUSE_COUNT) WAREHOUSE, SUM(DISPLAY_COUNT) DISPLAY FROM ITEM_COUNT GROUP BY ITEM_CODE) C ' +
								'WHERE I.ITEM_CODE=C.ITEM_CODE ' +
								'ORDER BY I.ITEM_CODE',
									[],
									{ outFormat: oracledb.OBJECT },
									function(err, result) {
											db.close();
											next(err, result.rows);
									});
					}
			], function(err, result) {
					callback(err, result);
			});
		},

		stock_get_all: function(callback) {
			async.waterfall([
					connect_db,
					function(db, next) {
							db.execute(
								'SELECT * ' +
								'FROM ITEM I, ITEM_COUNT C ' +
								'WHERE I.ITEM_CODE=C.ITEM_CODE ' +
								'ORDER BY I.ITEM_CODE',
									[],
									{ outFormat: oracledb.OBJECT },
									function(err, result) {
											db.close();
											next(err, result.rows);
									});
					}
			], function(err, result) {
					callback(err, result);
			});
		},

		stock_change: function(options, callback) {
			async.waterfall([
					connect_db,
					function(db, next) {
							db.execute(
									'UPDATE ITEM_COUNT ' +
									'SET WAREHOUSE_COUNT = :w_count, ' +
									'DISPLAY_COUNT = :d_count ' +
									'WHERE ITEM_CODE = :it_code AND ITEM_EXPIRATION_DATE = :it_expiration_date',
									[options.warehouse_count, options.display_count, options.item_code, options.item_expiration_date],
									{
											outFormat: oracledb.OBJECT,
											autoCommit: true
									},
									function(err) {
											if (err) {
													console.log(err);
											}
											db.close();
											next(err);
									});
					}
			], function(err) {
					callback(err);
			});
		}
};
