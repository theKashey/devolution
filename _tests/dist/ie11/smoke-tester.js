var devolutionBundle = 'ie11';!function(){return function r(n,e,t){function o(i,f){if(!e[i]){if(!n[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=e[i]={exports:{}};n[i][0].call(p.exports,function(r){return o(n[i][1][r]||r)},p,p.exports,r,n,e,t)}return e[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}}()({1:[function(r,n,e){},{}]},{},[1]);function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError('Cannot call a class as a function');
    }
}
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
var SmokeTester = function SmokeTester() {
    _classCallCheck(this, SmokeTester);
    _defineProperty(this, 'classField', function() {
        return 42;
    });
    this.magic = 42;
};
