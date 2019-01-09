"use strict";

const crossroads = require('crossroads');

class Router {
    constructor() {
        this.router = crossroads.create();

        // TODO: make better
        this.router.bypassed.add(console.log, console);
    }

    exec() {
        this.router.parse(document.location.pathname + document.location.search);
    }

    go(key) {
        window.history.go(key);
    }

    forward() {
        window.history.forward();
    }

    back() {
        window.history.back();
    }

    navigate(path) {
        window.location.assign(path);
    }

    redirect(path) {
        window.location.replace(path);
    }

    add(path, callback, priority = 0) {
        const route = this.router.addRoute(path, callback, priority);

        // TODO: make this better
        route.switched.add(console.log, console);

        return route;
    }

    removeRoute(route) {
        return this.route.removeRoute(route);
    }

    removeAllRoutes() {
        return this.router.removeAllRoutes();
    }
}

module.exports = Router;