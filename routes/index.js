var express = require('express');
var router = express.Router();
var features = require('./features.js');
var fs = require('fs');

var check_session = function(req, res, next) {
  var session = req.session;
  var url = new Buffer(req.protocol + '://' + req.get('host') + req.originalUrl).toString('base64');
  var no_session = new Buffer('no_session').toString('base64');

  if (session.user_data) {
    next();
  } else {
    res.redirect('/login?q=' + url + '&o=' + no_session);
  }
};
/* GET home page. */
router.get('/', function(req, res, next) {
  var session = req.session;
  var user_data = null;

  if (session.user_data) {
    user_data = session.user_data;
  }

  res.render('index.html', {
    session: user_data ? true : false,
    user_data: JSON.stringify(user_data || {})
  });
});

// login
router.get('/login', function(req, res, next) {
  var query = req.query || {};
  var no_session = query.o || '';
  var back_url = query.q || '';

  if (no_session) {
    no_session = new Buffer(no_session, 'base64').toString('ascii');
  }
  if (back_url) {
    back_url = new Buffer(back_url, 'base64').toString('ascii');
  }

  res.render('login.html', {
    no_session: no_session,
    back_url: back_url
  });
});

// customer
router.get('/customer/enroll', check_session, function(req, res, next) {
  var session = req.session;
  var user_data = null;

  if (session.user_data) {
    user_data = session.user_data;
  }
  res.render('customer/enroll.html', {
    session: user_data ? true : false,
    user_data: JSON.stringify(user_data || {})
  });
});

router.get('/customer/lookup', check_session, function(req, res, next) {
  var session = req.session;
  var user_data = null;

  if (session.user_data) {
    user_data = session.user_data;
  }
  res.render('customer/lookup.html', {
    session: user_data ? true : false,
    user_data: JSON.stringify(user_data || {})
  });
});

// employee
router.get('/employee/admin', check_session, function(req, res, next) {
  var session = req.session;
  var user_data = null;
  var is_admin = false;

  if (session.user_data) {
    user_data = session.user_data;
    is_admin = session.user_data.EMPLOYEE_RANK == 'master' ? true : false;
  }

  res.render('employee/admin.html', {
    session: user_data ? true : false,
    user_data: JSON.stringify(user_data || {})
  });

  // if (is_admin) {
  //   res.render('employee/admin.html', {
  //     session: user_data ? true : false,
  //     user_data: JSON.stringify(user_data || {})
  //   });
  // } else {
  //   var url = new Buffer(req.protocol + '://' + req.get('host') + req.originalUrl).toString('base64');
  //   var no_session = new Buffer('no_session').toString('base64');
  //
  //   res.redirect('/login?q=' + url + '&o=' + no_session);
  // }
});

// entry and order
router.get('/entry-order/management', check_session, function(req, res, next) {
  var session = req.session;
  var user_data = null;

  if (session.user_data) {
    user_data = session.user_data;
  }
  res.render('entry_goods/management.html', {
    session: user_data ? true : false,
    user_data: JSON.stringify(user_data || {})
  });
});

// event
router.get('/event/enroll', check_session, function(req, res, next) {
  var session = req.session;
  var user_data = null;

  if (session.user_data) {
    user_data = session.user_data;
  }
  res.render('event/enroll.html', {
    session: user_data ? true : false,
    user_data: JSON.stringify(user_data || {})
  });
});

router.get('/event/lookup', check_session, function(req, res, next) {
  var session = req.session;
  var user_data = null;

  if (session.user_data) {
    user_data = session.user_data;
  }
  res.render('event/lookup.html', {
    session: user_data ? true : false,
    user_data: JSON.stringify(user_data || {})
  });
});

// excetion_goods
router.get('/exception-goods/enroll', check_session, function(req, res, next) {
  var session = req.session;
  var user_data = null;

  if (session.user_data) {
    user_data = session.user_data;
  }
  res.render('exception_goods/enroll.html', {
    session: user_data ? true : false,
    user_data: JSON.stringify(user_data || {})
  });
});

router.get('/exception-goods/lookup', check_session, function(req, res, next) {
  var session = req.session;
  var user_data = null;

  if (session.user_data) {
    user_data = session.user_data;
  }
  res.render('exception_goods/lookup.html', {
    session: user_data ? true : false,
    user_data: JSON.stringify(user_data || {})
  });
});

// exclusive_product
router.get('/exclusive-product/enroll', check_session, function(req, res, next) {
  var session = req.session;
  var user_data = null;

  if (session.user_data) {
    user_data = session.user_data;
  }
  res.render('exclusive_product/enroll.html', {
    session: user_data ? true : false,
    user_data: JSON.stringify(user_data || {})
  });
});

// goods
router.get('/goods/enroll', check_session, function(req, res, next) {
  var session = req.session;
  var user_data = null;

  if (session.user_data) {
    user_data = session.user_data;
  }
  res.render('goods/enroll.html', {
    session: user_data ? true : false,
    user_data: JSON.stringify(user_data || {})
  });
});

