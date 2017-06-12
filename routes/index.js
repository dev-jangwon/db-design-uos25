var express = require('express');
var router = express.Router();
var features = require('./features.js');

var check_session = function(req, res, next) {
  var session = req.session;
  var url = new Buffer(req.protocol + '://' + req.get('host') + req.originalUrl).toString('base64');
  var no_session = new Buffer('no_session').toString('base64');

  // if (session.user_data) {
  //   next();
  // } else {
  //   res.redirect('/login?q=' + url + '&o=' + no_session);
  // }
  next();
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

  if (session.user_data) {
    user_data = session.user_data;
  }
  res.render('employee/admin.html', {
    session: user_data ? true : false,
    user_data: JSON.stringify(user_data || {})
  });
});

router.get('/employee/lookup', check_session, function(req, res, next) {
  var session = req.session;
  var user_data = null;

  if (session.user_data) {
    user_data = session.user_data;
  }
  res.render('employee/lookup.html', {
    session: user_data ? true : false,
    user_data: JSON.stringify(user_data || {})
  });
});

router.get('/employee/timetable', check_session, function(req, res, next) {
  var session = req.session;
  var user_data = null;

  if (session.user_data) {
    user_data = session.user_data;
  }
  res.render('employee/timetable.html', {
    session: user_data ? true : false,
    user_data: JSON.stringify(user_data || {})
  });
});

// entry_goods
router.get('/entry-goods/inspection', check_session, function(req, res, next) {
  var session = req.session;
  var user_data = null;

  if (session.user_data) {
    user_data = session.user_data;
  }
  res.render('entry_goods/inspection.html', {
    session: user_data ? true : false,
    user_data: JSON.stringify(user_data || {})
  });
});

router.get('/entry-goods/lookup', check_session, function(req, res, next) {
  var session = req.session;
  var user_data = null;

  if (session.user_data) {
    user_data = session.user_data;
  }
  res.render('entry_goods/lookup.html', {
    session: user_data ? true : false,
    user_data: JSON.stringify(user_data || {})
  });
});

// event
router.get('/event/delete', check_session, function(req, res, next) {
  var session = req.session;
  var user_data = null;

  if (session.user_data) {
    user_data = session.user_data;
  }
  res.render('event/delete.html', {
    session: user_data ? true : false,
    user_data: JSON.stringify(user_data || {})
  });
});

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

router.get('/event/modify', check_session, function(req, res, next) {
  var session = req.session;
  var user_data = null;

  if (session.user_data) {
    user_data = session.user_data;
  }
  res.render('event/modify.html', {
    session: user_data ? true : false,
    user_data: JSON.stringify(user_data || {})
  });
});

// excetion_goods
router.get('/exception-goods/delete', check_session, function(req, res, next) {
  var session = req.session;
  var user_data = null;

  if (session.user_data) {
    user_data = session.user_data;
  }
  res.render('exception_goods/delete.html', {
    session: user_data ? true : false,
    user_data: JSON.stringify(user_data || {})
  });
});

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

router.get('/exception-goods/modify', check_session, function(req, res, next) {
  var session = req.session;
  var user_data = null;

  if (session.user_data) {
    user_data = session.user_data;
  }
  res.render('exception_goods/modify.html', {
    session: user_data ? true : false,
    user_data: JSON.stringify(user_data || {})
  });
});

// exclusive_product
router.get('/exclusive-product/delete', check_session, function(req, res, next) {
  var session = req.session;
  var user_data = null;

  if (session.user_data) {
    user_data = session.user_data;
  }
  res.render('exclusive_product/delete.html', {
    session: user_data ? true : false,
    user_data: JSON.stringify(user_data || {})
  });
});

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

router.get('/exclusive-product/lookup', check_session, function(req, res, next) {
  var session = req.session;
  var user_data = null;

  if (session.user_data) {
    user_data = session.user_data;
  }
  res.render('exclusive_product/lookup.html', {
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

//living_services
router.get('/living-services/delete', check_session, function(req, res, next) {
  var session = req.session;
  var user_data = null;

  if (session.user_data) {
    user_data = session.user_data;
  }
  res.render('living_services/delete.html', {
    session: user_data ? true : false,
    user_data: JSON.stringify(user_data || {})
  });
});

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

//order
router.get('/order/enroll', check_session, function(req, res, next) {
  var session = req.session;
  var user_data = null;

  if (session.user_data) {
    user_data = session.user_data;
  }
  res.render('order/enroll.html', {
    session: user_data ? true : false,
    user_data: JSON.stringify(user_data || {})
  });
});

router.get('/order/lookup', check_session, function(req, res, next) {
  var session = req.session;
  var user_data = null;

  if (session.user_data) {
    user_data = session.user_data;
  }
  res.render('order/lookup.html', {
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
router.get('/stock/lookup', check_session, function(req, res, next) {
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

router.get('/stock/modify', check_session, function(req, res, next) {
  var session = req.session;
  var user_data = null;

  if (session.user_data) {
    user_data = session.user_data;
  }
  res.render('sales/modify.html', {
    session: user_data ? true : false,
    user_data: JSON.stringify(user_data || {})
  });
});


// REST API

/*
  sales 판매 관련
*/
router.post('/sales/lookup', function(req, res) {
  features.sales.lookup(function(result) {
    res.json(result);
  });
});

router.post('/signin', function(req, res) {
  features.signin(req, function(result) {
    res.json(result);
  });
});

router.post('/signout', check_session, function(req, res) {
  req.session.destroy(function() {
    res.json({});
  })
});

router.post('/selling/enroll', function(req,res) {
  features.selling.enroll(req.body, function(result) {
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

/*
  item 물품 관련
*/
router.post('/item/lookup', function(req, res) {
  features.item.lookup(req.body, function(result) {
    features.branch_item.lookup(req.body, function(mileage_result) {
      result.mileage_data = mileage_result.data;
      res.json(result);
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

router.post('item/modify', function(req, res) {
  features.item.modify(req.body, function(result) {
    res.json(result);
  })
});

router.post('item/delete', function(req, res) {
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

module.exports = router;
