var express = require('express');
var router = express.Router();
var features = require('./features.js');

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
router.get('/customer/delete', check_session, function(req, res, next) {
    res.render('customer/delete.html');
});

router.get('/customer/enroll', function(req, res, next) {
    res.render('customer/enroll.html');
});

router.get('/customer/lookup', function(req, res, next) {
    res.render('customer/lookup.html');
});

router.get('/customer/modify', function(req, res, next) {
    res.render('customer/modify.html');
});

// employee
router.get('/employee/admin', function(req, res, next) {
    res.render('employee/admin.html');
});

router.get('/employee/lookup', function(req, res, next) {
    res.render('employee/lookup.html');
});

router.get('/employee/timetable', function(req, res, next) {
    res.render('employee/timetable.html');
});

// entry_goods
router.get('/entry-goods/inspection', function(req, res, next) {
    res.render('entry_goods/inspection.html');
});

router.get('/entry-goods/lookup', function(req, res, next) {
    res.render('entry_goods/lookup.html');
});

// event
router.get('/event/delete', function(req, res, next) {
    res.render('event/delete.html');
});

router.get('/event/enroll', function(req, res, next) {
    res.render('event/enroll.html');
});

router.get('/event/lookup', function(req, res, next) {
    res.render('event/lookup.html');
});

router.get('/event/modify', function(req, res, next) {
    res.render('event/modify.html');
});

// excetion_goods
router.get('/exception-goods/delete', function(req, res, next) {
    res.render('exception_goods/delete.html');
});

router.get('/exception-goods/enroll', function(req, res, next) {
    res.render('exception_goods/enroll.html');
});

router.get('/exception-goods/lookup', function(req, res, next) {
    res.render('exception_goods/lookup.html');
});

router.get('/exception-goods/modify', function(req, res, next) {
    res.render('exception_goods/modify.html');
});

// exclusive_product
router.get('/exclusive-product/delete', function(req, res, next) {
    res.render('exclusive-product/delete.html');
});

router.get('/exclusive-product/enroll', function(req, res, next) {
    res.render('exclusive-product/enroll.html');
});

router.get('/exclusive-product/lookup', function(req, res, next) {
    res.render('exclusive-product/lookup.html');
});

// goods
router.get('/goods/enroll', function(req, res, next) {
    res.render('goods/enroll.html');
});

router.get('/goods/lookup', function(req, res, next) {
    res.render('goods/lookup.html');
});

router.get('/goods/modify', function(req, res, next) {
    res.render('goods/modify.html');
});

//living_services
router.get('/living-services/delete', function(req, res, next) {
    res.render('living_services/delete.html');
});

router.get('/living-services/enroll', function(req, res, next) {
    res.render('living_services/enroll.html');
});

router.get('/living-services/lookup', function(req, res, next) {
    res.render('living_services/lookup.html');
});

//order
router.get('/order/enroll', function(req, res, next) {
    res.render('order/enroll.html');
});

router.get('/order/lookup', function(req, res, next) {
    res.render('order/lookup.html');
});

// payment
router.get('/payment/payment', function(req, res, next) {
    res.render('payment/payment.html');
});

//sales
router.get('/sales/enroll', function(req, res, next) {
    res.render('sales/enroll.html');
});

router.get('/sales/lookup', function(req, res, next) {
    res.render('sales/lookup.html');
});

// stock
router.get('/stock/lookup', function(req, res, next) {
    res.render('sales/lookup.html');
});

router.get('/stock/modify', function(req, res, next) {
    res.render('sales/modify.html');
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
  console.log('post selling enroll !@#!@@@@@@@@@@@@@@@2');
  console.log(req.body)
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

/*
  item 물품 관련
*/
router.post('/item/lookup', function(req,res) {
  features.item.lookup(req.body, function(result) {
    features.branch_item.lookup(req.body, function(mileage_result) {
      result.mileage_data = mileage_result.data;
      res.json(result);
    });
  });
});

router.post('/item/enroll',function(req,res) {
  features.item.enroll(req.body, function(result) {
      res.json(result);
  });
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