router.get('/goods/lookup', check_session, function(req, res, next) {
  var session = req.session;
  var user_data = null;

  if (session.user_data) {
    user_data = session.user_data;
  }
  res.render('goods/lookup.html', {
    session: user_data ? true : false,
    user_data: JSON.stringify(user_data || {})
  });
});
//
// //living_services

router.get('/living-services/enroll', check_session, function(req, res, next) {
  var session = req.session;
  var user_data = null;

  if (session.user_data) {
    user_data = session.user_data;
  }
  res.render('living_services/enroll.html', {
    session: user_data ? true : false,
    user_data: JSON.stringify(user_data || {})
  });
});

router.get('/living-services/lookup', check_session, function(req, res, next) {
  var session = req.session;
  var user_data = null;

  if (session.user_data) {
    user_data = session.user_data;
  }
  res.render('living_services/lookup.html', {
    session: user_data ? true : false,
    user_data: JSON.stringify(user_data || {})
  });
});

// payment
router.get('/payment/payment', check_session, function(req, res, next) {
  var session = req.session;
  var user_data = null;

  if (session.user_data) {
    user_data = session.user_data;
  }
  res.render('payment/payment.html', {
    session: user_data ? true : false,
    user_data: JSON.stringify(user_data || {})
  });
});

//sales
router.get('/sales/enroll', check_session, function(req, res, next) {
  var session = req.session;
  var user_data = null;

  if (session.user_data) {
    user_data = session.user_data;
  }
  res.render('sales/enroll.html', {
    session: user_data ? true : false,
    user_data: JSON.stringify(user_data || {})
  });
});

router.get('/sales/lookup', check_session, function(req, res, next) {
  var session = req.session;
  var user_data = null;

  if (session.user_data) {
    user_data = session.user_data;
  }
  res.render('sales/lookup.html', {
    session: user_data ? true : false,
    user_data: JSON.stringify(user_data || {})
  });
});

// stock
router.get('/stock/management', check_session, function(req, res, next) {
  var session = req.session;
  var user_data = null;

  if (session.user_data) {
    user_data = session.user_data;
  }
  res.render('stock/management.html', {
    session: user_data ? true : false,
    user_data: JSON.stringify(user_data || {})
  });
});


// REST API

/*
  로그인/로그아웃
*/

router.post('/signin', function(req, res) {
  features.signin(req, function(result) {
    if (req.session.user_data) {
      var id = req.session.user_data.EMPLOYEE_CODE;
      fs.exists(__dirname.replace('/routes', '') + '/public/img/' + id + '.png', function(exists) {
        if (exists) {
          req.session.user_data.img = '/img/' + id + '.png';
        } else {
          req.session.user_data.img = '/img/default-avatar.png';
        }
        res.json(result);
      });
    } else {
      res.json(result);
    }
  });
});

router.post('/signout', check_session, function(req, res) {
  req.session.destroy(function() {
    res.json({});
  })
});

/*
  employee
*/
router.post('/employee/get_info', check_session, function(req, res) {
  var session = req.session || {};
  var user_data = session.user_data;

  if (user_data.EMPLOYEE_RANK != 'master') {
    res.json({
      result: false
    });
  } else {
    features.employee.get_info(req.body, function(result) {
      res.json(result);
    });
  }
});

router.post('/employee/add_applicant', function(req, res) {
  features.employee.add_applicant(req.body, function(result) {
    res.json(result);
  });
});


router.post('/employee/accept', function(req, res) {
  features.employee.accept(req.body, function(result) {
    res.json(result);
  });
});
router.post('/employee/reject', function(req, res) {
  features.employee.reject(req.body, function(result) {
    res.json(result);
  });
});
router.post('/employee/fire', function(req, res) {
  features.employee.fire(req.body, function(result) {
    res.json(result);
  });
});


/*
  request & arrive 주문 및 입고 관련
*/

router.post('/request/get', function(req, res) {
  features.request.get(req.body, function(result) {
    res.json(result);
  });
});

router.post('/request/request_item', function(req, res) {
  features.request.get_item(req.body, function(result) {
    res.json(result);
  });
});

router.post('/request/add', function(req, res) {
  features.request.add(req.body, function(result) {
    res.json(result);
  });
});


router.post('/arrive/get', function(req, res) {
  features.arrive.get(req.body, function(result) {
    res.json(result);
  });
});

router.post('/arrive/arrive_item', function(req, res) {
  features.arrive.get_item(req.body, function(result) {
    res.json(result);
  });
});

router.post('/arrive/confirm', function(req, res) {
  features.arrive.confirm(req.body, function(result) {
    res.json(result);
  });
});

router.post('/arrive/rearrive', function(req, res) {
  features.arrive.rearrive(req.body, function(result) {
    res.json(result);
  });
});


/*
  sales 판매 관련
*/
router.post('/sales/lookup', function(req, res) {
  features.sales.lookup(function(result) {
    res.json(result);
  });
});

