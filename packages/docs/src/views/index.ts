const Router = require('parcel-prototyper').Router;
const router = new Router();

router.add('/index.html', function() {
    router.navigate('/test.html');
});

router.exec();