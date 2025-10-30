const tc = require('./controllers/trainingController');
console.log('Training Controller exports:', Object.keys(tc));

const ec = require('./controllers/enrollmentController');
console.log('Enrollment Controller exports:', Object.keys(ec));

const pc = require('./controllers/paymentController');
console.log('Payment Controller exports:', Object.keys(pc));
