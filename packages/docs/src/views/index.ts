const Router = require('parcel-prototyper').Router;
const Database = require('parcel-prototyper').Database;
const router = new Router();
const db = new Database(router);

router.add('/index.html', function() {
    (async() => {
        const email = await db.get('email');
        const input = document.querySelector('input[name=email]');

        if (email == "hello@chrisdmacrae.com") {
            router.navigate('/test.html');
        }
    
        input.setAttribute('value', email);
    })();
})

router.exec();