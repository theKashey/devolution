var devolutionBundle = 'esm';!function(){return function r(n,e,t){function o(i,f){if(!e[i]){if(!n[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=e[i]={exports:{}};n[i][0].call(p.exports,function(r){return o(n[i][1][r]||r)},p,p.exports,r,n,e,t)}return e[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}}()({1:[function(r,n,e){},{}]},{},[1]);class SmokeTester {
  classField = () => 42;

  constructor() {
    this.magic = 42;
    // import('./detector')
  }
}