router.post('/selling/enroll', function(req,res) {
  features.selling.enroll(req.body, function(result) {
    res.json(result);
  });
});

// sale_item관련
router.post('/selling_item/lookup', function(req,res) {
  features.selling_item.lookup(req.body, function(result) {
    res.json(result);
  });
});


/*
  customer 고객 관련
*/
router.post('/customer/lookup', function(req, res) {
  features.customer.lookup(req.body, function(result) {
      res.json(result);
  });
});

router.get('/customer/lookup/all', function(req, res) {
    features.customer.lookup_all(req.body, function(result) {
        res.json(result);
    });
});

router.post('/customer/enroll', function(req, res) {
    features.customer.enroll(req.body, function(result) {
        res.json(result);
    });
});

router.post('/customer/modify', function(req, res) {
    features.customer.modify(req.body, function(result) {
        res.json(result);
    });
});

router.post('/customer/delete', function(req, res) {
    features.customer.delete(req.body, function(result) {
        res.json(result);
    });
});

/*
  item 물품 관련
*/
router.post('/item/lookup', function(req, res) {
  features.item.lookup(req.body, function(result) {
    features.branch_item.lookup(req.body, function(mileage_result) {
        result.mileage_data = mileage_result.data;
        features.event_item.event_item_lookup_item_code(req.body, function(event_info) {
            result.event_info = event_info;
            res.json(result);
        });
    });
  });
});

router.get('/item/lookup/all', function(req, res) {
    features.item.lookup_all(req.body, function(result) {
      res.json(result);
    });
});

router.post('/item/enroll',function(req,res) {
  features.item.enroll(req.body, function(result) {
      res.json(result);
  });
});

router.post('/item/modify', function(req, res) {
  features.item.modify(req.body, function(result) {
    res.json(result);
  })
});

router.post('/item/delete', function(req, res) {
    features.item.delete(req.body, function(result) {
        res.json(result);
    })
});

/*
  branch_item 전용 상품 관련
*/
router.post('/branch_item/lookup', function(req,res) {
  features.branch_item.lookup(req.body, function(result) {
    res.json(result);
  });
});

router.post('/branch_item/enroll', function(req,res) {
    features.branch_item.enroll(req.body, function(result) {
        res.json(result);
    });
});

router.post('/branch_item/delete', function(req,res) {
    features.branch_item.delete(req.body, function(result) {
        res.json(result);
    });
});

router.post('/branch_item/modify', function(req,res) {
    features.branch_item.modify(req.body, function(result) {
        res.json(result);
    });
});

/*
 이벤트
 */

router.post('/event/enroll', function(req,res) {
    features.event.enroll(req.body, function(result) {
        res.json(result);
    });
});

router.get('/event/lookup/all', function(req, res) {
    features.event.lookup_all(req.body, function(result) {
        res.json(result);
    });
});

/*
 물품 이벤트
 */

router.get('/event/item/lookup', function(req, res) {
    features.event_item.lookup(req.query, function(result) {
        res.json(result);
    });
});

/*
  생활 서비스
*/
router.post('/service/enroll', function(req,res) {
    features.service.enroll(req.body, function(result) {
      res.json(result);
    });
});

router.post('/service/lookup', function (req,res) {
    features.service.lookup(req.body, function(result) {
      res.json(result);
    });
});

router.post('/service/modify', function (req,res) {
    features.service.modify(req.body, function(result) {
      res.json(result);
    });
});

router.post('/service/delete', function (req,res) {
    features.service.delete(req.body, function(result) {


      res.json(result);
    });
});

/*
  행사관련
*/

router.post('/event/item/modify', function(req, res) {
    features.event_item.modify(req.body, function(result) {
        res.json(result);
    });
});

router.post('/event/item/delete', function(req, res) {
    features.event_item.delete(req.body, function(result) {
        res.json(result);
    });
});

/*
 예외물품
 */

router.post('/exception/enroll', function(req, res) {
    features.exception.enroll(req.body, function(result) {
        res.json(result);
    });
});

router.get('/exception/lookup/all', function(req, res) {
    features.exception.lookup_all(req.query, function(result) {
        res.json(result);
    });
});

router.post('/exception/delete', function(req, res) {
    features.exception.delete(req.body, function(result) {
        res.json(result);
    });
});

/*
 지불
 */

router.post('/payment/lookup', function(req, res) {
    features.payment.lookup(req.body, function(result) {
        res.json(result);
    });
});

router.post('/payment/enroll', function(req, res) {
    features.payment.enroll(req.body, function(result) {
        res.json(result);
    });
});


/*
  재고
*/

router.post('/stock/get', function(req, res) {
  features.stock.get(function(result) {
    res.json(result);
  });
});

router.post('/stock/get/all', function(req, res) {
  features.stock.get_all(function(result) {
    res.json(result);
  });
});

router.post('/stock/change', function(req, res) {
  features.stock.change(req.body, function(result) {
    res.json(result);
  });
});

module.exports = router;
