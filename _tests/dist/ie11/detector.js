var devolutionBundle = 'ie11';!function(){return function t(e,r,n){function o(c,u){if(!r[c]){if(!e[c]){var s="function"==typeof require&&require;if(!u&&s)return s(c,!0);if(i)return i(c,!0);var a=new Error("Cannot find module '"+c+"'");throw a.code="MODULE_NOT_FOUND",a}var f=r[c]={exports:{}};e[c][0].call(f.exports,function(t){return o(e[c][1][t]||t)},f,f.exports,t,e,r,n)}return r[c].exports}for(var i="function"==typeof require&&require,c=0;c<n.length;c++)o(n[c]);return o}}()({1:[function(t,e,r){t("core-js/modules/es6.string.includes"),t("core-js/modules/es7.array.includes"),t("core-js/modules/es6.string.iterator"),t("core-js/modules/es6.array.iterator")},{"core-js/modules/es6.array.iterator":51,"core-js/modules/es6.string.includes":52,"core-js/modules/es6.string.iterator":53,"core-js/modules/es7.array.includes":54}],2:[function(t,e,r){e.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},{}],3:[function(t,e,r){var n=t("./_wks")("unscopables"),o=Array.prototype;null==o[n]&&t("./_hide")(o,n,{}),e.exports=function(t){o[n][t]=!0}},{"./_hide":19,"./_wks":50}],4:[function(t,e,r){var n=t("./_is-object");e.exports=function(t){if(!n(t))throw TypeError(t+" is not an object!");return t}},{"./_is-object":23}],5:[function(t,e,r){var n=t("./_to-iobject"),o=t("./_to-length"),i=t("./_to-absolute-index");e.exports=function(t){return function(e,r,c){var u,s=n(e),a=o(s.length),f=i(c,a);if(t&&r!=r){for(;a>f;)if((u=s[f++])!=u)return!0}else for(;a>f;f++)if((t||f in s)&&s[f]===r)return t||f||0;return!t&&-1}}},{"./_to-absolute-index":43,"./_to-iobject":45,"./_to-length":46}],6:[function(t,e,r){var n={}.toString;e.exports=function(t){return n.call(t).slice(8,-1)}},{}],7:[function(t,e,r){var n=e.exports={version:"2.6.5"};"number"==typeof __e&&(__e=n)},{}],8:[function(t,e,r){var n=t("./_a-function");e.exports=function(t,e,r){if(n(t),void 0===e)return t;switch(r){case 1:return function(r){return t.call(e,r)};case 2:return function(r,n){return t.call(e,r,n)};case 3:return function(r,n,o){return t.call(e,r,n,o)}}return function(){return t.apply(e,arguments)}}},{"./_a-function":2}],9:[function(t,e,r){e.exports=function(t){if(null==t)throw TypeError("Can't call method on  "+t);return t}},{}],10:[function(t,e,r){e.exports=!t("./_fails")(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},{"./_fails":15}],11:[function(t,e,r){var n=t("./_is-object"),o=t("./_global").document,i=n(o)&&n(o.createElement);e.exports=function(t){return i?o.createElement(t):{}}},{"./_global":17,"./_is-object":23}],12:[function(t,e,r){e.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},{}],13:[function(t,e,r){var n=t("./_global"),o=t("./_core"),i=t("./_hide"),c=t("./_redefine"),u=t("./_ctx"),s=function(t,e,r){var a,f,_,p,l=t&s.F,d=t&s.G,h=t&s.S,y=t&s.P,v=t&s.B,b=d?n:h?n[e]||(n[e]={}):(n[e]||{}).prototype,g=d?o:o[e]||(o[e]={}),x=g.prototype||(g.prototype={});for(a in d&&(r=e),r)_=((f=!l&&b&&void 0!==b[a])?b:r)[a],p=v&&f?u(_,n):y&&"function"==typeof _?u(Function.call,_):_,b&&c(b,a,_,t&s.U),g[a]!=_&&i(g,a,p),y&&x[a]!=_&&(x[a]=_)};n.core=o,s.F=1,s.G=2,s.S=4,s.P=8,s.B=16,s.W=32,s.U=64,s.R=128,e.exports=s},{"./_core":7,"./_ctx":8,"./_global":17,"./_hide":19,"./_redefine":37}],14:[function(t,e,r){var n=t("./_wks")("match");e.exports=function(t){var e=/./;try{"/./"[t](e)}catch(r){try{return e[n]=!1,!"/./"[t](e)}catch(t){}}return!0}},{"./_wks":50}],15:[function(t,e,r){e.exports=function(t){try{return!!t()}catch(t){return!0}}},{}],16:[function(t,e,r){e.exports=t("./_shared")("native-function-to-string",Function.toString)},{"./_shared":40}],17:[function(t,e,r){var n=e.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},{}],18:[function(t,e,r){var n={}.hasOwnProperty;e.exports=function(t,e){return n.call(t,e)}},{}],19:[function(t,e,r){var n=t("./_object-dp"),o=t("./_property-desc");e.exports=t("./_descriptors")?function(t,e,r){return n.f(t,e,o(1,r))}:function(t,e,r){return t[e]=r,t}},{"./_descriptors":10,"./_object-dp":31,"./_property-desc":36}],20:[function(t,e,r){var n=t("./_global").document;e.exports=n&&n.documentElement},{"./_global":17}],21:[function(t,e,r){e.exports=!t("./_descriptors")&&!t("./_fails")(function(){return 7!=Object.defineProperty(t("./_dom-create")("div"),"a",{get:function(){return 7}}).a})},{"./_descriptors":10,"./_dom-create":11,"./_fails":15}],22:[function(t,e,r){var n=t("./_cof");e.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==n(t)?t.split(""):Object(t)}},{"./_cof":6}],23:[function(t,e,r){e.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},{}],24:[function(t,e,r){var n=t("./_is-object"),o=t("./_cof"),i=t("./_wks")("match");e.exports=function(t){var e;return n(t)&&(void 0!==(e=t[i])?!!e:"RegExp"==o(t))}},{"./_cof":6,"./_is-object":23,"./_wks":50}],25:[function(t,e,r){"use strict";var n=t("./_object-create"),o=t("./_property-desc"),i=t("./_set-to-string-tag"),c={};t("./_hide")(c,t("./_wks")("iterator"),function(){return this}),e.exports=function(t,e,r){t.prototype=n(c,{next:o(1,r)}),i(t,e+" Iterator")}},{"./_hide":19,"./_object-create":30,"./_property-desc":36,"./_set-to-string-tag":38,"./_wks":50}],26:[function(t,e,r){"use strict";var n=t("./_library"),o=t("./_export"),i=t("./_redefine"),c=t("./_hide"),u=t("./_iterators"),s=t("./_iter-create"),a=t("./_set-to-string-tag"),f=t("./_object-gpo"),_=t("./_wks")("iterator"),p=!([].keys&&"next"in[].keys()),l=function(){return this};e.exports=function(t,e,r,d,h,y,v){s(r,e,d);var b,g,x,j=function(t){if(!p&&t in O)return O[t];switch(t){case"keys":case"values":return function(){return new r(this,t)}}return function(){return new r(this,t)}},m=e+" Iterator",k="values"==h,w=!1,O=t.prototype,S=O[_]||O["@@iterator"]||h&&O[h],P=S||j(h),E=h?k?j("entries"):P:void 0,A="Array"==e&&O.entries||S;if(A&&(x=f(A.call(new t)))!==Object.prototype&&x.next&&(a(x,m,!0),n||"function"==typeof x[_]||c(x,_,l)),k&&S&&"values"!==S.name&&(w=!0,P=function(){return S.call(this)}),n&&!v||!p&&!w&&O[_]||c(O,_,P),u[e]=P,u[m]=l,h)if(b={values:k?P:j("values"),keys:y?P:j("keys"),entries:E},v)for(g in b)g in O||i(O,g,b[g]);else o(o.P+o.F*(p||w),e,b);return b}},{"./_export":13,"./_hide":19,"./_iter-create":25,"./_iterators":28,"./_library":29,"./_object-gpo":33,"./_redefine":37,"./_set-to-string-tag":38,"./_wks":50}],27:[function(t,e,r){e.exports=function(t,e){return{value:e,done:!!t}}},{}],28:[function(t,e,r){e.exports={}},{}],29:[function(t,e,r){e.exports=!1},{}],30:[function(t,e,r){var n=t("./_an-object"),o=t("./_object-dps"),i=t("./_enum-bug-keys"),c=t("./_shared-key")("IE_PROTO"),u=function(){},s=function(){var e,r=t("./_dom-create")("iframe"),n=i.length;for(r.style.display="none",t("./_html").appendChild(r),r.src="javascript:",(e=r.contentWindow.document).open(),e.write("<script>document.F=Object<\/script>"),e.close(),s=e.F;n--;)delete s.prototype[i[n]];return s()};e.exports=Object.create||function(t,e){var r;return null!==t?(u.prototype=n(t),r=new u,u.prototype=null,r[c]=t):r=s(),void 0===e?r:o(r,e)}},{"./_an-object":4,"./_dom-create":11,"./_enum-bug-keys":12,"./_html":20,"./_object-dps":32,"./_shared-key":39}],31:[function(t,e,r){var n=t("./_an-object"),o=t("./_ie8-dom-define"),i=t("./_to-primitive"),c=Object.defineProperty;r.f=t("./_descriptors")?Object.defineProperty:function(t,e,r){if(n(t),e=i(e,!0),n(r),o)try{return c(t,e,r)}catch(t){}if("get"in r||"set"in r)throw TypeError("Accessors not supported!");return"value"in r&&(t[e]=r.value),t}},{"./_an-object":4,"./_descriptors":10,"./_ie8-dom-define":21,"./_to-primitive":48}],32:[function(t,e,r){var n=t("./_object-dp"),o=t("./_an-object"),i=t("./_object-keys");e.exports=t("./_descriptors")?Object.defineProperties:function(t,e){o(t);for(var r,c=i(e),u=c.length,s=0;u>s;)n.f(t,r=c[s++],e[r]);return t}},{"./_an-object":4,"./_descriptors":10,"./_object-dp":31,"./_object-keys":35}],33:[function(t,e,r){var n=t("./_has"),o=t("./_to-object"),i=t("./_shared-key")("IE_PROTO"),c=Object.prototype;e.exports=Object.getPrototypeOf||function(t){return t=o(t),n(t,i)?t[i]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?c:null}},{"./_has":18,"./_shared-key":39,"./_to-object":47}],34:[function(t,e,r){var n=t("./_has"),o=t("./_to-iobject"),i=t("./_array-includes")(!1),c=t("./_shared-key")("IE_PROTO");e.exports=function(t,e){var r,u=o(t),s=0,a=[];for(r in u)r!=c&&n(u,r)&&a.push(r);for(;e.length>s;)n(u,r=e[s++])&&(~i(a,r)||a.push(r));return a}},{"./_array-includes":5,"./_has":18,"./_shared-key":39,"./_to-iobject":45}],35:[function(t,e,r){var n=t("./_object-keys-internal"),o=t("./_enum-bug-keys");e.exports=Object.keys||function(t){return n(t,o)}},{"./_enum-bug-keys":12,"./_object-keys-internal":34}],36:[function(t,e,r){e.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},{}],37:[function(t,e,r){var n=t("./_global"),o=t("./_hide"),i=t("./_has"),c=t("./_uid")("src"),u=t("./_function-to-string"),s=(""+u).split("toString");t("./_core").inspectSource=function(t){return u.call(t)},(e.exports=function(t,e,r,u){var a="function"==typeof r;a&&(i(r,"name")||o(r,"name",e)),t[e]!==r&&(a&&(i(r,c)||o(r,c,t[e]?""+t[e]:s.join(String(e)))),t===n?t[e]=r:u?t[e]?t[e]=r:o(t,e,r):(delete t[e],o(t,e,r)))})(Function.prototype,"toString",function(){return"function"==typeof this&&this[c]||u.call(this)})},{"./_core":7,"./_function-to-string":16,"./_global":17,"./_has":18,"./_hide":19,"./_uid":49}],38:[function(t,e,r){var n=t("./_object-dp").f,o=t("./_has"),i=t("./_wks")("toStringTag");e.exports=function(t,e,r){t&&!o(t=r?t:t.prototype,i)&&n(t,i,{configurable:!0,value:e})}},{"./_has":18,"./_object-dp":31,"./_wks":50}],39:[function(t,e,r){var n=t("./_shared")("keys"),o=t("./_uid");e.exports=function(t){return n[t]||(n[t]=o(t))}},{"./_shared":40,"./_uid":49}],40:[function(t,e,r){var n=t("./_core"),o=t("./_global"),i=o["__core-js_shared__"]||(o["__core-js_shared__"]={});(e.exports=function(t,e){return i[t]||(i[t]=void 0!==e?e:{})})("versions",[]).push({version:n.version,mode:t("./_library")?"pure":"global",copyright:"© 2019 Denis Pushkarev (zloirock.ru)"})},{"./_core":7,"./_global":17,"./_library":29}],41:[function(t,e,r){var n=t("./_to-integer"),o=t("./_defined");e.exports=function(t){return function(e,r){var i,c,u=String(o(e)),s=n(r),a=u.length;return s<0||s>=a?t?"":void 0:(i=u.charCodeAt(s))<55296||i>56319||s+1===a||(c=u.charCodeAt(s+1))<56320||c>57343?t?u.charAt(s):i:t?u.slice(s,s+2):c-56320+(i-55296<<10)+65536}}},{"./_defined":9,"./_to-integer":44}],42:[function(t,e,r){var n=t("./_is-regexp"),o=t("./_defined");e.exports=function(t,e,r){if(n(e))throw TypeError("String#"+r+" doesn't accept regex!");return String(o(t))}},{"./_defined":9,"./_is-regexp":24}],43:[function(t,e,r){var n=t("./_to-integer"),o=Math.max,i=Math.min;e.exports=function(t,e){return(t=n(t))<0?o(t+e,0):i(t,e)}},{"./_to-integer":44}],44:[function(t,e,r){var n=Math.ceil,o=Math.floor;e.exports=function(t){return isNaN(t=+t)?0:(t>0?o:n)(t)}},{}],45:[function(t,e,r){var n=t("./_iobject"),o=t("./_defined");e.exports=function(t){return n(o(t))}},{"./_defined":9,"./_iobject":22}],46:[function(t,e,r){var n=t("./_to-integer"),o=Math.min;e.exports=function(t){return t>0?o(n(t),9007199254740991):0}},{"./_to-integer":44}],47:[function(t,e,r){var n=t("./_defined");e.exports=function(t){return Object(n(t))}},{"./_defined":9}],48:[function(t,e,r){var n=t("./_is-object");e.exports=function(t,e){if(!n(t))return t;var r,o;if(e&&"function"==typeof(r=t.toString)&&!n(o=r.call(t)))return o;if("function"==typeof(r=t.valueOf)&&!n(o=r.call(t)))return o;if(!e&&"function"==typeof(r=t.toString)&&!n(o=r.call(t)))return o;throw TypeError("Can't convert object to primitive value")}},{"./_is-object":23}],49:[function(t,e,r){var n=0,o=Math.random();e.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++n+o).toString(36))}},{}],50:[function(t,e,r){var n=t("./_shared")("wks"),o=t("./_uid"),i=t("./_global").Symbol,c="function"==typeof i;(e.exports=function(t){return n[t]||(n[t]=c&&i[t]||(c?i:o)("Symbol."+t))}).store=n},{"./_global":17,"./_shared":40,"./_uid":49}],51:[function(t,e,r){"use strict";var n=t("./_add-to-unscopables"),o=t("./_iter-step"),i=t("./_iterators"),c=t("./_to-iobject");e.exports=t("./_iter-define")(Array,"Array",function(t,e){this._t=c(t),this._i=0,this._k=e},function(){var t=this._t,e=this._k,r=this._i++;return!t||r>=t.length?(this._t=void 0,o(1)):o(0,"keys"==e?r:"values"==e?t[r]:[r,t[r]])},"values"),i.Arguments=i.Array,n("keys"),n("values"),n("entries")},{"./_add-to-unscopables":3,"./_iter-define":26,"./_iter-step":27,"./_iterators":28,"./_to-iobject":45}],52:[function(t,e,r){"use strict";var n=t("./_export"),o=t("./_string-context");n(n.P+n.F*t("./_fails-is-regexp")("includes"),"String",{includes:function(t){return!!~o(this,t,"includes").indexOf(t,arguments.length>1?arguments[1]:void 0)}})},{"./_export":13,"./_fails-is-regexp":14,"./_string-context":42}],53:[function(t,e,r){"use strict";var n=t("./_string-at")(!0);t("./_iter-define")(String,"String",function(t){this._t=String(t),this._i=0},function(){var t,e=this._t,r=this._i;return r>=e.length?{value:void 0,done:!0}:(t=n(e,r),this._i+=t.length,{value:t,done:!1})})},{"./_iter-define":26,"./_string-at":41}],54:[function(t,e,r){"use strict";var n=t("./_export"),o=t("./_array-includes")(!0);n(n.P,"Array",{includes:function(t){return o(this,t,arguments.length>1?arguments[1]:void 0)}}),t("./_add-to-unscopables")("includes")},{"./_add-to-unscopables":3,"./_array-includes":5,"./_export":13}]},{},[1]);function _throw(e) {
    throw e;
}
var _typeof = function(obj) {
    return obj && obj.constructor === Symbol ? 'symbol' : typeof obj;
};
import { definitions } from '@babel/preset-env/lib/built-in-definitions';
function has(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
}
function getType(target) {
    if (Array.isArray(target)) return 'array';
    return _typeof(target);
}
export default (polyfills, flags)=>function(param) {
        var ref = param ? param : _throw(new TypeError("Cannot destructure 'undefined' or 'null'")), t = ref.types;
        var addImport = function addImport(path, builtIn, builtIns) {
            if (builtIn && !builtIns.has(builtIn)) {
                builtIns.add(builtIn);
                polyfills.push(builtIn);
            }
        };
        var addUnsupported = function addUnsupported(path, builtIn, builtIns) {
            if (Array.isArray(builtIn)) {
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = builtIn[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var i = _step.value;
                        addImport(path, i, builtIns);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            } else {
                addImport(path, builtIn, builtIns);
            }
        };
        var addAndRemovePolyfillImports = {
            // Symbol()
// new Promise
ReferencedIdentifier: function(path, state) {
                var ref1 = path ? path : _throw(new TypeError("Cannot destructure 'undefined' or 'null'")), node = ref1.node, parent = ref1.parent, scope = ref1.scope;
                if (t.isMemberExpression(parent)) return;
                if (!has(definitions.builtins, node.name)) return;
                if (scope.getBindingIdentifier(node.name)) return;
                var builtIn = definitions.builtins[node.name];
                addUnsupported(path, builtIn, this.builtIns);
            },
            // arr[Symbol.iterator]()
CallExpression: function(path) {
                // we can't compile this
if (path.node.arguments.length) return;
                var callee = path.node.callee;
                if (!t.isMemberExpression(callee)) return;
                if (!callee.computed) return;
                if (!path.get('callee.property').matchesPattern('Symbol.iterator')) {
                    return;
                }
                addImport(path, 'web.dom.iterable', this.builtIns);
            },
            // Symbol.iterator in arr
BinaryExpression: function(path) {
                if (path.node.operator !== 'in') return;
                if (!path.get('left').matchesPattern('Symbol.iterator')) return;
                addImport(path, 'web.dom.iterable', this.builtIns);
            },
            // yield*
YieldExpression: function(path) {
                if (!path.node.delegate) return;
                addImport(path, 'web.dom.iterable', this.builtIns);
            },
            // Array.from
MemberExpression: {
                enter: function(path, state) {
                    if (!path.isReferenced()) return;
                    var ref1 = path ? path : _throw(new TypeError("Cannot destructure 'undefined' or 'null'")), node = ref1.node;
                    var obj = node.object;
                    var prop = node.property;
                    if (!t.isReferenced(obj, node)) return;
                    var instanceType;
                    var evaluatedPropType = obj.name;
                    var propName = prop.name;
                    if (node.computed) {
                        if (t.isStringLiteral(prop)) {
                            propName = prop.value;
                        } else {
                            var res = path.get('property').evaluate();
                            if (res.confident && res.value) {
                                propName = res.value;
                            }
                        }
                    }
                    if (path.scope.getBindingIdentifier(obj.name)) {
                        var result = path.get('object').evaluate();
                        if (result.value) {
                            instanceType = getType(result.value);
                        } else if (result.deopt && result.deopt.isIdentifier()) {
                            evaluatedPropType = result.deopt.node.name;
                        }
                    }
                    if (has(definitions.staticMethods, evaluatedPropType)) {
                        var staticMethods = definitions.staticMethods[evaluatedPropType];
                        if (has(staticMethods, propName)) {
                            var builtIn = staticMethods[propName];
                            addUnsupported(path, builtIn, this.builtIns);
                        }
                    }
                    if (has(definitions.instanceMethods, propName)) {
                        //warnOnInstanceMethod(state, getObjectString(node));
var builtIn = definitions.instanceMethods[propName];
                        if (instanceType) {
                            builtIn = builtIn.filter(function(item) {
                                return item.includes(instanceType);
                            });
                        }
                        addUnsupported(path, builtIn, this.builtIns);
                    }
                },
                // Symbol.match
exit: function(path, state) {
                    if (!path.isReferenced()) return;
                    var ref1 = path ? path : _throw(new TypeError("Cannot destructure 'undefined' or 'null'")), node = ref1.node;
                    var obj = node.object;
                    if (!has(definitions.builtins, obj.name)) return;
                    if (path.scope.getBindingIdentifier(obj.name)) return;
                    var builtIn = definitions.builtins[obj.name];
                    addUnsupported(path, builtIn, this.builtIns);
                }
            },
            // var { repeat, startsWith } = String
VariableDeclarator: function(path, state) {
                if (!path.isReferenced()) return;
                var ref1 = path ? path : _throw(new TypeError("Cannot destructure 'undefined' or 'null'")), node = ref1.node;
                var obj = node.init;
                if (!t.isObjectPattern(node.id)) return;
                if (!t.isReferenced(obj, node)) return;
                // doesn't reference the global
if (obj && path.scope.getBindingIdentifier(obj.name)) return;
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for(var _iterator = node.id.properties[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                        var prop = _step.value;
                        prop = prop.key;
                        if (!node.computed && t.isIdentifier(prop) && has(definitions.instanceMethods, prop.name)) {
                            // warnOnInstanceMethod(
//   state,
//   `${path.parentPath.node.kind} { ${prop.name} } = ${obj.name}`,
// );
var builtIn = definitions.instanceMethods[prop.name];
                            addUnsupported(path, builtIn, this.builtIns);
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally{
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally{
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            },
            Function: function(path, state) {
                if (path.node.generator || path.node.async) {
                    flags.usesRegenerator = true;
                }
            }
        };
        return {
            name: 'use-built-ins',
            pre: function() {
                this.builtIns = new Set();
            },
            visitor: addAndRemovePolyfillImports
        };
    }
;
