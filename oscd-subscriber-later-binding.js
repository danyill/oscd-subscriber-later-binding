/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    if (typeof b !== "function" && b !== null)
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$3=window,e$8=t$3.ShadowRoot&&(void 0===t$3.ShadyCSS||t$3.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$4=Symbol(),n$4=new WeakMap;class o$6{constructor(t,e,n){if(this._$cssResult$=!0,n!==s$4)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$8&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=n$4.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&n$4.set(s,t));}return t}toString(){return this.cssText}}const r$3=t=>new o$6("string"==typeof t?t:t+"",void 0,s$4),i$5=(t,...e)=>{const n=1===t.length?t[0]:e.reduce(((e,s,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[n+1]),t[0]);return new o$6(n,t,s$4)},S$1=(s,n)=>{e$8?s.adoptedStyleSheets=n.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):n.forEach((e=>{const n=document.createElement("style"),o=t$3.litNonce;void 0!==o&&n.setAttribute("nonce",o),n.textContent=e.cssText,s.appendChild(n);}));},c$3=e$8?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$3(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var s$3;const e$7=window,r$2=e$7.trustedTypes,h$1=r$2?r$2.emptyScript:"",o$5=e$7.reactiveElementPolyfillSupport,n$3={toAttribute(t,i){switch(i){case Boolean:t=t?h$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,i){let s=t;switch(i){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t);}catch(t){s=null;}}return s}},a$1=(t,i)=>i!==t&&(i==i||t==t),l$5={attribute:!0,type:String,converter:n$3,reflect:!1,hasChanged:a$1};class d$1 extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u();}static addInitializer(t){var i;this.finalize(),(null!==(i=this.h)&&void 0!==i?i:this.h=[]).push(t);}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((i,s)=>{const e=this._$Ep(s,i);void 0!==e&&(this._$Ev.set(e,s),t.push(e));})),t}static createProperty(t,i=l$5){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(t,i),!i.noAccessor&&!this.prototype.hasOwnProperty(t)){const s="symbol"==typeof t?Symbol():"__"+t,e=this.getPropertyDescriptor(t,s,i);void 0!==e&&Object.defineProperty(this.prototype,t,e);}}static getPropertyDescriptor(t,i,s){return {get(){return this[i]},set(e){const r=this[t];this[i]=e,this.requestUpdate(t,r,s);},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||l$5}static finalize(){if(this.hasOwnProperty("finalized"))return !1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,i=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const s of i)this.createProperty(s,t[s]);}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(i){const s=[];if(Array.isArray(i)){const e=new Set(i.flat(1/0).reverse());for(const i of e)s.unshift(c$3(i));}else void 0!==i&&s.push(c$3(i));return s}static _$Ep(t,i){const s=i.attribute;return !1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)));}addController(t){var i,s;(null!==(i=this._$ES)&&void 0!==i?i:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(s=t.hostConnected)||void 0===s||s.call(t));}removeController(t){var i;null===(i=this._$ES)||void 0===i||i.splice(this._$ES.indexOf(t)>>>0,1);}_$Eg(){this.constructor.elementProperties.forEach(((t,i)=>{this.hasOwnProperty(i)&&(this._$Ei.set(i,this[i]),delete this[i]);}));}createRenderRoot(){var t;const s=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return S$1(s,this.constructor.elementStyles),s}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostConnected)||void 0===i?void 0:i.call(t)}));}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostDisconnected)||void 0===i?void 0:i.call(t)}));}attributeChangedCallback(t,i,s){this._$AK(t,s);}_$EO(t,i,s=l$5){var e;const r=this.constructor._$Ep(t,s);if(void 0!==r&&!0===s.reflect){const h=(void 0!==(null===(e=s.converter)||void 0===e?void 0:e.toAttribute)?s.converter:n$3).toAttribute(i,s.type);this._$El=t,null==h?this.removeAttribute(r):this.setAttribute(r,h),this._$El=null;}}_$AK(t,i){var s;const e=this.constructor,r=e._$Ev.get(t);if(void 0!==r&&this._$El!==r){const t=e.getPropertyOptions(r),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(s=t.converter)||void 0===s?void 0:s.fromAttribute)?t.converter:n$3;this._$El=r,this[r]=h.fromAttribute(i,t.type),this._$El=null;}}requestUpdate(t,i,s){let e=!0;void 0!==t&&(((s=s||this.constructor.getPropertyOptions(t)).hasChanged||a$1)(this[t],i)?(this._$AL.has(t)||this._$AL.set(t,i),!0===s.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,s))):e=!1),!this.isUpdatePending&&e&&(this._$E_=this._$Ej());}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,i)=>this[i]=t)),this._$Ei=void 0);let i=!1;const s=this._$AL;try{i=this.shouldUpdate(s),i?(this.willUpdate(s),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var i;return null===(i=t.hostUpdate)||void 0===i?void 0:i.call(t)})),this.update(s)):this._$Ek();}catch(t){throw i=!1,this._$Ek(),t}i&&this._$AE(s);}willUpdate(t){}_$AE(t){var i;null===(i=this._$ES)||void 0===i||i.forEach((t=>{var i;return null===(i=t.hostUpdated)||void 0===i?void 0:i.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t);}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return !0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,i)=>this._$EO(i,this[i],t))),this._$EC=void 0),this._$Ek();}updated(t){}firstUpdated(t){}}d$1.finalized=!0,d$1.elementProperties=new Map,d$1.elementStyles=[],d$1.shadowRootOptions={mode:"open"},null==o$5||o$5({ReactiveElement:d$1}),(null!==(s$3=e$7.reactiveElementVersions)&&void 0!==s$3?s$3:e$7.reactiveElementVersions=[]).push("1.6.1");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var t$2;const i$4=window,s$2=i$4.trustedTypes,e$6=s$2?s$2.createPolicy("lit-html",{createHTML:t=>t}):void 0,o$4="$lit$",n$2=`lit$${(Math.random()+"").slice(9)}$`,l$4="?"+n$2,h=`<${l$4}>`,r$1=document,d=()=>r$1.createComment(""),u$2=t=>null===t||"object"!=typeof t&&"function"!=typeof t,c$2=Array.isArray,v=t=>c$2(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]),a="[ \t\n\f\r]",f$1=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m$1=/>/g,p$1=RegExp(`>|${a}(?:([^\\s"'>=/]+)(${a}*=${a}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,w=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),x=w(1),b=w(2),T=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),E=new WeakMap,C=r$1.createTreeWalker(r$1,129,null,!1),P=(t,i)=>{const s=t.length-1,l=[];let r,d=2===i?"<svg>":"",u=f$1;for(let i=0;i<s;i++){const s=t[i];let e,c,v=-1,a=0;for(;a<s.length&&(u.lastIndex=a,c=u.exec(s),null!==c);)a=u.lastIndex,u===f$1?"!--"===c[1]?u=_:void 0!==c[1]?u=m$1:void 0!==c[2]?(y.test(c[2])&&(r=RegExp("</"+c[2],"g")),u=p$1):void 0!==c[3]&&(u=p$1):u===p$1?">"===c[0]?(u=null!=r?r:f$1,v=-1):void 0===c[1]?v=-2:(v=u.lastIndex-c[2].length,e=c[1],u=void 0===c[3]?p$1:'"'===c[3]?$:g):u===$||u===g?u=p$1:u===_||u===m$1?u=f$1:(u=p$1,r=void 0);const w=u===p$1&&t[i+1].startsWith("/>")?" ":"";d+=u===f$1?s+h:v>=0?(l.push(e),s.slice(0,v)+o$4+s.slice(v)+n$2+w):s+n$2+(-2===v?(l.push(void 0),i):w);}const c=d+(t[s]||"<?>")+(2===i?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return [void 0!==e$6?e$6.createHTML(c):c,l]};class V{constructor({strings:t,_$litType$:i},e){let h;this.parts=[];let r=0,u=0;const c=t.length-1,v=this.parts,[a,f]=P(t,i);if(this.el=V.createElement(a,e),C.currentNode=this.el.content,2===i){const t=this.el.content,i=t.firstChild;i.remove(),t.append(...i.childNodes);}for(;null!==(h=C.nextNode())&&v.length<c;){if(1===h.nodeType){if(h.hasAttributes()){const t=[];for(const i of h.getAttributeNames())if(i.endsWith(o$4)||i.startsWith(n$2)){const s=f[u++];if(t.push(i),void 0!==s){const t=h.getAttribute(s.toLowerCase()+o$4).split(n$2),i=/([.?@])?(.*)/.exec(s);v.push({type:1,index:r,name:i[2],strings:t,ctor:"."===i[1]?k:"?"===i[1]?I:"@"===i[1]?L:R});}else v.push({type:6,index:r});}for(const i of t)h.removeAttribute(i);}if(y.test(h.tagName)){const t=h.textContent.split(n$2),i=t.length-1;if(i>0){h.textContent=s$2?s$2.emptyScript:"";for(let s=0;s<i;s++)h.append(t[s],d()),C.nextNode(),v.push({type:2,index:++r});h.append(t[i],d());}}}else if(8===h.nodeType)if(h.data===l$4)v.push({type:2,index:r});else {let t=-1;for(;-1!==(t=h.data.indexOf(n$2,t+1));)v.push({type:7,index:r}),t+=n$2.length-1;}r++;}}static createElement(t,i){const s=r$1.createElement("template");return s.innerHTML=t,s}}function N(t,i,s=t,e){var o,n,l,h;if(i===T)return i;let r=void 0!==e?null===(o=s._$Co)||void 0===o?void 0:o[e]:s._$Cl;const d=u$2(i)?void 0:i._$litDirective$;return (null==r?void 0:r.constructor)!==d&&(null===(n=null==r?void 0:r._$AO)||void 0===n||n.call(r,!1),void 0===d?r=void 0:(r=new d(t),r._$AT(t,s,e)),void 0!==e?(null!==(l=(h=s)._$Co)&&void 0!==l?l:h._$Co=[])[e]=r:s._$Cl=r),void 0!==r&&(i=N(t,r._$AS(t,i.values),r,e)),i}class S{constructor(t,i){this.u=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}v(t){var i;const{el:{content:s},parts:e}=this._$AD,o=(null!==(i=null==t?void 0:t.creationScope)&&void 0!==i?i:r$1).importNode(s,!0);C.currentNode=o;let n=C.nextNode(),l=0,h=0,d=e[0];for(;void 0!==d;){if(l===d.index){let i;2===d.type?i=new M(n,n.nextSibling,this,t):1===d.type?i=new d.ctor(n,d.name,d.strings,this,t):6===d.type&&(i=new z(n,this,t)),this.u.push(i),d=e[++h];}l!==(null==d?void 0:d.index)&&(n=C.nextNode(),l++);}return o}p(t){let i=0;for(const s of this.u)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class M{constructor(t,i,s,e){var o;this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cm=null===(o=null==e?void 0:e.isConnected)||void 0===o||o;}get _$AU(){var t,i;return null!==(i=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==i?i:this._$Cm}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===(null==t?void 0:t.nodeType)&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=N(this,t,i),u$2(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==T&&this.g(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):v(t)?this.k(t):this.g(t);}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t));}g(t){this._$AH!==A&&u$2(this._$AH)?this._$AA.nextSibling.data=t:this.T(r$1.createTextNode(t)),this._$AH=t;}$(t){var i;const{values:s,_$litType$:e}=t,o="number"==typeof e?this._$AC(t):(void 0===e.el&&(e.el=V.createElement(e.h,this.options)),e);if((null===(i=this._$AH)||void 0===i?void 0:i._$AD)===o)this._$AH.p(s);else {const t=new S(o,this),i=t.v(this.options);t.p(s),this.T(i),this._$AH=t;}}_$AC(t){let i=E.get(t.strings);return void 0===i&&E.set(t.strings,i=new V(t)),i}k(t){c$2(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const o of t)e===i.length?i.push(s=new M(this.S(d()),this.S(d()),this,this.options)):s=i[e],s._$AI(o),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){var s;for(null===(s=this._$AP)||void 0===s||s.call(this,!1,!0,i);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){var i;void 0===this._$AM&&(this._$Cm=t,null===(i=this._$AP)||void 0===i||i.call(this,t));}}class R{constructor(t,i,s,e,o){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,i=this,s,e){const o=this.strings;let n=!1;if(void 0===o)t=N(this,t,i,0),n=!u$2(t)||t!==this._$AH&&t!==T,n&&(this._$AH=t);else {const e=t;let l,h;for(t=o[0],l=0;l<o.length-1;l++)h=N(this,e[s+l],i,l),h===T&&(h=this._$AH[l]),n||(n=!u$2(h)||h!==this._$AH[l]),h===A?t=A:t!==A&&(t+=(null!=h?h:"")+o[l+1]),this._$AH[l]=h;}n&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"");}}class k extends R{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}const H=s$2?s$2.emptyScript:"";class I extends R{constructor(){super(...arguments),this.type=4;}j(t){t&&t!==A?this.element.setAttribute(this.name,H):this.element.removeAttribute(this.name);}}class L extends R{constructor(t,i,s,e,o){super(t,i,s,e,o),this.type=5;}_$AI(t,i=this){var s;if((t=null!==(s=N(this,t,i,0))&&void 0!==s?s:A)===T)return;const e=this._$AH,o=t===A&&e!==A||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,n=t!==A&&(e===A||o);o&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){var i,s;"function"==typeof this._$AH?this._$AH.call(null!==(s=null===(i=this.options)||void 0===i?void 0:i.host)&&void 0!==s?s:this.element,t):this._$AH.handleEvent(t);}}class z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){N(this,t);}}const Z={P:o$4,A:n$2,M:l$4,C:1,L:P,D:S,R:v,V:N,I:M,H:R,N:I,U:L,F:k,B:z},j=i$4.litHtmlPolyfillSupport;null==j||j(V,M),(null!==(t$2=i$4.litHtmlVersions)&&void 0!==t$2?t$2:i$4.litHtmlVersions=[]).push("2.7.0");const B=(t,i,s)=>{var e,o;const n=null!==(e=null==s?void 0:s.renderBefore)&&void 0!==e?e:i;let l=n._$litPart$;if(void 0===l){const t=null!==(o=null==s?void 0:s.renderBefore)&&void 0!==o?o:null;n._$litPart$=l=new M(i.insertBefore(d(),t),t,void 0,null!=s?s:{});}return l._$AI(t),l};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var l$3,o$3;class s$1 extends d$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=B(i,this.renderRoot,this.renderOptions);}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0);}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1);}render(){return T}}s$1.finalized=!0,s$1._$litElement$=!0,null===(l$3=globalThis.litElementHydrateSupport)||void 0===l$3||l$3.call(globalThis,{LitElement:s$1});const n$1=globalThis.litElementPolyfillSupport;null==n$1||n$1({LitElement:s$1});(null!==(o$3=globalThis.litElementVersions)&&void 0!==o$3?o$3:globalThis.litElementVersions=[]).push("3.3.0");

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const isStrTagged = (val) => typeof val !== 'string' && 'strTag' in val;
/**
 * Render the result of a `str` tagged template to a string. Note we don't need
 * to do this for Lit templates, since Lit itself handles rendering.
 */
const joinStringsAndValues = (strings, values, valueOrder) => {
    let concat = strings[0];
    for (let i = 1; i < strings.length; i++) {
        concat += values[valueOrder ? valueOrder[i - 1] : i - 1];
        concat += strings[i];
    }
    return concat;
};

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * Default identity msg implementation. Simply returns the input template with
 * no awareness of translations. If the template is str-tagged, returns it in
 * string form.
 */
const defaultMsg = ((template) => isStrTagged(template)
    ? joinStringsAndValues(template.strings, template.values)
    : template);

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class Deferred {
    constructor() {
        this.settled = false;
        this.promise = new Promise((resolve, reject) => {
            this._resolve = resolve;
            this._reject = reject;
        });
    }
    resolve(value) {
        this.settled = true;
        this._resolve(value);
    }
    reject(error) {
        this.settled = true;
        this._reject(error);
    }
}

/**
 * @license
 * Copyright 2014 Travis Webb
 * SPDX-License-Identifier: MIT
 */
for (let i = 0; i < 256; i++) {
    ((i >> 4) & 15).toString(16) + (i & 15).toString(16);
}

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let loading = new Deferred();
// The loading promise must be initially resolved, because that's what we should
// return if the user immediately calls setLocale(sourceLocale).
loading.resolve();

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * Make a string or lit-html template localizable.
 *
 * @param template A string, a lit-html template, or a function that returns
 * either a string or lit-html template.
 * @param options Optional configuration object with the following properties:
 *   - id: Optional project-wide unique identifier for this template. If
 *     omitted, an id will be automatically generated from the template strings.
 *   - desc: Optional description
 */
let msg = defaultMsg;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const e$5=e=>n=>"function"==typeof n?((e,n)=>(customElements.define(e,n),n))(e,n):((e,n)=>{const{kind:t,elements:s}=n;return {kind:t,elements:s,finisher(n){customElements.define(e,n);}}})(e,n);

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const i$3=(i,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(n){n.createProperty(e.key,i);}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this));},finisher(n){n.createProperty(e.key,i);}};function e$4(e){return (n,t)=>void 0!==t?((i,e,n)=>{e.constructor.createProperty(n,i);})(e,n,t):i$3(e,n)}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function t$1(t){return e$4({...t,state:!0})}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const o$2=({finisher:e,descriptor:t})=>(o,n)=>{var r;if(void 0===n){const n=null!==(r=o.originalKey)&&void 0!==r?r:o.key,i=null!=t?{kind:"method",placement:"prototype",key:n,descriptor:t(o.key)}:{...o,key:n};return null!=e&&(i.finisher=function(t){e(t,n);}),i}{const r=o.constructor;void 0!==t&&Object.defineProperty(o,n,t(n)),null==e||e(r,n);}};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function e$3(e){return o$2({finisher:(r,t)=>{Object.assign(r.prototype[t],e);}})}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function i$2(i,n){return o$2({descriptor:o=>{const t={get(){var o,n;return null!==(n=null===(o=this.renderRoot)||void 0===o?void 0:o.querySelector(i))&&void 0!==n?n:null},enumerable:!0,configurable:!0};if(n){const n="symbol"==typeof o?Symbol():"__"+o;t.get=function(){var o,t;return void 0===this[n]&&(this[n]=null!==(t=null===(o=this.renderRoot)||void 0===o?void 0:o.querySelector(i))&&void 0!==t?t:null),this[n]};}return t}})}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function e$2(e){return o$2({descriptor:r=>({async get(){var r;return await this.updateComplete,null===(r=this.renderRoot)||void 0===r?void 0:r.querySelector(e)},enumerable:!0,configurable:!0})})}

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var n;const e$1=null!=(null===(n=window.HTMLSlotElement)||void 0===n?void 0:n.prototype.assignedElements)?(o,n)=>o.assignedElements(n):(o,n)=>o.assignedNodes(n).filter((o=>o.nodeType===Node.ELEMENT_NODE));function l$2(n){const{slot:l,selector:t}=null!=n?n:{};return o$2({descriptor:o=>({get(){var o;const r="slot"+(l?`[name=${l}]`:":not([name])"),i=null===(o=this.renderRoot)||void 0===o?void 0:o.querySelector(r),s=null!=i?e$1(i,n):[];return t?s.filter((o=>o.matches(t))):s},enumerable:!0,configurable:!0})})}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function o$1(o,n,r){let l,s=o;return "object"==typeof o?(s=o.slot,l=o):l={flatten:n},r?l$2({slot:s,flatten:n,selector:r}):o$2({descriptor:e=>({get(){var e,t;const o="slot"+(s?`[name=${s}]`:":not([name])"),n=null===(e=this.renderRoot)||void 0===e?void 0:e.querySelector(o);return null!==(t=null==n?void 0:n.assignedNodes(l))&&void 0!==t?t:[]},enumerable:!0,configurable:!0})})}

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},e=t=>(...e)=>({_$litDirective$:t,values:e});class i$1{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i;}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const o=e(class extends i$1{constructor(t$1){var i;if(super(t$1),t$1.type!==t.ATTRIBUTE||"class"!==t$1.name||(null===(i=t$1.strings)||void 0===i?void 0:i.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return " "+Object.keys(t).filter((i=>t[i])).join(" ")+" "}update(i,[s]){var r,o;if(void 0===this.nt){this.nt=new Set,void 0!==i.strings&&(this.st=new Set(i.strings.join(" ").split(/\s/).filter((t=>""!==t))));for(const t in s)s[t]&&!(null===(r=this.st)||void 0===r?void 0:r.has(t))&&this.nt.add(t);return this.render(s)}const e=i.element.classList;this.nt.forEach((t=>{t in s||(e.remove(t),this.nt.delete(t));}));for(const t in s){const i=!!s[t];i===this.nt.has(t)||(null===(o=this.st)||void 0===o?void 0:o.has(t))||(i?(e.add(t),this.nt.add(t)):(e.remove(t),this.nt.delete(t)));}return T}});

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const {I:l$1}=Z,c$1=()=>document.createComment(""),r=(o,t,i)=>{var n;const d=o._$AA.parentNode,v=void 0===t?o._$AB:t._$AA;if(void 0===i){const t=d.insertBefore(c$1(),v),n=d.insertBefore(c$1(),v);i=new l$1(t,n,o,o.options);}else {const l=i._$AB.nextSibling,t=i._$AM,e=t!==o;if(e){let l;null===(n=i._$AQ)||void 0===n||n.call(i,o),i._$AM=o,void 0!==i._$AP&&(l=o._$AU)!==t._$AU&&i._$AP(l);}if(l!==v||e){let o=i._$AA;for(;o!==l;){const l=o.nextSibling;d.insertBefore(o,v),o=l;}}}return i},u$1=(o,l,t=o)=>(o._$AI(l,t),o),f={},s=(o,l=f)=>o._$AH=l,m=o=>o._$AH,p=o=>{var l;null===(l=o._$AP)||void 0===l||l.call(o,!1,!0);let t=o._$AA;const i=o._$AB.nextSibling;for(;t!==i;){const o=t.nextSibling;t.remove(),t=o;}};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const u=(e,s,t)=>{const r=new Map;for(let l=s;l<=t;l++)r.set(e[l],l);return r},c=e(class extends i$1{constructor(e){if(super(e),e.type!==t.CHILD)throw Error("repeat() can only be used in text expressions")}ht(e,s,t){let r;void 0===t?t=s:void 0!==s&&(r=s);const l=[],o=[];let i=0;for(const s of e)l[i]=r?r(s,i):i,o[i]=t(s,i),i++;return {values:o,keys:l}}render(e,s,t){return this.ht(e,s,t).values}update(s$1,[t,r$1,c]){var d;const a=m(s$1),{values:p$1,keys:v}=this.ht(t,r$1,c);if(!Array.isArray(a))return this.ut=v,p$1;const h=null!==(d=this.ut)&&void 0!==d?d:this.ut=[],m$1=[];let y,x,j=0,k=a.length-1,w=0,A=p$1.length-1;for(;j<=k&&w<=A;)if(null===a[j])j++;else if(null===a[k])k--;else if(h[j]===v[w])m$1[w]=u$1(a[j],p$1[w]),j++,w++;else if(h[k]===v[A])m$1[A]=u$1(a[k],p$1[A]),k--,A--;else if(h[j]===v[A])m$1[A]=u$1(a[j],p$1[A]),r(s$1,m$1[A+1],a[j]),j++,A--;else if(h[k]===v[w])m$1[w]=u$1(a[k],p$1[w]),r(s$1,a[j],a[k]),k--,w++;else if(void 0===y&&(y=u(v,w,A),x=u(h,j,k)),y.has(h[j]))if(y.has(h[k])){const e=x.get(v[w]),t=void 0!==e?a[e]:null;if(null===t){const e=r(s$1,a[j]);u$1(e,p$1[w]),m$1[w]=e;}else m$1[w]=u$1(t,p$1[w]),r(s$1,a[j],t),a[e]=null;w++;}else p(a[k]),k--;else p(a[j]),j++;for(;w<=A;){const e=r(s$1,m$1[A+1]);u$1(e,p$1[w]),m$1[w++]=e;}for(;j<=k;){const e=a[j++];null!==e&&p(e);}return this.ut=v,s(s$1,m$1),T}});

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
const styles$g = i$5 `:host{font-family:var(--mdc-icon-font, "Material Icons");font-weight:normal;font-style:normal;font-size:var(--mdc-icon-size, 24px);line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-moz-osx-font-smoothing:grayscale;font-feature-settings:"liga"}`;

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/** @soyCompatible */
let Icon = class Icon extends s$1 {
    /** @soyTemplate */
    render() {
        return x `<span><slot></slot></span>`;
    }
};
Icon.styles = [styles$g];
Icon = __decorate([
    e$5('mwc-icon')
], Icon);

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
const styles$f = i$5 `.material-icons{font-family:var(--mdc-icon-font, "Material Icons");font-weight:normal;font-style:normal;font-size:var(--mdc-icon-size, 24px);line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-moz-osx-font-smoothing:grayscale;font-feature-settings:"liga"}.mdc-icon-button{font-size:24px;width:48px;height:48px;padding:12px}.mdc-icon-button .mdc-icon-button__focus-ring{display:none}.mdc-icon-button.mdc-ripple-upgraded--background-focused .mdc-icon-button__focus-ring,.mdc-icon-button:not(.mdc-ripple-upgraded):focus .mdc-icon-button__focus-ring{display:block;max-height:48px;max-width:48px}@media screen and (forced-colors: active){.mdc-icon-button.mdc-ripple-upgraded--background-focused .mdc-icon-button__focus-ring,.mdc-icon-button:not(.mdc-ripple-upgraded):focus .mdc-icon-button__focus-ring{pointer-events:none;border:2px solid transparent;border-radius:6px;box-sizing:content-box;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);height:100%;width:100%}}@media screen and (forced-colors: active)and (forced-colors: active){.mdc-icon-button.mdc-ripple-upgraded--background-focused .mdc-icon-button__focus-ring,.mdc-icon-button:not(.mdc-ripple-upgraded):focus .mdc-icon-button__focus-ring{border-color:CanvasText}}@media screen and (forced-colors: active){.mdc-icon-button.mdc-ripple-upgraded--background-focused .mdc-icon-button__focus-ring::after,.mdc-icon-button:not(.mdc-ripple-upgraded):focus .mdc-icon-button__focus-ring::after{content:"";border:2px solid transparent;border-radius:8px;display:block;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);height:calc(100% + 4px);width:calc(100% + 4px)}}@media screen and (forced-colors: active)and (forced-colors: active){.mdc-icon-button.mdc-ripple-upgraded--background-focused .mdc-icon-button__focus-ring::after,.mdc-icon-button:not(.mdc-ripple-upgraded):focus .mdc-icon-button__focus-ring::after{border-color:CanvasText}}.mdc-icon-button.mdc-icon-button--reduced-size .mdc-icon-button__ripple{width:40px;height:40px;margin-top:4px;margin-bottom:4px;margin-right:4px;margin-left:4px}.mdc-icon-button.mdc-icon-button--reduced-size.mdc-ripple-upgraded--background-focused .mdc-icon-button__focus-ring,.mdc-icon-button.mdc-icon-button--reduced-size:not(.mdc-ripple-upgraded):focus .mdc-icon-button__focus-ring{max-height:40px;max-width:40px}.mdc-icon-button .mdc-icon-button__touch{position:absolute;top:50%;height:48px;left:50%;width:48px;transform:translate(-50%, -50%)}.mdc-icon-button:disabled{color:rgba(0, 0, 0, 0.38);color:var(--mdc-theme-text-disabled-on-light, rgba(0, 0, 0, 0.38))}.mdc-icon-button svg,.mdc-icon-button img{width:24px;height:24px}.mdc-icon-button{display:inline-block;position:relative;box-sizing:border-box;border:none;outline:none;background-color:transparent;fill:currentColor;color:inherit;text-decoration:none;cursor:pointer;user-select:none;z-index:0;overflow:visible}.mdc-icon-button .mdc-icon-button__touch{position:absolute;top:50%;height:48px;left:50%;width:48px;transform:translate(-50%, -50%)}.mdc-icon-button:disabled{cursor:default;pointer-events:none}.mdc-icon-button--display-flex{align-items:center;display:inline-flex;justify-content:center}.mdc-icon-button__icon{display:inline-block}.mdc-icon-button__icon.mdc-icon-button__icon--on{display:none}.mdc-icon-button--on .mdc-icon-button__icon{display:none}.mdc-icon-button--on .mdc-icon-button__icon.mdc-icon-button__icon--on{display:inline-block}.mdc-icon-button__link{height:100%;left:0;outline:none;position:absolute;top:0;width:100%}.mdc-icon-button{display:inline-block;position:relative;box-sizing:border-box;border:none;outline:none;background-color:transparent;fill:currentColor;color:inherit;text-decoration:none;cursor:pointer;user-select:none;z-index:0;overflow:visible}.mdc-icon-button .mdc-icon-button__touch{position:absolute;top:50%;height:48px;left:50%;width:48px;transform:translate(-50%, -50%)}.mdc-icon-button:disabled{cursor:default;pointer-events:none}.mdc-icon-button--display-flex{align-items:center;display:inline-flex;justify-content:center}.mdc-icon-button__icon{display:inline-block}.mdc-icon-button__icon.mdc-icon-button__icon--on{display:none}.mdc-icon-button--on .mdc-icon-button__icon{display:none}.mdc-icon-button--on .mdc-icon-button__icon.mdc-icon-button__icon--on{display:inline-block}.mdc-icon-button__link{height:100%;left:0;outline:none;position:absolute;top:0;width:100%}:host{display:inline-block;outline:none}:host([disabled]){pointer-events:none}.mdc-icon-button i,.mdc-icon-button svg,.mdc-icon-button img,.mdc-icon-button ::slotted(*){display:block}:host{--mdc-ripple-color: currentcolor;-webkit-tap-highlight-color:transparent}:host,.mdc-icon-button{vertical-align:top}.mdc-icon-button{width:var(--mdc-icon-button-size, 48px);height:var(--mdc-icon-button-size, 48px);padding:calc( (var(--mdc-icon-button-size, 48px) - var(--mdc-icon-size, 24px)) / 2 )}.mdc-icon-button i,.mdc-icon-button svg,.mdc-icon-button img,.mdc-icon-button ::slotted(*){display:block;width:var(--mdc-icon-size, 24px);height:var(--mdc-icon-size, 24px)}`;

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
function matches$1(element, selector) {
    var nativeMatches = element.matches
        || element.webkitMatchesSelector
        || element.msMatchesSelector;
    return nativeMatches.call(element, selector);
}

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore
/**
 * Determines whether a node is an element.
 *
 * @param node Node to check
 */
const isNodeElement$1 = (node) => {
    return node.nodeType === Node.ELEMENT_NODE;
};
function addHasRemoveClass$1(element) {
    return {
        addClass: (className) => {
            element.classList.add(className);
        },
        removeClass: (className) => {
            element.classList.remove(className);
        },
        hasClass: (className) => element.classList.contains(className),
    };
}
const fn$1 = () => { };
const optionsBlock$1 = {
    get passive() {
        return false;
    }
};
document.addEventListener('x', fn$1, optionsBlock$1);
document.removeEventListener('x', fn$1);
const deepActiveElementPath$1 = (doc = window.document) => {
    let activeElement = doc.activeElement;
    const path = [];
    if (!activeElement) {
        return path;
    }
    while (activeElement) {
        path.push(activeElement);
        if (activeElement.shadowRoot) {
            activeElement = activeElement.shadowRoot.activeElement;
        }
        else {
            break;
        }
    }
    return path;
};
const doesElementContainFocus$1 = (element) => {
    const activePath = deepActiveElementPath$1();
    if (!activePath.length) {
        return false;
    }
    const deepActiveElement = activePath[activePath.length - 1];
    const focusEv = new Event('check-if-focused', { bubbles: true, composed: true });
    let composedPath = [];
    const listener = (ev) => {
        composedPath = ev.composedPath();
    };
    document.body.addEventListener('check-if-focused', listener);
    deepActiveElement.dispatchEvent(focusEv);
    document.body.removeEventListener('check-if-focused', listener);
    return composedPath.indexOf(element) !== -1;
};

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/** @soyCompatible */
class BaseElement$1 extends s$1 {
    click() {
        if (this.mdcRoot) {
            this.mdcRoot.focus();
            this.mdcRoot.click();
            return;
        }
        super.click();
    }
    /**
     * Create and attach the MDC Foundation to the instance
     */
    createFoundation() {
        if (this.mdcFoundation !== undefined) {
            this.mdcFoundation.destroy();
        }
        if (this.mdcFoundationClass) {
            this.mdcFoundation = new this.mdcFoundationClass(this.createAdapter());
            this.mdcFoundation.init();
        }
    }
    firstUpdated() {
        this.createFoundation();
    }
}

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCFoundation$1 = /** @class */ (function () {
    function MDCFoundation(adapter) {
        if (adapter === void 0) { adapter = {}; }
        this.adapter = adapter;
    }
    Object.defineProperty(MDCFoundation, "cssClasses", {
        get: function () {
            // Classes extending MDCFoundation should implement this method to return an object which exports every
            // CSS class the foundation class needs as a property. e.g. {ACTIVE: 'mdc-component--active'}
            return {};
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCFoundation, "strings", {
        get: function () {
            // Classes extending MDCFoundation should implement this method to return an object which exports all
            // semantic strings as constants. e.g. {ARIA_ROLE: 'tablist'}
            return {};
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCFoundation, "numbers", {
        get: function () {
            // Classes extending MDCFoundation should implement this method to return an object which exports all
            // of its semantic numbers as constants. e.g. {ANIMATION_DELAY_MS: 350}
            return {};
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCFoundation, "defaultAdapter", {
        get: function () {
            // Classes extending MDCFoundation may choose to implement this getter in order to provide a convenient
            // way of viewing the necessary methods of an adapter. In the future, this could also be used for adapter
            // validation.
            return {};
        },
        enumerable: false,
        configurable: true
    });
    MDCFoundation.prototype.init = function () {
        // Subclasses should override this method to perform initialization routines (registering events, etc.)
    };
    MDCFoundation.prototype.destroy = function () {
        // Subclasses should override this method to perform de-initialization routines (de-registering events, etc.)
    };
    return MDCFoundation;
}());

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var cssClasses$a = {
    // Ripple is a special case where the "root" component is really a "mixin" of sorts,
    // given that it's an 'upgrade' to an existing component. That being said it is the root
    // CSS class that all other CSS classes derive from.
    BG_FOCUSED: 'mdc-ripple-upgraded--background-focused',
    FG_ACTIVATION: 'mdc-ripple-upgraded--foreground-activation',
    FG_DEACTIVATION: 'mdc-ripple-upgraded--foreground-deactivation',
    ROOT: 'mdc-ripple-upgraded',
    UNBOUNDED: 'mdc-ripple-upgraded--unbounded',
};
var strings$8 = {
    VAR_FG_SCALE: '--mdc-ripple-fg-scale',
    VAR_FG_SIZE: '--mdc-ripple-fg-size',
    VAR_FG_TRANSLATE_END: '--mdc-ripple-fg-translate-end',
    VAR_FG_TRANSLATE_START: '--mdc-ripple-fg-translate-start',
    VAR_LEFT: '--mdc-ripple-left',
    VAR_TOP: '--mdc-ripple-top',
};
var numbers$7 = {
    DEACTIVATION_TIMEOUT_MS: 225,
    FG_DEACTIVATION_MS: 150,
    INITIAL_ORIGIN_SCALE: 0.6,
    PADDING: 10,
    TAP_DELAY_MS: 300, // Delay between touch and simulated mouse events on touch devices
};

/**
 * Stores result from supportsCssVariables to avoid redundant processing to
 * detect CSS custom variable support.
 */
function getNormalizedEventCoords$1(evt, pageOffset, clientRect) {
    if (!evt) {
        return { x: 0, y: 0 };
    }
    var x = pageOffset.x, y = pageOffset.y;
    var documentX = x + clientRect.left;
    var documentY = y + clientRect.top;
    var normalizedX;
    var normalizedY;
    // Determine touch point relative to the ripple container.
    if (evt.type === 'touchstart') {
        var touchEvent = evt;
        normalizedX = touchEvent.changedTouches[0].pageX - documentX;
        normalizedY = touchEvent.changedTouches[0].pageY - documentY;
    }
    else {
        var mouseEvent = evt;
        normalizedX = mouseEvent.pageX - documentX;
        normalizedY = mouseEvent.pageY - documentY;
    }
    return { x: normalizedX, y: normalizedY };
}

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
// Activation events registered on the root element of each instance for activation
var ACTIVATION_EVENT_TYPES$1 = [
    'touchstart', 'pointerdown', 'mousedown', 'keydown',
];
// Deactivation events registered on documentElement when a pointer-related down event occurs
var POINTER_DEACTIVATION_EVENT_TYPES$1 = [
    'touchend', 'pointerup', 'mouseup', 'contextmenu',
];
// simultaneous nested activations
var activatedTargets$1 = [];
var MDCRippleFoundation$2 = /** @class */ (function (_super) {
    __extends(MDCRippleFoundation, _super);
    function MDCRippleFoundation(adapter) {
        var _this = _super.call(this, __assign(__assign({}, MDCRippleFoundation.defaultAdapter), adapter)) || this;
        _this.activationAnimationHasEnded = false;
        _this.activationTimer = 0;
        _this.fgDeactivationRemovalTimer = 0;
        _this.fgScale = '0';
        _this.frame = { width: 0, height: 0 };
        _this.initialSize = 0;
        _this.layoutFrame = 0;
        _this.maxRadius = 0;
        _this.unboundedCoords = { left: 0, top: 0 };
        _this.activationState = _this.defaultActivationState();
        _this.activationTimerCallback = function () {
            _this.activationAnimationHasEnded = true;
            _this.runDeactivationUXLogicIfReady();
        };
        _this.activateHandler = function (e) {
            _this.activateImpl(e);
        };
        _this.deactivateHandler = function () {
            _this.deactivateImpl();
        };
        _this.focusHandler = function () {
            _this.handleFocus();
        };
        _this.blurHandler = function () {
            _this.handleBlur();
        };
        _this.resizeHandler = function () {
            _this.layout();
        };
        return _this;
    }
    Object.defineProperty(MDCRippleFoundation, "cssClasses", {
        get: function () {
            return cssClasses$a;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCRippleFoundation, "strings", {
        get: function () {
            return strings$8;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCRippleFoundation, "numbers", {
        get: function () {
            return numbers$7;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCRippleFoundation, "defaultAdapter", {
        get: function () {
            return {
                addClass: function () { return undefined; },
                browserSupportsCssVars: function () { return true; },
                computeBoundingRect: function () {
                    return ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 });
                },
                containsEventTarget: function () { return true; },
                deregisterDocumentInteractionHandler: function () { return undefined; },
                deregisterInteractionHandler: function () { return undefined; },
                deregisterResizeHandler: function () { return undefined; },
                getWindowPageOffset: function () { return ({ x: 0, y: 0 }); },
                isSurfaceActive: function () { return true; },
                isSurfaceDisabled: function () { return true; },
                isUnbounded: function () { return true; },
                registerDocumentInteractionHandler: function () { return undefined; },
                registerInteractionHandler: function () { return undefined; },
                registerResizeHandler: function () { return undefined; },
                removeClass: function () { return undefined; },
                updateCssVariable: function () { return undefined; },
            };
        },
        enumerable: false,
        configurable: true
    });
    MDCRippleFoundation.prototype.init = function () {
        var _this = this;
        var supportsPressRipple = this.supportsPressRipple();
        this.registerRootHandlers(supportsPressRipple);
        if (supportsPressRipple) {
            var _a = MDCRippleFoundation.cssClasses, ROOT_1 = _a.ROOT, UNBOUNDED_1 = _a.UNBOUNDED;
            requestAnimationFrame(function () {
                _this.adapter.addClass(ROOT_1);
                if (_this.adapter.isUnbounded()) {
                    _this.adapter.addClass(UNBOUNDED_1);
                    // Unbounded ripples need layout logic applied immediately to set coordinates for both shade and ripple
                    _this.layoutInternal();
                }
            });
        }
    };
    MDCRippleFoundation.prototype.destroy = function () {
        var _this = this;
        if (this.supportsPressRipple()) {
            if (this.activationTimer) {
                clearTimeout(this.activationTimer);
                this.activationTimer = 0;
                this.adapter.removeClass(MDCRippleFoundation.cssClasses.FG_ACTIVATION);
            }
            if (this.fgDeactivationRemovalTimer) {
                clearTimeout(this.fgDeactivationRemovalTimer);
                this.fgDeactivationRemovalTimer = 0;
                this.adapter.removeClass(MDCRippleFoundation.cssClasses.FG_DEACTIVATION);
            }
            var _a = MDCRippleFoundation.cssClasses, ROOT_2 = _a.ROOT, UNBOUNDED_2 = _a.UNBOUNDED;
            requestAnimationFrame(function () {
                _this.adapter.removeClass(ROOT_2);
                _this.adapter.removeClass(UNBOUNDED_2);
                _this.removeCssVars();
            });
        }
        this.deregisterRootHandlers();
        this.deregisterDeactivationHandlers();
    };
    /**
     * @param evt Optional event containing position information.
     */
    MDCRippleFoundation.prototype.activate = function (evt) {
        this.activateImpl(evt);
    };
    MDCRippleFoundation.prototype.deactivate = function () {
        this.deactivateImpl();
    };
    MDCRippleFoundation.prototype.layout = function () {
        var _this = this;
        if (this.layoutFrame) {
            cancelAnimationFrame(this.layoutFrame);
        }
        this.layoutFrame = requestAnimationFrame(function () {
            _this.layoutInternal();
            _this.layoutFrame = 0;
        });
    };
    MDCRippleFoundation.prototype.setUnbounded = function (unbounded) {
        var UNBOUNDED = MDCRippleFoundation.cssClasses.UNBOUNDED;
        if (unbounded) {
            this.adapter.addClass(UNBOUNDED);
        }
        else {
            this.adapter.removeClass(UNBOUNDED);
        }
    };
    MDCRippleFoundation.prototype.handleFocus = function () {
        var _this = this;
        requestAnimationFrame(function () { return _this.adapter.addClass(MDCRippleFoundation.cssClasses.BG_FOCUSED); });
    };
    MDCRippleFoundation.prototype.handleBlur = function () {
        var _this = this;
        requestAnimationFrame(function () { return _this.adapter.removeClass(MDCRippleFoundation.cssClasses.BG_FOCUSED); });
    };
    /**
     * We compute this property so that we are not querying information about the client
     * until the point in time where the foundation requests it. This prevents scenarios where
     * client-side feature-detection may happen too early, such as when components are rendered on the server
     * and then initialized at mount time on the client.
     */
    MDCRippleFoundation.prototype.supportsPressRipple = function () {
        return this.adapter.browserSupportsCssVars();
    };
    MDCRippleFoundation.prototype.defaultActivationState = function () {
        return {
            activationEvent: undefined,
            hasDeactivationUXRun: false,
            isActivated: false,
            isProgrammatic: false,
            wasActivatedByPointer: false,
            wasElementMadeActive: false,
        };
    };
    /**
     * supportsPressRipple Passed from init to save a redundant function call
     */
    MDCRippleFoundation.prototype.registerRootHandlers = function (supportsPressRipple) {
        var e_1, _a;
        if (supportsPressRipple) {
            try {
                for (var ACTIVATION_EVENT_TYPES_1 = __values(ACTIVATION_EVENT_TYPES$1), ACTIVATION_EVENT_TYPES_1_1 = ACTIVATION_EVENT_TYPES_1.next(); !ACTIVATION_EVENT_TYPES_1_1.done; ACTIVATION_EVENT_TYPES_1_1 = ACTIVATION_EVENT_TYPES_1.next()) {
                    var evtType = ACTIVATION_EVENT_TYPES_1_1.value;
                    this.adapter.registerInteractionHandler(evtType, this.activateHandler);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (ACTIVATION_EVENT_TYPES_1_1 && !ACTIVATION_EVENT_TYPES_1_1.done && (_a = ACTIVATION_EVENT_TYPES_1.return)) _a.call(ACTIVATION_EVENT_TYPES_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (this.adapter.isUnbounded()) {
                this.adapter.registerResizeHandler(this.resizeHandler);
            }
        }
        this.adapter.registerInteractionHandler('focus', this.focusHandler);
        this.adapter.registerInteractionHandler('blur', this.blurHandler);
    };
    MDCRippleFoundation.prototype.registerDeactivationHandlers = function (evt) {
        var e_2, _a;
        if (evt.type === 'keydown') {
            this.adapter.registerInteractionHandler('keyup', this.deactivateHandler);
        }
        else {
            try {
                for (var POINTER_DEACTIVATION_EVENT_TYPES_1 = __values(POINTER_DEACTIVATION_EVENT_TYPES$1), POINTER_DEACTIVATION_EVENT_TYPES_1_1 = POINTER_DEACTIVATION_EVENT_TYPES_1.next(); !POINTER_DEACTIVATION_EVENT_TYPES_1_1.done; POINTER_DEACTIVATION_EVENT_TYPES_1_1 = POINTER_DEACTIVATION_EVENT_TYPES_1.next()) {
                    var evtType = POINTER_DEACTIVATION_EVENT_TYPES_1_1.value;
                    this.adapter.registerDocumentInteractionHandler(evtType, this.deactivateHandler);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (POINTER_DEACTIVATION_EVENT_TYPES_1_1 && !POINTER_DEACTIVATION_EVENT_TYPES_1_1.done && (_a = POINTER_DEACTIVATION_EVENT_TYPES_1.return)) _a.call(POINTER_DEACTIVATION_EVENT_TYPES_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    };
    MDCRippleFoundation.prototype.deregisterRootHandlers = function () {
        var e_3, _a;
        try {
            for (var ACTIVATION_EVENT_TYPES_2 = __values(ACTIVATION_EVENT_TYPES$1), ACTIVATION_EVENT_TYPES_2_1 = ACTIVATION_EVENT_TYPES_2.next(); !ACTIVATION_EVENT_TYPES_2_1.done; ACTIVATION_EVENT_TYPES_2_1 = ACTIVATION_EVENT_TYPES_2.next()) {
                var evtType = ACTIVATION_EVENT_TYPES_2_1.value;
                this.adapter.deregisterInteractionHandler(evtType, this.activateHandler);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (ACTIVATION_EVENT_TYPES_2_1 && !ACTIVATION_EVENT_TYPES_2_1.done && (_a = ACTIVATION_EVENT_TYPES_2.return)) _a.call(ACTIVATION_EVENT_TYPES_2);
            }
            finally { if (e_3) throw e_3.error; }
        }
        this.adapter.deregisterInteractionHandler('focus', this.focusHandler);
        this.adapter.deregisterInteractionHandler('blur', this.blurHandler);
        if (this.adapter.isUnbounded()) {
            this.adapter.deregisterResizeHandler(this.resizeHandler);
        }
    };
    MDCRippleFoundation.prototype.deregisterDeactivationHandlers = function () {
        var e_4, _a;
        this.adapter.deregisterInteractionHandler('keyup', this.deactivateHandler);
        try {
            for (var POINTER_DEACTIVATION_EVENT_TYPES_2 = __values(POINTER_DEACTIVATION_EVENT_TYPES$1), POINTER_DEACTIVATION_EVENT_TYPES_2_1 = POINTER_DEACTIVATION_EVENT_TYPES_2.next(); !POINTER_DEACTIVATION_EVENT_TYPES_2_1.done; POINTER_DEACTIVATION_EVENT_TYPES_2_1 = POINTER_DEACTIVATION_EVENT_TYPES_2.next()) {
                var evtType = POINTER_DEACTIVATION_EVENT_TYPES_2_1.value;
                this.adapter.deregisterDocumentInteractionHandler(evtType, this.deactivateHandler);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (POINTER_DEACTIVATION_EVENT_TYPES_2_1 && !POINTER_DEACTIVATION_EVENT_TYPES_2_1.done && (_a = POINTER_DEACTIVATION_EVENT_TYPES_2.return)) _a.call(POINTER_DEACTIVATION_EVENT_TYPES_2);
            }
            finally { if (e_4) throw e_4.error; }
        }
    };
    MDCRippleFoundation.prototype.removeCssVars = function () {
        var _this = this;
        var rippleStrings = MDCRippleFoundation.strings;
        var keys = Object.keys(rippleStrings);
        keys.forEach(function (key) {
            if (key.indexOf('VAR_') === 0) {
                _this.adapter.updateCssVariable(rippleStrings[key], null);
            }
        });
    };
    MDCRippleFoundation.prototype.activateImpl = function (evt) {
        var _this = this;
        if (this.adapter.isSurfaceDisabled()) {
            return;
        }
        var activationState = this.activationState;
        if (activationState.isActivated) {
            return;
        }
        // Avoid reacting to follow-on events fired by touch device after an already-processed user interaction
        var previousActivationEvent = this.previousActivationEvent;
        var isSameInteraction = previousActivationEvent && evt !== undefined && previousActivationEvent.type !== evt.type;
        if (isSameInteraction) {
            return;
        }
        activationState.isActivated = true;
        activationState.isProgrammatic = evt === undefined;
        activationState.activationEvent = evt;
        activationState.wasActivatedByPointer = activationState.isProgrammatic ? false : evt !== undefined && (evt.type === 'mousedown' || evt.type === 'touchstart' || evt.type === 'pointerdown');
        var hasActivatedChild = evt !== undefined &&
            activatedTargets$1.length > 0 &&
            activatedTargets$1.some(function (target) { return _this.adapter.containsEventTarget(target); });
        if (hasActivatedChild) {
            // Immediately reset activation state, while preserving logic that prevents touch follow-on events
            this.resetActivationState();
            return;
        }
        if (evt !== undefined) {
            activatedTargets$1.push(evt.target);
            this.registerDeactivationHandlers(evt);
        }
        activationState.wasElementMadeActive = this.checkElementMadeActive(evt);
        if (activationState.wasElementMadeActive) {
            this.animateActivation();
        }
        requestAnimationFrame(function () {
            // Reset array on next frame after the current event has had a chance to bubble to prevent ancestor ripples
            activatedTargets$1 = [];
            if (!activationState.wasElementMadeActive
                && evt !== undefined
                && (evt.key === ' ' || evt.keyCode === 32)) {
                // If space was pressed, try again within an rAF call to detect :active, because different UAs report
                // active states inconsistently when they're called within event handling code:
                // - https://bugs.chromium.org/p/chromium/issues/detail?id=635971
                // - https://bugzilla.mozilla.org/show_bug.cgi?id=1293741
                // We try first outside rAF to support Edge, which does not exhibit this problem, but will crash if a CSS
                // variable is set within a rAF callback for a submit button interaction (#2241).
                activationState.wasElementMadeActive = _this.checkElementMadeActive(evt);
                if (activationState.wasElementMadeActive) {
                    _this.animateActivation();
                }
            }
            if (!activationState.wasElementMadeActive) {
                // Reset activation state immediately if element was not made active.
                _this.activationState = _this.defaultActivationState();
            }
        });
    };
    MDCRippleFoundation.prototype.checkElementMadeActive = function (evt) {
        return (evt !== undefined && evt.type === 'keydown') ?
            this.adapter.isSurfaceActive() :
            true;
    };
    MDCRippleFoundation.prototype.animateActivation = function () {
        var _this = this;
        var _a = MDCRippleFoundation.strings, VAR_FG_TRANSLATE_START = _a.VAR_FG_TRANSLATE_START, VAR_FG_TRANSLATE_END = _a.VAR_FG_TRANSLATE_END;
        var _b = MDCRippleFoundation.cssClasses, FG_DEACTIVATION = _b.FG_DEACTIVATION, FG_ACTIVATION = _b.FG_ACTIVATION;
        var DEACTIVATION_TIMEOUT_MS = MDCRippleFoundation.numbers.DEACTIVATION_TIMEOUT_MS;
        this.layoutInternal();
        var translateStart = '';
        var translateEnd = '';
        if (!this.adapter.isUnbounded()) {
            var _c = this.getFgTranslationCoordinates(), startPoint = _c.startPoint, endPoint = _c.endPoint;
            translateStart = startPoint.x + "px, " + startPoint.y + "px";
            translateEnd = endPoint.x + "px, " + endPoint.y + "px";
        }
        this.adapter.updateCssVariable(VAR_FG_TRANSLATE_START, translateStart);
        this.adapter.updateCssVariable(VAR_FG_TRANSLATE_END, translateEnd);
        // Cancel any ongoing activation/deactivation animations
        clearTimeout(this.activationTimer);
        clearTimeout(this.fgDeactivationRemovalTimer);
        this.rmBoundedActivationClasses();
        this.adapter.removeClass(FG_DEACTIVATION);
        // Force layout in order to re-trigger the animation.
        this.adapter.computeBoundingRect();
        this.adapter.addClass(FG_ACTIVATION);
        this.activationTimer = setTimeout(function () {
            _this.activationTimerCallback();
        }, DEACTIVATION_TIMEOUT_MS);
    };
    MDCRippleFoundation.prototype.getFgTranslationCoordinates = function () {
        var _a = this.activationState, activationEvent = _a.activationEvent, wasActivatedByPointer = _a.wasActivatedByPointer;
        var startPoint;
        if (wasActivatedByPointer) {
            startPoint = getNormalizedEventCoords$1(activationEvent, this.adapter.getWindowPageOffset(), this.adapter.computeBoundingRect());
        }
        else {
            startPoint = {
                x: this.frame.width / 2,
                y: this.frame.height / 2,
            };
        }
        // Center the element around the start point.
        startPoint = {
            x: startPoint.x - (this.initialSize / 2),
            y: startPoint.y - (this.initialSize / 2),
        };
        var endPoint = {
            x: (this.frame.width / 2) - (this.initialSize / 2),
            y: (this.frame.height / 2) - (this.initialSize / 2),
        };
        return { startPoint: startPoint, endPoint: endPoint };
    };
    MDCRippleFoundation.prototype.runDeactivationUXLogicIfReady = function () {
        var _this = this;
        // This method is called both when a pointing device is released, and when the activation animation ends.
        // The deactivation animation should only run after both of those occur.
        var FG_DEACTIVATION = MDCRippleFoundation.cssClasses.FG_DEACTIVATION;
        var _a = this.activationState, hasDeactivationUXRun = _a.hasDeactivationUXRun, isActivated = _a.isActivated;
        var activationHasEnded = hasDeactivationUXRun || !isActivated;
        if (activationHasEnded && this.activationAnimationHasEnded) {
            this.rmBoundedActivationClasses();
            this.adapter.addClass(FG_DEACTIVATION);
            this.fgDeactivationRemovalTimer = setTimeout(function () {
                _this.adapter.removeClass(FG_DEACTIVATION);
            }, numbers$7.FG_DEACTIVATION_MS);
        }
    };
    MDCRippleFoundation.prototype.rmBoundedActivationClasses = function () {
        var FG_ACTIVATION = MDCRippleFoundation.cssClasses.FG_ACTIVATION;
        this.adapter.removeClass(FG_ACTIVATION);
        this.activationAnimationHasEnded = false;
        this.adapter.computeBoundingRect();
    };
    MDCRippleFoundation.prototype.resetActivationState = function () {
        var _this = this;
        this.previousActivationEvent = this.activationState.activationEvent;
        this.activationState = this.defaultActivationState();
        // Touch devices may fire additional events for the same interaction within a short time.
        // Store the previous event until it's safe to assume that subsequent events are for new interactions.
        setTimeout(function () { return _this.previousActivationEvent = undefined; }, MDCRippleFoundation.numbers.TAP_DELAY_MS);
    };
    MDCRippleFoundation.prototype.deactivateImpl = function () {
        var _this = this;
        var activationState = this.activationState;
        // This can happen in scenarios such as when you have a keyup event that blurs the element.
        if (!activationState.isActivated) {
            return;
        }
        var state = __assign({}, activationState);
        if (activationState.isProgrammatic) {
            requestAnimationFrame(function () {
                _this.animateDeactivation(state);
            });
            this.resetActivationState();
        }
        else {
            this.deregisterDeactivationHandlers();
            requestAnimationFrame(function () {
                _this.activationState.hasDeactivationUXRun = true;
                _this.animateDeactivation(state);
                _this.resetActivationState();
            });
        }
    };
    MDCRippleFoundation.prototype.animateDeactivation = function (_a) {
        var wasActivatedByPointer = _a.wasActivatedByPointer, wasElementMadeActive = _a.wasElementMadeActive;
        if (wasActivatedByPointer || wasElementMadeActive) {
            this.runDeactivationUXLogicIfReady();
        }
    };
    MDCRippleFoundation.prototype.layoutInternal = function () {
        var _this = this;
        this.frame = this.adapter.computeBoundingRect();
        var maxDim = Math.max(this.frame.height, this.frame.width);
        // Surface diameter is treated differently for unbounded vs. bounded ripples.
        // Unbounded ripple diameter is calculated smaller since the surface is expected to already be padded appropriately
        // to extend the hitbox, and the ripple is expected to meet the edges of the padded hitbox (which is typically
        // square). Bounded ripples, on the other hand, are fully expected to expand beyond the surface's longest diameter
        // (calculated based on the diagonal plus a constant padding), and are clipped at the surface's border via
        // `overflow: hidden`.
        var getBoundedRadius = function () {
            var hypotenuse = Math.sqrt(Math.pow(_this.frame.width, 2) + Math.pow(_this.frame.height, 2));
            return hypotenuse + MDCRippleFoundation.numbers.PADDING;
        };
        this.maxRadius = this.adapter.isUnbounded() ? maxDim : getBoundedRadius();
        // Ripple is sized as a fraction of the largest dimension of the surface, then scales up using a CSS scale transform
        var initialSize = Math.floor(maxDim * MDCRippleFoundation.numbers.INITIAL_ORIGIN_SCALE);
        // Unbounded ripple size should always be even number to equally center align.
        if (this.adapter.isUnbounded() && initialSize % 2 !== 0) {
            this.initialSize = initialSize - 1;
        }
        else {
            this.initialSize = initialSize;
        }
        this.fgScale = "" + this.maxRadius / this.initialSize;
        this.updateLayoutCssVars();
    };
    MDCRippleFoundation.prototype.updateLayoutCssVars = function () {
        var _a = MDCRippleFoundation.strings, VAR_FG_SIZE = _a.VAR_FG_SIZE, VAR_LEFT = _a.VAR_LEFT, VAR_TOP = _a.VAR_TOP, VAR_FG_SCALE = _a.VAR_FG_SCALE;
        this.adapter.updateCssVariable(VAR_FG_SIZE, this.initialSize + "px");
        this.adapter.updateCssVariable(VAR_FG_SCALE, this.fgScale);
        if (this.adapter.isUnbounded()) {
            this.unboundedCoords = {
                left: Math.round((this.frame.width / 2) - (this.initialSize / 2)),
                top: Math.round((this.frame.height / 2) - (this.initialSize / 2)),
            };
            this.adapter.updateCssVariable(VAR_LEFT, this.unboundedCoords.left + "px");
            this.adapter.updateCssVariable(VAR_TOP, this.unboundedCoords.top + "px");
        }
    };
    return MDCRippleFoundation;
}(MDCFoundation$1));
// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
var MDCRippleFoundation$3 = MDCRippleFoundation$2;

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const i=e(class extends i$1{constructor(t$1){var e;if(super(t$1),t$1.type!==t.ATTRIBUTE||"style"!==t$1.name||(null===(e=t$1.strings)||void 0===e?void 0:e.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce(((e,r)=>{const s=t[r];return null==s?e:e+`${r=r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`}),"")}update(e,[r]){const{style:s}=e.element;if(void 0===this.vt){this.vt=new Set;for(const t in r)this.vt.add(t);return this.render(r)}this.vt.forEach((t=>{null==r[t]&&(this.vt.delete(t),t.includes("-")?s.removeProperty(t):s[t]="");}));for(const t in r){const e=r[t];null!=e&&(this.vt.add(t),t.includes("-")?s.setProperty(t,e):s[t]=e);}return T}});

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/** @soyCompatible */
class RippleBase$1 extends BaseElement$1 {
    constructor() {
        super(...arguments);
        this.primary = false;
        this.accent = false;
        this.unbounded = false;
        this.disabled = false;
        this.activated = false;
        this.selected = false;
        this.internalUseStateLayerCustomProperties = false;
        this.hovering = false;
        this.bgFocused = false;
        this.fgActivation = false;
        this.fgDeactivation = false;
        this.fgScale = '';
        this.fgSize = '';
        this.translateStart = '';
        this.translateEnd = '';
        this.leftPos = '';
        this.topPos = '';
        this.mdcFoundationClass = MDCRippleFoundation$3;
    }
    get isActive() {
        return matches$1(this.parentElement || this, ':active');
    }
    createAdapter() {
        return {
            browserSupportsCssVars: () => true,
            isUnbounded: () => this.unbounded,
            isSurfaceActive: () => this.isActive,
            isSurfaceDisabled: () => this.disabled,
            addClass: (className) => {
                switch (className) {
                    case 'mdc-ripple-upgraded--background-focused':
                        this.bgFocused = true;
                        break;
                    case 'mdc-ripple-upgraded--foreground-activation':
                        this.fgActivation = true;
                        break;
                    case 'mdc-ripple-upgraded--foreground-deactivation':
                        this.fgDeactivation = true;
                        break;
                }
            },
            removeClass: (className) => {
                switch (className) {
                    case 'mdc-ripple-upgraded--background-focused':
                        this.bgFocused = false;
                        break;
                    case 'mdc-ripple-upgraded--foreground-activation':
                        this.fgActivation = false;
                        break;
                    case 'mdc-ripple-upgraded--foreground-deactivation':
                        this.fgDeactivation = false;
                        break;
                }
            },
            containsEventTarget: () => true,
            registerInteractionHandler: () => undefined,
            deregisterInteractionHandler: () => undefined,
            registerDocumentInteractionHandler: () => undefined,
            deregisterDocumentInteractionHandler: () => undefined,
            registerResizeHandler: () => undefined,
            deregisterResizeHandler: () => undefined,
            updateCssVariable: (varName, value) => {
                switch (varName) {
                    case '--mdc-ripple-fg-scale':
                        this.fgScale = value;
                        break;
                    case '--mdc-ripple-fg-size':
                        this.fgSize = value;
                        break;
                    case '--mdc-ripple-fg-translate-end':
                        this.translateEnd = value;
                        break;
                    case '--mdc-ripple-fg-translate-start':
                        this.translateStart = value;
                        break;
                    case '--mdc-ripple-left':
                        this.leftPos = value;
                        break;
                    case '--mdc-ripple-top':
                        this.topPos = value;
                        break;
                }
            },
            computeBoundingRect: () => (this.parentElement || this).getBoundingClientRect(),
            getWindowPageOffset: () => ({ x: window.pageXOffset, y: window.pageYOffset }),
        };
    }
    startPress(ev) {
        this.waitForFoundation(() => {
            this.mdcFoundation.activate(ev);
        });
    }
    endPress() {
        this.waitForFoundation(() => {
            this.mdcFoundation.deactivate();
        });
    }
    startFocus() {
        this.waitForFoundation(() => {
            this.mdcFoundation.handleFocus();
        });
    }
    endFocus() {
        this.waitForFoundation(() => {
            this.mdcFoundation.handleBlur();
        });
    }
    startHover() {
        this.hovering = true;
    }
    endHover() {
        this.hovering = false;
    }
    /**
     * Wait for the MDCFoundation to be created by `firstUpdated`
     */
    waitForFoundation(fn) {
        if (this.mdcFoundation) {
            fn();
        }
        else {
            this.updateComplete.then(fn);
        }
    }
    update(changedProperties) {
        if (changedProperties.has('disabled')) {
            // stop hovering when ripple is disabled to prevent a stuck "hover" state
            // When re-enabled, the outer component will get a `mouseenter` event on
            // the first movement, which will call `startHover()`
            if (this.disabled) {
                this.endHover();
            }
        }
        super.update(changedProperties);
    }
    /** @soyTemplate */
    render() {
        const shouldActivateInPrimary = this.activated && (this.primary || !this.accent);
        const shouldSelectInPrimary = this.selected && (this.primary || !this.accent);
        /** @classMap */
        const classes = {
            'mdc-ripple-surface--accent': this.accent,
            'mdc-ripple-surface--primary--activated': shouldActivateInPrimary,
            'mdc-ripple-surface--accent--activated': this.accent && this.activated,
            'mdc-ripple-surface--primary--selected': shouldSelectInPrimary,
            'mdc-ripple-surface--accent--selected': this.accent && this.selected,
            'mdc-ripple-surface--disabled': this.disabled,
            'mdc-ripple-surface--hover': this.hovering,
            'mdc-ripple-surface--primary': this.primary,
            'mdc-ripple-surface--selected': this.selected,
            'mdc-ripple-upgraded--background-focused': this.bgFocused,
            'mdc-ripple-upgraded--foreground-activation': this.fgActivation,
            'mdc-ripple-upgraded--foreground-deactivation': this.fgDeactivation,
            'mdc-ripple-upgraded--unbounded': this.unbounded,
            'mdc-ripple-surface--internal-use-state-layer-custom-properties': this.internalUseStateLayerCustomProperties,
        };
        return x `
        <div class="mdc-ripple-surface mdc-ripple-upgraded ${o(classes)}"
          style="${i({
            '--mdc-ripple-fg-scale': this.fgScale,
            '--mdc-ripple-fg-size': this.fgSize,
            '--mdc-ripple-fg-translate-end': this.translateEnd,
            '--mdc-ripple-fg-translate-start': this.translateStart,
            '--mdc-ripple-left': this.leftPos,
            '--mdc-ripple-top': this.topPos,
        })}"></div>`;
    }
}
__decorate([
    i$2('.mdc-ripple-surface')
], RippleBase$1.prototype, "mdcRoot", void 0);
__decorate([
    e$4({ type: Boolean })
], RippleBase$1.prototype, "primary", void 0);
__decorate([
    e$4({ type: Boolean })
], RippleBase$1.prototype, "accent", void 0);
__decorate([
    e$4({ type: Boolean })
], RippleBase$1.prototype, "unbounded", void 0);
__decorate([
    e$4({ type: Boolean })
], RippleBase$1.prototype, "disabled", void 0);
__decorate([
    e$4({ type: Boolean })
], RippleBase$1.prototype, "activated", void 0);
__decorate([
    e$4({ type: Boolean })
], RippleBase$1.prototype, "selected", void 0);
__decorate([
    e$4({ type: Boolean })
], RippleBase$1.prototype, "internalUseStateLayerCustomProperties", void 0);
__decorate([
    t$1()
], RippleBase$1.prototype, "hovering", void 0);
__decorate([
    t$1()
], RippleBase$1.prototype, "bgFocused", void 0);
__decorate([
    t$1()
], RippleBase$1.prototype, "fgActivation", void 0);
__decorate([
    t$1()
], RippleBase$1.prototype, "fgDeactivation", void 0);
__decorate([
    t$1()
], RippleBase$1.prototype, "fgScale", void 0);
__decorate([
    t$1()
], RippleBase$1.prototype, "fgSize", void 0);
__decorate([
    t$1()
], RippleBase$1.prototype, "translateStart", void 0);
__decorate([
    t$1()
], RippleBase$1.prototype, "translateEnd", void 0);
__decorate([
    t$1()
], RippleBase$1.prototype, "leftPos", void 0);
__decorate([
    t$1()
], RippleBase$1.prototype, "topPos", void 0);

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
const styles$e = i$5 `.mdc-ripple-surface{--mdc-ripple-fg-size: 0;--mdc-ripple-left: 0;--mdc-ripple-top: 0;--mdc-ripple-fg-scale: 1;--mdc-ripple-fg-translate-end: 0;--mdc-ripple-fg-translate-start: 0;-webkit-tap-highlight-color:rgba(0,0,0,0);will-change:transform,opacity;position:relative;outline:none;overflow:hidden}.mdc-ripple-surface::before,.mdc-ripple-surface::after{position:absolute;border-radius:50%;opacity:0;pointer-events:none;content:""}.mdc-ripple-surface::before{transition:opacity 15ms linear,background-color 15ms linear;z-index:1;z-index:var(--mdc-ripple-z-index, 1)}.mdc-ripple-surface::after{z-index:0;z-index:var(--mdc-ripple-z-index, 0)}.mdc-ripple-surface.mdc-ripple-upgraded::before{transform:scale(var(--mdc-ripple-fg-scale, 1))}.mdc-ripple-surface.mdc-ripple-upgraded::after{top:0;left:0;transform:scale(0);transform-origin:center center}.mdc-ripple-surface.mdc-ripple-upgraded--unbounded::after{top:var(--mdc-ripple-top, 0);left:var(--mdc-ripple-left, 0)}.mdc-ripple-surface.mdc-ripple-upgraded--foreground-activation::after{animation:mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards}.mdc-ripple-surface.mdc-ripple-upgraded--foreground-deactivation::after{animation:mdc-ripple-fg-opacity-out 150ms;transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}.mdc-ripple-surface::before,.mdc-ripple-surface::after{top:calc(50% - 100%);left:calc(50% - 100%);width:200%;height:200%}.mdc-ripple-surface.mdc-ripple-upgraded::after{width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-ripple-surface[data-mdc-ripple-is-unbounded],.mdc-ripple-upgraded--unbounded{overflow:visible}.mdc-ripple-surface[data-mdc-ripple-is-unbounded]::before,.mdc-ripple-surface[data-mdc-ripple-is-unbounded]::after,.mdc-ripple-upgraded--unbounded::before,.mdc-ripple-upgraded--unbounded::after{top:calc(50% - 50%);left:calc(50% - 50%);width:100%;height:100%}.mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::before,.mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::after,.mdc-ripple-upgraded--unbounded.mdc-ripple-upgraded::before,.mdc-ripple-upgraded--unbounded.mdc-ripple-upgraded::after{top:var(--mdc-ripple-top, calc(50% - 50%));left:var(--mdc-ripple-left, calc(50% - 50%));width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::after,.mdc-ripple-upgraded--unbounded.mdc-ripple-upgraded::after{width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-ripple-surface::before,.mdc-ripple-surface::after{background-color:#000;background-color:var(--mdc-ripple-color, #000)}.mdc-ripple-surface:hover::before,.mdc-ripple-surface.mdc-ripple-surface--hover::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-ripple-surface.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-ripple-surface:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-ripple-surface.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}@keyframes mdc-ripple-fg-radius-in{from{animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transform:translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1)}to{transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}}@keyframes mdc-ripple-fg-opacity-in{from{animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity, 0)}}@keyframes mdc-ripple-fg-opacity-out{from{animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity, 0)}to{opacity:0}}:host{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;display:block}:host .mdc-ripple-surface{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;will-change:unset}.mdc-ripple-surface--primary::before,.mdc-ripple-surface--primary::after{background-color:#6200ee;background-color:var(--mdc-ripple-color, var(--mdc-theme-primary, #6200ee))}.mdc-ripple-surface--primary:hover::before,.mdc-ripple-surface--primary.mdc-ripple-surface--hover::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-ripple-surface--primary.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--primary:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-ripple-surface--primary:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--primary:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-ripple-surface--primary.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-ripple-surface--primary--activated::before{opacity:0.12;opacity:var(--mdc-ripple-activated-opacity, 0.12)}.mdc-ripple-surface--primary--activated::before,.mdc-ripple-surface--primary--activated::after{background-color:#6200ee;background-color:var(--mdc-ripple-color, var(--mdc-theme-primary, #6200ee))}.mdc-ripple-surface--primary--activated:hover::before,.mdc-ripple-surface--primary--activated.mdc-ripple-surface--hover::before{opacity:0.16;opacity:var(--mdc-ripple-hover-opacity, 0.16)}.mdc-ripple-surface--primary--activated.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--primary--activated:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.24;opacity:var(--mdc-ripple-focus-opacity, 0.24)}.mdc-ripple-surface--primary--activated:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--primary--activated:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.24;opacity:var(--mdc-ripple-press-opacity, 0.24)}.mdc-ripple-surface--primary--activated.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.24)}.mdc-ripple-surface--primary--selected::before{opacity:0.08;opacity:var(--mdc-ripple-selected-opacity, 0.08)}.mdc-ripple-surface--primary--selected::before,.mdc-ripple-surface--primary--selected::after{background-color:#6200ee;background-color:var(--mdc-ripple-color, var(--mdc-theme-primary, #6200ee))}.mdc-ripple-surface--primary--selected:hover::before,.mdc-ripple-surface--primary--selected.mdc-ripple-surface--hover::before{opacity:0.12;opacity:var(--mdc-ripple-hover-opacity, 0.12)}.mdc-ripple-surface--primary--selected.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--primary--selected:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.2;opacity:var(--mdc-ripple-focus-opacity, 0.2)}.mdc-ripple-surface--primary--selected:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--primary--selected:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.2;opacity:var(--mdc-ripple-press-opacity, 0.2)}.mdc-ripple-surface--primary--selected.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.2)}.mdc-ripple-surface--accent::before,.mdc-ripple-surface--accent::after{background-color:#018786;background-color:var(--mdc-ripple-color, var(--mdc-theme-secondary, #018786))}.mdc-ripple-surface--accent:hover::before,.mdc-ripple-surface--accent.mdc-ripple-surface--hover::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-ripple-surface--accent.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--accent:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-ripple-surface--accent:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--accent:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-ripple-surface--accent.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-ripple-surface--accent--activated::before{opacity:0.12;opacity:var(--mdc-ripple-activated-opacity, 0.12)}.mdc-ripple-surface--accent--activated::before,.mdc-ripple-surface--accent--activated::after{background-color:#018786;background-color:var(--mdc-ripple-color, var(--mdc-theme-secondary, #018786))}.mdc-ripple-surface--accent--activated:hover::before,.mdc-ripple-surface--accent--activated.mdc-ripple-surface--hover::before{opacity:0.16;opacity:var(--mdc-ripple-hover-opacity, 0.16)}.mdc-ripple-surface--accent--activated.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--accent--activated:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.24;opacity:var(--mdc-ripple-focus-opacity, 0.24)}.mdc-ripple-surface--accent--activated:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--accent--activated:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.24;opacity:var(--mdc-ripple-press-opacity, 0.24)}.mdc-ripple-surface--accent--activated.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.24)}.mdc-ripple-surface--accent--selected::before{opacity:0.08;opacity:var(--mdc-ripple-selected-opacity, 0.08)}.mdc-ripple-surface--accent--selected::before,.mdc-ripple-surface--accent--selected::after{background-color:#018786;background-color:var(--mdc-ripple-color, var(--mdc-theme-secondary, #018786))}.mdc-ripple-surface--accent--selected:hover::before,.mdc-ripple-surface--accent--selected.mdc-ripple-surface--hover::before{opacity:0.12;opacity:var(--mdc-ripple-hover-opacity, 0.12)}.mdc-ripple-surface--accent--selected.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--accent--selected:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.2;opacity:var(--mdc-ripple-focus-opacity, 0.2)}.mdc-ripple-surface--accent--selected:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--accent--selected:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.2;opacity:var(--mdc-ripple-press-opacity, 0.2)}.mdc-ripple-surface--accent--selected.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.2)}.mdc-ripple-surface--disabled{opacity:0}.mdc-ripple-surface--internal-use-state-layer-custom-properties::before,.mdc-ripple-surface--internal-use-state-layer-custom-properties::after{background-color:#000;background-color:var(--mdc-ripple-hover-state-layer-color, #000)}.mdc-ripple-surface--internal-use-state-layer-custom-properties:hover::before,.mdc-ripple-surface--internal-use-state-layer-custom-properties.mdc-ripple-surface--hover::before{opacity:0.04;opacity:var(--mdc-ripple-hover-state-layer-opacity, 0.04)}.mdc-ripple-surface--internal-use-state-layer-custom-properties.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--internal-use-state-layer-custom-properties:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-state-layer-opacity, 0.12)}.mdc-ripple-surface--internal-use-state-layer-custom-properties:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--internal-use-state-layer-custom-properties:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-pressed-state-layer-opacity, 0.12)}.mdc-ripple-surface--internal-use-state-layer-custom-properties.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-pressed-state-layer-opacity, 0.12)}`;

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/** @soyCompatible */
let Ripple$1 = class Ripple extends RippleBase$1 {
};
Ripple$1.styles = [styles$e];
Ripple$1 = __decorate([
    e$5('mwc-ripple')
], Ripple$1);

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * TypeScript version of the decorator
 * @see https://www.typescriptlang.org/docs/handbook/decorators.html#property-decorators
 */
function tsDecorator$1(prototype, name, descriptor) {
    const constructor = prototype.constructor;
    if (!descriptor) {
        /**
         * lit uses internal properties with two leading underscores to
         * provide storage for accessors
         */
        const litInternalPropertyKey = `__${name}`;
        descriptor =
            constructor.getPropertyDescriptor(name, litInternalPropertyKey);
        if (!descriptor) {
            throw new Error('@ariaProperty must be used after a @property decorator');
        }
    }
    // descriptor must exist at this point, reassign so typescript understands
    const propDescriptor = descriptor;
    let attribute = '';
    if (!propDescriptor.set) {
        throw new Error(`@ariaProperty requires a setter for ${name}`);
    }
    // TODO(b/202853219): Remove this check when internal tooling is
    // compatible
    // tslint:disable-next-line:no-any bail if applied to internal generated class
    if (prototype.dispatchWizEvent) {
        return descriptor;
    }
    const wrappedDescriptor = {
        configurable: true,
        enumerable: true,
        set(value) {
            if (attribute === '') {
                const options = constructor.getPropertyOptions(name);
                // if attribute is not a string, use `name` instead
                attribute =
                    typeof options.attribute === 'string' ? options.attribute : name;
            }
            if (this.hasAttribute(attribute)) {
                this.removeAttribute(attribute);
            }
            propDescriptor.set.call(this, value);
        }
    };
    if (propDescriptor.get) {
        wrappedDescriptor.get = function () {
            return propDescriptor.get.call(this);
        };
    }
    return wrappedDescriptor;
}
/**
 * A property decorator proxies an aria attribute to an internal node
 *
 * This decorator is only intended for use with ARIA attributes, such as `role`
 * and `aria-label` due to screenreader needs.
 *
 * Upon first render, `@ariaProperty` will remove the attribute from the host
 * element to prevent screenreaders from reading the host instead of the
 * internal node.
 *
 * This decorator should only be used for non-Symbol public fields decorated
 * with `@property`, or on a setter with an optional getter.
 *
 * @example
 * ```ts
 * class MyElement {
 *   @ariaProperty
 *   @property({ type: String, attribute: 'aria-label' })
 *   ariaLabel!: string;
 * }
 * ```
 * @category Decorator
 * @ExportDecoratedItems
 */
function ariaProperty$1(protoOrDescriptor, name, 
// tslint:disable-next-line:no-any any is required as a return type from decorators
descriptor) {
    if (name !== undefined) {
        return tsDecorator$1(protoOrDescriptor, name, descriptor);
    }
    else {
        throw new Error('@ariaProperty only supports TypeScript Decorators');
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Class that encapsulates the events handlers for `mwc-ripple`
 *
 *
 * Example:
 * ```
 * class XFoo extends LitElement {
 *   async getRipple() {
 *     this.renderRipple = true;
 *     await this.updateComplete;
 *     return this.renderRoot.querySelector('mwc-ripple');
 *   }
 *   rippleHandlers = new RippleHandlers(() => this.getRipple());
 *
 *   render() {
 *     return html`
 *       <div @mousedown=${this.rippleHandlers.startPress}></div>
 *       ${this.renderRipple ? html`<mwc-ripple></mwc-ripple>` : ''}
 *     `;
 *   }
 * }
 * ```
 */
class RippleHandlers$1 {
    constructor(
    /** Function that returns a `mwc-ripple` */
    rippleFn) {
        this.startPress = (ev) => {
            rippleFn().then((r) => {
                r && r.startPress(ev);
            });
        };
        this.endPress = () => {
            rippleFn().then((r) => {
                r && r.endPress();
            });
        };
        this.startFocus = () => {
            rippleFn().then((r) => {
                r && r.startFocus();
            });
        };
        this.endFocus = () => {
            rippleFn().then((r) => {
                r && r.endFocus();
            });
        };
        this.startHover = () => {
            rippleFn().then((r) => {
                r && r.startHover();
            });
        };
        this.endHover = () => {
            rippleFn().then((r) => {
                r && r.endHover();
            });
        };
    }
}

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const l=l=>null!=l?l:A;

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/** @soyCompatible */
class IconButtonToggleBase extends s$1 {
    constructor() {
        super(...arguments);
        this.disabled = false;
        this.onIcon = '';
        this.offIcon = '';
        this.on = false;
        this.shouldRenderRipple = false;
        this.rippleHandlers = new RippleHandlers$1(() => {
            this.shouldRenderRipple = true;
            return this.ripple;
        });
    }
    handleClick() {
        this.on = !this.on;
        this.dispatchEvent(new CustomEvent('icon-button-toggle-change', { detail: { isOn: this.on }, bubbles: true }));
    }
    click() {
        this.mdcRoot.focus();
        this.mdcRoot.click();
    }
    focus() {
        this.rippleHandlers.startFocus();
        this.mdcRoot.focus();
    }
    blur() {
        this.rippleHandlers.endFocus();
        this.mdcRoot.blur();
    }
    /** @soyTemplate */
    renderRipple() {
        return this.shouldRenderRipple ? x `
            <mwc-ripple
                .disabled="${this.disabled}"
                unbounded>
            </mwc-ripple>` :
            '';
    }
    /** @soyTemplate */
    render() {
        /** @classMap */
        const classes = {
            'mdc-icon-button--on': this.on,
        };
        const hasToggledAriaLabel = this.ariaLabelOn !== undefined && this.ariaLabelOff !== undefined;
        const ariaPressedValue = hasToggledAriaLabel ? undefined : this.on;
        const ariaLabelValue = hasToggledAriaLabel ?
            (this.on ? this.ariaLabelOn : this.ariaLabelOff) :
            this.ariaLabel;
        return x `<button
          class="mdc-icon-button mdc-icon-button--display-flex ${o(classes)}"
          aria-pressed="${l(ariaPressedValue)}"
          aria-label="${l(ariaLabelValue)}"
          @click="${this.handleClick}"
          ?disabled="${this.disabled}"
          @focus="${this.handleRippleFocus}"
          @blur="${this.handleRippleBlur}"
          @mousedown="${this.handleRippleMouseDown}"
          @mouseenter="${this.handleRippleMouseEnter}"
          @mouseleave="${this.handleRippleMouseLeave}"
          @touchstart="${this.handleRippleTouchStart}"
          @touchend="${this.handleRippleDeactivate}"
          @touchcancel="${this.handleRippleDeactivate}"
        >${this.renderRipple()}
        <span class="mdc-icon-button__icon"
          ><slot name="offIcon"
            ><i class="material-icons">${this.offIcon}</i
          ></slot
        ></span>
        <span class="mdc-icon-button__icon mdc-icon-button__icon--on"
          ><slot name="onIcon"
            ><i class="material-icons">${this.onIcon}</i
          ></slot
        ></span>
      </button>`;
    }
    handleRippleMouseDown(event) {
        const onUp = () => {
            window.removeEventListener('mouseup', onUp);
            this.handleRippleDeactivate();
        };
        window.addEventListener('mouseup', onUp);
        this.rippleHandlers.startPress(event);
    }
    handleRippleTouchStart(event) {
        this.rippleHandlers.startPress(event);
    }
    handleRippleDeactivate() {
        this.rippleHandlers.endPress();
    }
    handleRippleMouseEnter() {
        this.rippleHandlers.startHover();
    }
    handleRippleMouseLeave() {
        this.rippleHandlers.endHover();
    }
    handleRippleFocus() {
        this.rippleHandlers.startFocus();
    }
    handleRippleBlur() {
        this.rippleHandlers.endFocus();
    }
}
__decorate([
    i$2('.mdc-icon-button')
], IconButtonToggleBase.prototype, "mdcRoot", void 0);
__decorate([
    ariaProperty$1,
    e$4({ type: String, attribute: 'aria-label' })
], IconButtonToggleBase.prototype, "ariaLabel", void 0);
__decorate([
    e$4({ type: Boolean, reflect: true })
], IconButtonToggleBase.prototype, "disabled", void 0);
__decorate([
    e$4({ type: String })
], IconButtonToggleBase.prototype, "onIcon", void 0);
__decorate([
    e$4({ type: String })
], IconButtonToggleBase.prototype, "offIcon", void 0);
__decorate([
    e$4({ type: String })
], IconButtonToggleBase.prototype, "ariaLabelOn", void 0);
__decorate([
    e$4({ type: String })
], IconButtonToggleBase.prototype, "ariaLabelOff", void 0);
__decorate([
    e$4({ type: Boolean, reflect: true })
], IconButtonToggleBase.prototype, "on", void 0);
__decorate([
    e$2('mwc-ripple')
], IconButtonToggleBase.prototype, "ripple", void 0);
__decorate([
    t$1()
], IconButtonToggleBase.prototype, "shouldRenderRipple", void 0);
__decorate([
    e$3({ passive: true })
], IconButtonToggleBase.prototype, "handleRippleMouseDown", null);
__decorate([
    e$3({ passive: true })
], IconButtonToggleBase.prototype, "handleRippleTouchStart", null);

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
let IconButtonToggle = class IconButtonToggle extends IconButtonToggleBase {
};
IconButtonToggle.styles = [styles$f];
IconButtonToggle = __decorate([
    e$5('mwc-icon-button-toggle')
], IconButtonToggle);

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Specifies an observer callback that is run when the decorated property
 * changes. The observer receives the current and old value as arguments.
 */
const observer$1 = (observer) => 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(proto, propName) => {
    // if we haven't wrapped `updated` in this class, do so
    if (!proto.constructor
        ._observers) {
        proto.constructor._observers = new Map();
        const userUpdated = proto.updated;
        proto.updated = function (changedProperties) {
            userUpdated.call(this, changedProperties);
            changedProperties.forEach((v, k) => {
                const observers = this.constructor
                    ._observers;
                const observer = observers.get(k);
                if (observer !== undefined) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    observer.call(this, this[k], v);
                }
            });
        };
        // clone any existing observers (superclasses)
        // eslint-disable-next-line no-prototype-builtins
    }
    else if (!proto.constructor.hasOwnProperty('_observers')) {
        const observers = proto.constructor._observers;
        proto.constructor._observers = new Map();
        observers.forEach(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (v, k) => proto.constructor._observers.set(k, v));
    }
    // set this method
    proto.constructor._observers.set(propName, observer);
};

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fires request-selected {RequestSelectedDetail}
 * @fires list-item-rendered
 */
class ListItemBase$1 extends s$1 {
    constructor() {
        super(...arguments);
        this.value = '';
        this.group = null;
        this.tabindex = -1;
        this.disabled = false;
        this.twoline = false;
        this.activated = false;
        this.graphic = null;
        this.multipleGraphics = false;
        this.hasMeta = false;
        this.noninteractive = false;
        this.selected = false;
        this.shouldRenderRipple = false;
        this._managingList = null;
        this.boundOnClick = this.onClick.bind(this);
        this._firstChanged = true;
        this._skipPropRequest = false;
        this.rippleHandlers = new RippleHandlers$1(() => {
            this.shouldRenderRipple = true;
            return this.ripple;
        });
        this.listeners = [
            {
                target: this,
                eventNames: ['click'],
                cb: () => {
                    this.onClick();
                },
            },
            {
                target: this,
                eventNames: ['mouseenter'],
                cb: this.rippleHandlers.startHover,
            },
            {
                target: this,
                eventNames: ['mouseleave'],
                cb: this.rippleHandlers.endHover,
            },
            {
                target: this,
                eventNames: ['focus'],
                cb: this.rippleHandlers.startFocus,
            },
            {
                target: this,
                eventNames: ['blur'],
                cb: this.rippleHandlers.endFocus,
            },
            {
                target: this,
                eventNames: ['mousedown', 'touchstart'],
                cb: (e) => {
                    const name = e.type;
                    this.onDown(name === 'mousedown' ? 'mouseup' : 'touchend', e);
                },
            },
        ];
    }
    get text() {
        const textContent = this.textContent;
        return textContent ? textContent.trim() : '';
    }
    render() {
        const text = this.renderText();
        const graphic = this.graphic ? this.renderGraphic() : x ``;
        const meta = this.hasMeta ? this.renderMeta() : x ``;
        return x `
      ${this.renderRipple()}
      ${graphic}
      ${text}
      ${meta}`;
    }
    renderRipple() {
        if (this.shouldRenderRipple) {
            return x `
      <mwc-ripple
        .activated=${this.activated}>
      </mwc-ripple>`;
        }
        else if (this.activated) {
            return x `<div class="fake-activated-ripple"></div>`;
        }
        else {
            return '';
        }
    }
    renderGraphic() {
        const graphicClasses = {
            multi: this.multipleGraphics,
        };
        return x `
      <span class="mdc-deprecated-list-item__graphic material-icons ${o(graphicClasses)}">
        <slot name="graphic"></slot>
      </span>`;
    }
    renderMeta() {
        return x `
      <span class="mdc-deprecated-list-item__meta material-icons">
        <slot name="meta"></slot>
      </span>`;
    }
    renderText() {
        const inner = this.twoline ? this.renderTwoline() : this.renderSingleLine();
        return x `
      <span class="mdc-deprecated-list-item__text">
        ${inner}
      </span>`;
    }
    renderSingleLine() {
        return x `<slot></slot>`;
    }
    renderTwoline() {
        return x `
      <span class="mdc-deprecated-list-item__primary-text">
        <slot></slot>
      </span>
      <span class="mdc-deprecated-list-item__secondary-text">
        <slot name="secondary"></slot>
      </span>
    `;
    }
    onClick() {
        this.fireRequestSelected(!this.selected, 'interaction');
    }
    onDown(upName, evt) {
        const onUp = () => {
            window.removeEventListener(upName, onUp);
            this.rippleHandlers.endPress();
        };
        window.addEventListener(upName, onUp);
        this.rippleHandlers.startPress(evt);
    }
    fireRequestSelected(selected, source) {
        if (this.noninteractive) {
            return;
        }
        const customEv = new CustomEvent('request-selected', { bubbles: true, composed: true, detail: { source, selected } });
        this.dispatchEvent(customEv);
    }
    connectedCallback() {
        super.connectedCallback();
        if (!this.noninteractive) {
            this.setAttribute('mwc-list-item', '');
        }
        for (const listener of this.listeners) {
            for (const eventName of listener.eventNames) {
                listener.target.addEventListener(eventName, listener.cb, { passive: true });
            }
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        for (const listener of this.listeners) {
            for (const eventName of listener.eventNames) {
                listener.target.removeEventListener(eventName, listener.cb);
            }
        }
        if (this._managingList) {
            this._managingList.debouncedLayout ?
                this._managingList.debouncedLayout(true) :
                this._managingList.layout(true);
        }
    }
    // composed flag, event fire through shadow root and up through composed tree
    firstUpdated() {
        const ev = new Event('list-item-rendered', { bubbles: true, composed: true });
        this.dispatchEvent(ev);
    }
}
__decorate([
    i$2('slot')
], ListItemBase$1.prototype, "slotElement", void 0);
__decorate([
    e$2('mwc-ripple')
], ListItemBase$1.prototype, "ripple", void 0);
__decorate([
    e$4({ type: String })
], ListItemBase$1.prototype, "value", void 0);
__decorate([
    e$4({ type: String, reflect: true })
], ListItemBase$1.prototype, "group", void 0);
__decorate([
    e$4({ type: Number, reflect: true })
], ListItemBase$1.prototype, "tabindex", void 0);
__decorate([
    e$4({ type: Boolean, reflect: true }),
    observer$1(function (value) {
        if (value) {
            this.setAttribute('aria-disabled', 'true');
        }
        else {
            this.setAttribute('aria-disabled', 'false');
        }
    })
], ListItemBase$1.prototype, "disabled", void 0);
__decorate([
    e$4({ type: Boolean, reflect: true })
], ListItemBase$1.prototype, "twoline", void 0);
__decorate([
    e$4({ type: Boolean, reflect: true })
], ListItemBase$1.prototype, "activated", void 0);
__decorate([
    e$4({ type: String, reflect: true })
], ListItemBase$1.prototype, "graphic", void 0);
__decorate([
    e$4({ type: Boolean })
], ListItemBase$1.prototype, "multipleGraphics", void 0);
__decorate([
    e$4({ type: Boolean })
], ListItemBase$1.prototype, "hasMeta", void 0);
__decorate([
    e$4({ type: Boolean, reflect: true }),
    observer$1(function (value) {
        if (value) {
            this.removeAttribute('aria-checked');
            this.removeAttribute('mwc-list-item');
            this.selected = false;
            this.activated = false;
            this.tabIndex = -1;
        }
        else {
            this.setAttribute('mwc-list-item', '');
        }
    })
], ListItemBase$1.prototype, "noninteractive", void 0);
__decorate([
    e$4({ type: Boolean, reflect: true }),
    observer$1(function (value) {
        const role = this.getAttribute('role');
        const isAriaSelectable = role === 'gridcell' || role === 'option' ||
            role === 'row' || role === 'tab';
        if (isAriaSelectable && value) {
            this.setAttribute('aria-selected', 'true');
        }
        else if (isAriaSelectable) {
            this.setAttribute('aria-selected', 'false');
        }
        if (this._firstChanged) {
            this._firstChanged = false;
            return;
        }
        if (this._skipPropRequest) {
            return;
        }
        this.fireRequestSelected(value, 'property');
    })
], ListItemBase$1.prototype, "selected", void 0);
__decorate([
    t$1()
], ListItemBase$1.prototype, "shouldRenderRipple", void 0);
__decorate([
    t$1()
], ListItemBase$1.prototype, "_managingList", void 0);

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
const styles$d = i$5 `:host{cursor:pointer;user-select:none;-webkit-tap-highlight-color:transparent;height:48px;display:flex;position:relative;align-items:center;justify-content:flex-start;overflow:hidden;padding:0;padding-left:var(--mdc-list-side-padding, 16px);padding-right:var(--mdc-list-side-padding, 16px);outline:none;height:48px;color:rgba(0,0,0,.87);color:var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87))}:host:focus{outline:none}:host([activated]){color:#6200ee;color:var(--mdc-theme-primary, #6200ee);--mdc-ripple-color: var( --mdc-theme-primary, #6200ee )}:host([activated]) .mdc-deprecated-list-item__graphic{color:#6200ee;color:var(--mdc-theme-primary, #6200ee)}:host([activated]) .fake-activated-ripple::before{position:absolute;display:block;top:0;bottom:0;left:0;right:0;width:100%;height:100%;pointer-events:none;z-index:1;content:"";opacity:0.12;opacity:var(--mdc-ripple-activated-opacity, 0.12);background-color:#6200ee;background-color:var(--mdc-ripple-color, var(--mdc-theme-primary, #6200ee))}.mdc-deprecated-list-item__graphic{flex-shrink:0;align-items:center;justify-content:center;fill:currentColor;display:inline-flex}.mdc-deprecated-list-item__graphic ::slotted(*){flex-shrink:0;align-items:center;justify-content:center;fill:currentColor;width:100%;height:100%;text-align:center}.mdc-deprecated-list-item__meta{width:var(--mdc-list-item-meta-size, 24px);height:var(--mdc-list-item-meta-size, 24px);margin-left:auto;margin-right:0;color:rgba(0, 0, 0, 0.38);color:var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.38))}.mdc-deprecated-list-item__meta.multi{width:auto}.mdc-deprecated-list-item__meta ::slotted(*){width:var(--mdc-list-item-meta-size, 24px);line-height:var(--mdc-list-item-meta-size, 24px)}.mdc-deprecated-list-item__meta ::slotted(.material-icons),.mdc-deprecated-list-item__meta ::slotted(mwc-icon){line-height:var(--mdc-list-item-meta-size, 24px) !important}.mdc-deprecated-list-item__meta ::slotted(:not(.material-icons):not(mwc-icon)){-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-caption-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.75rem;font-size:var(--mdc-typography-caption-font-size, 0.75rem);line-height:1.25rem;line-height:var(--mdc-typography-caption-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-caption-font-weight, 400);letter-spacing:0.0333333333em;letter-spacing:var(--mdc-typography-caption-letter-spacing, 0.0333333333em);text-decoration:inherit;text-decoration:var(--mdc-typography-caption-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-caption-text-transform, inherit)}[dir=rtl] .mdc-deprecated-list-item__meta,.mdc-deprecated-list-item__meta[dir=rtl]{margin-left:0;margin-right:auto}.mdc-deprecated-list-item__meta ::slotted(*){width:100%;height:100%}.mdc-deprecated-list-item__text{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.mdc-deprecated-list-item__text ::slotted([for]),.mdc-deprecated-list-item__text[for]{pointer-events:none}.mdc-deprecated-list-item__primary-text{text-overflow:ellipsis;white-space:nowrap;overflow:hidden;display:block;margin-top:0;line-height:normal;margin-bottom:-20px;display:block}.mdc-deprecated-list-item__primary-text::before{display:inline-block;width:0;height:32px;content:"";vertical-align:0}.mdc-deprecated-list-item__primary-text::after{display:inline-block;width:0;height:20px;content:"";vertical-align:-20px}.mdc-deprecated-list-item__secondary-text{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-body2-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.875rem;font-size:var(--mdc-typography-body2-font-size, 0.875rem);line-height:1.25rem;line-height:var(--mdc-typography-body2-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-body2-font-weight, 400);letter-spacing:0.0178571429em;letter-spacing:var(--mdc-typography-body2-letter-spacing, 0.0178571429em);text-decoration:inherit;text-decoration:var(--mdc-typography-body2-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-body2-text-transform, inherit);text-overflow:ellipsis;white-space:nowrap;overflow:hidden;display:block;margin-top:0;line-height:normal;display:block}.mdc-deprecated-list-item__secondary-text::before{display:inline-block;width:0;height:20px;content:"";vertical-align:0}.mdc-deprecated-list--dense .mdc-deprecated-list-item__secondary-text{font-size:inherit}* ::slotted(a),a{color:inherit;text-decoration:none}:host([twoline]){height:72px}:host([twoline]) .mdc-deprecated-list-item__text{align-self:flex-start}:host([disabled]),:host([noninteractive]){cursor:default;pointer-events:none}:host([disabled]) .mdc-deprecated-list-item__text ::slotted(*){opacity:.38}:host([disabled]) .mdc-deprecated-list-item__text ::slotted(*),:host([disabled]) .mdc-deprecated-list-item__primary-text ::slotted(*),:host([disabled]) .mdc-deprecated-list-item__secondary-text ::slotted(*){color:#000;color:var(--mdc-theme-on-surface, #000)}.mdc-deprecated-list-item__secondary-text ::slotted(*){color:rgba(0, 0, 0, 0.54);color:var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.54))}.mdc-deprecated-list-item__graphic ::slotted(*){background-color:transparent;color:rgba(0, 0, 0, 0.38);color:var(--mdc-theme-text-icon-on-background, rgba(0, 0, 0, 0.38))}.mdc-deprecated-list-group__subheader ::slotted(*){color:rgba(0, 0, 0, 0.87);color:var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87))}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic{width:var(--mdc-list-item-graphic-size, 40px);height:var(--mdc-list-item-graphic-size, 40px)}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic.multi{width:auto}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic ::slotted(*){width:var(--mdc-list-item-graphic-size, 40px);line-height:var(--mdc-list-item-graphic-size, 40px)}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic ::slotted(.material-icons),:host([graphic=avatar]) .mdc-deprecated-list-item__graphic ::slotted(mwc-icon){line-height:var(--mdc-list-item-graphic-size, 40px) !important}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic ::slotted(*){border-radius:50%}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic,:host([graphic=medium]) .mdc-deprecated-list-item__graphic,:host([graphic=large]) .mdc-deprecated-list-item__graphic,:host([graphic=control]) .mdc-deprecated-list-item__graphic{margin-left:0;margin-right:var(--mdc-list-item-graphic-margin, 16px)}[dir=rtl] :host([graphic=avatar]) .mdc-deprecated-list-item__graphic,[dir=rtl] :host([graphic=medium]) .mdc-deprecated-list-item__graphic,[dir=rtl] :host([graphic=large]) .mdc-deprecated-list-item__graphic,[dir=rtl] :host([graphic=control]) .mdc-deprecated-list-item__graphic,:host([graphic=avatar]) .mdc-deprecated-list-item__graphic[dir=rtl],:host([graphic=medium]) .mdc-deprecated-list-item__graphic[dir=rtl],:host([graphic=large]) .mdc-deprecated-list-item__graphic[dir=rtl],:host([graphic=control]) .mdc-deprecated-list-item__graphic[dir=rtl]{margin-left:var(--mdc-list-item-graphic-margin, 16px);margin-right:0}:host([graphic=icon]) .mdc-deprecated-list-item__graphic{width:var(--mdc-list-item-graphic-size, 24px);height:var(--mdc-list-item-graphic-size, 24px);margin-left:0;margin-right:var(--mdc-list-item-graphic-margin, 32px)}:host([graphic=icon]) .mdc-deprecated-list-item__graphic.multi{width:auto}:host([graphic=icon]) .mdc-deprecated-list-item__graphic ::slotted(*){width:var(--mdc-list-item-graphic-size, 24px);line-height:var(--mdc-list-item-graphic-size, 24px)}:host([graphic=icon]) .mdc-deprecated-list-item__graphic ::slotted(.material-icons),:host([graphic=icon]) .mdc-deprecated-list-item__graphic ::slotted(mwc-icon){line-height:var(--mdc-list-item-graphic-size, 24px) !important}[dir=rtl] :host([graphic=icon]) .mdc-deprecated-list-item__graphic,:host([graphic=icon]) .mdc-deprecated-list-item__graphic[dir=rtl]{margin-left:var(--mdc-list-item-graphic-margin, 32px);margin-right:0}:host([graphic=avatar]:not([twoLine])),:host([graphic=icon]:not([twoLine])){height:56px}:host([graphic=medium]:not([twoLine])),:host([graphic=large]:not([twoLine])){height:72px}:host([graphic=medium]) .mdc-deprecated-list-item__graphic,:host([graphic=large]) .mdc-deprecated-list-item__graphic{width:var(--mdc-list-item-graphic-size, 56px);height:var(--mdc-list-item-graphic-size, 56px)}:host([graphic=medium]) .mdc-deprecated-list-item__graphic.multi,:host([graphic=large]) .mdc-deprecated-list-item__graphic.multi{width:auto}:host([graphic=medium]) .mdc-deprecated-list-item__graphic ::slotted(*),:host([graphic=large]) .mdc-deprecated-list-item__graphic ::slotted(*){width:var(--mdc-list-item-graphic-size, 56px);line-height:var(--mdc-list-item-graphic-size, 56px)}:host([graphic=medium]) .mdc-deprecated-list-item__graphic ::slotted(.material-icons),:host([graphic=medium]) .mdc-deprecated-list-item__graphic ::slotted(mwc-icon),:host([graphic=large]) .mdc-deprecated-list-item__graphic ::slotted(.material-icons),:host([graphic=large]) .mdc-deprecated-list-item__graphic ::slotted(mwc-icon){line-height:var(--mdc-list-item-graphic-size, 56px) !important}:host([graphic=large]){padding-left:0px}`;

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
let ListItem$1 = class ListItem extends ListItemBase$1 {
};
ListItem$1.styles = [styles$d];
ListItem$1 = __decorate([
    e$5('mwc-list-item')
], ListItem$1);

/**
 * @license
 * Copyright 2020 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/**
 * KEY provides normalized string values for keys.
 */
var KEY$1 = {
    UNKNOWN: 'Unknown',
    BACKSPACE: 'Backspace',
    ENTER: 'Enter',
    SPACEBAR: 'Spacebar',
    PAGE_UP: 'PageUp',
    PAGE_DOWN: 'PageDown',
    END: 'End',
    HOME: 'Home',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_UP: 'ArrowUp',
    ARROW_RIGHT: 'ArrowRight',
    ARROW_DOWN: 'ArrowDown',
    DELETE: 'Delete',
    ESCAPE: 'Escape',
    TAB: 'Tab',
};
var normalizedKeys$1 = new Set();
// IE11 has no support for new Map with iterable so we need to initialize this
// by hand.
normalizedKeys$1.add(KEY$1.BACKSPACE);
normalizedKeys$1.add(KEY$1.ENTER);
normalizedKeys$1.add(KEY$1.SPACEBAR);
normalizedKeys$1.add(KEY$1.PAGE_UP);
normalizedKeys$1.add(KEY$1.PAGE_DOWN);
normalizedKeys$1.add(KEY$1.END);
normalizedKeys$1.add(KEY$1.HOME);
normalizedKeys$1.add(KEY$1.ARROW_LEFT);
normalizedKeys$1.add(KEY$1.ARROW_UP);
normalizedKeys$1.add(KEY$1.ARROW_RIGHT);
normalizedKeys$1.add(KEY$1.ARROW_DOWN);
normalizedKeys$1.add(KEY$1.DELETE);
normalizedKeys$1.add(KEY$1.ESCAPE);
normalizedKeys$1.add(KEY$1.TAB);
var KEY_CODE$1 = {
    BACKSPACE: 8,
    ENTER: 13,
    SPACEBAR: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    ARROW_LEFT: 37,
    ARROW_UP: 38,
    ARROW_RIGHT: 39,
    ARROW_DOWN: 40,
    DELETE: 46,
    ESCAPE: 27,
    TAB: 9,
};
var mappedKeyCodes$1 = new Map();
// IE11 has no support for new Map with iterable so we need to initialize this
// by hand.
mappedKeyCodes$1.set(KEY_CODE$1.BACKSPACE, KEY$1.BACKSPACE);
mappedKeyCodes$1.set(KEY_CODE$1.ENTER, KEY$1.ENTER);
mappedKeyCodes$1.set(KEY_CODE$1.SPACEBAR, KEY$1.SPACEBAR);
mappedKeyCodes$1.set(KEY_CODE$1.PAGE_UP, KEY$1.PAGE_UP);
mappedKeyCodes$1.set(KEY_CODE$1.PAGE_DOWN, KEY$1.PAGE_DOWN);
mappedKeyCodes$1.set(KEY_CODE$1.END, KEY$1.END);
mappedKeyCodes$1.set(KEY_CODE$1.HOME, KEY$1.HOME);
mappedKeyCodes$1.set(KEY_CODE$1.ARROW_LEFT, KEY$1.ARROW_LEFT);
mappedKeyCodes$1.set(KEY_CODE$1.ARROW_UP, KEY$1.ARROW_UP);
mappedKeyCodes$1.set(KEY_CODE$1.ARROW_RIGHT, KEY$1.ARROW_RIGHT);
mappedKeyCodes$1.set(KEY_CODE$1.ARROW_DOWN, KEY$1.ARROW_DOWN);
mappedKeyCodes$1.set(KEY_CODE$1.DELETE, KEY$1.DELETE);
mappedKeyCodes$1.set(KEY_CODE$1.ESCAPE, KEY$1.ESCAPE);
mappedKeyCodes$1.set(KEY_CODE$1.TAB, KEY$1.TAB);
var navigationKeys$1 = new Set();
// IE11 has no support for new Set with iterable so we need to initialize this
// by hand.
navigationKeys$1.add(KEY$1.PAGE_UP);
navigationKeys$1.add(KEY$1.PAGE_DOWN);
navigationKeys$1.add(KEY$1.END);
navigationKeys$1.add(KEY$1.HOME);
navigationKeys$1.add(KEY$1.ARROW_LEFT);
navigationKeys$1.add(KEY$1.ARROW_UP);
navigationKeys$1.add(KEY$1.ARROW_RIGHT);
navigationKeys$1.add(KEY$1.ARROW_DOWN);
/**
 * normalizeKey returns the normalized string for a navigational action.
 */
function normalizeKey$1(evt) {
    var key = evt.key;
    // If the event already has a normalized key, return it
    if (normalizedKeys$1.has(key)) {
        return key;
    }
    // tslint:disable-next-line:deprecation
    var mappedKey = mappedKeyCodes$1.get(evt.keyCode);
    if (mappedKey) {
        return mappedKey;
    }
    return KEY$1.UNKNOWN;
}

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var _a$3, _b$2;
var cssClasses$9 = {
    LIST_ITEM_ACTIVATED_CLASS: 'mdc-list-item--activated',
    LIST_ITEM_CLASS: 'mdc-list-item',
    LIST_ITEM_DISABLED_CLASS: 'mdc-list-item--disabled',
    LIST_ITEM_SELECTED_CLASS: 'mdc-list-item--selected',
    LIST_ITEM_TEXT_CLASS: 'mdc-list-item__text',
    LIST_ITEM_PRIMARY_TEXT_CLASS: 'mdc-list-item__primary-text',
    ROOT: 'mdc-list',
};
(_a$3 = {},
    _a$3["" + cssClasses$9.LIST_ITEM_ACTIVATED_CLASS] = 'mdc-list-item--activated',
    _a$3["" + cssClasses$9.LIST_ITEM_CLASS] = 'mdc-list-item',
    _a$3["" + cssClasses$9.LIST_ITEM_DISABLED_CLASS] = 'mdc-list-item--disabled',
    _a$3["" + cssClasses$9.LIST_ITEM_SELECTED_CLASS] = 'mdc-list-item--selected',
    _a$3["" + cssClasses$9.LIST_ITEM_PRIMARY_TEXT_CLASS] = 'mdc-list-item__primary-text',
    _a$3["" + cssClasses$9.ROOT] = 'mdc-list',
    _a$3);
var deprecatedClassNameMap$1 = (_b$2 = {},
    _b$2["" + cssClasses$9.LIST_ITEM_ACTIVATED_CLASS] = 'mdc-deprecated-list-item--activated',
    _b$2["" + cssClasses$9.LIST_ITEM_CLASS] = 'mdc-deprecated-list-item',
    _b$2["" + cssClasses$9.LIST_ITEM_DISABLED_CLASS] = 'mdc-deprecated-list-item--disabled',
    _b$2["" + cssClasses$9.LIST_ITEM_SELECTED_CLASS] = 'mdc-deprecated-list-item--selected',
    _b$2["" + cssClasses$9.LIST_ITEM_TEXT_CLASS] = 'mdc-deprecated-list-item__text',
    _b$2["" + cssClasses$9.LIST_ITEM_PRIMARY_TEXT_CLASS] = 'mdc-deprecated-list-item__primary-text',
    _b$2["" + cssClasses$9.ROOT] = 'mdc-deprecated-list',
    _b$2);
var strings$7 = {
    ACTION_EVENT: 'MDCList:action',
    SELECTION_CHANGE_EVENT: 'MDCList:selectionChange',
    ARIA_CHECKED: 'aria-checked',
    ARIA_CHECKED_CHECKBOX_SELECTOR: '[role="checkbox"][aria-checked="true"]',
    ARIA_CHECKED_RADIO_SELECTOR: '[role="radio"][aria-checked="true"]',
    ARIA_CURRENT: 'aria-current',
    ARIA_DISABLED: 'aria-disabled',
    ARIA_ORIENTATION: 'aria-orientation',
    ARIA_ORIENTATION_HORIZONTAL: 'horizontal',
    ARIA_ROLE_CHECKBOX_SELECTOR: '[role="checkbox"]',
    ARIA_SELECTED: 'aria-selected',
    ARIA_INTERACTIVE_ROLES_SELECTOR: '[role="listbox"], [role="menu"]',
    ARIA_MULTI_SELECTABLE_SELECTOR: '[aria-multiselectable="true"]',
    CHECKBOX_RADIO_SELECTOR: 'input[type="checkbox"], input[type="radio"]',
    CHECKBOX_SELECTOR: 'input[type="checkbox"]',
    CHILD_ELEMENTS_TO_TOGGLE_TABINDEX: "\n    ." + cssClasses$9.LIST_ITEM_CLASS + " button:not(:disabled),\n    ." + cssClasses$9.LIST_ITEM_CLASS + " a,\n    ." + deprecatedClassNameMap$1[cssClasses$9.LIST_ITEM_CLASS] + " button:not(:disabled),\n    ." + deprecatedClassNameMap$1[cssClasses$9.LIST_ITEM_CLASS] + " a\n  ",
    DEPRECATED_SELECTOR: '.mdc-deprecated-list',
    FOCUSABLE_CHILD_ELEMENTS: "\n    ." + cssClasses$9.LIST_ITEM_CLASS + " button:not(:disabled),\n    ." + cssClasses$9.LIST_ITEM_CLASS + " a,\n    ." + cssClasses$9.LIST_ITEM_CLASS + " input[type=\"radio\"]:not(:disabled),\n    ." + cssClasses$9.LIST_ITEM_CLASS + " input[type=\"checkbox\"]:not(:disabled),\n    ." + deprecatedClassNameMap$1[cssClasses$9.LIST_ITEM_CLASS] + " button:not(:disabled),\n    ." + deprecatedClassNameMap$1[cssClasses$9.LIST_ITEM_CLASS] + " a,\n    ." + deprecatedClassNameMap$1[cssClasses$9.LIST_ITEM_CLASS] + " input[type=\"radio\"]:not(:disabled),\n    ." + deprecatedClassNameMap$1[cssClasses$9.LIST_ITEM_CLASS] + " input[type=\"checkbox\"]:not(:disabled)\n  ",
    RADIO_SELECTOR: 'input[type="radio"]',
    SELECTED_ITEM_SELECTOR: '[aria-selected="true"], [aria-current="true"]',
};
var numbers$6 = {
    UNSET_INDEX: -1,
    TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS: 300
};

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const integerSort$1 = (a, b) => {
    return a - b;
};
const findIndexDiff$1 = (oldSet, newSet) => {
    const oldArr = Array.from(oldSet);
    const newArr = Array.from(newSet);
    const diff = { added: [], removed: [] };
    const oldSorted = oldArr.sort(integerSort$1);
    const newSorted = newArr.sort(integerSort$1);
    let i = 0;
    let j = 0;
    while (i < oldSorted.length || j < newSorted.length) {
        const oldVal = oldSorted[i];
        const newVal = newSorted[j];
        if (oldVal === newVal) {
            i++;
            j++;
            continue;
        }
        if (oldVal !== undefined && (newVal === undefined || oldVal < newVal)) {
            diff.removed.push(oldVal);
            i++;
            continue;
        }
        if (newVal !== undefined && (oldVal === undefined || newVal < oldVal)) {
            diff.added.push(newVal);
            j++;
            continue;
        }
    }
    return diff;
};
const ELEMENTS_KEY_ALLOWED_IN$1 = ['input', 'button', 'textarea', 'select'];
function isIndexSet$1(selectedIndex) {
    return selectedIndex instanceof Set;
}
const createSetFromIndex$1 = (index) => {
    const entry = index === numbers$6.UNSET_INDEX ? new Set() : index;
    return isIndexSet$1(entry) ? new Set(entry) : new Set([entry]);
};
class MDCListFoundation$1 extends MDCFoundation$1 {
    constructor(adapter) {
        super(Object.assign(Object.assign({}, MDCListFoundation$1.defaultAdapter), adapter));
        this.isMulti_ = false;
        this.wrapFocus_ = false;
        this.isVertical_ = true;
        this.selectedIndex_ = numbers$6.UNSET_INDEX;
        this.focusedItemIndex_ = numbers$6.UNSET_INDEX;
        this.useActivatedClass_ = false;
        this.ariaCurrentAttrValue_ = null;
    }
    static get strings() {
        return strings$7;
    }
    static get numbers() {
        return numbers$6;
    }
    static get defaultAdapter() {
        return {
            focusItemAtIndex: () => undefined,
            getFocusedElementIndex: () => 0,
            getListItemCount: () => 0,
            isFocusInsideList: () => false,
            isRootFocused: () => false,
            notifyAction: () => undefined,
            notifySelected: () => undefined,
            getSelectedStateForElementIndex: () => false,
            setDisabledStateForElementIndex: () => undefined,
            getDisabledStateForElementIndex: () => false,
            setSelectedStateForElementIndex: () => undefined,
            setActivatedStateForElementIndex: () => undefined,
            setTabIndexForElementIndex: () => undefined,
            setAttributeForElementIndex: () => undefined,
            getAttributeForElementIndex: () => null,
        };
    }
    /**
     * Sets the private wrapFocus_ variable.
     */
    setWrapFocus(value) {
        this.wrapFocus_ = value;
    }
    /**
     * Sets the private wrapFocus_ variable.
     */
    setMulti(value) {
        this.isMulti_ = value;
        const currentIndex = this.selectedIndex_;
        if (value) {
            // number to set
            if (!isIndexSet$1(currentIndex)) {
                const isUnset = currentIndex === numbers$6.UNSET_INDEX;
                this.selectedIndex_ = isUnset ? new Set() : new Set([currentIndex]);
            }
        }
        else {
            // set to first sorted number in set
            if (isIndexSet$1(currentIndex)) {
                if (currentIndex.size) {
                    const vals = Array.from(currentIndex).sort(integerSort$1);
                    this.selectedIndex_ = vals[0];
                }
                else {
                    this.selectedIndex_ = numbers$6.UNSET_INDEX;
                }
            }
        }
    }
    /**
     * Sets the isVertical_ private variable.
     */
    setVerticalOrientation(value) {
        this.isVertical_ = value;
    }
    /**
     * Sets the useActivatedClass_ private variable.
     */
    setUseActivatedClass(useActivated) {
        this.useActivatedClass_ = useActivated;
    }
    getSelectedIndex() {
        return this.selectedIndex_;
    }
    setSelectedIndex(index) {
        if (!this.isIndexValid_(index)) {
            return;
        }
        if (this.isMulti_) {
            this.setMultiSelectionAtIndex_(createSetFromIndex$1(index));
        }
        else {
            this.setSingleSelectionAtIndex_(index);
        }
    }
    /**
     * Focus in handler for the list items.
     */
    handleFocusIn(_, listItemIndex) {
        if (listItemIndex >= 0) {
            this.adapter.setTabIndexForElementIndex(listItemIndex, 0);
        }
    }
    /**
     * Focus out handler for the list items.
     */
    handleFocusOut(_, listItemIndex) {
        if (listItemIndex >= 0) {
            this.adapter.setTabIndexForElementIndex(listItemIndex, -1);
        }
        /**
         * Between Focusout & Focusin some browsers do not have focus on any
         * element. Setting a delay to wait till the focus is moved to next element.
         */
        setTimeout(() => {
            if (!this.adapter.isFocusInsideList()) {
                this.setTabindexToFirstSelectedItem_();
            }
        }, 0);
    }
    /**
     * Key handler for the list.
     */
    handleKeydown(event, isRootListItem, listItemIndex) {
        const isArrowLeft = normalizeKey$1(event) === 'ArrowLeft';
        const isArrowUp = normalizeKey$1(event) === 'ArrowUp';
        const isArrowRight = normalizeKey$1(event) === 'ArrowRight';
        const isArrowDown = normalizeKey$1(event) === 'ArrowDown';
        const isHome = normalizeKey$1(event) === 'Home';
        const isEnd = normalizeKey$1(event) === 'End';
        const isEnter = normalizeKey$1(event) === 'Enter';
        const isSpace = normalizeKey$1(event) === 'Spacebar';
        if (this.adapter.isRootFocused()) {
            if (isArrowUp || isEnd) {
                event.preventDefault();
                this.focusLastElement();
            }
            else if (isArrowDown || isHome) {
                event.preventDefault();
                this.focusFirstElement();
            }
            return;
        }
        let currentIndex = this.adapter.getFocusedElementIndex();
        if (currentIndex === -1) {
            currentIndex = listItemIndex;
            if (currentIndex < 0) {
                // If this event doesn't have a mdc-deprecated-list-item ancestor from
                // the current list (not from a sublist), return early.
                return;
            }
        }
        let nextIndex;
        if ((this.isVertical_ && isArrowDown) ||
            (!this.isVertical_ && isArrowRight)) {
            this.preventDefaultEvent(event);
            nextIndex = this.focusNextElement(currentIndex);
        }
        else if ((this.isVertical_ && isArrowUp) || (!this.isVertical_ && isArrowLeft)) {
            this.preventDefaultEvent(event);
            nextIndex = this.focusPrevElement(currentIndex);
        }
        else if (isHome) {
            this.preventDefaultEvent(event);
            nextIndex = this.focusFirstElement();
        }
        else if (isEnd) {
            this.preventDefaultEvent(event);
            nextIndex = this.focusLastElement();
        }
        else if (isEnter || isSpace) {
            if (isRootListItem) {
                // Return early if enter key is pressed on anchor element which triggers
                // synthetic MouseEvent event.
                const target = event.target;
                if (target && target.tagName === 'A' && isEnter) {
                    return;
                }
                this.preventDefaultEvent(event);
                this.setSelectedIndexOnAction_(currentIndex, true);
            }
        }
        this.focusedItemIndex_ = currentIndex;
        if (nextIndex !== undefined) {
            this.setTabindexAtIndex_(nextIndex);
            this.focusedItemIndex_ = nextIndex;
        }
    }
    /**
     * Click handler for the list.
     */
    handleSingleSelection(index, isInteraction, force) {
        if (index === numbers$6.UNSET_INDEX) {
            return;
        }
        this.setSelectedIndexOnAction_(index, isInteraction, force);
        this.setTabindexAtIndex_(index);
        this.focusedItemIndex_ = index;
    }
    /**
     * Focuses the next element on the list.
     */
    focusNextElement(index) {
        const count = this.adapter.getListItemCount();
        let nextIndex = index + 1;
        if (nextIndex >= count) {
            if (this.wrapFocus_) {
                nextIndex = 0;
            }
            else {
                // Return early because last item is already focused.
                return index;
            }
        }
        this.adapter.focusItemAtIndex(nextIndex);
        return nextIndex;
    }
    /**
     * Focuses the previous element on the list.
     */
    focusPrevElement(index) {
        let prevIndex = index - 1;
        if (prevIndex < 0) {
            if (this.wrapFocus_) {
                prevIndex = this.adapter.getListItemCount() - 1;
            }
            else {
                // Return early because first item is already focused.
                return index;
            }
        }
        this.adapter.focusItemAtIndex(prevIndex);
        return prevIndex;
    }
    focusFirstElement() {
        this.adapter.focusItemAtIndex(0);
        return 0;
    }
    focusLastElement() {
        const lastIndex = this.adapter.getListItemCount() - 1;
        this.adapter.focusItemAtIndex(lastIndex);
        return lastIndex;
    }
    /**
     * @param itemIndex Index of the list item
     * @param isEnabled Sets the list item to enabled or disabled.
     */
    setEnabled(itemIndex, isEnabled) {
        if (!this.isIndexValid_(itemIndex)) {
            return;
        }
        this.adapter.setDisabledStateForElementIndex(itemIndex, !isEnabled);
    }
    /**
     * Ensures that preventDefault is only called if the containing element
     * doesn't consume the event, and it will cause an unintended scroll.
     */
    preventDefaultEvent(evt) {
        const target = evt.target;
        const tagName = `${target.tagName}`.toLowerCase();
        if (ELEMENTS_KEY_ALLOWED_IN$1.indexOf(tagName) === -1) {
            evt.preventDefault();
        }
    }
    setSingleSelectionAtIndex_(index, isInteraction = true) {
        if (this.selectedIndex_ === index) {
            return;
        }
        // unset previous
        if (this.selectedIndex_ !== numbers$6.UNSET_INDEX) {
            this.adapter.setSelectedStateForElementIndex(this.selectedIndex_, false);
            if (this.useActivatedClass_) {
                this.adapter.setActivatedStateForElementIndex(this.selectedIndex_, false);
            }
        }
        // set new
        if (isInteraction) {
            this.adapter.setSelectedStateForElementIndex(index, true);
        }
        if (this.useActivatedClass_) {
            this.adapter.setActivatedStateForElementIndex(index, true);
        }
        this.setAriaForSingleSelectionAtIndex_(index);
        this.selectedIndex_ = index;
        this.adapter.notifySelected(index);
    }
    setMultiSelectionAtIndex_(newIndex, isInteraction = true) {
        const oldIndex = createSetFromIndex$1(this.selectedIndex_);
        const diff = findIndexDiff$1(oldIndex, newIndex);
        if (!diff.removed.length && !diff.added.length) {
            return;
        }
        for (const removed of diff.removed) {
            if (isInteraction) {
                this.adapter.setSelectedStateForElementIndex(removed, false);
            }
            if (this.useActivatedClass_) {
                this.adapter.setActivatedStateForElementIndex(removed, false);
            }
        }
        for (const added of diff.added) {
            if (isInteraction) {
                this.adapter.setSelectedStateForElementIndex(added, true);
            }
            if (this.useActivatedClass_) {
                this.adapter.setActivatedStateForElementIndex(added, true);
            }
        }
        this.selectedIndex_ = newIndex;
        this.adapter.notifySelected(newIndex, diff);
    }
    /**
     * Sets aria attribute for single selection at given index.
     */
    setAriaForSingleSelectionAtIndex_(index) {
        // Detect the presence of aria-current and get the value only during list
        // initialization when it is in unset state.
        if (this.selectedIndex_ === numbers$6.UNSET_INDEX) {
            this.ariaCurrentAttrValue_ =
                this.adapter.getAttributeForElementIndex(index, strings$7.ARIA_CURRENT);
        }
        const isAriaCurrent = this.ariaCurrentAttrValue_ !== null;
        const ariaAttribute = isAriaCurrent ? strings$7.ARIA_CURRENT : strings$7.ARIA_SELECTED;
        if (this.selectedIndex_ !== numbers$6.UNSET_INDEX) {
            this.adapter.setAttributeForElementIndex(this.selectedIndex_, ariaAttribute, 'false');
        }
        const ariaAttributeValue = isAriaCurrent ? this.ariaCurrentAttrValue_ : 'true';
        this.adapter.setAttributeForElementIndex(index, ariaAttribute, ariaAttributeValue);
    }
    setTabindexAtIndex_(index) {
        if (this.focusedItemIndex_ === numbers$6.UNSET_INDEX && index !== 0) {
            // If no list item was selected set first list item's tabindex to -1.
            // Generally, tabindex is set to 0 on first list item of list that has no
            // preselected items.
            this.adapter.setTabIndexForElementIndex(0, -1);
        }
        else if (this.focusedItemIndex_ >= 0 && this.focusedItemIndex_ !== index) {
            this.adapter.setTabIndexForElementIndex(this.focusedItemIndex_, -1);
        }
        this.adapter.setTabIndexForElementIndex(index, 0);
    }
    setTabindexToFirstSelectedItem_() {
        let targetIndex = 0;
        if (typeof this.selectedIndex_ === 'number' &&
            this.selectedIndex_ !== numbers$6.UNSET_INDEX) {
            targetIndex = this.selectedIndex_;
        }
        else if (isIndexSet$1(this.selectedIndex_) && this.selectedIndex_.size > 0) {
            targetIndex = Math.min(...this.selectedIndex_);
        }
        this.setTabindexAtIndex_(targetIndex);
    }
    isIndexValid_(index) {
        if (index instanceof Set) {
            if (!this.isMulti_) {
                throw new Error('MDCListFoundation: Array of index is only supported for checkbox based list');
            }
            if (index.size === 0) {
                return true;
            }
            else {
                let isOneInRange = false;
                for (const entry of index) {
                    isOneInRange = this.isIndexInRange_(entry);
                    if (isOneInRange) {
                        break;
                    }
                }
                return isOneInRange;
            }
        }
        else if (typeof index === 'number') {
            if (this.isMulti_) {
                throw new Error('MDCListFoundation: Expected array of index for checkbox based list but got number: ' +
                    index);
            }
            return index === numbers$6.UNSET_INDEX || this.isIndexInRange_(index);
        }
        else {
            return false;
        }
    }
    isIndexInRange_(index) {
        const listSize = this.adapter.getListItemCount();
        return index >= 0 && index < listSize;
    }
    /**
     * Sets selected index on user action, toggles checkbox / radio based on
     * toggleCheckbox value. User interaction should not toggle list item(s) when
     * disabled.
     */
    setSelectedIndexOnAction_(index, isInteraction, force) {
        if (this.adapter.getDisabledStateForElementIndex(index)) {
            return;
        }
        let checkedIndex = index;
        if (this.isMulti_) {
            checkedIndex = new Set([index]);
        }
        if (!this.isIndexValid_(checkedIndex)) {
            return;
        }
        if (this.isMulti_) {
            this.toggleMultiAtIndex(index, force, isInteraction);
        }
        else {
            if (isInteraction || force) {
                this.setSingleSelectionAtIndex_(index, isInteraction);
            }
            else {
                const isDeselection = this.selectedIndex_ === index;
                if (isDeselection) {
                    this.setSingleSelectionAtIndex_(numbers$6.UNSET_INDEX);
                }
            }
        }
        if (isInteraction) {
            this.adapter.notifyAction(index);
        }
    }
    toggleMultiAtIndex(index, force, isInteraction = true) {
        let newSelectionValue = false;
        if (force === undefined) {
            newSelectionValue = !this.adapter.getSelectedStateForElementIndex(index);
        }
        else {
            newSelectionValue = force;
        }
        const newSet = createSetFromIndex$1(this.selectedIndex_);
        if (newSelectionValue) {
            newSet.add(index);
        }
        else {
            newSet.delete(index);
        }
        this.setMultiSelectionAtIndex_(newSet, isInteraction);
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
function debounceLayout$1(callback, waitInMS = 50) {
    let timeoutId;
    // tslint:disable-next-line
    return function (updateItems = true) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            callback(updateItems);
        }, waitInMS);
    };
}
const isListItem$1 = (element) => {
    return element.hasAttribute('mwc-list-item');
};
function clearAndCreateItemsReadyPromise$1() {
    const oldResolver = this.itemsReadyResolver;
    this.itemsReady = new Promise((res) => {
        // TODO(b/175626389): Type '(value: never[] | PromiseLike<never[]>) => void'
        // is not assignable to type '(value?: never[] | PromiseLike<never[]> |
        // undefined) => void'.
        return this.itemsReadyResolver = res;
    });
    oldResolver();
}
/**
 * @fires selected {SelectedDetail}
 * @fires action {ActionDetail}
 * @fires items-updated
 */
class ListBase$1 extends BaseElement$1 {
    constructor() {
        super();
        this.mdcAdapter = null;
        this.mdcFoundationClass = MDCListFoundation$1;
        this.activatable = false;
        this.multi = false;
        this.wrapFocus = false;
        this.itemRoles = null;
        this.innerRole = null;
        this.innerAriaLabel = null;
        this.rootTabbable = false;
        this.previousTabindex = null;
        this.noninteractive = false;
        this.itemsReadyResolver = (() => {
            //
        });
        this.itemsReady = Promise.resolve([]);
        // tslint:enable:ban-ts-ignore
        this.items_ = [];
        const debouncedFunction = debounceLayout$1(this.layout.bind(this));
        this.debouncedLayout = (updateItems = true) => {
            clearAndCreateItemsReadyPromise$1.call(this);
            debouncedFunction(updateItems);
        };
    }
    // tslint:disable:ban-ts-ignore
    async getUpdateComplete() {
        // @ts-ignore
        const result = await super.getUpdateComplete();
        await this.itemsReady;
        return result;
    }
    get items() {
        return this.items_;
    }
    updateItems() {
        var _a;
        const nodes = (_a = this.assignedElements) !== null && _a !== void 0 ? _a : [];
        const listItems = [];
        for (const node of nodes) {
            if (isListItem$1(node)) {
                listItems.push(node);
                node._managingList = this;
            }
            if (node.hasAttribute('divider') && !node.hasAttribute('role')) {
                node.setAttribute('role', 'separator');
            }
        }
        this.items_ = listItems;
        const selectedIndices = new Set();
        this.items_.forEach((item, index) => {
            if (this.itemRoles) {
                item.setAttribute('role', this.itemRoles);
            }
            else {
                item.removeAttribute('role');
            }
            if (item.selected) {
                selectedIndices.add(index);
            }
        });
        if (this.multi) {
            this.select(selectedIndices);
        }
        else {
            const index = selectedIndices.size ? selectedIndices.entries().next().value[1] : -1;
            this.select(index);
        }
        const itemsUpdatedEv = new Event('items-updated', { bubbles: true, composed: true });
        this.dispatchEvent(itemsUpdatedEv);
    }
    get selected() {
        const index = this.index;
        if (!isIndexSet$1(index)) {
            if (index === -1) {
                return null;
            }
            return this.items[index];
        }
        const selected = [];
        for (const entry of index) {
            selected.push(this.items[entry]);
        }
        return selected;
    }
    get index() {
        if (this.mdcFoundation) {
            return this.mdcFoundation.getSelectedIndex();
        }
        return -1;
    }
    render() {
        const role = this.innerRole === null ? undefined : this.innerRole;
        const ariaLabel = this.innerAriaLabel === null ? undefined : this.innerAriaLabel;
        const tabindex = this.rootTabbable ? '0' : '-1';
        return x `
      <!-- @ts-ignore -->
      <ul
          tabindex=${tabindex}
          role="${l(role)}"
          aria-label="${l(ariaLabel)}"
          class="mdc-deprecated-list"
          @keydown=${this.onKeydown}
          @focusin=${this.onFocusIn}
          @focusout=${this.onFocusOut}
          @request-selected=${this.onRequestSelected}
          @list-item-rendered=${this.onListItemConnected}>
        <slot></slot>
        ${this.renderPlaceholder()}
      </ul>
    `;
    }
    renderPlaceholder() {
        var _a;
        const nodes = (_a = this.assignedElements) !== null && _a !== void 0 ? _a : [];
        if (this.emptyMessage !== undefined && nodes.length === 0) {
            return x `
        <mwc-list-item noninteractive>${this.emptyMessage}</mwc-list-item>
      `;
        }
        return null;
    }
    firstUpdated() {
        super.firstUpdated();
        if (!this.items.length) {
            // required because this is called before observers
            this.mdcFoundation.setMulti(this.multi);
            // for when children upgrade before list
            this.layout();
        }
    }
    onFocusIn(evt) {
        if (this.mdcFoundation && this.mdcRoot) {
            const index = this.getIndexOfTarget(evt);
            this.mdcFoundation.handleFocusIn(evt, index);
        }
    }
    onFocusOut(evt) {
        if (this.mdcFoundation && this.mdcRoot) {
            const index = this.getIndexOfTarget(evt);
            this.mdcFoundation.handleFocusOut(evt, index);
        }
    }
    onKeydown(evt) {
        if (this.mdcFoundation && this.mdcRoot) {
            const index = this.getIndexOfTarget(evt);
            const target = evt.target;
            const isRootListItem = isListItem$1(target);
            this.mdcFoundation.handleKeydown(evt, isRootListItem, index);
        }
    }
    onRequestSelected(evt) {
        if (this.mdcFoundation) {
            let index = this.getIndexOfTarget(evt);
            // might happen in shady dom slowness. Recalc children
            if (index === -1) {
                this.layout();
                index = this.getIndexOfTarget(evt);
                // still not found; may not be mwc-list-item. Unsupported case.
                if (index === -1) {
                    return;
                }
            }
            const element = this.items[index];
            if (element.disabled) {
                return;
            }
            const selected = evt.detail.selected;
            const source = evt.detail.source;
            this.mdcFoundation.handleSingleSelection(index, source === 'interaction', selected);
            evt.stopPropagation();
        }
    }
    getIndexOfTarget(evt) {
        const elements = this.items;
        const path = evt.composedPath();
        for (const pathItem of path) {
            let index = -1;
            if (isNodeElement$1(pathItem) && isListItem$1(pathItem)) {
                index = elements.indexOf(pathItem);
            }
            if (index !== -1) {
                return index;
            }
        }
        return -1;
    }
    createAdapter() {
        this.mdcAdapter = {
            getListItemCount: () => {
                if (this.mdcRoot) {
                    return this.items.length;
                }
                return 0;
            },
            getFocusedElementIndex: this.getFocusedItemIndex,
            getAttributeForElementIndex: (index, attr) => {
                const listElement = this.mdcRoot;
                if (!listElement) {
                    return '';
                }
                const element = this.items[index];
                return element ? element.getAttribute(attr) : '';
            },
            setAttributeForElementIndex: (index, attr, val) => {
                if (!this.mdcRoot) {
                    return;
                }
                const element = this.items[index];
                if (element) {
                    element.setAttribute(attr, val);
                }
            },
            focusItemAtIndex: (index) => {
                const element = this.items[index];
                if (element) {
                    element.focus();
                }
            },
            setTabIndexForElementIndex: (index, value) => {
                const item = this.items[index];
                if (item) {
                    item.tabindex = value;
                }
            },
            notifyAction: (index) => {
                const init = { bubbles: true, composed: true };
                init.detail = { index };
                const ev = new CustomEvent('action', init);
                this.dispatchEvent(ev);
            },
            notifySelected: (index, diff) => {
                const init = { bubbles: true, composed: true };
                init.detail = { index, diff };
                const ev = new CustomEvent('selected', init);
                this.dispatchEvent(ev);
            },
            isFocusInsideList: () => {
                return doesElementContainFocus$1(this);
            },
            isRootFocused: () => {
                const mdcRoot = this.mdcRoot;
                const root = mdcRoot.getRootNode();
                return root.activeElement === mdcRoot;
            },
            setDisabledStateForElementIndex: (index, value) => {
                const item = this.items[index];
                if (!item) {
                    return;
                }
                item.disabled = value;
            },
            getDisabledStateForElementIndex: (index) => {
                const item = this.items[index];
                if (!item) {
                    return false;
                }
                return item.disabled;
            },
            setSelectedStateForElementIndex: (index, value) => {
                const item = this.items[index];
                if (!item) {
                    return;
                }
                item.selected = value;
            },
            getSelectedStateForElementIndex: (index) => {
                const item = this.items[index];
                if (!item) {
                    return false;
                }
                return item.selected;
            },
            setActivatedStateForElementIndex: (index, value) => {
                const item = this.items[index];
                if (!item) {
                    return;
                }
                item.activated = value;
            },
        };
        return this.mdcAdapter;
    }
    selectUi(index, activate = false) {
        const item = this.items[index];
        if (item) {
            item.selected = true;
            item.activated = activate;
        }
    }
    deselectUi(index) {
        const item = this.items[index];
        if (item) {
            item.selected = false;
            item.activated = false;
        }
    }
    select(index) {
        if (!this.mdcFoundation) {
            return;
        }
        this.mdcFoundation.setSelectedIndex(index);
    }
    toggle(index, force) {
        if (this.multi) {
            this.mdcFoundation.toggleMultiAtIndex(index, force);
        }
    }
    onListItemConnected(e) {
        const target = e.target;
        this.layout(this.items.indexOf(target) === -1);
    }
    layout(updateItems = true) {
        if (updateItems) {
            this.updateItems();
        }
        const first = this.items[0];
        for (const item of this.items) {
            item.tabindex = -1;
        }
        if (first) {
            if (this.noninteractive) {
                if (!this.previousTabindex) {
                    this.previousTabindex = first;
                }
            }
            else {
                first.tabindex = 0;
            }
        }
        this.itemsReadyResolver();
    }
    getFocusedItemIndex() {
        if (!this.mdcRoot) {
            return -1;
        }
        if (!this.items.length) {
            return -1;
        }
        const activeElementPath = deepActiveElementPath$1();
        if (!activeElementPath.length) {
            return -1;
        }
        for (let i = activeElementPath.length - 1; i >= 0; i--) {
            const activeItem = activeElementPath[i];
            if (isListItem$1(activeItem)) {
                return this.items.indexOf(activeItem);
            }
        }
        return -1;
    }
    focusItemAtIndex(index) {
        for (const item of this.items) {
            if (item.tabindex === 0) {
                item.tabindex = -1;
                break;
            }
        }
        this.items[index].tabindex = 0;
        this.items[index].focus();
    }
    focus() {
        const root = this.mdcRoot;
        if (root) {
            root.focus();
        }
    }
    blur() {
        const root = this.mdcRoot;
        if (root) {
            root.blur();
        }
    }
}
__decorate([
    e$4({ type: String })
], ListBase$1.prototype, "emptyMessage", void 0);
__decorate([
    i$2('.mdc-deprecated-list')
], ListBase$1.prototype, "mdcRoot", void 0);
__decorate([
    o$1('', true, '*')
], ListBase$1.prototype, "assignedElements", void 0);
__decorate([
    o$1('', true, '[tabindex="0"]')
], ListBase$1.prototype, "tabbableElements", void 0);
__decorate([
    e$4({ type: Boolean }),
    observer$1(function (value) {
        if (this.mdcFoundation) {
            this.mdcFoundation.setUseActivatedClass(value);
        }
    })
], ListBase$1.prototype, "activatable", void 0);
__decorate([
    e$4({ type: Boolean }),
    observer$1(function (newValue, oldValue) {
        if (this.mdcFoundation) {
            this.mdcFoundation.setMulti(newValue);
        }
        if (oldValue !== undefined) {
            this.layout();
        }
    })
], ListBase$1.prototype, "multi", void 0);
__decorate([
    e$4({ type: Boolean }),
    observer$1(function (value) {
        if (this.mdcFoundation) {
            this.mdcFoundation.setWrapFocus(value);
        }
    })
], ListBase$1.prototype, "wrapFocus", void 0);
__decorate([
    e$4({ type: String }),
    observer$1(function (_newValue, oldValue) {
        if (oldValue !== undefined) {
            this.updateItems();
        }
    })
], ListBase$1.prototype, "itemRoles", void 0);
__decorate([
    e$4({ type: String })
], ListBase$1.prototype, "innerRole", void 0);
__decorate([
    e$4({ type: String })
], ListBase$1.prototype, "innerAriaLabel", void 0);
__decorate([
    e$4({ type: Boolean })
], ListBase$1.prototype, "rootTabbable", void 0);
__decorate([
    e$4({ type: Boolean, reflect: true }),
    observer$1(function (value) {
        var _a, _b;
        if (value) {
            const tabbable = (_b = (_a = this.tabbableElements) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : null;
            this.previousTabindex = tabbable;
            if (tabbable) {
                tabbable.setAttribute('tabindex', '-1');
            }
        }
        else if (!value && this.previousTabindex) {
            this.previousTabindex.setAttribute('tabindex', '0');
            this.previousTabindex = null;
        }
    })
], ListBase$1.prototype, "noninteractive", void 0);

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
const styles$c = i$5 `@keyframes mdc-ripple-fg-radius-in{from{animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transform:translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1)}to{transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}}@keyframes mdc-ripple-fg-opacity-in{from{animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity, 0)}}@keyframes mdc-ripple-fg-opacity-out{from{animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity, 0)}to{opacity:0}}:host{display:block}.mdc-deprecated-list{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-subtitle1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:1rem;font-size:var(--mdc-typography-subtitle1-font-size, 1rem);line-height:1.75rem;line-height:var(--mdc-typography-subtitle1-line-height, 1.75rem);font-weight:400;font-weight:var(--mdc-typography-subtitle1-font-weight, 400);letter-spacing:0.009375em;letter-spacing:var(--mdc-typography-subtitle1-letter-spacing, 0.009375em);text-decoration:inherit;text-decoration:var(--mdc-typography-subtitle1-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-subtitle1-text-transform, inherit);line-height:1.5rem;margin:0;padding:8px 0;list-style-type:none;color:rgba(0, 0, 0, 0.87);color:var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87));padding:var(--mdc-list-vertical-padding, 8px) 0}.mdc-deprecated-list:focus{outline:none}.mdc-deprecated-list-item{height:48px}.mdc-deprecated-list--dense{padding-top:4px;padding-bottom:4px;font-size:.812rem}.mdc-deprecated-list ::slotted([divider]){height:0;margin:0;border:none;border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:rgba(0, 0, 0, 0.12)}.mdc-deprecated-list ::slotted([divider][padded]){margin:0 var(--mdc-list-side-padding, 16px)}.mdc-deprecated-list ::slotted([divider][inset]){margin-left:var(--mdc-list-inset-margin, 72px);margin-right:0;width:calc( 100% - var(--mdc-list-inset-margin, 72px) )}[dir=rtl] .mdc-deprecated-list ::slotted([divider][inset]),.mdc-deprecated-list ::slotted([divider][inset][dir=rtl]){margin-left:0;margin-right:var(--mdc-list-inset-margin, 72px)}.mdc-deprecated-list ::slotted([divider][inset][padded]){width:calc( 100% - var(--mdc-list-inset-margin, 72px) - var(--mdc-list-side-padding, 16px) )}.mdc-deprecated-list--dense ::slotted([mwc-list-item]){height:40px}.mdc-deprecated-list--dense ::slotted([mwc-list]){--mdc-list-item-graphic-size: 20px}.mdc-deprecated-list--two-line.mdc-deprecated-list--dense ::slotted([mwc-list-item]),.mdc-deprecated-list--avatar-list.mdc-deprecated-list--dense ::slotted([mwc-list-item]){height:60px}.mdc-deprecated-list--avatar-list.mdc-deprecated-list--dense ::slotted([mwc-list]){--mdc-list-item-graphic-size: 36px}:host([noninteractive]){pointer-events:none;cursor:default}.mdc-deprecated-list--dense ::slotted(.mdc-deprecated-list-item__primary-text){display:block;margin-top:0;line-height:normal;margin-bottom:-20px}.mdc-deprecated-list--dense ::slotted(.mdc-deprecated-list-item__primary-text)::before{display:inline-block;width:0;height:24px;content:"";vertical-align:0}.mdc-deprecated-list--dense ::slotted(.mdc-deprecated-list-item__primary-text)::after{display:inline-block;width:0;height:20px;content:"";vertical-align:-20px}`;

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
let List$1 = class List extends ListBase$1 {
};
List$1.styles = [styles$c];
List$1 = __decorate([
    e$5('mwc-list')
], List$1);

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
var _a$2, _b$1;
// ShadyDOM should submit <input> elements in component internals
const USING_SHADY_DOM = (_b$1 = (_a$2 = window.ShadyDOM) === null || _a$2 === void 0 ? void 0 : _a$2.inUse) !== null && _b$1 !== void 0 ? _b$1 : false;
/** @soyCompatible */
class FormElement$1 extends BaseElement$1 {
    constructor() {
        super(...arguments);
        /**
         * Disabled state for the component. When `disabled` is set to `true`, the
         * component will not be added to form submission.
         */
        this.disabled = false;
        /**
         * Form element that contains this element
         */
        this.containingForm = null;
        this.formDataListener = (ev) => {
            if (!this.disabled) {
                this.setFormData(ev.formData);
            }
        };
    }
    findFormElement() {
        // If the component internals are not in Shadow DOM, subscribing to form
        // data events could lead to duplicated data, which may not work correctly
        // on the server side.
        if (!this.shadowRoot || USING_SHADY_DOM) {
            return null;
        }
        const root = this.getRootNode();
        const forms = root.querySelectorAll('form');
        for (const form of Array.from(forms)) {
            if (form.contains(this)) {
                return form;
            }
        }
        return null;
    }
    connectedCallback() {
        var _a;
        super.connectedCallback();
        this.containingForm = this.findFormElement();
        (_a = this.containingForm) === null || _a === void 0 ? void 0 : _a.addEventListener('formdata', this.formDataListener);
    }
    disconnectedCallback() {
        var _a;
        super.disconnectedCallback();
        (_a = this.containingForm) === null || _a === void 0 ? void 0 : _a.removeEventListener('formdata', this.formDataListener);
        this.containingForm = null;
    }
    click() {
        if (this.formElement && !this.disabled) {
            this.formElement.focus();
            this.formElement.click();
        }
    }
    firstUpdated() {
        super.firstUpdated();
        if (this.shadowRoot) {
            this.mdcRoot.addEventListener('change', (e) => {
                this.dispatchEvent(new Event('change', e));
            });
        }
    }
}
FormElement$1.shadowRootOptions = { mode: 'open', delegatesFocus: true };
__decorate([
    e$4({ type: Boolean })
], FormElement$1.prototype, "disabled", void 0);

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/** @soyCompatible */
class CheckboxBase$1 extends FormElement$1 {
    constructor() {
        super(...arguments);
        this.checked = false;
        this.indeterminate = false;
        this.disabled = false;
        this.name = '';
        this.value = 'on';
        /**
         * Touch target extends beyond visual boundary of a component by default.
         * Set to `true` to remove touch target added to the component.
         * @see https://material.io/design/usability/accessibility.html
         */
        this.reducedTouchTarget = false;
        this.animationClass = '';
        this.shouldRenderRipple = false;
        this.focused = false;
        // MDC Foundation is unused
        this.mdcFoundationClass = undefined;
        this.mdcFoundation = undefined;
        this.rippleElement = null;
        this.rippleHandlers = new RippleHandlers$1(() => {
            this.shouldRenderRipple = true;
            this.ripple.then((v) => this.rippleElement = v);
            return this.ripple;
        });
    }
    createAdapter() {
        return {};
    }
    update(changedProperties) {
        const oldIndeterminate = changedProperties.get('indeterminate');
        const oldChecked = changedProperties.get('checked');
        const oldDisabled = changedProperties.get('disabled');
        if (oldIndeterminate !== undefined || oldChecked !== undefined ||
            oldDisabled !== undefined) {
            const oldState = this.calculateAnimationStateName(!!oldChecked, !!oldIndeterminate, !!oldDisabled);
            const newState = this.calculateAnimationStateName(this.checked, this.indeterminate, this.disabled);
            this.animationClass = `${oldState}-${newState}`;
        }
        super.update(changedProperties);
    }
    calculateAnimationStateName(checked, indeterminate, disabled) {
        if (disabled) {
            return 'disabled';
        }
        else if (indeterminate) {
            return 'indeterminate';
        }
        else if (checked) {
            return 'checked';
        }
        else {
            return 'unchecked';
        }
    }
    // TODO(dfreedm): Make this use selected as a param after Polymer/internal#739
    /** @soyTemplate */
    renderRipple() {
        return this.shouldRenderRipple ? this.renderRippleTemplate() : '';
    }
    /** @soyTemplate */
    renderRippleTemplate() {
        return x `<mwc-ripple
        .disabled="${this.disabled}"
        unbounded></mwc-ripple>`;
    }
    /**
     * @soyTemplate
     * @soyAttributes checkboxAttributes: input
     * @soyClasses checkboxClasses: .mdc-checkbox
     */
    render() {
        const selected = this.indeterminate || this.checked;
        /* eslint-disable eqeqeq */
        // tslint:disable:triple-equals
        /** @classMap */
        const classes = {
            'mdc-checkbox--disabled': this.disabled,
            'mdc-checkbox--selected': selected,
            'mdc-checkbox--touch': !this.reducedTouchTarget,
            'mdc-ripple-upgraded--background-focused': this.focused,
            // transition animiation classes
            'mdc-checkbox--anim-checked-indeterminate': this.animationClass == 'checked-indeterminate',
            'mdc-checkbox--anim-checked-unchecked': this.animationClass == 'checked-unchecked',
            'mdc-checkbox--anim-indeterminate-checked': this.animationClass == 'indeterminate-checked',
            'mdc-checkbox--anim-indeterminate-unchecked': this.animationClass == 'indeterminate-unchecked',
            'mdc-checkbox--anim-unchecked-checked': this.animationClass == 'unchecked-checked',
            'mdc-checkbox--anim-unchecked-indeterminate': this.animationClass == 'unchecked-indeterminate',
        };
        // tslint:enable:triple-equals
        /* eslint-enable eqeqeq */
        const ariaChecked = this.indeterminate ? 'mixed' : undefined;
        return x `
      <div class="mdc-checkbox mdc-checkbox--upgraded ${o(classes)}">
        <input type="checkbox"
              class="mdc-checkbox__native-control"
              name="${l(this.name)}"
              aria-checked="${l(ariaChecked)}"
              aria-label="${l(this.ariaLabel)}"
              aria-labelledby="${l(this.ariaLabelledBy)}"
              aria-describedby="${l(this.ariaDescribedBy)}"
              data-indeterminate="${this.indeterminate ? 'true' : 'false'}"
              ?disabled="${this.disabled}"
              .indeterminate="${this.indeterminate}"
              .checked="${this.checked}"
              .value="${this.value}"
              @change="${this.handleChange}"
              @focus="${this.handleFocus}"
              @blur="${this.handleBlur}"
              @mousedown="${this.handleRippleMouseDown}"
              @mouseenter="${this.handleRippleMouseEnter}"
              @mouseleave="${this.handleRippleMouseLeave}"
              @touchstart="${this.handleRippleTouchStart}"
              @touchend="${this.handleRippleDeactivate}"
              @touchcancel="${this.handleRippleDeactivate}">
        <div class="mdc-checkbox__background"
          @animationend="${this.resetAnimationClass}">
          <svg class="mdc-checkbox__checkmark"
              viewBox="0 0 24 24">
            <path class="mdc-checkbox__checkmark-path"
                  fill="none"
                  d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
          </svg>
          <div class="mdc-checkbox__mixedmark"></div>
        </div>
        ${this.renderRipple()}
      </div>`;
    }
    setFormData(formData) {
        if (this.name && this.checked) {
            formData.append(this.name, this.value);
        }
    }
    handleFocus() {
        this.focused = true;
        this.handleRippleFocus();
    }
    handleBlur() {
        this.focused = false;
        this.handleRippleBlur();
    }
    handleRippleMouseDown(event) {
        const onUp = () => {
            window.removeEventListener('mouseup', onUp);
            this.handleRippleDeactivate();
        };
        window.addEventListener('mouseup', onUp);
        this.rippleHandlers.startPress(event);
    }
    handleRippleTouchStart(event) {
        this.rippleHandlers.startPress(event);
    }
    handleRippleDeactivate() {
        this.rippleHandlers.endPress();
    }
    handleRippleMouseEnter() {
        this.rippleHandlers.startHover();
    }
    handleRippleMouseLeave() {
        this.rippleHandlers.endHover();
    }
    handleRippleFocus() {
        this.rippleHandlers.startFocus();
    }
    handleRippleBlur() {
        this.rippleHandlers.endFocus();
    }
    handleChange() {
        this.checked = this.formElement.checked;
        this.indeterminate = this.formElement.indeterminate;
    }
    resetAnimationClass() {
        this.animationClass = '';
    }
    get isRippleActive() {
        var _a;
        return ((_a = this.rippleElement) === null || _a === void 0 ? void 0 : _a.isActive) || false;
    }
}
__decorate([
    i$2('.mdc-checkbox')
], CheckboxBase$1.prototype, "mdcRoot", void 0);
__decorate([
    i$2('input')
], CheckboxBase$1.prototype, "formElement", void 0);
__decorate([
    e$4({ type: Boolean, reflect: true })
], CheckboxBase$1.prototype, "checked", void 0);
__decorate([
    e$4({ type: Boolean })
], CheckboxBase$1.prototype, "indeterminate", void 0);
__decorate([
    e$4({ type: Boolean, reflect: true })
], CheckboxBase$1.prototype, "disabled", void 0);
__decorate([
    e$4({ type: String, reflect: true })
], CheckboxBase$1.prototype, "name", void 0);
__decorate([
    e$4({ type: String })
], CheckboxBase$1.prototype, "value", void 0);
__decorate([
    ariaProperty$1,
    e$4({ type: String, attribute: 'aria-label' })
], CheckboxBase$1.prototype, "ariaLabel", void 0);
__decorate([
    ariaProperty$1,
    e$4({ type: String, attribute: 'aria-labelledby' })
], CheckboxBase$1.prototype, "ariaLabelledBy", void 0);
__decorate([
    ariaProperty$1,
    e$4({ type: String, attribute: 'aria-describedby' })
], CheckboxBase$1.prototype, "ariaDescribedBy", void 0);
__decorate([
    e$4({ type: Boolean })
], CheckboxBase$1.prototype, "reducedTouchTarget", void 0);
__decorate([
    t$1()
], CheckboxBase$1.prototype, "animationClass", void 0);
__decorate([
    t$1()
], CheckboxBase$1.prototype, "shouldRenderRipple", void 0);
__decorate([
    t$1()
], CheckboxBase$1.prototype, "focused", void 0);
__decorate([
    e$2('mwc-ripple')
], CheckboxBase$1.prototype, "ripple", void 0);
__decorate([
    e$3({ passive: true })
], CheckboxBase$1.prototype, "handleRippleTouchStart", null);

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
const styles$b = i$5 `.mdc-checkbox{padding:calc((40px - 18px) / 2);padding:calc((var(--mdc-checkbox-ripple-size, 40px) - 18px) / 2);margin:calc((40px - 40px) / 2);margin:calc((var(--mdc-checkbox-touch-target-size, 40px) - 40px) / 2)}.mdc-checkbox .mdc-checkbox__ripple::before,.mdc-checkbox .mdc-checkbox__ripple::after{background-color:#000;background-color:var(--mdc-ripple-color, #000)}.mdc-checkbox:hover .mdc-checkbox__ripple::before,.mdc-checkbox.mdc-ripple-surface--hover .mdc-checkbox__ripple::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-checkbox.mdc-ripple-upgraded--background-focused .mdc-checkbox__ripple::before,.mdc-checkbox:not(.mdc-ripple-upgraded):focus .mdc-checkbox__ripple::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-checkbox:not(.mdc-ripple-upgraded) .mdc-checkbox__ripple::after{transition:opacity 150ms linear}.mdc-checkbox:not(.mdc-ripple-upgraded):active .mdc-checkbox__ripple::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-checkbox.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple::before,.mdc-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple::after{background-color:#018786;background-color:var(--mdc-ripple-color, var(--mdc-theme-secondary, #018786))}.mdc-checkbox.mdc-checkbox--selected:hover .mdc-checkbox__ripple::before,.mdc-checkbox.mdc-checkbox--selected.mdc-ripple-surface--hover .mdc-checkbox__ripple::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-checkbox.mdc-checkbox--selected.mdc-ripple-upgraded--background-focused .mdc-checkbox__ripple::before,.mdc-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded):focus .mdc-checkbox__ripple::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded) .mdc-checkbox__ripple::after{transition:opacity 150ms linear}.mdc-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded):active .mdc-checkbox__ripple::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-checkbox.mdc-checkbox--selected.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple::before,.mdc-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple::after{background-color:#018786;background-color:var(--mdc-ripple-color, var(--mdc-theme-secondary, #018786))}.mdc-checkbox .mdc-checkbox__background{top:calc((40px - 18px) / 2);top:calc((var(--mdc-checkbox-ripple-size, 40px) - 18px) / 2);left:calc((40px - 18px) / 2);left:calc((var(--mdc-checkbox-ripple-size, 40px) - 18px) / 2)}.mdc-checkbox .mdc-checkbox__native-control{top:calc((40px - 40px) / 2);top:calc((40px - var(--mdc-checkbox-touch-target-size, 40px)) / 2);right:calc((40px - 40px) / 2);right:calc((40px - var(--mdc-checkbox-touch-target-size, 40px)) / 2);left:calc((40px - 40px) / 2);left:calc((40px - var(--mdc-checkbox-touch-target-size, 40px)) / 2);width:40px;width:var(--mdc-checkbox-touch-target-size, 40px);height:40px;height:var(--mdc-checkbox-touch-target-size, 40px)}.mdc-checkbox .mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate):not([data-indeterminate=true])~.mdc-checkbox__background{border-color:rgba(0, 0, 0, 0.54);border-color:var(--mdc-checkbox-unchecked-color, rgba(0, 0, 0, 0.54));background-color:transparent}.mdc-checkbox .mdc-checkbox__native-control:enabled:checked~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control:enabled:indeterminate~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control[data-indeterminate=true]:enabled~.mdc-checkbox__background{border-color:#018786;border-color:var(--mdc-checkbox-checked-color, var(--mdc-theme-secondary, #018786));background-color:#018786;background-color:var(--mdc-checkbox-checked-color, var(--mdc-theme-secondary, #018786))}@keyframes mdc-checkbox-fade-in-background-8A000000FF01878600000000FF018786{0%{border-color:rgba(0, 0, 0, 0.54);border-color:var(--mdc-checkbox-unchecked-color, rgba(0, 0, 0, 0.54));background-color:transparent}50%{border-color:#018786;border-color:var(--mdc-checkbox-checked-color, var(--mdc-theme-secondary, #018786));background-color:#018786;background-color:var(--mdc-checkbox-checked-color, var(--mdc-theme-secondary, #018786))}}@keyframes mdc-checkbox-fade-out-background-8A000000FF01878600000000FF018786{0%,80%{border-color:#018786;border-color:var(--mdc-checkbox-checked-color, var(--mdc-theme-secondary, #018786));background-color:#018786;background-color:var(--mdc-checkbox-checked-color, var(--mdc-theme-secondary, #018786))}100%{border-color:rgba(0, 0, 0, 0.54);border-color:var(--mdc-checkbox-unchecked-color, rgba(0, 0, 0, 0.54));background-color:transparent}}.mdc-checkbox.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-checkbox.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__native-control:enabled~.mdc-checkbox__background{animation-name:mdc-checkbox-fade-in-background-8A000000FF01878600000000FF018786}.mdc-checkbox.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-checkbox.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background{animation-name:mdc-checkbox-fade-out-background-8A000000FF01878600000000FF018786}.mdc-checkbox .mdc-checkbox__native-control[disabled]:not(:checked):not(:indeterminate):not([data-indeterminate=true])~.mdc-checkbox__background{border-color:rgba(0, 0, 0, 0.38);border-color:var(--mdc-checkbox-disabled-color, rgba(0, 0, 0, 0.38));background-color:transparent}.mdc-checkbox .mdc-checkbox__native-control[disabled]:checked~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control[disabled]:indeterminate~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control[data-indeterminate=true][disabled]~.mdc-checkbox__background{border-color:transparent;background-color:rgba(0, 0, 0, 0.38);background-color:var(--mdc-checkbox-disabled-color, rgba(0, 0, 0, 0.38))}.mdc-checkbox .mdc-checkbox__native-control:enabled~.mdc-checkbox__background .mdc-checkbox__checkmark{color:#fff;color:var(--mdc-checkbox-ink-color, #fff)}.mdc-checkbox .mdc-checkbox__native-control:enabled~.mdc-checkbox__background .mdc-checkbox__mixedmark{border-color:#fff;border-color:var(--mdc-checkbox-ink-color, #fff)}.mdc-checkbox .mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__checkmark{color:#fff;color:var(--mdc-checkbox-ink-color, #fff)}.mdc-checkbox .mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__mixedmark{border-color:#fff;border-color:var(--mdc-checkbox-ink-color, #fff)}.mdc-touch-target-wrapper{display:inline}@keyframes mdc-checkbox-unchecked-checked-checkmark-path{0%,50%{stroke-dashoffset:29.7833385}50%{animation-timing-function:cubic-bezier(0, 0, 0.2, 1)}100%{stroke-dashoffset:0}}@keyframes mdc-checkbox-unchecked-indeterminate-mixedmark{0%,68.2%{transform:scaleX(0)}68.2%{animation-timing-function:cubic-bezier(0, 0, 0, 1)}100%{transform:scaleX(1)}}@keyframes mdc-checkbox-checked-unchecked-checkmark-path{from{animation-timing-function:cubic-bezier(0.4, 0, 1, 1);opacity:1;stroke-dashoffset:0}to{opacity:0;stroke-dashoffset:-29.7833385}}@keyframes mdc-checkbox-checked-indeterminate-checkmark{from{animation-timing-function:cubic-bezier(0, 0, 0.2, 1);transform:rotate(0deg);opacity:1}to{transform:rotate(45deg);opacity:0}}@keyframes mdc-checkbox-indeterminate-checked-checkmark{from{animation-timing-function:cubic-bezier(0.14, 0, 0, 1);transform:rotate(45deg);opacity:0}to{transform:rotate(360deg);opacity:1}}@keyframes mdc-checkbox-checked-indeterminate-mixedmark{from{animation-timing-function:mdc-animation-deceleration-curve-timing-function;transform:rotate(-45deg);opacity:0}to{transform:rotate(0deg);opacity:1}}@keyframes mdc-checkbox-indeterminate-checked-mixedmark{from{animation-timing-function:cubic-bezier(0.14, 0, 0, 1);transform:rotate(0deg);opacity:1}to{transform:rotate(315deg);opacity:0}}@keyframes mdc-checkbox-indeterminate-unchecked-mixedmark{0%{animation-timing-function:linear;transform:scaleX(1);opacity:1}32.8%,100%{transform:scaleX(0);opacity:0}}.mdc-checkbox{display:inline-block;position:relative;flex:0 0 18px;box-sizing:content-box;width:18px;height:18px;line-height:0;white-space:nowrap;cursor:pointer;vertical-align:bottom}.mdc-checkbox.mdc-ripple-upgraded--background-focused .mdc-checkbox__focus-ring,.mdc-checkbox:not(.mdc-ripple-upgraded):focus .mdc-checkbox__focus-ring{pointer-events:none;border:2px solid transparent;border-radius:6px;box-sizing:content-box;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);height:100%;width:100%}@media screen and (forced-colors: active){.mdc-checkbox.mdc-ripple-upgraded--background-focused .mdc-checkbox__focus-ring,.mdc-checkbox:not(.mdc-ripple-upgraded):focus .mdc-checkbox__focus-ring{border-color:CanvasText}}.mdc-checkbox.mdc-ripple-upgraded--background-focused .mdc-checkbox__focus-ring::after,.mdc-checkbox:not(.mdc-ripple-upgraded):focus .mdc-checkbox__focus-ring::after{content:"";border:2px solid transparent;border-radius:8px;display:block;position:absolute;top:50%;left:50%;transform:translate(-50%, -50%);height:calc(100% + 4px);width:calc(100% + 4px)}@media screen and (forced-colors: active){.mdc-checkbox.mdc-ripple-upgraded--background-focused .mdc-checkbox__focus-ring::after,.mdc-checkbox:not(.mdc-ripple-upgraded):focus .mdc-checkbox__focus-ring::after{border-color:CanvasText}}@media all and (-ms-high-contrast: none){.mdc-checkbox .mdc-checkbox__focus-ring{display:none}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-checkbox__mixedmark{margin:0 1px}}.mdc-checkbox--disabled{cursor:default;pointer-events:none}.mdc-checkbox__background{display:inline-flex;position:absolute;align-items:center;justify-content:center;box-sizing:border-box;width:18px;height:18px;border:2px solid currentColor;border-radius:2px;background-color:transparent;pointer-events:none;will-change:background-color,border-color;transition:background-color 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1),border-color 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-checkbox__checkmark{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;opacity:0;transition:opacity 180ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-checkbox--upgraded .mdc-checkbox__checkmark{opacity:1}.mdc-checkbox__checkmark-path{transition:stroke-dashoffset 180ms 0ms cubic-bezier(0.4, 0, 0.6, 1);stroke:currentColor;stroke-width:3.12px;stroke-dashoffset:29.7833385;stroke-dasharray:29.7833385}.mdc-checkbox__mixedmark{width:100%;height:0;transform:scaleX(0) rotate(0deg);border-width:1px;border-style:solid;opacity:0;transition:opacity 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1),transform 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__background,.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__background,.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__background,.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__background{animation-duration:180ms;animation-timing-function:linear}.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__checkmark-path{animation:mdc-checkbox-unchecked-checked-checkmark-path 180ms linear 0s;transition:none}.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__mixedmark{animation:mdc-checkbox-unchecked-indeterminate-mixedmark 90ms linear 0s;transition:none}.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__checkmark-path{animation:mdc-checkbox-checked-unchecked-checkmark-path 90ms linear 0s;transition:none}.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__checkmark{animation:mdc-checkbox-checked-indeterminate-checkmark 90ms linear 0s;transition:none}.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__mixedmark{animation:mdc-checkbox-checked-indeterminate-mixedmark 90ms linear 0s;transition:none}.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__checkmark{animation:mdc-checkbox-indeterminate-checked-checkmark 500ms linear 0s;transition:none}.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__mixedmark{animation:mdc-checkbox-indeterminate-checked-mixedmark 500ms linear 0s;transition:none}.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__mixedmark{animation:mdc-checkbox-indeterminate-unchecked-mixedmark 300ms linear 0s;transition:none}.mdc-checkbox__native-control:checked~.mdc-checkbox__background,.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background,.mdc-checkbox__native-control[data-indeterminate=true]~.mdc-checkbox__background{transition:border-color 90ms 0ms cubic-bezier(0, 0, 0.2, 1),background-color 90ms 0ms cubic-bezier(0, 0, 0.2, 1)}.mdc-checkbox__native-control:checked~.mdc-checkbox__background .mdc-checkbox__checkmark-path,.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background .mdc-checkbox__checkmark-path,.mdc-checkbox__native-control[data-indeterminate=true]~.mdc-checkbox__background .mdc-checkbox__checkmark-path{stroke-dashoffset:0}.mdc-checkbox__native-control{position:absolute;margin:0;padding:0;opacity:0;cursor:inherit}.mdc-checkbox__native-control:disabled{cursor:default;pointer-events:none}.mdc-checkbox--touch{margin:calc((48px - 40px) / 2);margin:calc((var(--mdc-checkbox-state-layer-size, 48px) - var(--mdc-checkbox-state-layer-size, 40px)) / 2)}.mdc-checkbox--touch .mdc-checkbox__native-control{top:calc((40px - 48px) / 2);top:calc((var(--mdc-checkbox-state-layer-size, 40px) - var(--mdc-checkbox-state-layer-size, 48px)) / 2);right:calc((40px - 48px) / 2);right:calc((var(--mdc-checkbox-state-layer-size, 40px) - var(--mdc-checkbox-state-layer-size, 48px)) / 2);left:calc((40px - 48px) / 2);left:calc((var(--mdc-checkbox-state-layer-size, 40px) - var(--mdc-checkbox-state-layer-size, 48px)) / 2);width:48px;width:var(--mdc-checkbox-state-layer-size, 48px);height:48px;height:var(--mdc-checkbox-state-layer-size, 48px)}.mdc-checkbox__native-control:checked~.mdc-checkbox__background .mdc-checkbox__checkmark{transition:opacity 180ms 0ms cubic-bezier(0, 0, 0.2, 1),transform 180ms 0ms cubic-bezier(0, 0, 0.2, 1);opacity:1}.mdc-checkbox__native-control:checked~.mdc-checkbox__background .mdc-checkbox__mixedmark{transform:scaleX(1) rotate(-45deg)}.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background .mdc-checkbox__checkmark,.mdc-checkbox__native-control[data-indeterminate=true]~.mdc-checkbox__background .mdc-checkbox__checkmark{transform:rotate(45deg);opacity:0;transition:opacity 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1),transform 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background .mdc-checkbox__mixedmark,.mdc-checkbox__native-control[data-indeterminate=true]~.mdc-checkbox__background .mdc-checkbox__mixedmark{transform:scaleX(1) rotate(0deg);opacity:1}.mdc-checkbox.mdc-checkbox--upgraded .mdc-checkbox__background,.mdc-checkbox.mdc-checkbox--upgraded .mdc-checkbox__checkmark,.mdc-checkbox.mdc-checkbox--upgraded .mdc-checkbox__checkmark-path,.mdc-checkbox.mdc-checkbox--upgraded .mdc-checkbox__mixedmark{transition:none}:host{outline:none;display:inline-flex;-webkit-tap-highlight-color:transparent}:host([checked]),:host([indeterminate]){--mdc-ripple-color:var(--mdc-theme-secondary, #018786)}.mdc-checkbox .mdc-checkbox__background::before{content:none}`;

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/** @soyCompatible */
let Checkbox$1 = class Checkbox extends CheckboxBase$1 {
};
Checkbox$1.styles = [styles$b];
Checkbox$1 = __decorate([
    e$5('mwc-checkbox')
], Checkbox$1);

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class CheckListItemBase$1 extends ListItemBase$1 {
    constructor() {
        super(...arguments);
        this.left = false;
        this.graphic = 'control';
    }
    render() {
        const checkboxClasses = {
            'mdc-deprecated-list-item__graphic': this.left,
            'mdc-deprecated-list-item__meta': !this.left,
        };
        const text = this.renderText();
        const graphic = this.graphic && this.graphic !== 'control' && !this.left ?
            this.renderGraphic() :
            x ``;
        const meta = this.hasMeta && this.left ? this.renderMeta() : x ``;
        const ripple = this.renderRipple();
        return x `
      ${ripple}
      ${graphic}
      ${this.left ? '' : text}
      <span class=${o(checkboxClasses)}>
        <mwc-checkbox
            reducedTouchTarget
            tabindex=${this.tabindex}
            .checked=${this.selected}
            ?disabled=${this.disabled}
            @change=${this.onChange}>
        </mwc-checkbox>
      </span>
      ${this.left ? text : ''}
      ${meta}`;
    }
    async onChange(evt) {
        const checkbox = evt.target;
        const changeFromProp = this.selected === checkbox.checked;
        if (!changeFromProp) {
            this._skipPropRequest = true;
            this.selected = checkbox.checked;
            await this.updateComplete;
            this._skipPropRequest = false;
        }
    }
}
__decorate([
    i$2('slot')
], CheckListItemBase$1.prototype, "slotElement", void 0);
__decorate([
    i$2('mwc-checkbox')
], CheckListItemBase$1.prototype, "checkboxElement", void 0);
__decorate([
    e$4({ type: Boolean })
], CheckListItemBase$1.prototype, "left", void 0);
__decorate([
    e$4({ type: String, reflect: true })
], CheckListItemBase$1.prototype, "graphic", void 0);

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
const styles$a = i$5 `:host(:not([twoline])){height:56px}:host(:not([left])) .mdc-deprecated-list-item__meta{height:40px;width:40px}`;

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
let CheckListItem$1 = class CheckListItem extends CheckListItemBase$1 {
};
CheckListItem$1.styles = [styles$d, styles$a];
CheckListItem$1 = __decorate([
    e$5('mwc-check-list-item')
], CheckListItem$1);

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var cssClasses$8 = {
    ANCHOR: 'mdc-menu-surface--anchor',
    ANIMATING_CLOSED: 'mdc-menu-surface--animating-closed',
    ANIMATING_OPEN: 'mdc-menu-surface--animating-open',
    FIXED: 'mdc-menu-surface--fixed',
    IS_OPEN_BELOW: 'mdc-menu-surface--is-open-below',
    OPEN: 'mdc-menu-surface--open',
    ROOT: 'mdc-menu-surface',
};
// tslint:disable:object-literal-sort-keys
var strings$6 = {
    CLOSED_EVENT: 'MDCMenuSurface:closed',
    CLOSING_EVENT: 'MDCMenuSurface:closing',
    OPENED_EVENT: 'MDCMenuSurface:opened',
    OPENING_EVENT: 'MDCMenuSurface:opening',
    FOCUSABLE_ELEMENTS: [
        'button:not(:disabled)',
        '[href]:not([aria-disabled="true"])',
        'input:not(:disabled)',
        'select:not(:disabled)',
        'textarea:not(:disabled)',
        '[tabindex]:not([tabindex="-1"]):not([aria-disabled="true"])',
    ].join(', '),
};
// tslint:enable:object-literal-sort-keys
var numbers$5 = {
    /** Total duration of menu-surface open animation. */
    TRANSITION_OPEN_DURATION: 120,
    /** Total duration of menu-surface close animation. */
    TRANSITION_CLOSE_DURATION: 75,
    /**
     * Margin left to the edge of the viewport when menu-surface is at maximum
     * possible height. Also used as a viewport margin.
     */
    MARGIN_TO_EDGE: 32,
    /**
     * Ratio of anchor width to menu-surface width for switching from corner
     * positioning to center positioning.
     */
    ANCHOR_TO_MENU_SURFACE_WIDTH_RATIO: 0.67,
    /**
     * Amount of time to wait before restoring focus when closing the menu
     * surface. This is important because if a touch event triggered the menu
     * close, and the subsequent mouse event occurs after focus is restored, then
     * the restored focus would be lost.
     */
    TOUCH_EVENT_WAIT_MS: 30,
};
/**
 * Enum for bits in the {@see Corner) bitmap.
 */
var CornerBit;
(function (CornerBit) {
    CornerBit[CornerBit["BOTTOM"] = 1] = "BOTTOM";
    CornerBit[CornerBit["CENTER"] = 2] = "CENTER";
    CornerBit[CornerBit["RIGHT"] = 4] = "RIGHT";
    CornerBit[CornerBit["FLIP_RTL"] = 8] = "FLIP_RTL";
})(CornerBit || (CornerBit = {}));
/**
 * Enum for representing an element corner for positioning the menu-surface.
 *
 * The START constants map to LEFT if element directionality is left
 * to right and RIGHT if the directionality is right to left.
 * Likewise END maps to RIGHT or LEFT depending on the directionality.
 */
var Corner;
(function (Corner) {
    Corner[Corner["TOP_LEFT"] = 0] = "TOP_LEFT";
    Corner[Corner["TOP_RIGHT"] = 4] = "TOP_RIGHT";
    Corner[Corner["BOTTOM_LEFT"] = 1] = "BOTTOM_LEFT";
    Corner[Corner["BOTTOM_RIGHT"] = 5] = "BOTTOM_RIGHT";
    Corner[Corner["TOP_START"] = 8] = "TOP_START";
    Corner[Corner["TOP_END"] = 12] = "TOP_END";
    Corner[Corner["BOTTOM_START"] = 9] = "BOTTOM_START";
    Corner[Corner["BOTTOM_END"] = 13] = "BOTTOM_END";
})(Corner || (Corner = {}));

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCMenuSurfaceFoundation = /** @class */ (function (_super) {
    __extends(MDCMenuSurfaceFoundation, _super);
    function MDCMenuSurfaceFoundation(adapter) {
        var _this = _super.call(this, __assign(__assign({}, MDCMenuSurfaceFoundation.defaultAdapter), adapter)) || this;
        _this.isSurfaceOpen = false;
        _this.isQuickOpen = false;
        _this.isHoistedElement = false;
        _this.isFixedPosition = false;
        _this.isHorizontallyCenteredOnViewport = false;
        _this.maxHeight = 0;
        _this.openBottomBias = 0;
        _this.openAnimationEndTimerId = 0;
        _this.closeAnimationEndTimerId = 0;
        _this.animationRequestId = 0;
        _this.anchorCorner = Corner.TOP_START;
        /**
         * Corner of the menu surface to which menu surface is attached to anchor.
         *
         *  Anchor corner --->+----------+
         *                    |  ANCHOR  |
         *                    +----------+
         *  Origin corner --->+--------------+
         *                    |              |
         *                    |              |
         *                    | MENU SURFACE |
         *                    |              |
         *                    |              |
         *                    +--------------+
         */
        _this.originCorner = Corner.TOP_START;
        _this.anchorMargin = { top: 0, right: 0, bottom: 0, left: 0 };
        _this.position = { x: 0, y: 0 };
        return _this;
    }
    Object.defineProperty(MDCMenuSurfaceFoundation, "cssClasses", {
        get: function () {
            return cssClasses$8;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCMenuSurfaceFoundation, "strings", {
        get: function () {
            return strings$6;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCMenuSurfaceFoundation, "numbers", {
        get: function () {
            return numbers$5;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCMenuSurfaceFoundation, "Corner", {
        get: function () {
            return Corner;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCMenuSurfaceFoundation, "defaultAdapter", {
        /**
         * @see {@link MDCMenuSurfaceAdapter} for typing information on parameters and return types.
         */
        get: function () {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                addClass: function () { return undefined; },
                removeClass: function () { return undefined; },
                hasClass: function () { return false; },
                hasAnchor: function () { return false; },
                isElementInContainer: function () { return false; },
                isFocused: function () { return false; },
                isRtl: function () { return false; },
                getInnerDimensions: function () { return ({ height: 0, width: 0 }); },
                getAnchorDimensions: function () { return null; },
                getWindowDimensions: function () { return ({ height: 0, width: 0 }); },
                getBodyDimensions: function () { return ({ height: 0, width: 0 }); },
                getWindowScroll: function () { return ({ x: 0, y: 0 }); },
                setPosition: function () { return undefined; },
                setMaxHeight: function () { return undefined; },
                setTransformOrigin: function () { return undefined; },
                saveFocus: function () { return undefined; },
                restoreFocus: function () { return undefined; },
                notifyClose: function () { return undefined; },
                notifyClosing: function () { return undefined; },
                notifyOpen: function () { return undefined; },
                notifyOpening: function () { return undefined; },
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: false,
        configurable: true
    });
    MDCMenuSurfaceFoundation.prototype.init = function () {
        var _a = MDCMenuSurfaceFoundation.cssClasses, ROOT = _a.ROOT, OPEN = _a.OPEN;
        if (!this.adapter.hasClass(ROOT)) {
            throw new Error(ROOT + " class required in root element.");
        }
        if (this.adapter.hasClass(OPEN)) {
            this.isSurfaceOpen = true;
        }
    };
    MDCMenuSurfaceFoundation.prototype.destroy = function () {
        clearTimeout(this.openAnimationEndTimerId);
        clearTimeout(this.closeAnimationEndTimerId);
        // Cancel any currently running animations.
        cancelAnimationFrame(this.animationRequestId);
    };
    /**
     * @param corner Default anchor corner alignment of top-left menu surface
     *     corner.
     */
    MDCMenuSurfaceFoundation.prototype.setAnchorCorner = function (corner) {
        this.anchorCorner = corner;
    };
    /**
     * Flip menu corner horizontally.
     */
    MDCMenuSurfaceFoundation.prototype.flipCornerHorizontally = function () {
        this.originCorner = this.originCorner ^ CornerBit.RIGHT;
    };
    /**
     * @param margin Set of margin values from anchor.
     */
    MDCMenuSurfaceFoundation.prototype.setAnchorMargin = function (margin) {
        this.anchorMargin.top = margin.top || 0;
        this.anchorMargin.right = margin.right || 0;
        this.anchorMargin.bottom = margin.bottom || 0;
        this.anchorMargin.left = margin.left || 0;
    };
    /** Used to indicate if the menu-surface is hoisted to the body. */
    MDCMenuSurfaceFoundation.prototype.setIsHoisted = function (isHoisted) {
        this.isHoistedElement = isHoisted;
    };
    /**
     * Used to set the menu-surface calculations based on a fixed position menu.
     */
    MDCMenuSurfaceFoundation.prototype.setFixedPosition = function (isFixedPosition) {
        this.isFixedPosition = isFixedPosition;
    };
    /**
     * @return Returns true if menu is in fixed (`position: fixed`) position.
     */
    MDCMenuSurfaceFoundation.prototype.isFixed = function () {
        return this.isFixedPosition;
    };
    /** Sets the menu-surface position on the page. */
    MDCMenuSurfaceFoundation.prototype.setAbsolutePosition = function (x, y) {
        this.position.x = this.isFinite(x) ? x : 0;
        this.position.y = this.isFinite(y) ? y : 0;
    };
    /** Sets whether menu-surface should be horizontally centered to viewport. */
    MDCMenuSurfaceFoundation.prototype.setIsHorizontallyCenteredOnViewport = function (isCentered) {
        this.isHorizontallyCenteredOnViewport = isCentered;
    };
    MDCMenuSurfaceFoundation.prototype.setQuickOpen = function (quickOpen) {
        this.isQuickOpen = quickOpen;
    };
    /**
     * Sets maximum menu-surface height on open.
     * @param maxHeight The desired max-height. Set to 0 (default) to
     *     automatically calculate max height based on available viewport space.
     */
    MDCMenuSurfaceFoundation.prototype.setMaxHeight = function (maxHeight) {
        this.maxHeight = maxHeight;
    };
    /**
     * Set to a positive integer to influence the menu to preferentially open
     * below the anchor instead of above.
     * @param bias A value of `x` simulates an extra `x` pixels of available space
     *     below the menu during positioning calculations.
     */
    MDCMenuSurfaceFoundation.prototype.setOpenBottomBias = function (bias) {
        this.openBottomBias = bias;
    };
    MDCMenuSurfaceFoundation.prototype.isOpen = function () {
        return this.isSurfaceOpen;
    };
    /**
     * Open the menu surface.
     */
    MDCMenuSurfaceFoundation.prototype.open = function () {
        var _this = this;
        if (this.isSurfaceOpen) {
            return;
        }
        this.adapter.notifyOpening();
        this.adapter.saveFocus();
        if (this.isQuickOpen) {
            this.isSurfaceOpen = true;
            this.adapter.addClass(MDCMenuSurfaceFoundation.cssClasses.OPEN);
            this.dimensions = this.adapter.getInnerDimensions();
            this.autoposition();
            this.adapter.notifyOpen();
        }
        else {
            this.adapter.addClass(MDCMenuSurfaceFoundation.cssClasses.ANIMATING_OPEN);
            this.animationRequestId = requestAnimationFrame(function () {
                _this.dimensions = _this.adapter.getInnerDimensions();
                _this.autoposition();
                _this.adapter.addClass(MDCMenuSurfaceFoundation.cssClasses.OPEN);
                _this.openAnimationEndTimerId = setTimeout(function () {
                    _this.openAnimationEndTimerId = 0;
                    _this.adapter.removeClass(MDCMenuSurfaceFoundation.cssClasses.ANIMATING_OPEN);
                    _this.adapter.notifyOpen();
                }, numbers$5.TRANSITION_OPEN_DURATION);
            });
            this.isSurfaceOpen = true;
        }
    };
    /**
     * Closes the menu surface.
     */
    MDCMenuSurfaceFoundation.prototype.close = function (skipRestoreFocus) {
        var _this = this;
        if (skipRestoreFocus === void 0) { skipRestoreFocus = false; }
        if (!this.isSurfaceOpen) {
            return;
        }
        this.adapter.notifyClosing();
        if (this.isQuickOpen) {
            this.isSurfaceOpen = false;
            if (!skipRestoreFocus) {
                this.maybeRestoreFocus();
            }
            this.adapter.removeClass(MDCMenuSurfaceFoundation.cssClasses.OPEN);
            this.adapter.removeClass(MDCMenuSurfaceFoundation.cssClasses.IS_OPEN_BELOW);
            this.adapter.notifyClose();
            return;
        }
        this.adapter.addClass(MDCMenuSurfaceFoundation.cssClasses.ANIMATING_CLOSED);
        requestAnimationFrame(function () {
            _this.adapter.removeClass(MDCMenuSurfaceFoundation.cssClasses.OPEN);
            _this.adapter.removeClass(MDCMenuSurfaceFoundation.cssClasses.IS_OPEN_BELOW);
            _this.closeAnimationEndTimerId = setTimeout(function () {
                _this.closeAnimationEndTimerId = 0;
                _this.adapter.removeClass(MDCMenuSurfaceFoundation.cssClasses.ANIMATING_CLOSED);
                _this.adapter.notifyClose();
            }, numbers$5.TRANSITION_CLOSE_DURATION);
        });
        this.isSurfaceOpen = false;
        if (!skipRestoreFocus) {
            this.maybeRestoreFocus();
        }
    };
    /** Handle clicks and close if not within menu-surface element. */
    MDCMenuSurfaceFoundation.prototype.handleBodyClick = function (evt) {
        var el = evt.target;
        if (this.adapter.isElementInContainer(el)) {
            return;
        }
        this.close();
    };
    /** Handle keys that close the surface. */
    MDCMenuSurfaceFoundation.prototype.handleKeydown = function (evt) {
        var keyCode = evt.keyCode, key = evt.key;
        var isEscape = key === 'Escape' || keyCode === 27;
        if (isEscape) {
            this.close();
        }
    };
    MDCMenuSurfaceFoundation.prototype.autoposition = function () {
        var _a;
        // Compute measurements for autoposition methods reuse.
        this.measurements = this.getAutoLayoutmeasurements();
        var corner = this.getoriginCorner();
        var maxMenuSurfaceHeight = this.getMenuSurfaceMaxHeight(corner);
        var verticalAlignment = this.hasBit(corner, CornerBit.BOTTOM) ? 'bottom' : 'top';
        var horizontalAlignment = this.hasBit(corner, CornerBit.RIGHT) ? 'right' : 'left';
        var horizontalOffset = this.getHorizontalOriginOffset(corner);
        var verticalOffset = this.getVerticalOriginOffset(corner);
        var _b = this.measurements, anchorSize = _b.anchorSize, surfaceSize = _b.surfaceSize;
        var position = (_a = {},
            _a[horizontalAlignment] = horizontalOffset,
            _a[verticalAlignment] = verticalOffset,
            _a);
        // Center align when anchor width is comparable or greater than menu
        // surface, otherwise keep corner.
        if (anchorSize.width / surfaceSize.width >
            numbers$5.ANCHOR_TO_MENU_SURFACE_WIDTH_RATIO) {
            horizontalAlignment = 'center';
        }
        // If the menu-surface has been hoisted to the body, it's no longer relative
        // to the anchor element
        if (this.isHoistedElement || this.isFixedPosition) {
            this.adjustPositionForHoistedElement(position);
        }
        this.adapter.setTransformOrigin(horizontalAlignment + " " + verticalAlignment);
        this.adapter.setPosition(position);
        this.adapter.setMaxHeight(maxMenuSurfaceHeight ? maxMenuSurfaceHeight + 'px' : '');
        // If it is opened from the top then add is-open-below class
        if (!this.hasBit(corner, CornerBit.BOTTOM)) {
            this.adapter.addClass(MDCMenuSurfaceFoundation.cssClasses.IS_OPEN_BELOW);
        }
    };
    /**
     * @return Measurements used to position menu surface popup.
     */
    MDCMenuSurfaceFoundation.prototype.getAutoLayoutmeasurements = function () {
        var anchorRect = this.adapter.getAnchorDimensions();
        var bodySize = this.adapter.getBodyDimensions();
        var viewportSize = this.adapter.getWindowDimensions();
        var windowScroll = this.adapter.getWindowScroll();
        if (!anchorRect) {
            // tslint:disable:object-literal-sort-keys Positional properties are more readable when they're grouped together
            anchorRect = {
                top: this.position.y,
                right: this.position.x,
                bottom: this.position.y,
                left: this.position.x,
                width: 0,
                height: 0,
            };
            // tslint:enable:object-literal-sort-keys
        }
        return {
            anchorSize: anchorRect,
            bodySize: bodySize,
            surfaceSize: this.dimensions,
            viewportDistance: {
                // tslint:disable:object-literal-sort-keys Positional properties are more readable when they're grouped together
                top: anchorRect.top,
                right: viewportSize.width - anchorRect.right,
                bottom: viewportSize.height - anchorRect.bottom,
                left: anchorRect.left,
                // tslint:enable:object-literal-sort-keys
            },
            viewportSize: viewportSize,
            windowScroll: windowScroll,
        };
    };
    /**
     * Computes the corner of the anchor from which to animate and position the
     * menu surface.
     *
     * Only LEFT or RIGHT bit is used to position the menu surface ignoring RTL
     * context. E.g., menu surface will be positioned from right side on TOP_END.
     */
    MDCMenuSurfaceFoundation.prototype.getoriginCorner = function () {
        var corner = this.originCorner;
        var _a = this.measurements, viewportDistance = _a.viewportDistance, anchorSize = _a.anchorSize, surfaceSize = _a.surfaceSize;
        var MARGIN_TO_EDGE = MDCMenuSurfaceFoundation.numbers.MARGIN_TO_EDGE;
        var isAnchoredToBottom = this.hasBit(this.anchorCorner, CornerBit.BOTTOM);
        var availableTop;
        var availableBottom;
        if (isAnchoredToBottom) {
            availableTop =
                viewportDistance.top - MARGIN_TO_EDGE + this.anchorMargin.bottom;
            availableBottom =
                viewportDistance.bottom - MARGIN_TO_EDGE - this.anchorMargin.bottom;
        }
        else {
            availableTop =
                viewportDistance.top - MARGIN_TO_EDGE + this.anchorMargin.top;
            availableBottom = viewportDistance.bottom - MARGIN_TO_EDGE +
                anchorSize.height - this.anchorMargin.top;
        }
        var isAvailableBottom = availableBottom - surfaceSize.height > 0;
        if (!isAvailableBottom &&
            availableTop > availableBottom + this.openBottomBias) {
            // Attach bottom side of surface to the anchor.
            corner = this.setBit(corner, CornerBit.BOTTOM);
        }
        var isRtl = this.adapter.isRtl();
        var isFlipRtl = this.hasBit(this.anchorCorner, CornerBit.FLIP_RTL);
        var hasRightBit = this.hasBit(this.anchorCorner, CornerBit.RIGHT) ||
            this.hasBit(corner, CornerBit.RIGHT);
        // Whether surface attached to right side of anchor element.
        var isAnchoredToRight = false;
        // Anchored to start
        if (isRtl && isFlipRtl) {
            isAnchoredToRight = !hasRightBit;
        }
        else {
            // Anchored to right
            isAnchoredToRight = hasRightBit;
        }
        var availableLeft;
        var availableRight;
        if (isAnchoredToRight) {
            availableLeft =
                viewportDistance.left + anchorSize.width + this.anchorMargin.right;
            availableRight = viewportDistance.right - this.anchorMargin.right;
        }
        else {
            availableLeft = viewportDistance.left + this.anchorMargin.left;
            availableRight =
                viewportDistance.right + anchorSize.width - this.anchorMargin.left;
        }
        var isAvailableLeft = availableLeft - surfaceSize.width > 0;
        var isAvailableRight = availableRight - surfaceSize.width > 0;
        var isOriginCornerAlignedToEnd = this.hasBit(corner, CornerBit.FLIP_RTL) &&
            this.hasBit(corner, CornerBit.RIGHT);
        if (isAvailableRight && isOriginCornerAlignedToEnd && isRtl ||
            !isAvailableLeft && isOriginCornerAlignedToEnd) {
            // Attach left side of surface to the anchor.
            corner = this.unsetBit(corner, CornerBit.RIGHT);
        }
        else if (isAvailableLeft && isAnchoredToRight && isRtl ||
            (isAvailableLeft && !isAnchoredToRight && hasRightBit) ||
            (!isAvailableRight && availableLeft >= availableRight)) {
            // Attach right side of surface to the anchor.
            corner = this.setBit(corner, CornerBit.RIGHT);
        }
        return corner;
    };
    /**
     * @param corner Origin corner of the menu surface.
     * @return Maximum height of the menu surface, based on available space. 0
     *     indicates should not be set.
     */
    MDCMenuSurfaceFoundation.prototype.getMenuSurfaceMaxHeight = function (corner) {
        if (this.maxHeight > 0) {
            return this.maxHeight;
        }
        var viewportDistance = this.measurements.viewportDistance;
        var maxHeight = 0;
        var isBottomAligned = this.hasBit(corner, CornerBit.BOTTOM);
        var isBottomAnchored = this.hasBit(this.anchorCorner, CornerBit.BOTTOM);
        var MARGIN_TO_EDGE = MDCMenuSurfaceFoundation.numbers.MARGIN_TO_EDGE;
        // When maximum height is not specified, it is handled from CSS.
        if (isBottomAligned) {
            maxHeight = viewportDistance.top + this.anchorMargin.top - MARGIN_TO_EDGE;
            if (!isBottomAnchored) {
                maxHeight += this.measurements.anchorSize.height;
            }
        }
        else {
            maxHeight = viewportDistance.bottom - this.anchorMargin.bottom +
                this.measurements.anchorSize.height - MARGIN_TO_EDGE;
            if (isBottomAnchored) {
                maxHeight -= this.measurements.anchorSize.height;
            }
        }
        return maxHeight;
    };
    /**
     * @param corner Origin corner of the menu surface.
     * @return Horizontal offset of menu surface origin corner from corresponding
     *     anchor corner.
     */
    MDCMenuSurfaceFoundation.prototype.getHorizontalOriginOffset = function (corner) {
        var anchorSize = this.measurements.anchorSize;
        // isRightAligned corresponds to using the 'right' property on the surface.
        var isRightAligned = this.hasBit(corner, CornerBit.RIGHT);
        var avoidHorizontalOverlap = this.hasBit(this.anchorCorner, CornerBit.RIGHT);
        if (isRightAligned) {
            var rightOffset = avoidHorizontalOverlap ?
                anchorSize.width - this.anchorMargin.left :
                this.anchorMargin.right;
            // For hoisted or fixed elements, adjust the offset by the difference
            // between viewport width and body width so when we calculate the right
            // value (`adjustPositionForHoistedElement`) based on the element
            // position, the right property is correct.
            if (this.isHoistedElement || this.isFixedPosition) {
                return rightOffset -
                    (this.measurements.viewportSize.width -
                        this.measurements.bodySize.width);
            }
            return rightOffset;
        }
        return avoidHorizontalOverlap ? anchorSize.width - this.anchorMargin.right :
            this.anchorMargin.left;
    };
    /**
     * @param corner Origin corner of the menu surface.
     * @return Vertical offset of menu surface origin corner from corresponding
     *     anchor corner.
     */
    MDCMenuSurfaceFoundation.prototype.getVerticalOriginOffset = function (corner) {
        var anchorSize = this.measurements.anchorSize;
        var isBottomAligned = this.hasBit(corner, CornerBit.BOTTOM);
        var avoidVerticalOverlap = this.hasBit(this.anchorCorner, CornerBit.BOTTOM);
        var y = 0;
        if (isBottomAligned) {
            y = avoidVerticalOverlap ? anchorSize.height - this.anchorMargin.top :
                -this.anchorMargin.bottom;
        }
        else {
            y = avoidVerticalOverlap ?
                (anchorSize.height + this.anchorMargin.bottom) :
                this.anchorMargin.top;
        }
        return y;
    };
    /**
     * Calculates the offsets for positioning the menu-surface when the
     * menu-surface has been hoisted to the body.
     */
    MDCMenuSurfaceFoundation.prototype.adjustPositionForHoistedElement = function (position) {
        var e_1, _a;
        var _b = this.measurements, windowScroll = _b.windowScroll, viewportDistance = _b.viewportDistance, surfaceSize = _b.surfaceSize, viewportSize = _b.viewportSize;
        var props = Object.keys(position);
        try {
            for (var props_1 = __values(props), props_1_1 = props_1.next(); !props_1_1.done; props_1_1 = props_1.next()) {
                var prop = props_1_1.value;
                var value = position[prop] || 0;
                if (this.isHorizontallyCenteredOnViewport &&
                    (prop === 'left' || prop === 'right')) {
                    position[prop] = (viewportSize.width - surfaceSize.width) / 2;
                    continue;
                }
                // Hoisted surfaces need to have the anchor elements location on the page
                // added to the position properties for proper alignment on the body.
                value += viewportDistance[prop];
                // Surfaces that are absolutely positioned need to have additional
                // calculations for scroll and bottom positioning.
                if (!this.isFixedPosition) {
                    if (prop === 'top') {
                        value += windowScroll.y;
                    }
                    else if (prop === 'bottom') {
                        value -= windowScroll.y;
                    }
                    else if (prop === 'left') {
                        value += windowScroll.x;
                    }
                    else { // prop === 'right'
                        value -= windowScroll.x;
                    }
                }
                position[prop] = value;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (props_1_1 && !props_1_1.done && (_a = props_1.return)) _a.call(props_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    /**
     * The last focused element when the menu surface was opened should regain
     * focus, if the user is focused on or within the menu surface when it is
     * closed.
     */
    MDCMenuSurfaceFoundation.prototype.maybeRestoreFocus = function () {
        var _this = this;
        var isRootFocused = this.adapter.isFocused();
        var ownerDocument = this.adapter.getOwnerDocument ?
            this.adapter.getOwnerDocument() :
            document;
        var childHasFocus = ownerDocument.activeElement &&
            this.adapter.isElementInContainer(ownerDocument.activeElement);
        if (isRootFocused || childHasFocus) {
            // Wait before restoring focus when closing the menu surface. This is
            // important because if a touch event triggered the menu close, and the
            // subsequent mouse event occurs after focus is restored, then the
            // restored focus would be lost.
            setTimeout(function () {
                _this.adapter.restoreFocus();
            }, numbers$5.TOUCH_EVENT_WAIT_MS);
        }
    };
    MDCMenuSurfaceFoundation.prototype.hasBit = function (corner, bit) {
        return Boolean(corner & bit); // tslint:disable-line:no-bitwise
    };
    MDCMenuSurfaceFoundation.prototype.setBit = function (corner, bit) {
        return corner | bit; // tslint:disable-line:no-bitwise
    };
    MDCMenuSurfaceFoundation.prototype.unsetBit = function (corner, bit) {
        return corner ^ bit;
    };
    /**
     * isFinite that doesn't force conversion to number type.
     * Equivalent to Number.isFinite in ES2015, which is not supported in IE.
     */
    MDCMenuSurfaceFoundation.prototype.isFinite = function (num) {
        return typeof num === 'number' && isFinite(num);
    };
    return MDCMenuSurfaceFoundation;
}(MDCFoundation$1));
// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
var MDCMenuSurfaceFoundation$1 = MDCMenuSurfaceFoundation;

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
// tslint:disable:no-bitwise
// required for closure compiler
const stringToCorner = {
    'TOP_LEFT': Corner.TOP_LEFT,
    'TOP_RIGHT': Corner.TOP_RIGHT,
    'BOTTOM_LEFT': Corner.BOTTOM_LEFT,
    'BOTTOM_RIGHT': Corner.BOTTOM_RIGHT,
    'TOP_START': Corner.TOP_START,
    'TOP_END': Corner.TOP_END,
    'BOTTOM_START': Corner.BOTTOM_START,
    'BOTTOM_END': Corner.BOTTOM_END,
};
/**
 * @fires opened
 * @fires closed
 */
class MenuSurfaceBase extends BaseElement$1 {
    constructor() {
        super(...arguments);
        this.mdcFoundationClass = MDCMenuSurfaceFoundation$1;
        this.absolute = false;
        this.fullwidth = false;
        this.fixed = false;
        this.x = null;
        this.y = null;
        // must be defined before open or else race condition in foundation occurs.
        this.quick = false;
        this.open = false;
        this.stayOpenOnBodyClick = false;
        this.bitwiseCorner = Corner.TOP_START;
        this.previousMenuCorner = null;
        // must be defined before observer of anchor corner for initialization
        this.menuCorner = 'START';
        this.corner = 'TOP_START';
        this.styleTop = '';
        this.styleLeft = '';
        this.styleRight = '';
        this.styleBottom = '';
        this.styleMaxHeight = '';
        this.styleTransformOrigin = '';
        this.anchor = null;
        this.previouslyFocused = null;
        this.previousAnchor = null;
        this.onBodyClickBound = () => undefined;
    }
    render() {
        return this.renderSurface();
    }
    renderSurface() {
        const classes = this.getRootClasses();
        const styles = this.getRootStyles();
        return x `
      <div
          class=${o(classes)}
          style="${i(styles)}"
          @keydown=${this.onKeydown}
          @opened=${this.registerBodyClick}
          @closed=${this.deregisterBodyClick}>
        ${this.renderContent()}
      </div>`;
    }
    getRootClasses() {
        return {
            'mdc-menu-surface': true,
            'mdc-menu-surface--fixed': this.fixed,
            'mdc-menu-surface--fullwidth': this.fullwidth,
        };
    }
    getRootStyles() {
        return {
            'top': this.styleTop,
            'left': this.styleLeft,
            'right': this.styleRight,
            'bottom': this.styleBottom,
            'max-height': this.styleMaxHeight,
            'transform-origin': this.styleTransformOrigin,
        };
    }
    renderContent() {
        return x `<slot></slot>`;
    }
    createAdapter() {
        return Object.assign(Object.assign({}, addHasRemoveClass$1(this.mdcRoot)), { hasAnchor: () => {
                return !!this.anchor;
            }, notifyClose: () => {
                const init = { bubbles: true, composed: true };
                const ev = new CustomEvent('closed', init);
                this.open = false;
                this.mdcRoot.dispatchEvent(ev);
            }, notifyClosing: () => {
                const init = { bubbles: true, composed: true };
                const ev = new CustomEvent('closing', init);
                this.mdcRoot.dispatchEvent(ev);
            }, notifyOpen: () => {
                const init = { bubbles: true, composed: true };
                const ev = new CustomEvent('opened', init);
                this.open = true;
                this.mdcRoot.dispatchEvent(ev);
            }, notifyOpening: () => {
                const init = { bubbles: true, composed: true };
                const ev = new CustomEvent('opening', init);
                this.mdcRoot.dispatchEvent(ev);
            }, isElementInContainer: () => false, isRtl: () => {
                if (this.mdcRoot) {
                    return getComputedStyle(this.mdcRoot).direction === 'rtl';
                }
                return false;
            }, setTransformOrigin: (origin) => {
                const root = this.mdcRoot;
                if (!root) {
                    return;
                }
                this.styleTransformOrigin = origin;
            }, isFocused: () => {
                return doesElementContainFocus$1(this);
            }, saveFocus: () => {
                const activeElementPath = deepActiveElementPath$1();
                const pathLength = activeElementPath.length;
                if (!pathLength) {
                    this.previouslyFocused = null;
                }
                this.previouslyFocused = activeElementPath[pathLength - 1];
            }, restoreFocus: () => {
                if (!this.previouslyFocused) {
                    return;
                }
                if ('focus' in this.previouslyFocused) {
                    this.previouslyFocused.focus();
                }
            }, getInnerDimensions: () => {
                const mdcRoot = this.mdcRoot;
                if (!mdcRoot) {
                    return { width: 0, height: 0 };
                }
                return { width: mdcRoot.offsetWidth, height: mdcRoot.offsetHeight };
            }, getAnchorDimensions: () => {
                const anchorElement = this.anchor;
                return anchorElement ? anchorElement.getBoundingClientRect() : null;
            }, getBodyDimensions: () => {
                return {
                    width: document.body.clientWidth,
                    height: document.body.clientHeight,
                };
            }, getWindowDimensions: () => {
                return {
                    width: window.innerWidth,
                    height: window.innerHeight,
                };
            }, getWindowScroll: () => {
                return {
                    x: window.pageXOffset,
                    y: window.pageYOffset,
                };
            }, setPosition: (position) => {
                const mdcRoot = this.mdcRoot;
                if (!mdcRoot) {
                    return;
                }
                this.styleLeft = 'left' in position ? `${position.left}px` : '';
                this.styleRight = 'right' in position ? `${position.right}px` : '';
                this.styleTop = 'top' in position ? `${position.top}px` : '';
                this.styleBottom = 'bottom' in position ? `${position.bottom}px` : '';
            }, setMaxHeight: async (height) => {
                const mdcRoot = this.mdcRoot;
                if (!mdcRoot) {
                    return;
                }
                // must set both for IE support as IE will not set a var
                this.styleMaxHeight = height;
                await this.updateComplete;
                this.styleMaxHeight = `var(--mdc-menu-max-height, ${height})`;
            } });
    }
    onKeydown(evt) {
        if (this.mdcFoundation) {
            this.mdcFoundation.handleKeydown(evt);
        }
    }
    onBodyClick(evt) {
        if (this.stayOpenOnBodyClick) {
            return;
        }
        const path = evt.composedPath();
        if (path.indexOf(this) === -1) {
            this.close();
        }
    }
    registerBodyClick() {
        this.onBodyClickBound = this.onBodyClick.bind(this);
        // capture otherwise listener closes menu after quick menu opens
        document.body.addEventListener('click', this.onBodyClickBound, { passive: true, capture: true });
    }
    deregisterBodyClick() {
        document.body.removeEventListener('click', this.onBodyClickBound, { capture: true });
    }
    onOpenChanged(isOpen, wasOpen) {
        if (this.mdcFoundation) {
            if (isOpen) {
                this.mdcFoundation.open();
                // wasOpen helps with first render (when it is `undefined`) perf
            }
            else if (wasOpen !== undefined) {
                this.mdcFoundation.close();
            }
        }
    }
    close() {
        this.open = false;
    }
    show() {
        this.open = true;
    }
}
__decorate([
    i$2('.mdc-menu-surface')
], MenuSurfaceBase.prototype, "mdcRoot", void 0);
__decorate([
    i$2('slot')
], MenuSurfaceBase.prototype, "slotElement", void 0);
__decorate([
    e$4({ type: Boolean }),
    observer$1(function (isAbsolute) {
        if (this.mdcFoundation && !this.fixed) {
            this.mdcFoundation.setIsHoisted(isAbsolute);
        }
    })
], MenuSurfaceBase.prototype, "absolute", void 0);
__decorate([
    e$4({ type: Boolean })
], MenuSurfaceBase.prototype, "fullwidth", void 0);
__decorate([
    e$4({ type: Boolean }),
    observer$1(function (isFixed) {
        if (this.mdcFoundation && !this.absolute) {
            this.mdcFoundation.setFixedPosition(isFixed);
        }
    })
], MenuSurfaceBase.prototype, "fixed", void 0);
__decorate([
    e$4({ type: Number }),
    observer$1(function (value) {
        if (this.mdcFoundation && this.y !== null && value !== null) {
            this.mdcFoundation.setAbsolutePosition(value, this.y);
            this.mdcFoundation.setAnchorMargin({ left: value, top: this.y, right: -value, bottom: this.y });
        }
    })
], MenuSurfaceBase.prototype, "x", void 0);
__decorate([
    e$4({ type: Number }),
    observer$1(function (value) {
        if (this.mdcFoundation && this.x !== null && value !== null) {
            this.mdcFoundation.setAbsolutePosition(this.x, value);
            this.mdcFoundation.setAnchorMargin({ left: this.x, top: value, right: -this.x, bottom: value });
        }
    })
], MenuSurfaceBase.prototype, "y", void 0);
__decorate([
    e$4({ type: Boolean }),
    observer$1(function (value) {
        if (this.mdcFoundation) {
            this.mdcFoundation.setQuickOpen(value);
        }
    })
], MenuSurfaceBase.prototype, "quick", void 0);
__decorate([
    e$4({ type: Boolean, reflect: true }),
    observer$1(function (isOpen, wasOpen) {
        this.onOpenChanged(isOpen, wasOpen);
    })
], MenuSurfaceBase.prototype, "open", void 0);
__decorate([
    e$4({ type: Boolean })
], MenuSurfaceBase.prototype, "stayOpenOnBodyClick", void 0);
__decorate([
    t$1(),
    observer$1(function (value) {
        if (this.mdcFoundation) {
            if (value) {
                this.mdcFoundation.setAnchorCorner(value);
            }
            else {
                this.mdcFoundation.setAnchorCorner(value);
            }
        }
    })
], MenuSurfaceBase.prototype, "bitwiseCorner", void 0);
__decorate([
    e$4({ type: String }),
    observer$1(function (value) {
        if (this.mdcFoundation) {
            const isValidValue = value === 'START' || value === 'END';
            const isFirstTimeSet = this.previousMenuCorner === null;
            const cornerChanged = !isFirstTimeSet && value !== this.previousMenuCorner;
            const initiallySetToEnd = isFirstTimeSet && value === 'END';
            if (isValidValue && (cornerChanged || initiallySetToEnd)) {
                this.bitwiseCorner = this.bitwiseCorner ^ CornerBit.RIGHT;
                this.mdcFoundation.flipCornerHorizontally();
                this.previousMenuCorner = value;
            }
        }
    })
], MenuSurfaceBase.prototype, "menuCorner", void 0);
__decorate([
    e$4({ type: String }),
    observer$1(function (value) {
        if (this.mdcFoundation) {
            if (value) {
                let newCorner = stringToCorner[value];
                if (this.menuCorner === 'END') {
                    newCorner = newCorner ^ CornerBit.RIGHT;
                }
                this.bitwiseCorner = newCorner;
            }
        }
    })
], MenuSurfaceBase.prototype, "corner", void 0);
__decorate([
    t$1()
], MenuSurfaceBase.prototype, "styleTop", void 0);
__decorate([
    t$1()
], MenuSurfaceBase.prototype, "styleLeft", void 0);
__decorate([
    t$1()
], MenuSurfaceBase.prototype, "styleRight", void 0);
__decorate([
    t$1()
], MenuSurfaceBase.prototype, "styleBottom", void 0);
__decorate([
    t$1()
], MenuSurfaceBase.prototype, "styleMaxHeight", void 0);
__decorate([
    t$1()
], MenuSurfaceBase.prototype, "styleTransformOrigin", void 0);

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
const styles$9 = i$5 `.mdc-menu-surface{display:none;position:absolute;box-sizing:border-box;max-width:calc(100vw - 32px);max-width:var(--mdc-menu-max-width, calc(100vw - 32px));max-height:calc(100vh - 32px);max-height:var(--mdc-menu-max-height, calc(100vh - 32px));margin:0;padding:0;transform:scale(1);transform-origin:top left;opacity:0;overflow:auto;will-change:transform,opacity;z-index:8;transition:opacity .03s linear,transform .12s cubic-bezier(0, 0, 0.2, 1),height 250ms cubic-bezier(0, 0, 0.2, 1);box-shadow:0px 5px 5px -3px rgba(0, 0, 0, 0.2),0px 8px 10px 1px rgba(0, 0, 0, 0.14),0px 3px 14px 2px rgba(0,0,0,.12);background-color:#fff;background-color:var(--mdc-theme-surface, #fff);color:#000;color:var(--mdc-theme-on-surface, #000);border-radius:4px;border-radius:var(--mdc-shape-medium, 4px);transform-origin-left:top left;transform-origin-right:top right}.mdc-menu-surface:focus{outline:none}.mdc-menu-surface--animating-open{display:inline-block;transform:scale(0.8);opacity:0}.mdc-menu-surface--open{display:inline-block;transform:scale(1);opacity:1}.mdc-menu-surface--animating-closed{display:inline-block;opacity:0;transition:opacity .075s linear}[dir=rtl] .mdc-menu-surface,.mdc-menu-surface[dir=rtl]{transform-origin-left:top right;transform-origin-right:top left}.mdc-menu-surface--anchor{position:relative;overflow:visible}.mdc-menu-surface--fixed{position:fixed}.mdc-menu-surface--fullwidth{width:100%}:host(:not([open])){display:none}.mdc-menu-surface{z-index:8;z-index:var(--mdc-menu-z-index, 8);min-width:112px;min-width:var(--mdc-menu-min-width, 112px)}`;

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
let MenuSurface = class MenuSurface extends MenuSurfaceBase {
};
MenuSurface.styles = [styles$9];
MenuSurface = __decorate([
    e$5('mwc-menu-surface')
], MenuSurface);

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var cssClasses$7 = {
    MENU_SELECTED_LIST_ITEM: 'mdc-menu-item--selected',
    MENU_SELECTION_GROUP: 'mdc-menu__selection-group',
    ROOT: 'mdc-menu',
};
var strings$5 = {
    ARIA_CHECKED_ATTR: 'aria-checked',
    ARIA_DISABLED_ATTR: 'aria-disabled',
    CHECKBOX_SELECTOR: 'input[type="checkbox"]',
    LIST_SELECTOR: '.mdc-list,.mdc-deprecated-list',
    SELECTED_EVENT: 'MDCMenu:selected',
    SKIP_RESTORE_FOCUS: 'data-menu-item-skip-restore-focus',
};
var numbers$4 = {
    FOCUS_ROOT_INDEX: -1,
};
var DefaultFocusState;
(function (DefaultFocusState) {
    DefaultFocusState[DefaultFocusState["NONE"] = 0] = "NONE";
    DefaultFocusState[DefaultFocusState["LIST_ROOT"] = 1] = "LIST_ROOT";
    DefaultFocusState[DefaultFocusState["FIRST_ITEM"] = 2] = "FIRST_ITEM";
    DefaultFocusState[DefaultFocusState["LAST_ITEM"] = 3] = "LAST_ITEM";
})(DefaultFocusState || (DefaultFocusState = {}));

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCMenuFoundation = /** @class */ (function (_super) {
    __extends(MDCMenuFoundation, _super);
    function MDCMenuFoundation(adapter) {
        var _this = _super.call(this, __assign(__assign({}, MDCMenuFoundation.defaultAdapter), adapter)) || this;
        _this.closeAnimationEndTimerId = 0;
        _this.defaultFocusState = DefaultFocusState.LIST_ROOT;
        _this.selectedIndex = -1;
        return _this;
    }
    Object.defineProperty(MDCMenuFoundation, "cssClasses", {
        get: function () {
            return cssClasses$7;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCMenuFoundation, "strings", {
        get: function () {
            return strings$5;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCMenuFoundation, "numbers", {
        get: function () {
            return numbers$4;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCMenuFoundation, "defaultAdapter", {
        /**
         * @see {@link MDCMenuAdapter} for typing information on parameters and return types.
         */
        get: function () {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                addClassToElementAtIndex: function () { return undefined; },
                removeClassFromElementAtIndex: function () { return undefined; },
                addAttributeToElementAtIndex: function () { return undefined; },
                removeAttributeFromElementAtIndex: function () { return undefined; },
                getAttributeFromElementAtIndex: function () { return null; },
                elementContainsClass: function () { return false; },
                closeSurface: function () { return undefined; },
                getElementIndex: function () { return -1; },
                notifySelected: function () { return undefined; },
                getMenuItemCount: function () { return 0; },
                focusItemAtIndex: function () { return undefined; },
                focusListRoot: function () { return undefined; },
                getSelectedSiblingOfItemAtIndex: function () { return -1; },
                isSelectableItemAtIndex: function () { return false; },
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: false,
        configurable: true
    });
    MDCMenuFoundation.prototype.destroy = function () {
        if (this.closeAnimationEndTimerId) {
            clearTimeout(this.closeAnimationEndTimerId);
        }
        this.adapter.closeSurface();
    };
    MDCMenuFoundation.prototype.handleKeydown = function (evt) {
        var key = evt.key, keyCode = evt.keyCode;
        var isTab = key === 'Tab' || keyCode === 9;
        if (isTab) {
            this.adapter.closeSurface(/** skipRestoreFocus */ true);
        }
    };
    MDCMenuFoundation.prototype.handleItemAction = function (listItem) {
        var _this = this;
        var index = this.adapter.getElementIndex(listItem);
        if (index < 0) {
            return;
        }
        this.adapter.notifySelected({ index: index });
        var skipRestoreFocus = this.adapter.getAttributeFromElementAtIndex(index, strings$5.SKIP_RESTORE_FOCUS) === 'true';
        this.adapter.closeSurface(skipRestoreFocus);
        // Wait for the menu to close before adding/removing classes that affect styles.
        this.closeAnimationEndTimerId = setTimeout(function () {
            // Recompute the index in case the menu contents have changed.
            var recomputedIndex = _this.adapter.getElementIndex(listItem);
            if (recomputedIndex >= 0 &&
                _this.adapter.isSelectableItemAtIndex(recomputedIndex)) {
                _this.setSelectedIndex(recomputedIndex);
            }
        }, MDCMenuSurfaceFoundation.numbers.TRANSITION_CLOSE_DURATION);
    };
    MDCMenuFoundation.prototype.handleMenuSurfaceOpened = function () {
        switch (this.defaultFocusState) {
            case DefaultFocusState.FIRST_ITEM:
                this.adapter.focusItemAtIndex(0);
                break;
            case DefaultFocusState.LAST_ITEM:
                this.adapter.focusItemAtIndex(this.adapter.getMenuItemCount() - 1);
                break;
            case DefaultFocusState.NONE:
                // Do nothing.
                break;
            default:
                this.adapter.focusListRoot();
                break;
        }
    };
    /**
     * Sets default focus state where the menu should focus every time when menu
     * is opened. Focuses the list root (`DefaultFocusState.LIST_ROOT`) element by
     * default.
     */
    MDCMenuFoundation.prototype.setDefaultFocusState = function (focusState) {
        this.defaultFocusState = focusState;
    };
    /** @return Index of the currently selected list item within the menu. */
    MDCMenuFoundation.prototype.getSelectedIndex = function () {
        return this.selectedIndex;
    };
    /**
     * Selects the list item at `index` within the menu.
     * @param index Index of list item within the menu.
     */
    MDCMenuFoundation.prototype.setSelectedIndex = function (index) {
        this.validatedIndex(index);
        if (!this.adapter.isSelectableItemAtIndex(index)) {
            throw new Error('MDCMenuFoundation: No selection group at specified index.');
        }
        var prevSelectedIndex = this.adapter.getSelectedSiblingOfItemAtIndex(index);
        if (prevSelectedIndex >= 0) {
            this.adapter.removeAttributeFromElementAtIndex(prevSelectedIndex, strings$5.ARIA_CHECKED_ATTR);
            this.adapter.removeClassFromElementAtIndex(prevSelectedIndex, cssClasses$7.MENU_SELECTED_LIST_ITEM);
        }
        this.adapter.addClassToElementAtIndex(index, cssClasses$7.MENU_SELECTED_LIST_ITEM);
        this.adapter.addAttributeToElementAtIndex(index, strings$5.ARIA_CHECKED_ATTR, 'true');
        this.selectedIndex = index;
    };
    /**
     * Sets the enabled state to isEnabled for the menu item at the given index.
     * @param index Index of the menu item
     * @param isEnabled The desired enabled state of the menu item.
     */
    MDCMenuFoundation.prototype.setEnabled = function (index, isEnabled) {
        this.validatedIndex(index);
        if (isEnabled) {
            this.adapter.removeClassFromElementAtIndex(index, cssClasses$9.LIST_ITEM_DISABLED_CLASS);
            this.adapter.addAttributeToElementAtIndex(index, strings$5.ARIA_DISABLED_ATTR, 'false');
        }
        else {
            this.adapter.addClassToElementAtIndex(index, cssClasses$9.LIST_ITEM_DISABLED_CLASS);
            this.adapter.addAttributeToElementAtIndex(index, strings$5.ARIA_DISABLED_ATTR, 'true');
        }
    };
    MDCMenuFoundation.prototype.validatedIndex = function (index) {
        var menuSize = this.adapter.getMenuItemCount();
        var isIndexInRange = index >= 0 && index < menuSize;
        if (!isIndexInRange) {
            throw new Error('MDCMenuFoundation: No list item at specified index.');
        }
    };
    return MDCMenuFoundation;
}(MDCFoundation$1));
// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
var MDCMenuFoundation$1 = MDCMenuFoundation;

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fires selected {SelectedDetail}
 * @fires action {ActionDetail}
 * @fires items-updated
 * @fires opened
 * @fires closed
 */
class MenuBase extends BaseElement$1 {
    constructor() {
        super(...arguments);
        this.mdcFoundationClass = MDCMenuFoundation$1;
        this.listElement_ = null;
        this.anchor = null;
        this.open = false;
        this.quick = false;
        this.wrapFocus = false;
        this.innerRole = 'menu';
        this.innerAriaLabel = null;
        this.corner = 'TOP_START';
        this.x = null;
        this.y = null;
        this.absolute = false;
        this.multi = false;
        this.activatable = false;
        this.fixed = false;
        this.forceGroupSelection = false;
        this.fullwidth = false;
        this.menuCorner = 'START';
        this.stayOpenOnBodyClick = false;
        this.defaultFocus = 'LIST_ROOT';
        this._listUpdateComplete = null;
    }
    get listElement() {
        if (!this.listElement_) {
            this.listElement_ = this.renderRoot.querySelector('mwc-list');
            return this.listElement_;
        }
        return this.listElement_;
    }
    get items() {
        const listElement = this.listElement;
        if (listElement) {
            return listElement.items;
        }
        return [];
    }
    get index() {
        const listElement = this.listElement;
        if (listElement) {
            return listElement.index;
        }
        return -1;
    }
    get selected() {
        const listElement = this.listElement;
        if (listElement) {
            return listElement.selected;
        }
        return null;
    }
    render() {
        return this.renderSurface();
    }
    renderSurface() {
        const classes = this.getSurfaceClasses();
        return x `
      <mwc-menu-surface
        ?hidden=${!this.open}
        .anchor=${this.anchor}
        .open=${this.open}
        .quick=${this.quick}
        .corner=${this.corner}
        .x=${this.x}
        .y=${this.y}
        .absolute=${this.absolute}
        .fixed=${this.fixed}
        .fullwidth=${this.fullwidth}
        .menuCorner=${this.menuCorner}
        ?stayOpenOnBodyClick=${this.stayOpenOnBodyClick}
        class=${o(classes)}
        @closed=${this.onClosed}
        @opened=${this.onOpened}
        @keydown=${this.onKeydown}>
      ${this.renderList()}
    </mwc-menu-surface>`;
    }
    getSurfaceClasses() {
        return {
            'mdc-menu': true,
            'mdc-menu-surface': true,
        };
    }
    renderList() {
        const itemRoles = this.innerRole === 'menu' ? 'menuitem' : 'option';
        const classes = this.renderListClasses();
        return x `
      <mwc-list
          rootTabbable
          .innerAriaLabel=${this.innerAriaLabel}
          .innerRole=${this.innerRole}
          .multi=${this.multi}
          class=${o(classes)}
          .itemRoles=${itemRoles}
          .wrapFocus=${this.wrapFocus}
          .activatable=${this.activatable}
          @action=${this.onAction}>
        <slot></slot>
      </mwc-list>`;
    }
    renderListClasses() {
        return {
            'mdc-deprecated-list': true,
        };
    }
    createAdapter() {
        return {
            addClassToElementAtIndex: (index, className) => {
                const listElement = this.listElement;
                if (!listElement) {
                    return;
                }
                const element = listElement.items[index];
                if (!element) {
                    return;
                }
                if (className === 'mdc-menu-item--selected') {
                    if (this.forceGroupSelection && !element.selected) {
                        listElement.toggle(index, true);
                    }
                }
                else {
                    element.classList.add(className);
                }
            },
            removeClassFromElementAtIndex: (index, className) => {
                const listElement = this.listElement;
                if (!listElement) {
                    return;
                }
                const element = listElement.items[index];
                if (!element) {
                    return;
                }
                if (className === 'mdc-menu-item--selected') {
                    if (element.selected) {
                        listElement.toggle(index, false);
                    }
                }
                else {
                    element.classList.remove(className);
                }
            },
            addAttributeToElementAtIndex: (index, attr, value) => {
                const listElement = this.listElement;
                if (!listElement) {
                    return;
                }
                const element = listElement.items[index];
                if (!element) {
                    return;
                }
                element.setAttribute(attr, value);
            },
            removeAttributeFromElementAtIndex: (index, attr) => {
                const listElement = this.listElement;
                if (!listElement) {
                    return;
                }
                const element = listElement.items[index];
                if (!element) {
                    return;
                }
                element.removeAttribute(attr);
            },
            getAttributeFromElementAtIndex: (index, attr) => {
                const listElement = this.listElement;
                if (!listElement) {
                    return null;
                }
                const element = listElement.items[index];
                if (!element) {
                    return null;
                }
                return element.getAttribute(attr);
            },
            elementContainsClass: (element, className) => element.classList.contains(className),
            closeSurface: () => {
                this.open = false;
            },
            getElementIndex: (element) => {
                const listElement = this.listElement;
                if (listElement) {
                    return listElement.items.indexOf(element);
                }
                return -1;
            },
            notifySelected: () => { },
            getMenuItemCount: () => {
                const listElement = this.listElement;
                if (!listElement) {
                    return 0;
                }
                return listElement.items.length;
            },
            focusItemAtIndex: (index) => {
                const listElement = this.listElement;
                if (!listElement) {
                    return;
                }
                const element = listElement.items[index];
                if (element) {
                    element.focus();
                }
            },
            focusListRoot: () => {
                if (this.listElement) {
                    this.listElement.focus();
                }
            },
            getSelectedSiblingOfItemAtIndex: (index) => {
                const listElement = this.listElement;
                if (!listElement) {
                    return -1;
                }
                const elementAtIndex = listElement.items[index];
                if (!elementAtIndex || !elementAtIndex.group) {
                    return -1;
                }
                for (let i = 0; i < listElement.items.length; i++) {
                    if (i === index) {
                        continue;
                    }
                    const current = listElement.items[i];
                    if (current.selected && current.group === elementAtIndex.group) {
                        return i;
                    }
                }
                return -1;
            },
            isSelectableItemAtIndex: (index) => {
                const listElement = this.listElement;
                if (!listElement) {
                    return false;
                }
                const elementAtIndex = listElement.items[index];
                if (!elementAtIndex) {
                    return false;
                }
                return elementAtIndex.hasAttribute('group');
            },
        };
    }
    onKeydown(evt) {
        if (this.mdcFoundation) {
            this.mdcFoundation.handleKeydown(evt);
        }
    }
    onAction(evt) {
        const listElement = this.listElement;
        if (this.mdcFoundation && listElement) {
            const index = evt.detail.index;
            const el = listElement.items[index];
            if (el) {
                this.mdcFoundation.handleItemAction(el);
            }
        }
    }
    onOpened() {
        this.open = true;
        if (this.mdcFoundation) {
            this.mdcFoundation.handleMenuSurfaceOpened();
        }
    }
    onClosed() {
        this.open = false;
    }
    // tslint:disable:ban-ts-ignore
    async getUpdateComplete() {
        await this._listUpdateComplete;
        // @ts-ignore
        const result = await super.getUpdateComplete();
        return result;
    }
    // tslint:enable:ban-ts-ignore
    async firstUpdated() {
        super.firstUpdated();
        const listElement = this.listElement;
        if (listElement) {
            this._listUpdateComplete = listElement.updateComplete;
            await this._listUpdateComplete;
        }
    }
    select(index) {
        const listElement = this.listElement;
        if (listElement) {
            listElement.select(index);
        }
    }
    close() {
        this.open = false;
    }
    show() {
        this.open = true;
    }
    getFocusedItemIndex() {
        const listElement = this.listElement;
        if (listElement) {
            return listElement.getFocusedItemIndex();
        }
        return -1;
    }
    focusItemAtIndex(index) {
        const listElement = this.listElement;
        if (listElement) {
            listElement.focusItemAtIndex(index);
        }
    }
    layout(updateItems = true) {
        const listElement = this.listElement;
        if (listElement) {
            listElement.layout(updateItems);
        }
    }
}
__decorate([
    i$2('.mdc-menu')
], MenuBase.prototype, "mdcRoot", void 0);
__decorate([
    i$2('slot')
], MenuBase.prototype, "slotElement", void 0);
__decorate([
    e$4({ type: Object })
], MenuBase.prototype, "anchor", void 0);
__decorate([
    e$4({ type: Boolean, reflect: true })
], MenuBase.prototype, "open", void 0);
__decorate([
    e$4({ type: Boolean })
], MenuBase.prototype, "quick", void 0);
__decorate([
    e$4({ type: Boolean })
], MenuBase.prototype, "wrapFocus", void 0);
__decorate([
    e$4({ type: String })
], MenuBase.prototype, "innerRole", void 0);
__decorate([
    e$4({ type: String })
], MenuBase.prototype, "innerAriaLabel", void 0);
__decorate([
    e$4({ type: String })
], MenuBase.prototype, "corner", void 0);
__decorate([
    e$4({ type: Number })
], MenuBase.prototype, "x", void 0);
__decorate([
    e$4({ type: Number })
], MenuBase.prototype, "y", void 0);
__decorate([
    e$4({ type: Boolean })
], MenuBase.prototype, "absolute", void 0);
__decorate([
    e$4({ type: Boolean })
], MenuBase.prototype, "multi", void 0);
__decorate([
    e$4({ type: Boolean })
], MenuBase.prototype, "activatable", void 0);
__decorate([
    e$4({ type: Boolean })
], MenuBase.prototype, "fixed", void 0);
__decorate([
    e$4({ type: Boolean })
], MenuBase.prototype, "forceGroupSelection", void 0);
__decorate([
    e$4({ type: Boolean })
], MenuBase.prototype, "fullwidth", void 0);
__decorate([
    e$4({ type: String })
], MenuBase.prototype, "menuCorner", void 0);
__decorate([
    e$4({ type: Boolean })
], MenuBase.prototype, "stayOpenOnBodyClick", void 0);
__decorate([
    e$4({ type: String }),
    observer$1(function (value) {
        if (this.mdcFoundation) {
            this.mdcFoundation.setDefaultFocusState(DefaultFocusState[value]);
        }
    })
], MenuBase.prototype, "defaultFocus", void 0);

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
const styles$8 = i$5 `mwc-list ::slotted([mwc-list-item]:not([twoline])),mwc-list ::slotted([noninteractive]:not([twoline])){height:var(--mdc-menu-item-height, 48px)}`;

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
let Menu = class Menu extends MenuBase {
};
Menu.styles = [styles$8];
Menu = __decorate([
    e$5('mwc-menu')
], Menu);

function newEditEvent(edit) {
    return new CustomEvent('oscd-edit', {
        composed: true,
        bubbles: true,
        detail: edit,
    });
}

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * True if the custom elements polyfill is in use.
 */
const isCEPolyfill$1 = typeof window !== 'undefined' &&
    window.customElements != null &&
    window.customElements.polyfillWrapFlushCallback !==
        undefined;
/**
 * Removes nodes, starting from `start` (inclusive) to `end` (exclusive), from
 * `container`.
 */
const removeNodes$1 = (container, start, end = null) => {
    while (start !== end) {
        const n = start.nextSibling;
        container.removeChild(start);
        start = n;
    }
};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * An expression marker with embedded unique key to avoid collision with
 * possible text in templates.
 */
const marker$1 = `{{lit-${String(Math.random()).slice(2)}}}`;
/**
 * An expression marker used text-positions, multi-binding attributes, and
 * attributes with markup-like text values.
 */
const nodeMarker$1 = `<!--${marker$1}-->`;
const markerRegex = new RegExp(`${marker$1}|${nodeMarker$1}`);
/**
 * Suffix appended to all bound attribute names.
 */
const boundAttributeSuffix$1 = '$lit$';
/**
 * An updatable Template that tracks the location of dynamic parts.
 */
class Template {
    constructor(result, element) {
        this.parts = [];
        this.element = element;
        const nodesToRemove = [];
        const stack = [];
        // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
        const walker = document.createTreeWalker(element.content, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
        // Keeps track of the last index associated with a part. We try to delete
        // unnecessary nodes, but we never want to associate two different parts
        // to the same index. They must have a constant node between.
        let lastPartIndex = 0;
        let index = -1;
        let partIndex = 0;
        const { strings, values: { length } } = result;
        while (partIndex < length) {
            const node = walker.nextNode();
            if (node === null) {
                // We've exhausted the content inside a nested template element.
                // Because we still have parts (the outer for-loop), we know:
                // - There is a template in the stack
                // - The walker will find a nextNode outside the template
                walker.currentNode = stack.pop();
                continue;
            }
            index++;
            if (node.nodeType === 1 /* Node.ELEMENT_NODE */) {
                if (node.hasAttributes()) {
                    const attributes = node.attributes;
                    const { length } = attributes;
                    // Per
                    // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
                    // attributes are not guaranteed to be returned in document order.
                    // In particular, Edge/IE can return them out of order, so we cannot
                    // assume a correspondence between part index and attribute index.
                    let count = 0;
                    for (let i = 0; i < length; i++) {
                        if (endsWith(attributes[i].name, boundAttributeSuffix$1)) {
                            count++;
                        }
                    }
                    while (count-- > 0) {
                        // Get the template literal section leading up to the first
                        // expression in this attribute
                        const stringForPart = strings[partIndex];
                        // Find the attribute name
                        const name = lastAttributeNameRegex$1.exec(stringForPart)[2];
                        // Find the corresponding attribute
                        // All bound attributes have had a suffix added in
                        // TemplateResult#getHTML to opt out of special attribute
                        // handling. To look up the attribute value we also need to add
                        // the suffix.
                        const attributeLookupName = name.toLowerCase() + boundAttributeSuffix$1;
                        const attributeValue = node.getAttribute(attributeLookupName);
                        node.removeAttribute(attributeLookupName);
                        const statics = attributeValue.split(markerRegex);
                        this.parts.push({ type: 'attribute', index, name, strings: statics });
                        partIndex += statics.length - 1;
                    }
                }
                if (node.tagName === 'TEMPLATE') {
                    stack.push(node);
                    walker.currentNode = node.content;
                }
            }
            else if (node.nodeType === 3 /* Node.TEXT_NODE */) {
                const data = node.data;
                if (data.indexOf(marker$1) >= 0) {
                    const parent = node.parentNode;
                    const strings = data.split(markerRegex);
                    const lastIndex = strings.length - 1;
                    // Generate a new text node for each literal section
                    // These nodes are also used as the markers for node parts
                    for (let i = 0; i < lastIndex; i++) {
                        let insert;
                        let s = strings[i];
                        if (s === '') {
                            insert = createMarker$1();
                        }
                        else {
                            const match = lastAttributeNameRegex$1.exec(s);
                            if (match !== null && endsWith(match[2], boundAttributeSuffix$1)) {
                                s = s.slice(0, match.index) + match[1] +
                                    match[2].slice(0, -boundAttributeSuffix$1.length) + match[3];
                            }
                            insert = document.createTextNode(s);
                        }
                        parent.insertBefore(insert, node);
                        this.parts.push({ type: 'node', index: ++index });
                    }
                    // If there's no text, we must insert a comment to mark our place.
                    // Else, we can trust it will stick around after cloning.
                    if (strings[lastIndex] === '') {
                        parent.insertBefore(createMarker$1(), node);
                        nodesToRemove.push(node);
                    }
                    else {
                        node.data = strings[lastIndex];
                    }
                    // We have a part for each match found
                    partIndex += lastIndex;
                }
            }
            else if (node.nodeType === 8 /* Node.COMMENT_NODE */) {
                if (node.data === marker$1) {
                    const parent = node.parentNode;
                    // Add a new marker node to be the startNode of the Part if any of
                    // the following are true:
                    //  * We don't have a previousSibling
                    //  * The previousSibling is already the start of a previous part
                    if (node.previousSibling === null || index === lastPartIndex) {
                        index++;
                        parent.insertBefore(createMarker$1(), node);
                    }
                    lastPartIndex = index;
                    this.parts.push({ type: 'node', index });
                    // If we don't have a nextSibling, keep this node so we have an end.
                    // Else, we can remove it to save future costs.
                    if (node.nextSibling === null) {
                        node.data = '';
                    }
                    else {
                        nodesToRemove.push(node);
                        index--;
                    }
                    partIndex++;
                }
                else {
                    let i = -1;
                    while ((i = node.data.indexOf(marker$1, i + 1)) !== -1) {
                        // Comment node has a binding marker inside, make an inactive part
                        // The binding won't work, but subsequent bindings will
                        // TODO (justinfagnani): consider whether it's even worth it to
                        // make bindings in comments work
                        this.parts.push({ type: 'node', index: -1 });
                        partIndex++;
                    }
                }
            }
        }
        // Remove text binding nodes after the walk to not disturb the TreeWalker
        for (const n of nodesToRemove) {
            n.parentNode.removeChild(n);
        }
    }
}
const endsWith = (str, suffix) => {
    const index = str.length - suffix.length;
    return index >= 0 && str.slice(index) === suffix;
};
const isTemplatePartActive$1 = (part) => part.index !== -1;
// Allows `document.createComment('')` to be renamed for a
// small manual size-savings.
const createMarker$1 = () => document.createComment('');
/**
 * This regex extracts the attribute name preceding an attribute-position
 * expression. It does this by matching the syntax allowed for attributes
 * against the string literal directly preceding the expression, assuming that
 * the expression is in an attribute-value position.
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#elements-attributes
 *
 * " \x09\x0a\x0c\x0d" are HTML space characters:
 * https://www.w3.org/TR/html5/infrastructure.html#space-characters
 *
 * "\0-\x1F\x7F-\x9F" are Unicode control characters, which includes every
 * space character except " ".
 *
 * So an attribute is:
 *  * The name: any character except a control character, space character, ('),
 *    ("), ">", "=", or "/"
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */
const lastAttributeNameRegex$1 = 
// eslint-disable-next-line no-control-regex
/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const walkerNodeFilter = 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */;
/**
 * Removes the list of nodes from a Template safely. In addition to removing
 * nodes from the Template, the Template part indices are updated to match
 * the mutated Template DOM.
 *
 * As the template is walked the removal state is tracked and
 * part indices are adjusted as needed.
 *
 * div
 *   div#1 (remove) <-- start removing (removing node is div#1)
 *     div
 *       div#2 (remove)  <-- continue removing (removing node is still div#1)
 *         div
 * div <-- stop removing since previous sibling is the removing node (div#1,
 * removed 4 nodes)
 */
function removeNodesFromTemplate(template, nodesToRemove) {
    const { element: { content }, parts } = template;
    const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
    let partIndex = nextActiveIndexInTemplateParts(parts);
    let part = parts[partIndex];
    let nodeIndex = -1;
    let removeCount = 0;
    const nodesToRemoveInTemplate = [];
    let currentRemovingNode = null;
    while (walker.nextNode()) {
        nodeIndex++;
        const node = walker.currentNode;
        // End removal if stepped past the removing node
        if (node.previousSibling === currentRemovingNode) {
            currentRemovingNode = null;
        }
        // A node to remove was found in the template
        if (nodesToRemove.has(node)) {
            nodesToRemoveInTemplate.push(node);
            // Track node we're removing
            if (currentRemovingNode === null) {
                currentRemovingNode = node;
            }
        }
        // When removing, increment count by which to adjust subsequent part indices
        if (currentRemovingNode !== null) {
            removeCount++;
        }
        while (part !== undefined && part.index === nodeIndex) {
            // If part is in a removed node deactivate it by setting index to -1 or
            // adjust the index as needed.
            part.index = currentRemovingNode !== null ? -1 : part.index - removeCount;
            // go to the next active part.
            partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
            part = parts[partIndex];
        }
    }
    nodesToRemoveInTemplate.forEach((n) => n.parentNode.removeChild(n));
}
const countNodes = (node) => {
    let count = (node.nodeType === 11 /* Node.DOCUMENT_FRAGMENT_NODE */) ? 0 : 1;
    const walker = document.createTreeWalker(node, walkerNodeFilter, null, false);
    while (walker.nextNode()) {
        count++;
    }
    return count;
};
const nextActiveIndexInTemplateParts = (parts, startIndex = -1) => {
    for (let i = startIndex + 1; i < parts.length; i++) {
        const part = parts[i];
        if (isTemplatePartActive$1(part)) {
            return i;
        }
    }
    return -1;
};
/**
 * Inserts the given node into the Template, optionally before the given
 * refNode. In addition to inserting the node into the Template, the Template
 * part indices are updated to match the mutated Template DOM.
 */
function insertNodeIntoTemplate(template, node, refNode = null) {
    const { element: { content }, parts } = template;
    // If there's no refNode, then put node at end of template.
    // No part indices need to be shifted in this case.
    if (refNode === null || refNode === undefined) {
        content.appendChild(node);
        return;
    }
    const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
    let partIndex = nextActiveIndexInTemplateParts(parts);
    let insertCount = 0;
    let walkerIndex = -1;
    while (walker.nextNode()) {
        walkerIndex++;
        const walkerNode = walker.currentNode;
        if (walkerNode === refNode) {
            insertCount = countNodes(node);
            refNode.parentNode.insertBefore(node, refNode);
        }
        while (partIndex !== -1 && parts[partIndex].index === walkerIndex) {
            // If we've inserted the node, simply adjust all subsequent parts
            if (insertCount > 0) {
                while (partIndex !== -1) {
                    parts[partIndex].index += insertCount;
                    partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
                }
                return;
            }
            partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
        }
    }
}

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const directives$1 = new WeakMap();
/**
 * Brands a function as a directive factory function so that lit-html will call
 * the function during template rendering, rather than passing as a value.
 *
 * A _directive_ is a function that takes a Part as an argument. It has the
 * signature: `(part: Part) => void`.
 *
 * A directive _factory_ is a function that takes arguments for data and
 * configuration and returns a directive. Users of directive usually refer to
 * the directive factory as the directive. For example, "The repeat directive".
 *
 * Usually a template author will invoke a directive factory in their template
 * with relevant arguments, which will then return a directive function.
 *
 * Here's an example of using the `repeat()` directive factory that takes an
 * array and a function to render an item:
 *
 * ```js
 * html`<ul><${repeat(items, (item) => html`<li>${item}</li>`)}</ul>`
 * ```
 *
 * When `repeat` is invoked, it returns a directive function that closes over
 * `items` and the template function. When the outer template is rendered, the
 * return directive function is called with the Part for the expression.
 * `repeat` then performs it's custom logic to render multiple items.
 *
 * @param f The directive factory function. Must be a function that returns a
 * function of the signature `(part: Part) => void`. The returned function will
 * be called with the part object.
 *
 * @example
 *
 * import {directive, html} from 'lit-html';
 *
 * const immutable = directive((v) => (part) => {
 *   if (part.value !== v) {
 *     part.setValue(v)
 *   }
 * });
 */
const directive$2 = (f) => ((...args) => {
    const d = f(...args);
    directives$1.set(d, true);
    return d;
});
const isDirective$1 = (o) => {
    return typeof o === 'function' && directives$1.has(o);
};

/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
const noChange$1 = {};
/**
 * A sentinel value that signals a NodePart to fully clear its content.
 */
const nothing$1 = {};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * An instance of a `Template` that can be attached to the DOM and updated
 * with new values.
 */
class TemplateInstance$1 {
    constructor(template, processor, options) {
        this.__parts = [];
        this.template = template;
        this.processor = processor;
        this.options = options;
    }
    update(values) {
        let i = 0;
        for (const part of this.__parts) {
            if (part !== undefined) {
                part.setValue(values[i]);
            }
            i++;
        }
        for (const part of this.__parts) {
            if (part !== undefined) {
                part.commit();
            }
        }
    }
    _clone() {
        // There are a number of steps in the lifecycle of a template instance's
        // DOM fragment:
        //  1. Clone - create the instance fragment
        //  2. Adopt - adopt into the main document
        //  3. Process - find part markers and create parts
        //  4. Upgrade - upgrade custom elements
        //  5. Update - set node, attribute, property, etc., values
        //  6. Connect - connect to the document. Optional and outside of this
        //     method.
        //
        // We have a few constraints on the ordering of these steps:
        //  * We need to upgrade before updating, so that property values will pass
        //    through any property setters.
        //  * We would like to process before upgrading so that we're sure that the
        //    cloned fragment is inert and not disturbed by self-modifying DOM.
        //  * We want custom elements to upgrade even in disconnected fragments.
        //
        // Given these constraints, with full custom elements support we would
        // prefer the order: Clone, Process, Adopt, Upgrade, Update, Connect
        //
        // But Safari does not implement CustomElementRegistry#upgrade, so we
        // can not implement that order and still have upgrade-before-update and
        // upgrade disconnected fragments. So we instead sacrifice the
        // process-before-upgrade constraint, since in Custom Elements v1 elements
        // must not modify their light DOM in the constructor. We still have issues
        // when co-existing with CEv0 elements like Polymer 1, and with polyfills
        // that don't strictly adhere to the no-modification rule because shadow
        // DOM, which may be created in the constructor, is emulated by being placed
        // in the light DOM.
        //
        // The resulting order is on native is: Clone, Adopt, Upgrade, Process,
        // Update, Connect. document.importNode() performs Clone, Adopt, and Upgrade
        // in one step.
        //
        // The Custom Elements v1 polyfill supports upgrade(), so the order when
        // polyfilled is the more ideal: Clone, Process, Adopt, Upgrade, Update,
        // Connect.
        const fragment = isCEPolyfill$1 ?
            this.template.element.content.cloneNode(true) :
            document.importNode(this.template.element.content, true);
        const stack = [];
        const parts = this.template.parts;
        // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
        const walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
        let partIndex = 0;
        let nodeIndex = 0;
        let part;
        let node = walker.nextNode();
        // Loop through all the nodes and parts of a template
        while (partIndex < parts.length) {
            part = parts[partIndex];
            if (!isTemplatePartActive$1(part)) {
                this.__parts.push(undefined);
                partIndex++;
                continue;
            }
            // Progress the tree walker until we find our next part's node.
            // Note that multiple parts may share the same node (attribute parts
            // on a single element), so this loop may not run at all.
            while (nodeIndex < part.index) {
                nodeIndex++;
                if (node.nodeName === 'TEMPLATE') {
                    stack.push(node);
                    walker.currentNode = node.content;
                }
                if ((node = walker.nextNode()) === null) {
                    // We've exhausted the content inside a nested template element.
                    // Because we still have parts (the outer for-loop), we know:
                    // - There is a template in the stack
                    // - The walker will find a nextNode outside the template
                    walker.currentNode = stack.pop();
                    node = walker.nextNode();
                }
            }
            // We've arrived at our part's node.
            if (part.type === 'node') {
                const part = this.processor.handleTextExpression(this.options);
                part.insertAfterNode(node.previousSibling);
                this.__parts.push(part);
            }
            else {
                this.__parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
            }
            partIndex++;
        }
        if (isCEPolyfill$1) {
            document.adoptNode(fragment);
            customElements.upgrade(fragment);
        }
        return fragment;
    }
}

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * Our TrustedTypePolicy for HTML which is declared using the html template
 * tag function.
 *
 * That HTML is a developer-authored constant, and is parsed with innerHTML
 * before any untrusted expressions have been mixed in. Therefor it is
 * considered safe by construction.
 */
const policy$1 = window.trustedTypes &&
    trustedTypes.createPolicy('lit-html', { createHTML: (s) => s });
const commentMarker$1 = ` ${marker$1} `;
/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */
class TemplateResult$1 {
    constructor(strings, values, type, processor) {
        this.strings = strings;
        this.values = values;
        this.type = type;
        this.processor = processor;
    }
    /**
     * Returns a string of HTML used to create a `<template>` element.
     */
    getHTML() {
        const l = this.strings.length - 1;
        let html = '';
        let isCommentBinding = false;
        for (let i = 0; i < l; i++) {
            const s = this.strings[i];
            // For each binding we want to determine the kind of marker to insert
            // into the template source before it's parsed by the browser's HTML
            // parser. The marker type is based on whether the expression is in an
            // attribute, text, or comment position.
            //   * For node-position bindings we insert a comment with the marker
            //     sentinel as its text content, like <!--{{lit-guid}}-->.
            //   * For attribute bindings we insert just the marker sentinel for the
            //     first binding, so that we support unquoted attribute bindings.
            //     Subsequent bindings can use a comment marker because multi-binding
            //     attributes must be quoted.
            //   * For comment bindings we insert just the marker sentinel so we don't
            //     close the comment.
            //
            // The following code scans the template source, but is *not* an HTML
            // parser. We don't need to track the tree structure of the HTML, only
            // whether a binding is inside a comment, and if not, if it appears to be
            // the first binding in an attribute.
            const commentOpen = s.lastIndexOf('<!--');
            // We're in comment position if we have a comment open with no following
            // comment close. Because <-- can appear in an attribute value there can
            // be false positives.
            isCommentBinding = (commentOpen > -1 || isCommentBinding) &&
                s.indexOf('-->', commentOpen + 1) === -1;
            // Check to see if we have an attribute-like sequence preceding the
            // expression. This can match "name=value" like structures in text,
            // comments, and attribute values, so there can be false-positives.
            const attributeMatch = lastAttributeNameRegex$1.exec(s);
            if (attributeMatch === null) {
                // We're only in this branch if we don't have a attribute-like
                // preceding sequence. For comments, this guards against unusual
                // attribute values like <div foo="<!--${'bar'}">. Cases like
                // <!-- foo=${'bar'}--> are handled correctly in the attribute branch
                // below.
                html += s + (isCommentBinding ? commentMarker$1 : nodeMarker$1);
            }
            else {
                // For attributes we use just a marker sentinel, and also append a
                // $lit$ suffix to the name to opt-out of attribute-specific parsing
                // that IE and Edge do for style and certain SVG attributes.
                html += s.substr(0, attributeMatch.index) + attributeMatch[1] +
                    attributeMatch[2] + boundAttributeSuffix$1 + attributeMatch[3] +
                    marker$1;
            }
        }
        html += this.strings[l];
        return html;
    }
    getTemplateElement() {
        const template = document.createElement('template');
        let value = this.getHTML();
        if (policy$1 !== undefined) {
            // this is secure because `this.strings` is a TemplateStringsArray.
            // TODO: validate this when
            // https://github.com/tc39/proposal-array-is-template-object is
            // implemented.
            value = policy$1.createHTML(value);
        }
        template.innerHTML = value;
        return template;
    }
}

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const isPrimitive$1 = (value) => {
    return (value === null ||
        !(typeof value === 'object' || typeof value === 'function'));
};
const isIterable$1 = (value) => {
    return Array.isArray(value) ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        !!(value && value[Symbol.iterator]);
};
/**
 * Writes attribute values to the DOM for a group of AttributeParts bound to a
 * single attribute. The value is only set once even if there are multiple parts
 * for an attribute.
 */
class AttributeCommitter {
    constructor(element, name, strings) {
        this.dirty = true;
        this.element = element;
        this.name = name;
        this.strings = strings;
        this.parts = [];
        for (let i = 0; i < strings.length - 1; i++) {
            this.parts[i] = this._createPart();
        }
    }
    /**
     * Creates a single part. Override this to create a differnt type of part.
     */
    _createPart() {
        return new AttributePart$2(this);
    }
    _getValue() {
        const strings = this.strings;
        const l = strings.length - 1;
        const parts = this.parts;
        // If we're assigning an attribute via syntax like:
        //    attr="${foo}"  or  attr=${foo}
        // but not
        //    attr="${foo} ${bar}" or attr="${foo} baz"
        // then we don't want to coerce the attribute value into one long
        // string. Instead we want to just return the value itself directly,
        // so that sanitizeDOMValue can get the actual value rather than
        // String(value)
        // The exception is if v is an array, in which case we do want to smash
        // it together into a string without calling String() on the array.
        //
        // This also allows trusted values (when using TrustedTypes) being
        // assigned to DOM sinks without being stringified in the process.
        if (l === 1 && strings[0] === '' && strings[1] === '') {
            const v = parts[0].value;
            if (typeof v === 'symbol') {
                return String(v);
            }
            if (typeof v === 'string' || !isIterable$1(v)) {
                return v;
            }
        }
        let text = '';
        for (let i = 0; i < l; i++) {
            text += strings[i];
            const part = parts[i];
            if (part !== undefined) {
                const v = part.value;
                if (isPrimitive$1(v) || !isIterable$1(v)) {
                    text += typeof v === 'string' ? v : String(v);
                }
                else {
                    for (const t of v) {
                        text += typeof t === 'string' ? t : String(t);
                    }
                }
            }
        }
        text += strings[l];
        return text;
    }
    commit() {
        if (this.dirty) {
            this.dirty = false;
            this.element.setAttribute(this.name, this._getValue());
        }
    }
}
/**
 * A Part that controls all or part of an attribute value.
 */
class AttributePart$2 {
    constructor(committer) {
        this.value = undefined;
        this.committer = committer;
    }
    setValue(value) {
        if (value !== noChange$1 && (!isPrimitive$1(value) || value !== this.value)) {
            this.value = value;
            // If the value is a not a directive, dirty the committer so that it'll
            // call setAttribute. If the value is a directive, it'll dirty the
            // committer if it calls setValue().
            if (!isDirective$1(value)) {
                this.committer.dirty = true;
            }
        }
    }
    commit() {
        while (isDirective$1(this.value)) {
            const directive = this.value;
            this.value = noChange$1;
            directive(this);
        }
        if (this.value === noChange$1) {
            return;
        }
        this.committer.commit();
    }
}
/**
 * A Part that controls a location within a Node tree. Like a Range, NodePart
 * has start and end locations and can set and update the Nodes between those
 * locations.
 *
 * NodeParts support several value types: primitives, Nodes, TemplateResults,
 * as well as arrays and iterables of those types.
 */
class NodePart$1 {
    constructor(options) {
        this.value = undefined;
        this.__pendingValue = undefined;
        this.options = options;
    }
    /**
     * Appends this part into a container.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    appendInto(container) {
        this.startNode = container.appendChild(createMarker$1());
        this.endNode = container.appendChild(createMarker$1());
    }
    /**
     * Inserts this part after the `ref` node (between `ref` and `ref`'s next
     * sibling). Both `ref` and its next sibling must be static, unchanging nodes
     * such as those that appear in a literal section of a template.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    insertAfterNode(ref) {
        this.startNode = ref;
        this.endNode = ref.nextSibling;
    }
    /**
     * Appends this part into a parent part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    appendIntoPart(part) {
        part.__insert(this.startNode = createMarker$1());
        part.__insert(this.endNode = createMarker$1());
    }
    /**
     * Inserts this part after the `ref` part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    insertAfterPart(ref) {
        ref.__insert(this.startNode = createMarker$1());
        this.endNode = ref.endNode;
        ref.endNode = this.startNode;
    }
    setValue(value) {
        this.__pendingValue = value;
    }
    commit() {
        if (this.startNode.parentNode === null) {
            return;
        }
        while (isDirective$1(this.__pendingValue)) {
            const directive = this.__pendingValue;
            this.__pendingValue = noChange$1;
            directive(this);
        }
        const value = this.__pendingValue;
        if (value === noChange$1) {
            return;
        }
        if (isPrimitive$1(value)) {
            if (value !== this.value) {
                this.__commitText(value);
            }
        }
        else if (value instanceof TemplateResult$1) {
            this.__commitTemplateResult(value);
        }
        else if (value instanceof Node) {
            this.__commitNode(value);
        }
        else if (isIterable$1(value)) {
            this.__commitIterable(value);
        }
        else if (value === nothing$1) {
            this.value = nothing$1;
            this.clear();
        }
        else {
            // Fallback, will render the string representation
            this.__commitText(value);
        }
    }
    __insert(node) {
        this.endNode.parentNode.insertBefore(node, this.endNode);
    }
    __commitNode(value) {
        if (this.value === value) {
            return;
        }
        this.clear();
        this.__insert(value);
        this.value = value;
    }
    __commitText(value) {
        const node = this.startNode.nextSibling;
        value = value == null ? '' : value;
        // If `value` isn't already a string, we explicitly convert it here in case
        // it can't be implicitly converted - i.e. it's a symbol.
        const valueAsString = typeof value === 'string' ? value : String(value);
        if (node === this.endNode.previousSibling &&
            node.nodeType === 3 /* Node.TEXT_NODE */) {
            // If we only have a single text node between the markers, we can just
            // set its value, rather than replacing it.
            // TODO(justinfagnani): Can we just check if this.value is primitive?
            node.data = valueAsString;
        }
        else {
            this.__commitNode(document.createTextNode(valueAsString));
        }
        this.value = value;
    }
    __commitTemplateResult(value) {
        const template = this.options.templateFactory(value);
        if (this.value instanceof TemplateInstance$1 &&
            this.value.template === template) {
            this.value.update(value.values);
        }
        else {
            // Make sure we propagate the template processor from the TemplateResult
            // so that we use its syntax extension, etc. The template factory comes
            // from the render function options so that it can control template
            // caching and preprocessing.
            const instance = new TemplateInstance$1(template, value.processor, this.options);
            const fragment = instance._clone();
            instance.update(value.values);
            this.__commitNode(fragment);
            this.value = instance;
        }
    }
    __commitIterable(value) {
        // For an Iterable, we create a new InstancePart per item, then set its
        // value to the item. This is a little bit of overhead for every item in
        // an Iterable, but it lets us recurse easily and efficiently update Arrays
        // of TemplateResults that will be commonly returned from expressions like:
        // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
        // If _value is an array, then the previous render was of an
        // iterable and _value will contain the NodeParts from the previous
        // render. If _value is not an array, clear this part and make a new
        // array for NodeParts.
        if (!Array.isArray(this.value)) {
            this.value = [];
            this.clear();
        }
        // Lets us keep track of how many items we stamped so we can clear leftover
        // items from a previous render
        const itemParts = this.value;
        let partIndex = 0;
        let itemPart;
        for (const item of value) {
            // Try to reuse an existing part
            itemPart = itemParts[partIndex];
            // If no existing part, create a new one
            if (itemPart === undefined) {
                itemPart = new NodePart$1(this.options);
                itemParts.push(itemPart);
                if (partIndex === 0) {
                    itemPart.appendIntoPart(this);
                }
                else {
                    itemPart.insertAfterPart(itemParts[partIndex - 1]);
                }
            }
            itemPart.setValue(item);
            itemPart.commit();
            partIndex++;
        }
        if (partIndex < itemParts.length) {
            // Truncate the parts array so _value reflects the current state
            itemParts.length = partIndex;
            this.clear(itemPart && itemPart.endNode);
        }
    }
    clear(startNode = this.startNode) {
        removeNodes$1(this.startNode.parentNode, startNode.nextSibling, this.endNode);
    }
}
/**
 * Implements a boolean attribute, roughly as defined in the HTML
 * specification.
 *
 * If the value is truthy, then the attribute is present with a value of
 * ''. If the value is falsey, the attribute is removed.
 */
class BooleanAttributePart$1 {
    constructor(element, name, strings) {
        this.value = undefined;
        this.__pendingValue = undefined;
        if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
            throw new Error('Boolean attributes can only contain a single expression');
        }
        this.element = element;
        this.name = name;
        this.strings = strings;
    }
    setValue(value) {
        this.__pendingValue = value;
    }
    commit() {
        while (isDirective$1(this.__pendingValue)) {
            const directive = this.__pendingValue;
            this.__pendingValue = noChange$1;
            directive(this);
        }
        if (this.__pendingValue === noChange$1) {
            return;
        }
        const value = !!this.__pendingValue;
        if (this.value !== value) {
            if (value) {
                this.element.setAttribute(this.name, '');
            }
            else {
                this.element.removeAttribute(this.name);
            }
            this.value = value;
        }
        this.__pendingValue = noChange$1;
    }
}
/**
 * Sets attribute values for PropertyParts, so that the value is only set once
 * even if there are multiple parts for a property.
 *
 * If an expression controls the whole property value, then the value is simply
 * assigned to the property under control. If there are string literals or
 * multiple expressions, then the strings are expressions are interpolated into
 * a string first.
 */
class PropertyCommitter extends AttributeCommitter {
    constructor(element, name, strings) {
        super(element, name, strings);
        this.single =
            (strings.length === 2 && strings[0] === '' && strings[1] === '');
    }
    _createPart() {
        return new PropertyPart(this);
    }
    _getValue() {
        if (this.single) {
            return this.parts[0].value;
        }
        return super._getValue();
    }
    commit() {
        if (this.dirty) {
            this.dirty = false;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.element[this.name] = this._getValue();
        }
    }
}
class PropertyPart extends AttributePart$2 {
}
// Detect event listener options support. If the `capture` property is read
// from the options object, then options are supported. If not, then the third
// argument to add/removeEventListener is interpreted as the boolean capture
// value so we should only pass the `capture` property.
let eventOptionsSupported$1 = false;
// Wrap into an IIFE because MS Edge <= v41 does not support having try/catch
// blocks right into the body of a module
(() => {
    try {
        const options = {
            get capture() {
                eventOptionsSupported$1 = true;
                return false;
            }
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.addEventListener('test', options, options);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.removeEventListener('test', options, options);
    }
    catch (_e) {
        // event options not supported
    }
})();
class EventPart$1 {
    constructor(element, eventName, eventContext) {
        this.value = undefined;
        this.__pendingValue = undefined;
        this.element = element;
        this.eventName = eventName;
        this.eventContext = eventContext;
        this.__boundHandleEvent = (e) => this.handleEvent(e);
    }
    setValue(value) {
        this.__pendingValue = value;
    }
    commit() {
        while (isDirective$1(this.__pendingValue)) {
            const directive = this.__pendingValue;
            this.__pendingValue = noChange$1;
            directive(this);
        }
        if (this.__pendingValue === noChange$1) {
            return;
        }
        const newListener = this.__pendingValue;
        const oldListener = this.value;
        const shouldRemoveListener = newListener == null ||
            oldListener != null &&
                (newListener.capture !== oldListener.capture ||
                    newListener.once !== oldListener.once ||
                    newListener.passive !== oldListener.passive);
        const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);
        if (shouldRemoveListener) {
            this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options);
        }
        if (shouldAddListener) {
            this.__options = getOptions(newListener);
            this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options);
        }
        this.value = newListener;
        this.__pendingValue = noChange$1;
    }
    handleEvent(event) {
        if (typeof this.value === 'function') {
            this.value.call(this.eventContext || this.element, event);
        }
        else {
            this.value.handleEvent(event);
        }
    }
}
// We copy options because of the inconsistent behavior of browsers when reading
// the third argument of add/removeEventListener. IE11 doesn't support options
// at all. Chrome 41 only reads `capture` if the argument is an object.
const getOptions = (o) => o &&
    (eventOptionsSupported$1 ?
        { capture: o.capture, passive: o.passive, once: o.once } :
        o.capture);

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * The default TemplateFactory which caches Templates keyed on
 * result.type and result.strings.
 */
function templateFactory(result) {
    let templateCache = templateCaches.get(result.type);
    if (templateCache === undefined) {
        templateCache = {
            stringsArray: new WeakMap(),
            keyString: new Map()
        };
        templateCaches.set(result.type, templateCache);
    }
    let template = templateCache.stringsArray.get(result.strings);
    if (template !== undefined) {
        return template;
    }
    // If the TemplateStringsArray is new, generate a key from the strings
    // This key is shared between all templates with identical content
    const key = result.strings.join(marker$1);
    // Check if we already have a Template for this key
    template = templateCache.keyString.get(key);
    if (template === undefined) {
        // If we have not seen this key before, create a new Template
        template = new Template(result, result.getTemplateElement());
        // Cache the Template for this key
        templateCache.keyString.set(key, template);
    }
    // Cache all future queries for this TemplateStringsArray
    templateCache.stringsArray.set(result.strings, template);
    return template;
}
const templateCaches = new Map();

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const parts = new WeakMap();
/**
 * Renders a template result or other value to a container.
 *
 * To update a container with new values, reevaluate the template literal and
 * call `render` with the new result.
 *
 * @param result Any value renderable by NodePart - typically a TemplateResult
 *     created by evaluating a template tag like `html` or `svg`.
 * @param container A DOM parent to render to. The entire contents are either
 *     replaced, or efficiently updated if the same result type was previous
 *     rendered there.
 * @param options RenderOptions for the entire render tree rendered to this
 *     container. Render options must *not* change between renders to the same
 *     container, as those changes will not effect previously rendered DOM.
 */
const render$1 = (result, container, options) => {
    let part = parts.get(container);
    if (part === undefined) {
        removeNodes$1(container, container.firstChild);
        parts.set(container, part = new NodePart$1(Object.assign({ templateFactory }, options)));
        part.appendInto(container);
    }
    part.setValue(result);
    part.commit();
};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * Creates Parts when a template is instantiated.
 */
class DefaultTemplateProcessor {
    /**
     * Create parts for an attribute-position binding, given the event, attribute
     * name, and string literals.
     *
     * @param element The element containing the binding
     * @param name  The attribute name
     * @param strings The string literals. There are always at least two strings,
     *   event for fully-controlled bindings with a single expression.
     */
    handleAttributeExpressions(element, name, strings, options) {
        const prefix = name[0];
        if (prefix === '.') {
            const committer = new PropertyCommitter(element, name.slice(1), strings);
            return committer.parts;
        }
        if (prefix === '@') {
            return [new EventPart$1(element, name.slice(1), options.eventContext)];
        }
        if (prefix === '?') {
            return [new BooleanAttributePart$1(element, name.slice(1), strings)];
        }
        const committer = new AttributeCommitter(element, name, strings);
        return committer.parts;
    }
    /**
     * Create parts for a text-position binding.
     * @param templateFactory
     */
    handleTextExpression(options) {
        return new NodePart$1(options);
    }
}
const defaultTemplateProcessor = new DefaultTemplateProcessor();

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for lit-html usage.
// TODO(justinfagnani): inject version number at build time
if (typeof window !== 'undefined') {
    (window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.4.1');
}
/**
 * Interprets a template literal as an HTML template that can efficiently
 * render to and update a container.
 */
const html = (strings, ...values) => new TemplateResult$1(strings, values, 'html', defaultTemplateProcessor);

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// Get a key to lookup in `templateCaches`.
const getTemplateCacheKey = (type, scopeName) => `${type}--${scopeName}`;
let compatibleShadyCSSVersion = true;
if (typeof window.ShadyCSS === 'undefined') {
    compatibleShadyCSSVersion = false;
}
else if (typeof window.ShadyCSS.prepareTemplateDom === 'undefined') {
    console.warn(`Incompatible ShadyCSS version detected. ` +
        `Please update to at least @webcomponents/webcomponentsjs@2.0.2 and ` +
        `@webcomponents/shadycss@1.3.1.`);
    compatibleShadyCSSVersion = false;
}
/**
 * Template factory which scopes template DOM using ShadyCSS.
 * @param scopeName {string}
 */
const shadyTemplateFactory = (scopeName) => (result) => {
    const cacheKey = getTemplateCacheKey(result.type, scopeName);
    let templateCache = templateCaches.get(cacheKey);
    if (templateCache === undefined) {
        templateCache = {
            stringsArray: new WeakMap(),
            keyString: new Map()
        };
        templateCaches.set(cacheKey, templateCache);
    }
    let template = templateCache.stringsArray.get(result.strings);
    if (template !== undefined) {
        return template;
    }
    const key = result.strings.join(marker$1);
    template = templateCache.keyString.get(key);
    if (template === undefined) {
        const element = result.getTemplateElement();
        if (compatibleShadyCSSVersion) {
            window.ShadyCSS.prepareTemplateDom(element, scopeName);
        }
        template = new Template(result, element);
        templateCache.keyString.set(key, template);
    }
    templateCache.stringsArray.set(result.strings, template);
    return template;
};
const TEMPLATE_TYPES = ['html', 'svg'];
/**
 * Removes all style elements from Templates for the given scopeName.
 */
const removeStylesFromLitTemplates = (scopeName) => {
    TEMPLATE_TYPES.forEach((type) => {
        const templates = templateCaches.get(getTemplateCacheKey(type, scopeName));
        if (templates !== undefined) {
            templates.keyString.forEach((template) => {
                const { element: { content } } = template;
                // IE 11 doesn't support the iterable param Set constructor
                const styles = new Set();
                Array.from(content.querySelectorAll('style')).forEach((s) => {
                    styles.add(s);
                });
                removeNodesFromTemplate(template, styles);
            });
        }
    });
};
const shadyRenderSet = new Set();
/**
 * For the given scope name, ensures that ShadyCSS style scoping is performed.
 * This is done just once per scope name so the fragment and template cannot
 * be modified.
 * (1) extracts styles from the rendered fragment and hands them to ShadyCSS
 * to be scoped and appended to the document
 * (2) removes style elements from all lit-html Templates for this scope name.
 *
 * Note, <style> elements can only be placed into templates for the
 * initial rendering of the scope. If <style> elements are included in templates
 * dynamically rendered to the scope (after the first scope render), they will
 * not be scoped and the <style> will be left in the template and rendered
 * output.
 */
const prepareTemplateStyles = (scopeName, renderedDOM, template) => {
    shadyRenderSet.add(scopeName);
    // If `renderedDOM` is stamped from a Template, then we need to edit that
    // Template's underlying template element. Otherwise, we create one here
    // to give to ShadyCSS, which still requires one while scoping.
    const templateElement = !!template ? template.element : document.createElement('template');
    // Move styles out of rendered DOM and store.
    const styles = renderedDOM.querySelectorAll('style');
    const { length } = styles;
    // If there are no styles, skip unnecessary work
    if (length === 0) {
        // Ensure prepareTemplateStyles is called to support adding
        // styles via `prepareAdoptedCssText` since that requires that
        // `prepareTemplateStyles` is called.
        //
        // ShadyCSS will only update styles containing @apply in the template
        // given to `prepareTemplateStyles`. If no lit Template was given,
        // ShadyCSS will not be able to update uses of @apply in any relevant
        // template. However, this is not a problem because we only create the
        // template for the purpose of supporting `prepareAdoptedCssText`,
        // which doesn't support @apply at all.
        window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
        return;
    }
    const condensedStyle = document.createElement('style');
    // Collect styles into a single style. This helps us make sure ShadyCSS
    // manipulations will not prevent us from being able to fix up template
    // part indices.
    // NOTE: collecting styles is inefficient for browsers but ShadyCSS
    // currently does this anyway. When it does not, this should be changed.
    for (let i = 0; i < length; i++) {
        const style = styles[i];
        style.parentNode.removeChild(style);
        condensedStyle.textContent += style.textContent;
    }
    // Remove styles from nested templates in this scope.
    removeStylesFromLitTemplates(scopeName);
    // And then put the condensed style into the "root" template passed in as
    // `template`.
    const content = templateElement.content;
    if (!!template) {
        insertNodeIntoTemplate(template, condensedStyle, content.firstChild);
    }
    else {
        content.insertBefore(condensedStyle, content.firstChild);
    }
    // Note, it's important that ShadyCSS gets the template that `lit-html`
    // will actually render so that it can update the style inside when
    // needed (e.g. @apply native Shadow DOM case).
    window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
    const style = content.querySelector('style');
    if (window.ShadyCSS.nativeShadow && style !== null) {
        // When in native Shadow DOM, ensure the style created by ShadyCSS is
        // included in initially rendered output (`renderedDOM`).
        renderedDOM.insertBefore(style.cloneNode(true), renderedDOM.firstChild);
    }
    else if (!!template) {
        // When no style is left in the template, parts will be broken as a
        // result. To fix this, we put back the style node ShadyCSS removed
        // and then tell lit to remove that node from the template.
        // There can be no style in the template in 2 cases (1) when Shady DOM
        // is in use, ShadyCSS removes all styles, (2) when native Shadow DOM
        // is in use ShadyCSS removes the style if it contains no content.
        // NOTE, ShadyCSS creates its own style so we can safely add/remove
        // `condensedStyle` here.
        content.insertBefore(condensedStyle, content.firstChild);
        const removes = new Set();
        removes.add(condensedStyle);
        removeNodesFromTemplate(template, removes);
    }
};
/**
 * Extension to the standard `render` method which supports rendering
 * to ShadowRoots when the ShadyDOM (https://github.com/webcomponents/shadydom)
 * and ShadyCSS (https://github.com/webcomponents/shadycss) polyfills are used
 * or when the webcomponentsjs
 * (https://github.com/webcomponents/webcomponentsjs) polyfill is used.
 *
 * Adds a `scopeName` option which is used to scope element DOM and stylesheets
 * when native ShadowDOM is unavailable. The `scopeName` will be added to
 * the class attribute of all rendered DOM. In addition, any style elements will
 * be automatically re-written with this `scopeName` selector and moved out
 * of the rendered DOM and into the document `<head>`.
 *
 * It is common to use this render method in conjunction with a custom element
 * which renders a shadowRoot. When this is done, typically the element's
 * `localName` should be used as the `scopeName`.
 *
 * In addition to DOM scoping, ShadyCSS also supports a basic shim for css
 * custom properties (needed only on older browsers like IE11) and a shim for
 * a deprecated feature called `@apply` that supports applying a set of css
 * custom properties to a given location.
 *
 * Usage considerations:
 *
 * * Part values in `<style>` elements are only applied the first time a given
 * `scopeName` renders. Subsequent changes to parts in style elements will have
 * no effect. Because of this, parts in style elements should only be used for
 * values that will never change, for example parts that set scope-wide theme
 * values or parts which render shared style elements.
 *
 * * Note, due to a limitation of the ShadyDOM polyfill, rendering in a
 * custom element's `constructor` is not supported. Instead rendering should
 * either done asynchronously, for example at microtask timing (for example
 * `Promise.resolve()`), or be deferred until the first time the element's
 * `connectedCallback` runs.
 *
 * Usage considerations when using shimmed custom properties or `@apply`:
 *
 * * Whenever any dynamic changes are made which affect
 * css custom properties, `ShadyCSS.styleElement(element)` must be called
 * to update the element. There are two cases when this is needed:
 * (1) the element is connected to a new parent, (2) a class is added to the
 * element that causes it to match different custom properties.
 * To address the first case when rendering a custom element, `styleElement`
 * should be called in the element's `connectedCallback`.
 *
 * * Shimmed custom properties may only be defined either for an entire
 * shadowRoot (for example, in a `:host` rule) or via a rule that directly
 * matches an element with a shadowRoot. In other words, instead of flowing from
 * parent to child as do native css custom properties, shimmed custom properties
 * flow only from shadowRoots to nested shadowRoots.
 *
 * * When using `@apply` mixing css shorthand property names with
 * non-shorthand names (for example `border` and `border-width`) is not
 * supported.
 */
const render = (result, container, options) => {
    if (!options || typeof options !== 'object' || !options.scopeName) {
        throw new Error('The `scopeName` option is required.');
    }
    const scopeName = options.scopeName;
    const hasRendered = parts.has(container);
    const needsScoping = compatibleShadyCSSVersion &&
        container.nodeType === 11 /* Node.DOCUMENT_FRAGMENT_NODE */ &&
        !!container.host;
    // Handle first render to a scope specially...
    const firstScopeRender = needsScoping && !shadyRenderSet.has(scopeName);
    // On first scope render, render into a fragment; this cannot be a single
    // fragment that is reused since nested renders can occur synchronously.
    const renderContainer = firstScopeRender ? document.createDocumentFragment() : container;
    render$1(result, renderContainer, Object.assign({ templateFactory: shadyTemplateFactory(scopeName) }, options));
    // When performing first scope render,
    // (1) We've rendered into a fragment so that there's a chance to
    // `prepareTemplateStyles` before sub-elements hit the DOM
    // (which might cause them to render based on a common pattern of
    // rendering in a custom element's `connectedCallback`);
    // (2) Scope the template with ShadyCSS one time only for this scope.
    // (3) Render the fragment into the container and make sure the
    // container knows its `part` is the one we just rendered. This ensures
    // DOM will be re-used on subsequent renders.
    if (firstScopeRender) {
        const part = parts.get(renderContainer);
        parts.delete(renderContainer);
        // ShadyCSS might have style sheets (e.g. from `prepareAdoptedCssText`)
        // that should apply to `renderContainer` even if the rendered value is
        // not a TemplateInstance. However, it will only insert scoped styles
        // into the document if `prepareTemplateStyles` has already been called
        // for the given scope name.
        const template = part.value instanceof TemplateInstance$1 ?
            part.value.template :
            undefined;
        prepareTemplateStyles(scopeName, renderContainer, template);
        removeNodes$1(container, container.firstChild);
        container.appendChild(renderContainer);
        parts.set(container, part);
    }
    // After elements have hit the DOM, update styling if this is the
    // initial render to this container.
    // This is needed whenever dynamic changes are made so it would be
    // safest to do every render; however, this would regress performance
    // so we leave it up to the user to call `ShadyCSS.styleElement`
    // for dynamic changes.
    if (!hasRendered && needsScoping) {
        window.ShadyCSS.styleElement(container.host);
    }
};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
var _a$1;
/**
 * Use this module if you want to create your own base class extending
 * [[UpdatingElement]].
 * @packageDocumentation
 */
/*
 * When using Closure Compiler, JSCompiler_renameProperty(property, object) is
 * replaced at compile time by the munged name for object[property]. We cannot
 * alias this function, so we have to use a small shim that has the same
 * behavior when not compiling.
 */
window.JSCompiler_renameProperty =
    (prop, _obj) => prop;
const defaultConverter = {
    toAttribute(value, type) {
        switch (type) {
            case Boolean:
                return value ? '' : null;
            case Object:
            case Array:
                // if the value is `null` or `undefined` pass this through
                // to allow removing/no change behavior.
                return value == null ? value : JSON.stringify(value);
        }
        return value;
    },
    fromAttribute(value, type) {
        switch (type) {
            case Boolean:
                return value !== null;
            case Number:
                return value === null ? null : Number(value);
            case Object:
            case Array:
                // Type assert to adhere to Bazel's "must type assert JSON parse" rule.
                return JSON.parse(value);
        }
        return value;
    }
};
/**
 * Change function that returns true if `value` is different from `oldValue`.
 * This method is used as the default for a property's `hasChanged` function.
 */
const notEqual = (value, old) => {
    // This ensures (old==NaN, value==NaN) always returns false
    return old !== value && (old === old || value === value);
};
const defaultPropertyDeclaration = {
    attribute: true,
    type: String,
    converter: defaultConverter,
    reflect: false,
    hasChanged: notEqual
};
const STATE_HAS_UPDATED = 1;
const STATE_UPDATE_REQUESTED = 1 << 2;
const STATE_IS_REFLECTING_TO_ATTRIBUTE = 1 << 3;
const STATE_IS_REFLECTING_TO_PROPERTY = 1 << 4;
/**
 * The Closure JS Compiler doesn't currently have good support for static
 * property semantics where "this" is dynamic (e.g.
 * https://github.com/google/closure-compiler/issues/3177 and others) so we use
 * this hack to bypass any rewriting by the compiler.
 */
const finalized = 'finalized';
/**
 * Base element class which manages element properties and attributes. When
 * properties change, the `update` method is asynchronously called. This method
 * should be supplied by subclassers to render updates as desired.
 * @noInheritDoc
 */
class UpdatingElement extends HTMLElement {
    constructor() {
        super();
        this.initialize();
    }
    /**
     * Returns a list of attributes corresponding to the registered properties.
     * @nocollapse
     */
    static get observedAttributes() {
        // note: piggy backing on this to ensure we're finalized.
        this.finalize();
        const attributes = [];
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        this._classProperties.forEach((v, p) => {
            const attr = this._attributeNameForProperty(p, v);
            if (attr !== undefined) {
                this._attributeToPropertyMap.set(attr, p);
                attributes.push(attr);
            }
        });
        return attributes;
    }
    /**
     * Ensures the private `_classProperties` property metadata is created.
     * In addition to `finalize` this is also called in `createProperty` to
     * ensure the `@property` decorator can add property metadata.
     */
    /** @nocollapse */
    static _ensureClassProperties() {
        // ensure private storage for property declarations.
        if (!this.hasOwnProperty(JSCompiler_renameProperty('_classProperties', this))) {
            this._classProperties = new Map();
            // NOTE: Workaround IE11 not supporting Map constructor argument.
            const superProperties = Object.getPrototypeOf(this)._classProperties;
            if (superProperties !== undefined) {
                superProperties.forEach((v, k) => this._classProperties.set(k, v));
            }
        }
    }
    /**
     * Creates a property accessor on the element prototype if one does not exist
     * and stores a PropertyDeclaration for the property with the given options.
     * The property setter calls the property's `hasChanged` property option
     * or uses a strict identity check to determine whether or not to request
     * an update.
     *
     * This method may be overridden to customize properties; however,
     * when doing so, it's important to call `super.createProperty` to ensure
     * the property is setup correctly. This method calls
     * `getPropertyDescriptor` internally to get a descriptor to install.
     * To customize what properties do when they are get or set, override
     * `getPropertyDescriptor`. To customize the options for a property,
     * implement `createProperty` like this:
     *
     * static createProperty(name, options) {
     *   options = Object.assign(options, {myOption: true});
     *   super.createProperty(name, options);
     * }
     *
     * @nocollapse
     */
    static createProperty(name, options = defaultPropertyDeclaration) {
        // Note, since this can be called by the `@property` decorator which
        // is called before `finalize`, we ensure storage exists for property
        // metadata.
        this._ensureClassProperties();
        this._classProperties.set(name, options);
        // Do not generate an accessor if the prototype already has one, since
        // it would be lost otherwise and that would never be the user's intention;
        // Instead, we expect users to call `requestUpdate` themselves from
        // user-defined accessors. Note that if the super has an accessor we will
        // still overwrite it
        if (options.noAccessor || this.prototype.hasOwnProperty(name)) {
            return;
        }
        const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
        const descriptor = this.getPropertyDescriptor(name, key, options);
        if (descriptor !== undefined) {
            Object.defineProperty(this.prototype, name, descriptor);
        }
    }
    /**
     * Returns a property descriptor to be defined on the given named property.
     * If no descriptor is returned, the property will not become an accessor.
     * For example,
     *
     *   class MyElement extends LitElement {
     *     static getPropertyDescriptor(name, key, options) {
     *       const defaultDescriptor =
     *           super.getPropertyDescriptor(name, key, options);
     *       const setter = defaultDescriptor.set;
     *       return {
     *         get: defaultDescriptor.get,
     *         set(value) {
     *           setter.call(this, value);
     *           // custom action.
     *         },
     *         configurable: true,
     *         enumerable: true
     *       }
     *     }
     *   }
     *
     * @nocollapse
     */
    static getPropertyDescriptor(name, key, options) {
        return {
            // tslint:disable-next-line:no-any no symbol in index
            get() {
                return this[key];
            },
            set(value) {
                const oldValue = this[name];
                this[key] = value;
                this
                    .requestUpdateInternal(name, oldValue, options);
            },
            configurable: true,
            enumerable: true
        };
    }
    /**
     * Returns the property options associated with the given property.
     * These options are defined with a PropertyDeclaration via the `properties`
     * object or the `@property` decorator and are registered in
     * `createProperty(...)`.
     *
     * Note, this method should be considered "final" and not overridden. To
     * customize the options for a given property, override `createProperty`.
     *
     * @nocollapse
     * @final
     */
    static getPropertyOptions(name) {
        return this._classProperties && this._classProperties.get(name) ||
            defaultPropertyDeclaration;
    }
    /**
     * Creates property accessors for registered properties and ensures
     * any superclasses are also finalized.
     * @nocollapse
     */
    static finalize() {
        // finalize any superclasses
        const superCtor = Object.getPrototypeOf(this);
        if (!superCtor.hasOwnProperty(finalized)) {
            superCtor.finalize();
        }
        this[finalized] = true;
        this._ensureClassProperties();
        // initialize Map populated in observedAttributes
        this._attributeToPropertyMap = new Map();
        // make any properties
        // Note, only process "own" properties since this element will inherit
        // any properties defined on the superClass, and finalization ensures
        // the entire prototype chain is finalized.
        if (this.hasOwnProperty(JSCompiler_renameProperty('properties', this))) {
            const props = this.properties;
            // support symbols in properties (IE11 does not support this)
            const propKeys = [
                ...Object.getOwnPropertyNames(props),
                ...(typeof Object.getOwnPropertySymbols === 'function') ?
                    Object.getOwnPropertySymbols(props) :
                    []
            ];
            // This for/of is ok because propKeys is an array
            for (const p of propKeys) {
                // note, use of `any` is due to TypeSript lack of support for symbol in
                // index types
                // tslint:disable-next-line:no-any no symbol in index
                this.createProperty(p, props[p]);
            }
        }
    }
    /**
     * Returns the property name for the given attribute `name`.
     * @nocollapse
     */
    static _attributeNameForProperty(name, options) {
        const attribute = options.attribute;
        return attribute === false ?
            undefined :
            (typeof attribute === 'string' ?
                attribute :
                (typeof name === 'string' ? name.toLowerCase() : undefined));
    }
    /**
     * Returns true if a property should request an update.
     * Called when a property value is set and uses the `hasChanged`
     * option for the property if present or a strict identity check.
     * @nocollapse
     */
    static _valueHasChanged(value, old, hasChanged = notEqual) {
        return hasChanged(value, old);
    }
    /**
     * Returns the property value for the given attribute value.
     * Called via the `attributeChangedCallback` and uses the property's
     * `converter` or `converter.fromAttribute` property option.
     * @nocollapse
     */
    static _propertyValueFromAttribute(value, options) {
        const type = options.type;
        const converter = options.converter || defaultConverter;
        const fromAttribute = (typeof converter === 'function' ? converter : converter.fromAttribute);
        return fromAttribute ? fromAttribute(value, type) : value;
    }
    /**
     * Returns the attribute value for the given property value. If this
     * returns undefined, the property will *not* be reflected to an attribute.
     * If this returns null, the attribute will be removed, otherwise the
     * attribute will be set to the value.
     * This uses the property's `reflect` and `type.toAttribute` property options.
     * @nocollapse
     */
    static _propertyValueToAttribute(value, options) {
        if (options.reflect === undefined) {
            return;
        }
        const type = options.type;
        const converter = options.converter;
        const toAttribute = converter && converter.toAttribute ||
            defaultConverter.toAttribute;
        return toAttribute(value, type);
    }
    /**
     * Performs element initialization. By default captures any pre-set values for
     * registered properties.
     */
    initialize() {
        this._updateState = 0;
        this._updatePromise =
            new Promise((res) => this._enableUpdatingResolver = res);
        this._changedProperties = new Map();
        this._saveInstanceProperties();
        // ensures first update will be caught by an early access of
        // `updateComplete`
        this.requestUpdateInternal();
    }
    /**
     * Fixes any properties set on the instance before upgrade time.
     * Otherwise these would shadow the accessor and break these properties.
     * The properties are stored in a Map which is played back after the
     * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
     * (<=41), properties created for native platform properties like (`id` or
     * `name`) may not have default values set in the element constructor. On
     * these browsers native properties appear on instances and therefore their
     * default value will overwrite any element default (e.g. if the element sets
     * this.id = 'id' in the constructor, the 'id' will become '' since this is
     * the native platform default).
     */
    _saveInstanceProperties() {
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        this.constructor
            ._classProperties.forEach((_v, p) => {
            if (this.hasOwnProperty(p)) {
                const value = this[p];
                delete this[p];
                if (!this._instanceProperties) {
                    this._instanceProperties = new Map();
                }
                this._instanceProperties.set(p, value);
            }
        });
    }
    /**
     * Applies previously saved instance properties.
     */
    _applyInstanceProperties() {
        // Use forEach so this works even if for/of loops are compiled to for loops
        // expecting arrays
        // tslint:disable-next-line:no-any
        this._instanceProperties.forEach((v, p) => this[p] = v);
        this._instanceProperties = undefined;
    }
    connectedCallback() {
        // Ensure first connection completes an update. Updates cannot complete
        // before connection.
        this.enableUpdating();
    }
    enableUpdating() {
        if (this._enableUpdatingResolver !== undefined) {
            this._enableUpdatingResolver();
            this._enableUpdatingResolver = undefined;
        }
    }
    /**
     * Allows for `super.disconnectedCallback()` in extensions while
     * reserving the possibility of making non-breaking feature additions
     * when disconnecting at some point in the future.
     */
    disconnectedCallback() {
    }
    /**
     * Synchronizes property values when attributes change.
     */
    attributeChangedCallback(name, old, value) {
        if (old !== value) {
            this._attributeToProperty(name, value);
        }
    }
    _propertyToAttribute(name, value, options = defaultPropertyDeclaration) {
        const ctor = this.constructor;
        const attr = ctor._attributeNameForProperty(name, options);
        if (attr !== undefined) {
            const attrValue = ctor._propertyValueToAttribute(value, options);
            // an undefined value does not change the attribute.
            if (attrValue === undefined) {
                return;
            }
            // Track if the property is being reflected to avoid
            // setting the property again via `attributeChangedCallback`. Note:
            // 1. this takes advantage of the fact that the callback is synchronous.
            // 2. will behave incorrectly if multiple attributes are in the reaction
            // stack at time of calling. However, since we process attributes
            // in `update` this should not be possible (or an extreme corner case
            // that we'd like to discover).
            // mark state reflecting
            this._updateState = this._updateState | STATE_IS_REFLECTING_TO_ATTRIBUTE;
            if (attrValue == null) {
                this.removeAttribute(attr);
            }
            else {
                this.setAttribute(attr, attrValue);
            }
            // mark state not reflecting
            this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_ATTRIBUTE;
        }
    }
    _attributeToProperty(name, value) {
        // Use tracking info to avoid deserializing attribute value if it was
        // just set from a property setter.
        if (this._updateState & STATE_IS_REFLECTING_TO_ATTRIBUTE) {
            return;
        }
        const ctor = this.constructor;
        // Note, hint this as an `AttributeMap` so closure clearly understands
        // the type; it has issues with tracking types through statics
        // tslint:disable-next-line:no-unnecessary-type-assertion
        const propName = ctor._attributeToPropertyMap.get(name);
        if (propName !== undefined) {
            const options = ctor.getPropertyOptions(propName);
            // mark state reflecting
            this._updateState = this._updateState | STATE_IS_REFLECTING_TO_PROPERTY;
            this[propName] =
                // tslint:disable-next-line:no-any
                ctor._propertyValueFromAttribute(value, options);
            // mark state not reflecting
            this._updateState = this._updateState & ~STATE_IS_REFLECTING_TO_PROPERTY;
        }
    }
    /**
     * This protected version of `requestUpdate` does not access or return the
     * `updateComplete` promise. This promise can be overridden and is therefore
     * not free to access.
     */
    requestUpdateInternal(name, oldValue, options) {
        let shouldRequestUpdate = true;
        // If we have a property key, perform property update steps.
        if (name !== undefined) {
            const ctor = this.constructor;
            options = options || ctor.getPropertyOptions(name);
            if (ctor._valueHasChanged(this[name], oldValue, options.hasChanged)) {
                if (!this._changedProperties.has(name)) {
                    this._changedProperties.set(name, oldValue);
                }
                // Add to reflecting properties set.
                // Note, it's important that every change has a chance to add the
                // property to `_reflectingProperties`. This ensures setting
                // attribute + property reflects correctly.
                if (options.reflect === true &&
                    !(this._updateState & STATE_IS_REFLECTING_TO_PROPERTY)) {
                    if (this._reflectingProperties === undefined) {
                        this._reflectingProperties = new Map();
                    }
                    this._reflectingProperties.set(name, options);
                }
            }
            else {
                // Abort the request if the property should not be considered changed.
                shouldRequestUpdate = false;
            }
        }
        if (!this._hasRequestedUpdate && shouldRequestUpdate) {
            this._updatePromise = this._enqueueUpdate();
        }
    }
    /**
     * Requests an update which is processed asynchronously. This should
     * be called when an element should update based on some state not triggered
     * by setting a property. In this case, pass no arguments. It should also be
     * called when manually implementing a property setter. In this case, pass the
     * property `name` and `oldValue` to ensure that any configured property
     * options are honored. Returns the `updateComplete` Promise which is resolved
     * when the update completes.
     *
     * @param name {PropertyKey} (optional) name of requesting property
     * @param oldValue {any} (optional) old value of requesting property
     * @returns {Promise} A Promise that is resolved when the update completes.
     */
    requestUpdate(name, oldValue) {
        this.requestUpdateInternal(name, oldValue);
        return this.updateComplete;
    }
    /**
     * Sets up the element to asynchronously update.
     */
    async _enqueueUpdate() {
        this._updateState = this._updateState | STATE_UPDATE_REQUESTED;
        try {
            // Ensure any previous update has resolved before updating.
            // This `await` also ensures that property changes are batched.
            await this._updatePromise;
        }
        catch (e) {
            // Ignore any previous errors. We only care that the previous cycle is
            // done. Any error should have been handled in the previous update.
        }
        const result = this.performUpdate();
        // If `performUpdate` returns a Promise, we await it. This is done to
        // enable coordinating updates with a scheduler. Note, the result is
        // checked to avoid delaying an additional microtask unless we need to.
        if (result != null) {
            await result;
        }
        return !this._hasRequestedUpdate;
    }
    get _hasRequestedUpdate() {
        return (this._updateState & STATE_UPDATE_REQUESTED);
    }
    get hasUpdated() {
        return (this._updateState & STATE_HAS_UPDATED);
    }
    /**
     * Performs an element update. Note, if an exception is thrown during the
     * update, `firstUpdated` and `updated` will not be called.
     *
     * You can override this method to change the timing of updates. If this
     * method is overridden, `super.performUpdate()` must be called.
     *
     * For instance, to schedule updates to occur just before the next frame:
     *
     * ```
     * protected async performUpdate(): Promise<unknown> {
     *   await new Promise((resolve) => requestAnimationFrame(() => resolve()));
     *   super.performUpdate();
     * }
     * ```
     */
    performUpdate() {
        // Abort any update if one is not pending when this is called.
        // This can happen if `performUpdate` is called early to "flush"
        // the update.
        if (!this._hasRequestedUpdate) {
            return;
        }
        // Mixin instance properties once, if they exist.
        if (this._instanceProperties) {
            this._applyInstanceProperties();
        }
        let shouldUpdate = false;
        const changedProperties = this._changedProperties;
        try {
            shouldUpdate = this.shouldUpdate(changedProperties);
            if (shouldUpdate) {
                this.update(changedProperties);
            }
            else {
                this._markUpdated();
            }
        }
        catch (e) {
            // Prevent `firstUpdated` and `updated` from running when there's an
            // update exception.
            shouldUpdate = false;
            // Ensure element can accept additional updates after an exception.
            this._markUpdated();
            throw e;
        }
        if (shouldUpdate) {
            if (!(this._updateState & STATE_HAS_UPDATED)) {
                this._updateState = this._updateState | STATE_HAS_UPDATED;
                this.firstUpdated(changedProperties);
            }
            this.updated(changedProperties);
        }
    }
    _markUpdated() {
        this._changedProperties = new Map();
        this._updateState = this._updateState & ~STATE_UPDATE_REQUESTED;
    }
    /**
     * Returns a Promise that resolves when the element has completed updating.
     * The Promise value is a boolean that is `true` if the element completed the
     * update without triggering another update. The Promise result is `false` if
     * a property was set inside `updated()`. If the Promise is rejected, an
     * exception was thrown during the update.
     *
     * To await additional asynchronous work, override the `_getUpdateComplete`
     * method. For example, it is sometimes useful to await a rendered element
     * before fulfilling this Promise. To do this, first await
     * `super._getUpdateComplete()`, then any subsequent state.
     *
     * @returns {Promise} The Promise returns a boolean that indicates if the
     * update resolved without triggering another update.
     */
    get updateComplete() {
        return this._getUpdateComplete();
    }
    /**
     * Override point for the `updateComplete` promise.
     *
     * It is not safe to override the `updateComplete` getter directly due to a
     * limitation in TypeScript which means it is not possible to call a
     * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
     * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
     * This method should be overridden instead. For example:
     *
     *   class MyElement extends LitElement {
     *     async _getUpdateComplete() {
     *       await super._getUpdateComplete();
     *       await this._myChild.updateComplete;
     *     }
     *   }
     * @deprecated Override `getUpdateComplete()` instead for forward
     *     compatibility with `lit-element` 3.0 / `@lit/reactive-element`.
     */
    _getUpdateComplete() {
        return this.getUpdateComplete();
    }
    /**
     * Override point for the `updateComplete` promise.
     *
     * It is not safe to override the `updateComplete` getter directly due to a
     * limitation in TypeScript which means it is not possible to call a
     * superclass getter (e.g. `super.updateComplete.then(...)`) when the target
     * language is ES5 (https://github.com/microsoft/TypeScript/issues/338).
     * This method should be overridden instead. For example:
     *
     *   class MyElement extends LitElement {
     *     async getUpdateComplete() {
     *       await super.getUpdateComplete();
     *       await this._myChild.updateComplete;
     *     }
     *   }
     */
    getUpdateComplete() {
        return this._updatePromise;
    }
    /**
     * Controls whether or not `update` should be called when the element requests
     * an update. By default, this method always returns `true`, but this can be
     * customized to control when to update.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    shouldUpdate(_changedProperties) {
        return true;
    }
    /**
     * Updates the element. This method reflects property values to attributes.
     * It can be overridden to render and keep updated element DOM.
     * Setting properties inside this method will *not* trigger
     * another update.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    update(_changedProperties) {
        if (this._reflectingProperties !== undefined &&
            this._reflectingProperties.size > 0) {
            // Use forEach so this works even if for/of loops are compiled to for
            // loops expecting arrays
            this._reflectingProperties.forEach((v, k) => this._propertyToAttribute(k, this[k], v));
            this._reflectingProperties = undefined;
        }
        this._markUpdated();
    }
    /**
     * Invoked whenever the element is updated. Implement to perform
     * post-updating tasks via DOM APIs, for example, focusing an element.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    updated(_changedProperties) {
    }
    /**
     * Invoked when the element is first updated. Implement to perform one time
     * work on the element after update.
     *
     * Setting properties inside this method will trigger the element to update
     * again after this update cycle completes.
     *
     * @param _changedProperties Map of changed properties with old values
     */
    firstUpdated(_changedProperties) {
    }
}
_a$1 = finalized;
/**
 * Marks class as having finished creating properties.
 */
UpdatingElement[_a$1] = true;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const legacyCustomElement = (tagName, clazz) => {
    window.customElements.define(tagName, clazz);
    // Cast as any because TS doesn't recognize the return type as being a
    // subtype of the decorated class when clazz is typed as
    // `Constructor<HTMLElement>` for some reason.
    // `Constructor<HTMLElement>` is helpful to make sure the decorator is
    // applied to elements however.
    // tslint:disable-next-line:no-any
    return clazz;
};
const standardCustomElement = (tagName, descriptor) => {
    const { kind, elements } = descriptor;
    return {
        kind,
        elements,
        // This callback is called once the class is otherwise fully defined
        finisher(clazz) {
            window.customElements.define(tagName, clazz);
        }
    };
};
/**
 * Class decorator factory that defines the decorated class as a custom element.
 *
 * ```
 * @customElement('my-element')
 * class MyElement {
 *   render() {
 *     return html``;
 *   }
 * }
 * ```
 * @category Decorator
 * @param tagName The name of the custom element to define.
 */
const customElement = (tagName) => (classOrDescriptor) => (typeof classOrDescriptor === 'function') ?
    legacyCustomElement(tagName, classOrDescriptor) :
    standardCustomElement(tagName, classOrDescriptor);
const standardProperty = (options, element) => {
    // When decorating an accessor, pass it through and add property metadata.
    // Note, the `hasOwnProperty` check in `createProperty` ensures we don't
    // stomp over the user's accessor.
    if (element.kind === 'method' && element.descriptor &&
        !('value' in element.descriptor)) {
        return Object.assign(Object.assign({}, element), { finisher(clazz) {
                clazz.createProperty(element.key, options);
            } });
    }
    else {
        // createProperty() takes care of defining the property, but we still
        // must return some kind of descriptor, so return a descriptor for an
        // unused prototype field. The finisher calls createProperty().
        return {
            kind: 'field',
            key: Symbol(),
            placement: 'own',
            descriptor: {},
            // When @babel/plugin-proposal-decorators implements initializers,
            // do this instead of the initializer below. See:
            // https://github.com/babel/babel/issues/9260 extras: [
            //   {
            //     kind: 'initializer',
            //     placement: 'own',
            //     initializer: descriptor.initializer,
            //   }
            // ],
            initializer() {
                if (typeof element.initializer === 'function') {
                    this[element.key] = element.initializer.call(this);
                }
            },
            finisher(clazz) {
                clazz.createProperty(element.key, options);
            }
        };
    }
};
const legacyProperty = (options, proto, name) => {
    proto.constructor
        .createProperty(name, options);
};
/**
 * A property decorator which creates a LitElement property which reflects a
 * corresponding attribute value. A [[`PropertyDeclaration`]] may optionally be
 * supplied to configure property features.
 *
 * This decorator should only be used for public fields. Private or protected
 * fields should use the [[`internalProperty`]] decorator.
 *
 * @example
 * ```ts
 * class MyElement {
 *   @property({ type: Boolean })
 *   clicked = false;
 * }
 * ```
 * @category Decorator
 * @ExportDecoratedItems
 */
function property(options) {
    // tslint:disable-next-line:no-any decorator
    return (protoOrDescriptor, name) => (name !== undefined) ?
        legacyProperty(options, protoOrDescriptor, name) :
        standardProperty(options, protoOrDescriptor);
}
/**
 * Declares a private or protected property that still triggers updates to the
 * element when it changes.
 *
 * Properties declared this way must not be used from HTML or HTML templating
 * systems, they're solely for properties internal to the element. These
 * properties may be renamed by optimization tools like the Closure Compiler.
 * @category Decorator
 * @deprecated `internalProperty` has been renamed to `state` in lit-element
 *     3.0. Please update to `state` now to be compatible with 3.0.
 */
function internalProperty(options) {
    return property({ attribute: false, hasChanged: options === null || options === void 0 ? void 0 : options.hasChanged });
}
/**
 * Declares a private or protected property that still triggers updates to the
 * element when it changes.
 *
 * Properties declared this way must not be used from HTML or HTML templating
 * systems, they're solely for properties internal to the element. These
 * properties may be renamed by optimization tools like the Closure Compiler.
 * @category Decorator
 */
const state = (options) => internalProperty(options);
/**
 * A property decorator that converts a class property into a getter that
 * executes a querySelector on the element's renderRoot.
 *
 * @param selector A DOMString containing one or more selectors to match.
 * @param cache An optional boolean which when true performs the DOM query only
 * once and caches the result.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
 *
 * @example
 *
 * ```ts
 * class MyElement {
 *   @query('#first')
 *   first;
 *
 *   render() {
 *     return html`
 *       <div id="first"></div>
 *       <div id="second"></div>
 *     `;
 *   }
 * }
 * ```
 * @category Decorator
 */
function query(selector, cache) {
    return (protoOrDescriptor, 
    // tslint:disable-next-line:no-any decorator
    name) => {
        const descriptor = {
            get() {
                return this.renderRoot.querySelector(selector);
            },
            enumerable: true,
            configurable: true,
        };
        if (cache) {
            const prop = name !== undefined ? name : protoOrDescriptor.key;
            const key = typeof prop === 'symbol' ? Symbol() : `__${prop}`;
            descriptor.get = function () {
                if (this[key] === undefined) {
                    (this[key] =
                        this.renderRoot.querySelector(selector));
                }
                return this[key];
            };
        }
        return (name !== undefined) ?
            legacyQuery(descriptor, protoOrDescriptor, name) :
            standardQuery(descriptor, protoOrDescriptor);
    };
}
// Note, in the future, we may extend this decorator to support the use case
// where the queried element may need to do work to become ready to interact
// with (e.g. load some implementation code). If so, we might elect to
// add a second argument defining a function that can be run to make the
// queried element loaded/updated/ready.
/**
 * A property decorator that converts a class property into a getter that
 * returns a promise that resolves to the result of a querySelector on the
 * element's renderRoot done after the element's `updateComplete` promise
 * resolves. When the queried property may change with element state, this
 * decorator can be used instead of requiring users to await the
 * `updateComplete` before accessing the property.
 *
 * @param selector A DOMString containing one or more selectors to match.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
 *
 * @example
 * ```ts
 * class MyElement {
 *   @queryAsync('#first')
 *   first;
 *
 *   render() {
 *     return html`
 *       <div id="first"></div>
 *       <div id="second"></div>
 *     `;
 *   }
 * }
 *
 * // external usage
 * async doSomethingWithFirst() {
 *  (await aMyElement.first).doSomething();
 * }
 * ```
 * @category Decorator
 */
function queryAsync(selector) {
    return (protoOrDescriptor, 
    // tslint:disable-next-line:no-any decorator
    name) => {
        const descriptor = {
            async get() {
                await this.updateComplete;
                return this.renderRoot.querySelector(selector);
            },
            enumerable: true,
            configurable: true,
        };
        return (name !== undefined) ?
            legacyQuery(descriptor, protoOrDescriptor, name) :
            standardQuery(descriptor, protoOrDescriptor);
    };
}
const legacyQuery = (descriptor, proto, name) => {
    Object.defineProperty(proto, name, descriptor);
};
const standardQuery = (descriptor, element) => ({
    kind: 'method',
    placement: 'prototype',
    key: element.key,
    descriptor,
});
const standardEventOptions = (options, element) => {
    return Object.assign(Object.assign({}, element), { finisher(clazz) {
            Object.assign(clazz.prototype[element.key], options);
        } });
};
const legacyEventOptions = 
// tslint:disable-next-line:no-any legacy decorator
(options, proto, name) => {
    Object.assign(proto[name], options);
};
/**
 * Adds event listener options to a method used as an event listener in a
 * lit-html template.
 *
 * @param options An object that specifies event listener options as accepted by
 * `EventTarget#addEventListener` and `EventTarget#removeEventListener`.
 *
 * Current browsers support the `capture`, `passive`, and `once` options. See:
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters
 *
 * @example
 * ```ts
 * class MyElement {
 *   clicked = false;
 *
 *   render() {
 *     return html`
 *       <div @click=${this._onClick}`>
 *         <button></button>
 *       </div>
 *     `;
 *   }
 *
 *   @eventOptions({capture: true})
 *   _onClick(e) {
 *     this.clicked = true;
 *   }
 * }
 * ```
 * @category Decorator
 */
function eventOptions(options) {
    // Return value typed as any to prevent TypeScript from complaining that
    // standard decorator function signature does not match TypeScript decorator
    // signature
    // TODO(kschaaf): unclear why it was only failing on this decorator and not
    // the others
    return ((protoOrDescriptor, name) => (name !== undefined) ?
        legacyEventOptions(options, protoOrDescriptor, name) :
        standardEventOptions(options, protoOrDescriptor));
}
// x-browser support for matches
// tslint:disable-next-line:no-any
const ElementProto = Element.prototype;
const legacyMatches = ElementProto.msMatchesSelector || ElementProto.webkitMatchesSelector;
/**
 * A property decorator that converts a class property into a getter that
 * returns the `assignedNodes` of the given named `slot`. Note, the type of
 * this property should be annotated as `NodeListOf<HTMLElement>`.
 *
 * @param slotName A string name of the slot.
 * @param flatten A boolean which when true flattens the assigned nodes,
 * meaning any assigned nodes that are slot elements are replaced with their
 * assigned nodes.
 * @param selector A string which filters the results to elements that match
 * the given css selector.
 *
 * * @example
 * ```ts
 * class MyElement {
 *   @queryAssignedNodes('list', true, '.item')
 *   listItems;
 *
 *   render() {
 *     return html`
 *       <slot name="list"></slot>
 *     `;
 *   }
 * }
 * ```
 * @category Decorator
 */
function queryAssignedNodes(slotName = '', flatten = false, selector = '') {
    return (protoOrDescriptor, 
    // tslint:disable-next-line:no-any decorator
    name) => {
        const descriptor = {
            get() {
                const slotSelector = `slot${slotName ? `[name=${slotName}]` : ':not([name])'}`;
                const slot = this.renderRoot.querySelector(slotSelector);
                let nodes = slot && slot.assignedNodes({ flatten });
                if (nodes && selector) {
                    nodes = nodes.filter((node) => node.nodeType === Node.ELEMENT_NODE &&
                        // tslint:disable-next-line:no-any testing existence on older browsers
                        (node.matches ?
                            node.matches(selector) :
                            legacyMatches.call(node, selector)));
                }
                return nodes;
            },
            enumerable: true,
            configurable: true,
        };
        return (name !== undefined) ?
            legacyQuery(descriptor, protoOrDescriptor, name) :
            standardQuery(descriptor, protoOrDescriptor);
    };
}

/**
@license
Copyright (c) 2019 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at
http://polymer.github.io/LICENSE.txt The complete set of authors may be found at
http://polymer.github.io/AUTHORS.txt The complete set of contributors may be
found at http://polymer.github.io/CONTRIBUTORS.txt Code distributed by Google as
part of the polymer project is also subject to an additional IP rights grant
found at http://polymer.github.io/PATENTS.txt
*/
/**
 * Whether the current browser supports `adoptedStyleSheets`.
 */
const supportsAdoptingStyleSheets = (window.ShadowRoot) &&
    (window.ShadyCSS === undefined || window.ShadyCSS.nativeShadow) &&
    ('adoptedStyleSheets' in Document.prototype) &&
    ('replace' in CSSStyleSheet.prototype);
const constructionToken = Symbol();
class CSSResult {
    constructor(cssText, safeToken) {
        if (safeToken !== constructionToken) {
            throw new Error('CSSResult is not constructable. Use `unsafeCSS` or `css` instead.');
        }
        this.cssText = cssText;
    }
    // Note, this is a getter so that it's lazy. In practice, this means
    // stylesheets are not created until the first element instance is made.
    get styleSheet() {
        if (this._styleSheet === undefined) {
            // Note, if `supportsAdoptingStyleSheets` is true then we assume
            // CSSStyleSheet is constructable.
            if (supportsAdoptingStyleSheets) {
                this._styleSheet = new CSSStyleSheet();
                this._styleSheet.replaceSync(this.cssText);
            }
            else {
                this._styleSheet = null;
            }
        }
        return this._styleSheet;
    }
    toString() {
        return this.cssText;
    }
}
/**
 * Wrap a value for interpolation in a [[`css`]] tagged template literal.
 *
 * This is unsafe because untrusted CSS text can be used to phone home
 * or exfiltrate data to an attacker controlled site. Take care to only use
 * this with trusted input.
 */
const unsafeCSS = (value) => {
    return new CSSResult(String(value), constructionToken);
};
const textFromCSSResult = (value) => {
    if (value instanceof CSSResult) {
        return value.cssText;
    }
    else if (typeof value === 'number') {
        return value;
    }
    else {
        throw new Error(`Value passed to 'css' function must be a 'css' function result: ${value}. Use 'unsafeCSS' to pass non-literal values, but
            take care to ensure page security.`);
    }
};
/**
 * Template tag which which can be used with LitElement's [[LitElement.styles |
 * `styles`]] property to set element styles. For security reasons, only literal
 * string values may be used. To incorporate non-literal values [[`unsafeCSS`]]
 * may be used inside a template string part.
 */
const css = (strings, ...values) => {
    const cssText = values.reduce((acc, v, idx) => acc + textFromCSSResult(v) + strings[idx + 1], strings[0]);
    return new CSSResult(cssText, constructionToken);
};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for LitElement usage.
// TODO(justinfagnani): inject version number at build time
(window['litElementVersions'] || (window['litElementVersions'] = []))
    .push('2.5.1');
/**
 * Sentinal value used to avoid calling lit-html's render function when
 * subclasses do not implement `render`
 */
const renderNotImplemented = {};
/**
 * Base element class that manages element properties and attributes, and
 * renders a lit-html template.
 *
 * To define a component, subclass `LitElement` and implement a
 * `render` method to provide the component's template. Define properties
 * using the [[`properties`]] property or the [[`property`]] decorator.
 */
class LitElement extends UpdatingElement {
    /**
     * Return the array of styles to apply to the element.
     * Override this method to integrate into a style management system.
     *
     * @nocollapse
     */
    static getStyles() {
        return this.styles;
    }
    /** @nocollapse */
    static _getUniqueStyles() {
        // Only gather styles once per class
        if (this.hasOwnProperty(JSCompiler_renameProperty('_styles', this))) {
            return;
        }
        // Take care not to call `this.getStyles()` multiple times since this
        // generates new CSSResults each time.
        // TODO(sorvell): Since we do not cache CSSResults by input, any
        // shared styles will generate new stylesheet objects, which is wasteful.
        // This should be addressed when a browser ships constructable
        // stylesheets.
        const userStyles = this.getStyles();
        if (Array.isArray(userStyles)) {
            // De-duplicate styles preserving the _last_ instance in the set.
            // This is a performance optimization to avoid duplicated styles that can
            // occur especially when composing via subclassing.
            // The last item is kept to try to preserve the cascade order with the
            // assumption that it's most important that last added styles override
            // previous styles.
            const addStyles = (styles, set) => styles.reduceRight((set, s) => 
            // Note: On IE set.add() does not return the set
            Array.isArray(s) ? addStyles(s, set) : (set.add(s), set), set);
            // Array.from does not work on Set in IE, otherwise return
            // Array.from(addStyles(userStyles, new Set<CSSResult>())).reverse()
            const set = addStyles(userStyles, new Set());
            const styles = [];
            set.forEach((v) => styles.unshift(v));
            this._styles = styles;
        }
        else {
            this._styles = userStyles === undefined ? [] : [userStyles];
        }
        // Ensure that there are no invalid CSSStyleSheet instances here. They are
        // invalid in two conditions.
        // (1) the sheet is non-constructible (`sheet` of a HTMLStyleElement), but
        //     this is impossible to check except via .replaceSync or use
        // (2) the ShadyCSS polyfill is enabled (:. supportsAdoptingStyleSheets is
        //     false)
        this._styles = this._styles.map((s) => {
            if (s instanceof CSSStyleSheet && !supportsAdoptingStyleSheets) {
                // Flatten the cssText from the passed constructible stylesheet (or
                // undetectable non-constructible stylesheet). The user might have
                // expected to update their stylesheets over time, but the alternative
                // is a crash.
                const cssText = Array.prototype.slice.call(s.cssRules)
                    .reduce((css, rule) => css + rule.cssText, '');
                return unsafeCSS(cssText);
            }
            return s;
        });
    }
    /**
     * Performs element initialization. By default this calls
     * [[`createRenderRoot`]] to create the element [[`renderRoot`]] node and
     * captures any pre-set values for registered properties.
     */
    initialize() {
        super.initialize();
        this.constructor._getUniqueStyles();
        this.renderRoot = this.createRenderRoot();
        // Note, if renderRoot is not a shadowRoot, styles would/could apply to the
        // element's getRootNode(). While this could be done, we're choosing not to
        // support this now since it would require different logic around de-duping.
        if (window.ShadowRoot && this.renderRoot instanceof window.ShadowRoot) {
            this.adoptStyles();
        }
    }
    /**
     * Returns the node into which the element should render and by default
     * creates and returns an open shadowRoot. Implement to customize where the
     * element's DOM is rendered. For example, to render into the element's
     * childNodes, return `this`.
     * @returns {Element|DocumentFragment} Returns a node into which to render.
     */
    createRenderRoot() {
        return this.attachShadow(this.constructor.shadowRootOptions);
    }
    /**
     * Applies styling to the element shadowRoot using the [[`styles`]]
     * property. Styling will apply using `shadowRoot.adoptedStyleSheets` where
     * available and will fallback otherwise. When Shadow DOM is polyfilled,
     * ShadyCSS scopes styles and adds them to the document. When Shadow DOM
     * is available but `adoptedStyleSheets` is not, styles are appended to the
     * end of the `shadowRoot` to [mimic spec
     * behavior](https://wicg.github.io/construct-stylesheets/#using-constructed-stylesheets).
     */
    adoptStyles() {
        const styles = this.constructor._styles;
        if (styles.length === 0) {
            return;
        }
        // There are three separate cases here based on Shadow DOM support.
        // (1) shadowRoot polyfilled: use ShadyCSS
        // (2) shadowRoot.adoptedStyleSheets available: use it
        // (3) shadowRoot.adoptedStyleSheets polyfilled: append styles after
        // rendering
        if (window.ShadyCSS !== undefined && !window.ShadyCSS.nativeShadow) {
            window.ShadyCSS.ScopingShim.prepareAdoptedCssText(styles.map((s) => s.cssText), this.localName);
        }
        else if (supportsAdoptingStyleSheets) {
            this.renderRoot.adoptedStyleSheets =
                styles.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
        }
        else {
            // This must be done after rendering so the actual style insertion is done
            // in `update`.
            this._needsShimAdoptedStyleSheets = true;
        }
    }
    connectedCallback() {
        super.connectedCallback();
        // Note, first update/render handles styleElement so we only call this if
        // connected after first update.
        if (this.hasUpdated && window.ShadyCSS !== undefined) {
            window.ShadyCSS.styleElement(this);
        }
    }
    /**
     * Updates the element. This method reflects property values to attributes
     * and calls `render` to render DOM via lit-html. Setting properties inside
     * this method will *not* trigger another update.
     * @param _changedProperties Map of changed properties with old values
     */
    update(changedProperties) {
        // Setting properties in `render` should not trigger an update. Since
        // updates are allowed after super.update, it's important to call `render`
        // before that.
        const templateResult = this.render();
        super.update(changedProperties);
        // If render is not implemented by the component, don't call lit-html render
        if (templateResult !== renderNotImplemented) {
            this.constructor
                .render(templateResult, this.renderRoot, { scopeName: this.localName, eventContext: this });
        }
        // When native Shadow DOM is used but adoptedStyles are not supported,
        // insert styling after rendering to ensure adoptedStyles have highest
        // priority.
        if (this._needsShimAdoptedStyleSheets) {
            this._needsShimAdoptedStyleSheets = false;
            this.constructor._styles.forEach((s) => {
                const style = document.createElement('style');
                style.textContent = s.cssText;
                this.renderRoot.appendChild(style);
            });
        }
    }
    /**
     * Invoked on each update to perform rendering tasks. This method may return
     * any value renderable by lit-html's `NodePart` - typically a
     * `TemplateResult`. Setting properties inside this method will *not* trigger
     * the element to update.
     */
    render() {
        return renderNotImplemented;
    }
}
/**
 * Ensure this class is marked as `finalized` as an optimization ensuring
 * it will not needlessly try to `finalize`.
 *
 * Note this property name is a string to prevent breaking Closure JS Compiler
 * optimizations. See updating-element.ts for more information.
 */
LitElement['finalized'] = true;
/**
 * Reference to the underlying library method used to render the element's
 * DOM. By default, points to the `render` method from lit-html's shady-render
 * module.
 *
 * **Most users will never need to touch this property.**
 *
 * This  property should not be confused with the `render` instance method,
 * which should be overridden to define a template for the element.
 *
 * Advanced users creating a new base class based on LitElement can override
 * this property to point to a custom render method with a signature that
 * matches [shady-render's `render`
 * method](https://lit-html.polymer-project.org/api/modules/shady_render.html#render).
 *
 * @nocollapse
 */
LitElement.render = render;
/** @nocollapse */
LitElement.shadowRootOptions = { mode: 'open' };

const CLEANUP_PARTS_MS = 1000 * 60;
const LANG_CHANGED_EVENT = "langChanged";

/**
 * Interpolates the values into the string.
 * @param text
 * @param values
 * @param config
 */
function interpolate(text, values, config) {
    return Object.entries(extract(values || {})).reduce((text, [key, value]) => text.replace(new RegExp(`{{[  ]*${key}[  ]*}}`, `gm`), String(extract(value))), text);
}
/**
 * Returns a string based on a chain of keys using the dot notation.
 * @param key
 * @param config
 */
function lookup(key, config) {
    // Split the key in parts (example: hello.world)
    const parts = key.split(".");
    // Find the string by traversing through the strings matching the chain of keys
    let string = config.strings;
    // Shift through all of the parts of the key while matching with the strings.
    // Do not continue if the string is not defined or if we have traversed all of the key parts
    while (string != null && parts.length > 0) {
        string = string[parts.shift()];
    }
    // Make sure the string is in fact a string!
    return string != null ? string.toString() : null;
}
/**
 * Extracts either the value from the function or returns the value that was passed in.
 * @param obj
 */
function extract(obj) {
    return (typeof obj === "function") ? obj() : obj;
}

/**
 * Default configuration object.
 */
const defaultTranslateConfig = () => {
    return {
        loader: () => Promise.resolve({}),
        empty: key => `[${key}]`,
        lookup: lookup,
        interpolate: interpolate,
        translationCache: {}
    };
};
// The current configuration.
let translateConfig = defaultTranslateConfig();
/**
 * Listens for changes in the language.
 * Returns a method for unsubscribing from the event.
 * @param callback
 * @param options
 */
function listenForLangChanged(callback, options) {
    const handler = (e) => callback(e.detail);
    window.addEventListener(LANG_CHANGED_EVENT, handler, options);
    return () => window.removeEventListener(LANG_CHANGED_EVENT, handler);
}
/**
 * Translates a key and interpolates if values are defined.
 * Uses the current strings and translation cache to fetch the translation.
 * @param key (eg. "common.get_started")
 * @param values (eg. { count: 42 })
 * @param config
 */
function get(key, values, config = translateConfig) {
    // Either use the translation from the cache or get it and add it to the cache
    let translation = config.translationCache[key]
        || (config.translationCache[key] = config.lookup(key, config) || config.empty(key, config));
    // Extract the values
    values = values != null ? extract(values) : null;
    // Interpolate the values and return the translation
    return values != null ? config.interpolate(translation, values, config) : translation;
}

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const directives = new WeakMap();
/**
 * Brands a function as a directive factory function so that lit-html will call
 * the function during template rendering, rather than passing as a value.
 *
 * A _directive_ is a function that takes a Part as an argument. It has the
 * signature: `(part: Part) => void`.
 *
 * A directive _factory_ is a function that takes arguments for data and
 * configuration and returns a directive. Users of directive usually refer to
 * the directive factory as the directive. For example, "The repeat directive".
 *
 * Usually a template author will invoke a directive factory in their template
 * with relevant arguments, which will then return a directive function.
 *
 * Here's an example of using the `repeat()` directive factory that takes an
 * array and a function to render an item:
 *
 * ```js
 * html`<ul><${repeat(items, (item) => html`<li>${item}</li>`)}</ul>`
 * ```
 *
 * When `repeat` is invoked, it returns a directive function that closes over
 * `items` and the template function. When the outer template is rendered, the
 * return directive function is called with the Part for the expression.
 * `repeat` then performs it's custom logic to render multiple items.
 *
 * @param f The directive factory function. Must be a function that returns a
 * function of the signature `(part: Part) => void`. The returned function will
 * be called with the part object.
 *
 * @example
 *
 * import {directive, html} from 'lit-html';
 *
 * const immutable = directive((v) => (part) => {
 *   if (part.value !== v) {
 *     part.setValue(v)
 *   }
 * });
 */
const directive$1 = (f) => ((...args) => {
    const d = f(...args);
    directives.set(d, true);
    return d;
});
const isDirective = (o) => {
    return typeof o === 'function' && directives.has(o);
};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * True if the custom elements polyfill is in use.
 */
const isCEPolyfill = typeof window !== 'undefined' &&
    window.customElements != null &&
    window.customElements.polyfillWrapFlushCallback !==
        undefined;
/**
 * Removes nodes, starting from `start` (inclusive) to `end` (exclusive), from
 * `container`.
 */
const removeNodes = (container, start, end = null) => {
    while (start !== end) {
        const n = start.nextSibling;
        container.removeChild(start);
        start = n;
    }
};

/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * A sentinel value that signals that a value was handled by a directive and
 * should not be written to the DOM.
 */
const noChange = {};
/**
 * A sentinel value that signals a NodePart to fully clear its content.
 */
const nothing = {};

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * An expression marker with embedded unique key to avoid collision with
 * possible text in templates.
 */
const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
/**
 * An expression marker used text-positions, multi-binding attributes, and
 * attributes with markup-like text values.
 */
const nodeMarker = `<!--${marker}-->`;
/**
 * Suffix appended to all bound attribute names.
 */
const boundAttributeSuffix = '$lit$';
const isTemplatePartActive = (part) => part.index !== -1;
// Allows `document.createComment('')` to be renamed for a
// small manual size-savings.
const createMarker = () => document.createComment('');
/**
 * This regex extracts the attribute name preceding an attribute-position
 * expression. It does this by matching the syntax allowed for attributes
 * against the string literal directly preceding the expression, assuming that
 * the expression is in an attribute-value position.
 *
 * See attributes in the HTML spec:
 * https://www.w3.org/TR/html5/syntax.html#elements-attributes
 *
 * " \x09\x0a\x0c\x0d" are HTML space characters:
 * https://www.w3.org/TR/html5/infrastructure.html#space-characters
 *
 * "\0-\x1F\x7F-\x9F" are Unicode control characters, which includes every
 * space character except " ".
 *
 * So an attribute is:
 *  * The name: any character except a control character, space character, ('),
 *    ("), ">", "=", or "/"
 *  * Followed by zero or more space characters
 *  * Followed by "="
 *  * Followed by zero or more space characters
 *  * Followed by:
 *    * Any character except space, ('), ("), "<", ">", "=", (`), or
 *    * (") then any non-("), or
 *    * (') then any non-(')
 */
const lastAttributeNameRegex = 
// eslint-disable-next-line no-control-regex
/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * An instance of a `Template` that can be attached to the DOM and updated
 * with new values.
 */
class TemplateInstance {
    constructor(template, processor, options) {
        this.__parts = [];
        this.template = template;
        this.processor = processor;
        this.options = options;
    }
    update(values) {
        let i = 0;
        for (const part of this.__parts) {
            if (part !== undefined) {
                part.setValue(values[i]);
            }
            i++;
        }
        for (const part of this.__parts) {
            if (part !== undefined) {
                part.commit();
            }
        }
    }
    _clone() {
        // There are a number of steps in the lifecycle of a template instance's
        // DOM fragment:
        //  1. Clone - create the instance fragment
        //  2. Adopt - adopt into the main document
        //  3. Process - find part markers and create parts
        //  4. Upgrade - upgrade custom elements
        //  5. Update - set node, attribute, property, etc., values
        //  6. Connect - connect to the document. Optional and outside of this
        //     method.
        //
        // We have a few constraints on the ordering of these steps:
        //  * We need to upgrade before updating, so that property values will pass
        //    through any property setters.
        //  * We would like to process before upgrading so that we're sure that the
        //    cloned fragment is inert and not disturbed by self-modifying DOM.
        //  * We want custom elements to upgrade even in disconnected fragments.
        //
        // Given these constraints, with full custom elements support we would
        // prefer the order: Clone, Process, Adopt, Upgrade, Update, Connect
        //
        // But Safari does not implement CustomElementRegistry#upgrade, so we
        // can not implement that order and still have upgrade-before-update and
        // upgrade disconnected fragments. So we instead sacrifice the
        // process-before-upgrade constraint, since in Custom Elements v1 elements
        // must not modify their light DOM in the constructor. We still have issues
        // when co-existing with CEv0 elements like Polymer 1, and with polyfills
        // that don't strictly adhere to the no-modification rule because shadow
        // DOM, which may be created in the constructor, is emulated by being placed
        // in the light DOM.
        //
        // The resulting order is on native is: Clone, Adopt, Upgrade, Process,
        // Update, Connect. document.importNode() performs Clone, Adopt, and Upgrade
        // in one step.
        //
        // The Custom Elements v1 polyfill supports upgrade(), so the order when
        // polyfilled is the more ideal: Clone, Process, Adopt, Upgrade, Update,
        // Connect.
        const fragment = isCEPolyfill ?
            this.template.element.content.cloneNode(true) :
            document.importNode(this.template.element.content, true);
        const stack = [];
        const parts = this.template.parts;
        // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
        const walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
        let partIndex = 0;
        let nodeIndex = 0;
        let part;
        let node = walker.nextNode();
        // Loop through all the nodes and parts of a template
        while (partIndex < parts.length) {
            part = parts[partIndex];
            if (!isTemplatePartActive(part)) {
                this.__parts.push(undefined);
                partIndex++;
                continue;
            }
            // Progress the tree walker until we find our next part's node.
            // Note that multiple parts may share the same node (attribute parts
            // on a single element), so this loop may not run at all.
            while (nodeIndex < part.index) {
                nodeIndex++;
                if (node.nodeName === 'TEMPLATE') {
                    stack.push(node);
                    walker.currentNode = node.content;
                }
                if ((node = walker.nextNode()) === null) {
                    // We've exhausted the content inside a nested template element.
                    // Because we still have parts (the outer for-loop), we know:
                    // - There is a template in the stack
                    // - The walker will find a nextNode outside the template
                    walker.currentNode = stack.pop();
                    node = walker.nextNode();
                }
            }
            // We've arrived at our part's node.
            if (part.type === 'node') {
                const part = this.processor.handleTextExpression(this.options);
                part.insertAfterNode(node.previousSibling);
                this.__parts.push(part);
            }
            else {
                this.__parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
            }
            partIndex++;
        }
        if (isCEPolyfill) {
            document.adoptNode(fragment);
            customElements.upgrade(fragment);
        }
        return fragment;
    }
}

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * Our TrustedTypePolicy for HTML which is declared using the html template
 * tag function.
 *
 * That HTML is a developer-authored constant, and is parsed with innerHTML
 * before any untrusted expressions have been mixed in. Therefor it is
 * considered safe by construction.
 */
const policy = window.trustedTypes &&
    trustedTypes.createPolicy('lit-html', { createHTML: (s) => s });
const commentMarker = ` ${marker} `;
/**
 * The return type of `html`, which holds a Template and the values from
 * interpolated expressions.
 */
class TemplateResult {
    constructor(strings, values, type, processor) {
        this.strings = strings;
        this.values = values;
        this.type = type;
        this.processor = processor;
    }
    /**
     * Returns a string of HTML used to create a `<template>` element.
     */
    getHTML() {
        const l = this.strings.length - 1;
        let html = '';
        let isCommentBinding = false;
        for (let i = 0; i < l; i++) {
            const s = this.strings[i];
            // For each binding we want to determine the kind of marker to insert
            // into the template source before it's parsed by the browser's HTML
            // parser. The marker type is based on whether the expression is in an
            // attribute, text, or comment position.
            //   * For node-position bindings we insert a comment with the marker
            //     sentinel as its text content, like <!--{{lit-guid}}-->.
            //   * For attribute bindings we insert just the marker sentinel for the
            //     first binding, so that we support unquoted attribute bindings.
            //     Subsequent bindings can use a comment marker because multi-binding
            //     attributes must be quoted.
            //   * For comment bindings we insert just the marker sentinel so we don't
            //     close the comment.
            //
            // The following code scans the template source, but is *not* an HTML
            // parser. We don't need to track the tree structure of the HTML, only
            // whether a binding is inside a comment, and if not, if it appears to be
            // the first binding in an attribute.
            const commentOpen = s.lastIndexOf('<!--');
            // We're in comment position if we have a comment open with no following
            // comment close. Because <-- can appear in an attribute value there can
            // be false positives.
            isCommentBinding = (commentOpen > -1 || isCommentBinding) &&
                s.indexOf('-->', commentOpen + 1) === -1;
            // Check to see if we have an attribute-like sequence preceding the
            // expression. This can match "name=value" like structures in text,
            // comments, and attribute values, so there can be false-positives.
            const attributeMatch = lastAttributeNameRegex.exec(s);
            if (attributeMatch === null) {
                // We're only in this branch if we don't have a attribute-like
                // preceding sequence. For comments, this guards against unusual
                // attribute values like <div foo="<!--${'bar'}">. Cases like
                // <!-- foo=${'bar'}--> are handled correctly in the attribute branch
                // below.
                html += s + (isCommentBinding ? commentMarker : nodeMarker);
            }
            else {
                // For attributes we use just a marker sentinel, and also append a
                // $lit$ suffix to the name to opt-out of attribute-specific parsing
                // that IE and Edge do for style and certain SVG attributes.
                html += s.substr(0, attributeMatch.index) + attributeMatch[1] +
                    attributeMatch[2] + boundAttributeSuffix + attributeMatch[3] +
                    marker;
            }
        }
        html += this.strings[l];
        return html;
    }
    getTemplateElement() {
        const template = document.createElement('template');
        let value = this.getHTML();
        if (policy !== undefined) {
            // this is secure because `this.strings` is a TemplateStringsArray.
            // TODO: validate this when
            // https://github.com/tc39/proposal-array-is-template-object is
            // implemented.
            value = policy.createHTML(value);
        }
        template.innerHTML = value;
        return template;
    }
}

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const isPrimitive = (value) => {
    return (value === null ||
        !(typeof value === 'object' || typeof value === 'function'));
};
const isIterable = (value) => {
    return Array.isArray(value) ||
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        !!(value && value[Symbol.iterator]);
};
/**
 * A Part that controls all or part of an attribute value.
 */
class AttributePart$1 {
    constructor(committer) {
        this.value = undefined;
        this.committer = committer;
    }
    setValue(value) {
        if (value !== noChange && (!isPrimitive(value) || value !== this.value)) {
            this.value = value;
            // If the value is a not a directive, dirty the committer so that it'll
            // call setAttribute. If the value is a directive, it'll dirty the
            // committer if it calls setValue().
            if (!isDirective(value)) {
                this.committer.dirty = true;
            }
        }
    }
    commit() {
        while (isDirective(this.value)) {
            const directive = this.value;
            this.value = noChange;
            directive(this);
        }
        if (this.value === noChange) {
            return;
        }
        this.committer.commit();
    }
}
/**
 * A Part that controls a location within a Node tree. Like a Range, NodePart
 * has start and end locations and can set and update the Nodes between those
 * locations.
 *
 * NodeParts support several value types: primitives, Nodes, TemplateResults,
 * as well as arrays and iterables of those types.
 */
class NodePart {
    constructor(options) {
        this.value = undefined;
        this.__pendingValue = undefined;
        this.options = options;
    }
    /**
     * Appends this part into a container.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    appendInto(container) {
        this.startNode = container.appendChild(createMarker());
        this.endNode = container.appendChild(createMarker());
    }
    /**
     * Inserts this part after the `ref` node (between `ref` and `ref`'s next
     * sibling). Both `ref` and its next sibling must be static, unchanging nodes
     * such as those that appear in a literal section of a template.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    insertAfterNode(ref) {
        this.startNode = ref;
        this.endNode = ref.nextSibling;
    }
    /**
     * Appends this part into a parent part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    appendIntoPart(part) {
        part.__insert(this.startNode = createMarker());
        part.__insert(this.endNode = createMarker());
    }
    /**
     * Inserts this part after the `ref` part.
     *
     * This part must be empty, as its contents are not automatically moved.
     */
    insertAfterPart(ref) {
        ref.__insert(this.startNode = createMarker());
        this.endNode = ref.endNode;
        ref.endNode = this.startNode;
    }
    setValue(value) {
        this.__pendingValue = value;
    }
    commit() {
        if (this.startNode.parentNode === null) {
            return;
        }
        while (isDirective(this.__pendingValue)) {
            const directive = this.__pendingValue;
            this.__pendingValue = noChange;
            directive(this);
        }
        const value = this.__pendingValue;
        if (value === noChange) {
            return;
        }
        if (isPrimitive(value)) {
            if (value !== this.value) {
                this.__commitText(value);
            }
        }
        else if (value instanceof TemplateResult) {
            this.__commitTemplateResult(value);
        }
        else if (value instanceof Node) {
            this.__commitNode(value);
        }
        else if (isIterable(value)) {
            this.__commitIterable(value);
        }
        else if (value === nothing) {
            this.value = nothing;
            this.clear();
        }
        else {
            // Fallback, will render the string representation
            this.__commitText(value);
        }
    }
    __insert(node) {
        this.endNode.parentNode.insertBefore(node, this.endNode);
    }
    __commitNode(value) {
        if (this.value === value) {
            return;
        }
        this.clear();
        this.__insert(value);
        this.value = value;
    }
    __commitText(value) {
        const node = this.startNode.nextSibling;
        value = value == null ? '' : value;
        // If `value` isn't already a string, we explicitly convert it here in case
        // it can't be implicitly converted - i.e. it's a symbol.
        const valueAsString = typeof value === 'string' ? value : String(value);
        if (node === this.endNode.previousSibling &&
            node.nodeType === 3 /* Node.TEXT_NODE */) {
            // If we only have a single text node between the markers, we can just
            // set its value, rather than replacing it.
            // TODO(justinfagnani): Can we just check if this.value is primitive?
            node.data = valueAsString;
        }
        else {
            this.__commitNode(document.createTextNode(valueAsString));
        }
        this.value = value;
    }
    __commitTemplateResult(value) {
        const template = this.options.templateFactory(value);
        if (this.value instanceof TemplateInstance &&
            this.value.template === template) {
            this.value.update(value.values);
        }
        else {
            // Make sure we propagate the template processor from the TemplateResult
            // so that we use its syntax extension, etc. The template factory comes
            // from the render function options so that it can control template
            // caching and preprocessing.
            const instance = new TemplateInstance(template, value.processor, this.options);
            const fragment = instance._clone();
            instance.update(value.values);
            this.__commitNode(fragment);
            this.value = instance;
        }
    }
    __commitIterable(value) {
        // For an Iterable, we create a new InstancePart per item, then set its
        // value to the item. This is a little bit of overhead for every item in
        // an Iterable, but it lets us recurse easily and efficiently update Arrays
        // of TemplateResults that will be commonly returned from expressions like:
        // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
        // If _value is an array, then the previous render was of an
        // iterable and _value will contain the NodeParts from the previous
        // render. If _value is not an array, clear this part and make a new
        // array for NodeParts.
        if (!Array.isArray(this.value)) {
            this.value = [];
            this.clear();
        }
        // Lets us keep track of how many items we stamped so we can clear leftover
        // items from a previous render
        const itemParts = this.value;
        let partIndex = 0;
        let itemPart;
        for (const item of value) {
            // Try to reuse an existing part
            itemPart = itemParts[partIndex];
            // If no existing part, create a new one
            if (itemPart === undefined) {
                itemPart = new NodePart(this.options);
                itemParts.push(itemPart);
                if (partIndex === 0) {
                    itemPart.appendIntoPart(this);
                }
                else {
                    itemPart.insertAfterPart(itemParts[partIndex - 1]);
                }
            }
            itemPart.setValue(item);
            itemPart.commit();
            partIndex++;
        }
        if (partIndex < itemParts.length) {
            // Truncate the parts array so _value reflects the current state
            itemParts.length = partIndex;
            this.clear(itemPart && itemPart.endNode);
        }
    }
    clear(startNode = this.startNode) {
        removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
    }
}
// Detect event listener options support. If the `capture` property is read
// from the options object, then options are supported. If not, then the third
// argument to add/removeEventListener is interpreted as the boolean capture
// value so we should only pass the `capture` property.
let eventOptionsSupported = false;
// Wrap into an IIFE because MS Edge <= v41 does not support having try/catch
// blocks right into the body of a module
(() => {
    try {
        const options = {
            get capture() {
                eventOptionsSupported = true;
                return false;
            }
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.addEventListener('test', options, options);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        window.removeEventListener('test', options, options);
    }
    catch (_e) {
        // event options not supported
    }
})();

/**
 * @license
 * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// IMPORTANT: do not change the property name or the assignment expression.
// This line will be used in regexes to search for lit-html usage.
// TODO(justinfagnani): inject version number at build time
if (typeof window !== 'undefined') {
    (window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.4.1');
}

/** #################################################################################
 ** The purpose of this module is to provide an API to clean up the node parts cache.
 ** This is to avoid memory leaks from parts being added and removed to the template.
 ** This is necessary since lit-html currently do not provide a way of cleaning up after a directive.
 ** In the ideal world we would be able to cache the parts in a weakmap, however that makes
 ** us unable to loop over the map which is required for updating the translations when the lang changes.
 ** This module will be obsolete the day lit-html provides a way of cleaning up after a directive
 ** ##################################################################################

/**
 * Check whether the part is still connected / has been removed from the DOM.
 * @param part
 */
function isConnected(part) {
    if (part instanceof NodePart) {
        return part.startNode.isConnected;
    }
    else if (part instanceof AttributePart$1) {
        return part.committer.element.isConnected;
    }
    else {
        return part.element.isConnected;
    }
}
/**
 * Removes the disconnected parts from the cache.
 */
function removeDisconnectedParts(map) {
    for (const [part] of map) {
        if (!isConnected(part)) {
            map.delete(part);
        }
    }
}
/**
 * Invokes a callback when the browser is idle.
 * Fallback to setTimeout.
 * @param cb
 */
function whenIdle(cb) {
    "requestIdleCallback" in window ? window.requestIdleCallback(cb) : setTimeout(cb);
}
/**
 * Starts an interval that cleans up the part cache map each X ms.
 * @param map
 * @param ms
 */
function attachPartsGarbageCollector(map, ms) {
    setInterval(() => whenIdle(() => removeDisconnectedParts(map)), ms);
}

// Caches the parts and the translations.
// In the ideal world this would be a weakmap, but it is not possible to loop over weakmaps.
// This is the best solution until lit-html provides an API to clean up after directives.
const partCache = new Map();
/**
 * Listens for changes in the language and updates all of the cached parts if necessary
 */
function attachTranslateListener() {
    listenForLangChanged((e) => {
        for (const [part, cb] of partCache) {
            if (isConnected(part)) {
                updatePart(part, cb, e);
            }
        }
    });
}
attachTranslateListener();
attachPartsGarbageCollector(partCache, CLEANUP_PARTS_MS);
/**
 * Handles the translation.
 * @param part
 * @param cb
 * @param e
 */
function updatePart(part, cb, e) {
    // Grab the new value
    const newValue = cb(e);
    // Only set the value if it has changed
    if (part.value === newValue) {
        return;
    }
    // Set the new value
    part.setValue(newValue);
    part.commit();
}
/**
 * A lit directive that invokes the callback when the language changes.
 * @param key
 * @param values
 * @param listen
 */
const langChanged = directive$1((cb) => (part) => {
    partCache.set(part, cb);
    updatePart(part, cb);
});

/**
 * A lit directive that updates the translation when the language changes.
 * @param key
 * @param values
 * @param config
 */
const translate = (key, values, config) => langChanged(() => get(key, values, config));

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
function matches(element, selector) {
    var nativeMatches = element.matches
        || element.webkitMatchesSelector
        || element.msMatchesSelector;
    return nativeMatches.call(element, selector);
}

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Determines whether a node is an element.
 *
 * @param node Node to check
 */
const isNodeElement = (node) => {
    return node.nodeType === Node.ELEMENT_NODE;
};
function addHasRemoveClass(element) {
    return {
        addClass: (className) => {
            element.classList.add(className);
        },
        removeClass: (className) => {
            element.classList.remove(className);
        },
        hasClass: (className) => element.classList.contains(className),
    };
}
const fn = () => { };
const optionsBlock = {
    get passive() {
        return false;
    }
};
document.addEventListener('x', fn, optionsBlock);
document.removeEventListener('x', fn);
const deepActiveElementPath = (doc = window.document) => {
    let activeElement = doc.activeElement;
    const path = [];
    if (!activeElement) {
        return path;
    }
    while (activeElement) {
        path.push(activeElement);
        if (activeElement.shadowRoot) {
            activeElement = activeElement.shadowRoot.activeElement;
        }
        else {
            break;
        }
    }
    return path;
};
const doesElementContainFocus = (element) => {
    const activePath = deepActiveElementPath();
    if (!activePath.length) {
        return false;
    }
    const deepActiveElement = activePath[activePath.length - 1];
    const focusEv = new Event('check-if-focused', { bubbles: true, composed: true });
    let composedPath = [];
    const listener = (ev) => {
        composedPath = ev.composedPath();
    };
    document.body.addEventListener('check-if-focused', listener);
    deepActiveElement.dispatchEvent(focusEv);
    document.body.removeEventListener('check-if-focused', listener);
    return composedPath.indexOf(element) !== -1;
};

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/** @soyCompatible */
class BaseElement extends LitElement {
    click() {
        if (this.mdcRoot) {
            this.mdcRoot.focus();
            this.mdcRoot.click();
            return;
        }
        super.click();
    }
    /**
     * Create and attach the MDC Foundation to the instance
     */
    createFoundation() {
        if (this.mdcFoundation !== undefined) {
            this.mdcFoundation.destroy();
        }
        if (this.mdcFoundationClass) {
            this.mdcFoundation = new this.mdcFoundationClass(this.createAdapter());
            this.mdcFoundation.init();
        }
    }
    firstUpdated() {
        this.createFoundation();
    }
}

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCFoundation = /** @class */ (function () {
    function MDCFoundation(adapter) {
        if (adapter === void 0) { adapter = {}; }
        this.adapter = adapter;
    }
    Object.defineProperty(MDCFoundation, "cssClasses", {
        get: function () {
            // Classes extending MDCFoundation should implement this method to return an object which exports every
            // CSS class the foundation class needs as a property. e.g. {ACTIVE: 'mdc-component--active'}
            return {};
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCFoundation, "strings", {
        get: function () {
            // Classes extending MDCFoundation should implement this method to return an object which exports all
            // semantic strings as constants. e.g. {ARIA_ROLE: 'tablist'}
            return {};
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCFoundation, "numbers", {
        get: function () {
            // Classes extending MDCFoundation should implement this method to return an object which exports all
            // of its semantic numbers as constants. e.g. {ANIMATION_DELAY_MS: 350}
            return {};
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCFoundation, "defaultAdapter", {
        get: function () {
            // Classes extending MDCFoundation may choose to implement this getter in order to provide a convenient
            // way of viewing the necessary methods of an adapter. In the future, this could also be used for adapter
            // validation.
            return {};
        },
        enumerable: false,
        configurable: true
    });
    MDCFoundation.prototype.init = function () {
        // Subclasses should override this method to perform initialization routines (registering events, etc.)
    };
    MDCFoundation.prototype.destroy = function () {
        // Subclasses should override this method to perform de-initialization routines (de-registering events, etc.)
    };
    return MDCFoundation;
}());

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var cssClasses$6 = {
    // Ripple is a special case where the "root" component is really a "mixin" of sorts,
    // given that it's an 'upgrade' to an existing component. That being said it is the root
    // CSS class that all other CSS classes derive from.
    BG_FOCUSED: 'mdc-ripple-upgraded--background-focused',
    FG_ACTIVATION: 'mdc-ripple-upgraded--foreground-activation',
    FG_DEACTIVATION: 'mdc-ripple-upgraded--foreground-deactivation',
    ROOT: 'mdc-ripple-upgraded',
    UNBOUNDED: 'mdc-ripple-upgraded--unbounded',
};
var strings$4 = {
    VAR_FG_SCALE: '--mdc-ripple-fg-scale',
    VAR_FG_SIZE: '--mdc-ripple-fg-size',
    VAR_FG_TRANSLATE_END: '--mdc-ripple-fg-translate-end',
    VAR_FG_TRANSLATE_START: '--mdc-ripple-fg-translate-start',
    VAR_LEFT: '--mdc-ripple-left',
    VAR_TOP: '--mdc-ripple-top',
};
var numbers$3 = {
    DEACTIVATION_TIMEOUT_MS: 225,
    FG_DEACTIVATION_MS: 150,
    INITIAL_ORIGIN_SCALE: 0.6,
    PADDING: 10,
    TAP_DELAY_MS: 300, // Delay between touch and simulated mouse events on touch devices
};

/**
 * Stores result from supportsCssVariables to avoid redundant processing to
 * detect CSS custom variable support.
 */
function getNormalizedEventCoords(evt, pageOffset, clientRect) {
    if (!evt) {
        return { x: 0, y: 0 };
    }
    var x = pageOffset.x, y = pageOffset.y;
    var documentX = x + clientRect.left;
    var documentY = y + clientRect.top;
    var normalizedX;
    var normalizedY;
    // Determine touch point relative to the ripple container.
    if (evt.type === 'touchstart') {
        var touchEvent = evt;
        normalizedX = touchEvent.changedTouches[0].pageX - documentX;
        normalizedY = touchEvent.changedTouches[0].pageY - documentY;
    }
    else {
        var mouseEvent = evt;
        normalizedX = mouseEvent.pageX - documentX;
        normalizedY = mouseEvent.pageY - documentY;
    }
    return { x: normalizedX, y: normalizedY };
}

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
// Activation events registered on the root element of each instance for activation
var ACTIVATION_EVENT_TYPES = [
    'touchstart', 'pointerdown', 'mousedown', 'keydown',
];
// Deactivation events registered on documentElement when a pointer-related down event occurs
var POINTER_DEACTIVATION_EVENT_TYPES = [
    'touchend', 'pointerup', 'mouseup', 'contextmenu',
];
// simultaneous nested activations
var activatedTargets = [];
var MDCRippleFoundation = /** @class */ (function (_super) {
    __extends(MDCRippleFoundation, _super);
    function MDCRippleFoundation(adapter) {
        var _this = _super.call(this, __assign(__assign({}, MDCRippleFoundation.defaultAdapter), adapter)) || this;
        _this.activationAnimationHasEnded = false;
        _this.activationTimer = 0;
        _this.fgDeactivationRemovalTimer = 0;
        _this.fgScale = '0';
        _this.frame = { width: 0, height: 0 };
        _this.initialSize = 0;
        _this.layoutFrame = 0;
        _this.maxRadius = 0;
        _this.unboundedCoords = { left: 0, top: 0 };
        _this.activationState = _this.defaultActivationState();
        _this.activationTimerCallback = function () {
            _this.activationAnimationHasEnded = true;
            _this.runDeactivationUXLogicIfReady();
        };
        _this.activateHandler = function (e) {
            _this.activateImpl(e);
        };
        _this.deactivateHandler = function () {
            _this.deactivateImpl();
        };
        _this.focusHandler = function () {
            _this.handleFocus();
        };
        _this.blurHandler = function () {
            _this.handleBlur();
        };
        _this.resizeHandler = function () {
            _this.layout();
        };
        return _this;
    }
    Object.defineProperty(MDCRippleFoundation, "cssClasses", {
        get: function () {
            return cssClasses$6;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCRippleFoundation, "strings", {
        get: function () {
            return strings$4;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCRippleFoundation, "numbers", {
        get: function () {
            return numbers$3;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCRippleFoundation, "defaultAdapter", {
        get: function () {
            return {
                addClass: function () { return undefined; },
                browserSupportsCssVars: function () { return true; },
                computeBoundingRect: function () { return ({ top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0 }); },
                containsEventTarget: function () { return true; },
                deregisterDocumentInteractionHandler: function () { return undefined; },
                deregisterInteractionHandler: function () { return undefined; },
                deregisterResizeHandler: function () { return undefined; },
                getWindowPageOffset: function () { return ({ x: 0, y: 0 }); },
                isSurfaceActive: function () { return true; },
                isSurfaceDisabled: function () { return true; },
                isUnbounded: function () { return true; },
                registerDocumentInteractionHandler: function () { return undefined; },
                registerInteractionHandler: function () { return undefined; },
                registerResizeHandler: function () { return undefined; },
                removeClass: function () { return undefined; },
                updateCssVariable: function () { return undefined; },
            };
        },
        enumerable: false,
        configurable: true
    });
    MDCRippleFoundation.prototype.init = function () {
        var _this = this;
        var supportsPressRipple = this.supportsPressRipple();
        this.registerRootHandlers(supportsPressRipple);
        if (supportsPressRipple) {
            var _a = MDCRippleFoundation.cssClasses, ROOT_1 = _a.ROOT, UNBOUNDED_1 = _a.UNBOUNDED;
            requestAnimationFrame(function () {
                _this.adapter.addClass(ROOT_1);
                if (_this.adapter.isUnbounded()) {
                    _this.adapter.addClass(UNBOUNDED_1);
                    // Unbounded ripples need layout logic applied immediately to set coordinates for both shade and ripple
                    _this.layoutInternal();
                }
            });
        }
    };
    MDCRippleFoundation.prototype.destroy = function () {
        var _this = this;
        if (this.supportsPressRipple()) {
            if (this.activationTimer) {
                clearTimeout(this.activationTimer);
                this.activationTimer = 0;
                this.adapter.removeClass(MDCRippleFoundation.cssClasses.FG_ACTIVATION);
            }
            if (this.fgDeactivationRemovalTimer) {
                clearTimeout(this.fgDeactivationRemovalTimer);
                this.fgDeactivationRemovalTimer = 0;
                this.adapter.removeClass(MDCRippleFoundation.cssClasses.FG_DEACTIVATION);
            }
            var _a = MDCRippleFoundation.cssClasses, ROOT_2 = _a.ROOT, UNBOUNDED_2 = _a.UNBOUNDED;
            requestAnimationFrame(function () {
                _this.adapter.removeClass(ROOT_2);
                _this.adapter.removeClass(UNBOUNDED_2);
                _this.removeCssVars();
            });
        }
        this.deregisterRootHandlers();
        this.deregisterDeactivationHandlers();
    };
    /**
     * @param evt Optional event containing position information.
     */
    MDCRippleFoundation.prototype.activate = function (evt) {
        this.activateImpl(evt);
    };
    MDCRippleFoundation.prototype.deactivate = function () {
        this.deactivateImpl();
    };
    MDCRippleFoundation.prototype.layout = function () {
        var _this = this;
        if (this.layoutFrame) {
            cancelAnimationFrame(this.layoutFrame);
        }
        this.layoutFrame = requestAnimationFrame(function () {
            _this.layoutInternal();
            _this.layoutFrame = 0;
        });
    };
    MDCRippleFoundation.prototype.setUnbounded = function (unbounded) {
        var UNBOUNDED = MDCRippleFoundation.cssClasses.UNBOUNDED;
        if (unbounded) {
            this.adapter.addClass(UNBOUNDED);
        }
        else {
            this.adapter.removeClass(UNBOUNDED);
        }
    };
    MDCRippleFoundation.prototype.handleFocus = function () {
        var _this = this;
        requestAnimationFrame(function () { return _this.adapter.addClass(MDCRippleFoundation.cssClasses.BG_FOCUSED); });
    };
    MDCRippleFoundation.prototype.handleBlur = function () {
        var _this = this;
        requestAnimationFrame(function () { return _this.adapter.removeClass(MDCRippleFoundation.cssClasses.BG_FOCUSED); });
    };
    /**
     * We compute this property so that we are not querying information about the client
     * until the point in time where the foundation requests it. This prevents scenarios where
     * client-side feature-detection may happen too early, such as when components are rendered on the server
     * and then initialized at mount time on the client.
     */
    MDCRippleFoundation.prototype.supportsPressRipple = function () {
        return this.adapter.browserSupportsCssVars();
    };
    MDCRippleFoundation.prototype.defaultActivationState = function () {
        return {
            activationEvent: undefined,
            hasDeactivationUXRun: false,
            isActivated: false,
            isProgrammatic: false,
            wasActivatedByPointer: false,
            wasElementMadeActive: false,
        };
    };
    /**
     * supportsPressRipple Passed from init to save a redundant function call
     */
    MDCRippleFoundation.prototype.registerRootHandlers = function (supportsPressRipple) {
        var e_1, _a;
        if (supportsPressRipple) {
            try {
                for (var ACTIVATION_EVENT_TYPES_1 = __values(ACTIVATION_EVENT_TYPES), ACTIVATION_EVENT_TYPES_1_1 = ACTIVATION_EVENT_TYPES_1.next(); !ACTIVATION_EVENT_TYPES_1_1.done; ACTIVATION_EVENT_TYPES_1_1 = ACTIVATION_EVENT_TYPES_1.next()) {
                    var evtType = ACTIVATION_EVENT_TYPES_1_1.value;
                    this.adapter.registerInteractionHandler(evtType, this.activateHandler);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (ACTIVATION_EVENT_TYPES_1_1 && !ACTIVATION_EVENT_TYPES_1_1.done && (_a = ACTIVATION_EVENT_TYPES_1.return)) _a.call(ACTIVATION_EVENT_TYPES_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (this.adapter.isUnbounded()) {
                this.adapter.registerResizeHandler(this.resizeHandler);
            }
        }
        this.adapter.registerInteractionHandler('focus', this.focusHandler);
        this.adapter.registerInteractionHandler('blur', this.blurHandler);
    };
    MDCRippleFoundation.prototype.registerDeactivationHandlers = function (evt) {
        var e_2, _a;
        if (evt.type === 'keydown') {
            this.adapter.registerInteractionHandler('keyup', this.deactivateHandler);
        }
        else {
            try {
                for (var POINTER_DEACTIVATION_EVENT_TYPES_1 = __values(POINTER_DEACTIVATION_EVENT_TYPES), POINTER_DEACTIVATION_EVENT_TYPES_1_1 = POINTER_DEACTIVATION_EVENT_TYPES_1.next(); !POINTER_DEACTIVATION_EVENT_TYPES_1_1.done; POINTER_DEACTIVATION_EVENT_TYPES_1_1 = POINTER_DEACTIVATION_EVENT_TYPES_1.next()) {
                    var evtType = POINTER_DEACTIVATION_EVENT_TYPES_1_1.value;
                    this.adapter.registerDocumentInteractionHandler(evtType, this.deactivateHandler);
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (POINTER_DEACTIVATION_EVENT_TYPES_1_1 && !POINTER_DEACTIVATION_EVENT_TYPES_1_1.done && (_a = POINTER_DEACTIVATION_EVENT_TYPES_1.return)) _a.call(POINTER_DEACTIVATION_EVENT_TYPES_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    };
    MDCRippleFoundation.prototype.deregisterRootHandlers = function () {
        var e_3, _a;
        try {
            for (var ACTIVATION_EVENT_TYPES_2 = __values(ACTIVATION_EVENT_TYPES), ACTIVATION_EVENT_TYPES_2_1 = ACTIVATION_EVENT_TYPES_2.next(); !ACTIVATION_EVENT_TYPES_2_1.done; ACTIVATION_EVENT_TYPES_2_1 = ACTIVATION_EVENT_TYPES_2.next()) {
                var evtType = ACTIVATION_EVENT_TYPES_2_1.value;
                this.adapter.deregisterInteractionHandler(evtType, this.activateHandler);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (ACTIVATION_EVENT_TYPES_2_1 && !ACTIVATION_EVENT_TYPES_2_1.done && (_a = ACTIVATION_EVENT_TYPES_2.return)) _a.call(ACTIVATION_EVENT_TYPES_2);
            }
            finally { if (e_3) throw e_3.error; }
        }
        this.adapter.deregisterInteractionHandler('focus', this.focusHandler);
        this.adapter.deregisterInteractionHandler('blur', this.blurHandler);
        if (this.adapter.isUnbounded()) {
            this.adapter.deregisterResizeHandler(this.resizeHandler);
        }
    };
    MDCRippleFoundation.prototype.deregisterDeactivationHandlers = function () {
        var e_4, _a;
        this.adapter.deregisterInteractionHandler('keyup', this.deactivateHandler);
        try {
            for (var POINTER_DEACTIVATION_EVENT_TYPES_2 = __values(POINTER_DEACTIVATION_EVENT_TYPES), POINTER_DEACTIVATION_EVENT_TYPES_2_1 = POINTER_DEACTIVATION_EVENT_TYPES_2.next(); !POINTER_DEACTIVATION_EVENT_TYPES_2_1.done; POINTER_DEACTIVATION_EVENT_TYPES_2_1 = POINTER_DEACTIVATION_EVENT_TYPES_2.next()) {
                var evtType = POINTER_DEACTIVATION_EVENT_TYPES_2_1.value;
                this.adapter.deregisterDocumentInteractionHandler(evtType, this.deactivateHandler);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (POINTER_DEACTIVATION_EVENT_TYPES_2_1 && !POINTER_DEACTIVATION_EVENT_TYPES_2_1.done && (_a = POINTER_DEACTIVATION_EVENT_TYPES_2.return)) _a.call(POINTER_DEACTIVATION_EVENT_TYPES_2);
            }
            finally { if (e_4) throw e_4.error; }
        }
    };
    MDCRippleFoundation.prototype.removeCssVars = function () {
        var _this = this;
        var rippleStrings = MDCRippleFoundation.strings;
        var keys = Object.keys(rippleStrings);
        keys.forEach(function (key) {
            if (key.indexOf('VAR_') === 0) {
                _this.adapter.updateCssVariable(rippleStrings[key], null);
            }
        });
    };
    MDCRippleFoundation.prototype.activateImpl = function (evt) {
        var _this = this;
        if (this.adapter.isSurfaceDisabled()) {
            return;
        }
        var activationState = this.activationState;
        if (activationState.isActivated) {
            return;
        }
        // Avoid reacting to follow-on events fired by touch device after an already-processed user interaction
        var previousActivationEvent = this.previousActivationEvent;
        var isSameInteraction = previousActivationEvent && evt !== undefined && previousActivationEvent.type !== evt.type;
        if (isSameInteraction) {
            return;
        }
        activationState.isActivated = true;
        activationState.isProgrammatic = evt === undefined;
        activationState.activationEvent = evt;
        activationState.wasActivatedByPointer = activationState.isProgrammatic ? false : evt !== undefined && (evt.type === 'mousedown' || evt.type === 'touchstart' || evt.type === 'pointerdown');
        var hasActivatedChild = evt !== undefined &&
            activatedTargets.length > 0 &&
            activatedTargets.some(function (target) { return _this.adapter.containsEventTarget(target); });
        if (hasActivatedChild) {
            // Immediately reset activation state, while preserving logic that prevents touch follow-on events
            this.resetActivationState();
            return;
        }
        if (evt !== undefined) {
            activatedTargets.push(evt.target);
            this.registerDeactivationHandlers(evt);
        }
        activationState.wasElementMadeActive = this.checkElementMadeActive(evt);
        if (activationState.wasElementMadeActive) {
            this.animateActivation();
        }
        requestAnimationFrame(function () {
            // Reset array on next frame after the current event has had a chance to bubble to prevent ancestor ripples
            activatedTargets = [];
            if (!activationState.wasElementMadeActive
                && evt !== undefined
                && (evt.key === ' ' || evt.keyCode === 32)) {
                // If space was pressed, try again within an rAF call to detect :active, because different UAs report
                // active states inconsistently when they're called within event handling code:
                // - https://bugs.chromium.org/p/chromium/issues/detail?id=635971
                // - https://bugzilla.mozilla.org/show_bug.cgi?id=1293741
                // We try first outside rAF to support Edge, which does not exhibit this problem, but will crash if a CSS
                // variable is set within a rAF callback for a submit button interaction (#2241).
                activationState.wasElementMadeActive = _this.checkElementMadeActive(evt);
                if (activationState.wasElementMadeActive) {
                    _this.animateActivation();
                }
            }
            if (!activationState.wasElementMadeActive) {
                // Reset activation state immediately if element was not made active.
                _this.activationState = _this.defaultActivationState();
            }
        });
    };
    MDCRippleFoundation.prototype.checkElementMadeActive = function (evt) {
        return (evt !== undefined && evt.type === 'keydown') ?
            this.adapter.isSurfaceActive() :
            true;
    };
    MDCRippleFoundation.prototype.animateActivation = function () {
        var _this = this;
        var _a = MDCRippleFoundation.strings, VAR_FG_TRANSLATE_START = _a.VAR_FG_TRANSLATE_START, VAR_FG_TRANSLATE_END = _a.VAR_FG_TRANSLATE_END;
        var _b = MDCRippleFoundation.cssClasses, FG_DEACTIVATION = _b.FG_DEACTIVATION, FG_ACTIVATION = _b.FG_ACTIVATION;
        var DEACTIVATION_TIMEOUT_MS = MDCRippleFoundation.numbers.DEACTIVATION_TIMEOUT_MS;
        this.layoutInternal();
        var translateStart = '';
        var translateEnd = '';
        if (!this.adapter.isUnbounded()) {
            var _c = this.getFgTranslationCoordinates(), startPoint = _c.startPoint, endPoint = _c.endPoint;
            translateStart = startPoint.x + "px, " + startPoint.y + "px";
            translateEnd = endPoint.x + "px, " + endPoint.y + "px";
        }
        this.adapter.updateCssVariable(VAR_FG_TRANSLATE_START, translateStart);
        this.adapter.updateCssVariable(VAR_FG_TRANSLATE_END, translateEnd);
        // Cancel any ongoing activation/deactivation animations
        clearTimeout(this.activationTimer);
        clearTimeout(this.fgDeactivationRemovalTimer);
        this.rmBoundedActivationClasses();
        this.adapter.removeClass(FG_DEACTIVATION);
        // Force layout in order to re-trigger the animation.
        this.adapter.computeBoundingRect();
        this.adapter.addClass(FG_ACTIVATION);
        this.activationTimer = setTimeout(function () {
            _this.activationTimerCallback();
        }, DEACTIVATION_TIMEOUT_MS);
    };
    MDCRippleFoundation.prototype.getFgTranslationCoordinates = function () {
        var _a = this.activationState, activationEvent = _a.activationEvent, wasActivatedByPointer = _a.wasActivatedByPointer;
        var startPoint;
        if (wasActivatedByPointer) {
            startPoint = getNormalizedEventCoords(activationEvent, this.adapter.getWindowPageOffset(), this.adapter.computeBoundingRect());
        }
        else {
            startPoint = {
                x: this.frame.width / 2,
                y: this.frame.height / 2,
            };
        }
        // Center the element around the start point.
        startPoint = {
            x: startPoint.x - (this.initialSize / 2),
            y: startPoint.y - (this.initialSize / 2),
        };
        var endPoint = {
            x: (this.frame.width / 2) - (this.initialSize / 2),
            y: (this.frame.height / 2) - (this.initialSize / 2),
        };
        return { startPoint: startPoint, endPoint: endPoint };
    };
    MDCRippleFoundation.prototype.runDeactivationUXLogicIfReady = function () {
        var _this = this;
        // This method is called both when a pointing device is released, and when the activation animation ends.
        // The deactivation animation should only run after both of those occur.
        var FG_DEACTIVATION = MDCRippleFoundation.cssClasses.FG_DEACTIVATION;
        var _a = this.activationState, hasDeactivationUXRun = _a.hasDeactivationUXRun, isActivated = _a.isActivated;
        var activationHasEnded = hasDeactivationUXRun || !isActivated;
        if (activationHasEnded && this.activationAnimationHasEnded) {
            this.rmBoundedActivationClasses();
            this.adapter.addClass(FG_DEACTIVATION);
            this.fgDeactivationRemovalTimer = setTimeout(function () {
                _this.adapter.removeClass(FG_DEACTIVATION);
            }, numbers$3.FG_DEACTIVATION_MS);
        }
    };
    MDCRippleFoundation.prototype.rmBoundedActivationClasses = function () {
        var FG_ACTIVATION = MDCRippleFoundation.cssClasses.FG_ACTIVATION;
        this.adapter.removeClass(FG_ACTIVATION);
        this.activationAnimationHasEnded = false;
        this.adapter.computeBoundingRect();
    };
    MDCRippleFoundation.prototype.resetActivationState = function () {
        var _this = this;
        this.previousActivationEvent = this.activationState.activationEvent;
        this.activationState = this.defaultActivationState();
        // Touch devices may fire additional events for the same interaction within a short time.
        // Store the previous event until it's safe to assume that subsequent events are for new interactions.
        setTimeout(function () { return _this.previousActivationEvent = undefined; }, MDCRippleFoundation.numbers.TAP_DELAY_MS);
    };
    MDCRippleFoundation.prototype.deactivateImpl = function () {
        var _this = this;
        var activationState = this.activationState;
        // This can happen in scenarios such as when you have a keyup event that blurs the element.
        if (!activationState.isActivated) {
            return;
        }
        var state = __assign({}, activationState);
        if (activationState.isProgrammatic) {
            requestAnimationFrame(function () {
                _this.animateDeactivation(state);
            });
            this.resetActivationState();
        }
        else {
            this.deregisterDeactivationHandlers();
            requestAnimationFrame(function () {
                _this.activationState.hasDeactivationUXRun = true;
                _this.animateDeactivation(state);
                _this.resetActivationState();
            });
        }
    };
    MDCRippleFoundation.prototype.animateDeactivation = function (_a) {
        var wasActivatedByPointer = _a.wasActivatedByPointer, wasElementMadeActive = _a.wasElementMadeActive;
        if (wasActivatedByPointer || wasElementMadeActive) {
            this.runDeactivationUXLogicIfReady();
        }
    };
    MDCRippleFoundation.prototype.layoutInternal = function () {
        var _this = this;
        this.frame = this.adapter.computeBoundingRect();
        var maxDim = Math.max(this.frame.height, this.frame.width);
        // Surface diameter is treated differently for unbounded vs. bounded ripples.
        // Unbounded ripple diameter is calculated smaller since the surface is expected to already be padded appropriately
        // to extend the hitbox, and the ripple is expected to meet the edges of the padded hitbox (which is typically
        // square). Bounded ripples, on the other hand, are fully expected to expand beyond the surface's longest diameter
        // (calculated based on the diagonal plus a constant padding), and are clipped at the surface's border via
        // `overflow: hidden`.
        var getBoundedRadius = function () {
            var hypotenuse = Math.sqrt(Math.pow(_this.frame.width, 2) + Math.pow(_this.frame.height, 2));
            return hypotenuse + MDCRippleFoundation.numbers.PADDING;
        };
        this.maxRadius = this.adapter.isUnbounded() ? maxDim : getBoundedRadius();
        // Ripple is sized as a fraction of the largest dimension of the surface, then scales up using a CSS scale transform
        var initialSize = Math.floor(maxDim * MDCRippleFoundation.numbers.INITIAL_ORIGIN_SCALE);
        // Unbounded ripple size should always be even number to equally center align.
        if (this.adapter.isUnbounded() && initialSize % 2 !== 0) {
            this.initialSize = initialSize - 1;
        }
        else {
            this.initialSize = initialSize;
        }
        this.fgScale = "" + this.maxRadius / this.initialSize;
        this.updateLayoutCssVars();
    };
    MDCRippleFoundation.prototype.updateLayoutCssVars = function () {
        var _a = MDCRippleFoundation.strings, VAR_FG_SIZE = _a.VAR_FG_SIZE, VAR_LEFT = _a.VAR_LEFT, VAR_TOP = _a.VAR_TOP, VAR_FG_SCALE = _a.VAR_FG_SCALE;
        this.adapter.updateCssVariable(VAR_FG_SIZE, this.initialSize + "px");
        this.adapter.updateCssVariable(VAR_FG_SCALE, this.fgScale);
        if (this.adapter.isUnbounded()) {
            this.unboundedCoords = {
                left: Math.round((this.frame.width / 2) - (this.initialSize / 2)),
                top: Math.round((this.frame.height / 2) - (this.initialSize / 2)),
            };
            this.adapter.updateCssVariable(VAR_LEFT, this.unboundedCoords.left + "px");
            this.adapter.updateCssVariable(VAR_TOP, this.unboundedCoords.top + "px");
        }
    };
    return MDCRippleFoundation;
}(MDCFoundation));
// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
var MDCRippleFoundation$1 = MDCRippleFoundation;

/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
// IE11 doesn't support classList on SVG elements, so we emulate it with a Set
class ClassList {
    constructor(element) {
        this.classes = new Set();
        this.changed = false;
        this.element = element;
        const classList = (element.getAttribute('class') || '').split(/\s+/);
        for (const cls of classList) {
            this.classes.add(cls);
        }
    }
    add(cls) {
        this.classes.add(cls);
        this.changed = true;
    }
    remove(cls) {
        this.classes.delete(cls);
        this.changed = true;
    }
    commit() {
        if (this.changed) {
            let classString = '';
            this.classes.forEach((cls) => classString += cls + ' ');
            this.element.setAttribute('class', classString);
        }
    }
}
/**
 * Stores the ClassInfo object applied to a given AttributePart.
 * Used to unset existing values when a new ClassInfo object is applied.
 */
const previousClassesCache = new WeakMap();
/**
 * A directive that applies CSS classes. This must be used in the `class`
 * attribute and must be the only part used in the attribute. It takes each
 * property in the `classInfo` argument and adds the property name to the
 * element's `class` if the property value is truthy; if the property value is
 * falsey, the property name is removed from the element's `class`. For example
 * `{foo: bar}` applies the class `foo` if the value of `bar` is truthy.
 * @param classInfo {ClassInfo}
 */
const classMap = directive$2((classInfo) => (part) => {
    if (!(part instanceof AttributePart$2) || (part instanceof PropertyPart) ||
        part.committer.name !== 'class' || part.committer.parts.length > 1) {
        throw new Error('The `classMap` directive must be used in the `class` attribute ' +
            'and must be the only part in the attribute.');
    }
    const { committer } = part;
    const { element } = committer;
    let previousClasses = previousClassesCache.get(part);
    if (previousClasses === undefined) {
        // Write static classes once
        // Use setAttribute() because className isn't a string on SVG elements
        element.setAttribute('class', committer.strings.join(' '));
        previousClassesCache.set(part, previousClasses = new Set());
    }
    const classList = (element.classList || new ClassList(element));
    // Remove old classes that no longer apply
    // We use forEach() instead of for-of so that re don't require down-level
    // iteration.
    previousClasses.forEach((name) => {
        if (!(name in classInfo)) {
            classList.remove(name);
            previousClasses.delete(name);
        }
    });
    // Add or remove classes based on their classMap value
    for (const name in classInfo) {
        const value = classInfo[name];
        if (value != previousClasses.has(name)) {
            // We explicitly want a loose truthy check of `value` because it seems
            // more convenient that '' and 0 are skipped.
            if (value) {
                classList.add(name);
                previousClasses.add(name);
            }
            else {
                classList.remove(name);
                previousClasses.delete(name);
            }
        }
    }
    if (typeof classList.commit === 'function') {
        classList.commit();
    }
});

/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * Stores the StyleInfo object applied to a given AttributePart.
 * Used to unset existing values when a new StyleInfo object is applied.
 */
const previousStylePropertyCache = new WeakMap();
/**
 * A directive that applies CSS properties to an element.
 *
 * `styleMap` can only be used in the `style` attribute and must be the only
 * expression in the attribute. It takes the property names in the `styleInfo`
 * object and adds the property values as CSS properties. Property names with
 * dashes (`-`) are assumed to be valid CSS property names and set on the
 * element's style object using `setProperty()`. Names without dashes are
 * assumed to be camelCased JavaScript property names and set on the element's
 * style object using property assignment, allowing the style object to
 * translate JavaScript-style names to CSS property names.
 *
 * For example `styleMap({backgroundColor: 'red', 'border-top': '5px', '--size':
 * '0'})` sets the `background-color`, `border-top` and `--size` properties.
 *
 * @param styleInfo {StyleInfo}
 */
const styleMap = directive$2((styleInfo) => (part) => {
    if (!(part instanceof AttributePart$2) || (part instanceof PropertyPart) ||
        part.committer.name !== 'style' || part.committer.parts.length > 1) {
        throw new Error('The `styleMap` directive must be used in the style attribute ' +
            'and must be the only part in the attribute.');
    }
    const { committer } = part;
    const { style } = committer.element;
    let previousStyleProperties = previousStylePropertyCache.get(part);
    if (previousStyleProperties === undefined) {
        // Write static styles once
        style.cssText = committer.strings.join(' ');
        previousStylePropertyCache.set(part, previousStyleProperties = new Set());
    }
    // Remove old properties that no longer exist in styleInfo
    // We use forEach() instead of for-of so that re don't require down-level
    // iteration.
    previousStyleProperties.forEach((name) => {
        if (!(name in styleInfo)) {
            previousStyleProperties.delete(name);
            if (name.indexOf('-') === -1) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                style[name] = null;
            }
            else {
                style.removeProperty(name);
            }
        }
    });
    // Add or update properties
    for (const name in styleInfo) {
        previousStyleProperties.add(name);
        if (name.indexOf('-') === -1) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            style[name] = styleInfo[name];
        }
        else {
            style.setProperty(name, styleInfo[name]);
        }
    }
});

/** @soyCompatible */
class RippleBase extends BaseElement {
    constructor() {
        super(...arguments);
        this.primary = false;
        this.accent = false;
        this.unbounded = false;
        this.disabled = false;
        this.activated = false;
        this.selected = false;
        this.internalUseStateLayerCustomProperties = false;
        this.hovering = false;
        this.bgFocused = false;
        this.fgActivation = false;
        this.fgDeactivation = false;
        this.fgScale = '';
        this.fgSize = '';
        this.translateStart = '';
        this.translateEnd = '';
        this.leftPos = '';
        this.topPos = '';
        this.mdcFoundationClass = MDCRippleFoundation$1;
    }
    get isActive() {
        return matches(this.parentElement || this, ':active');
    }
    createAdapter() {
        return {
            browserSupportsCssVars: () => true,
            isUnbounded: () => this.unbounded,
            isSurfaceActive: () => this.isActive,
            isSurfaceDisabled: () => this.disabled,
            addClass: (className) => {
                switch (className) {
                    case 'mdc-ripple-upgraded--background-focused':
                        this.bgFocused = true;
                        break;
                    case 'mdc-ripple-upgraded--foreground-activation':
                        this.fgActivation = true;
                        break;
                    case 'mdc-ripple-upgraded--foreground-deactivation':
                        this.fgDeactivation = true;
                        break;
                }
            },
            removeClass: (className) => {
                switch (className) {
                    case 'mdc-ripple-upgraded--background-focused':
                        this.bgFocused = false;
                        break;
                    case 'mdc-ripple-upgraded--foreground-activation':
                        this.fgActivation = false;
                        break;
                    case 'mdc-ripple-upgraded--foreground-deactivation':
                        this.fgDeactivation = false;
                        break;
                }
            },
            containsEventTarget: () => true,
            registerInteractionHandler: () => undefined,
            deregisterInteractionHandler: () => undefined,
            registerDocumentInteractionHandler: () => undefined,
            deregisterDocumentInteractionHandler: () => undefined,
            registerResizeHandler: () => undefined,
            deregisterResizeHandler: () => undefined,
            updateCssVariable: (varName, value) => {
                switch (varName) {
                    case '--mdc-ripple-fg-scale':
                        this.fgScale = value;
                        break;
                    case '--mdc-ripple-fg-size':
                        this.fgSize = value;
                        break;
                    case '--mdc-ripple-fg-translate-end':
                        this.translateEnd = value;
                        break;
                    case '--mdc-ripple-fg-translate-start':
                        this.translateStart = value;
                        break;
                    case '--mdc-ripple-left':
                        this.leftPos = value;
                        break;
                    case '--mdc-ripple-top':
                        this.topPos = value;
                        break;
                }
            },
            computeBoundingRect: () => (this.parentElement || this).getBoundingClientRect(),
            getWindowPageOffset: () => ({ x: window.pageXOffset, y: window.pageYOffset }),
        };
    }
    startPress(ev) {
        this.waitForFoundation(() => {
            this.mdcFoundation.activate(ev);
        });
    }
    endPress() {
        this.waitForFoundation(() => {
            this.mdcFoundation.deactivate();
        });
    }
    startFocus() {
        this.waitForFoundation(() => {
            this.mdcFoundation.handleFocus();
        });
    }
    endFocus() {
        this.waitForFoundation(() => {
            this.mdcFoundation.handleBlur();
        });
    }
    startHover() {
        this.hovering = true;
    }
    endHover() {
        this.hovering = false;
    }
    /**
     * Wait for the MDCFoundation to be created by `firstUpdated`
     */
    waitForFoundation(fn) {
        if (this.mdcFoundation) {
            fn();
        }
        else {
            this.updateComplete.then(fn);
        }
    }
    update(changedProperties) {
        if (changedProperties.has('disabled')) {
            // stop hovering when ripple is disabled to prevent a stuck "hover" state
            // When re-enabled, the outer component will get a `mouseenter` event on
            // the first movement, which will call `startHover()`
            if (this.disabled) {
                this.endHover();
            }
        }
        super.update(changedProperties);
    }
    /** @soyTemplate */
    render() {
        const shouldActivateInPrimary = this.activated && (this.primary || !this.accent);
        const shouldSelectInPrimary = this.selected && (this.primary || !this.accent);
        /** @classMap */
        const classes = {
            'mdc-ripple-surface--accent': this.accent,
            'mdc-ripple-surface--primary--activated': shouldActivateInPrimary,
            'mdc-ripple-surface--accent--activated': this.accent && this.activated,
            'mdc-ripple-surface--primary--selected': shouldSelectInPrimary,
            'mdc-ripple-surface--accent--selected': this.accent && this.selected,
            'mdc-ripple-surface--disabled': this.disabled,
            'mdc-ripple-surface--hover': this.hovering,
            'mdc-ripple-surface--primary': this.primary,
            'mdc-ripple-surface--selected': this.selected,
            'mdc-ripple-upgraded--background-focused': this.bgFocused,
            'mdc-ripple-upgraded--foreground-activation': this.fgActivation,
            'mdc-ripple-upgraded--foreground-deactivation': this.fgDeactivation,
            'mdc-ripple-upgraded--unbounded': this.unbounded,
            'mdc-ripple-surface--internal-use-state-layer-custom-properties': this.internalUseStateLayerCustomProperties,
        };
        return html `
        <div class="mdc-ripple-surface mdc-ripple-upgraded ${classMap(classes)}"
          style="${styleMap({
            '--mdc-ripple-fg-scale': this.fgScale,
            '--mdc-ripple-fg-size': this.fgSize,
            '--mdc-ripple-fg-translate-end': this.translateEnd,
            '--mdc-ripple-fg-translate-start': this.translateStart,
            '--mdc-ripple-left': this.leftPos,
            '--mdc-ripple-top': this.topPos,
        })}"></div>`;
    }
}
__decorate([
    query('.mdc-ripple-surface')
], RippleBase.prototype, "mdcRoot", void 0);
__decorate([
    property({ type: Boolean })
], RippleBase.prototype, "primary", void 0);
__decorate([
    property({ type: Boolean })
], RippleBase.prototype, "accent", void 0);
__decorate([
    property({ type: Boolean })
], RippleBase.prototype, "unbounded", void 0);
__decorate([
    property({ type: Boolean })
], RippleBase.prototype, "disabled", void 0);
__decorate([
    property({ type: Boolean })
], RippleBase.prototype, "activated", void 0);
__decorate([
    property({ type: Boolean })
], RippleBase.prototype, "selected", void 0);
__decorate([
    property({ type: Boolean })
], RippleBase.prototype, "internalUseStateLayerCustomProperties", void 0);
__decorate([
    state()
], RippleBase.prototype, "hovering", void 0);
__decorate([
    state()
], RippleBase.prototype, "bgFocused", void 0);
__decorate([
    state()
], RippleBase.prototype, "fgActivation", void 0);
__decorate([
    state()
], RippleBase.prototype, "fgDeactivation", void 0);
__decorate([
    state()
], RippleBase.prototype, "fgScale", void 0);
__decorate([
    state()
], RippleBase.prototype, "fgSize", void 0);
__decorate([
    state()
], RippleBase.prototype, "translateStart", void 0);
__decorate([
    state()
], RippleBase.prototype, "translateEnd", void 0);
__decorate([
    state()
], RippleBase.prototype, "leftPos", void 0);
__decorate([
    state()
], RippleBase.prototype, "topPos", void 0);

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
const styles$7 = css `.mdc-ripple-surface{--mdc-ripple-fg-size: 0;--mdc-ripple-left: 0;--mdc-ripple-top: 0;--mdc-ripple-fg-scale: 1;--mdc-ripple-fg-translate-end: 0;--mdc-ripple-fg-translate-start: 0;-webkit-tap-highlight-color:rgba(0,0,0,0);will-change:transform,opacity;position:relative;outline:none;overflow:hidden}.mdc-ripple-surface::before,.mdc-ripple-surface::after{position:absolute;border-radius:50%;opacity:0;pointer-events:none;content:""}.mdc-ripple-surface::before{transition:opacity 15ms linear,background-color 15ms linear;z-index:1;z-index:var(--mdc-ripple-z-index, 1)}.mdc-ripple-surface::after{z-index:0;z-index:var(--mdc-ripple-z-index, 0)}.mdc-ripple-surface.mdc-ripple-upgraded::before{transform:scale(var(--mdc-ripple-fg-scale, 1))}.mdc-ripple-surface.mdc-ripple-upgraded::after{top:0;left:0;transform:scale(0);transform-origin:center center}.mdc-ripple-surface.mdc-ripple-upgraded--unbounded::after{top:var(--mdc-ripple-top, 0);left:var(--mdc-ripple-left, 0)}.mdc-ripple-surface.mdc-ripple-upgraded--foreground-activation::after{animation:mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards}.mdc-ripple-surface.mdc-ripple-upgraded--foreground-deactivation::after{animation:mdc-ripple-fg-opacity-out 150ms;transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}.mdc-ripple-surface::before,.mdc-ripple-surface::after{top:calc(50% - 100%);left:calc(50% - 100%);width:200%;height:200%}.mdc-ripple-surface.mdc-ripple-upgraded::after{width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-ripple-surface[data-mdc-ripple-is-unbounded],.mdc-ripple-upgraded--unbounded{overflow:visible}.mdc-ripple-surface[data-mdc-ripple-is-unbounded]::before,.mdc-ripple-surface[data-mdc-ripple-is-unbounded]::after,.mdc-ripple-upgraded--unbounded::before,.mdc-ripple-upgraded--unbounded::after{top:calc(50% - 50%);left:calc(50% - 50%);width:100%;height:100%}.mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::before,.mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::after,.mdc-ripple-upgraded--unbounded.mdc-ripple-upgraded::before,.mdc-ripple-upgraded--unbounded.mdc-ripple-upgraded::after{top:var(--mdc-ripple-top, calc(50% - 50%));left:var(--mdc-ripple-left, calc(50% - 50%));width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-ripple-surface[data-mdc-ripple-is-unbounded].mdc-ripple-upgraded::after,.mdc-ripple-upgraded--unbounded.mdc-ripple-upgraded::after{width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-ripple-surface::before,.mdc-ripple-surface::after{background-color:#000;background-color:var(--mdc-ripple-color, #000)}.mdc-ripple-surface:hover::before,.mdc-ripple-surface.mdc-ripple-surface--hover::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-ripple-surface.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-ripple-surface:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-ripple-surface.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}@keyframes mdc-ripple-fg-radius-in{from{animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transform:translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1)}to{transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}}@keyframes mdc-ripple-fg-opacity-in{from{animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity, 0)}}@keyframes mdc-ripple-fg-opacity-out{from{animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity, 0)}to{opacity:0}}:host{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;display:block}:host .mdc-ripple-surface{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;will-change:unset}.mdc-ripple-surface--primary::before,.mdc-ripple-surface--primary::after{background-color:#6200ee;background-color:var(--mdc-ripple-color, var(--mdc-theme-primary, #6200ee))}.mdc-ripple-surface--primary:hover::before,.mdc-ripple-surface--primary.mdc-ripple-surface--hover::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-ripple-surface--primary.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--primary:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-ripple-surface--primary:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--primary:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-ripple-surface--primary.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-ripple-surface--primary--activated::before{opacity:0.12;opacity:var(--mdc-ripple-activated-opacity, 0.12)}.mdc-ripple-surface--primary--activated::before,.mdc-ripple-surface--primary--activated::after{background-color:#6200ee;background-color:var(--mdc-ripple-color, var(--mdc-theme-primary, #6200ee))}.mdc-ripple-surface--primary--activated:hover::before,.mdc-ripple-surface--primary--activated.mdc-ripple-surface--hover::before{opacity:0.16;opacity:var(--mdc-ripple-hover-opacity, 0.16)}.mdc-ripple-surface--primary--activated.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--primary--activated:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.24;opacity:var(--mdc-ripple-focus-opacity, 0.24)}.mdc-ripple-surface--primary--activated:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--primary--activated:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.24;opacity:var(--mdc-ripple-press-opacity, 0.24)}.mdc-ripple-surface--primary--activated.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.24)}.mdc-ripple-surface--primary--selected::before{opacity:0.08;opacity:var(--mdc-ripple-selected-opacity, 0.08)}.mdc-ripple-surface--primary--selected::before,.mdc-ripple-surface--primary--selected::after{background-color:#6200ee;background-color:var(--mdc-ripple-color, var(--mdc-theme-primary, #6200ee))}.mdc-ripple-surface--primary--selected:hover::before,.mdc-ripple-surface--primary--selected.mdc-ripple-surface--hover::before{opacity:0.12;opacity:var(--mdc-ripple-hover-opacity, 0.12)}.mdc-ripple-surface--primary--selected.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--primary--selected:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.2;opacity:var(--mdc-ripple-focus-opacity, 0.2)}.mdc-ripple-surface--primary--selected:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--primary--selected:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.2;opacity:var(--mdc-ripple-press-opacity, 0.2)}.mdc-ripple-surface--primary--selected.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.2)}.mdc-ripple-surface--accent::before,.mdc-ripple-surface--accent::after{background-color:#018786;background-color:var(--mdc-ripple-color, var(--mdc-theme-secondary, #018786))}.mdc-ripple-surface--accent:hover::before,.mdc-ripple-surface--accent.mdc-ripple-surface--hover::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-ripple-surface--accent.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--accent:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-ripple-surface--accent:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--accent:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-ripple-surface--accent.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-ripple-surface--accent--activated::before{opacity:0.12;opacity:var(--mdc-ripple-activated-opacity, 0.12)}.mdc-ripple-surface--accent--activated::before,.mdc-ripple-surface--accent--activated::after{background-color:#018786;background-color:var(--mdc-ripple-color, var(--mdc-theme-secondary, #018786))}.mdc-ripple-surface--accent--activated:hover::before,.mdc-ripple-surface--accent--activated.mdc-ripple-surface--hover::before{opacity:0.16;opacity:var(--mdc-ripple-hover-opacity, 0.16)}.mdc-ripple-surface--accent--activated.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--accent--activated:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.24;opacity:var(--mdc-ripple-focus-opacity, 0.24)}.mdc-ripple-surface--accent--activated:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--accent--activated:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.24;opacity:var(--mdc-ripple-press-opacity, 0.24)}.mdc-ripple-surface--accent--activated.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.24)}.mdc-ripple-surface--accent--selected::before{opacity:0.08;opacity:var(--mdc-ripple-selected-opacity, 0.08)}.mdc-ripple-surface--accent--selected::before,.mdc-ripple-surface--accent--selected::after{background-color:#018786;background-color:var(--mdc-ripple-color, var(--mdc-theme-secondary, #018786))}.mdc-ripple-surface--accent--selected:hover::before,.mdc-ripple-surface--accent--selected.mdc-ripple-surface--hover::before{opacity:0.12;opacity:var(--mdc-ripple-hover-opacity, 0.12)}.mdc-ripple-surface--accent--selected.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--accent--selected:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.2;opacity:var(--mdc-ripple-focus-opacity, 0.2)}.mdc-ripple-surface--accent--selected:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--accent--selected:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.2;opacity:var(--mdc-ripple-press-opacity, 0.2)}.mdc-ripple-surface--accent--selected.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.2)}.mdc-ripple-surface--disabled{opacity:0}.mdc-ripple-surface--internal-use-state-layer-custom-properties::before,.mdc-ripple-surface--internal-use-state-layer-custom-properties::after{background-color:#000;background-color:var(--mdc-ripple-hover-state-layer-color, #000)}.mdc-ripple-surface--internal-use-state-layer-custom-properties:hover::before,.mdc-ripple-surface--internal-use-state-layer-custom-properties.mdc-ripple-surface--hover::before{opacity:0.04;opacity:var(--mdc-ripple-hover-state-layer-opacity, 0.04)}.mdc-ripple-surface--internal-use-state-layer-custom-properties.mdc-ripple-upgraded--background-focused::before,.mdc-ripple-surface--internal-use-state-layer-custom-properties:not(.mdc-ripple-upgraded):focus::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-state-layer-opacity, 0.12)}.mdc-ripple-surface--internal-use-state-layer-custom-properties:not(.mdc-ripple-upgraded)::after{transition:opacity 150ms linear}.mdc-ripple-surface--internal-use-state-layer-custom-properties:not(.mdc-ripple-upgraded):active::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-pressed-state-layer-opacity, 0.12)}.mdc-ripple-surface--internal-use-state-layer-custom-properties.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-pressed-state-layer-opacity, 0.12)}`;

/** @soyCompatible */
let Ripple = class Ripple extends RippleBase {
};
Ripple.styles = [styles$7];
Ripple = __decorate([
    customElement('mwc-ripple')
], Ripple);

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */ // tslint:disable:no-any
// eslint-disable @typescript-eslint/no-explicit-any
/**
 * TypeScript version of the decorator
 * @see https://www.typescriptlang.org/docs/handbook/decorators.html#property-decorators
 */
function tsDecorator(prototype, name, descriptor) {
    const constructor = prototype.constructor;
    if (!descriptor) {
        /**
         * lit-element uses internal properties with two leading underscores to
         * provide storage for accessors
         */
        const litInternalPropertyKey = `__${name}`;
        descriptor =
            constructor.getPropertyDescriptor(name, litInternalPropertyKey);
        if (!descriptor) {
            throw new Error('@ariaProperty must be used after a @property decorator');
        }
    }
    // descriptor must exist at this point, reassign so typescript understands
    const propDescriptor = descriptor;
    let attribute = '';
    if (!propDescriptor.set) {
        throw new Error(`@ariaProperty requires a setter for ${name}`);
    }
    const wrappedDescriptor = {
        configurable: true,
        enumerable: true,
        set(value) {
            if (attribute === '') {
                const options = constructor.getPropertyOptions(name);
                // the attribute will be a string at runtime
                attribute = options.attribute;
            }
            if (this.hasAttribute(attribute)) {
                this.removeAttribute(attribute);
            }
            propDescriptor.set.call(this, value);
        }
    };
    if (propDescriptor.get) {
        wrappedDescriptor.get = function () {
            return propDescriptor.get.call(this);
        };
    }
    return wrappedDescriptor;
}
/**
 * A property decorator proxies an aria attribute to an internal node
 *
 * This decorator is only intended for use with ARIA attributes, such as `role`
 * and `aria-label` due to screenreader needs.
 *
 * Upon first render, `@ariaProperty` will remove the attribute from the host
 * element to prevent screenreaders from reading the host instead of the
 * internal node.
 *
 * This decorator should only be used for non-Symbol public fields decorated
 * with `@property`, or on a setter with an optional getter.
 *
 * @example
 * ```ts
 * class MyElement {
 *   @ariaProperty
 *   @property({ type: String, attribute: 'aria-label' })
 *   ariaLabel?: string;
 * }
 * ```
 * @category Decorator
 * @ExportDecoratedItems
 */
function ariaProperty(protoOrDescriptor, name, descriptor) {
    if (name !== undefined) {
        return tsDecorator(protoOrDescriptor, name, descriptor);
    }
    else {
        throw new Error('@ariaProperty only supports TypeScript Decorators');
    }
}

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/** @soyCompatible */
class FormElement extends BaseElement {
    click() {
        if (this.formElement) {
            this.formElement.focus();
            this.formElement.click();
        }
    }
    setAriaLabel(label) {
        if (this.formElement) {
            this.formElement.setAttribute('aria-label', label);
        }
    }
    firstUpdated() {
        super.firstUpdated();
        if (this.shadowRoot) {
            this.mdcRoot.addEventListener('change', (e) => {
                this.dispatchEvent(new Event('change', e));
            });
        }
    }
}
FormElement.shadowRootOptions = { mode: 'open', delegatesFocus: true };

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Class that encapsulates the events handlers for `mwc-ripple`
 *
 *
 * Example:
 * ```
 * class XFoo extends LitElement {
 *   async getRipple() {
 *     this.renderRipple = true;
 *     await this.updateComplete;
 *     return this.renderRoot.querySelector('mwc-ripple');
 *   }
 *   rippleHandlers = new RippleHandlers(() => this.getRipple());
 *
 *   render() {
 *     return html`
 *       <div @mousedown=${this.rippleHandlers.startPress}></div>
 *       ${this.renderRipple ? html`<mwc-ripple></mwc-ripple>` : ''}
 *     `;
 *   }
 * }
 * ```
 */
class RippleHandlers {
    constructor(
    /** Function that returns a `mwc-ripple` */
    rippleFn) {
        this.startPress = (ev) => {
            rippleFn().then((r) => {
                r && r.startPress(ev);
            });
        };
        this.endPress = () => {
            rippleFn().then((r) => {
                r && r.endPress();
            });
        };
        this.startFocus = () => {
            rippleFn().then((r) => {
                r && r.startFocus();
            });
        };
        this.endFocus = () => {
            rippleFn().then((r) => {
                r && r.endFocus();
            });
        };
        this.startHover = () => {
            rippleFn().then((r) => {
                r && r.startHover();
            });
        };
        this.endHover = () => {
            rippleFn().then((r) => {
                r && r.endHover();
            });
        };
    }
}

/**
 * @license
 * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const previousValues = new WeakMap();
/**
 * For AttributeParts, sets the attribute if the value is defined and removes
 * the attribute if the value is undefined.
 *
 * For other part types, this directive is a no-op.
 */
const ifDefined = directive$2((value) => (part) => {
    const previousValue = previousValues.get(part);
    if (value === undefined && part instanceof AttributePart$2) {
        // If the value is undefined, remove the attribute, but only if the value
        // was previously defined.
        if (previousValue !== undefined || !previousValues.has(part)) {
            const name = part.committer.name;
            part.committer.element.removeAttribute(name);
        }
    }
    else if (value !== previousValue) {
        part.setValue(value);
    }
    previousValues.set(part, value);
});

/** @soyCompatible */
class CheckboxBase extends FormElement {
    constructor() {
        super(...arguments);
        this.checked = false;
        this.indeterminate = false;
        this.disabled = false;
        this.value = '';
        /**
         * Touch target extends beyond visual boundary of a component by default.
         * Set to `true` to remove touch target added to the component.
         * @see https://material.io/design/usability/accessibility.html
         */
        this.reducedTouchTarget = false;
        this.animationClass = '';
        this.shouldRenderRipple = false;
        this.focused = false;
        this.useStateLayerCustomProperties = false;
        // MDC Foundation is unused
        this.mdcFoundationClass = undefined;
        this.mdcFoundation = undefined;
        this.rippleElement = null;
        this.rippleHandlers = new RippleHandlers(() => {
            this.shouldRenderRipple = true;
            this.ripple.then((v) => this.rippleElement = v);
            return this.ripple;
        });
    }
    createAdapter() {
        return {};
    }
    update(changedProperties) {
        const oldIndeterminate = changedProperties.get('indeterminate');
        const oldChecked = changedProperties.get('checked');
        const oldDisabled = changedProperties.get('disabled');
        if (oldIndeterminate !== undefined || oldChecked !== undefined ||
            oldDisabled !== undefined) {
            const oldState = this.calculateAnimationStateName(!!oldChecked, !!oldIndeterminate, !!oldDisabled);
            const newState = this.calculateAnimationStateName(this.checked, this.indeterminate, this.disabled);
            this.animationClass = `${oldState}-${newState}`;
        }
        super.update(changedProperties);
    }
    calculateAnimationStateName(checked, indeterminate, disabled) {
        if (disabled) {
            return 'disabled';
        }
        else if (indeterminate) {
            return 'indeterminate';
        }
        else if (checked) {
            return 'checked';
        }
        else {
            return 'unchecked';
        }
    }
    // TODO(dfreedm): Make this use selected as a param after Polymer/internal#739
    /** @soyTemplate */
    renderRipple() {
        return this.shouldRenderRipple ? html `<mwc-ripple
        .disabled="${this.disabled}"
        .internalUseStateLayerCustomProperties="${this.useStateLayerCustomProperties}"
        unbounded></mwc-ripple>` :
            '';
    }
    /**
     * @soyTemplate
     * @soyAttributes checkboxAttributes: input
     * @soyClasses checkboxClasses: .mdc-checkbox
     */
    render() {
        const selected = this.indeterminate || this.checked;
        /* eslint-disable eqeqeq */
        // tslint:disable:triple-equals
        /** @classMap */
        const classes = {
            'mdc-checkbox--disabled': this.disabled,
            'mdc-checkbox--selected': selected,
            'mdc-checkbox--touch': !this.reducedTouchTarget,
            'mdc-ripple-upgraded--background-focused': this.focused,
            // transition animiation classes
            'mdc-checkbox--anim-checked-indeterminate': this.animationClass == 'checked-indeterminate',
            'mdc-checkbox--anim-checked-unchecked': this.animationClass == 'checked-unchecked',
            'mdc-checkbox--anim-indeterminate-checked': this.animationClass == 'indeterminate-checked',
            'mdc-checkbox--anim-indeterminate-unchecked': this.animationClass == 'indeterminate-unchecked',
            'mdc-checkbox--anim-unchecked-checked': this.animationClass == 'unchecked-checked',
            'mdc-checkbox--anim-unchecked-indeterminate': this.animationClass == 'unchecked-indeterminate',
        };
        // tslint:enable:triple-equals
        /* eslint-enable eqeqeq */
        const ariaChecked = this.indeterminate ? 'mixed' : undefined;
        return html `
      <div class="mdc-checkbox mdc-checkbox--upgraded ${classMap(classes)}">
        <input type="checkbox"
              class="mdc-checkbox__native-control"
              name="${ifDefined(this.name)}"
              aria-checked="${ifDefined(ariaChecked)}"
              aria-label="${ifDefined(this.ariaLabel)}"
              aria-labelledby="${ifDefined(this.ariaLabelledBy)}"
              aria-describedby="${ifDefined(this.ariaDescribedBy)}"
              data-indeterminate="${this.indeterminate ? 'true' : 'false'}"
              ?disabled="${this.disabled}"
              .indeterminate="${this.indeterminate}"
              .checked="${this.checked}"
              .value="${this.value}"
              @change="${this.handleChange}"
              @focus="${this.handleFocus}"
              @blur="${this.handleBlur}"
              @mousedown="${this.handleRippleMouseDown}"
              @mouseenter="${this.handleRippleMouseEnter}"
              @mouseleave="${this.handleRippleMouseLeave}"
              @touchstart="${this.handleRippleTouchStart}"
              @touchend="${this.handleRippleDeactivate}"
              @touchcancel="${this.handleRippleDeactivate}">
        <div class="mdc-checkbox__background"
          @animationend="${this.resetAnimationClass}">
          <svg class="mdc-checkbox__checkmark"
              viewBox="0 0 24 24">
            <path class="mdc-checkbox__checkmark-path"
                  fill="none"
                  d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
          </svg>
          <div class="mdc-checkbox__mixedmark"></div>
        </div>
        ${this.renderRipple()}
      </div>`;
    }
    handleFocus() {
        this.focused = true;
        this.handleRippleFocus();
    }
    handleBlur() {
        this.focused = false;
        this.handleRippleBlur();
    }
    handleRippleMouseDown(event) {
        const onUp = () => {
            window.removeEventListener('mouseup', onUp);
            this.handleRippleDeactivate();
        };
        window.addEventListener('mouseup', onUp);
        this.rippleHandlers.startPress(event);
    }
    handleRippleTouchStart(event) {
        this.rippleHandlers.startPress(event);
    }
    handleRippleDeactivate() {
        this.rippleHandlers.endPress();
    }
    handleRippleMouseEnter() {
        this.rippleHandlers.startHover();
    }
    handleRippleMouseLeave() {
        this.rippleHandlers.endHover();
    }
    handleRippleFocus() {
        this.rippleHandlers.startFocus();
    }
    handleRippleBlur() {
        this.rippleHandlers.endFocus();
    }
    handleChange() {
        this.checked = this.formElement.checked;
        this.indeterminate = this.formElement.indeterminate;
    }
    resetAnimationClass() {
        this.animationClass = '';
    }
    get isRippleActive() {
        var _a;
        return ((_a = this.rippleElement) === null || _a === void 0 ? void 0 : _a.isActive) || false;
    }
}
__decorate([
    query('.mdc-checkbox')
], CheckboxBase.prototype, "mdcRoot", void 0);
__decorate([
    query('input')
], CheckboxBase.prototype, "formElement", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], CheckboxBase.prototype, "checked", void 0);
__decorate([
    property({ type: Boolean })
], CheckboxBase.prototype, "indeterminate", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], CheckboxBase.prototype, "disabled", void 0);
__decorate([
    property({ type: String, reflect: true })
], CheckboxBase.prototype, "name", void 0);
__decorate([
    property({ type: String })
], CheckboxBase.prototype, "value", void 0);
__decorate([
    ariaProperty,
    property({ type: String, attribute: 'aria-label' })
], CheckboxBase.prototype, "ariaLabel", void 0);
__decorate([
    ariaProperty,
    property({ type: String, attribute: 'aria-labelledby' })
], CheckboxBase.prototype, "ariaLabelledBy", void 0);
__decorate([
    ariaProperty,
    property({ type: String, attribute: 'aria-describedby' })
], CheckboxBase.prototype, "ariaDescribedBy", void 0);
__decorate([
    property({ type: Boolean })
], CheckboxBase.prototype, "reducedTouchTarget", void 0);
__decorate([
    state()
], CheckboxBase.prototype, "animationClass", void 0);
__decorate([
    state()
], CheckboxBase.prototype, "shouldRenderRipple", void 0);
__decorate([
    state()
], CheckboxBase.prototype, "focused", void 0);
__decorate([
    state()
], CheckboxBase.prototype, "useStateLayerCustomProperties", void 0);
__decorate([
    queryAsync('mwc-ripple')
], CheckboxBase.prototype, "ripple", void 0);
__decorate([
    eventOptions({ passive: true })
], CheckboxBase.prototype, "handleRippleTouchStart", null);

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
const styles$6 = css `.mdc-checkbox{padding:calc((40px - 18px) / 2);padding:calc((var(--mdc-checkbox-ripple-size, 40px) - 18px) / 2);margin:calc((40px - 40px) / 2);margin:calc((var(--mdc-checkbox-touch-target-size, 40px) - 40px) / 2)}.mdc-checkbox .mdc-checkbox__ripple::before,.mdc-checkbox .mdc-checkbox__ripple::after{background-color:#000;background-color:var(--mdc-ripple-color, #000)}.mdc-checkbox:hover .mdc-checkbox__ripple::before,.mdc-checkbox.mdc-ripple-surface--hover .mdc-checkbox__ripple::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-checkbox.mdc-ripple-upgraded--background-focused .mdc-checkbox__ripple::before,.mdc-checkbox:not(.mdc-ripple-upgraded):focus .mdc-checkbox__ripple::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-checkbox:not(.mdc-ripple-upgraded) .mdc-checkbox__ripple::after{transition:opacity 150ms linear}.mdc-checkbox:not(.mdc-ripple-upgraded):active .mdc-checkbox__ripple::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-checkbox.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple::before,.mdc-checkbox.mdc-checkbox--selected .mdc-checkbox__ripple::after{background-color:#018786;background-color:var(--mdc-ripple-color, var(--mdc-theme-secondary, #018786))}.mdc-checkbox.mdc-checkbox--selected:hover .mdc-checkbox__ripple::before,.mdc-checkbox.mdc-checkbox--selected.mdc-ripple-surface--hover .mdc-checkbox__ripple::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-checkbox.mdc-checkbox--selected.mdc-ripple-upgraded--background-focused .mdc-checkbox__ripple::before,.mdc-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded):focus .mdc-checkbox__ripple::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded) .mdc-checkbox__ripple::after{transition:opacity 150ms linear}.mdc-checkbox.mdc-checkbox--selected:not(.mdc-ripple-upgraded):active .mdc-checkbox__ripple::after{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-checkbox.mdc-checkbox--selected.mdc-ripple-upgraded{--mdc-ripple-fg-opacity:var(--mdc-ripple-press-opacity, 0.12)}.mdc-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple::before,.mdc-checkbox.mdc-ripple-upgraded--background-focused.mdc-checkbox--selected .mdc-checkbox__ripple::after{background-color:#018786;background-color:var(--mdc-ripple-color, var(--mdc-theme-secondary, #018786))}.mdc-checkbox .mdc-checkbox__background{top:calc((40px - 18px) / 2);top:calc((var(--mdc-checkbox-ripple-size, 40px) - 18px) / 2);left:calc((40px - 18px) / 2);left:calc((var(--mdc-checkbox-ripple-size, 40px) - 18px) / 2)}.mdc-checkbox .mdc-checkbox__native-control{top:calc((40px - 40px) / 2);top:calc((40px - var(--mdc-checkbox-touch-target-size, 40px)) / 2);right:calc((40px - 40px) / 2);right:calc((40px - var(--mdc-checkbox-touch-target-size, 40px)) / 2);left:calc((40px - 40px) / 2);left:calc((40px - var(--mdc-checkbox-touch-target-size, 40px)) / 2);width:40px;width:var(--mdc-checkbox-touch-target-size, 40px);height:40px;height:var(--mdc-checkbox-touch-target-size, 40px)}.mdc-checkbox .mdc-checkbox__native-control:enabled:not(:checked):not(:indeterminate):not([data-indeterminate=true])~.mdc-checkbox__background{border-color:rgba(0, 0, 0, 0.54);border-color:var(--mdc-checkbox-unchecked-color, rgba(0, 0, 0, 0.54));background-color:transparent}.mdc-checkbox .mdc-checkbox__native-control:enabled:checked~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control:enabled:indeterminate~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control[data-indeterminate=true]:enabled~.mdc-checkbox__background{border-color:#018786;border-color:var(--mdc-checkbox-checked-color, var(--mdc-theme-secondary, #018786));background-color:#018786;background-color:var(--mdc-checkbox-checked-color, var(--mdc-theme-secondary, #018786))}@keyframes mdc-checkbox-fade-in-background-8A000000FF01878600000000FF018786{0%{border-color:rgba(0, 0, 0, 0.54);border-color:var(--mdc-checkbox-unchecked-color, rgba(0, 0, 0, 0.54));background-color:transparent}50%{border-color:#018786;border-color:var(--mdc-checkbox-checked-color, var(--mdc-theme-secondary, #018786));background-color:#018786;background-color:var(--mdc-checkbox-checked-color, var(--mdc-theme-secondary, #018786))}}@keyframes mdc-checkbox-fade-out-background-8A000000FF01878600000000FF018786{0%,80%{border-color:#018786;border-color:var(--mdc-checkbox-checked-color, var(--mdc-theme-secondary, #018786));background-color:#018786;background-color:var(--mdc-checkbox-checked-color, var(--mdc-theme-secondary, #018786))}100%{border-color:rgba(0, 0, 0, 0.54);border-color:var(--mdc-checkbox-unchecked-color, rgba(0, 0, 0, 0.54));background-color:transparent}}.mdc-checkbox.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-checkbox.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__native-control:enabled~.mdc-checkbox__background{animation-name:mdc-checkbox-fade-in-background-8A000000FF01878600000000FF018786}.mdc-checkbox.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background,.mdc-checkbox.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__native-control:enabled~.mdc-checkbox__background{animation-name:mdc-checkbox-fade-out-background-8A000000FF01878600000000FF018786}.mdc-checkbox .mdc-checkbox__native-control[disabled]:not(:checked):not(:indeterminate):not([data-indeterminate=true])~.mdc-checkbox__background{border-color:rgba(0, 0, 0, 0.38);border-color:var(--mdc-checkbox-disabled-color, rgba(0, 0, 0, 0.38));background-color:transparent}.mdc-checkbox .mdc-checkbox__native-control[disabled]:checked~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control[disabled]:indeterminate~.mdc-checkbox__background,.mdc-checkbox .mdc-checkbox__native-control[data-indeterminate=true][disabled]~.mdc-checkbox__background{border-color:transparent;background-color:rgba(0, 0, 0, 0.38);background-color:var(--mdc-checkbox-disabled-color, rgba(0, 0, 0, 0.38))}.mdc-checkbox .mdc-checkbox__native-control:enabled~.mdc-checkbox__background .mdc-checkbox__checkmark{color:#fff;color:var(--mdc-checkbox-ink-color, #fff)}.mdc-checkbox .mdc-checkbox__native-control:enabled~.mdc-checkbox__background .mdc-checkbox__mixedmark{border-color:#fff;border-color:var(--mdc-checkbox-ink-color, #fff)}.mdc-checkbox .mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__checkmark{color:#fff;color:var(--mdc-checkbox-ink-color, #fff)}.mdc-checkbox .mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__mixedmark{border-color:#fff;border-color:var(--mdc-checkbox-ink-color, #fff)}.mdc-touch-target-wrapper{display:inline}@keyframes mdc-checkbox-unchecked-checked-checkmark-path{0%,50%{stroke-dashoffset:29.7833385}50%{animation-timing-function:cubic-bezier(0, 0, 0.2, 1)}100%{stroke-dashoffset:0}}@keyframes mdc-checkbox-unchecked-indeterminate-mixedmark{0%,68.2%{transform:scaleX(0)}68.2%{animation-timing-function:cubic-bezier(0, 0, 0, 1)}100%{transform:scaleX(1)}}@keyframes mdc-checkbox-checked-unchecked-checkmark-path{from{animation-timing-function:cubic-bezier(0.4, 0, 1, 1);opacity:1;stroke-dashoffset:0}to{opacity:0;stroke-dashoffset:-29.7833385}}@keyframes mdc-checkbox-checked-indeterminate-checkmark{from{animation-timing-function:cubic-bezier(0, 0, 0.2, 1);transform:rotate(0deg);opacity:1}to{transform:rotate(45deg);opacity:0}}@keyframes mdc-checkbox-indeterminate-checked-checkmark{from{animation-timing-function:cubic-bezier(0.14, 0, 0, 1);transform:rotate(45deg);opacity:0}to{transform:rotate(360deg);opacity:1}}@keyframes mdc-checkbox-checked-indeterminate-mixedmark{from{animation-timing-function:mdc-animation-deceleration-curve-timing-function;transform:rotate(-45deg);opacity:0}to{transform:rotate(0deg);opacity:1}}@keyframes mdc-checkbox-indeterminate-checked-mixedmark{from{animation-timing-function:cubic-bezier(0.14, 0, 0, 1);transform:rotate(0deg);opacity:1}to{transform:rotate(315deg);opacity:0}}@keyframes mdc-checkbox-indeterminate-unchecked-mixedmark{0%{animation-timing-function:linear;transform:scaleX(1);opacity:1}32.8%,100%{transform:scaleX(0);opacity:0}}.mdc-checkbox{display:inline-block;position:relative;flex:0 0 18px;box-sizing:content-box;width:18px;height:18px;line-height:0;white-space:nowrap;cursor:pointer;vertical-align:bottom}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-checkbox__native-control[disabled]:not(:checked):not(:indeterminate):not([data-indeterminate=true])~.mdc-checkbox__background{border-color:GrayText;border-color:var(--mdc-checkbox-disabled-color, GrayText);background-color:transparent}.mdc-checkbox__native-control[disabled]:checked~.mdc-checkbox__background,.mdc-checkbox__native-control[disabled]:indeterminate~.mdc-checkbox__background,.mdc-checkbox__native-control[data-indeterminate=true][disabled]~.mdc-checkbox__background{border-color:GrayText;background-color:transparent;background-color:var(--mdc-checkbox-disabled-color, transparent)}.mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__checkmark{color:GrayText;color:var(--mdc-checkbox-ink-color, GrayText)}.mdc-checkbox__native-control:disabled~.mdc-checkbox__background .mdc-checkbox__mixedmark{border-color:GrayText;border-color:var(--mdc-checkbox-ink-color, GrayText)}.mdc-checkbox__mixedmark{margin:0 1px}}.mdc-checkbox--disabled{cursor:default;pointer-events:none}.mdc-checkbox__background{display:inline-flex;position:absolute;align-items:center;justify-content:center;box-sizing:border-box;width:18px;height:18px;border:2px solid currentColor;border-radius:2px;background-color:transparent;pointer-events:none;will-change:background-color,border-color;transition:background-color 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1),border-color 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-checkbox__checkmark{position:absolute;top:0;right:0;bottom:0;left:0;width:100%;opacity:0;transition:opacity 180ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-checkbox--upgraded .mdc-checkbox__checkmark{opacity:1}.mdc-checkbox__checkmark-path{transition:stroke-dashoffset 180ms 0ms cubic-bezier(0.4, 0, 0.6, 1);stroke:currentColor;stroke-width:3.12px;stroke-dashoffset:29.7833385;stroke-dasharray:29.7833385}.mdc-checkbox__mixedmark{width:100%;height:0;transform:scaleX(0) rotate(0deg);border-width:1px;border-style:solid;opacity:0;transition:opacity 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1),transform 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__background,.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__background,.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__background,.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__background{animation-duration:180ms;animation-timing-function:linear}.mdc-checkbox--anim-unchecked-checked .mdc-checkbox__checkmark-path{animation:mdc-checkbox-unchecked-checked-checkmark-path 180ms linear 0s;transition:none}.mdc-checkbox--anim-unchecked-indeterminate .mdc-checkbox__mixedmark{animation:mdc-checkbox-unchecked-indeterminate-mixedmark 90ms linear 0s;transition:none}.mdc-checkbox--anim-checked-unchecked .mdc-checkbox__checkmark-path{animation:mdc-checkbox-checked-unchecked-checkmark-path 90ms linear 0s;transition:none}.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__checkmark{animation:mdc-checkbox-checked-indeterminate-checkmark 90ms linear 0s;transition:none}.mdc-checkbox--anim-checked-indeterminate .mdc-checkbox__mixedmark{animation:mdc-checkbox-checked-indeterminate-mixedmark 90ms linear 0s;transition:none}.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__checkmark{animation:mdc-checkbox-indeterminate-checked-checkmark 500ms linear 0s;transition:none}.mdc-checkbox--anim-indeterminate-checked .mdc-checkbox__mixedmark{animation:mdc-checkbox-indeterminate-checked-mixedmark 500ms linear 0s;transition:none}.mdc-checkbox--anim-indeterminate-unchecked .mdc-checkbox__mixedmark{animation:mdc-checkbox-indeterminate-unchecked-mixedmark 300ms linear 0s;transition:none}.mdc-checkbox__native-control:checked~.mdc-checkbox__background,.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background,.mdc-checkbox__native-control[data-indeterminate=true]~.mdc-checkbox__background{transition:border-color 90ms 0ms cubic-bezier(0, 0, 0.2, 1),background-color 90ms 0ms cubic-bezier(0, 0, 0.2, 1)}.mdc-checkbox__native-control:checked~.mdc-checkbox__background .mdc-checkbox__checkmark-path,.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background .mdc-checkbox__checkmark-path,.mdc-checkbox__native-control[data-indeterminate=true]~.mdc-checkbox__background .mdc-checkbox__checkmark-path{stroke-dashoffset:0}.mdc-checkbox__native-control{position:absolute;margin:0;padding:0;opacity:0;cursor:inherit}.mdc-checkbox__native-control:disabled{cursor:default;pointer-events:none}.mdc-checkbox--touch{margin:calc((48px - 40px) / 2);margin:calc((var(--mdc-checkbox-state-layer-size, 48px) - var(--mdc-checkbox-state-layer-size, 40px)) / 2)}.mdc-checkbox--touch .mdc-checkbox__native-control{top:calc((40px - 48px) / 2);top:calc((var(--mdc-checkbox-state-layer-size, 40px) - var(--mdc-checkbox-state-layer-size, 48px)) / 2);right:calc((40px - 48px) / 2);right:calc((var(--mdc-checkbox-state-layer-size, 40px) - var(--mdc-checkbox-state-layer-size, 48px)) / 2);left:calc((40px - 48px) / 2);left:calc((var(--mdc-checkbox-state-layer-size, 40px) - var(--mdc-checkbox-state-layer-size, 48px)) / 2);width:48px;width:var(--mdc-checkbox-state-layer-size, 48px);height:48px;height:var(--mdc-checkbox-state-layer-size, 48px)}.mdc-checkbox__native-control:checked~.mdc-checkbox__background .mdc-checkbox__checkmark{transition:opacity 180ms 0ms cubic-bezier(0, 0, 0.2, 1),transform 180ms 0ms cubic-bezier(0, 0, 0.2, 1);opacity:1}.mdc-checkbox__native-control:checked~.mdc-checkbox__background .mdc-checkbox__mixedmark{transform:scaleX(1) rotate(-45deg)}.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background .mdc-checkbox__checkmark,.mdc-checkbox__native-control[data-indeterminate=true]~.mdc-checkbox__background .mdc-checkbox__checkmark{transform:rotate(45deg);opacity:0;transition:opacity 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1),transform 90ms 0ms cubic-bezier(0.4, 0, 0.6, 1)}.mdc-checkbox__native-control:indeterminate~.mdc-checkbox__background .mdc-checkbox__mixedmark,.mdc-checkbox__native-control[data-indeterminate=true]~.mdc-checkbox__background .mdc-checkbox__mixedmark{transform:scaleX(1) rotate(0deg);opacity:1}.mdc-checkbox.mdc-checkbox--upgraded .mdc-checkbox__background,.mdc-checkbox.mdc-checkbox--upgraded .mdc-checkbox__checkmark,.mdc-checkbox.mdc-checkbox--upgraded .mdc-checkbox__checkmark-path,.mdc-checkbox.mdc-checkbox--upgraded .mdc-checkbox__mixedmark{transition:none}:host{outline:none;display:inline-flex;-webkit-tap-highlight-color:transparent}:host([checked]),:host([indeterminate]){--mdc-ripple-color:var(--mdc-theme-secondary, #018786)}.mdc-checkbox .mdc-checkbox__background::before{content:none}`;

/** @soyCompatible */
let Checkbox = class Checkbox extends CheckboxBase {
};
Checkbox.styles = [styles$6];
Checkbox = __decorate([
    customElement('mwc-checkbox')
], Checkbox);

/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var cssClasses$5 = {
    ROOT: 'mdc-form-field',
};
var strings$3 = {
    LABEL_SELECTOR: '.mdc-form-field > label',
};

/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCFormFieldFoundation = /** @class */ (function (_super) {
    __extends(MDCFormFieldFoundation, _super);
    function MDCFormFieldFoundation(adapter) {
        var _this = _super.call(this, __assign(__assign({}, MDCFormFieldFoundation.defaultAdapter), adapter)) || this;
        _this.click = function () {
            _this.handleClick();
        };
        return _this;
    }
    Object.defineProperty(MDCFormFieldFoundation, "cssClasses", {
        get: function () {
            return cssClasses$5;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCFormFieldFoundation, "strings", {
        get: function () {
            return strings$3;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCFormFieldFoundation, "defaultAdapter", {
        get: function () {
            return {
                activateInputRipple: function () { return undefined; },
                deactivateInputRipple: function () { return undefined; },
                deregisterInteractionHandler: function () { return undefined; },
                registerInteractionHandler: function () { return undefined; },
            };
        },
        enumerable: false,
        configurable: true
    });
    MDCFormFieldFoundation.prototype.init = function () {
        this.adapter.registerInteractionHandler('click', this.click);
    };
    MDCFormFieldFoundation.prototype.destroy = function () {
        this.adapter.deregisterInteractionHandler('click', this.click);
    };
    MDCFormFieldFoundation.prototype.handleClick = function () {
        var _this = this;
        this.adapter.activateInputRipple();
        requestAnimationFrame(function () {
            _this.adapter.deactivateInputRipple();
        });
    };
    return MDCFormFieldFoundation;
}(MDCFoundation));
// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
var MDCFormFieldFoundation$1 = MDCFormFieldFoundation;

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */ // tslint:disable:no-any
/**
 * Specifies an observer callback that is run when the decorated property
 * changes. The observer receives the current and old value as arguments.
 */
const observer = (observer) => 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(proto, propName) => {
    // if we haven't wrapped `updated` in this class, do so
    if (!proto.constructor
        ._observers) {
        proto.constructor._observers = new Map();
        const userUpdated = proto.updated;
        proto.updated = function (changedProperties) {
            userUpdated.call(this, changedProperties);
            changedProperties.forEach((v, k) => {
                const observers = this.constructor
                    ._observers;
                const observer = observers.get(k);
                if (observer !== undefined) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    observer.call(this, this[k], v);
                }
            });
        };
        // clone any existing observers (superclasses)
        // eslint-disable-next-line no-prototype-builtins
    }
    else if (!proto.constructor.hasOwnProperty('_observers')) {
        const observers = proto.constructor._observers;
        proto.constructor._observers = new Map();
        observers.forEach(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (v, k) => proto.constructor._observers.set(k, v));
    }
    // set this method
    proto.constructor._observers.set(propName, observer);
};

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class FormfieldBase extends BaseElement {
    constructor() {
        super(...arguments);
        this.alignEnd = false;
        this.spaceBetween = false;
        this.nowrap = false;
        this.label = '';
        this.mdcFoundationClass = MDCFormFieldFoundation$1;
    }
    createAdapter() {
        return {
            registerInteractionHandler: (type, handler) => {
                this.labelEl.addEventListener(type, handler);
            },
            deregisterInteractionHandler: (type, handler) => {
                this.labelEl.removeEventListener(type, handler);
            },
            activateInputRipple: async () => {
                const input = this.input;
                if (input instanceof FormElement) {
                    const ripple = await input.ripple;
                    if (ripple) {
                        ripple.startPress();
                    }
                }
            },
            deactivateInputRipple: async () => {
                const input = this.input;
                if (input instanceof FormElement) {
                    const ripple = await input.ripple;
                    if (ripple) {
                        ripple.endPress();
                    }
                }
            },
        };
    }
    get input() {
        var _a, _b;
        return (_b = (_a = this.slottedInputs) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : null;
    }
    render() {
        const classes = {
            'mdc-form-field--align-end': this.alignEnd,
            'mdc-form-field--space-between': this.spaceBetween,
            'mdc-form-field--nowrap': this.nowrap
        };
        return html `
      <div class="mdc-form-field ${classMap(classes)}">
        <slot></slot>
        <label class="mdc-label"
               @click="${this._labelClick}">${this.label}</label>
      </div>`;
    }
    _labelClick() {
        const input = this.input;
        if (input) {
            input.focus();
            input.click();
        }
    }
}
__decorate([
    property({ type: Boolean })
], FormfieldBase.prototype, "alignEnd", void 0);
__decorate([
    property({ type: Boolean })
], FormfieldBase.prototype, "spaceBetween", void 0);
__decorate([
    property({ type: Boolean })
], FormfieldBase.prototype, "nowrap", void 0);
__decorate([
    property({ type: String }),
    observer(async function (label) {
        const input = this.input;
        if (input) {
            if (input.localName === 'input') {
                input.setAttribute('aria-label', label);
            }
            else if (input instanceof FormElement) {
                await input.updateComplete;
                input.setAriaLabel(label);
            }
        }
    })
], FormfieldBase.prototype, "label", void 0);
__decorate([
    query('.mdc-form-field')
], FormfieldBase.prototype, "mdcRoot", void 0);
__decorate([
    queryAssignedNodes('', true, '*')
], FormfieldBase.prototype, "slottedInputs", void 0);
__decorate([
    query('label')
], FormfieldBase.prototype, "labelEl", void 0);

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
const styles$5 = css `.mdc-form-field{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-body2-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.875rem;font-size:var(--mdc-typography-body2-font-size, 0.875rem);line-height:1.25rem;line-height:var(--mdc-typography-body2-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-body2-font-weight, 400);letter-spacing:0.0178571429em;letter-spacing:var(--mdc-typography-body2-letter-spacing, 0.0178571429em);text-decoration:inherit;text-decoration:var(--mdc-typography-body2-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-body2-text-transform, inherit);color:rgba(0, 0, 0, 0.87);color:var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87));display:inline-flex;align-items:center;vertical-align:middle}.mdc-form-field>label{margin-left:0;margin-right:auto;padding-left:4px;padding-right:0;order:0}[dir=rtl] .mdc-form-field>label,.mdc-form-field>label[dir=rtl]{margin-left:auto;margin-right:0}[dir=rtl] .mdc-form-field>label,.mdc-form-field>label[dir=rtl]{padding-left:0;padding-right:4px}.mdc-form-field--nowrap>label{text-overflow:ellipsis;overflow:hidden;white-space:nowrap}.mdc-form-field--align-end>label{margin-left:auto;margin-right:0;padding-left:0;padding-right:4px;order:-1}[dir=rtl] .mdc-form-field--align-end>label,.mdc-form-field--align-end>label[dir=rtl]{margin-left:0;margin-right:auto}[dir=rtl] .mdc-form-field--align-end>label,.mdc-form-field--align-end>label[dir=rtl]{padding-left:4px;padding-right:0}.mdc-form-field--space-between{justify-content:space-between}.mdc-form-field--space-between>label{margin:0}[dir=rtl] .mdc-form-field--space-between>label,.mdc-form-field--space-between>label[dir=rtl]{margin:0}:host{display:inline-flex}.mdc-form-field{width:100%}::slotted(*){-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-body2-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.875rem;font-size:var(--mdc-typography-body2-font-size, 0.875rem);line-height:1.25rem;line-height:var(--mdc-typography-body2-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-body2-font-weight, 400);letter-spacing:0.0178571429em;letter-spacing:var(--mdc-typography-body2-letter-spacing, 0.0178571429em);text-decoration:inherit;text-decoration:var(--mdc-typography-body2-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-body2-text-transform, inherit);color:rgba(0, 0, 0, 0.87);color:var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87))}::slotted(mwc-switch){margin-right:10px}[dir=rtl] ::slotted(mwc-switch),::slotted(mwc-switch[dir=rtl]){margin-left:10px}`;

let Formfield = class Formfield extends FormfieldBase {
};
Formfield.styles = [styles$5];
Formfield = __decorate([
    customElement('mwc-formfield')
], Formfield);

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var strings$2 = {
    NOTCH_ELEMENT_SELECTOR: '.mdc-notched-outline__notch',
};
var numbers$2 = {
    // This should stay in sync with $mdc-notched-outline-padding * 2.
    NOTCH_ELEMENT_PADDING: 8,
};
var cssClasses$4 = {
    NO_LABEL: 'mdc-notched-outline--no-label',
    OUTLINE_NOTCHED: 'mdc-notched-outline--notched',
    OUTLINE_UPGRADED: 'mdc-notched-outline--upgraded',
};

/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCNotchedOutlineFoundation = /** @class */ (function (_super) {
    __extends(MDCNotchedOutlineFoundation, _super);
    function MDCNotchedOutlineFoundation(adapter) {
        return _super.call(this, __assign(__assign({}, MDCNotchedOutlineFoundation.defaultAdapter), adapter)) || this;
    }
    Object.defineProperty(MDCNotchedOutlineFoundation, "strings", {
        get: function () {
            return strings$2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCNotchedOutlineFoundation, "cssClasses", {
        get: function () {
            return cssClasses$4;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCNotchedOutlineFoundation, "numbers", {
        get: function () {
            return numbers$2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCNotchedOutlineFoundation, "defaultAdapter", {
        /**
         * See {@link MDCNotchedOutlineAdapter} for typing information on parameters and return types.
         */
        get: function () {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                addClass: function () { return undefined; },
                removeClass: function () { return undefined; },
                setNotchWidthProperty: function () { return undefined; },
                removeNotchWidthProperty: function () { return undefined; },
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Adds the outline notched selector and updates the notch width calculated based off of notchWidth.
     */
    MDCNotchedOutlineFoundation.prototype.notch = function (notchWidth) {
        var OUTLINE_NOTCHED = MDCNotchedOutlineFoundation.cssClasses.OUTLINE_NOTCHED;
        if (notchWidth > 0) {
            notchWidth += numbers$2.NOTCH_ELEMENT_PADDING; // Add padding from left/right.
        }
        this.adapter.setNotchWidthProperty(notchWidth);
        this.adapter.addClass(OUTLINE_NOTCHED);
    };
    /**
     * Removes notched outline selector to close the notch in the outline.
     */
    MDCNotchedOutlineFoundation.prototype.closeNotch = function () {
        var OUTLINE_NOTCHED = MDCNotchedOutlineFoundation.cssClasses.OUTLINE_NOTCHED;
        this.adapter.removeClass(OUTLINE_NOTCHED);
        this.adapter.removeNotchWidthProperty();
    };
    return MDCNotchedOutlineFoundation;
}(MDCFoundation));

class NotchedOutlineBase extends BaseElement {
    constructor() {
        super(...arguments);
        this.mdcFoundationClass = MDCNotchedOutlineFoundation;
        this.width = 0;
        this.open = false;
        this.lastOpen = this.open;
    }
    createAdapter() {
        return {
            addClass: (className) => this.mdcRoot.classList.add(className),
            removeClass: (className) => this.mdcRoot.classList.remove(className),
            setNotchWidthProperty: (width) => this.notchElement.style.setProperty('width', `${width}px`),
            removeNotchWidthProperty: () => this.notchElement.style.removeProperty('width'),
        };
    }
    openOrClose(shouldOpen, width) {
        if (!this.mdcFoundation) {
            return;
        }
        if (shouldOpen && width !== undefined) {
            this.mdcFoundation.notch(width);
        }
        else {
            this.mdcFoundation.closeNotch();
        }
    }
    render() {
        this.openOrClose(this.open, this.width);
        const classes = classMap({
            'mdc-notched-outline--notched': this.open,
        });
        return html `
      <span class="mdc-notched-outline ${classes}">
        <span class="mdc-notched-outline__leading"></span>
        <span class="mdc-notched-outline__notch">
          <slot></slot>
        </span>
        <span class="mdc-notched-outline__trailing"></span>
      </span>`;
    }
}
__decorate([
    query('.mdc-notched-outline')
], NotchedOutlineBase.prototype, "mdcRoot", void 0);
__decorate([
    property({ type: Number })
], NotchedOutlineBase.prototype, "width", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], NotchedOutlineBase.prototype, "open", void 0);
__decorate([
    query('.mdc-notched-outline__notch')
], NotchedOutlineBase.prototype, "notchElement", void 0);

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
const styles$4 = css `.mdc-notched-outline{display:flex;position:absolute;top:0;right:0;left:0;box-sizing:border-box;width:100%;max-width:100%;height:100%;text-align:left;pointer-events:none}[dir=rtl] .mdc-notched-outline,.mdc-notched-outline[dir=rtl]{text-align:right}.mdc-notched-outline__leading,.mdc-notched-outline__notch,.mdc-notched-outline__trailing{box-sizing:border-box;height:100%;border-top:1px solid;border-bottom:1px solid;pointer-events:none}.mdc-notched-outline__leading{border-left:1px solid;border-right:none;width:12px}[dir=rtl] .mdc-notched-outline__leading,.mdc-notched-outline__leading[dir=rtl]{border-left:none;border-right:1px solid}.mdc-notched-outline__trailing{border-left:none;border-right:1px solid;flex-grow:1}[dir=rtl] .mdc-notched-outline__trailing,.mdc-notched-outline__trailing[dir=rtl]{border-left:1px solid;border-right:none}.mdc-notched-outline__notch{flex:0 0 auto;width:auto;max-width:calc(100% - 12px * 2)}.mdc-notched-outline .mdc-floating-label{display:inline-block;position:relative;max-width:100%}.mdc-notched-outline .mdc-floating-label--float-above{text-overflow:clip}.mdc-notched-outline--upgraded .mdc-floating-label--float-above{max-width:calc(100% / 0.75)}.mdc-notched-outline--notched .mdc-notched-outline__notch{padding-left:0;padding-right:8px;border-top:none}[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch,.mdc-notched-outline--notched .mdc-notched-outline__notch[dir=rtl]{padding-left:8px;padding-right:0}.mdc-notched-outline--no-label .mdc-notched-outline__notch{display:none}:host{display:block;position:absolute;right:0;left:0;box-sizing:border-box;width:100%;max-width:100%;height:100%;text-align:left;pointer-events:none}[dir=rtl] :host,:host([dir=rtl]){text-align:right}::slotted(.mdc-floating-label){display:inline-block;position:relative;top:17px;bottom:auto;max-width:100%}::slotted(.mdc-floating-label--float-above){text-overflow:clip}.mdc-notched-outline--upgraded ::slotted(.mdc-floating-label--float-above){max-width:calc(100% / 0.75)}.mdc-notched-outline .mdc-notched-outline__leading{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:4px;border-bottom-left-radius:var(--mdc-shape-small, 4px)}[dir=rtl] .mdc-notched-outline .mdc-notched-outline__leading,.mdc-notched-outline .mdc-notched-outline__leading[dir=rtl]{border-top-left-radius:0;border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:4px;border-bottom-right-radius:var(--mdc-shape-small, 4px);border-bottom-left-radius:0}@supports(top: max(0%)){.mdc-notched-outline .mdc-notched-outline__leading{width:max(12px, var(--mdc-shape-small, 4px))}}@supports(top: max(0%)){.mdc-notched-outline .mdc-notched-outline__notch{max-width:calc(100% - max(12px, var(--mdc-shape-small, 4px)) * 2)}}.mdc-notched-outline .mdc-notched-outline__trailing{border-top-left-radius:0;border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:4px;border-bottom-right-radius:var(--mdc-shape-small, 4px);border-bottom-left-radius:0}[dir=rtl] .mdc-notched-outline .mdc-notched-outline__trailing,.mdc-notched-outline .mdc-notched-outline__trailing[dir=rtl]{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:4px;border-bottom-left-radius:var(--mdc-shape-small, 4px)}.mdc-notched-outline__leading,.mdc-notched-outline__notch,.mdc-notched-outline__trailing{border-color:var(--mdc-notched-outline-border-color, var(--mdc-theme-primary, #6200ee));border-width:1px;border-width:var(--mdc-notched-outline-stroke-width, 1px)}.mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:0;padding-top:var(--mdc-notched-outline-notch-offset, 0)}`;

let NotchedOutline = class NotchedOutline extends NotchedOutlineBase {
};
NotchedOutline.styles = [styles$4];
NotchedOutline = __decorate([
    customElement('mwc-notched-outline')
], NotchedOutline);

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var cssClasses$3 = {
    LABEL_FLOAT_ABOVE: 'mdc-floating-label--float-above',
    LABEL_REQUIRED: 'mdc-floating-label--required',
    LABEL_SHAKE: 'mdc-floating-label--shake',
    ROOT: 'mdc-floating-label',
};

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCFloatingLabelFoundation = /** @class */ (function (_super) {
    __extends(MDCFloatingLabelFoundation, _super);
    function MDCFloatingLabelFoundation(adapter) {
        var _this = _super.call(this, __assign(__assign({}, MDCFloatingLabelFoundation.defaultAdapter), adapter)) || this;
        _this.shakeAnimationEndHandler = function () {
            _this.handleShakeAnimationEnd();
        };
        return _this;
    }
    Object.defineProperty(MDCFloatingLabelFoundation, "cssClasses", {
        get: function () {
            return cssClasses$3;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCFloatingLabelFoundation, "defaultAdapter", {
        /**
         * See {@link MDCFloatingLabelAdapter} for typing information on parameters and return types.
         */
        get: function () {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                addClass: function () { return undefined; },
                removeClass: function () { return undefined; },
                getWidth: function () { return 0; },
                registerInteractionHandler: function () { return undefined; },
                deregisterInteractionHandler: function () { return undefined; },
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: false,
        configurable: true
    });
    MDCFloatingLabelFoundation.prototype.init = function () {
        this.adapter.registerInteractionHandler('animationend', this.shakeAnimationEndHandler);
    };
    MDCFloatingLabelFoundation.prototype.destroy = function () {
        this.adapter.deregisterInteractionHandler('animationend', this.shakeAnimationEndHandler);
    };
    /**
     * Returns the width of the label element.
     */
    MDCFloatingLabelFoundation.prototype.getWidth = function () {
        return this.adapter.getWidth();
    };
    /**
     * Styles the label to produce a shake animation to indicate an error.
     * @param shouldShake If true, adds the shake CSS class; otherwise, removes shake class.
     */
    MDCFloatingLabelFoundation.prototype.shake = function (shouldShake) {
        var LABEL_SHAKE = MDCFloatingLabelFoundation.cssClasses.LABEL_SHAKE;
        if (shouldShake) {
            this.adapter.addClass(LABEL_SHAKE);
        }
        else {
            this.adapter.removeClass(LABEL_SHAKE);
        }
    };
    /**
     * Styles the label to float or dock.
     * @param shouldFloat If true, adds the float CSS class; otherwise, removes float and shake classes to dock the label.
     */
    MDCFloatingLabelFoundation.prototype.float = function (shouldFloat) {
        var _a = MDCFloatingLabelFoundation.cssClasses, LABEL_FLOAT_ABOVE = _a.LABEL_FLOAT_ABOVE, LABEL_SHAKE = _a.LABEL_SHAKE;
        if (shouldFloat) {
            this.adapter.addClass(LABEL_FLOAT_ABOVE);
        }
        else {
            this.adapter.removeClass(LABEL_FLOAT_ABOVE);
            this.adapter.removeClass(LABEL_SHAKE);
        }
    };
    /**
     * Styles the label as required.
     * @param isRequired If true, adds an asterisk to the label, indicating that it is required.
     */
    MDCFloatingLabelFoundation.prototype.setRequired = function (isRequired) {
        var LABEL_REQUIRED = MDCFloatingLabelFoundation.cssClasses.LABEL_REQUIRED;
        if (isRequired) {
            this.adapter.addClass(LABEL_REQUIRED);
        }
        else {
            this.adapter.removeClass(LABEL_REQUIRED);
        }
    };
    MDCFloatingLabelFoundation.prototype.handleShakeAnimationEnd = function () {
        var LABEL_SHAKE = MDCFloatingLabelFoundation.cssClasses.LABEL_SHAKE;
        this.adapter.removeClass(LABEL_SHAKE);
    };
    return MDCFloatingLabelFoundation;
}(MDCFoundation));

/**
 * @license
 * Copyright (c) 2021 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
const PartType = {
    ATTRIBUTE: 1,
    CHILD: 2,
    PROPERTY: 3,
    BOOLEAN_ATTRIBUTE: 4,
    EVENT: 5,
    ELEMENT: 6,
};
class ChildPart {
    constructor(legacyPart) {
        this.type = PartType.CHILD;
        this.options = legacyPart.options;
        this.legacyPart = legacyPart;
    }
    get parentNode() {
        return this.legacyPart.startNode.parentNode;
    }
    get startNode() {
        return this.legacyPart.startNode;
    }
    get endNode() {
        return this.legacyPart.endNode;
    }
}
class AttributePart {
    constructor(legacyPart) {
        this.legacyPart = legacyPart;
        this.type = (legacyPart instanceof PropertyPart) ?
            PartType.PROPERTY :
            PartType.ATTRIBUTE;
    }
    get options() {
        return undefined;
    }
    get name() {
        return this.legacyPart.committer.name;
    }
    get element() {
        return this.legacyPart.committer.element;
    }
    /**
     * If this attribute part represents an interpolation, this contains the
     * static strings of the interpolation. For single-value, complete bindings,
     * this is undefined.
     */
    get strings() {
        return this.legacyPart.committer.strings;
    }
    get tagName() {
        return this.element.tagName;
    }
}
class BooleanAttributePart {
    constructor(legacyPart) {
        this.type = PartType.BOOLEAN_ATTRIBUTE;
        this.legacyPart = legacyPart;
    }
    get options() {
        return undefined;
    }
    get name() {
        return this.legacyPart.name;
    }
    get element() {
        return this.legacyPart.element;
    }
    /**
     * If this attribute part represents an interpolation, this contains the
     * static strings of the interpolation. For single-value, complete bindings,
     * this is undefined.
     */
    get strings() {
        return this.legacyPart.strings;
    }
    get tagName() {
        return this.element.tagName;
    }
}
class EventPart {
    constructor(legacyPart) {
        this.type = PartType.EVENT;
        this.legacyPart = legacyPart;
    }
    get options() {
        return undefined;
    }
    get name() {
        return this.legacyPart.eventName;
    }
    get element() {
        return this.legacyPart.element;
    }
    /**
     * If this attribute part represents an interpolation, this contains the
     * static strings of the interpolation. For single-value, complete bindings,
     * this is undefined.
     */
    get strings() {
        return undefined;
    }
    get tagName() {
        return this.element.tagName;
    }
    handleEvent(event) {
        this.legacyPart.handleEvent(event);
    }
}
// no equivalent for ElementPart in v1
function legacyPartToPart(part) {
    if (part instanceof NodePart$1) {
        return new ChildPart(part);
    }
    else if (part instanceof EventPart$1) {
        return new EventPart(part);
    }
    else if (part instanceof BooleanAttributePart$1) {
        return new BooleanAttributePart(part);
    }
    else if (part instanceof PropertyPart ||
        part instanceof AttributePart$2) {
        return new AttributePart(part);
    }
    // ElementPartInfo doesn't exist in lit-html v1
    throw new Error(`Unknown part type`);
}
/**
 * Base class for creating custom directives. Users should extend this class,
 * implement `render` and/or `update`, and then pass their subclass to
 * `directive`.
 */
class Directive {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor(_partInfo) {
    }
    update(_part, args) {
        return this.render(...args);
    }
}
/**
 * Creates a user-facing directive function from a Directive class. This
 * function has the same parameters as the directive's render() method.
 *
 * N.B. In Lit 2, the directive will lose state if another directive is
 * executed on the same part as the directive instance is destroyed. This
 * version deviates from this behavior and will keep its state.
 */
function directive(directiveClass) {
    const partToInstance = new WeakMap();
    const result = directive$2((...args) => {
        return (part) => {
            const cached = partToInstance.get(part);
            let modernPart, instance;
            if (cached === undefined) {
                modernPart = legacyPartToPart(part);
                instance = new directiveClass(modernPart);
                partToInstance.set(part, [modernPart, instance]);
            }
            else {
                modernPart = cached[0];
                instance = cached[1];
            }
            part.setValue(instance.update(modernPart, args));
            part.commit();
        };
    });
    return result;
}

const createAdapter$1 = (labelElement) => {
    return {
        addClass: (className) => labelElement.classList.add(className),
        removeClass: (className) => labelElement.classList.remove(className),
        getWidth: () => labelElement.scrollWidth,
        registerInteractionHandler: (evtType, handler) => {
            labelElement.addEventListener(evtType, handler);
        },
        deregisterInteractionHandler: (evtType, handler) => {
            labelElement.removeEventListener(evtType, handler);
        },
    };
};
class FloatingLabelDirective extends Directive {
    constructor(partInfo) {
        super(partInfo);
        this.foundation = null;
        this.previousPart = null;
        switch (partInfo.type) {
            // Only allow Attribute and Part bindings
            case PartType.ATTRIBUTE:
            case PartType.PROPERTY:
                break;
            default:
                throw new Error('FloatingLabel directive only support attribute and property parts');
        }
    }
    /**
     * There is no PropertyPart in Lit 2 so far. For more info see:
     * https://github.com/lit/lit/issues/1863
     */
    update(part, [label]) {
        if (part !== this.previousPart) {
            if (this.foundation) {
                this.foundation.destroy();
            }
            this.previousPart = part;
            const labelElement = part.element;
            labelElement.classList.add('mdc-floating-label');
            const adapter = createAdapter$1(labelElement);
            this.foundation = new MDCFloatingLabelFoundation(adapter);
            this.foundation.init();
        }
        return this.render(label);
    }
    render(_label) {
        return this.foundation;
    }
}
const floatingLabel = directive(FloatingLabelDirective);

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var cssClasses$2 = {
    LINE_RIPPLE_ACTIVE: 'mdc-line-ripple--active',
    LINE_RIPPLE_DEACTIVATING: 'mdc-line-ripple--deactivating',
};

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var MDCLineRippleFoundation = /** @class */ (function (_super) {
    __extends(MDCLineRippleFoundation, _super);
    function MDCLineRippleFoundation(adapter) {
        var _this = _super.call(this, __assign(__assign({}, MDCLineRippleFoundation.defaultAdapter), adapter)) || this;
        _this.transitionEndHandler = function (evt) {
            _this.handleTransitionEnd(evt);
        };
        return _this;
    }
    Object.defineProperty(MDCLineRippleFoundation, "cssClasses", {
        get: function () {
            return cssClasses$2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCLineRippleFoundation, "defaultAdapter", {
        /**
         * See {@link MDCLineRippleAdapter} for typing information on parameters and return types.
         */
        get: function () {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                addClass: function () { return undefined; },
                removeClass: function () { return undefined; },
                hasClass: function () { return false; },
                setStyle: function () { return undefined; },
                registerEventHandler: function () { return undefined; },
                deregisterEventHandler: function () { return undefined; },
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: false,
        configurable: true
    });
    MDCLineRippleFoundation.prototype.init = function () {
        this.adapter.registerEventHandler('transitionend', this.transitionEndHandler);
    };
    MDCLineRippleFoundation.prototype.destroy = function () {
        this.adapter.deregisterEventHandler('transitionend', this.transitionEndHandler);
    };
    MDCLineRippleFoundation.prototype.activate = function () {
        this.adapter.removeClass(cssClasses$2.LINE_RIPPLE_DEACTIVATING);
        this.adapter.addClass(cssClasses$2.LINE_RIPPLE_ACTIVE);
    };
    MDCLineRippleFoundation.prototype.setRippleCenter = function (xCoordinate) {
        this.adapter.setStyle('transform-origin', xCoordinate + "px center");
    };
    MDCLineRippleFoundation.prototype.deactivate = function () {
        this.adapter.addClass(cssClasses$2.LINE_RIPPLE_DEACTIVATING);
    };
    MDCLineRippleFoundation.prototype.handleTransitionEnd = function (evt) {
        // Wait for the line ripple to be either transparent or opaque
        // before emitting the animation end event
        var isDeactivating = this.adapter.hasClass(cssClasses$2.LINE_RIPPLE_DEACTIVATING);
        if (evt.propertyName === 'opacity') {
            if (isDeactivating) {
                this.adapter.removeClass(cssClasses$2.LINE_RIPPLE_ACTIVE);
                this.adapter.removeClass(cssClasses$2.LINE_RIPPLE_DEACTIVATING);
            }
        }
    };
    return MDCLineRippleFoundation;
}(MDCFoundation));

const createAdapter = (lineElement) => {
    return {
        addClass: (className) => lineElement.classList.add(className),
        removeClass: (className) => lineElement.classList.remove(className),
        hasClass: (className) => lineElement.classList.contains(className),
        setStyle: (propertyName, value) => lineElement.style.setProperty(propertyName, value),
        registerEventHandler: (evtType, handler) => {
            lineElement.addEventListener(evtType, handler);
        },
        deregisterEventHandler: (evtType, handler) => {
            lineElement.removeEventListener(evtType, handler);
        },
    };
};
class LineRippleDirective extends Directive {
    constructor(partInfo) {
        super(partInfo);
        this.previousPart = null;
        this.foundation = null;
        switch (partInfo.type) {
            case PartType.ATTRIBUTE:
            case PartType.PROPERTY:
                return;
            default:
                throw new Error('LineRipple only support attribute and property parts.');
        }
    }
    /**
     * There is no PropertyPart in Lit 2 so far. For more info see:
     * https://github.com/lit/lit/issues/1863
     */
    update(part, _params) {
        if (this.previousPart !== part) {
            if (this.foundation) {
                this.foundation.destroy();
            }
            this.previousPart = part;
            const lineElement = part.element;
            lineElement.classList.add('mdc-line-ripple');
            const adapter = createAdapter(lineElement);
            this.foundation = new MDCLineRippleFoundation(adapter);
            this.foundation.init();
        }
        return this.render();
    }
    render() {
        return this.foundation;
    }
}
const lineRipple = directive(LineRippleDirective);

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var strings$1 = {
    ARIA_CONTROLS: 'aria-controls',
    ARIA_DESCRIBEDBY: 'aria-describedby',
    INPUT_SELECTOR: '.mdc-text-field__input',
    LABEL_SELECTOR: '.mdc-floating-label',
    LEADING_ICON_SELECTOR: '.mdc-text-field__icon--leading',
    LINE_RIPPLE_SELECTOR: '.mdc-line-ripple',
    OUTLINE_SELECTOR: '.mdc-notched-outline',
    PREFIX_SELECTOR: '.mdc-text-field__affix--prefix',
    SUFFIX_SELECTOR: '.mdc-text-field__affix--suffix',
    TRAILING_ICON_SELECTOR: '.mdc-text-field__icon--trailing'
};
var cssClasses$1 = {
    DISABLED: 'mdc-text-field--disabled',
    FOCUSED: 'mdc-text-field--focused',
    HELPER_LINE: 'mdc-text-field-helper-line',
    INVALID: 'mdc-text-field--invalid',
    LABEL_FLOATING: 'mdc-text-field--label-floating',
    NO_LABEL: 'mdc-text-field--no-label',
    OUTLINED: 'mdc-text-field--outlined',
    ROOT: 'mdc-text-field',
    TEXTAREA: 'mdc-text-field--textarea',
    WITH_LEADING_ICON: 'mdc-text-field--with-leading-icon',
    WITH_TRAILING_ICON: 'mdc-text-field--with-trailing-icon',
};
var numbers$1 = {
    LABEL_SCALE: 0.75,
};
/**
 * Whitelist based off of https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation
 * under the "Validation-related attributes" section.
 */
var VALIDATION_ATTR_WHITELIST = [
    'pattern', 'min', 'max', 'required', 'step', 'minlength', 'maxlength',
];
/**
 * Label should always float for these types as they show some UI even if value is empty.
 */
var ALWAYS_FLOAT_TYPES = [
    'color', 'date', 'datetime-local', 'month', 'range', 'time', 'week',
];

/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var POINTERDOWN_EVENTS = ['mousedown', 'touchstart'];
var INTERACTION_EVENTS = ['click', 'keydown'];
var MDCTextFieldFoundation = /** @class */ (function (_super) {
    __extends(MDCTextFieldFoundation, _super);
    /**
     * @param adapter
     * @param foundationMap Map from subcomponent names to their subfoundations.
     */
    function MDCTextFieldFoundation(adapter, foundationMap) {
        if (foundationMap === void 0) { foundationMap = {}; }
        var _this = _super.call(this, __assign(__assign({}, MDCTextFieldFoundation.defaultAdapter), adapter)) || this;
        _this.isFocused = false;
        _this.receivedUserInput = false;
        _this.valid = true;
        _this.useNativeValidation = true;
        _this.validateOnValueChange = true;
        _this.helperText = foundationMap.helperText;
        _this.characterCounter = foundationMap.characterCounter;
        _this.leadingIcon = foundationMap.leadingIcon;
        _this.trailingIcon = foundationMap.trailingIcon;
        _this.inputFocusHandler = function () {
            _this.activateFocus();
        };
        _this.inputBlurHandler = function () {
            _this.deactivateFocus();
        };
        _this.inputInputHandler = function () {
            _this.handleInput();
        };
        _this.setPointerXOffset = function (evt) {
            _this.setTransformOrigin(evt);
        };
        _this.textFieldInteractionHandler = function () {
            _this.handleTextFieldInteraction();
        };
        _this.validationAttributeChangeHandler = function (attributesList) {
            _this.handleValidationAttributeChange(attributesList);
        };
        return _this;
    }
    Object.defineProperty(MDCTextFieldFoundation, "cssClasses", {
        get: function () {
            return cssClasses$1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCTextFieldFoundation, "strings", {
        get: function () {
            return strings$1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCTextFieldFoundation, "numbers", {
        get: function () {
            return numbers$1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCTextFieldFoundation.prototype, "shouldAlwaysFloat", {
        get: function () {
            var type = this.getNativeInput().type;
            return ALWAYS_FLOAT_TYPES.indexOf(type) >= 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCTextFieldFoundation.prototype, "shouldFloat", {
        get: function () {
            return this.shouldAlwaysFloat || this.isFocused || !!this.getValue() ||
                this.isBadInput();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCTextFieldFoundation.prototype, "shouldShake", {
        get: function () {
            return !this.isFocused && !this.isValid() && !!this.getValue();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MDCTextFieldFoundation, "defaultAdapter", {
        /**
         * See {@link MDCTextFieldAdapter} for typing information on parameters and
         * return types.
         */
        get: function () {
            // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
            return {
                addClass: function () { return undefined; },
                removeClass: function () { return undefined; },
                hasClass: function () { return true; },
                setInputAttr: function () { return undefined; },
                removeInputAttr: function () { return undefined; },
                registerTextFieldInteractionHandler: function () { return undefined; },
                deregisterTextFieldInteractionHandler: function () { return undefined; },
                registerInputInteractionHandler: function () { return undefined; },
                deregisterInputInteractionHandler: function () { return undefined; },
                registerValidationAttributeChangeHandler: function () {
                    return new MutationObserver(function () { return undefined; });
                },
                deregisterValidationAttributeChangeHandler: function () { return undefined; },
                getNativeInput: function () { return null; },
                isFocused: function () { return false; },
                activateLineRipple: function () { return undefined; },
                deactivateLineRipple: function () { return undefined; },
                setLineRippleTransformOrigin: function () { return undefined; },
                shakeLabel: function () { return undefined; },
                floatLabel: function () { return undefined; },
                setLabelRequired: function () { return undefined; },
                hasLabel: function () { return false; },
                getLabelWidth: function () { return 0; },
                hasOutline: function () { return false; },
                notchOutline: function () { return undefined; },
                closeOutline: function () { return undefined; },
            };
            // tslint:enable:object-literal-sort-keys
        },
        enumerable: false,
        configurable: true
    });
    MDCTextFieldFoundation.prototype.init = function () {
        var e_1, _a, e_2, _b;
        if (this.adapter.hasLabel() && this.getNativeInput().required) {
            this.adapter.setLabelRequired(true);
        }
        if (this.adapter.isFocused()) {
            this.inputFocusHandler();
        }
        else if (this.adapter.hasLabel() && this.shouldFloat) {
            this.notchOutline(true);
            this.adapter.floatLabel(true);
            this.styleFloating(true);
        }
        this.adapter.registerInputInteractionHandler('focus', this.inputFocusHandler);
        this.adapter.registerInputInteractionHandler('blur', this.inputBlurHandler);
        this.adapter.registerInputInteractionHandler('input', this.inputInputHandler);
        try {
            for (var POINTERDOWN_EVENTS_1 = __values(POINTERDOWN_EVENTS), POINTERDOWN_EVENTS_1_1 = POINTERDOWN_EVENTS_1.next(); !POINTERDOWN_EVENTS_1_1.done; POINTERDOWN_EVENTS_1_1 = POINTERDOWN_EVENTS_1.next()) {
                var evtType = POINTERDOWN_EVENTS_1_1.value;
                this.adapter.registerInputInteractionHandler(evtType, this.setPointerXOffset);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (POINTERDOWN_EVENTS_1_1 && !POINTERDOWN_EVENTS_1_1.done && (_a = POINTERDOWN_EVENTS_1.return)) _a.call(POINTERDOWN_EVENTS_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        try {
            for (var INTERACTION_EVENTS_1 = __values(INTERACTION_EVENTS), INTERACTION_EVENTS_1_1 = INTERACTION_EVENTS_1.next(); !INTERACTION_EVENTS_1_1.done; INTERACTION_EVENTS_1_1 = INTERACTION_EVENTS_1.next()) {
                var evtType = INTERACTION_EVENTS_1_1.value;
                this.adapter.registerTextFieldInteractionHandler(evtType, this.textFieldInteractionHandler);
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (INTERACTION_EVENTS_1_1 && !INTERACTION_EVENTS_1_1.done && (_b = INTERACTION_EVENTS_1.return)) _b.call(INTERACTION_EVENTS_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        this.validationObserver =
            this.adapter.registerValidationAttributeChangeHandler(this.validationAttributeChangeHandler);
        this.setcharacterCounter(this.getValue().length);
    };
    MDCTextFieldFoundation.prototype.destroy = function () {
        var e_3, _a, e_4, _b;
        this.adapter.deregisterInputInteractionHandler('focus', this.inputFocusHandler);
        this.adapter.deregisterInputInteractionHandler('blur', this.inputBlurHandler);
        this.adapter.deregisterInputInteractionHandler('input', this.inputInputHandler);
        try {
            for (var POINTERDOWN_EVENTS_2 = __values(POINTERDOWN_EVENTS), POINTERDOWN_EVENTS_2_1 = POINTERDOWN_EVENTS_2.next(); !POINTERDOWN_EVENTS_2_1.done; POINTERDOWN_EVENTS_2_1 = POINTERDOWN_EVENTS_2.next()) {
                var evtType = POINTERDOWN_EVENTS_2_1.value;
                this.adapter.deregisterInputInteractionHandler(evtType, this.setPointerXOffset);
            }
        }
        catch (e_3_1) { e_3 = { error: e_3_1 }; }
        finally {
            try {
                if (POINTERDOWN_EVENTS_2_1 && !POINTERDOWN_EVENTS_2_1.done && (_a = POINTERDOWN_EVENTS_2.return)) _a.call(POINTERDOWN_EVENTS_2);
            }
            finally { if (e_3) throw e_3.error; }
        }
        try {
            for (var INTERACTION_EVENTS_2 = __values(INTERACTION_EVENTS), INTERACTION_EVENTS_2_1 = INTERACTION_EVENTS_2.next(); !INTERACTION_EVENTS_2_1.done; INTERACTION_EVENTS_2_1 = INTERACTION_EVENTS_2.next()) {
                var evtType = INTERACTION_EVENTS_2_1.value;
                this.adapter.deregisterTextFieldInteractionHandler(evtType, this.textFieldInteractionHandler);
            }
        }
        catch (e_4_1) { e_4 = { error: e_4_1 }; }
        finally {
            try {
                if (INTERACTION_EVENTS_2_1 && !INTERACTION_EVENTS_2_1.done && (_b = INTERACTION_EVENTS_2.return)) _b.call(INTERACTION_EVENTS_2);
            }
            finally { if (e_4) throw e_4.error; }
        }
        this.adapter.deregisterValidationAttributeChangeHandler(this.validationObserver);
    };
    /**
     * Handles user interactions with the Text Field.
     */
    MDCTextFieldFoundation.prototype.handleTextFieldInteraction = function () {
        var nativeInput = this.adapter.getNativeInput();
        if (nativeInput && nativeInput.disabled) {
            return;
        }
        this.receivedUserInput = true;
    };
    /**
     * Handles validation attribute changes
     */
    MDCTextFieldFoundation.prototype.handleValidationAttributeChange = function (attributesList) {
        var _this = this;
        attributesList.some(function (attributeName) {
            if (VALIDATION_ATTR_WHITELIST.indexOf(attributeName) > -1) {
                _this.styleValidity(true);
                _this.adapter.setLabelRequired(_this.getNativeInput().required);
                return true;
            }
            return false;
        });
        if (attributesList.indexOf('maxlength') > -1) {
            this.setcharacterCounter(this.getValue().length);
        }
    };
    /**
     * Opens/closes the notched outline.
     */
    MDCTextFieldFoundation.prototype.notchOutline = function (openNotch) {
        if (!this.adapter.hasOutline() || !this.adapter.hasLabel()) {
            return;
        }
        if (openNotch) {
            var labelWidth = this.adapter.getLabelWidth() * numbers$1.LABEL_SCALE;
            this.adapter.notchOutline(labelWidth);
        }
        else {
            this.adapter.closeOutline();
        }
    };
    /**
     * Activates the text field focus state.
     */
    MDCTextFieldFoundation.prototype.activateFocus = function () {
        this.isFocused = true;
        this.styleFocused(this.isFocused);
        this.adapter.activateLineRipple();
        if (this.adapter.hasLabel()) {
            this.notchOutline(this.shouldFloat);
            this.adapter.floatLabel(this.shouldFloat);
            this.styleFloating(this.shouldFloat);
            this.adapter.shakeLabel(this.shouldShake);
        }
        if (this.helperText &&
            (this.helperText.isPersistent() || !this.helperText.isValidation() ||
                !this.valid)) {
            this.helperText.showToScreenReader();
        }
    };
    /**
     * Sets the line ripple's transform origin, so that the line ripple activate
     * animation will animate out from the user's click location.
     */
    MDCTextFieldFoundation.prototype.setTransformOrigin = function (evt) {
        if (this.isDisabled() || this.adapter.hasOutline()) {
            return;
        }
        var touches = evt.touches;
        var targetEvent = touches ? touches[0] : evt;
        var targetClientRect = targetEvent.target.getBoundingClientRect();
        var normalizedX = targetEvent.clientX - targetClientRect.left;
        this.adapter.setLineRippleTransformOrigin(normalizedX);
    };
    /**
     * Handles input change of text input and text area.
     */
    MDCTextFieldFoundation.prototype.handleInput = function () {
        this.autoCompleteFocus();
        this.setcharacterCounter(this.getValue().length);
    };
    /**
     * Activates the Text Field's focus state in cases when the input value
     * changes without user input (e.g. programmatically).
     */
    MDCTextFieldFoundation.prototype.autoCompleteFocus = function () {
        if (!this.receivedUserInput) {
            this.activateFocus();
        }
    };
    /**
     * Deactivates the Text Field's focus state.
     */
    MDCTextFieldFoundation.prototype.deactivateFocus = function () {
        this.isFocused = false;
        this.adapter.deactivateLineRipple();
        var isValid = this.isValid();
        this.styleValidity(isValid);
        this.styleFocused(this.isFocused);
        if (this.adapter.hasLabel()) {
            this.notchOutline(this.shouldFloat);
            this.adapter.floatLabel(this.shouldFloat);
            this.styleFloating(this.shouldFloat);
            this.adapter.shakeLabel(this.shouldShake);
        }
        if (!this.shouldFloat) {
            this.receivedUserInput = false;
        }
    };
    MDCTextFieldFoundation.prototype.getValue = function () {
        return this.getNativeInput().value;
    };
    /**
     * @param value The value to set on the input Element.
     */
    MDCTextFieldFoundation.prototype.setValue = function (value) {
        // Prevent Safari from moving the caret to the end of the input when the
        // value has not changed.
        if (this.getValue() !== value) {
            this.getNativeInput().value = value;
        }
        this.setcharacterCounter(value.length);
        if (this.validateOnValueChange) {
            var isValid = this.isValid();
            this.styleValidity(isValid);
        }
        if (this.adapter.hasLabel()) {
            this.notchOutline(this.shouldFloat);
            this.adapter.floatLabel(this.shouldFloat);
            this.styleFloating(this.shouldFloat);
            if (this.validateOnValueChange) {
                this.adapter.shakeLabel(this.shouldShake);
            }
        }
    };
    /**
     * @return The custom validity state, if set; otherwise, the result of a
     *     native validity check.
     */
    MDCTextFieldFoundation.prototype.isValid = function () {
        return this.useNativeValidation ? this.isNativeInputValid() : this.valid;
    };
    /**
     * @param isValid Sets the custom validity state of the Text Field.
     */
    MDCTextFieldFoundation.prototype.setValid = function (isValid) {
        this.valid = isValid;
        this.styleValidity(isValid);
        var shouldShake = !isValid && !this.isFocused && !!this.getValue();
        if (this.adapter.hasLabel()) {
            this.adapter.shakeLabel(shouldShake);
        }
    };
    /**
     * @param shouldValidate Whether or not validity should be updated on
     *     value change.
     */
    MDCTextFieldFoundation.prototype.setValidateOnValueChange = function (shouldValidate) {
        this.validateOnValueChange = shouldValidate;
    };
    /**
     * @return Whether or not validity should be updated on value change. `true`
     *     by default.
     */
    MDCTextFieldFoundation.prototype.getValidateOnValueChange = function () {
        return this.validateOnValueChange;
    };
    /**
     * Enables or disables the use of native validation. Use this for custom
     * validation.
     * @param useNativeValidation Set this to false to ignore native input
     *     validation.
     */
    MDCTextFieldFoundation.prototype.setUseNativeValidation = function (useNativeValidation) {
        this.useNativeValidation = useNativeValidation;
    };
    MDCTextFieldFoundation.prototype.isDisabled = function () {
        return this.getNativeInput().disabled;
    };
    /**
     * @param disabled Sets the text-field disabled or enabled.
     */
    MDCTextFieldFoundation.prototype.setDisabled = function (disabled) {
        this.getNativeInput().disabled = disabled;
        this.styleDisabled(disabled);
    };
    /**
     * @param content Sets the content of the helper text.
     */
    MDCTextFieldFoundation.prototype.setHelperTextContent = function (content) {
        if (this.helperText) {
            this.helperText.setContent(content);
        }
    };
    /**
     * Sets the aria label of the leading icon.
     */
    MDCTextFieldFoundation.prototype.setLeadingIconAriaLabel = function (label) {
        if (this.leadingIcon) {
            this.leadingIcon.setAriaLabel(label);
        }
    };
    /**
     * Sets the text content of the leading icon.
     */
    MDCTextFieldFoundation.prototype.setLeadingIconContent = function (content) {
        if (this.leadingIcon) {
            this.leadingIcon.setContent(content);
        }
    };
    /**
     * Sets the aria label of the trailing icon.
     */
    MDCTextFieldFoundation.prototype.setTrailingIconAriaLabel = function (label) {
        if (this.trailingIcon) {
            this.trailingIcon.setAriaLabel(label);
        }
    };
    /**
     * Sets the text content of the trailing icon.
     */
    MDCTextFieldFoundation.prototype.setTrailingIconContent = function (content) {
        if (this.trailingIcon) {
            this.trailingIcon.setContent(content);
        }
    };
    /**
     * Sets character counter values that shows characters used and the total
     * character limit.
     */
    MDCTextFieldFoundation.prototype.setcharacterCounter = function (currentLength) {
        if (!this.characterCounter) {
            return;
        }
        var maxLength = this.getNativeInput().maxLength;
        if (maxLength === -1) {
            throw new Error('MDCTextFieldFoundation: Expected maxlength html property on text input or textarea.');
        }
        this.characterCounter.setCounterValue(currentLength, maxLength);
    };
    /**
     * @return True if the Text Field input fails in converting the user-supplied
     *     value.
     */
    MDCTextFieldFoundation.prototype.isBadInput = function () {
        // The badInput property is not supported in IE 11 💩.
        return this.getNativeInput().validity.badInput || false;
    };
    /**
     * @return The result of native validity checking (ValidityState.valid).
     */
    MDCTextFieldFoundation.prototype.isNativeInputValid = function () {
        return this.getNativeInput().validity.valid;
    };
    /**
     * Styles the component based on the validity state.
     */
    MDCTextFieldFoundation.prototype.styleValidity = function (isValid) {
        var INVALID = MDCTextFieldFoundation.cssClasses.INVALID;
        if (isValid) {
            this.adapter.removeClass(INVALID);
        }
        else {
            this.adapter.addClass(INVALID);
        }
        if (this.helperText) {
            this.helperText.setValidity(isValid);
            // We dynamically set or unset aria-describedby for validation helper text
            // only, based on whether the field is valid
            var helperTextValidation = this.helperText.isValidation();
            if (!helperTextValidation) {
                return;
            }
            var helperTextVisible = this.helperText.isVisible();
            var helperTextId = this.helperText.getId();
            if (helperTextVisible && helperTextId) {
                this.adapter.setInputAttr(strings$1.ARIA_DESCRIBEDBY, helperTextId);
            }
            else {
                this.adapter.removeInputAttr(strings$1.ARIA_DESCRIBEDBY);
            }
        }
    };
    /**
     * Styles the component based on the focused state.
     */
    MDCTextFieldFoundation.prototype.styleFocused = function (isFocused) {
        var FOCUSED = MDCTextFieldFoundation.cssClasses.FOCUSED;
        if (isFocused) {
            this.adapter.addClass(FOCUSED);
        }
        else {
            this.adapter.removeClass(FOCUSED);
        }
    };
    /**
     * Styles the component based on the disabled state.
     */
    MDCTextFieldFoundation.prototype.styleDisabled = function (isDisabled) {
        var _a = MDCTextFieldFoundation.cssClasses, DISABLED = _a.DISABLED, INVALID = _a.INVALID;
        if (isDisabled) {
            this.adapter.addClass(DISABLED);
            this.adapter.removeClass(INVALID);
        }
        else {
            this.adapter.removeClass(DISABLED);
        }
        if (this.leadingIcon) {
            this.leadingIcon.setDisabled(isDisabled);
        }
        if (this.trailingIcon) {
            this.trailingIcon.setDisabled(isDisabled);
        }
    };
    /**
     * Styles the component based on the label floating state.
     */
    MDCTextFieldFoundation.prototype.styleFloating = function (isFloating) {
        var LABEL_FLOATING = MDCTextFieldFoundation.cssClasses.LABEL_FLOATING;
        if (isFloating) {
            this.adapter.addClass(LABEL_FLOATING);
        }
        else {
            this.adapter.removeClass(LABEL_FLOATING);
        }
    };
    /**
     * @return The native text input element from the host environment, or an
     *     object with the same shape for unit tests.
     */
    MDCTextFieldFoundation.prototype.getNativeInput = function () {
        // this.adapter may be undefined in foundation unit tests. This happens when
        // testdouble is creating a mock object and invokes the
        // shouldShake/shouldFloat getters (which in turn call getValue(), which
        // calls this method) before init() has been called from the MDCTextField
        // constructor. To work around that issue, we return a dummy object.
        var nativeInput = this.adapter ? this.adapter.getNativeInput() : null;
        return nativeInput || {
            disabled: false,
            maxLength: -1,
            required: false,
            type: 'input',
            validity: {
                badInput: false,
                valid: true,
            },
            value: '',
        };
    };
    return MDCTextFieldFoundation;
}(MDCFoundation));
// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
var MDCTextFieldFoundation$1 = MDCTextFieldFoundation;

/**
 * @license
 * Copyright (c) 2020 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */
/**
 * Checks binding values against live DOM values, instead of previously bound
 * values, when determining whether to update the value.
 *
 * This is useful for cases where the DOM value may change from outside of
 * lit-html, such as with a binding to an `<input>` element's `value` property,
 * a content editable elements text, or to a custom element that changes it's
 * own properties or attributes.
 *
 * In these cases if the DOM value changes, but the value set through lit-html
 * bindings hasn't, lit-html won't know to update the DOM value and will leave
 * it alone. If this is not what you want—if you want to overwrite the DOM
 * value with the bound value no matter what—use the `live()` directive:
 *
 *     html`<input .value=${live(x)}>`
 *
 * `live()` performs a strict equality check agains the live DOM value, and if
 * the new value is equal to the live value, does nothing. This means that
 * `live()` should not be used when the binding will cause a type conversion. If
 * you use `live()` with an attribute binding, make sure that only strings are
 * passed in, or the binding will update every render.
 */
const live = directive$2((value) => (part) => {
    let previousValue;
    if (part instanceof EventPart$1 || part instanceof NodePart$1) {
        throw new Error('The `live` directive is not allowed on text or event bindings');
    }
    if (part instanceof BooleanAttributePart$1) {
        checkStrings(part.strings);
        previousValue = part.element.hasAttribute(part.name);
        // This is a hack needed because BooleanAttributePart doesn't have a
        // committer and does its own dirty checking after directives
        part.value = previousValue;
    }
    else {
        const { element, name, strings } = part.committer;
        checkStrings(strings);
        if (part instanceof PropertyPart) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            previousValue = element[name];
            if (previousValue === value) {
                return;
            }
        }
        else if (part instanceof AttributePart$2) {
            previousValue = element.getAttribute(name);
        }
        if (previousValue === String(value)) {
            return;
        }
    }
    part.setValue(value);
});
const checkStrings = (strings) => {
    if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
        throw new Error('`live` bindings can only contain a single expression');
    }
};

const passiveEvents = ['touchstart', 'touchmove', 'scroll', 'mousewheel'];
const createValidityObj = (customValidity = {}) => {
    /*
     * We need to make ValidityState an object because it is readonly and
     * we cannot use the spread operator. Also, we don't export
     * `CustomValidityState` because it is a leaky implementation and the user
     * already has access to `ValidityState` in lib.dom.ts. Also an interface
     * {a: Type} can be casted to {readonly a: Type} so passing any object
     * should be fine.
     */
    const objectifiedCustomValidity = {};
    // eslint-disable-next-line guard-for-in
    for (const propName in customValidity) {
        /*
         * Casting is needed because ValidityState's props are all readonly and
         * thus cannot be set on `onjectifiedCustomValidity`. In the end, the
         * interface is the same as ValidityState (but not readonly), but the
         * function signature casts the output to ValidityState (thus readonly).
         */
        objectifiedCustomValidity[propName] =
            customValidity[propName];
    }
    return Object.assign({ badInput: false, customError: false, patternMismatch: false, rangeOverflow: false, rangeUnderflow: false, stepMismatch: false, tooLong: false, tooShort: false, typeMismatch: false, valid: true, valueMissing: false }, objectifiedCustomValidity);
};
/** @soyCompatible */
class TextFieldBase extends FormElement {
    constructor() {
        super(...arguments);
        this.mdcFoundationClass = MDCTextFieldFoundation$1;
        this.value = '';
        this.type = 'text';
        this.placeholder = '';
        this.label = '';
        this.icon = '';
        this.iconTrailing = '';
        this.disabled = false;
        this.required = false;
        this.minLength = -1;
        this.maxLength = -1;
        this.outlined = false;
        this.helper = '';
        this.validateOnInitialRender = false;
        this.validationMessage = '';
        this.autoValidate = false;
        this.pattern = '';
        this.min = '';
        this.max = '';
        this.step = null;
        this.size = null;
        this.helperPersistent = false;
        this.charCounter = false;
        this.endAligned = false;
        this.prefix = '';
        this.suffix = '';
        this.name = '';
        this.readOnly = false;
        this.autocapitalize = '';
        this.outlineOpen = false;
        this.outlineWidth = 0;
        this.isUiValid = true;
        this.focused = false;
        this._validity = createValidityObj();
        this.validityTransform = null;
    }
    get validity() {
        this._checkValidity(this.value);
        return this._validity;
    }
    get willValidate() {
        return this.formElement.willValidate;
    }
    get selectionStart() {
        return this.formElement.selectionStart;
    }
    get selectionEnd() {
        return this.formElement.selectionEnd;
    }
    focus() {
        const focusEvt = new CustomEvent('focus');
        this.formElement.dispatchEvent(focusEvt);
        this.formElement.focus();
    }
    blur() {
        const blurEvt = new CustomEvent('blur');
        this.formElement.dispatchEvent(blurEvt);
        this.formElement.blur();
    }
    select() {
        this.formElement.select();
    }
    setSelectionRange(selectionStart, selectionEnd, selectionDirection) {
        this.formElement.setSelectionRange(selectionStart, selectionEnd, selectionDirection);
    }
    update(changedProperties) {
        if (changedProperties.has('autoValidate') && this.mdcFoundation) {
            this.mdcFoundation.setValidateOnValueChange(this.autoValidate);
        }
        if (changedProperties.has('value') && typeof this.value !== 'string') {
            this.value = `${this.value}`;
        }
        super.update(changedProperties);
    }
    /** @soyTemplate */
    render() {
        const shouldRenderCharCounter = this.charCounter && this.maxLength !== -1;
        const shouldRenderHelperText = !!this.helper || !!this.validationMessage || shouldRenderCharCounter;
        /** @classMap */
        const classes = {
            'mdc-text-field--disabled': this.disabled,
            'mdc-text-field--no-label': !this.label,
            'mdc-text-field--filled': !this.outlined,
            'mdc-text-field--outlined': this.outlined,
            'mdc-text-field--with-leading-icon': this.icon,
            'mdc-text-field--with-trailing-icon': this.iconTrailing,
            'mdc-text-field--end-aligned': this.endAligned,
        };
        return html `
      <label class="mdc-text-field ${classMap(classes)}">
        ${this.renderRipple()}
        ${this.outlined ? this.renderOutline() : this.renderLabel()}
        ${this.renderLeadingIcon()}
        ${this.renderPrefix()}
        ${this.renderInput(shouldRenderHelperText)}
        ${this.renderSuffix()}
        ${this.renderTrailingIcon()}
        ${this.renderLineRipple()}
      </label>
      ${this.renderHelperText(shouldRenderHelperText, shouldRenderCharCounter)}
    `;
    }
    updated(changedProperties) {
        if (changedProperties.has('value') &&
            changedProperties.get('value') !== undefined) {
            this.mdcFoundation.setValue(this.value);
            if (this.autoValidate) {
                this.reportValidity();
            }
        }
    }
    /** @soyTemplate */
    renderRipple() {
        return this.outlined ? '' : html `
      <span class="mdc-text-field__ripple"></span>
    `;
    }
    /** @soyTemplate */
    renderOutline() {
        return !this.outlined ? '' : html `
      <mwc-notched-outline
          .width=${this.outlineWidth}
          .open=${this.outlineOpen}
          class="mdc-notched-outline">
        ${this.renderLabel()}
      </mwc-notched-outline>`;
    }
    /** @soyTemplate */
    renderLabel() {
        return !this.label ?
            '' :
            html `
      <span
          .floatingLabelFoundation=${floatingLabel(this.label)}
          id="label">${this.label}</span>
    `;
    }
    /** @soyTemplate */
    renderLeadingIcon() {
        return this.icon ? this.renderIcon(this.icon) : '';
    }
    /** @soyTemplate */
    renderTrailingIcon() {
        return this.iconTrailing ? this.renderIcon(this.iconTrailing, true) : '';
    }
    /** @soyTemplate */
    renderIcon(icon, isTrailingIcon = false) {
        /** @classMap */
        const classes = {
            'mdc-text-field__icon--leading': !isTrailingIcon,
            'mdc-text-field__icon--trailing': isTrailingIcon
        };
        return html `<i class="material-icons mdc-text-field__icon ${classMap(classes)}">${icon}</i>`;
    }
    /** @soyTemplate */
    renderPrefix() {
        return this.prefix ? this.renderAffix(this.prefix) : '';
    }
    /** @soyTemplate */
    renderSuffix() {
        return this.suffix ? this.renderAffix(this.suffix, true) : '';
    }
    /** @soyTemplate */
    renderAffix(content, isSuffix = false) {
        /** @classMap */
        const classes = {
            'mdc-text-field__affix--prefix': !isSuffix,
            'mdc-text-field__affix--suffix': isSuffix
        };
        return html `<span class="mdc-text-field__affix ${classMap(classes)}">
        ${content}</span>`;
    }
    /** @soyTemplate */
    renderInput(shouldRenderHelperText) {
        const minOrUndef = this.minLength === -1 ? undefined : this.minLength;
        const maxOrUndef = this.maxLength === -1 ? undefined : this.maxLength;
        const autocapitalizeOrUndef = this.autocapitalize ?
            this.autocapitalize :
            undefined;
        const showValidationMessage = this.validationMessage && !this.isUiValid;
        const ariaLabelledbyOrUndef = !!this.label ? 'label' : undefined;
        const ariaControlsOrUndef = shouldRenderHelperText ? 'helper-text' : undefined;
        const ariaDescribedbyOrUndef = this.focused || this.helperPersistent || showValidationMessage ?
            'helper-text' :
            undefined;
        // TODO: live() directive needs casting for lit-analyzer
        // https://github.com/runem/lit-analyzer/pull/91/files
        // TODO: lit-analyzer labels min/max as (number|string) instead of string
        return html `
      <input
          aria-labelledby=${ifDefined(ariaLabelledbyOrUndef)}
          aria-controls="${ifDefined(ariaControlsOrUndef)}"
          aria-describedby="${ifDefined(ariaDescribedbyOrUndef)}"
          class="mdc-text-field__input"
          type="${this.type}"
          .value="${live(this.value)}"
          ?disabled="${this.disabled}"
          placeholder="${this.placeholder}"
          ?required="${this.required}"
          ?readonly="${this.readOnly}"
          minlength="${ifDefined(minOrUndef)}"
          maxlength="${ifDefined(maxOrUndef)}"
          pattern="${ifDefined(this.pattern ? this.pattern : undefined)}"
          min="${ifDefined(this.min === '' ? undefined : this.min)}"
          max="${ifDefined(this.max === '' ? undefined : this.max)}"
          step="${ifDefined(this.step === null ? undefined : this.step)}"
          size="${ifDefined(this.size === null ? undefined : this.size)}"
          name="${ifDefined(this.name === '' ? undefined : this.name)}"
          inputmode="${ifDefined(this.inputMode)}"
          autocapitalize="${ifDefined(autocapitalizeOrUndef)}"
          @input="${this.handleInputChange}"
          @focus="${this.onInputFocus}"
          @blur="${this.onInputBlur}">`;
    }
    /** @soyTemplate */
    renderLineRipple() {
        return this.outlined ?
            '' :
            html `
      <span .lineRippleFoundation=${lineRipple()}></span>
    `;
    }
    /** @soyTemplate */
    renderHelperText(shouldRenderHelperText, shouldRenderCharCounter) {
        const showValidationMessage = this.validationMessage && !this.isUiValid;
        /** @classMap */
        const classes = {
            'mdc-text-field-helper-text--persistent': this.helperPersistent,
            'mdc-text-field-helper-text--validation-msg': showValidationMessage,
        };
        const ariaHiddenOrUndef = this.focused || this.helperPersistent || showValidationMessage ?
            undefined :
            'true';
        const helperText = showValidationMessage ? this.validationMessage : this.helper;
        return !shouldRenderHelperText ? '' : html `
      <div class="mdc-text-field-helper-line">
        <div id="helper-text"
             aria-hidden="${ifDefined(ariaHiddenOrUndef)}"
             class="mdc-text-field-helper-text ${classMap(classes)}"
             >${helperText}</div>
        ${this.renderCharCounter(shouldRenderCharCounter)}
      </div>`;
    }
    /** @soyTemplate */
    renderCharCounter(shouldRenderCharCounter) {
        const length = Math.min(this.value.length, this.maxLength);
        return !shouldRenderCharCounter ? '' : html `
      <span class="mdc-text-field-character-counter"
            >${length} / ${this.maxLength}</span>`;
    }
    onInputFocus() {
        this.focused = true;
    }
    onInputBlur() {
        this.focused = false;
        this.reportValidity();
    }
    checkValidity() {
        const isValid = this._checkValidity(this.value);
        if (!isValid) {
            const invalidEvent = new Event('invalid', { bubbles: false, cancelable: true });
            this.dispatchEvent(invalidEvent);
        }
        return isValid;
    }
    reportValidity() {
        const isValid = this.checkValidity();
        this.mdcFoundation.setValid(isValid);
        this.isUiValid = isValid;
        return isValid;
    }
    _checkValidity(value) {
        const nativeValidity = this.formElement.validity;
        let validity = createValidityObj(nativeValidity);
        if (this.validityTransform) {
            const customValidity = this.validityTransform(value, validity);
            validity = Object.assign(Object.assign({}, validity), customValidity);
            this.mdcFoundation.setUseNativeValidation(false);
        }
        else {
            this.mdcFoundation.setUseNativeValidation(true);
        }
        this._validity = validity;
        return this._validity.valid;
    }
    setCustomValidity(message) {
        this.validationMessage = message;
        this.formElement.setCustomValidity(message);
    }
    handleInputChange() {
        this.value = this.formElement.value;
    }
    createAdapter() {
        return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, this.getRootAdapterMethods()), this.getInputAdapterMethods()), this.getLabelAdapterMethods()), this.getLineRippleAdapterMethods()), this.getOutlineAdapterMethods());
    }
    getRootAdapterMethods() {
        return Object.assign({ registerTextFieldInteractionHandler: (evtType, handler) => this.addEventListener(evtType, handler), deregisterTextFieldInteractionHandler: (evtType, handler) => this.removeEventListener(evtType, handler), registerValidationAttributeChangeHandler: (handler) => {
                const getAttributesList = (mutationsList) => {
                    return mutationsList.map((mutation) => mutation.attributeName)
                        .filter((attributeName) => attributeName);
                };
                const observer = new MutationObserver((mutationsList) => {
                    handler(getAttributesList(mutationsList));
                });
                const config = { attributes: true };
                observer.observe(this.formElement, config);
                return observer;
            }, deregisterValidationAttributeChangeHandler: (observer) => observer.disconnect() }, addHasRemoveClass(this.mdcRoot));
    }
    getInputAdapterMethods() {
        return {
            getNativeInput: () => this.formElement,
            // since HelperTextFoundation is not used, aria-describedby a11y logic
            // is implemented in render method instead of these adapter methods
            setInputAttr: () => undefined,
            removeInputAttr: () => undefined,
            isFocused: () => this.shadowRoot ?
                this.shadowRoot.activeElement === this.formElement :
                false,
            registerInputInteractionHandler: (evtType, handler) => this.formElement.addEventListener(evtType, handler, { passive: evtType in passiveEvents }),
            deregisterInputInteractionHandler: (evtType, handler) => this.formElement.removeEventListener(evtType, handler),
        };
    }
    getLabelAdapterMethods() {
        return {
            floatLabel: (shouldFloat) => this.labelElement &&
                this.labelElement.floatingLabelFoundation.float(shouldFloat),
            getLabelWidth: () => {
                return this.labelElement ?
                    this.labelElement.floatingLabelFoundation.getWidth() :
                    0;
            },
            hasLabel: () => Boolean(this.labelElement),
            shakeLabel: (shouldShake) => this.labelElement &&
                this.labelElement.floatingLabelFoundation.shake(shouldShake),
            setLabelRequired: (isRequired) => {
                if (this.labelElement) {
                    this.labelElement.floatingLabelFoundation.setRequired(isRequired);
                }
            },
        };
    }
    getLineRippleAdapterMethods() {
        return {
            activateLineRipple: () => {
                if (this.lineRippleElement) {
                    this.lineRippleElement.lineRippleFoundation.activate();
                }
            },
            deactivateLineRipple: () => {
                if (this.lineRippleElement) {
                    this.lineRippleElement.lineRippleFoundation.deactivate();
                }
            },
            setLineRippleTransformOrigin: (normalizedX) => {
                if (this.lineRippleElement) {
                    this.lineRippleElement.lineRippleFoundation.setRippleCenter(normalizedX);
                }
            },
        };
    }
    // tslint:disable:ban-ts-ignore
    async getUpdateComplete() {
        var _a;
        // @ts-ignore
        const result = await super.getUpdateComplete();
        await ((_a = this.outlineElement) === null || _a === void 0 ? void 0 : _a.updateComplete);
        return result;
    }
    // tslint:enable:ban-ts-ignore
    firstUpdated() {
        var _a;
        super.firstUpdated();
        this.mdcFoundation.setValidateOnValueChange(this.autoValidate);
        if (this.validateOnInitialRender) {
            this.reportValidity();
        }
        // wait for the outline element to render to update the notch width
        (_a = this.outlineElement) === null || _a === void 0 ? void 0 : _a.updateComplete.then(() => {
            var _a;
            // `foundation.notchOutline()` assumes the label isn't floating and
            // multiplies by a constant, but the label is already is floating at this
            // stage, therefore directly set the outline width to the label width
            this.outlineWidth =
                ((_a = this.labelElement) === null || _a === void 0 ? void 0 : _a.floatingLabelFoundation.getWidth()) || 0;
        });
    }
    getOutlineAdapterMethods() {
        return {
            closeOutline: () => this.outlineElement && (this.outlineOpen = false),
            hasOutline: () => Boolean(this.outlineElement),
            notchOutline: (labelWidth) => {
                const outlineElement = this.outlineElement;
                if (outlineElement && !this.outlineOpen) {
                    this.outlineWidth = labelWidth;
                    this.outlineOpen = true;
                }
            }
        };
    }
    async layout() {
        await this.updateComplete;
        const labelElement = this.labelElement;
        if (!labelElement) {
            this.outlineOpen = false;
            return;
        }
        const shouldFloat = !!this.label && !!this.value;
        labelElement.floatingLabelFoundation.float(shouldFloat);
        if (!this.outlined) {
            return;
        }
        this.outlineOpen = shouldFloat;
        await this.updateComplete;
        /* When the textfield automatically notches due to a value and label
         * being defined, the textfield may be set to `display: none` by the user.
         * this means that the notch is of size 0px. We provide this function so
         * that the user may manually resize the notch to the floated label's
         * width.
         */
        const labelWidth = labelElement.floatingLabelFoundation.getWidth();
        if (this.outlineOpen) {
            this.outlineWidth = labelWidth;
            await this.updateComplete;
        }
    }
}
__decorate([
    query('.mdc-text-field')
], TextFieldBase.prototype, "mdcRoot", void 0);
__decorate([
    query('input')
], TextFieldBase.prototype, "formElement", void 0);
__decorate([
    query('.mdc-floating-label')
], TextFieldBase.prototype, "labelElement", void 0);
__decorate([
    query('.mdc-line-ripple')
], TextFieldBase.prototype, "lineRippleElement", void 0);
__decorate([
    query('mwc-notched-outline')
], TextFieldBase.prototype, "outlineElement", void 0);
__decorate([
    query('.mdc-notched-outline__notch')
], TextFieldBase.prototype, "notchElement", void 0);
__decorate([
    property({ type: String })
], TextFieldBase.prototype, "value", void 0);
__decorate([
    property({ type: String })
], TextFieldBase.prototype, "type", void 0);
__decorate([
    property({ type: String })
], TextFieldBase.prototype, "placeholder", void 0);
__decorate([
    property({ type: String }),
    observer(function (_newVal, oldVal) {
        if (oldVal !== undefined && this.label !== oldVal) {
            this.layout();
        }
    })
], TextFieldBase.prototype, "label", void 0);
__decorate([
    property({ type: String })
], TextFieldBase.prototype, "icon", void 0);
__decorate([
    property({ type: String })
], TextFieldBase.prototype, "iconTrailing", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], TextFieldBase.prototype, "disabled", void 0);
__decorate([
    property({ type: Boolean })
], TextFieldBase.prototype, "required", void 0);
__decorate([
    property({ type: Number })
], TextFieldBase.prototype, "minLength", void 0);
__decorate([
    property({ type: Number })
], TextFieldBase.prototype, "maxLength", void 0);
__decorate([
    property({ type: Boolean, reflect: true }),
    observer(function (_newVal, oldVal) {
        if (oldVal !== undefined && this.outlined !== oldVal) {
            this.layout();
        }
    })
], TextFieldBase.prototype, "outlined", void 0);
__decorate([
    property({ type: String })
], TextFieldBase.prototype, "helper", void 0);
__decorate([
    property({ type: Boolean })
], TextFieldBase.prototype, "validateOnInitialRender", void 0);
__decorate([
    property({ type: String })
], TextFieldBase.prototype, "validationMessage", void 0);
__decorate([
    property({ type: Boolean })
], TextFieldBase.prototype, "autoValidate", void 0);
__decorate([
    property({ type: String })
], TextFieldBase.prototype, "pattern", void 0);
__decorate([
    property({ type: String })
], TextFieldBase.prototype, "min", void 0);
__decorate([
    property({ type: String })
], TextFieldBase.prototype, "max", void 0);
__decorate([
    property({ type: Number })
], TextFieldBase.prototype, "step", void 0);
__decorate([
    property({ type: Number })
], TextFieldBase.prototype, "size", void 0);
__decorate([
    property({ type: Boolean })
], TextFieldBase.prototype, "helperPersistent", void 0);
__decorate([
    property({ type: Boolean })
], TextFieldBase.prototype, "charCounter", void 0);
__decorate([
    property({ type: Boolean })
], TextFieldBase.prototype, "endAligned", void 0);
__decorate([
    property({ type: String })
], TextFieldBase.prototype, "prefix", void 0);
__decorate([
    property({ type: String })
], TextFieldBase.prototype, "suffix", void 0);
__decorate([
    property({ type: String })
], TextFieldBase.prototype, "name", void 0);
__decorate([
    property({ type: String })
], TextFieldBase.prototype, "inputMode", void 0);
__decorate([
    property({ type: Boolean })
], TextFieldBase.prototype, "readOnly", void 0);
__decorate([
    property({ type: String })
], TextFieldBase.prototype, "autocapitalize", void 0);
__decorate([
    state()
], TextFieldBase.prototype, "outlineOpen", void 0);
__decorate([
    state()
], TextFieldBase.prototype, "outlineWidth", void 0);
__decorate([
    state()
], TextFieldBase.prototype, "isUiValid", void 0);
__decorate([
    state()
], TextFieldBase.prototype, "focused", void 0);
__decorate([
    eventOptions({ passive: true })
], TextFieldBase.prototype, "handleInputChange", null);

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
const styles$3 = css `.mdc-floating-label{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-subtitle1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:1rem;font-size:var(--mdc-typography-subtitle1-font-size, 1rem);font-weight:400;font-weight:var(--mdc-typography-subtitle1-font-weight, 400);letter-spacing:0.009375em;letter-spacing:var(--mdc-typography-subtitle1-letter-spacing, 0.009375em);text-decoration:inherit;text-decoration:var(--mdc-typography-subtitle1-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-subtitle1-text-transform, inherit);position:absolute;left:0;-webkit-transform-origin:left top;transform-origin:left top;line-height:1.15rem;text-align:left;text-overflow:ellipsis;white-space:nowrap;cursor:text;overflow:hidden;will-change:transform;transition:transform 150ms cubic-bezier(0.4, 0, 0.2, 1),color 150ms cubic-bezier(0.4, 0, 0.2, 1)}[dir=rtl] .mdc-floating-label,.mdc-floating-label[dir=rtl]{right:0;left:auto;-webkit-transform-origin:right top;transform-origin:right top;text-align:right}.mdc-floating-label--float-above{cursor:auto}.mdc-floating-label--required::after{margin-left:1px;margin-right:0px;content:"*"}[dir=rtl] .mdc-floating-label--required::after,.mdc-floating-label--required[dir=rtl]::after{margin-left:0;margin-right:1px}.mdc-floating-label--float-above{transform:translateY(-106%) scale(0.75)}.mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-standard 250ms 1}@keyframes mdc-floating-label-shake-float-above-standard{0%{transform:translateX(calc(0 - 0%)) translateY(-106%) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 0%)) translateY(-106%) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 0%)) translateY(-106%) scale(0.75)}100%{transform:translateX(calc(0 - 0%)) translateY(-106%) scale(0.75)}}.mdc-line-ripple::before,.mdc-line-ripple::after{position:absolute;bottom:0;left:0;width:100%;border-bottom-style:solid;content:""}.mdc-line-ripple::before{border-bottom-width:1px;z-index:1}.mdc-line-ripple::after{transform:scaleX(0);border-bottom-width:2px;opacity:0;z-index:2}.mdc-line-ripple::after{transition:transform 180ms cubic-bezier(0.4, 0, 0.2, 1),opacity 180ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-line-ripple--active::after{transform:scaleX(1);opacity:1}.mdc-line-ripple--deactivating::after{opacity:0}.mdc-notched-outline{display:flex;position:absolute;top:0;right:0;left:0;box-sizing:border-box;width:100%;max-width:100%;height:100%;text-align:left;pointer-events:none}[dir=rtl] .mdc-notched-outline,.mdc-notched-outline[dir=rtl]{text-align:right}.mdc-notched-outline__leading,.mdc-notched-outline__notch,.mdc-notched-outline__trailing{box-sizing:border-box;height:100%;border-top:1px solid;border-bottom:1px solid;pointer-events:none}.mdc-notched-outline__leading{border-left:1px solid;border-right:none;width:12px}[dir=rtl] .mdc-notched-outline__leading,.mdc-notched-outline__leading[dir=rtl]{border-left:none;border-right:1px solid}.mdc-notched-outline__trailing{border-left:none;border-right:1px solid;flex-grow:1}[dir=rtl] .mdc-notched-outline__trailing,.mdc-notched-outline__trailing[dir=rtl]{border-left:1px solid;border-right:none}.mdc-notched-outline__notch{flex:0 0 auto;width:auto;max-width:calc(100% - 12px * 2)}.mdc-notched-outline .mdc-floating-label{display:inline-block;position:relative;max-width:100%}.mdc-notched-outline .mdc-floating-label--float-above{text-overflow:clip}.mdc-notched-outline--upgraded .mdc-floating-label--float-above{max-width:calc(100% / 0.75)}.mdc-notched-outline--notched .mdc-notched-outline__notch{padding-left:0;padding-right:8px;border-top:none}[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch,.mdc-notched-outline--notched .mdc-notched-outline__notch[dir=rtl]{padding-left:8px;padding-right:0}.mdc-notched-outline--no-label .mdc-notched-outline__notch{display:none}@keyframes mdc-ripple-fg-radius-in{from{animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transform:translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1)}to{transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}}@keyframes mdc-ripple-fg-opacity-in{from{animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity, 0)}}@keyframes mdc-ripple-fg-opacity-out{from{animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity, 0)}to{opacity:0}}.mdc-text-field--filled{--mdc-ripple-fg-size: 0;--mdc-ripple-left: 0;--mdc-ripple-top: 0;--mdc-ripple-fg-scale: 1;--mdc-ripple-fg-translate-end: 0;--mdc-ripple-fg-translate-start: 0;-webkit-tap-highlight-color:rgba(0,0,0,0);will-change:transform,opacity}.mdc-text-field--filled .mdc-text-field__ripple::before,.mdc-text-field--filled .mdc-text-field__ripple::after{position:absolute;border-radius:50%;opacity:0;pointer-events:none;content:""}.mdc-text-field--filled .mdc-text-field__ripple::before{transition:opacity 15ms linear,background-color 15ms linear;z-index:1;z-index:var(--mdc-ripple-z-index, 1)}.mdc-text-field--filled .mdc-text-field__ripple::after{z-index:0;z-index:var(--mdc-ripple-z-index, 0)}.mdc-text-field--filled.mdc-ripple-upgraded .mdc-text-field__ripple::before{transform:scale(var(--mdc-ripple-fg-scale, 1))}.mdc-text-field--filled.mdc-ripple-upgraded .mdc-text-field__ripple::after{top:0;left:0;transform:scale(0);transform-origin:center center}.mdc-text-field--filled.mdc-ripple-upgraded--unbounded .mdc-text-field__ripple::after{top:var(--mdc-ripple-top, 0);left:var(--mdc-ripple-left, 0)}.mdc-text-field--filled.mdc-ripple-upgraded--foreground-activation .mdc-text-field__ripple::after{animation:mdc-ripple-fg-radius-in 225ms forwards,mdc-ripple-fg-opacity-in 75ms forwards}.mdc-text-field--filled.mdc-ripple-upgraded--foreground-deactivation .mdc-text-field__ripple::after{animation:mdc-ripple-fg-opacity-out 150ms;transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}.mdc-text-field--filled .mdc-text-field__ripple::before,.mdc-text-field--filled .mdc-text-field__ripple::after{top:calc(50% - 100%);left:calc(50% - 100%);width:200%;height:200%}.mdc-text-field--filled.mdc-ripple-upgraded .mdc-text-field__ripple::after{width:var(--mdc-ripple-fg-size, 100%);height:var(--mdc-ripple-fg-size, 100%)}.mdc-text-field__ripple{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none}.mdc-text-field{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:0;border-bottom-left-radius:0;display:inline-flex;align-items:baseline;padding:0 16px;position:relative;box-sizing:border-box;overflow:hidden;will-change:opacity,transform,color}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-floating-label{color:rgba(0, 0, 0, 0.6)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input{color:rgba(0, 0, 0, 0.87)}@media all{.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder{color:rgba(0, 0, 0, 0.54)}}@media all{.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder{color:rgba(0, 0, 0, 0.54)}}.mdc-text-field .mdc-text-field__input{caret-color:#6200ee;caret-color:var(--mdc-theme-primary, #6200ee)}.mdc-text-field:not(.mdc-text-field--disabled)+.mdc-text-field-helper-line .mdc-text-field-helper-text{color:rgba(0, 0, 0, 0.6)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field-character-counter,.mdc-text-field:not(.mdc-text-field--disabled)+.mdc-text-field-helper-line .mdc-text-field-character-counter{color:rgba(0, 0, 0, 0.6)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__icon--leading{color:rgba(0, 0, 0, 0.54)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__icon--trailing{color:rgba(0, 0, 0, 0.54)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__affix--prefix{color:rgba(0, 0, 0, 0.6)}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-text-field__affix--suffix{color:rgba(0, 0, 0, 0.6)}.mdc-text-field .mdc-floating-label{top:50%;transform:translateY(-50%);pointer-events:none}.mdc-text-field__input{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-subtitle1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:1rem;font-size:var(--mdc-typography-subtitle1-font-size, 1rem);font-weight:400;font-weight:var(--mdc-typography-subtitle1-font-weight, 400);letter-spacing:0.009375em;letter-spacing:var(--mdc-typography-subtitle1-letter-spacing, 0.009375em);text-decoration:inherit;text-decoration:var(--mdc-typography-subtitle1-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-subtitle1-text-transform, inherit);height:28px;transition:opacity 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1);width:100%;min-width:0;border:none;border-radius:0;background:none;appearance:none;padding:0}.mdc-text-field__input::-ms-clear{display:none}.mdc-text-field__input::-webkit-calendar-picker-indicator{display:none}.mdc-text-field__input:focus{outline:none}.mdc-text-field__input:invalid{box-shadow:none}@media all{.mdc-text-field__input::placeholder{transition:opacity 67ms 0ms cubic-bezier(0.4, 0, 0.2, 1);opacity:0}}@media all{.mdc-text-field__input:-ms-input-placeholder{transition:opacity 67ms 0ms cubic-bezier(0.4, 0, 0.2, 1);opacity:0}}@media all{.mdc-text-field--no-label .mdc-text-field__input::placeholder,.mdc-text-field--focused .mdc-text-field__input::placeholder{transition-delay:40ms;transition-duration:110ms;opacity:1}}@media all{.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder,.mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder{transition-delay:40ms;transition-duration:110ms;opacity:1}}.mdc-text-field__affix{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-subtitle1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:1rem;font-size:var(--mdc-typography-subtitle1-font-size, 1rem);font-weight:400;font-weight:var(--mdc-typography-subtitle1-font-weight, 400);letter-spacing:0.009375em;letter-spacing:var(--mdc-typography-subtitle1-letter-spacing, 0.009375em);text-decoration:inherit;text-decoration:var(--mdc-typography-subtitle1-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-subtitle1-text-transform, inherit);height:28px;transition:opacity 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1);opacity:0;white-space:nowrap}.mdc-text-field--label-floating .mdc-text-field__affix,.mdc-text-field--no-label .mdc-text-field__affix{opacity:1}@supports(-webkit-hyphens: none){.mdc-text-field--outlined .mdc-text-field__affix{align-items:center;align-self:center;display:inline-flex;height:100%}}.mdc-text-field__affix--prefix{padding-left:0;padding-right:2px}[dir=rtl] .mdc-text-field__affix--prefix,.mdc-text-field__affix--prefix[dir=rtl]{padding-left:2px;padding-right:0}.mdc-text-field--end-aligned .mdc-text-field__affix--prefix{padding-left:0;padding-right:12px}[dir=rtl] .mdc-text-field--end-aligned .mdc-text-field__affix--prefix,.mdc-text-field--end-aligned .mdc-text-field__affix--prefix[dir=rtl]{padding-left:12px;padding-right:0}.mdc-text-field__affix--suffix{padding-left:12px;padding-right:0}[dir=rtl] .mdc-text-field__affix--suffix,.mdc-text-field__affix--suffix[dir=rtl]{padding-left:0;padding-right:12px}.mdc-text-field--end-aligned .mdc-text-field__affix--suffix{padding-left:2px;padding-right:0}[dir=rtl] .mdc-text-field--end-aligned .mdc-text-field__affix--suffix,.mdc-text-field--end-aligned .mdc-text-field__affix--suffix[dir=rtl]{padding-left:0;padding-right:2px}.mdc-text-field--filled{height:56px}.mdc-text-field--filled .mdc-text-field__ripple::before,.mdc-text-field--filled .mdc-text-field__ripple::after{background-color:rgba(0, 0, 0, 0.87);background-color:var(--mdc-ripple-color, rgba(0, 0, 0, 0.87))}.mdc-text-field--filled:hover .mdc-text-field__ripple::before,.mdc-text-field--filled.mdc-ripple-surface--hover .mdc-text-field__ripple::before{opacity:0.04;opacity:var(--mdc-ripple-hover-opacity, 0.04)}.mdc-text-field--filled.mdc-ripple-upgraded--background-focused .mdc-text-field__ripple::before,.mdc-text-field--filled:not(.mdc-ripple-upgraded):focus .mdc-text-field__ripple::before{transition-duration:75ms;opacity:0.12;opacity:var(--mdc-ripple-focus-opacity, 0.12)}.mdc-text-field--filled::before{display:inline-block;width:0;height:40px;content:"";vertical-align:0}.mdc-text-field--filled:not(.mdc-text-field--disabled){background-color:whitesmoke}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.42)}.mdc-text-field--filled:not(.mdc-text-field--disabled):hover .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.87)}.mdc-text-field--filled .mdc-line-ripple::after{border-bottom-color:#6200ee;border-bottom-color:var(--mdc-theme-primary, #6200ee)}.mdc-text-field--filled .mdc-floating-label{left:16px;right:initial}[dir=rtl] .mdc-text-field--filled .mdc-floating-label,.mdc-text-field--filled .mdc-floating-label[dir=rtl]{left:initial;right:16px}.mdc-text-field--filled .mdc-floating-label--float-above{transform:translateY(-106%) scale(0.75)}.mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__input{height:100%}.mdc-text-field--filled.mdc-text-field--no-label .mdc-floating-label{display:none}.mdc-text-field--filled.mdc-text-field--no-label::before{display:none}@supports(-webkit-hyphens: none){.mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__affix{align-items:center;align-self:center;display:inline-flex;height:100%}}.mdc-text-field--outlined{height:56px;overflow:visible}.mdc-text-field--outlined .mdc-floating-label--float-above{transform:translateY(-37.25px) scale(1)}.mdc-text-field--outlined .mdc-floating-label--float-above{font-size:.75rem}.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-34.75px) scale(0.75)}.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-text-field--outlined .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-text-field-outlined 250ms 1}@keyframes mdc-floating-label-shake-float-above-text-field-outlined{0%{transform:translateX(calc(0 - 0%)) translateY(-34.75px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 0%)) translateY(-34.75px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 0%)) translateY(-34.75px) scale(0.75)}100%{transform:translateX(calc(0 - 0%)) translateY(-34.75px) scale(0.75)}}.mdc-text-field--outlined .mdc-text-field__input{height:100%}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing{border-color:rgba(0, 0, 0, 0.38)}.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__leading,.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__notch,.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__trailing{border-color:rgba(0, 0, 0, 0.87)}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__leading,.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__notch,.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__trailing{border-color:#6200ee;border-color:var(--mdc-theme-primary, #6200ee)}.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:4px;border-bottom-left-radius:var(--mdc-shape-small, 4px)}[dir=rtl] .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading,.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading[dir=rtl]{border-top-left-radius:0;border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:4px;border-bottom-right-radius:var(--mdc-shape-small, 4px);border-bottom-left-radius:0}@supports(top: max(0%)){.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading{width:max(12px, var(--mdc-shape-small, 4px))}}@supports(top: max(0%)){.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__notch{max-width:calc(100% - max(12px, var(--mdc-shape-small, 4px)) * 2)}}.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing{border-top-left-radius:0;border-top-right-radius:4px;border-top-right-radius:var(--mdc-shape-small, 4px);border-bottom-right-radius:4px;border-bottom-right-radius:var(--mdc-shape-small, 4px);border-bottom-left-radius:0}[dir=rtl] .mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing,.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__trailing[dir=rtl]{border-top-left-radius:4px;border-top-left-radius:var(--mdc-shape-small, 4px);border-top-right-radius:0;border-bottom-right-radius:0;border-bottom-left-radius:4px;border-bottom-left-radius:var(--mdc-shape-small, 4px)}@supports(top: max(0%)){.mdc-text-field--outlined{padding-left:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}@supports(top: max(0%)){.mdc-text-field--outlined{padding-right:max(16px, var(--mdc-shape-small, 4px))}}@supports(top: max(0%)){.mdc-text-field--outlined+.mdc-text-field-helper-line{padding-left:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}@supports(top: max(0%)){.mdc-text-field--outlined+.mdc-text-field-helper-line{padding-right:max(16px, var(--mdc-shape-small, 4px))}}.mdc-text-field--outlined.mdc-text-field--with-leading-icon{padding-left:0}@supports(top: max(0%)){.mdc-text-field--outlined.mdc-text-field--with-leading-icon{padding-right:max(16px, var(--mdc-shape-small, 4px))}}[dir=rtl] .mdc-text-field--outlined.mdc-text-field--with-leading-icon,.mdc-text-field--outlined.mdc-text-field--with-leading-icon[dir=rtl]{padding-right:0}@supports(top: max(0%)){[dir=rtl] .mdc-text-field--outlined.mdc-text-field--with-leading-icon,.mdc-text-field--outlined.mdc-text-field--with-leading-icon[dir=rtl]{padding-left:max(16px, var(--mdc-shape-small, 4px))}}.mdc-text-field--outlined.mdc-text-field--with-trailing-icon{padding-right:0}@supports(top: max(0%)){.mdc-text-field--outlined.mdc-text-field--with-trailing-icon{padding-left:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}[dir=rtl] .mdc-text-field--outlined.mdc-text-field--with-trailing-icon,.mdc-text-field--outlined.mdc-text-field--with-trailing-icon[dir=rtl]{padding-left:0}@supports(top: max(0%)){[dir=rtl] .mdc-text-field--outlined.mdc-text-field--with-trailing-icon,.mdc-text-field--outlined.mdc-text-field--with-trailing-icon[dir=rtl]{padding-right:max(16px, calc(var(--mdc-shape-small, 4px) + 4px))}}.mdc-text-field--outlined.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon{padding-left:0;padding-right:0}.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:1px}.mdc-text-field--outlined .mdc-text-field__ripple::before,.mdc-text-field--outlined .mdc-text-field__ripple::after{content:none}.mdc-text-field--outlined .mdc-floating-label{left:4px;right:initial}[dir=rtl] .mdc-text-field--outlined .mdc-floating-label,.mdc-text-field--outlined .mdc-floating-label[dir=rtl]{left:initial;right:4px}.mdc-text-field--outlined .mdc-text-field__input{display:flex;border:none !important;background-color:transparent}.mdc-text-field--outlined .mdc-notched-outline{z-index:1}.mdc-text-field--textarea{flex-direction:column;align-items:center;width:auto;height:auto;padding:0;transition:none}.mdc-text-field--textarea .mdc-floating-label{top:19px}.mdc-text-field--textarea .mdc-floating-label:not(.mdc-floating-label--float-above){transform:none}.mdc-text-field--textarea .mdc-text-field__input{flex-grow:1;height:auto;min-height:1.5rem;overflow-x:hidden;overflow-y:auto;box-sizing:border-box;resize:none;padding:0 16px;line-height:1.5rem}.mdc-text-field--textarea.mdc-text-field--filled::before{display:none}.mdc-text-field--textarea.mdc-text-field--filled .mdc-floating-label--float-above{transform:translateY(-10.25px) scale(0.75)}.mdc-text-field--textarea.mdc-text-field--filled .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-textarea-filled 250ms 1}@keyframes mdc-floating-label-shake-float-above-textarea-filled{0%{transform:translateX(calc(0 - 0%)) translateY(-10.25px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 0%)) translateY(-10.25px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 0%)) translateY(-10.25px) scale(0.75)}100%{transform:translateX(calc(0 - 0%)) translateY(-10.25px) scale(0.75)}}.mdc-text-field--textarea.mdc-text-field--filled .mdc-text-field__input{margin-top:23px;margin-bottom:9px}.mdc-text-field--textarea.mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__input{margin-top:16px;margin-bottom:16px}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:0}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-floating-label--float-above{transform:translateY(-27.25px) scale(1)}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-floating-label--float-above{font-size:.75rem}.mdc-text-field--textarea.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--textarea.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-24.75px) scale(0.75)}.mdc-text-field--textarea.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--textarea.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-textarea-outlined 250ms 1}@keyframes mdc-floating-label-shake-float-above-textarea-outlined{0%{transform:translateX(calc(0 - 0%)) translateY(-24.75px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 0%)) translateY(-24.75px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 0%)) translateY(-24.75px) scale(0.75)}100%{transform:translateX(calc(0 - 0%)) translateY(-24.75px) scale(0.75)}}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-text-field__input{margin-top:16px;margin-bottom:16px}.mdc-text-field--textarea.mdc-text-field--outlined .mdc-floating-label{top:18px}.mdc-text-field--textarea.mdc-text-field--with-internal-counter .mdc-text-field__input{margin-bottom:2px}.mdc-text-field--textarea.mdc-text-field--with-internal-counter .mdc-text-field-character-counter{align-self:flex-end;padding:0 16px}.mdc-text-field--textarea.mdc-text-field--with-internal-counter .mdc-text-field-character-counter::after{display:inline-block;width:0;height:16px;content:"";vertical-align:-16px}.mdc-text-field--textarea.mdc-text-field--with-internal-counter .mdc-text-field-character-counter::before{display:none}.mdc-text-field__resizer{align-self:stretch;display:inline-flex;flex-direction:column;flex-grow:1;max-height:100%;max-width:100%;min-height:56px;min-width:fit-content;min-width:-moz-available;min-width:-webkit-fill-available;overflow:hidden;resize:both}.mdc-text-field--filled .mdc-text-field__resizer{transform:translateY(-1px)}.mdc-text-field--filled .mdc-text-field__resizer .mdc-text-field__input,.mdc-text-field--filled .mdc-text-field__resizer .mdc-text-field-character-counter{transform:translateY(1px)}.mdc-text-field--outlined .mdc-text-field__resizer{transform:translateX(-1px) translateY(-1px)}[dir=rtl] .mdc-text-field--outlined .mdc-text-field__resizer,.mdc-text-field--outlined .mdc-text-field__resizer[dir=rtl]{transform:translateX(1px) translateY(-1px)}.mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field__input,.mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field-character-counter{transform:translateX(1px) translateY(1px)}[dir=rtl] .mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field__input,[dir=rtl] .mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field-character-counter,.mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field__input[dir=rtl],.mdc-text-field--outlined .mdc-text-field__resizer .mdc-text-field-character-counter[dir=rtl]{transform:translateX(-1px) translateY(1px)}.mdc-text-field--with-leading-icon{padding-left:0;padding-right:16px}[dir=rtl] .mdc-text-field--with-leading-icon,.mdc-text-field--with-leading-icon[dir=rtl]{padding-left:16px;padding-right:0}.mdc-text-field--with-leading-icon.mdc-text-field--filled .mdc-floating-label{max-width:calc(100% - 48px);left:48px;right:initial}[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--filled .mdc-floating-label,.mdc-text-field--with-leading-icon.mdc-text-field--filled .mdc-floating-label[dir=rtl]{left:initial;right:48px}.mdc-text-field--with-leading-icon.mdc-text-field--filled .mdc-floating-label--float-above{max-width:calc(100% / 0.75 - 64px / 0.75)}.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label{left:36px;right:initial}[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label,.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label[dir=rtl]{left:initial;right:36px}.mdc-text-field--with-leading-icon.mdc-text-field--outlined :not(.mdc-notched-outline--notched) .mdc-notched-outline__notch{max-width:calc(100% - 60px)}.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above{transform:translateY(-37.25px) translateX(-32px) scale(1)}[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above,.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above[dir=rtl]{transform:translateY(-37.25px) translateX(32px) scale(1)}.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--float-above{font-size:.75rem}.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-34.75px) translateX(-32px) scale(0.75)}[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl],.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above[dir=rtl]{transform:translateY(-34.75px) translateX(32px) scale(0.75)}.mdc-text-field--with-leading-icon.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-text-field-outlined-leading-icon 250ms 1}@keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon{0%{transform:translateX(calc(0 - 32px)) translateY(-34.75px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - 32px)) translateY(-34.75px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - 32px)) translateY(-34.75px) scale(0.75)}100%{transform:translateX(calc(0 - 32px)) translateY(-34.75px) scale(0.75)}}[dir=rtl] .mdc-text-field--with-leading-icon.mdc-text-field--outlined .mdc-floating-label--shake,.mdc-text-field--with-leading-icon.mdc-text-field--outlined[dir=rtl] .mdc-floating-label--shake{animation:mdc-floating-label-shake-float-above-text-field-outlined-leading-icon 250ms 1}@keyframes mdc-floating-label-shake-float-above-text-field-outlined-leading-icon-rtl{0%{transform:translateX(calc(0 - -32px)) translateY(-34.75px) scale(0.75)}33%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(calc(4% - -32px)) translateY(-34.75px) scale(0.75)}66%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(calc(-4% - -32px)) translateY(-34.75px) scale(0.75)}100%{transform:translateX(calc(0 - -32px)) translateY(-34.75px) scale(0.75)}}.mdc-text-field--with-trailing-icon{padding-left:16px;padding-right:0}[dir=rtl] .mdc-text-field--with-trailing-icon,.mdc-text-field--with-trailing-icon[dir=rtl]{padding-left:0;padding-right:16px}.mdc-text-field--with-trailing-icon.mdc-text-field--filled .mdc-floating-label{max-width:calc(100% - 64px)}.mdc-text-field--with-trailing-icon.mdc-text-field--filled .mdc-floating-label--float-above{max-width:calc(100% / 0.75 - 64px / 0.75)}.mdc-text-field--with-trailing-icon.mdc-text-field--outlined :not(.mdc-notched-outline--notched) .mdc-notched-outline__notch{max-width:calc(100% - 60px)}.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon{padding-left:0;padding-right:0}.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--filled .mdc-floating-label{max-width:calc(100% - 96px)}.mdc-text-field--with-leading-icon.mdc-text-field--with-trailing-icon.mdc-text-field--filled .mdc-floating-label--float-above{max-width:calc(100% / 0.75 - 96px / 0.75)}.mdc-text-field-helper-line{display:flex;justify-content:space-between;box-sizing:border-box}.mdc-text-field+.mdc-text-field-helper-line{padding-right:16px;padding-left:16px}.mdc-form-field>.mdc-text-field+label{align-self:flex-start}.mdc-text-field--focused:not(.mdc-text-field--disabled) .mdc-floating-label{color:rgba(98, 0, 238, 0.87)}.mdc-text-field--focused .mdc-notched-outline__leading,.mdc-text-field--focused .mdc-notched-outline__notch,.mdc-text-field--focused .mdc-notched-outline__trailing{border-width:2px}.mdc-text-field--focused+.mdc-text-field-helper-line .mdc-text-field-helper-text:not(.mdc-text-field-helper-text--validation-msg){opacity:1}.mdc-text-field--focused.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:2px}.mdc-text-field--focused.mdc-text-field--outlined.mdc-text-field--textarea .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:0}.mdc-text-field--invalid:not(.mdc-text-field--disabled):hover .mdc-line-ripple::before{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::after{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-floating-label{color:#b00020;color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--invalid+.mdc-text-field-helper-line .mdc-text-field-helper-text--validation-msg{color:#b00020;color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid .mdc-text-field__input{caret-color:#b00020;caret-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__icon--trailing{color:#b00020;color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::before{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing{border-color:#b00020;border-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__leading,.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__notch,.mdc-text-field--invalid:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-notched-outline .mdc-notched-outline__trailing{border-color:#b00020;border-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__leading,.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__notch,.mdc-text-field--invalid:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__trailing{border-color:#b00020;border-color:var(--mdc-theme-error, #b00020)}.mdc-text-field--invalid+.mdc-text-field-helper-line .mdc-text-field-helper-text--validation-msg{opacity:1}.mdc-text-field--disabled{pointer-events:none}.mdc-text-field--disabled .mdc-text-field__input{color:rgba(0, 0, 0, 0.38)}@media all{.mdc-text-field--disabled .mdc-text-field__input::placeholder{color:rgba(0, 0, 0, 0.38)}}@media all{.mdc-text-field--disabled .mdc-text-field__input:-ms-input-placeholder{color:rgba(0, 0, 0, 0.38)}}.mdc-text-field--disabled .mdc-floating-label{color:rgba(0, 0, 0, 0.38)}.mdc-text-field--disabled+.mdc-text-field-helper-line .mdc-text-field-helper-text{color:rgba(0, 0, 0, 0.38)}.mdc-text-field--disabled .mdc-text-field-character-counter,.mdc-text-field--disabled+.mdc-text-field-helper-line .mdc-text-field-character-counter{color:rgba(0, 0, 0, 0.38)}.mdc-text-field--disabled .mdc-text-field__icon--leading{color:rgba(0, 0, 0, 0.3)}.mdc-text-field--disabled .mdc-text-field__icon--trailing{color:rgba(0, 0, 0, 0.3)}.mdc-text-field--disabled .mdc-text-field__affix--prefix{color:rgba(0, 0, 0, 0.38)}.mdc-text-field--disabled .mdc-text-field__affix--suffix{color:rgba(0, 0, 0, 0.38)}.mdc-text-field--disabled .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.06)}.mdc-text-field--disabled .mdc-notched-outline__leading,.mdc-text-field--disabled .mdc-notched-outline__notch,.mdc-text-field--disabled .mdc-notched-outline__trailing{border-color:rgba(0, 0, 0, 0.06)}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field__input::placeholder{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field__input:-ms-input-placeholder{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-floating-label{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled+.mdc-text-field-helper-line .mdc-text-field-helper-text{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field-character-counter,.mdc-text-field--disabled+.mdc-text-field-helper-line .mdc-text-field-character-counter{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field__icon--leading{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field__icon--trailing{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field__affix--prefix{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-text-field__affix--suffix{color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-line-ripple::before{border-bottom-color:GrayText}}@media screen and (forced-colors: active),(-ms-high-contrast: active){.mdc-text-field--disabled .mdc-notched-outline__leading,.mdc-text-field--disabled .mdc-notched-outline__notch,.mdc-text-field--disabled .mdc-notched-outline__trailing{border-color:GrayText}}@media screen and (forced-colors: active){.mdc-text-field--disabled .mdc-text-field__input{background-color:Window}}.mdc-text-field--disabled .mdc-floating-label{cursor:default}.mdc-text-field--disabled.mdc-text-field--filled{background-color:#fafafa}.mdc-text-field--disabled.mdc-text-field--filled .mdc-text-field__ripple{display:none}.mdc-text-field--disabled .mdc-text-field__input{pointer-events:auto}.mdc-text-field--end-aligned .mdc-text-field__input{text-align:right}[dir=rtl] .mdc-text-field--end-aligned .mdc-text-field__input,.mdc-text-field--end-aligned .mdc-text-field__input[dir=rtl]{text-align:left}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__input,[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__input,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix{direction:ltr}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix--prefix,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix--prefix{padding-left:0;padding-right:2px}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix--suffix,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix--suffix{padding-left:12px;padding-right:0}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__icon--leading,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__icon--leading{order:1}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix--suffix,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix--suffix{order:2}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__input,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__input{order:3}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__affix--prefix,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__affix--prefix{order:4}[dir=rtl] .mdc-text-field--ltr-text .mdc-text-field__icon--trailing,.mdc-text-field--ltr-text[dir=rtl] .mdc-text-field__icon--trailing{order:5}[dir=rtl] .mdc-text-field--ltr-text.mdc-text-field--end-aligned .mdc-text-field__input,.mdc-text-field--ltr-text.mdc-text-field--end-aligned[dir=rtl] .mdc-text-field__input{text-align:right}[dir=rtl] .mdc-text-field--ltr-text.mdc-text-field--end-aligned .mdc-text-field__affix--prefix,.mdc-text-field--ltr-text.mdc-text-field--end-aligned[dir=rtl] .mdc-text-field__affix--prefix{padding-right:12px}[dir=rtl] .mdc-text-field--ltr-text.mdc-text-field--end-aligned .mdc-text-field__affix--suffix,.mdc-text-field--ltr-text.mdc-text-field--end-aligned[dir=rtl] .mdc-text-field__affix--suffix{padding-left:2px}.mdc-text-field-helper-text{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-caption-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.75rem;font-size:var(--mdc-typography-caption-font-size, 0.75rem);line-height:1.25rem;line-height:var(--mdc-typography-caption-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-caption-font-weight, 400);letter-spacing:0.0333333333em;letter-spacing:var(--mdc-typography-caption-letter-spacing, 0.0333333333em);text-decoration:inherit;text-decoration:var(--mdc-typography-caption-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-caption-text-transform, inherit);display:block;margin-top:0;line-height:normal;margin:0;opacity:0;will-change:opacity;transition:opacity 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-text-field-helper-text::before{display:inline-block;width:0;height:16px;content:"";vertical-align:0}.mdc-text-field-helper-text--persistent{transition:none;opacity:1;will-change:initial}.mdc-text-field-character-counter{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-caption-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.75rem;font-size:var(--mdc-typography-caption-font-size, 0.75rem);line-height:1.25rem;line-height:var(--mdc-typography-caption-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-caption-font-weight, 400);letter-spacing:0.0333333333em;letter-spacing:var(--mdc-typography-caption-letter-spacing, 0.0333333333em);text-decoration:inherit;text-decoration:var(--mdc-typography-caption-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-caption-text-transform, inherit);display:block;margin-top:0;line-height:normal;margin-left:auto;margin-right:0;padding-left:16px;padding-right:0;white-space:nowrap}.mdc-text-field-character-counter::before{display:inline-block;width:0;height:16px;content:"";vertical-align:0}[dir=rtl] .mdc-text-field-character-counter,.mdc-text-field-character-counter[dir=rtl]{margin-left:0;margin-right:auto}[dir=rtl] .mdc-text-field-character-counter,.mdc-text-field-character-counter[dir=rtl]{padding-left:0;padding-right:16px}.mdc-text-field__icon{align-self:center;cursor:pointer}.mdc-text-field__icon:not([tabindex]),.mdc-text-field__icon[tabindex="-1"]{cursor:default;pointer-events:none}.mdc-text-field__icon svg{display:block}.mdc-text-field__icon--leading{margin-left:16px;margin-right:8px}[dir=rtl] .mdc-text-field__icon--leading,.mdc-text-field__icon--leading[dir=rtl]{margin-left:8px;margin-right:16px}.mdc-text-field__icon--trailing{padding:12px;margin-left:0px;margin-right:0px}[dir=rtl] .mdc-text-field__icon--trailing,.mdc-text-field__icon--trailing[dir=rtl]{margin-left:0px;margin-right:0px}.material-icons{font-family:var(--mdc-icon-font, "Material Icons");font-weight:normal;font-style:normal;font-size:var(--mdc-icon-size, 24px);line-height:1;letter-spacing:normal;text-transform:none;display:inline-block;white-space:nowrap;word-wrap:normal;direction:ltr;-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility;-moz-osx-font-smoothing:grayscale;font-feature-settings:"liga"}:host{display:inline-flex;flex-direction:column;outline:none}.mdc-text-field{width:100%}.mdc-text-field:not(.mdc-text-field--disabled) .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.42);border-bottom-color:var(--mdc-text-field-idle-line-color, rgba(0, 0, 0, 0.42))}.mdc-text-field:not(.mdc-text-field--disabled):hover .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.87);border-bottom-color:var(--mdc-text-field-hover-line-color, rgba(0, 0, 0, 0.87))}.mdc-text-field.mdc-text-field--disabled .mdc-line-ripple::before{border-bottom-color:rgba(0, 0, 0, 0.06);border-bottom-color:var(--mdc-text-field-disabled-line-color, rgba(0, 0, 0, 0.06))}.mdc-text-field.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::before{border-bottom-color:#b00020;border-bottom-color:var(--mdc-theme-error, #b00020)}mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-text-field-outlined-idle-border-color, rgba(0, 0, 0, 0.38) )}:host(:not([disabled]):hover) :not(.mdc-text-field--invalid):not(.mdc-text-field--focused) mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-text-field-outlined-hover-border-color, rgba(0, 0, 0, 0.87) )}:host(:not([disabled])) .mdc-text-field:not(.mdc-text-field--outlined){background-color:var(--mdc-text-field-fill-color, whitesmoke)}:host(:not([disabled])) .mdc-text-field.mdc-text-field--invalid mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-text-field-error-color, var(--mdc-theme-error, #b00020) )}:host(:not([disabled])) .mdc-text-field.mdc-text-field--invalid+.mdc-text-field-helper-line .mdc-text-field-character-counter,:host(:not([disabled])) .mdc-text-field.mdc-text-field--invalid .mdc-text-field__icon{color:var(--mdc-text-field-error-color, var(--mdc-theme-error, #b00020))}:host(:not([disabled])) .mdc-text-field:not(.mdc-text-field--invalid):not(.mdc-text-field--focused) .mdc-floating-label,:host(:not([disabled])) .mdc-text-field:not(.mdc-text-field--invalid):not(.mdc-text-field--focused) .mdc-floating-label::after{color:var(--mdc-text-field-label-ink-color, rgba(0, 0, 0, 0.6))}:host(:not([disabled])) .mdc-text-field.mdc-text-field--focused mwc-notched-outline{--mdc-notched-outline-stroke-width: 2px}:host(:not([disabled])) .mdc-text-field.mdc-text-field--focused:not(.mdc-text-field--invalid) mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-text-field-focused-label-color, var(--mdc-theme-primary, rgba(98, 0, 238, 0.87)) )}:host(:not([disabled])) .mdc-text-field.mdc-text-field--focused:not(.mdc-text-field--invalid) .mdc-floating-label{color:#6200ee;color:var(--mdc-theme-primary, #6200ee)}:host(:not([disabled])) .mdc-text-field .mdc-text-field__input{color:var(--mdc-text-field-ink-color, rgba(0, 0, 0, 0.87))}:host(:not([disabled])) .mdc-text-field .mdc-text-field__input::placeholder{color:var(--mdc-text-field-label-ink-color, rgba(0, 0, 0, 0.6))}:host(:not([disabled])) .mdc-text-field-helper-line .mdc-text-field-helper-text:not(.mdc-text-field-helper-text--validation-msg),:host(:not([disabled])) .mdc-text-field-helper-line:not(.mdc-text-field--invalid) .mdc-text-field-character-counter{color:var(--mdc-text-field-label-ink-color, rgba(0, 0, 0, 0.6))}:host([disabled]) .mdc-text-field:not(.mdc-text-field--outlined){background-color:var(--mdc-text-field-disabled-fill-color, #fafafa)}:host([disabled]) .mdc-text-field.mdc-text-field--outlined mwc-notched-outline{--mdc-notched-outline-border-color: var( --mdc-text-field-outlined-disabled-border-color, rgba(0, 0, 0, 0.06) )}:host([disabled]) .mdc-text-field:not(.mdc-text-field--invalid):not(.mdc-text-field--focused) .mdc-floating-label,:host([disabled]) .mdc-text-field:not(.mdc-text-field--invalid):not(.mdc-text-field--focused) .mdc-floating-label::after{color:var(--mdc-text-field-disabled-ink-color, rgba(0, 0, 0, 0.38))}:host([disabled]) .mdc-text-field .mdc-text-field__input,:host([disabled]) .mdc-text-field .mdc-text-field__input::placeholder{color:var(--mdc-text-field-disabled-ink-color, rgba(0, 0, 0, 0.38))}:host([disabled]) .mdc-text-field-helper-line .mdc-text-field-helper-text,:host([disabled]) .mdc-text-field-helper-line .mdc-text-field-character-counter{color:var(--mdc-text-field-disabled-ink-color, rgba(0, 0, 0, 0.38))}`;

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/** @soyCompatible */
let TextField = class TextField extends TextFieldBase {
};
TextField.styles = [styles$3];
TextField = __decorate([
    customElement('mwc-textfield')
], TextField);

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fires request-selected {RequestSelectedDetail}
 * @fires list-item-rendered
 */
class ListItemBase extends LitElement {
    constructor() {
        super(...arguments);
        this.value = '';
        this.group = null;
        this.tabindex = -1;
        this.disabled = false;
        this.twoline = false;
        this.activated = false;
        this.graphic = null;
        this.multipleGraphics = false;
        this.hasMeta = false;
        this.noninteractive = false;
        this.selected = false;
        this.shouldRenderRipple = false;
        this._managingList = null;
        this.boundOnClick = this.onClick.bind(this);
        this._firstChanged = true;
        this._skipPropRequest = false;
        this.rippleHandlers = new RippleHandlers(() => {
            this.shouldRenderRipple = true;
            return this.ripple;
        });
        this.listeners = [
            {
                target: this,
                eventNames: ['click'],
                cb: () => {
                    this.onClick();
                },
            },
            {
                target: this,
                eventNames: ['mouseenter'],
                cb: this.rippleHandlers.startHover,
            },
            {
                target: this,
                eventNames: ['mouseleave'],
                cb: this.rippleHandlers.endHover,
            },
            {
                target: this,
                eventNames: ['focus'],
                cb: this.rippleHandlers.startFocus,
            },
            {
                target: this,
                eventNames: ['blur'],
                cb: this.rippleHandlers.endFocus,
            },
            {
                target: this,
                eventNames: ['mousedown', 'touchstart'],
                cb: (e) => {
                    const name = e.type;
                    this.onDown(name === 'mousedown' ? 'mouseup' : 'touchend', e);
                },
            },
        ];
    }
    get text() {
        const textContent = this.textContent;
        return textContent ? textContent.trim() : '';
    }
    render() {
        const text = this.renderText();
        const graphic = this.graphic ? this.renderGraphic() : html ``;
        const meta = this.hasMeta ? this.renderMeta() : html ``;
        return html `
      ${this.renderRipple()}
      ${graphic}
      ${text}
      ${meta}`;
    }
    renderRipple() {
        if (this.shouldRenderRipple) {
            return html `
      <mwc-ripple
        .activated=${this.activated}>
      </mwc-ripple>`;
        }
        else if (this.activated) {
            return html `<div class="fake-activated-ripple"></div>`;
        }
        else {
            return '';
        }
    }
    renderGraphic() {
        const graphicClasses = {
            multi: this.multipleGraphics,
        };
        return html `
      <span class="mdc-deprecated-list-item__graphic material-icons ${classMap(graphicClasses)}">
        <slot name="graphic"></slot>
      </span>`;
    }
    renderMeta() {
        return html `
      <span class="mdc-deprecated-list-item__meta material-icons">
        <slot name="meta"></slot>
      </span>`;
    }
    renderText() {
        const inner = this.twoline ? this.renderTwoline() : this.renderSingleLine();
        return html `
      <span class="mdc-deprecated-list-item__text">
        ${inner}
      </span>`;
    }
    renderSingleLine() {
        return html `<slot></slot>`;
    }
    renderTwoline() {
        return html `
      <span class="mdc-deprecated-list-item__primary-text">
        <slot></slot>
      </span>
      <span class="mdc-deprecated-list-item__secondary-text">
        <slot name="secondary"></slot>
      </span>
    `;
    }
    onClick() {
        this.fireRequestSelected(!this.selected, 'interaction');
    }
    onDown(upName, evt) {
        const onUp = () => {
            window.removeEventListener(upName, onUp);
            this.rippleHandlers.endPress();
        };
        window.addEventListener(upName, onUp);
        this.rippleHandlers.startPress(evt);
    }
    fireRequestSelected(selected, source) {
        if (this.noninteractive) {
            return;
        }
        const customEv = new CustomEvent('request-selected', { bubbles: true, composed: true, detail: { source, selected } });
        this.dispatchEvent(customEv);
    }
    connectedCallback() {
        super.connectedCallback();
        if (!this.noninteractive) {
            this.setAttribute('mwc-list-item', '');
        }
        for (const listener of this.listeners) {
            for (const eventName of listener.eventNames) {
                listener.target.addEventListener(eventName, listener.cb, { passive: true });
            }
        }
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        for (const listener of this.listeners) {
            for (const eventName of listener.eventNames) {
                listener.target.removeEventListener(eventName, listener.cb);
            }
        }
        if (this._managingList) {
            this._managingList.debouncedLayout ?
                this._managingList.debouncedLayout(true) :
                this._managingList.layout(true);
        }
    }
    // composed flag, event fire through shadow root and up through composed tree
    firstUpdated() {
        const ev = new Event('list-item-rendered', { bubbles: true, composed: true });
        this.dispatchEvent(ev);
    }
}
__decorate([
    query('slot')
], ListItemBase.prototype, "slotElement", void 0);
__decorate([
    queryAsync('mwc-ripple')
], ListItemBase.prototype, "ripple", void 0);
__decorate([
    property({ type: String })
], ListItemBase.prototype, "value", void 0);
__decorate([
    property({ type: String, reflect: true })
], ListItemBase.prototype, "group", void 0);
__decorate([
    property({ type: Number, reflect: true })
], ListItemBase.prototype, "tabindex", void 0);
__decorate([
    property({ type: Boolean, reflect: true }),
    observer(function (value) {
        if (value) {
            this.setAttribute('aria-disabled', 'true');
        }
        else {
            this.setAttribute('aria-disabled', 'false');
        }
    })
], ListItemBase.prototype, "disabled", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], ListItemBase.prototype, "twoline", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], ListItemBase.prototype, "activated", void 0);
__decorate([
    property({ type: String, reflect: true })
], ListItemBase.prototype, "graphic", void 0);
__decorate([
    property({ type: Boolean })
], ListItemBase.prototype, "multipleGraphics", void 0);
__decorate([
    property({ type: Boolean })
], ListItemBase.prototype, "hasMeta", void 0);
__decorate([
    property({ type: Boolean, reflect: true }),
    observer(function (value) {
        if (value) {
            this.removeAttribute('aria-checked');
            this.removeAttribute('mwc-list-item');
            this.selected = false;
            this.activated = false;
            this.tabIndex = -1;
        }
        else {
            this.setAttribute('mwc-list-item', '');
        }
    })
], ListItemBase.prototype, "noninteractive", void 0);
__decorate([
    property({ type: Boolean, reflect: true }),
    observer(function (value) {
        const role = this.getAttribute('role');
        const isAriaSelectable = role === 'gridcell' || role === 'option' ||
            role === 'row' || role === 'tab';
        if (isAriaSelectable && value) {
            this.setAttribute('aria-selected', 'true');
        }
        else if (isAriaSelectable) {
            this.setAttribute('aria-selected', 'false');
        }
        if (this._firstChanged) {
            this._firstChanged = false;
            return;
        }
        if (this._skipPropRequest) {
            return;
        }
        this.fireRequestSelected(value, 'property');
    })
], ListItemBase.prototype, "selected", void 0);
__decorate([
    state()
], ListItemBase.prototype, "shouldRenderRipple", void 0);
__decorate([
    state()
], ListItemBase.prototype, "_managingList", void 0);

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class CheckListItemBase extends ListItemBase {
    constructor() {
        super(...arguments);
        this.left = false;
        this.graphic = 'control';
    }
    render() {
        const checkboxClasses = {
            'mdc-deprecated-list-item__graphic': this.left,
            'mdc-deprecated-list-item__meta': !this.left,
        };
        const text = this.renderText();
        const graphic = this.graphic && this.graphic !== 'control' && !this.left ?
            this.renderGraphic() :
            html ``;
        const meta = this.hasMeta && this.left ? this.renderMeta() : html ``;
        const ripple = this.renderRipple();
        return html `
      ${ripple}
      ${graphic}
      ${this.left ? '' : text}
      <span class=${classMap(checkboxClasses)}>
        <mwc-checkbox
            reducedTouchTarget
            tabindex=${this.tabindex}
            .checked=${this.selected}
            ?disabled=${this.disabled}
            @change=${this.onChange}>
        </mwc-checkbox>
      </span>
      ${this.left ? text : ''}
      ${meta}`;
    }
    async onChange(evt) {
        const checkbox = evt.target;
        const changeFromProp = this.selected === checkbox.checked;
        if (!changeFromProp) {
            this._skipPropRequest = true;
            this.selected = checkbox.checked;
            await this.updateComplete;
            this._skipPropRequest = false;
        }
    }
}
__decorate([
    query('slot')
], CheckListItemBase.prototype, "slotElement", void 0);
__decorate([
    query('mwc-checkbox')
], CheckListItemBase.prototype, "checkboxElement", void 0);
__decorate([
    property({ type: Boolean })
], CheckListItemBase.prototype, "left", void 0);
__decorate([
    property({ type: String, reflect: true })
], CheckListItemBase.prototype, "graphic", void 0);

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
const styles$2 = css `:host(:not([twoline])){height:56px}:host(:not([left])) .mdc-deprecated-list-item__meta{height:40px;width:40px}`;

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
const styles$1 = css `:host{cursor:pointer;user-select:none;-webkit-tap-highlight-color:transparent;height:48px;display:flex;position:relative;align-items:center;justify-content:flex-start;overflow:hidden;padding:0;padding-left:var(--mdc-list-side-padding, 16px);padding-right:var(--mdc-list-side-padding, 16px);outline:none;height:48px;color:rgba(0,0,0,.87);color:var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87))}:host:focus{outline:none}:host([activated]){color:#6200ee;color:var(--mdc-theme-primary, #6200ee);--mdc-ripple-color: var( --mdc-theme-primary, #6200ee )}:host([activated]) .mdc-deprecated-list-item__graphic{color:#6200ee;color:var(--mdc-theme-primary, #6200ee)}:host([activated]) .fake-activated-ripple::before{position:absolute;display:block;top:0;bottom:0;left:0;right:0;width:100%;height:100%;pointer-events:none;z-index:1;content:"";opacity:0.12;opacity:var(--mdc-ripple-activated-opacity, 0.12);background-color:#6200ee;background-color:var(--mdc-ripple-color, var(--mdc-theme-primary, #6200ee))}.mdc-deprecated-list-item__graphic{flex-shrink:0;align-items:center;justify-content:center;fill:currentColor;display:inline-flex}.mdc-deprecated-list-item__graphic ::slotted(*){flex-shrink:0;align-items:center;justify-content:center;fill:currentColor;width:100%;height:100%;text-align:center}.mdc-deprecated-list-item__meta{width:var(--mdc-list-item-meta-size, 24px);height:var(--mdc-list-item-meta-size, 24px);margin-left:auto;margin-right:0;color:rgba(0, 0, 0, 0.38);color:var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.38))}.mdc-deprecated-list-item__meta.multi{width:auto}.mdc-deprecated-list-item__meta ::slotted(*){width:var(--mdc-list-item-meta-size, 24px);line-height:var(--mdc-list-item-meta-size, 24px)}.mdc-deprecated-list-item__meta ::slotted(.material-icons),.mdc-deprecated-list-item__meta ::slotted(mwc-icon){line-height:var(--mdc-list-item-meta-size, 24px) !important}.mdc-deprecated-list-item__meta ::slotted(:not(.material-icons):not(mwc-icon)){-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-caption-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.75rem;font-size:var(--mdc-typography-caption-font-size, 0.75rem);line-height:1.25rem;line-height:var(--mdc-typography-caption-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-caption-font-weight, 400);letter-spacing:0.0333333333em;letter-spacing:var(--mdc-typography-caption-letter-spacing, 0.0333333333em);text-decoration:inherit;text-decoration:var(--mdc-typography-caption-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-caption-text-transform, inherit)}[dir=rtl] .mdc-deprecated-list-item__meta,.mdc-deprecated-list-item__meta[dir=rtl]{margin-left:0;margin-right:auto}.mdc-deprecated-list-item__meta ::slotted(*){width:100%;height:100%}.mdc-deprecated-list-item__text{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.mdc-deprecated-list-item__text ::slotted([for]),.mdc-deprecated-list-item__text[for]{pointer-events:none}.mdc-deprecated-list-item__primary-text{text-overflow:ellipsis;white-space:nowrap;overflow:hidden;display:block;margin-top:0;line-height:normal;margin-bottom:-20px;display:block}.mdc-deprecated-list-item__primary-text::before{display:inline-block;width:0;height:32px;content:"";vertical-align:0}.mdc-deprecated-list-item__primary-text::after{display:inline-block;width:0;height:20px;content:"";vertical-align:-20px}.mdc-deprecated-list-item__secondary-text{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-body2-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:0.875rem;font-size:var(--mdc-typography-body2-font-size, 0.875rem);line-height:1.25rem;line-height:var(--mdc-typography-body2-line-height, 1.25rem);font-weight:400;font-weight:var(--mdc-typography-body2-font-weight, 400);letter-spacing:0.0178571429em;letter-spacing:var(--mdc-typography-body2-letter-spacing, 0.0178571429em);text-decoration:inherit;text-decoration:var(--mdc-typography-body2-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-body2-text-transform, inherit);text-overflow:ellipsis;white-space:nowrap;overflow:hidden;display:block;margin-top:0;line-height:normal;display:block}.mdc-deprecated-list-item__secondary-text::before{display:inline-block;width:0;height:20px;content:"";vertical-align:0}.mdc-deprecated-list--dense .mdc-deprecated-list-item__secondary-text{font-size:inherit}* ::slotted(a),a{color:inherit;text-decoration:none}:host([twoline]){height:72px}:host([twoline]) .mdc-deprecated-list-item__text{align-self:flex-start}:host([disabled]),:host([noninteractive]){cursor:default;pointer-events:none}:host([disabled]) .mdc-deprecated-list-item__text ::slotted(*){opacity:.38}:host([disabled]) .mdc-deprecated-list-item__text ::slotted(*),:host([disabled]) .mdc-deprecated-list-item__primary-text ::slotted(*),:host([disabled]) .mdc-deprecated-list-item__secondary-text ::slotted(*){color:#000;color:var(--mdc-theme-on-surface, #000)}.mdc-deprecated-list-item__secondary-text ::slotted(*){color:rgba(0, 0, 0, 0.54);color:var(--mdc-theme-text-secondary-on-background, rgba(0, 0, 0, 0.54))}.mdc-deprecated-list-item__graphic ::slotted(*){background-color:transparent;color:rgba(0, 0, 0, 0.38);color:var(--mdc-theme-text-icon-on-background, rgba(0, 0, 0, 0.38))}.mdc-deprecated-list-group__subheader ::slotted(*){color:rgba(0, 0, 0, 0.87);color:var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87))}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic{width:var(--mdc-list-item-graphic-size, 40px);height:var(--mdc-list-item-graphic-size, 40px)}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic.multi{width:auto}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic ::slotted(*){width:var(--mdc-list-item-graphic-size, 40px);line-height:var(--mdc-list-item-graphic-size, 40px)}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic ::slotted(.material-icons),:host([graphic=avatar]) .mdc-deprecated-list-item__graphic ::slotted(mwc-icon){line-height:var(--mdc-list-item-graphic-size, 40px) !important}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic ::slotted(*){border-radius:50%}:host([graphic=avatar]) .mdc-deprecated-list-item__graphic,:host([graphic=medium]) .mdc-deprecated-list-item__graphic,:host([graphic=large]) .mdc-deprecated-list-item__graphic,:host([graphic=control]) .mdc-deprecated-list-item__graphic{margin-left:0;margin-right:var(--mdc-list-item-graphic-margin, 16px)}[dir=rtl] :host([graphic=avatar]) .mdc-deprecated-list-item__graphic,[dir=rtl] :host([graphic=medium]) .mdc-deprecated-list-item__graphic,[dir=rtl] :host([graphic=large]) .mdc-deprecated-list-item__graphic,[dir=rtl] :host([graphic=control]) .mdc-deprecated-list-item__graphic,:host([graphic=avatar]) .mdc-deprecated-list-item__graphic[dir=rtl],:host([graphic=medium]) .mdc-deprecated-list-item__graphic[dir=rtl],:host([graphic=large]) .mdc-deprecated-list-item__graphic[dir=rtl],:host([graphic=control]) .mdc-deprecated-list-item__graphic[dir=rtl]{margin-left:var(--mdc-list-item-graphic-margin, 16px);margin-right:0}:host([graphic=icon]) .mdc-deprecated-list-item__graphic{width:var(--mdc-list-item-graphic-size, 24px);height:var(--mdc-list-item-graphic-size, 24px);margin-left:0;margin-right:var(--mdc-list-item-graphic-margin, 32px)}:host([graphic=icon]) .mdc-deprecated-list-item__graphic.multi{width:auto}:host([graphic=icon]) .mdc-deprecated-list-item__graphic ::slotted(*){width:var(--mdc-list-item-graphic-size, 24px);line-height:var(--mdc-list-item-graphic-size, 24px)}:host([graphic=icon]) .mdc-deprecated-list-item__graphic ::slotted(.material-icons),:host([graphic=icon]) .mdc-deprecated-list-item__graphic ::slotted(mwc-icon){line-height:var(--mdc-list-item-graphic-size, 24px) !important}[dir=rtl] :host([graphic=icon]) .mdc-deprecated-list-item__graphic,:host([graphic=icon]) .mdc-deprecated-list-item__graphic[dir=rtl]{margin-left:var(--mdc-list-item-graphic-margin, 32px);margin-right:0}:host([graphic=avatar]:not([twoLine])),:host([graphic=icon]:not([twoLine])){height:56px}:host([graphic=medium]:not([twoLine])),:host([graphic=large]:not([twoLine])){height:72px}:host([graphic=medium]) .mdc-deprecated-list-item__graphic,:host([graphic=large]) .mdc-deprecated-list-item__graphic{width:var(--mdc-list-item-graphic-size, 56px);height:var(--mdc-list-item-graphic-size, 56px)}:host([graphic=medium]) .mdc-deprecated-list-item__graphic.multi,:host([graphic=large]) .mdc-deprecated-list-item__graphic.multi{width:auto}:host([graphic=medium]) .mdc-deprecated-list-item__graphic ::slotted(*),:host([graphic=large]) .mdc-deprecated-list-item__graphic ::slotted(*){width:var(--mdc-list-item-graphic-size, 56px);line-height:var(--mdc-list-item-graphic-size, 56px)}:host([graphic=medium]) .mdc-deprecated-list-item__graphic ::slotted(.material-icons),:host([graphic=medium]) .mdc-deprecated-list-item__graphic ::slotted(mwc-icon),:host([graphic=large]) .mdc-deprecated-list-item__graphic ::slotted(.material-icons),:host([graphic=large]) .mdc-deprecated-list-item__graphic ::slotted(mwc-icon){line-height:var(--mdc-list-item-graphic-size, 56px) !important}:host([graphic=large]){padding-left:0px}`;

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
let CheckListItem = class CheckListItem extends CheckListItemBase {
};
CheckListItem.styles = [styles$1, styles$2];
CheckListItem = __decorate([
    customElement('mwc-check-list-item')
], CheckListItem);

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
let ListItem = class ListItem extends ListItemBase {
};
ListItem.styles = [styles$1];
ListItem = __decorate([
    customElement('mwc-list-item')
], ListItem);

/**
 * @license
 * Copyright 2020 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/**
 * KEY provides normalized string values for keys.
 */
var KEY = {
    UNKNOWN: 'Unknown',
    BACKSPACE: 'Backspace',
    ENTER: 'Enter',
    SPACEBAR: 'Spacebar',
    PAGE_UP: 'PageUp',
    PAGE_DOWN: 'PageDown',
    END: 'End',
    HOME: 'Home',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_UP: 'ArrowUp',
    ARROW_RIGHT: 'ArrowRight',
    ARROW_DOWN: 'ArrowDown',
    DELETE: 'Delete',
    ESCAPE: 'Escape',
    TAB: 'Tab',
};
var normalizedKeys = new Set();
// IE11 has no support for new Map with iterable so we need to initialize this
// by hand.
normalizedKeys.add(KEY.BACKSPACE);
normalizedKeys.add(KEY.ENTER);
normalizedKeys.add(KEY.SPACEBAR);
normalizedKeys.add(KEY.PAGE_UP);
normalizedKeys.add(KEY.PAGE_DOWN);
normalizedKeys.add(KEY.END);
normalizedKeys.add(KEY.HOME);
normalizedKeys.add(KEY.ARROW_LEFT);
normalizedKeys.add(KEY.ARROW_UP);
normalizedKeys.add(KEY.ARROW_RIGHT);
normalizedKeys.add(KEY.ARROW_DOWN);
normalizedKeys.add(KEY.DELETE);
normalizedKeys.add(KEY.ESCAPE);
normalizedKeys.add(KEY.TAB);
var KEY_CODE = {
    BACKSPACE: 8,
    ENTER: 13,
    SPACEBAR: 32,
    PAGE_UP: 33,
    PAGE_DOWN: 34,
    END: 35,
    HOME: 36,
    ARROW_LEFT: 37,
    ARROW_UP: 38,
    ARROW_RIGHT: 39,
    ARROW_DOWN: 40,
    DELETE: 46,
    ESCAPE: 27,
    TAB: 9,
};
var mappedKeyCodes = new Map();
// IE11 has no support for new Map with iterable so we need to initialize this
// by hand.
mappedKeyCodes.set(KEY_CODE.BACKSPACE, KEY.BACKSPACE);
mappedKeyCodes.set(KEY_CODE.ENTER, KEY.ENTER);
mappedKeyCodes.set(KEY_CODE.SPACEBAR, KEY.SPACEBAR);
mappedKeyCodes.set(KEY_CODE.PAGE_UP, KEY.PAGE_UP);
mappedKeyCodes.set(KEY_CODE.PAGE_DOWN, KEY.PAGE_DOWN);
mappedKeyCodes.set(KEY_CODE.END, KEY.END);
mappedKeyCodes.set(KEY_CODE.HOME, KEY.HOME);
mappedKeyCodes.set(KEY_CODE.ARROW_LEFT, KEY.ARROW_LEFT);
mappedKeyCodes.set(KEY_CODE.ARROW_UP, KEY.ARROW_UP);
mappedKeyCodes.set(KEY_CODE.ARROW_RIGHT, KEY.ARROW_RIGHT);
mappedKeyCodes.set(KEY_CODE.ARROW_DOWN, KEY.ARROW_DOWN);
mappedKeyCodes.set(KEY_CODE.DELETE, KEY.DELETE);
mappedKeyCodes.set(KEY_CODE.ESCAPE, KEY.ESCAPE);
mappedKeyCodes.set(KEY_CODE.TAB, KEY.TAB);
var navigationKeys = new Set();
// IE11 has no support for new Set with iterable so we need to initialize this
// by hand.
navigationKeys.add(KEY.PAGE_UP);
navigationKeys.add(KEY.PAGE_DOWN);
navigationKeys.add(KEY.END);
navigationKeys.add(KEY.HOME);
navigationKeys.add(KEY.ARROW_LEFT);
navigationKeys.add(KEY.ARROW_UP);
navigationKeys.add(KEY.ARROW_RIGHT);
navigationKeys.add(KEY.ARROW_DOWN);
/**
 * normalizeKey returns the normalized string for a navigational action.
 */
function normalizeKey(evt) {
    var key = evt.key;
    // If the event already has a normalized key, return it
    if (normalizedKeys.has(key)) {
        return key;
    }
    // tslint:disable-next-line:deprecation
    var mappedKey = mappedKeyCodes.get(evt.keyCode);
    if (mappedKey) {
        return mappedKey;
    }
    return KEY.UNKNOWN;
}

/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var _a, _b;
var cssClasses = {
    LIST_ITEM_ACTIVATED_CLASS: 'mdc-list-item--activated',
    LIST_ITEM_CLASS: 'mdc-list-item',
    LIST_ITEM_DISABLED_CLASS: 'mdc-list-item--disabled',
    LIST_ITEM_SELECTED_CLASS: 'mdc-list-item--selected',
    LIST_ITEM_TEXT_CLASS: 'mdc-list-item__text',
    LIST_ITEM_PRIMARY_TEXT_CLASS: 'mdc-list-item__primary-text',
    ROOT: 'mdc-list',
};
(_a = {},
    _a["" + cssClasses.LIST_ITEM_ACTIVATED_CLASS] = 'mdc-list-item--activated',
    _a["" + cssClasses.LIST_ITEM_CLASS] = 'mdc-list-item',
    _a["" + cssClasses.LIST_ITEM_DISABLED_CLASS] = 'mdc-list-item--disabled',
    _a["" + cssClasses.LIST_ITEM_SELECTED_CLASS] = 'mdc-list-item--selected',
    _a["" + cssClasses.LIST_ITEM_PRIMARY_TEXT_CLASS] = 'mdc-list-item__primary-text',
    _a["" + cssClasses.ROOT] = 'mdc-list',
    _a);
var deprecatedClassNameMap = (_b = {},
    _b["" + cssClasses.LIST_ITEM_ACTIVATED_CLASS] = 'mdc-deprecated-list-item--activated',
    _b["" + cssClasses.LIST_ITEM_CLASS] = 'mdc-deprecated-list-item',
    _b["" + cssClasses.LIST_ITEM_DISABLED_CLASS] = 'mdc-deprecated-list-item--disabled',
    _b["" + cssClasses.LIST_ITEM_SELECTED_CLASS] = 'mdc-deprecated-list-item--selected',
    _b["" + cssClasses.LIST_ITEM_TEXT_CLASS] = 'mdc-deprecated-list-item__text',
    _b["" + cssClasses.LIST_ITEM_PRIMARY_TEXT_CLASS] = 'mdc-deprecated-list-item__primary-text',
    _b["" + cssClasses.ROOT] = 'mdc-deprecated-list',
    _b);
var strings = {
    ACTION_EVENT: 'MDCList:action',
    ARIA_CHECKED: 'aria-checked',
    ARIA_CHECKED_CHECKBOX_SELECTOR: '[role="checkbox"][aria-checked="true"]',
    ARIA_CHECKED_RADIO_SELECTOR: '[role="radio"][aria-checked="true"]',
    ARIA_CURRENT: 'aria-current',
    ARIA_DISABLED: 'aria-disabled',
    ARIA_ORIENTATION: 'aria-orientation',
    ARIA_ORIENTATION_HORIZONTAL: 'horizontal',
    ARIA_ROLE_CHECKBOX_SELECTOR: '[role="checkbox"]',
    ARIA_SELECTED: 'aria-selected',
    ARIA_INTERACTIVE_ROLES_SELECTOR: '[role="listbox"], [role="menu"]',
    ARIA_MULTI_SELECTABLE_SELECTOR: '[aria-multiselectable="true"]',
    CHECKBOX_RADIO_SELECTOR: 'input[type="checkbox"], input[type="radio"]',
    CHECKBOX_SELECTOR: 'input[type="checkbox"]',
    CHILD_ELEMENTS_TO_TOGGLE_TABINDEX: "\n    ." + cssClasses.LIST_ITEM_CLASS + " button:not(:disabled),\n    ." + cssClasses.LIST_ITEM_CLASS + " a,\n    ." + deprecatedClassNameMap[cssClasses.LIST_ITEM_CLASS] + " button:not(:disabled),\n    ." + deprecatedClassNameMap[cssClasses.LIST_ITEM_CLASS] + " a\n  ",
    DEPRECATED_SELECTOR: '.mdc-deprecated-list',
    FOCUSABLE_CHILD_ELEMENTS: "\n    ." + cssClasses.LIST_ITEM_CLASS + " button:not(:disabled),\n    ." + cssClasses.LIST_ITEM_CLASS + " a,\n    ." + cssClasses.LIST_ITEM_CLASS + " input[type=\"radio\"]:not(:disabled),\n    ." + cssClasses.LIST_ITEM_CLASS + " input[type=\"checkbox\"]:not(:disabled),\n    ." + deprecatedClassNameMap[cssClasses.LIST_ITEM_CLASS] + " button:not(:disabled),\n    ." + deprecatedClassNameMap[cssClasses.LIST_ITEM_CLASS] + " a,\n    ." + deprecatedClassNameMap[cssClasses.LIST_ITEM_CLASS] + " input[type=\"radio\"]:not(:disabled),\n    ." + deprecatedClassNameMap[cssClasses.LIST_ITEM_CLASS] + " input[type=\"checkbox\"]:not(:disabled)\n  ",
    RADIO_SELECTOR: 'input[type="radio"]',
    SELECTED_ITEM_SELECTOR: '[aria-selected="true"], [aria-current="true"]',
};
var numbers = {
    UNSET_INDEX: -1,
    TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS: 300
};

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const integerSort = (a, b) => {
    return a - b;
};
const findIndexDiff = (oldSet, newSet) => {
    const oldArr = Array.from(oldSet);
    const newArr = Array.from(newSet);
    const diff = { added: [], removed: [] };
    const oldSorted = oldArr.sort(integerSort);
    const newSorted = newArr.sort(integerSort);
    let i = 0;
    let j = 0;
    while (i < oldSorted.length || j < newSorted.length) {
        const oldVal = oldSorted[i];
        const newVal = newSorted[j];
        if (oldVal === newVal) {
            i++;
            j++;
            continue;
        }
        if (oldVal !== undefined && (newVal === undefined || oldVal < newVal)) {
            diff.removed.push(oldVal);
            i++;
            continue;
        }
        if (newVal !== undefined && (oldVal === undefined || newVal < oldVal)) {
            diff.added.push(newVal);
            j++;
            continue;
        }
    }
    return diff;
};
const ELEMENTS_KEY_ALLOWED_IN = ['input', 'button', 'textarea', 'select'];
function isIndexSet(selectedIndex) {
    return selectedIndex instanceof Set;
}
const createSetFromIndex = (index) => {
    const entry = index === numbers.UNSET_INDEX ? new Set() : index;
    return isIndexSet(entry) ? new Set(entry) : new Set([entry]);
};
class MDCListFoundation extends MDCFoundation {
    constructor(adapter) {
        super(Object.assign(Object.assign({}, MDCListFoundation.defaultAdapter), adapter));
        this.isMulti_ = false;
        this.wrapFocus_ = false;
        this.isVertical_ = true;
        this.selectedIndex_ = numbers.UNSET_INDEX;
        this.focusedItemIndex_ = numbers.UNSET_INDEX;
        this.useActivatedClass_ = false;
        this.ariaCurrentAttrValue_ = null;
    }
    static get strings() {
        return strings;
    }
    static get numbers() {
        return numbers;
    }
    static get defaultAdapter() {
        return {
            focusItemAtIndex: () => undefined,
            getFocusedElementIndex: () => 0,
            getListItemCount: () => 0,
            isFocusInsideList: () => false,
            isRootFocused: () => false,
            notifyAction: () => undefined,
            notifySelected: () => undefined,
            getSelectedStateForElementIndex: () => false,
            setDisabledStateForElementIndex: () => undefined,
            getDisabledStateForElementIndex: () => false,
            setSelectedStateForElementIndex: () => undefined,
            setActivatedStateForElementIndex: () => undefined,
            setTabIndexForElementIndex: () => undefined,
            setAttributeForElementIndex: () => undefined,
            getAttributeForElementIndex: () => null,
        };
    }
    /**
     * Sets the private wrapFocus_ variable.
     */
    setWrapFocus(value) {
        this.wrapFocus_ = value;
    }
    /**
     * Sets the private wrapFocus_ variable.
     */
    setMulti(value) {
        this.isMulti_ = value;
        const currentIndex = this.selectedIndex_;
        if (value) {
            // number to set
            if (!isIndexSet(currentIndex)) {
                const isUnset = currentIndex === numbers.UNSET_INDEX;
                this.selectedIndex_ = isUnset ? new Set() : new Set([currentIndex]);
            }
        }
        else {
            // set to first sorted number in set
            if (isIndexSet(currentIndex)) {
                if (currentIndex.size) {
                    const vals = Array.from(currentIndex).sort(integerSort);
                    this.selectedIndex_ = vals[0];
                }
                else {
                    this.selectedIndex_ = numbers.UNSET_INDEX;
                }
            }
        }
    }
    /**
     * Sets the isVertical_ private variable.
     */
    setVerticalOrientation(value) {
        this.isVertical_ = value;
    }
    /**
     * Sets the useActivatedClass_ private variable.
     */
    setUseActivatedClass(useActivated) {
        this.useActivatedClass_ = useActivated;
    }
    getSelectedIndex() {
        return this.selectedIndex_;
    }
    setSelectedIndex(index) {
        if (!this.isIndexValid_(index)) {
            return;
        }
        if (this.isMulti_) {
            this.setMultiSelectionAtIndex_(createSetFromIndex(index));
        }
        else {
            this.setSingleSelectionAtIndex_(index);
        }
    }
    /**
     * Focus in handler for the list items.
     */
    handleFocusIn(_, listItemIndex) {
        if (listItemIndex >= 0) {
            this.adapter.setTabIndexForElementIndex(listItemIndex, 0);
        }
    }
    /**
     * Focus out handler for the list items.
     */
    handleFocusOut(_, listItemIndex) {
        if (listItemIndex >= 0) {
            this.adapter.setTabIndexForElementIndex(listItemIndex, -1);
        }
        /**
         * Between Focusout & Focusin some browsers do not have focus on any
         * element. Setting a delay to wait till the focus is moved to next element.
         */
        setTimeout(() => {
            if (!this.adapter.isFocusInsideList()) {
                this.setTabindexToFirstSelectedItem_();
            }
        }, 0);
    }
    /**
     * Key handler for the list.
     */
    handleKeydown(event, isRootListItem, listItemIndex) {
        const isArrowLeft = normalizeKey(event) === 'ArrowLeft';
        const isArrowUp = normalizeKey(event) === 'ArrowUp';
        const isArrowRight = normalizeKey(event) === 'ArrowRight';
        const isArrowDown = normalizeKey(event) === 'ArrowDown';
        const isHome = normalizeKey(event) === 'Home';
        const isEnd = normalizeKey(event) === 'End';
        const isEnter = normalizeKey(event) === 'Enter';
        const isSpace = normalizeKey(event) === 'Spacebar';
        if (this.adapter.isRootFocused()) {
            if (isArrowUp || isEnd) {
                event.preventDefault();
                this.focusLastElement();
            }
            else if (isArrowDown || isHome) {
                event.preventDefault();
                this.focusFirstElement();
            }
            return;
        }
        let currentIndex = this.adapter.getFocusedElementIndex();
        if (currentIndex === -1) {
            currentIndex = listItemIndex;
            if (currentIndex < 0) {
                // If this event doesn't have a mdc-deprecated-list-item ancestor from
                // the current list (not from a sublist), return early.
                return;
            }
        }
        let nextIndex;
        if ((this.isVertical_ && isArrowDown) ||
            (!this.isVertical_ && isArrowRight)) {
            this.preventDefaultEvent(event);
            nextIndex = this.focusNextElement(currentIndex);
        }
        else if ((this.isVertical_ && isArrowUp) || (!this.isVertical_ && isArrowLeft)) {
            this.preventDefaultEvent(event);
            nextIndex = this.focusPrevElement(currentIndex);
        }
        else if (isHome) {
            this.preventDefaultEvent(event);
            nextIndex = this.focusFirstElement();
        }
        else if (isEnd) {
            this.preventDefaultEvent(event);
            nextIndex = this.focusLastElement();
        }
        else if (isEnter || isSpace) {
            if (isRootListItem) {
                // Return early if enter key is pressed on anchor element which triggers
                // synthetic MouseEvent event.
                const target = event.target;
                if (target && target.tagName === 'A' && isEnter) {
                    return;
                }
                this.preventDefaultEvent(event);
                this.setSelectedIndexOnAction_(currentIndex, true);
            }
        }
        this.focusedItemIndex_ = currentIndex;
        if (nextIndex !== undefined) {
            this.setTabindexAtIndex_(nextIndex);
            this.focusedItemIndex_ = nextIndex;
        }
    }
    /**
     * Click handler for the list.
     */
    handleSingleSelection(index, isInteraction, force) {
        if (index === numbers.UNSET_INDEX) {
            return;
        }
        this.setSelectedIndexOnAction_(index, isInteraction, force);
        this.setTabindexAtIndex_(index);
        this.focusedItemIndex_ = index;
    }
    /**
     * Focuses the next element on the list.
     */
    focusNextElement(index) {
        const count = this.adapter.getListItemCount();
        let nextIndex = index + 1;
        if (nextIndex >= count) {
            if (this.wrapFocus_) {
                nextIndex = 0;
            }
            else {
                // Return early because last item is already focused.
                return index;
            }
        }
        this.adapter.focusItemAtIndex(nextIndex);
        return nextIndex;
    }
    /**
     * Focuses the previous element on the list.
     */
    focusPrevElement(index) {
        let prevIndex = index - 1;
        if (prevIndex < 0) {
            if (this.wrapFocus_) {
                prevIndex = this.adapter.getListItemCount() - 1;
            }
            else {
                // Return early because first item is already focused.
                return index;
            }
        }
        this.adapter.focusItemAtIndex(prevIndex);
        return prevIndex;
    }
    focusFirstElement() {
        this.adapter.focusItemAtIndex(0);
        return 0;
    }
    focusLastElement() {
        const lastIndex = this.adapter.getListItemCount() - 1;
        this.adapter.focusItemAtIndex(lastIndex);
        return lastIndex;
    }
    /**
     * @param itemIndex Index of the list item
     * @param isEnabled Sets the list item to enabled or disabled.
     */
    setEnabled(itemIndex, isEnabled) {
        if (!this.isIndexValid_(itemIndex)) {
            return;
        }
        this.adapter.setDisabledStateForElementIndex(itemIndex, !isEnabled);
    }
    /**
     * Ensures that preventDefault is only called if the containing element
     * doesn't consume the event, and it will cause an unintended scroll.
     */
    preventDefaultEvent(evt) {
        const target = evt.target;
        const tagName = `${target.tagName}`.toLowerCase();
        if (ELEMENTS_KEY_ALLOWED_IN.indexOf(tagName) === -1) {
            evt.preventDefault();
        }
    }
    setSingleSelectionAtIndex_(index, isInteraction = true) {
        if (this.selectedIndex_ === index) {
            return;
        }
        // unset previous
        if (this.selectedIndex_ !== numbers.UNSET_INDEX) {
            this.adapter.setSelectedStateForElementIndex(this.selectedIndex_, false);
            if (this.useActivatedClass_) {
                this.adapter.setActivatedStateForElementIndex(this.selectedIndex_, false);
            }
        }
        // set new
        if (isInteraction) {
            this.adapter.setSelectedStateForElementIndex(index, true);
        }
        if (this.useActivatedClass_) {
            this.adapter.setActivatedStateForElementIndex(index, true);
        }
        this.setAriaForSingleSelectionAtIndex_(index);
        this.selectedIndex_ = index;
        this.adapter.notifySelected(index);
    }
    setMultiSelectionAtIndex_(newIndex, isInteraction = true) {
        const oldIndex = createSetFromIndex(this.selectedIndex_);
        const diff = findIndexDiff(oldIndex, newIndex);
        if (!diff.removed.length && !diff.added.length) {
            return;
        }
        for (const removed of diff.removed) {
            if (isInteraction) {
                this.adapter.setSelectedStateForElementIndex(removed, false);
            }
            if (this.useActivatedClass_) {
                this.adapter.setActivatedStateForElementIndex(removed, false);
            }
        }
        for (const added of diff.added) {
            if (isInteraction) {
                this.adapter.setSelectedStateForElementIndex(added, true);
            }
            if (this.useActivatedClass_) {
                this.adapter.setActivatedStateForElementIndex(added, true);
            }
        }
        this.selectedIndex_ = newIndex;
        this.adapter.notifySelected(newIndex, diff);
    }
    /**
     * Sets aria attribute for single selection at given index.
     */
    setAriaForSingleSelectionAtIndex_(index) {
        // Detect the presence of aria-current and get the value only during list
        // initialization when it is in unset state.
        if (this.selectedIndex_ === numbers.UNSET_INDEX) {
            this.ariaCurrentAttrValue_ =
                this.adapter.getAttributeForElementIndex(index, strings.ARIA_CURRENT);
        }
        const isAriaCurrent = this.ariaCurrentAttrValue_ !== null;
        const ariaAttribute = isAriaCurrent ? strings.ARIA_CURRENT : strings.ARIA_SELECTED;
        if (this.selectedIndex_ !== numbers.UNSET_INDEX) {
            this.adapter.setAttributeForElementIndex(this.selectedIndex_, ariaAttribute, 'false');
        }
        const ariaAttributeValue = isAriaCurrent ? this.ariaCurrentAttrValue_ : 'true';
        this.adapter.setAttributeForElementIndex(index, ariaAttribute, ariaAttributeValue);
    }
    setTabindexAtIndex_(index) {
        if (this.focusedItemIndex_ === numbers.UNSET_INDEX && index !== 0) {
            // If no list item was selected set first list item's tabindex to -1.
            // Generally, tabindex is set to 0 on first list item of list that has no
            // preselected items.
            this.adapter.setTabIndexForElementIndex(0, -1);
        }
        else if (this.focusedItemIndex_ >= 0 && this.focusedItemIndex_ !== index) {
            this.adapter.setTabIndexForElementIndex(this.focusedItemIndex_, -1);
        }
        this.adapter.setTabIndexForElementIndex(index, 0);
    }
    setTabindexToFirstSelectedItem_() {
        let targetIndex = 0;
        if (typeof this.selectedIndex_ === 'number' &&
            this.selectedIndex_ !== numbers.UNSET_INDEX) {
            targetIndex = this.selectedIndex_;
        }
        else if (isIndexSet(this.selectedIndex_) && this.selectedIndex_.size > 0) {
            targetIndex = Math.min(...this.selectedIndex_);
        }
        this.setTabindexAtIndex_(targetIndex);
    }
    isIndexValid_(index) {
        if (index instanceof Set) {
            if (!this.isMulti_) {
                throw new Error('MDCListFoundation: Array of index is only supported for checkbox based list');
            }
            if (index.size === 0) {
                return true;
            }
            else {
                let isOneInRange = false;
                for (const entry of index) {
                    isOneInRange = this.isIndexInRange_(entry);
                    if (isOneInRange) {
                        break;
                    }
                }
                return isOneInRange;
            }
        }
        else if (typeof index === 'number') {
            if (this.isMulti_) {
                throw new Error('MDCListFoundation: Expected array of index for checkbox based list but got number: ' +
                    index);
            }
            return index === numbers.UNSET_INDEX || this.isIndexInRange_(index);
        }
        else {
            return false;
        }
    }
    isIndexInRange_(index) {
        const listSize = this.adapter.getListItemCount();
        return index >= 0 && index < listSize;
    }
    /**
     * Sets selected index on user action, toggles checkbox / radio based on
     * toggleCheckbox value. User interaction should not toggle list item(s) when
     * disabled.
     */
    setSelectedIndexOnAction_(index, isInteraction, force) {
        if (this.adapter.getDisabledStateForElementIndex(index)) {
            return;
        }
        let checkedIndex = index;
        if (this.isMulti_) {
            checkedIndex = new Set([index]);
        }
        if (!this.isIndexValid_(checkedIndex)) {
            return;
        }
        if (this.isMulti_) {
            this.toggleMultiAtIndex(index, force, isInteraction);
        }
        else {
            if (isInteraction || force) {
                this.setSingleSelectionAtIndex_(index, isInteraction);
            }
            else {
                const isDeselection = this.selectedIndex_ === index;
                if (isDeselection) {
                    this.setSingleSelectionAtIndex_(numbers.UNSET_INDEX);
                }
            }
        }
        if (isInteraction) {
            this.adapter.notifyAction(index);
        }
    }
    toggleMultiAtIndex(index, force, isInteraction = true) {
        let newSelectionValue = false;
        if (force === undefined) {
            newSelectionValue = !this.adapter.getSelectedStateForElementIndex(index);
        }
        else {
            newSelectionValue = force;
        }
        const newSet = createSetFromIndex(this.selectedIndex_);
        if (newSelectionValue) {
            newSet.add(index);
        }
        else {
            newSet.delete(index);
        }
        this.setMultiSelectionAtIndex_(newSet, isInteraction);
    }
}

function debounceLayout(callback, waitInMS = 50) {
    let timeoutId;
    // tslint:disable-next-line
    return function (updateItems = true) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            callback(updateItems);
        }, waitInMS);
    };
}
const isListItem = (element) => {
    return element.hasAttribute('mwc-list-item');
};
function clearAndCreateItemsReadyPromise() {
    const oldResolver = this.itemsReadyResolver;
    this.itemsReady = new Promise((res) => {
        // TODO(b/175626389): Type '(value: never[] | PromiseLike<never[]>) => void'
        // is not assignable to type '(value?: never[] | PromiseLike<never[]> |
        // undefined) => void'.
        return this.itemsReadyResolver = res;
    });
    oldResolver();
}
/**
 * @fires selected {SelectedDetail}
 * @fires action {ActionDetail}
 * @fires items-updated
 */
class ListBase extends BaseElement {
    constructor() {
        super();
        this.mdcAdapter = null;
        this.mdcFoundationClass = MDCListFoundation;
        this.activatable = false;
        this.multi = false;
        this.wrapFocus = false;
        this.itemRoles = null;
        this.innerRole = null;
        this.innerAriaLabel = null;
        this.rootTabbable = false;
        this.previousTabindex = null;
        this.noninteractive = false;
        this.itemsReadyResolver = (() => {
            //
        });
        this.itemsReady = Promise.resolve([]);
        // tslint:enable:ban-ts-ignore
        this.items_ = [];
        const debouncedFunction = debounceLayout(this.layout.bind(this));
        this.debouncedLayout = (updateItems = true) => {
            clearAndCreateItemsReadyPromise.call(this);
            debouncedFunction(updateItems);
        };
    }
    // tslint:disable:ban-ts-ignore
    async getUpdateComplete() {
        // @ts-ignore
        const result = await super.getUpdateComplete();
        await this.itemsReady;
        return result;
    }
    get items() {
        return this.items_;
    }
    updateItems() {
        var _a;
        const nodes = (_a = this.assignedElements) !== null && _a !== void 0 ? _a : [];
        const listItems = [];
        for (const node of nodes) {
            if (isListItem(node)) {
                listItems.push(node);
                node._managingList = this;
            }
            if (node.hasAttribute('divider') && !node.hasAttribute('role')) {
                node.setAttribute('role', 'separator');
            }
        }
        this.items_ = listItems;
        const selectedIndices = new Set();
        this.items_.forEach((item, index) => {
            if (this.itemRoles) {
                item.setAttribute('role', this.itemRoles);
            }
            else {
                item.removeAttribute('role');
            }
            if (item.selected) {
                selectedIndices.add(index);
            }
        });
        if (this.multi) {
            this.select(selectedIndices);
        }
        else {
            const index = selectedIndices.size ? selectedIndices.entries().next().value[1] : -1;
            this.select(index);
        }
        const itemsUpdatedEv = new Event('items-updated', { bubbles: true, composed: true });
        this.dispatchEvent(itemsUpdatedEv);
    }
    get selected() {
        const index = this.index;
        if (!isIndexSet(index)) {
            if (index === -1) {
                return null;
            }
            return this.items[index];
        }
        const selected = [];
        for (const entry of index) {
            selected.push(this.items[entry]);
        }
        return selected;
    }
    get index() {
        if (this.mdcFoundation) {
            return this.mdcFoundation.getSelectedIndex();
        }
        return -1;
    }
    render() {
        const role = this.innerRole === null ? undefined : this.innerRole;
        const ariaLabel = this.innerAriaLabel === null ? undefined : this.innerAriaLabel;
        const tabindex = this.rootTabbable ? '0' : '-1';
        return html `
      <!-- @ts-ignore -->
      <ul
          tabindex=${tabindex}
          role="${ifDefined(role)}"
          aria-label="${ifDefined(ariaLabel)}"
          class="mdc-deprecated-list"
          @keydown=${this.onKeydown}
          @focusin=${this.onFocusIn}
          @focusout=${this.onFocusOut}
          @request-selected=${this.onRequestSelected}
          @list-item-rendered=${this.onListItemConnected}>
        <slot></slot>
        ${this.renderPlaceholder()}
      </ul>
    `;
    }
    renderPlaceholder() {
        var _a;
        const nodes = (_a = this.assignedElements) !== null && _a !== void 0 ? _a : [];
        if (this.emptyMessage !== undefined && nodes.length === 0) {
            return html `
        <mwc-list-item noninteractive>${this.emptyMessage}</mwc-list-item>
      `;
        }
        return null;
    }
    firstUpdated() {
        super.firstUpdated();
        if (!this.items.length) {
            // required because this is called before observers
            this.mdcFoundation.setMulti(this.multi);
            // for when children upgrade before list
            this.layout();
        }
    }
    onFocusIn(evt) {
        if (this.mdcFoundation && this.mdcRoot) {
            const index = this.getIndexOfTarget(evt);
            this.mdcFoundation.handleFocusIn(evt, index);
        }
    }
    onFocusOut(evt) {
        if (this.mdcFoundation && this.mdcRoot) {
            const index = this.getIndexOfTarget(evt);
            this.mdcFoundation.handleFocusOut(evt, index);
        }
    }
    onKeydown(evt) {
        if (this.mdcFoundation && this.mdcRoot) {
            const index = this.getIndexOfTarget(evt);
            const target = evt.target;
            const isRootListItem = isListItem(target);
            this.mdcFoundation.handleKeydown(evt, isRootListItem, index);
        }
    }
    onRequestSelected(evt) {
        if (this.mdcFoundation) {
            let index = this.getIndexOfTarget(evt);
            // might happen in shady dom slowness. Recalc children
            if (index === -1) {
                this.layout();
                index = this.getIndexOfTarget(evt);
                // still not found; may not be mwc-list-item. Unsupported case.
                if (index === -1) {
                    return;
                }
            }
            const element = this.items[index];
            if (element.disabled) {
                return;
            }
            const selected = evt.detail.selected;
            const source = evt.detail.source;
            this.mdcFoundation.handleSingleSelection(index, source === 'interaction', selected);
            evt.stopPropagation();
        }
    }
    getIndexOfTarget(evt) {
        const elements = this.items;
        const path = evt.composedPath();
        for (const pathItem of path) {
            let index = -1;
            if (isNodeElement(pathItem) && isListItem(pathItem)) {
                index = elements.indexOf(pathItem);
            }
            if (index !== -1) {
                return index;
            }
        }
        return -1;
    }
    createAdapter() {
        this.mdcAdapter = {
            getListItemCount: () => {
                if (this.mdcRoot) {
                    return this.items.length;
                }
                return 0;
            },
            getFocusedElementIndex: this.getFocusedItemIndex,
            getAttributeForElementIndex: (index, attr) => {
                const listElement = this.mdcRoot;
                if (!listElement) {
                    return '';
                }
                const element = this.items[index];
                return element ? element.getAttribute(attr) : '';
            },
            setAttributeForElementIndex: (index, attr, val) => {
                if (!this.mdcRoot) {
                    return;
                }
                const element = this.items[index];
                if (element) {
                    element.setAttribute(attr, val);
                }
            },
            focusItemAtIndex: (index) => {
                const element = this.items[index];
                if (element) {
                    element.focus();
                }
            },
            setTabIndexForElementIndex: (index, value) => {
                const item = this.items[index];
                if (item) {
                    item.tabindex = value;
                }
            },
            notifyAction: (index) => {
                const init = { bubbles: true, composed: true };
                init.detail = { index };
                const ev = new CustomEvent('action', init);
                this.dispatchEvent(ev);
            },
            notifySelected: (index, diff) => {
                const init = { bubbles: true, composed: true };
                init.detail = { index, diff };
                const ev = new CustomEvent('selected', init);
                this.dispatchEvent(ev);
            },
            isFocusInsideList: () => {
                return doesElementContainFocus(this);
            },
            isRootFocused: () => {
                const mdcRoot = this.mdcRoot;
                const root = mdcRoot.getRootNode();
                return root.activeElement === mdcRoot;
            },
            setDisabledStateForElementIndex: (index, value) => {
                const item = this.items[index];
                if (!item) {
                    return;
                }
                item.disabled = value;
            },
            getDisabledStateForElementIndex: (index) => {
                const item = this.items[index];
                if (!item) {
                    return false;
                }
                return item.disabled;
            },
            setSelectedStateForElementIndex: (index, value) => {
                const item = this.items[index];
                if (!item) {
                    return;
                }
                item.selected = value;
            },
            getSelectedStateForElementIndex: (index) => {
                const item = this.items[index];
                if (!item) {
                    return false;
                }
                return item.selected;
            },
            setActivatedStateForElementIndex: (index, value) => {
                const item = this.items[index];
                if (!item) {
                    return;
                }
                item.activated = value;
            },
        };
        return this.mdcAdapter;
    }
    selectUi(index, activate = false) {
        const item = this.items[index];
        if (item) {
            item.selected = true;
            item.activated = activate;
        }
    }
    deselectUi(index) {
        const item = this.items[index];
        if (item) {
            item.selected = false;
            item.activated = false;
        }
    }
    select(index) {
        if (!this.mdcFoundation) {
            return;
        }
        this.mdcFoundation.setSelectedIndex(index);
    }
    toggle(index, force) {
        if (this.multi) {
            this.mdcFoundation.toggleMultiAtIndex(index, force);
        }
    }
    onListItemConnected(e) {
        const target = e.target;
        this.layout(this.items.indexOf(target) === -1);
    }
    layout(updateItems = true) {
        if (updateItems) {
            this.updateItems();
        }
        const first = this.items[0];
        for (const item of this.items) {
            item.tabindex = -1;
        }
        if (first) {
            if (this.noninteractive) {
                if (!this.previousTabindex) {
                    this.previousTabindex = first;
                }
            }
            else {
                first.tabindex = 0;
            }
        }
        this.itemsReadyResolver();
    }
    getFocusedItemIndex() {
        if (!this.mdcRoot) {
            return -1;
        }
        if (!this.items.length) {
            return -1;
        }
        const activeElementPath = deepActiveElementPath();
        if (!activeElementPath.length) {
            return -1;
        }
        for (let i = activeElementPath.length - 1; i >= 0; i--) {
            const activeItem = activeElementPath[i];
            if (isListItem(activeItem)) {
                return this.items.indexOf(activeItem);
            }
        }
        return -1;
    }
    focusItemAtIndex(index) {
        for (const item of this.items) {
            if (item.tabindex === 0) {
                item.tabindex = -1;
                break;
            }
        }
        this.items[index].tabindex = 0;
        this.items[index].focus();
    }
    focus() {
        const root = this.mdcRoot;
        if (root) {
            root.focus();
        }
    }
    blur() {
        const root = this.mdcRoot;
        if (root) {
            root.blur();
        }
    }
}
__decorate([
    property({ type: String })
], ListBase.prototype, "emptyMessage", void 0);
__decorate([
    query('.mdc-deprecated-list')
], ListBase.prototype, "mdcRoot", void 0);
__decorate([
    queryAssignedNodes('', true, '*')
], ListBase.prototype, "assignedElements", void 0);
__decorate([
    queryAssignedNodes('', true, '[tabindex="0"]')
], ListBase.prototype, "tabbableElements", void 0);
__decorate([
    property({ type: Boolean }),
    observer(function (value) {
        if (this.mdcFoundation) {
            this.mdcFoundation.setUseActivatedClass(value);
        }
    })
], ListBase.prototype, "activatable", void 0);
__decorate([
    property({ type: Boolean }),
    observer(function (newValue, oldValue) {
        if (this.mdcFoundation) {
            this.mdcFoundation.setMulti(newValue);
        }
        if (oldValue !== undefined) {
            this.layout();
        }
    })
], ListBase.prototype, "multi", void 0);
__decorate([
    property({ type: Boolean }),
    observer(function (value) {
        if (this.mdcFoundation) {
            this.mdcFoundation.setWrapFocus(value);
        }
    })
], ListBase.prototype, "wrapFocus", void 0);
__decorate([
    property({ type: String }),
    observer(function (_newValue, oldValue) {
        if (oldValue !== undefined) {
            this.updateItems();
        }
    })
], ListBase.prototype, "itemRoles", void 0);
__decorate([
    property({ type: String })
], ListBase.prototype, "innerRole", void 0);
__decorate([
    property({ type: String })
], ListBase.prototype, "innerAriaLabel", void 0);
__decorate([
    property({ type: Boolean })
], ListBase.prototype, "rootTabbable", void 0);
__decorate([
    property({ type: Boolean, reflect: true }),
    observer(function (value) {
        var _a, _b;
        if (value) {
            const tabbable = (_b = (_a = this.tabbableElements) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : null;
            this.previousTabindex = tabbable;
            if (tabbable) {
                tabbable.setAttribute('tabindex', '-1');
            }
        }
        else if (!value && this.previousTabindex) {
            this.previousTabindex.setAttribute('tabindex', '0');
            this.previousTabindex = null;
        }
    })
], ListBase.prototype, "noninteractive", void 0);

/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-LIcense-Identifier: Apache-2.0
 */
const styles = css `@keyframes mdc-ripple-fg-radius-in{from{animation-timing-function:cubic-bezier(0.4, 0, 0.2, 1);transform:translate(var(--mdc-ripple-fg-translate-start, 0)) scale(1)}to{transform:translate(var(--mdc-ripple-fg-translate-end, 0)) scale(var(--mdc-ripple-fg-scale, 1))}}@keyframes mdc-ripple-fg-opacity-in{from{animation-timing-function:linear;opacity:0}to{opacity:var(--mdc-ripple-fg-opacity, 0)}}@keyframes mdc-ripple-fg-opacity-out{from{animation-timing-function:linear;opacity:var(--mdc-ripple-fg-opacity, 0)}to{opacity:0}}:host{display:block}.mdc-deprecated-list{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:Roboto, sans-serif;font-family:var(--mdc-typography-subtitle1-font-family, var(--mdc-typography-font-family, Roboto, sans-serif));font-size:1rem;font-size:var(--mdc-typography-subtitle1-font-size, 1rem);line-height:1.75rem;line-height:var(--mdc-typography-subtitle1-line-height, 1.75rem);font-weight:400;font-weight:var(--mdc-typography-subtitle1-font-weight, 400);letter-spacing:0.009375em;letter-spacing:var(--mdc-typography-subtitle1-letter-spacing, 0.009375em);text-decoration:inherit;text-decoration:var(--mdc-typography-subtitle1-text-decoration, inherit);text-transform:inherit;text-transform:var(--mdc-typography-subtitle1-text-transform, inherit);line-height:1.5rem;margin:0;padding:8px 0;list-style-type:none;color:rgba(0, 0, 0, 0.87);color:var(--mdc-theme-text-primary-on-background, rgba(0, 0, 0, 0.87));padding:var(--mdc-list-vertical-padding, 8px) 0}.mdc-deprecated-list:focus{outline:none}.mdc-deprecated-list-item{height:48px}.mdc-deprecated-list--dense{padding-top:4px;padding-bottom:4px;font-size:.812rem}.mdc-deprecated-list ::slotted([divider]){height:0;margin:0;border:none;border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:rgba(0, 0, 0, 0.12)}.mdc-deprecated-list ::slotted([divider][padded]){margin:0 var(--mdc-list-side-padding, 16px)}.mdc-deprecated-list ::slotted([divider][inset]){margin-left:var(--mdc-list-inset-margin, 72px);margin-right:0;width:calc( 100% - var(--mdc-list-inset-margin, 72px) )}[dir=rtl] .mdc-deprecated-list ::slotted([divider][inset]),.mdc-deprecated-list ::slotted([divider][inset][dir=rtl]){margin-left:0;margin-right:var(--mdc-list-inset-margin, 72px)}.mdc-deprecated-list ::slotted([divider][inset][padded]){width:calc( 100% - var(--mdc-list-inset-margin, 72px) - var(--mdc-list-side-padding, 16px) )}.mdc-deprecated-list--dense ::slotted([mwc-list-item]){height:40px}.mdc-deprecated-list--dense ::slotted([mwc-list]){--mdc-list-item-graphic-size: 20px}.mdc-deprecated-list--two-line.mdc-deprecated-list--dense ::slotted([mwc-list-item]),.mdc-deprecated-list--avatar-list.mdc-deprecated-list--dense ::slotted([mwc-list-item]){height:60px}.mdc-deprecated-list--avatar-list.mdc-deprecated-list--dense ::slotted([mwc-list]){--mdc-list-item-graphic-size: 36px}:host([noninteractive]){pointer-events:none;cursor:default}.mdc-deprecated-list--dense ::slotted(.mdc-deprecated-list-item__primary-text){display:block;margin-top:0;line-height:normal;margin-bottom:-20px}.mdc-deprecated-list--dense ::slotted(.mdc-deprecated-list-item__primary-text)::before{display:inline-block;width:0;height:24px;content:"";vertical-align:0}.mdc-deprecated-list--dense ::slotted(.mdc-deprecated-list-item__primary-text)::after{display:inline-block;width:0;height:20px;content:"";vertical-align:-20px}`;

/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
let List = class List extends ListBase {
};
List.styles = [styles];
List = __decorate([
    customElement('mwc-list')
], List);

function slotItem(item) {
    if (!item.closest('oscd-filtered-list') || !item.parentElement)
        return item;
    if (item.parentElement instanceof OscdFilteredList)
        return item;
    return slotItem(item.parentElement);
}
function hideFiltered(item, searchText) {
    const itemInnerText = item.innerText + '\n';
    const childInnerText = Array.from(item.children)
        .map(child => child.innerText)
        .join('\n');
    const value = item.value;
    const filterTarget = (itemInnerText +
        childInnerText +
        value).toUpperCase();
    const terms = searchText
        .toUpperCase()
        .replace(/[.+^${}()|[\]\\]/g, '\\$&')
        .trim()
        .split(/\s+/g);
    (terms.length === 1 && terms[0] === '') ||
        terms.every(term => {
            // regexp escape
            const reTerm = new RegExp(`*${term}*`.replace(/\*/g, '.*').replace(/\?/g, '.{1}'), 'i');
            return reTerm.test(filterTarget);
        })
        ? slotItem(item).classList.remove('hidden')
        : slotItem(item).classList.add('hidden');
}
function redispatchEvent(element, event) {
    element.requestUpdate();
    // For bubbling events in SSR light DOM (or composed), stop their propagation  // and dispatch the copy.
    const copy = Reflect.construct(event.constructor, [event.type, event]);
    if (event.bubbles && (!element.shadowRoot || event.composed)) {
        event.stopPropagation();
        copy.stopPropagation();
    }
    const dispatched = element.dispatchEvent(copy);
    if (!dispatched) {
        event.preventDefault();
    }
    return dispatched;
}
/**
 *
 */
class OscdFilteredList extends LitElement {
    //selectedType from mwc-list
    get selected() {
        return this.list.selected;
    }
    get index() {
        return this.list.index;
    }
    get existCheckListItem() {
        return this.items.some(item => item instanceof CheckListItem);
    }
    get isAllSelected() {
        return this.items
            .filter(item => !item.disabled)
            .filter(item => item instanceof CheckListItem)
            .every(checkItem => checkItem.selected);
    }
    get isSomeSelected() {
        return this.items
            .filter(item => !item.disabled)
            .filter(item => item instanceof CheckListItem)
            .some(checkItem => checkItem.selected);
    }
    onCheckAll() {
        const select = !this.isAllSelected;
        this.items
            .filter(item => !item.disabled && !item.classList.contains('hidden'))
            .forEach(item => (item.selected = select));
    }
    onFilterInput() {
        Array.from(this.querySelectorAll('mwc-list-item, mwc-check-list-item, mwc-radio-list-item')).forEach(item => hideFiltered(item, this.searchField.value));
    }
    firstUpdated() {
        var _a, _b;
        this.items = (_b = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('slot')) === null || _b === void 0 ? void 0 : _b.assignedElements({ flatten: true });
    }
    constructor() {
        super();
        /** Whether the check all option (checkbox next to search text field) is activated */
        this.disableCheckAll = false;
        this.wrapFocus = false;
        this.multi = false;
        this.activatable = false;
        this.items = [];
        this.addEventListener('selected', event => {
            redispatchEvent(this, event);
        });
        this.addEventListener('action', event => {
            redispatchEvent(this, event);
        });
    }
    renderCheckAll() {
        return this.existCheckListItem && !this.disableCheckAll
            ? html `<mwc-formfield class="checkall"
          ><mwc-checkbox
            ?indeterminate=${!this.isAllSelected && this.isSomeSelected}
            ?checked=${this.isAllSelected}
            @change=${() => {
                this.onCheckAll();
            }}
          ></mwc-checkbox
        ></mwc-formfield>`
            : html ``;
    }
    render() {
        var _a, _b;
        return html `<div id="tfcontainer">
        <abbr title="${(_a = this.searchFieldLabel) !== null && _a !== void 0 ? _a : translate('filter')}"
          ><mwc-textfield
            label="${(_b = this.searchFieldLabel) !== null && _b !== void 0 ? _b : ''}"
            iconTrailing="search"
            outlined
            @input=${() => this.onFilterInput()}
          ></mwc-textfield
        ></abbr>
        ${this.renderCheckAll()}
      </div>
      <mwc-list
        .multi=${this.multi}
        .activatable=${this.activatable}
        .wrapFocus=${this.wrapFocus}
      >
        <slot />
      </mwc-list>`;
    }
}
OscdFilteredList.styles = css `
    ${unsafeCSS(List.styles)}

    #tfcontainer {
      display: flex;
      flex: auto;
    }

    ::slotted(.hidden) {
      display: none;
    }

    abbr {
      display: flex;
      flex: auto;
      margin: 8px;
      text-decoration: none;
      border-bottom: none;
    }

    mwc-textfield {
      width: 100%;
      --mdc-shape-small: 28px;
    }

    mwc-formfield.checkall {
      padding-right: 8px;
    }

    .mdc-list {
      padding-inline-start: 0px;
    }
  `;
__decorate([
    property({ type: String })
], OscdFilteredList.prototype, "searchFieldLabel", void 0);
__decorate([
    property({ type: Boolean })
], OscdFilteredList.prototype, "disableCheckAll", void 0);
__decorate([
    property({ type: String })
], OscdFilteredList.prototype, "filter", void 0);
__decorate([
    property({ type: Boolean })
], OscdFilteredList.prototype, "wrapFocus", void 0);
__decorate([
    property({ type: Boolean })
], OscdFilteredList.prototype, "multi", void 0);
__decorate([
    property({ type: Boolean })
], OscdFilteredList.prototype, "activatable", void 0);
__decorate([
    query('mwc-list')
], OscdFilteredList.prototype, "list", void 0);
__decorate([
    property()
], OscdFilteredList.prototype, "items", void 0);
__decorate([
    state()
], OscdFilteredList.prototype, "existCheckListItem", null);
__decorate([
    state()
], OscdFilteredList.prototype, "isAllSelected", null);
__decorate([
    state()
], OscdFilteredList.prototype, "isSomeSelected", null);
__decorate([
    query('mwc-textfield')
], OscdFilteredList.prototype, "searchField", void 0);

window.customElements.define('oscd-filtered-list', OscdFilteredList);

const tAbstractConductingEquipment = [
    'TransformerWinding',
    'ConductingEquipment',
];
const tEquipment = [
    'GeneralEquipment',
    'PowerTransformer',
    ...tAbstractConductingEquipment,
];
const tEquipmentContainer = ['Substation', 'VoltageLevel', 'Bay'];
const tGeneralEquipmentContainer = ['Process', 'Line'];
const tAbstractEqFuncSubFunc = ['EqSubFunction', 'EqFunction'];
const tPowerSystemResource = [
    'SubFunction',
    'Function',
    'TapChanger',
    'SubEquipment',
    ...tEquipment,
    ...tEquipmentContainer,
    ...tGeneralEquipmentContainer,
    ...tAbstractEqFuncSubFunc,
];
const tLNodeContainer = ['ConnectivityNode', ...tPowerSystemResource];
const tCertificate = ['GOOSESecurity', 'SMVSecurity'];
const tNaming = ['SubNetwork', ...tCertificate, ...tLNodeContainer];
const tAbstractDataAttribute = ['BDA', 'DA'];
const tControlWithIEDName = ['SampledValueControl', 'GSEControl'];
const tControlWithTriggerOpt = ['LogControl', 'ReportControl'];
const tControl = [...tControlWithIEDName, ...tControlWithTriggerOpt];
const tControlBlock = ['GSE', 'SMV'];
const tUnNaming = [
    'ConnectedAP',
    'PhysConn',
    'SDO',
    'DO',
    'DAI',
    'SDI',
    'DOI',
    'Inputs',
    'RptEnabled',
    'Server',
    'ServerAt',
    'SettingControl',
    'Communication',
    'Log',
    'LDevice',
    'DataSet',
    'AccessPoint',
    'IED',
    'NeutralPoint',
    ...tControl,
    ...tControlBlock,
    ...tAbstractDataAttribute,
];
const tAnyLN = ['LN0', 'LN'];
const tAnyContentFromOtherNamespace = [
    'Text',
    'Private',
    'Hitem',
    'AccessControl',
];
const tCert = ['Subject', 'IssuerName'];
const tDurationInMilliSec = ['MinTime', 'MaxTime'];
const tIDNaming = ['LNodeType', 'DOType', 'DAType', 'EnumType'];
const tServiceYesNo = [
    'FileHandling',
    'TimeSyncProt',
    'CommProt',
    'SGEdit',
    'ConfSG',
    'GetDirectory',
    'GetDataObjectDefinition',
    'DataObjectDirectory',
    'GetDataSetValue',
    'SetDataSetValue',
    'DataSetDirectory',
    'ReadWrite',
    'TimerActivatedControl',
    'GetCBValues',
    'GSEDir',
    'ConfLdName',
];
const tServiceWithMaxAndMaxAttributes = ['DynDataSet', 'ConfDataSet'];
const tServiceWithMax = [
    'GSSE',
    'GOOSE',
    'ConfReportControl',
    'SMVsc',
    ...tServiceWithMaxAndMaxAttributes,
];
const tServiceWithMaxNonZero = ['ConfLogControl', 'ConfSigRef'];
const tServiceSettings = [
    'ReportSettings',
    'LogSettings',
    'GSESettings',
    'SMVSettings',
];
const tBaseElement = ['SCL', ...tNaming, ...tUnNaming, ...tIDNaming];
const sCLTags = [
    ...tBaseElement,
    ...tAnyContentFromOtherNamespace,
    'Header',
    'LNode',
    'Val',
    'Voltage',
    'Services',
    ...tCert,
    ...tDurationInMilliSec,
    'Association',
    'FCDA',
    'ClientLN',
    'IEDName',
    'ExtRef',
    'Protocol',
    ...tAnyLN,
    ...tServiceYesNo,
    'DynAssociation',
    'SettingGroups',
    ...tServiceWithMax,
    ...tServiceWithMaxNonZero,
    ...tServiceSettings,
    'ConfLNs',
    'ClientServices',
    'SupSubscription',
    'ValueHandling',
    'RedProt',
    'McSecurity',
    'KDC',
    'Address',
    'P',
    'ProtNs',
    'EnumVal',
    'Terminal',
    'BitRate',
    'Authentication',
    'DataTypeTemplates',
    'History',
    'OptFields',
    'SmvOpts',
    'TrgOps',
    'SamplesPerSec',
    'SmpRate',
    'SecPerSamples',
];
const tagSet = new Set(sCLTags);
function isSCLTag(tag) {
    return tagSet.has(tag);
}
const tBaseNameSequence = ['Text', 'Private'];
const tNamingSequence = [...tBaseNameSequence];
const tUnNamingSequence = [...tBaseNameSequence];
const tIDNamingSequence = [...tBaseNameSequence];
const tAbstractDataAttributeSequence = [...tUnNamingSequence, 'Val'];
const tLNodeContainerSequence = [...tNamingSequence, 'LNode'];
const tPowerSystemResourceSequence = [...tLNodeContainerSequence];
const tEquipmentSequence = [...tPowerSystemResourceSequence];
const tEquipmentContainerSequence = [
    ...tPowerSystemResourceSequence,
    'PowerTransformer',
    'GeneralEquipment',
];
const tAbstractConductingEquipmentSequence = [
    ...tEquipmentSequence,
    'Terminal',
];
const tControlBlockSequence = [...tUnNamingSequence, 'Address'];
const tControlSequence = [...tNamingSequence];
const tControlWithIEDNameSequence = [...tControlSequence, 'IEDName'];
const tAnyLNSequence = [
    ...tUnNamingSequence,
    'DataSet',
    'ReportControl',
    'LogControl',
    'DOI',
    'Inputs',
    'Log',
];
const tGeneralEquipmentContainerSequence = [
    ...tPowerSystemResourceSequence,
    'GeneralEquipment',
    'Function',
];
const tControlWithTriggerOptSequence = [...tControlSequence, 'TrgOps'];
const tAbstractEqFuncSubFuncSequence = [
    ...tPowerSystemResourceSequence,
    'GeneralEquipment',
    'EqSubFunction',
];
const relatives = {
    AccessControl: {
        parents: ['LDevice'],
        children: [],
    },
    AccessPoint: {
        parents: ['IED'],
        children: [
            ...tNamingSequence,
            'Server',
            'LN',
            'ServerAt',
            'Services',
            'GOOSESecurity',
            'SMVSecurity',
        ],
    },
    Address: {
        parents: ['ConnectedAP', 'GSE', 'SMV'],
        children: ['P'],
    },
    Association: {
        parents: ['Server'],
        children: [],
    },
    Authentication: {
        parents: ['Server'],
        children: [],
    },
    BDA: {
        parents: ['DAType'],
        children: [...tAbstractDataAttributeSequence],
    },
    BitRate: {
        parents: ['SubNetwork'],
        children: [],
    },
    Bay: {
        parents: ['VoltageLevel'],
        children: [
            ...tEquipmentContainerSequence,
            'ConductingEquipment',
            'ConnectivityNode',
            'Function',
        ],
    },
    ClientLN: {
        parents: ['RptEnabled'],
        children: [],
    },
    ClientServices: {
        parents: ['Services'],
        children: ['TimeSyncProt', 'McSecurity'],
    },
    CommProt: {
        parents: ['Services'],
        children: [],
    },
    Communication: {
        parents: ['SCL'],
        children: [...tUnNamingSequence, 'SubNetwork'],
    },
    ConductingEquipment: {
        parents: ['Process', 'Line', 'SubFunction', 'Function', 'Bay'],
        children: [
            ...tAbstractConductingEquipmentSequence,
            'EqFunction',
            'SubEquipment',
        ],
    },
    ConfDataSet: {
        parents: ['Services'],
        children: [],
    },
    ConfLdName: {
        parents: ['Services'],
        children: [],
    },
    ConfLNs: {
        parents: ['Services'],
        children: [],
    },
    ConfLogControl: {
        parents: ['Services'],
        children: [],
    },
    ConfReportControl: {
        parents: ['Services'],
        children: [],
    },
    ConfSG: {
        parents: ['SettingGroups'],
        children: [],
    },
    ConfSigRef: {
        parents: ['Services'],
        children: [],
    },
    ConnectedAP: {
        parents: ['SubNetwork'],
        children: [...tUnNamingSequence, 'Address', 'GSE', 'SMV', 'PhysConn'],
    },
    ConnectivityNode: {
        parents: ['Bay', 'Line'],
        children: [...tLNodeContainerSequence],
    },
    DA: {
        parents: ['DOType'],
        children: [...tAbstractDataAttributeSequence],
    },
    DAI: {
        parents: ['DOI', 'SDI'],
        children: [...tUnNamingSequence, 'Val'],
    },
    DAType: {
        parents: ['DataTypeTemplates'],
        children: [...tIDNamingSequence, 'BDA', 'ProtNs'],
    },
    DO: {
        parents: ['LNodeType'],
        children: [...tUnNamingSequence],
    },
    DOI: {
        parents: [...tAnyLN],
        children: [...tUnNamingSequence, 'SDI', 'DAI'],
    },
    DOType: {
        parents: ['DataTypeTemplates'],
        children: [...tIDNamingSequence, 'SDO', 'DA'],
    },
    DataObjectDirectory: {
        parents: ['Services'],
        children: [],
    },
    DataSet: {
        parents: [...tAnyLN],
        children: [...tNamingSequence, 'FCDA'],
    },
    DataSetDirectory: {
        parents: ['Services'],
        children: [],
    },
    DataTypeTemplates: {
        parents: ['SCL'],
        children: ['LNodeType', 'DOType', 'DAType', 'EnumType'],
    },
    DynAssociation: {
        parents: ['Services'],
        children: [],
    },
    DynDataSet: {
        parents: ['Services'],
        children: [],
    },
    EnumType: {
        parents: ['DataTypeTemplates'],
        children: [...tIDNamingSequence, 'EnumVal'],
    },
    EnumVal: {
        parents: ['EnumType'],
        children: [],
    },
    EqFunction: {
        parents: [
            'GeneralEquipment',
            'TapChanger',
            'TransformerWinding',
            'PowerTransformer',
            'SubEquipment',
            'ConductingEquipment',
        ],
        children: [...tAbstractEqFuncSubFuncSequence],
    },
    EqSubFunction: {
        parents: ['EqSubFunction', 'EqFunction'],
        children: [...tAbstractEqFuncSubFuncSequence],
    },
    ExtRef: {
        parents: ['Inputs'],
        children: [],
    },
    FCDA: {
        parents: ['DataSet'],
        children: [],
    },
    FileHandling: {
        parents: ['Services'],
        children: [],
    },
    Function: {
        parents: ['Bay', 'VoltageLevel', 'Substation', 'Process', 'Line'],
        children: [
            ...tPowerSystemResourceSequence,
            'SubFunction',
            'GeneralEquipment',
            'ConductingEquipment',
        ],
    },
    GeneralEquipment: {
        parents: [
            'SubFunction',
            'Function',
            ...tGeneralEquipmentContainer,
            ...tAbstractEqFuncSubFunc,
            ...tEquipmentContainer,
        ],
        children: [...tEquipmentSequence, 'EqFunction'],
    },
    GetCBValues: {
        parents: ['Services'],
        children: [],
    },
    GetDataObjectDefinition: {
        parents: ['Services'],
        children: [],
    },
    GetDataSetValue: {
        parents: ['Services'],
        children: [],
    },
    GetDirectory: {
        parents: ['Services'],
        children: [],
    },
    GOOSE: {
        parents: ['Services'],
        children: [],
    },
    GOOSESecurity: {
        parents: ['AccessPoint'],
        children: [...tNamingSequence, 'Subject', 'IssuerName'],
    },
    GSE: {
        parents: ['ConnectedAP'],
        children: [...tControlBlockSequence, 'MinTime', 'MaxTime'],
    },
    GSEDir: {
        parents: ['Services'],
        children: [],
    },
    GSEControl: {
        parents: ['LN0'],
        children: [...tControlWithIEDNameSequence, 'Protocol'],
    },
    GSESettings: {
        parents: ['Services'],
        children: [],
    },
    GSSE: {
        parents: ['Services'],
        children: [],
    },
    Header: {
        parents: ['SCL'],
        children: ['Text', 'History'],
    },
    History: {
        parents: ['Header'],
        children: ['Hitem'],
    },
    Hitem: {
        parents: ['History'],
        children: [],
    },
    IED: {
        parents: ['SCL'],
        children: [...tUnNamingSequence, 'Services', 'AccessPoint', 'KDC'],
    },
    IEDName: {
        parents: ['GSEControl', 'SampledValueControl'],
        children: [],
    },
    Inputs: {
        parents: [...tAnyLN],
        children: [...tUnNamingSequence, 'ExtRef'],
    },
    IssuerName: {
        parents: ['GOOSESecurity', 'SMVSecurity'],
        children: [],
    },
    KDC: {
        parents: ['IED'],
        children: [],
    },
    LDevice: {
        parents: ['Server'],
        children: [...tUnNamingSequence, 'LN0', 'LN', 'AccessControl'],
    },
    LN: {
        parents: ['AccessPoint', 'LDevice'],
        children: [...tAnyLNSequence],
    },
    LN0: {
        parents: ['LDevice'],
        children: [
            ...tAnyLNSequence,
            'GSEControl',
            'SampledValueControl',
            'SettingControl',
        ],
    },
    LNode: {
        parents: [...tLNodeContainer],
        children: [...tUnNamingSequence],
    },
    LNodeType: {
        parents: ['DataTypeTemplates'],
        children: [...tIDNamingSequence, 'DO'],
    },
    Line: {
        parents: ['Process', 'SCL'],
        children: [
            ...tGeneralEquipmentContainerSequence,
            'Voltage',
            'ConductingEquipment',
        ],
    },
    Log: {
        parents: [...tAnyLN],
        children: [...tUnNamingSequence],
    },
    LogControl: {
        parents: [...tAnyLN],
        children: [...tControlWithTriggerOptSequence],
    },
    LogSettings: {
        parents: ['Services'],
        children: [],
    },
    MaxTime: {
        parents: ['GSE'],
        children: [],
    },
    McSecurity: {
        parents: ['GSESettings', 'SMVSettings', 'ClientServices'],
        children: [],
    },
    MinTime: {
        parents: ['GSE'],
        children: [],
    },
    NeutralPoint: {
        parents: ['TransformerWinding'],
        children: [...tUnNamingSequence],
    },
    OptFields: {
        parents: ['ReportControl'],
        children: [],
    },
    P: {
        parents: ['Address', 'PhysConn'],
        children: [],
    },
    PhysConn: {
        parents: ['ConnectedAP'],
        children: [...tUnNamingSequence, 'P'],
    },
    PowerTransformer: {
        parents: [...tEquipmentContainer],
        children: [
            ...tEquipmentSequence,
            'TransformerWinding',
            'SubEquipment',
            'EqFunction',
        ],
    },
    Private: {
        parents: [],
        children: [],
    },
    Process: {
        parents: ['Process', 'SCL'],
        children: [
            ...tGeneralEquipmentContainerSequence,
            'ConductingEquipment',
            'Substation',
            'Line',
            'Process',
        ],
    },
    ProtNs: {
        parents: ['DAType', 'DA'],
        children: [],
    },
    Protocol: {
        parents: ['GSEControl', 'SampledValueControl'],
        children: [],
    },
    ReadWrite: {
        parents: ['Services'],
        children: [],
    },
    RedProt: {
        parents: ['Services'],
        children: [],
    },
    ReportControl: {
        parents: [...tAnyLN],
        children: [...tControlWithTriggerOptSequence, 'OptFields', 'RptEnabled'],
    },
    ReportSettings: {
        parents: ['Services'],
        children: [],
    },
    RptEnabled: {
        parents: ['ReportControl'],
        children: [...tUnNamingSequence, 'ClientLN'],
    },
    SamplesPerSec: {
        parents: ['SMVSettings'],
        children: [],
    },
    SampledValueControl: {
        parents: ['LN0'],
        children: [...tControlWithIEDNameSequence, 'SmvOpts'],
    },
    SecPerSamples: {
        parents: ['SMVSettings'],
        children: [],
    },
    SCL: {
        parents: [],
        children: [
            ...tBaseNameSequence,
            'Header',
            'Substation',
            'Communication',
            'IED',
            'DataTypeTemplates',
            'Line',
            'Process',
        ],
    },
    SDI: {
        parents: ['DOI', 'SDI'],
        children: [...tUnNamingSequence, 'SDI', 'DAI'],
    },
    SDO: {
        parents: ['DOType'],
        children: [...tNamingSequence],
    },
    Server: {
        parents: ['AccessPoint'],
        children: [
            ...tUnNamingSequence,
            'Authentication',
            'LDevice',
            'Association',
        ],
    },
    ServerAt: {
        parents: ['AccessPoint'],
        children: [...tUnNamingSequence],
    },
    Services: {
        parents: ['IED', 'AccessPoint'],
        children: [
            'DynAssociation',
            'SettingGroups',
            'GetDirectory',
            'GetDataObjectDefinition',
            'DataObjectDirectory',
            'GetDataSetValue',
            'SetDataSetValue',
            'DataSetDirectory',
            'ConfDataSet',
            'DynDataSet',
            'ReadWrite',
            'TimerActivatedControl',
            'ConfReportControl',
            'GetCBValues',
            'ConfLogControl',
            'ReportSettings',
            'LogSettings',
            'GSESettings',
            'SMVSettings',
            'GSEDir',
            'GOOSE',
            'GSSE',
            'SMVsc',
            'FileHandling',
            'ConfLNs',
            'ClientServices',
            'ConfLdName',
            'SupSubscription',
            'ConfSigRef',
            'ValueHandling',
            'RedProt',
            'TimeSyncProt',
            'CommProt',
        ],
    },
    SetDataSetValue: {
        parents: ['Services'],
        children: [],
    },
    SettingControl: {
        parents: ['LN0'],
        children: [...tUnNamingSequence],
    },
    SettingGroups: {
        parents: ['Services'],
        children: ['SGEdit', 'ConfSG'],
    },
    SGEdit: {
        parents: ['SettingGroups'],
        children: [],
    },
    SmpRate: {
        parents: ['SMVSettings'],
        children: [],
    },
    SMV: {
        parents: ['ConnectedAP'],
        children: [...tControlBlockSequence],
    },
    SmvOpts: {
        parents: ['SampledValueControl'],
        children: [],
    },
    SMVsc: {
        parents: ['Services'],
        children: [],
    },
    SMVSecurity: {
        parents: ['AccessPoint'],
        children: [...tNamingSequence, 'Subject', 'IssuerName'],
    },
    SMVSettings: {
        parents: ['Services'],
        children: ['SmpRate', 'SamplesPerSec', 'SecPerSamples', 'McSecurity'],
    },
    SubEquipment: {
        parents: [
            'TapChanger',
            'PowerTransformer',
            'ConductingEquipment',
            'TransformerWinding',
            ...tAbstractConductingEquipment,
        ],
        children: [...tPowerSystemResourceSequence, 'EqFunction'],
    },
    SubFunction: {
        parents: ['SubFunction', 'Function'],
        children: [
            ...tPowerSystemResourceSequence,
            'GeneralEquipment',
            'ConductingEquipment',
            'SubFunction',
        ],
    },
    SubNetwork: {
        parents: ['Communication'],
        children: [...tNamingSequence, 'BitRate', 'ConnectedAP'],
    },
    Subject: {
        parents: ['GOOSESecurity', 'SMVSecurity'],
        children: [],
    },
    Substation: {
        parents: ['SCL'],
        children: [...tEquipmentContainerSequence, 'VoltageLevel', 'Function'],
    },
    SupSubscription: {
        parents: ['Services'],
        children: [],
    },
    TapChanger: {
        parents: ['TransformerWinding'],
        children: [...tPowerSystemResourceSequence, 'SubEquipment', 'EqFunction'],
    },
    Terminal: {
        parents: [...tEquipment],
        children: [...tUnNamingSequence],
    },
    Text: {
        parents: sCLTags.filter(tag => tag !== 'Text' && tag !== 'Private'),
        children: [],
    },
    TimerActivatedControl: {
        parents: ['Services'],
        children: [],
    },
    TimeSyncProt: {
        parents: ['Services', 'ClientServices'],
        children: [],
    },
    TransformerWinding: {
        parents: ['PowerTransformer'],
        children: [
            ...tAbstractConductingEquipmentSequence,
            'TapChanger',
            'NeutralPoint',
            'EqFunction',
            'SubEquipment',
        ],
    },
    TrgOps: {
        parents: ['ReportControl'],
        children: [],
    },
    Val: {
        parents: ['DAI', 'DA', 'BDA'],
        children: [],
    },
    ValueHandling: {
        parents: ['Services'],
        children: [],
    },
    Voltage: {
        parents: ['VoltageLevel'],
        children: [],
    },
    VoltageLevel: {
        parents: ['Substation'],
        children: [...tEquipmentContainerSequence, 'Voltage', 'Bay', 'Function'],
    },
};

const voidSelector = ':not(*)';
function selector(tagName, identity) {
    if (typeof identity !== 'string')
        return voidSelector;
    if (isSCLTag(tagName))
        return tags[tagName].selector(tagName, identity);
    return tagName;
}
function crossProduct(...arrays) {
    return arrays.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())), [[]]);
}
function pathParts(identity) {
    var _a;
    const path = identity.split('>');
    const end = (_a = path.pop()) !== null && _a !== void 0 ? _a : '';
    const start = path.join('>');
    return [start, end];
}
function hitemSelector(tagName, identity) {
    const [version, revision] = identity.split('\t');
    if (!version || !revision)
        return voidSelector;
    return `${tagName}[version="${version}"][revision="${revision}"]`;
}
function terminalSelector(tagName, identity) {
    const [parentIdentity, connectivityNode] = pathParts(identity);
    const parentSelectors = relatives[tagName].parents.flatMap(parentTag => selector(parentTag, parentIdentity).split(','));
    return crossProduct(parentSelectors, ['>'], [`${tagName}[connectivityNode="${connectivityNode}"]`])
        .map(strings => strings.join(''))
        .join(',');
}
function lNodeSelector(tagName, identity) {
    if (identity.endsWith(')')) {
        const [parentIdentity, childIdentity] = pathParts(identity);
        const [lnClass, lnType] = childIdentity
            .substring(1, childIdentity.length - 1)
            .split(' ');
        if (!lnClass || !lnType)
            return voidSelector;
        const parentSelectors = relatives[tagName].parents.flatMap(parentTag => selector(parentTag, parentIdentity).split(','));
        return crossProduct(parentSelectors, ['>'], [`${tagName}[iedName="None"][lnClass="${lnClass}"][lnType="${lnType}"]`])
            .map(strings => strings.join(''))
            .join(',');
    }
    const [iedName, ldInst, prefix, lnClass, lnInst] = identity.split(/[ /]/);
    if (!iedName || !ldInst || !lnClass)
        return voidSelector;
    const [iedNameSelectors, ldInstSelectors, prefixSelectors, lnClassSelectors, lnInstSelectors,] = [
        [`[iedName="${iedName}"]`],
        ldInst === '(Client)'
            ? [':not([ldInst])', '[ldInst=""]']
            : [`[ldInst="${ldInst}"]`],
        prefix ? [`[prefix="${prefix}"]`] : [':not([prefix])', '[prefix=""]'],
        [`[lnClass="${lnClass}"]`],
        lnInst ? [`[lnInst="${lnInst}"]`] : [':not([lnInst])', '[lnInst=""]'],
    ];
    return crossProduct([tagName], iedNameSelectors, ldInstSelectors, prefixSelectors, lnClassSelectors, lnInstSelectors)
        .map(strings => strings.join(''))
        .join(',');
}
function kDCSelector(tagName, identity) {
    const [parentIdentity, childIdentity] = pathParts(identity);
    const [iedName, apName] = childIdentity.split(' ');
    return `${selector('IED', parentIdentity)}>${tagName}[iedName="${iedName}"][apName="${apName}"]`;
}
function associationSelector(tagName, identity) {
    const [parentIdentity, associationID] = pathParts(identity);
    if (!associationID)
        return voidSelector;
    return `${selector('Server', parentIdentity)}>${tagName}[associationID="${associationID}"]`;
}
function lDeviceSelector(tagName, identity) {
    const [iedName, inst] = identity.split('>>');
    if (!inst)
        return voidSelector;
    return `IED[name="${iedName}"] ${tagName}[inst="${inst}"]`;
}
function iEDNameSelector(tagName, identity) {
    const [parentIdentity, childIdentity] = pathParts(identity);
    const [iedName, apRef, ldInst, prefix, lnClass, lnInst] = childIdentity.split(/[ /]/);
    const [parentSelectors, apRefSelectors, ldInstSelectors, prefixSelectors, lnClassSelectors, lnInstSelectors,] = [
        relatives[tagName].parents.flatMap(parentTag => selector(parentTag, parentIdentity).split(',')),
        [`${iedName}`],
        apRef ? [`[apRef="${apRef}"]`] : [':not([apRef])', '[apRef=""]'],
        ldInst ? [`[ldInst="${ldInst}"]`] : [':not([ldInst])', '[ldInst=""]'],
        prefix ? [`[prefix="${prefix}"]`] : [':not([prefix])', '[prefix=""]'],
        [`[lnClass="${lnClass}"]`],
        lnInst ? [`[lnInst="${lnInst}"]`] : [':not([lnInst])', '[lnInst=""]'],
    ];
    return crossProduct(parentSelectors, ['>'], [tagName], apRefSelectors, ldInstSelectors, prefixSelectors, lnClassSelectors, lnInstSelectors)
        .map(strings => strings.join(''))
        .join(',');
}
function fCDASelector(tagName, identity) {
    const [parentIdentity, childIdentity] = pathParts(identity);
    const [ldInst, prefix, lnClass, lnInst] = childIdentity.split(/[ /.]/);
    const matchDoDa = childIdentity.match(/.([A-Z][A-Za-z0-9.]*) ([A-Za-z0-9.]*) \(/);
    const doName = matchDoDa && matchDoDa[1] ? matchDoDa[1] : '';
    const daName = matchDoDa && matchDoDa[2] ? matchDoDa[2] : '';
    const matchFx = childIdentity.match(/\(([A-Z]{2})/);
    const matchIx = childIdentity.match(/ \[([0-9]{1,2})\]/);
    const fc = matchFx && matchFx[1] ? matchFx[1] : '';
    const ix = matchIx && matchIx[1] ? matchIx[1] : '';
    const [parentSelectors, ldInstSelectors, prefixSelectors, lnClassSelectors, lnInstSelectors, doNameSelectors, daNameSelectors, fcSelectors, ixSelectors,] = [
        relatives[tagName].parents.flatMap(parentTag => selector(parentTag, parentIdentity).split(',')),
        [`[ldInst="${ldInst}"]`],
        prefix ? [`[prefix="${prefix}"]`] : [':not([prefix])', '[prefix=""]'],
        [`[lnClass="${lnClass}"]`],
        lnInst ? [`[lnInst="${lnInst}"]`] : [':not([lnInst])', '[lnInst=""]'],
        [`[doName="${doName}"]`],
        daName ? [`[daName="${daName}"]`] : [':not([daName])', '[daName=""]'],
        [`[fc="${fc}"]`],
        ix ? [`[ix="${ix}"]`] : [':not([ix])', '[ix=""]'],
    ];
    return crossProduct(parentSelectors, ['>'], [tagName], ldInstSelectors, prefixSelectors, lnClassSelectors, lnInstSelectors, doNameSelectors, daNameSelectors, fcSelectors, ixSelectors)
        .map(strings => strings.join(''))
        .join(',');
}
function extRefSelector(tagName, identity) {
    const [parentIdentity, childIdentity] = pathParts(identity);
    const parentSelectors = relatives[tagName].parents.flatMap(parentTag => selector(parentTag, parentIdentity).split(','));
    if (childIdentity.endsWith(']')) {
        const [intAddr] = childIdentity.split('[');
        const intAddrSelectors = [`[intAddr="${intAddr}"]`];
        return crossProduct(parentSelectors, ['>'], [tagName], intAddrSelectors)
            .map(strings => strings.join(''))
            .join(',');
    }
    let iedName;
    let ldInst;
    let prefix;
    let lnClass;
    let lnInst;
    let doName;
    let daName;
    let serviceType;
    let srcCBName;
    let srcLDInst;
    let srcPrefix;
    let srcLNClass;
    let srcLNInst;
    let intAddr;
    if (!childIdentity.includes(':') && !childIdentity.includes('@')) {
        [iedName, ldInst, prefix, lnClass, lnInst, doName, daName] =
            childIdentity.split(/[ /]/);
    }
    else if (childIdentity.includes(':') && !childIdentity.includes('@')) {
        [
            serviceType,
            srcCBName,
            srcLDInst,
            srcPrefix,
            srcLNClass,
            srcLNInst,
            iedName,
            ldInst,
            prefix,
            lnClass,
            lnInst,
            doName,
            daName,
        ] = childIdentity.split(/[ /:]/);
    }
    else if (!childIdentity.includes(':') && childIdentity.includes('@')) {
        [iedName, ldInst, prefix, lnClass, lnInst, doName, daName, intAddr] =
            childIdentity.split(/[ /@]/);
    }
    else {
        [
            serviceType,
            srcCBName,
            srcLDInst,
            srcPrefix,
            srcLNClass,
            srcLNInst,
            iedName,
            ldInst,
            prefix,
            lnClass,
            lnInst,
            doName,
            daName,
            intAddr,
        ] = childIdentity.split(/[ /:@]/);
    }
    const [iedNameSelectors, ldInstSelectors, prefixSelectors, lnClassSelectors, lnInstSelectors, doNameSelectors, daNameSelectors, serviceTypeSelectors, srcCBNameSelectors, srcLDInstSelectors, srcPrefixSelectors, srcLNClassSelectors, srcLNInstSelectors, intAddrSelectors,] = [
        iedName ? [`[iedName="${iedName}"]`] : [':not([iedName])'],
        ldInst ? [`[ldInst="${ldInst}"]`] : [':not([ldInst])', '[ldInst=""]'],
        prefix ? [`[prefix="${prefix}"]`] : [':not([prefix])', '[prefix=""]'],
        lnClass ? [`[lnClass="${lnClass}"]`] : [':not([lnClass])'],
        lnInst ? [`[lnInst="${lnInst}"]`] : [':not([lnInst])', '[lnInst=""]'],
        doName ? [`[doName="${doName}"]`] : [':not([doName])'],
        daName ? [`[daName="${daName}"]`] : [':not([daName])', '[daName=""]'],
        serviceType
            ? [`[serviceType="${serviceType}"]`]
            : [':not([serviceType])', '[serviceType=""]'],
        srcCBName
            ? [`[srcCBName="${srcCBName}"]`]
            : [':not([srcCBName])', '[srcCBName=""]'],
        srcLDInst
            ? [`[srcLDInst="${srcLDInst}"]`]
            : [':not([srcLDInst])', '[srcLDInst=""]'],
        srcPrefix
            ? [`[srcPrefix="${srcPrefix}"]`]
            : [':not([srcPrefix])', '[srcPrefix=""]'],
        srcLNClass
            ? [`[srcLNClass="${srcLNClass}"]`]
            : [':not([srcLNClass])', '[srcLNClass=""]'],
        srcLNInst
            ? [`[srcLNInst="${srcLNInst}"]`]
            : [':not([srcLNInst])', '[srcLNInst=""]'],
        intAddr ? [`[intAddr="${intAddr}"]`] : [':not([intAddr])', '[intAddr=""]'],
    ];
    return crossProduct(parentSelectors, ['>'], [tagName], iedNameSelectors, ldInstSelectors, prefixSelectors, lnClassSelectors, lnInstSelectors, doNameSelectors, daNameSelectors, serviceTypeSelectors, srcCBNameSelectors, srcLDInstSelectors, srcPrefixSelectors, srcLNClassSelectors, srcLNInstSelectors, intAddrSelectors)
        .map(strings => strings.join(''))
        .join(',');
}
function lNSelector(tagName, identity) {
    const [parentIdentity, childIdentity] = pathParts(identity);
    const parentSelectors = relatives[tagName].parents.flatMap(parentTag => selector(parentTag, parentIdentity).split(','));
    const [prefix, lnClass, inst] = childIdentity.split(' ');
    if (!lnClass)
        return voidSelector;
    const [prefixSelectors, lnClassSelectors, instSelectors] = [
        prefix ? [`[prefix="${prefix}"]`] : [':not([prefix])', '[prefix=""]'],
        [`[lnClass="${lnClass}"]`],
        [`[inst="${inst}"]`],
    ];
    return crossProduct(parentSelectors, ['>'], [tagName], prefixSelectors, lnClassSelectors, instSelectors)
        .map(strings => strings.join(''))
        .join(',');
}
function clientLNSelector(tagName, identity) {
    const [parentIdentity, childIdentity] = pathParts(identity);
    const parentSelectors = relatives[tagName].parents.flatMap(parentTag => selector(parentTag, parentIdentity).split(','));
    const [iedName, apRef, ldInst, prefix, lnClass, lnInst] = childIdentity.split(/[ /]/);
    const [iedNameSelectors, apRefSelectors, ldInstSelectors, prefixSelectors, lnClassSelectors, lnInstSelectors,] = [
        iedName ? [`[iedName="${iedName}"]`] : [':not([iedName])', '[iedName=""]'],
        apRef ? [`[apRef="${apRef}"]`] : [':not([apRef])', '[apRef=""]'],
        ldInst ? [`[ldInst="${ldInst}"]`] : [':not([ldInst])', '[ldInst=""]'],
        prefix ? [`[prefix="${prefix}"]`] : [':not([prefix])', '[prefix=""]'],
        [`[lnClass="${lnClass}"]`],
        lnInst ? [`[lnInst="${lnInst}"]`] : [':not([lnInst])', '[lnInst=""]'],
    ];
    return crossProduct(parentSelectors, ['>'], [tagName], iedNameSelectors, apRefSelectors, ldInstSelectors, prefixSelectors, lnClassSelectors, lnInstSelectors)
        .map(strings => strings.join(''))
        .join(',');
}
function ixNamingSelector(tagName, identity, depth = -1) {
    var _a;
    // eslint-disable-next-line no-param-reassign
    if (depth === -1)
        depth = identity.split('>').length;
    const [parentIdentity, childIdentity] = pathParts(identity);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_0, name, _1, ix] = (_a = childIdentity.match(/([^[]*)(\[([0-9]*)\])?/)) !== null && _a !== void 0 ? _a : [];
    if (!name)
        return voidSelector;
    if (depth === 0)
        return `${tagName}[name="${name}"]`;
    const parentSelectors = relatives[tagName].parents
        .flatMap(parentTag => parentTag === 'SDI'
        ? ixNamingSelector(parentTag, parentIdentity, depth - 1).split(',')
        : selector(parentTag, parentIdentity).split(','))
        // eslint-disable-next-line no-shadow
        .filter(selector => !selector.startsWith(voidSelector));
    if (parentSelectors.length === 0)
        return voidSelector;
    const [nameSelectors, ixSelectors] = [
        [`[name="${name}"]`],
        ix ? [`[ix="${ix}"]`] : ['[ix=""]', ':not([ix])'],
    ];
    return crossProduct(parentSelectors, ['>'], [tagName], nameSelectors, ixSelectors)
        .map(strings => strings.join(''))
        .join(',');
}
function valSelector(tagName, identity) {
    const [parentIdentity, childIdentity] = pathParts(identity);
    const [sGroup, indexText] = childIdentity.split(' ');
    const index = parseFloat(indexText);
    const parentSelectors = relatives[tagName].parents.flatMap(parentTag => selector(parentTag, parentIdentity).split(','));
    const [nameSelectors, ixSelectors] = [
        sGroup ? [`[sGroup="${sGroup}"]`] : [''],
        index ? [`:nth-child(${index + 1})`] : [''],
    ];
    return crossProduct(parentSelectors, ['>'], [tagName], nameSelectors, ixSelectors)
        .map(strings => strings.join(''))
        .join(',');
}
function connectedAPSelector(tagName, identity) {
    const [iedName, apName] = identity.split(' ');
    if (!iedName || !apName)
        return voidSelector;
    return `${tagName}[iedName="${iedName}"][apName="${apName}"]`;
}
function controlBlockSelector(tagName, identity) {
    const [ldInst, cbName] = identity.split(' ');
    if (!ldInst || !cbName)
        return voidSelector;
    return `${tagName}[ldInst="${ldInst}"][cbName="${cbName}"]`;
}
function physConnSelector(tagName, identity) {
    const [parentIdentity, pcType] = pathParts(identity);
    const [parentSelectors, typeSelectors] = [
        relatives[tagName].parents.flatMap(parentTag => selector(parentTag, parentIdentity).split(',')),
        pcType ? [`[type="${pcType}"]`] : [''],
    ];
    return crossProduct(parentSelectors, ['>'], [tagName], typeSelectors)
        .map(strings => strings.join(''))
        .join(',');
}
function pSelector(tagName, identity) {
    const [parentIdentity, childIdentity] = pathParts(identity);
    const [type] = childIdentity.split(' ');
    const index = childIdentity &&
        childIdentity.match(/\[([0-9]+)\]/) &&
        childIdentity.match(/\[([0-9]+)\]/)[1]
        ? parseFloat(childIdentity.match(/\[([0-9]+)\]/)[1])
        : NaN;
    const [parentSelectors, typeSelectors, ixSelectors] = [
        relatives[tagName].parents.flatMap(parentTag => selector(parentTag, parentIdentity).split(',')),
        [`[type="${type}"]`],
        index ? [`:nth-child(${index + 1})`] : [''],
    ];
    return crossProduct(parentSelectors, ['>'], [tagName], typeSelectors, ixSelectors)
        .map(strings => strings.join(''))
        .join(',');
}
function enumValSelector(tagName, identity) {
    const [parentIdentity, ord] = pathParts(identity);
    return `${selector('EnumType', parentIdentity)}>${tagName}[ord="${ord}"]`;
}
function protNsSelector(tagName, identity) {
    const [parentIdentity, childIdentity] = pathParts(identity);
    const [type, value] = childIdentity.split('\t');
    const [parentSelectors] = [
        relatives[tagName].parents.flatMap(parentTag => selector(parentTag, parentIdentity).split(',')),
    ];
    return crossProduct(parentSelectors, ['>'], [tagName], [`[type="${type}"]`], ['>'], [value])
        .map(strings => strings.join(''))
        .join(',');
}
function sCLSelector() {
    return ':root';
}
function namingSelector(tagName, identity, depth = -1) {
    // eslint-disable-next-line no-param-reassign
    if (depth === -1)
        depth = identity.split('>').length;
    const [parentIdentity, name] = pathParts(identity);
    if (!name)
        return voidSelector;
    if (depth === 0)
        return `${tagName}[name="${name}"]`;
    // eslint-disable-next-line prefer-destructuring
    const parents = relatives[tagName].parents;
    if (!parents)
        return voidSelector;
    const parentSelectors = parents
        .flatMap(parentTag => tags[parentTag].selector === tags.Substation.selector
        ? namingSelector(parentTag, parentIdentity, depth - 1).split(',')
        : selector(parentTag, parentIdentity).split(','))
        // eslint-disable-next-line no-shadow
        .filter(selector => !selector.startsWith(voidSelector));
    if (parentSelectors.length === 0)
        return voidSelector;
    return crossProduct(parentSelectors, ['>'], [tagName], [`[name="${name}"]`])
        .map(strings => strings.join(''))
        .join(',');
}
function singletonSelector(tagName, identity) {
    // eslint-disable-next-line prefer-destructuring
    const parents = relatives[tagName].parents;
    if (!parents)
        return voidSelector;
    const parentSelectors = parents
        .flatMap(parentTag => selector(parentTag, identity).split(','))
        // eslint-disable-next-line no-shadow
        .filter(selector => !selector.startsWith(voidSelector));
    if (parentSelectors.length === 0)
        return voidSelector;
    return crossProduct(parentSelectors, ['>'], [tagName])
        .map(strings => strings.join(''))
        .join(',');
}
function idNamingSelector(tagName, identity) {
    const id = identity.replace(/^#/, '');
    if (!id)
        return voidSelector;
    return `${tagName}[id="${id}"]`;
}

const tags = {
    AccessControl: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    AccessPoint: {
        identity: namingIdentity,
        selector: namingSelector,
    },
    Address: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    Association: {
        identity: associationIdentity,
        selector: associationSelector,
    },
    Authentication: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    BDA: {
        identity: namingIdentity,
        selector: namingSelector,
    },
    BitRate: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    Bay: {
        identity: namingIdentity,
        selector: namingSelector,
    },
    ClientLN: {
        identity: clientLNIdentity,
        selector: clientLNSelector,
    },
    ClientServices: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    CommProt: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    Communication: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    ConductingEquipment: {
        identity: namingIdentity,
        selector: namingSelector,
    },
    ConfDataSet: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    ConfLdName: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    ConfLNs: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    ConfLogControl: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    ConfReportControl: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    ConfSG: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    ConfSigRef: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    ConnectedAP: {
        identity: connectedAPIdentity,
        selector: connectedAPSelector,
    },
    ConnectivityNode: {
        identity: namingIdentity,
        selector: namingSelector,
    },
    DA: {
        identity: namingIdentity,
        selector: namingSelector,
    },
    DAI: {
        identity: ixNamingIdentity,
        selector: ixNamingSelector,
    },
    DAType: {
        identity: idNamingIdentity,
        selector: idNamingSelector,
    },
    DO: {
        identity: namingIdentity,
        selector: namingSelector,
    },
    DOI: {
        identity: namingIdentity,
        selector: namingSelector,
    },
    DOType: {
        identity: idNamingIdentity,
        selector: idNamingSelector,
    },
    DataObjectDirectory: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    DataSet: {
        identity: namingIdentity,
        selector: namingSelector,
    },
    DataSetDirectory: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    DataTypeTemplates: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    DynAssociation: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    DynDataSet: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    EnumType: {
        identity: idNamingIdentity,
        selector: idNamingSelector,
    },
    EnumVal: {
        identity: enumValIdentity,
        selector: enumValSelector,
    },
    EqFunction: {
        identity: namingIdentity,
        selector: namingSelector,
    },
    EqSubFunction: {
        identity: namingIdentity,
        selector: namingSelector,
    },
    ExtRef: {
        identity: extRefIdentity,
        selector: extRefSelector,
    },
    FCDA: {
        identity: fCDAIdentity,
        selector: fCDASelector,
    },
    FileHandling: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    Function: {
        identity: namingIdentity,
        selector: namingSelector,
    },
    GeneralEquipment: {
        identity: namingIdentity,
        selector: namingSelector,
    },
    GetCBValues: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    GetDataObjectDefinition: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    GetDataSetValue: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    GetDirectory: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    GOOSE: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    GOOSESecurity: {
        identity: namingIdentity,
        selector: namingSelector,
    },
    GSE: {
        identity: controlBlockIdentity,
        selector: controlBlockSelector,
    },
    GSEDir: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    GSEControl: {
        identity: namingIdentity,
        selector: namingSelector,
    },
    GSESettings: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    GSSE: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    Header: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    History: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    Hitem: {
        identity: hitemIdentity,
        selector: hitemSelector,
    },
    IED: {
        identity: namingIdentity,
        selector: namingSelector,
    },
    IEDName: {
        identity: iEDNameIdentity,
        selector: iEDNameSelector,
    },
    Inputs: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    IssuerName: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    KDC: {
        identity: kDCIdentity,
        selector: kDCSelector,
    },
    LDevice: {
        identity: lDeviceIdentity,
        selector: lDeviceSelector,
    },
    LN: {
        identity: lNIdentity,
        selector: lNSelector,
    },
    LN0: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    LNode: {
        identity: lNodeIdentity,
        selector: lNodeSelector,
    },
    LNodeType: {
        identity: idNamingIdentity,
        selector: idNamingSelector,
    },
    Line: {
        identity: namingIdentity,
        selector: namingSelector,
    },
    Log: {
        identity: namingIdentity,
        selector: namingSelector,
    },
    LogControl: {
        identity: namingIdentity,
        selector: namingSelector,
    },
    LogSettings: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    MaxTime: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    McSecurity: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    MinTime: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    NeutralPoint: {
        identity: terminalIdentity,
        selector: terminalSelector,
    },
    OptFields: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    P: {
        identity: pIdentity,
        selector: pSelector,
    },
    PhysConn: {
        identity: physConnIdentity,
        selector: physConnSelector,
    },
    PowerTransformer: {
        identity: namingIdentity,
        selector: namingSelector,
    },
    Private: {
        identity: () => NaN,
        selector: () => voidSelector,
    },
    Process: {
        identity: namingIdentity,
        selector: namingSelector,
    },
    ProtNs: {
        identity: protNsIdentity,
        selector: protNsSelector,
    },
    Protocol: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    ReadWrite: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    RedProt: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    ReportControl: {
        identity: namingIdentity,
        selector: namingSelector,
    },
    ReportSettings: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    RptEnabled: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    SamplesPerSec: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    SampledValueControl: {
        identity: namingIdentity,
        selector: namingSelector,
    },
    SecPerSamples: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    SCL: {
        identity: sCLIdentity,
        selector: sCLSelector,
    },
    SDI: {
        identity: ixNamingIdentity,
        selector: ixNamingSelector,
    },
    SDO: {
        identity: namingIdentity,
        selector: namingSelector,
    },
    Server: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    ServerAt: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    Services: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    SetDataSetValue: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    SettingControl: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    SettingGroups: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    SGEdit: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    SmpRate: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    SMV: {
        identity: controlBlockIdentity,
        selector: controlBlockSelector,
    },
    SmvOpts: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    SMVsc: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    SMVSecurity: {
        identity: namingIdentity,
        selector: namingSelector,
    },
    SMVSettings: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    SubEquipment: {
        identity: namingIdentity,
        selector: namingSelector,
    },
    SubFunction: {
        identity: namingIdentity,
        selector: namingSelector,
    },
    SubNetwork: {
        identity: namingIdentity,
        selector: namingSelector,
    },
    Subject: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    Substation: {
        identity: namingIdentity,
        selector: namingSelector,
    },
    SupSubscription: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    TapChanger: {
        identity: namingIdentity,
        selector: namingSelector,
    },
    Terminal: {
        identity: terminalIdentity,
        selector: terminalSelector,
    },
    Text: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    TimerActivatedControl: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    TimeSyncProt: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    TransformerWinding: {
        identity: namingIdentity,
        selector: namingSelector,
    },
    TrgOps: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    Val: {
        identity: valIdentity,
        selector: valSelector,
    },
    ValueHandling: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    Voltage: {
        identity: singletonIdentity,
        selector: singletonSelector,
    },
    VoltageLevel: {
        identity: namingIdentity,
        selector: namingSelector,
    },
};

/** @returns a string uniquely identifying `e` in its document, or NaN if `e`
 * is unidentifiable. */
function identity(e) {
    if (e === null)
        return NaN;
    if (e.closest('Private'))
        return NaN;
    const tag = e.tagName;
    if (isSCLTag(tag))
        return tags[tag].identity(e);
    return NaN;
}
function hitemIdentity(e) {
    return `${e.getAttribute('version')}\t${e.getAttribute('revision')}`;
}
function terminalIdentity(e) {
    return `${identity(e.parentElement)}>${e.getAttribute('connectivityNode')}`;
}
function lNodeIdentity(e) {
    const [iedName, ldInst, prefix, lnClass, lnInst, lnType] = [
        'iedName',
        'ldInst',
        'prefix',
        'lnClass',
        'lnInst',
        'lnType',
    ].map(name => e.getAttribute(name));
    if (iedName === 'None')
        return `${identity(e.parentElement)}>(${lnClass} ${lnType})`;
    return `${iedName} ${ldInst || '(Client)'}/${prefix !== null && prefix !== void 0 ? prefix : ''} ${lnClass} ${lnInst !== null && lnInst !== void 0 ? lnInst : ''}`;
}
function kDCIdentity(e) {
    return `${identity(e.parentElement)}>${e.getAttribute('iedName')} ${e.getAttribute('apName')}`;
}
function associationIdentity(e) {
    var _a;
    return `${identity(e.parentElement)}>${(_a = e.getAttribute('associationID')) !== null && _a !== void 0 ? _a : ''}`;
}
function lDeviceIdentity(e) {
    return `${identity(e.closest('IED'))}>>${e.getAttribute('inst')}`;
}
function iEDNameIdentity(e) {
    const iedName = e.textContent;
    const [apRef, ldInst, prefix, lnClass, lnInst] = [
        'apRef',
        'ldInst',
        'prefix',
        'lnClass',
        'lnInst',
    ].map(name => e.getAttribute(name));
    return `${identity(e.parentElement)}>${iedName} ${apRef || ''} ${ldInst || ''}/${prefix !== null && prefix !== void 0 ? prefix : ''} ${lnClass !== null && lnClass !== void 0 ? lnClass : ''} ${lnInst !== null && lnInst !== void 0 ? lnInst : ''}`;
}
function fCDAIdentity(e) {
    const [ldInst, prefix, lnClass, lnInst, doName, daName, fc, ix] = [
        'ldInst',
        'prefix',
        'lnClass',
        'lnInst',
        'doName',
        'daName',
        'fc',
        'ix',
    ].map(name => e.getAttribute(name));
    const dataPath = `${ldInst}/${prefix !== null && prefix !== void 0 ? prefix : ''} ${lnClass} ${lnInst !== null && lnInst !== void 0 ? lnInst : ''}.${doName} ${daName || ''}`;
    return `${identity(e.parentElement)}>${dataPath} (${fc}${ix ? ` [${ix}]` : ''})`;
}
function extRefIdentity(e) {
    if (!e.parentElement)
        return NaN;
    const parentIdentity = identity(e.parentElement);
    const iedName = e.getAttribute('iedName');
    const intAddr = e.getAttribute('intAddr');
    const intAddrIndex = Array.from(e.parentElement.querySelectorAll(`ExtRef[intAddr="${intAddr}"]`)).indexOf(e);
    if (intAddr)
        return `${parentIdentity}>${intAddr}[${intAddrIndex}]`;
    const [ldInst, prefix, lnClass, lnInst, doName, daName, serviceType, srcLDInst, srcPrefix, srcLNClass, srcLNInst, srcCBName,] = [
        'ldInst',
        'prefix',
        'lnClass',
        'lnInst',
        'doName',
        'daName',
        'serviceType',
        'srcLDInst',
        'srcPrefix',
        'srcLNClass',
        'srcLNInst',
        'srcCBName',
    ].map(name => e.getAttribute(name));
    const cbPath = srcCBName
        ? `${serviceType}:${srcCBName} ${srcLDInst !== null && srcLDInst !== void 0 ? srcLDInst : ''}/${srcPrefix !== null && srcPrefix !== void 0 ? srcPrefix : ''} ${srcLNClass !== null && srcLNClass !== void 0 ? srcLNClass : ''} ${srcLNInst !== null && srcLNInst !== void 0 ? srcLNInst : ''}`
        : '';
    const dataPath = `${iedName} ${ldInst}/${prefix !== null && prefix !== void 0 ? prefix : ''} ${lnClass} ${lnInst !== null && lnInst !== void 0 ? lnInst : ''} ${doName} ${daName || ''}`;
    return `${parentIdentity}>${cbPath ? `${cbPath} ` : ''}${dataPath}${intAddr ? `@${intAddr}` : ''}`;
}
function lNIdentity(e) {
    const [prefix, lnClass, inst] = ['prefix', 'lnClass', 'inst'].map(name => e.getAttribute(name));
    return `${identity(e.parentElement)}>${prefix !== null && prefix !== void 0 ? prefix : ''} ${lnClass} ${inst}`;
}
function clientLNIdentity(e) {
    const [apRef, iedName, ldInst, prefix, lnClass, lnInst] = [
        'apRef',
        'iedName',
        'ldInst',
        'prefix',
        'lnClass',
        'lnInst',
    ].map(name => e.getAttribute(name));
    return `${identity(e.parentElement)}>${iedName} ${apRef || ''} ${ldInst}/${prefix !== null && prefix !== void 0 ? prefix : ''} ${lnClass} ${lnInst}`;
}
function ixNamingIdentity(e) {
    const [name, ix] = ['name', 'ix'].map(naming => e.getAttribute(naming));
    return `${identity(e.parentElement)}>${name}${ix ? `[${ix}]` : ''}`;
}
function valIdentity(e) {
    if (!e.parentElement)
        return NaN;
    const sGroup = e.getAttribute('sGroup');
    const index = Array.from(e.parentElement.children)
        .filter(child => child.getAttribute('sGroup') === sGroup)
        .findIndex(child => child.isSameNode(e));
    return `${identity(e.parentElement)}>${sGroup ? `${sGroup}.` : ''} ${index}`;
}
function connectedAPIdentity(e) {
    const [iedName, apName] = ['iedName', 'apName'].map(name => e.getAttribute(name));
    return `${iedName} ${apName}`;
}
function controlBlockIdentity(e) {
    const [ldInst, cbName] = ['ldInst', 'cbName'].map(name => e.getAttribute(name));
    return `${ldInst} ${cbName}`;
}
function physConnIdentity(e) {
    if (!e.parentElement)
        return NaN;
    if (!e.parentElement.querySelector('PhysConn[type="RedConn"]'))
        return NaN;
    const pcType = e.getAttribute('type');
    if (e.parentElement.children.length > 1 &&
        pcType !== 'Connection' &&
        pcType !== 'RedConn')
        return NaN;
    return `${identity(e.parentElement)}>${pcType}`;
}
function pIdentity(e) {
    if (!e.parentElement)
        return NaN;
    const eParent = e.parentElement;
    const eType = e.getAttribute('type');
    if (eParent.tagName === 'PhysConn')
        return `${identity(e.parentElement)}>${eType}`;
    const index = Array.from(e.parentElement.children)
        .filter(child => child.getAttribute('type') === eType)
        .findIndex(child => child.isSameNode(e));
    return `${identity(e.parentElement)}>${eType} [${index}]`;
}
function enumValIdentity(e) {
    return `${identity(e.parentElement)}>${e.getAttribute('ord')}`;
}
function protNsIdentity(e) {
    return `${identity(e.parentElement)}>${e.getAttribute('type') || '8-MMS'}\t${e.textContent}`;
}
function sCLIdentity() {
    return '';
}
function namingIdentity(e) {
    return e.parentElement.tagName === 'SCL'
        ? e.getAttribute('name')
        : `${identity(e.parentElement)}>${e.getAttribute('name')}`;
}
function singletonIdentity(e) {
    return identity(e.parentElement).toString();
}
function idNamingIdentity(e) {
    return `#${e.id}`;
}

function getSclSchemaVersion(doc) {
    var _a, _b, _c;
    const scl = doc.documentElement;
    const edition = ((_a = scl.getAttribute('version')) !== null && _a !== void 0 ? _a : '2003') +
        ((_b = scl.getAttribute('revision')) !== null && _b !== void 0 ? _b : '') +
        ((_c = scl.getAttribute('release')) !== null && _c !== void 0 ? _c : '');
    return edition;
}
const serviceTypes = {
    ReportControl: 'Report',
    GSEControl: 'GOOSE',
    SampledValueControl: 'SMV',
};
/**
 * Extract the 'name' attribute from the given XML element.
 * @param element - The element to extract name from.
 * @returns the name, or undefined if there is no name.
 */
function getNameAttribute(element) {
    const name = element.getAttribute('name');
    return name !== null && name !== void 0 ? name : undefined;
}
/**
 * Extract the 'desc' attribute from the given XML element.
 * @param element - The element to extract description from.
 * @returns the name, or undefined if there is no description.
 */
function getDescriptionAttribute(element) {
    const name = element.getAttribute('desc');
    return name !== null && name !== void 0 ? name : undefined;
}
function isPublic(element) {
    return !element.closest('Private');
}
/** maximum value for `lnInst` attribute */
const maxLnInst = 99;
const lnInstRange = Array(maxLnInst)
    .fill(1)
    .map((_, i) => `${i + 1}`);
/**
 * @param lnElements - The LN elements to be scanned for `inst`
 * values already in use.
 * @returns first available inst value for LN or undefined if no inst is available
 */
function minAvailableLogicalNodeInstance(lnElements) {
    const lnInsts = new Set(lnElements.map(ln => ln.getAttribute('inst') || ''));
    return lnInstRange.find(lnInst => !lnInsts.has(lnInst));
}
/** Sorts selected `ListItem`s to the top and disabled ones to the bottom. */
function compareNames(a, b) {
    var _a, _b, _c;
    if (typeof a === 'string' && typeof b === 'string')
        return a.localeCompare(b);
    if (typeof a === 'object' && typeof b === 'string')
        return ((_a = a.getAttribute('name')) !== null && _a !== void 0 ? _a : '').localeCompare(b);
    if (typeof a === 'string' && typeof b === 'object')
        return a.localeCompare(b.getAttribute('name'));
    if (typeof a === 'object' && typeof b === 'object')
        return ((_b = a.getAttribute('name')) !== null && _b !== void 0 ? _b : '').localeCompare((_c = b.getAttribute('name')) !== null && _c !== void 0 ? _c : '');
    return 0;
}
function findFCDAs$1(extRef) {
    if (extRef.tagName !== 'ExtRef' || extRef.closest('Private'))
        return [];
    const [iedName, ldInst, prefix, lnClass, lnInst, doName, daName] = [
        'iedName',
        'ldInst',
        'prefix',
        'lnClass',
        'lnInst',
        'doName',
        'daName',
    ].map(name => extRef.getAttribute(name));
    const ied = Array.from(extRef.ownerDocument.getElementsByTagName('IED')).find(element => element.getAttribute('name') === iedName && !element.closest('Private'));
    if (!ied)
        return [];
    return Array.from(ied.getElementsByTagName('FCDA'))
        .filter(item => !item.closest('Private'))
        .filter(fcda => {
        var _a, _b, _c, _d, _e, _f;
        return ((_a = fcda.getAttribute('ldInst')) !== null && _a !== void 0 ? _a : '') === (ldInst !== null && ldInst !== void 0 ? ldInst : '') &&
            ((_b = fcda.getAttribute('prefix')) !== null && _b !== void 0 ? _b : '') === (prefix !== null && prefix !== void 0 ? prefix : '') &&
            ((_c = fcda.getAttribute('lnClass')) !== null && _c !== void 0 ? _c : '') === (lnClass !== null && lnClass !== void 0 ? lnClass : '') &&
            ((_d = fcda.getAttribute('lnInst')) !== null && _d !== void 0 ? _d : '') === (lnInst !== null && lnInst !== void 0 ? lnInst : '') &&
            ((_e = fcda.getAttribute('doName')) !== null && _e !== void 0 ? _e : '') === (doName !== null && doName !== void 0 ? doName : '') &&
            ((_f = fcda.getAttribute('daName')) !== null && _f !== void 0 ? _f : '') === (daName !== null && daName !== void 0 ? daName : '');
    });
}

const SCL_NAMESPACE = 'http://www.iec.ch/61850/2003/SCL';
function getFcdaOrExtRefTitleValue(fcdaElement) {
    var _a, _b;
    return `${(_a = fcdaElement.getAttribute('doName')) !== null && _a !== void 0 ? _a : ''}${fcdaElement.hasAttribute('doName') && fcdaElement.hasAttribute('daName')
        ? `.`
        : ``}${(_b = fcdaElement.getAttribute('daName')) !== null && _b !== void 0 ? _b : ''}`;
}
function getFcdaOrExtRefSubtitleValue(fcdaElement) {
    var _a, _b;
    return `${fcdaElement.getAttribute('ldInst')} ${fcdaElement.hasAttribute('ldInst') ? `/` : ''}${fcdaElement.getAttribute('prefix')
        ? ` ${fcdaElement.getAttribute('prefix')}`
        : ''} ${(_a = fcdaElement.getAttribute('lnClass')) !== null && _a !== void 0 ? _a : ''} ${(_b = fcdaElement.getAttribute('lnInst')) !== null && _b !== void 0 ? _b : ''}`;
}
function dataAttributeSpecification(anyLn, doName, daName) {
    const doc = anyLn.ownerDocument;
    const lNodeType = doc.querySelector(`LNodeType[id="${anyLn.getAttribute('lnType')}"]`);
    const doNames = doName.split('.');
    let leaf = lNodeType;
    for (const doN of doNames) {
        const dO = leaf === null || leaf === void 0 ? void 0 : leaf.querySelector(`DO[name="${doN}"], SDO[name="${doN}"]`);
        leaf = doc.querySelector(`DOType[id="${dO === null || dO === void 0 ? void 0 : dO.getAttribute('type')}"]`);
    }
    if (!leaf || !leaf.getAttribute('cdc'))
        return { cdc: null, bType: null };
    const cdc = leaf.getAttribute('cdc');
    const daNames = daName.split('.');
    for (const daN of daNames) {
        const dA = leaf === null || leaf === void 0 ? void 0 : leaf.querySelector(`DA[name="${daN}"], BDA[name="${daN}"]`);
        leaf =
            daNames.indexOf(daN) < daNames.length - 1
                ? doc.querySelector(`DAType[id="${dA === null || dA === void 0 ? void 0 : dA.getAttribute('type')}"]`)
                : dA;
    }
    if (!leaf || !leaf.getAttribute('bType'))
        return { cdc, bType: null };
    const bType = leaf.getAttribute('bType');
    return { bType, cdc };
}
// TODO: This is now exported as it can be quite useful
/**
 * Edition 2 and later SCL files allow to restrict subscription on
 * later binding type inputs (`ExtRef` elements) based on a `CDC` and
 * basic type `bType`.
 * @param extRef - A later binding type input in the sink IED
 * @returns data objects `CDC` and data attribute basic type `bType` or `null`
 */
function inputRestriction(extRef) {
    var _a;
    const [pLN, pDO, pDA] = ['pLN', 'pDO', 'pDA'].map(attr => extRef.getAttribute(attr));
    if (!pLN || !pDO || !pDA)
        return { cdc: null, bType: null };
    const anyLns = Array.from((_a = extRef.ownerDocument.querySelectorAll(`LN[lnClass="${pLN}"],LN0[lnClass="${pLN}"]`)) !== null && _a !== void 0 ? _a : []);
    for (const anyLn of anyLns) {
        const dataSpec = dataAttributeSpecification(anyLn, pDO, pDA);
        if (dataSpec.cdc !== null && dataSpec.bType !== null)
            return dataSpec;
    }
    return { cdc: null, bType: null };
}
// TODO: I have exported this
// TODO I have modified this from LDevice[inst="${fcda.getAttribute('inst')}"] LN0` to LDevice[inst="${fcda.getAttribute('ldInst')}"] LN0`
// there is no inst attribute declared against an FCDA
/**
 * @param fcda - Data attribute reference in a data set
 * @returns Data objects `CDC` and data attributes `bType`
 */
function fcdaSpecification(fcda) {
    var _a;
    const [doName, daName] = ['doName', 'daName'].map(attr => fcda.getAttribute(attr));
    if (!doName || !daName)
        return { cdc: null, bType: null };
    const ied = fcda.closest('IED');
    const anyLn = Array.from((_a = ied === null || ied === void 0 ? void 0 : ied.querySelectorAll(`LDevice[inst="${fcda.getAttribute('ldInst')}"] > LN, LDevice[inst="${fcda.getAttribute('ldInst')}"] LN0`)) !== null && _a !== void 0 ? _a : []).find(aLn => {
        var _a, _b, _c, _d, _e, _f;
        return ((_a = aLn.getAttribute('prefix')) !== null && _a !== void 0 ? _a : '') ===
            ((_b = fcda.getAttribute('prefix')) !== null && _b !== void 0 ? _b : '') &&
            ((_c = aLn.getAttribute('lnClass')) !== null && _c !== void 0 ? _c : '') ===
                ((_d = fcda.getAttribute('lnClass')) !== null && _d !== void 0 ? _d : '') &&
            ((_e = aLn.getAttribute('inst')) !== null && _e !== void 0 ? _e : '') === ((_f = fcda.getAttribute('lnInst')) !== null && _f !== void 0 ? _f : '');
    });
    if (!anyLn)
        return { cdc: null, bType: null };
    return dataAttributeSpecification(anyLn, doName, daName);
}
// /**
//  * Check data consistency of source `FCDA` and sink `ExtRef` based on
//  * `ExtRef`'s `pLN`, `pDO`, `pDA` and `pServT` attributes.
//  * Consistent means `CDC` and `bType` of both ExtRef and FCDA is equal.
//  * In case
//  *  - `pLN`, `pDO`, `pDA` or `pServT` attributes are not present, allow subscribing
//  *  - no CDC or bType can be extracted, do not allow subscribing
//  *
//  * @param extRef - The `ExtRef` Element to check against
//  * @param fcdaElement - The SCL `FCDA` element within the DataSet
//  * @param controlElement - The control element associated with the `FCDA` `DataSet`
//  */
// function unsupportedExtRefElement(
//   extRef: Element | undefined,
//   fcdaElement: Element | undefined,
//   controlElement: Element | undefined
// ): boolean {
//   if (!extRef) return false;
//   // Vendor does not provide data for the check
//   if (
//     !extRef.hasAttribute('pLN') ||
//     !extRef.hasAttribute('pDO') ||
//     !extRef.hasAttribute('pDA') ||
//     !extRef.hasAttribute('pServT')
//   )
//     return false;
//   // Not ready for any kind of subscription
//   if (!fcdaElement) return true;
//   const fcda = fcdaSpecification(fcdaElement);
//   const input = inputRestriction(extRef);
//   if (fcda.cdc === null && input.cdc === null) return true;
//   if (fcda.bType === null && input.bType === null) return true;
//   if (
//     serviceTypes[controlElement?.tagName ?? ''] !==
//     extRef.getAttribute('pServT')
//   )
//     return true;
//   return fcda.cdc !== input.cdc || fcda.bType !== input.bType;
// }
function getExtRefElements(rootElement, fcdaElement, includeLaterBinding) {
    return Array.from(rootElement.querySelectorAll('ExtRef'))
        .filter(element => (includeLaterBinding && element.hasAttribute('intAddr')) ||
        (!includeLaterBinding && !element.hasAttribute('intAddr')))
        .filter(element => element.closest('IED') !== (fcdaElement === null || fcdaElement === void 0 ? void 0 : fcdaElement.closest('IED')));
}
/**
 * Simple function to check if the attribute of the Left Side has the same value as the attribute of the Right Element.
 *
 * @param leftElement   - The Left Element to check against.
 * @param rightElement  - The Right Element to check.
 * @param attributeName - The name of the attribute to check.
 */
function sameAttributeValue(leftElement, rightElement, attributeName) {
    var _a, _b;
    return (((_a = leftElement === null || leftElement === void 0 ? void 0 : leftElement.getAttribute(attributeName)) !== null && _a !== void 0 ? _a : '') ===
        ((_b = rightElement === null || rightElement === void 0 ? void 0 : rightElement.getAttribute(attributeName)) !== null && _b !== void 0 ? _b : ''));
}
/**
 * Simple function to check if the attribute of the Left Side has the same value as the attribute of the Right Element.
 *
 * @param leftElement        - The Left Element to check against.
 * @param leftAttributeName  - The name of the attribute (left) to check against.
 * @param rightElement       - The Right Element to check.
 * @param rightAttributeName - The name of the attribute (right) to check.
 */
function sameAttributeValueDiffName(leftElement, leftAttributeName, rightElement, rightAttributeName) {
    var _a, _b;
    return (((_a = leftElement === null || leftElement === void 0 ? void 0 : leftElement.getAttribute(leftAttributeName)) !== null && _a !== void 0 ? _a : '') ===
        ((_b = rightElement === null || rightElement === void 0 ? void 0 : rightElement.getAttribute(rightAttributeName)) !== null && _b !== void 0 ? _b : ''));
}
/**
 * If needed check version specific attributes against FCDA Element.
 *
 * @param controlTag     - Indicates which type of control element.
 * @param controlElement - The Control Element to check against.
 * @param extRefElement  - The Ext Ref Element to check.
 */
function checkEditionSpecificRequirements(controlTag, controlElement, extRefElement) {
    var _a, _b, _c;
    // For 2003 Edition no extra check needed.
    if (getSclSchemaVersion(extRefElement.ownerDocument) === '2003') {
        return true;
    }
    const lDeviceElement = (_a = controlElement === null || controlElement === void 0 ? void 0 : controlElement.closest('LDevice')) !== null && _a !== void 0 ? _a : undefined;
    const lnElement = (_b = controlElement === null || controlElement === void 0 ? void 0 : controlElement.closest('LN0')) !== null && _b !== void 0 ? _b : undefined;
    // For the 2007B and 2007B4 Edition we need to check some extra attributes.
    return (((_c = extRefElement.getAttribute('serviceType')) !== null && _c !== void 0 ? _c : '') ===
        serviceTypes[controlTag] &&
        sameAttributeValueDiffName(extRefElement, 'srcLDInst', lDeviceElement, 'inst') &&
        sameAttributeValueDiffName(extRefElement, 'srcPrefix', lnElement, 'prefix') &&
        sameAttributeValueDiffName(extRefElement, 'srcLNClass', lnElement, 'lnClass') &&
        sameAttributeValueDiffName(extRefElement, 'srcLNInst', lnElement, 'inst') &&
        sameAttributeValueDiffName(extRefElement, 'srcCBName', controlElement, 'name'));
}
/**
 * Check if specific attributes from the ExtRef Element are the same as the ones from the FCDA Element
 * and also if the IED Name is the same. If that is the case this ExtRef subscribes to the selected FCDA
 * Element.
 *
 * @param controlTag     - Indicates which type of control element.
 * @param controlElement - The Control Element to check against.
 * @param fcdaElement    - The FCDA Element to check against.
 * @param extRefElement  - The Ext Ref Element to check.
 */
function isSubscribedTo(controlTag, controlElement, fcdaElement, extRefElement) {
    var _a;
    return (extRefElement.getAttribute('iedName') ===
        ((_a = fcdaElement === null || fcdaElement === void 0 ? void 0 : fcdaElement.closest('IED')) === null || _a === void 0 ? void 0 : _a.getAttribute('name')) &&
        sameAttributeValue(fcdaElement, extRefElement, 'ldInst') &&
        sameAttributeValue(fcdaElement, extRefElement, 'prefix') &&
        sameAttributeValue(fcdaElement, extRefElement, 'lnClass') &&
        sameAttributeValue(fcdaElement, extRefElement, 'lnInst') &&
        sameAttributeValue(fcdaElement, extRefElement, 'doName') &&
        sameAttributeValue(fcdaElement, extRefElement, 'daName') &&
        checkEditionSpecificRequirements(controlTag, controlElement, extRefElement));
}
function getSubscribedExtRefElements(rootElement, controlTag, fcdaElement, controlElement, includeLaterBinding) {
    return getExtRefElements(rootElement, fcdaElement, includeLaterBinding).filter(extRefElement => isSubscribedTo(controlTag, controlElement, fcdaElement, extRefElement));
}
function getCbReference(extRef) {
    var _a, _b;
    const extRefValues = ['iedName', 'srcPrefix', 'srcCBName'];
    const [srcIedName, srcPrefix, srcCBName] = extRefValues.map(attr => { var _a; return (_a = extRef.getAttribute(attr)) !== null && _a !== void 0 ? _a : ''; });
    const srcLDInst = (_a = extRef.getAttribute('srcLDInst')) !== null && _a !== void 0 ? _a : extRef.getAttribute('ldInst');
    const srcLNClass = (_b = extRef.getAttribute('srcLNClass')) !== null && _b !== void 0 ? _b : 'LLN0';
    return `${srcIedName}${srcPrefix}${srcLDInst}/${srcLNClass}.${srcCBName}`;
}
/** Returns the subscriber's supervision LN for a given control block and extRef element
 *
 * @param extRef - The extRef SCL element in the subscribing IED.
 * @returns The supervision LN instance or null if not found
 */
function getExistingSupervision(extRef) {
    var _a;
    if (extRef === null)
        return null;
    // TODO: This seems inadequate. ServiceType may not be defined but we could search
    // both LGOS and LSVS instances.
    const supervisionType = extRef.getAttribute('serviceType') === 'GOOSE' ? 'LGOS' : 'LSVS';
    const refSelector = supervisionType === 'LGOS' ? 'DOI[name="GoCBRef"]' : 'DOI[name="SvCBRef"]';
    const iedName = (_a = extRef.closest('IED')) === null || _a === void 0 ? void 0 : _a.getAttribute('name');
    const candidates = Array.from(extRef.ownerDocument
        .querySelector(`IED[name="${iedName}"]`)
        .querySelectorAll(`LDevice > LN[lnClass="${supervisionType}"]>${refSelector}>DAI[name="setSrcRef"]>Val`)).find(val => val.textContent === getCbReference(extRef));
    return candidates !== undefined ? candidates.closest('LN') : null;
}
/**
 * Check if the ExtRef is already subscribed to a FCDA Element.
 *
 * @param extRefElement - The Ext Ref Element to check.
 */
function isSubscribed(extRefElement) {
    return (extRefElement.hasAttribute('iedName') &&
        extRefElement.hasAttribute('ldInst') &&
        extRefElement.hasAttribute('lnClass') &&
        extRefElement.hasAttribute('lnInst') &&
        extRefElement.hasAttribute('doName'));
}
/**
 * Check if the ExtRef is already partially subscribed to a FCDA Element.
 *
 * @param extRefElement - The Ext Ref Element to check.
 */
function isPartiallyConfigured(extRefElement) {
    const partialConfigElements = [
        'iedName',
        'ldInst',
        'prefix',
        'lnClass',
        'lnInst',
        'doName',
        'daName',
        'srcLDInst',
        'srcPrefix',
        'srcLNClass',
        'srcLNInst',
        'srcCBName',
    ];
    return (partialConfigElements.some(attr => extRefElement.getAttribute(attr) !== null) && !isSubscribed(extRefElement));
}
/**
 * Return Val elements within an LGOS/LSVS instance for a particular IED and control block type.
 * @param ied - IED SCL element.
 * @param cbTagName - Either GSEControl or (defaults to) SampledValueControl.
 * @returns an Element array of Val SCL elements within an LGOS/LSVS node.
 */
function getSupervisionCbRefs(ied, cbTagName) {
    const supervisionType = cbTagName === 'GSEControl' ? 'LGOS' : 'LSVS';
    const supervisionName = supervisionType === 'LGOS' ? 'GoCBRef' : 'SvCBRef';
    const selectorString = `LN[lnClass="${supervisionType}"]>DOI[name="${supervisionName}"]>DAI[name="setSrcRef"]>Val,LN0[lnClass="${supervisionType}"]>DOI[name="${supervisionName}"]>DAI[name="setSrcRef"]>Val`;
    return Array.from(ied.querySelectorAll(selectorString));
}
/**
 * Creates a string pointer to the control block element.
 *
 * @param controlBlock The GOOSE or SMV message element
 * @returns null if the control block is undefined or a string pointer to the control block element
 */
function controlBlockReference(controlBlock) {
    var _a, _b, _c, _d;
    if (!controlBlock)
        return null;
    const anyLn = controlBlock.closest('LN,LN0');
    const prefix = (_a = anyLn === null || anyLn === void 0 ? void 0 : anyLn.getAttribute('prefix')) !== null && _a !== void 0 ? _a : '';
    const lnClass = anyLn === null || anyLn === void 0 ? void 0 : anyLn.getAttribute('lnClass');
    const lnInst = (_b = anyLn === null || anyLn === void 0 ? void 0 : anyLn.getAttribute('inst')) !== null && _b !== void 0 ? _b : '';
    const ldInst = (_c = controlBlock.closest('LDevice')) === null || _c === void 0 ? void 0 : _c.getAttribute('inst');
    const iedName = (_d = controlBlock.closest('IED')) === null || _d === void 0 ? void 0 : _d.getAttribute('name');
    const cbName = controlBlock.getAttribute('name');
    if (!cbName && !iedName && !ldInst && !lnClass)
        return null;
    return `${iedName}${ldInst}/${prefix}${lnClass}${lnInst}.${cbName}`;
}
/**
 * Counts the number of LN instances with proper supervision for the given control block set up.
 *
 * @param subscriberIED - The subscriber IED.
 * @param controlBlock - The GOOSE or SMV message element.
 * @returns The number of LN instances with a supervision set up.
 */
function instantiatedSupervisionsCount(subscriberIED, controlBlock) {
    const instantiatedValues = getSupervisionCbRefs(subscriberIED, controlBlock.tagName).filter(val => val.textContent !== '');
    return instantiatedValues.length;
}
/**
 * Counts the max number of LN instances with supervision allowed for
 * the given control block's type of message.
 *
 * @param subscriberIED The subscriber IED
 * @param controlBlock The GOOSE or SMV message element
 * @returns The max number of LN instances with supervision allowed
 */
function maxSupervisions(subscriberIED, controlBlock) {
    var _a, _b;
    const maxAttr = controlBlock.tagName === 'GSEControl' ? 'maxGo' : 'maxSv';
    const maxValues = parseInt((_b = (_a = subscriberIED
        .querySelector('Services>SupSubscription')) === null || _a === void 0 ? void 0 : _a.getAttribute(maxAttr)) !== null && _b !== void 0 ? _b : '0', 10);
    return Number.isNaN(maxValues) ? 0 : maxValues;
}
/**
 * Checks if the given combination of GOOSE/SMV message and subscriber IED
 * allows for subscription supervision.
 * @param controlBlock The GOOSE or SMV message element
 * @param subscriberIED The subscriber IED
 * @param supervisionType LSVS or LGOS
 * @returns true if both controlBlock and subscriberIED meet the requirements for
 * setting up a supervision for the specified supervision type or false if they don't
 */
function isSupervisionAllowed(controlBlock, subscriberIED, supervisionType) {
    if (getSclSchemaVersion(subscriberIED.ownerDocument) === '2003')
        return false;
    if (subscriberIED.querySelector(`LN[lnClass="${supervisionType}"]`) === null)
        return false;
    if (getSupervisionCbRefs(subscriberIED, controlBlock.tagName).find(val => val.textContent === controlBlockReference(controlBlock)))
        return false;
    if (maxSupervisions(subscriberIED, controlBlock) <=
        instantiatedSupervisionsCount(subscriberIED, controlBlock))
        return false;
    return true;
}
/** Returns an new or existing LN instance available for supervision instantiation
 *
 * @param controlBlock The GOOSE or SMV message element
 * @param subscriberIED The subscriber IED
 * @returns The LN instance or null if no LN instance could be found or created
 */
function findOrCreateAvailableLNInst(controlBlock, subscriberIED, supervisionType) {
    var _a, _b, _c;
    let availableLN = Array.from(subscriberIED.querySelectorAll(`LN[lnClass="${supervisionType}"]`)).find(ln => {
        var _a;
        const supervisionName = supervisionType === 'LGOS' ? 'GoCBRef' : 'SvCBRef';
        return (ln.querySelector(`DOI[name="${supervisionName}"]>DAI[name="setSrcRef"]>Val`) === null ||
            ((_a = ln.querySelector(`DOI[name="${supervisionName}"]>DAI[name="setSrcRef"]>Val`)) === null || _a === void 0 ? void 0 : _a.textContent) === '');
    });
    if (!availableLN) {
        availableLN = subscriberIED.ownerDocument.createElementNS(SCL_NAMESPACE, 'LN');
        const openScdTag = subscriberIED.ownerDocument.createElementNS(SCL_NAMESPACE, 'Private');
        openScdTag.setAttribute('type', 'OpenSCD.create');
        availableLN.appendChild(openScdTag);
        availableLN.setAttribute('lnClass', supervisionType);
        const instantiatedSiblings = (_a = getSupervisionCbRefs(subscriberIED, controlBlock.tagName)[0]) === null || _a === void 0 ? void 0 : _a.closest('LN');
        if (!instantiatedSiblings)
            return null;
        availableLN.setAttribute('lnType', (_b = instantiatedSiblings === null || instantiatedSiblings === void 0 ? void 0 : instantiatedSiblings.getAttribute('lnType')) !== null && _b !== void 0 ? _b : '');
    }
    /* Before we return, we make sure that LN's inst is unique, non-empty
    and also the minimum inst as the minimum of all available in the IED */
    const inst = (_c = availableLN.getAttribute('inst')) !== null && _c !== void 0 ? _c : '';
    if (inst === '') {
        const instNumber = minAvailableLogicalNodeInstance(Array.from(subscriberIED.querySelectorAll(`LN[lnClass="${supervisionType}"]`)));
        if (!instNumber)
            return null;
        availableLN.setAttribute('inst', instNumber);
    }
    return availableLN;
}
/**
 * Searches for first instantiated LGOS/LSVS LN for presence of DOI>DAI[valKind=Conf/RO][valImport=true]
 * given a supervision type and if necessary then searches DataTypeTemplates for
 * DOType>DA[valKind=Conf/RO][valImport=true] to determine if modifications to supervision are allowed.
 * @param ied - SCL IED element.
 * @param supervisionType - either 'LGOS' or 'LSVS' supervision LN classes.
 * @returns boolean indicating if subscriptions are allowed.
 */
function isSupervisionModificationAllowed(ied, supervisionType) {
    var _a, _b;
    const firstSupervisionLN = ied.querySelector(`LN[lnClass="${supervisionType}"]`);
    // no supervision logical nodes => no new supervision possible
    if (firstSupervisionLN === null)
        return false;
    // check if allowed to modify based on first instance properties
    const supervisionName = supervisionType === 'LGOS' ? 'GoCBRef' : 'SvCBRef';
    const instValKind = (_a = firstSupervisionLN
        .querySelector(`DOI[name="${supervisionName}"]>DAI[name="setSrcRef"]`)) === null || _a === void 0 ? void 0 : _a.getAttribute('valKind');
    const instValImport = (_b = firstSupervisionLN
        .querySelector(`DOI[name="${supervisionName}"]>DAI[name="setSrcRef"]`)) === null || _b === void 0 ? void 0 : _b.getAttribute('valImport');
    if ((instValKind === 'RO' || instValKind === 'Conf') &&
        instValImport === 'true')
        return true;
    // check if allowed to modify based on DataTypeTemplates for first instance
    const rootNode = firstSupervisionLN === null || firstSupervisionLN === void 0 ? void 0 : firstSupervisionLN.ownerDocument;
    const lNodeType = firstSupervisionLN.getAttribute('lnType');
    const lnClass = firstSupervisionLN.getAttribute('lnClass');
    const dObj = rootNode.querySelector(`DataTypeTemplates > LNodeType[id="${lNodeType}"][lnClass="${lnClass}"] > DO[name="${lnClass === 'LGOS' ? 'GoCBRef' : 'SvCBRef'}"]`);
    if (dObj) {
        const dORef = dObj.getAttribute('type');
        const daObj = rootNode.querySelector(`DataTypeTemplates > DOType[id="${dORef}"] > DA[name="setSrcRef"]`);
        if (daObj) {
            return ((daObj.getAttribute('valKind') === 'Conf' ||
                daObj.getAttribute('valKind') === 'RO') &&
                daObj.getAttribute('valImport') === 'true');
        }
    }
    // definition missing
    return false;
}
/**
 * Returns an array with a single Insert Edit to create a new
 * supervision element for the given GOOSE/SMV message and subscriber IED.
 *
 * @param controlBlock The GOOSE or SMV message element
 * @param subscriberIED The subscriber IED
 * @returns an empty array if instantiation is not possible or an array with a single Create action
 */
function instantiateSubscriptionSupervision(controlBlock, subscriberIED) {
    var _a, _b, _c;
    const supervisionType = (controlBlock === null || controlBlock === void 0 ? void 0 : controlBlock.tagName) === 'GSEControl' ? 'LGOS' : 'LSVS';
    if (!controlBlock ||
        !subscriberIED ||
        !isSupervisionAllowed(controlBlock, subscriberIED, supervisionType))
        return [];
    const availableLN = findOrCreateAvailableLNInst(controlBlock, subscriberIED, supervisionType);
    if (!availableLN ||
        !isSupervisionModificationAllowed(subscriberIED, supervisionType))
        return [];
    const edits = [];
    // If creating new LN element
    if (!availableLN.parentElement) {
        const parent = (_a = subscriberIED.querySelector(`LN[lnClass="${supervisionType}"]`)) === null || _a === void 0 ? void 0 : _a.parentElement;
        if (parent) {
            // use Insert edit for supervision LN
            edits.push({
                parent,
                node: availableLN,
                reference: (_c = (_b = parent.querySelector(`LN[lnClass="${supervisionType}"]:last-child`)) === null || _b === void 0 ? void 0 : _b.nextElementSibling) !== null && _c !== void 0 ? _c : null,
            });
        }
    }
    // Insert child elements
    const supervisionName = supervisionType === 'LGOS' ? 'GoCBRef' : 'SvCBRef';
    let doiElement = availableLN.querySelector(`DOI[name="${supervisionName}"]`);
    if (!doiElement) {
        doiElement = subscriberIED.ownerDocument.createElementNS(SCL_NAMESPACE, 'DOI');
        doiElement.setAttribute('name', supervisionName);
        edits.push({
            parent: availableLN,
            reference: null,
            node: doiElement,
        });
    }
    let daiElement = doiElement.querySelector(`DAI[name="setSrcRef"]`);
    if (!daiElement) {
        daiElement = subscriberIED.ownerDocument.createElementNS(SCL_NAMESPACE, 'DAI');
        const srcValRef = subscriberIED.querySelector(`LN[lnClass="${supervisionType}"]>DOI[name="${supervisionName}"]>DAI[name="setSrcRef"]`);
        daiElement.setAttribute('name', 'setSrcRef');
        // transfer valKind and valImport from first supervision instance if present
        if (srcValRef === null || srcValRef === void 0 ? void 0 : srcValRef.hasAttribute('valKind'))
            daiElement.setAttribute('valKind', srcValRef.getAttribute('valKind'));
        if (srcValRef === null || srcValRef === void 0 ? void 0 : srcValRef.hasAttribute('valImport'))
            daiElement.setAttribute('valImport', srcValRef.getAttribute('valImport'));
        edits.push({
            parent: doiElement,
            reference: null,
            node: daiElement,
        });
    }
    const valTextContent = controlBlockReference(controlBlock);
    let valElement = daiElement.querySelector(`Val`);
    if (!valElement) {
        valElement = subscriberIED.ownerDocument.createElementNS(SCL_NAMESPACE, 'Val');
        valElement.textContent = valTextContent;
        edits.push({
            parent: daiElement,
            reference: null,
            node: valElement,
        });
    }
    else {
        edits.push({
            parent: valElement,
            reference: null,
            node: new Text(valTextContent !== null && valTextContent !== void 0 ? valTextContent : 'Unknown Control Block'),
        });
    }
    return edits;
}
/**
 * Update the passed ExtRefElement and set the required attributes on the cloned element
 * depending on the Edition and type of Control Element.
 *
 * @param extRefElement  - The ExtRef Element to update.
 * @param controlElement - `ReportControl`, `GSEControl` or `SampledValueControl` source element
 * @param fcdaElement    - The source data attribute element.
 * @returns An Update Action for the ExtRefElement.
 */
function updateExtRefElement(extRefElement, controlElement, fcdaElement) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const iedName = (_b = (_a = fcdaElement.closest('IED')) === null || _a === void 0 ? void 0 : _a.getAttribute('name')) !== null && _b !== void 0 ? _b : null;
    const [ldInst, prefix, lnClass, lnInst, doName, daName] = [
        'ldInst',
        'prefix',
        'lnClass',
        'lnInst',
        'doName',
        'daName',
    ].map(attr => fcdaElement.getAttribute(attr));
    const [desc, intAddr, pLN, pDO, pDA, pServT] = [
        'desc',
        'intAddr',
        'pLN',
        'pDO',
        'pDA',
        'pServT',
    ].map(attr => extRefElement.getAttribute(attr));
    const schemaVersion = getSclSchemaVersion(fcdaElement.ownerDocument);
    if (schemaVersion === '2003') {
        // Edition 2003(1) does not define serviceType and its MCD attribute starting with srcXXX
        return {
            element: extRefElement,
            attributes: {
                intAddr,
                desc,
                iedName,
                ldInst,
                lnClass,
                lnInst,
                prefix,
                doName,
                daName,
            },
        };
    }
    if (!controlElement || !serviceTypes[controlElement.tagName]) {
        // for invalid control block tag name assume polling
        return {
            element: extRefElement,
            attributes: {
                intAddr,
                desc,
                iedName,
                serviceType: 'Poll',
                ldInst,
                lnClass,
                lnInst,
                prefix,
                doName,
                daName,
            },
        };
    }
    const srcLDInst = (_d = (_c = controlElement.closest('LDevice')) === null || _c === void 0 ? void 0 : _c.getAttribute('inst')) !== null && _d !== void 0 ? _d : '';
    const srcPrefix = (_f = (_e = controlElement.closest('LN0,LN')) === null || _e === void 0 ? void 0 : _e.getAttribute('prefix')) !== null && _f !== void 0 ? _f : '';
    const srcLNClass = (_h = (_g = controlElement.closest('LN0,LN')) === null || _g === void 0 ? void 0 : _g.getAttribute('lnClass')) !== null && _h !== void 0 ? _h : '';
    const srcLNInst = (_j = controlElement.closest('LN0,LN')) === null || _j === void 0 ? void 0 : _j.getAttribute('inst');
    const srcCBName = (_k = controlElement.getAttribute('name')) !== null && _k !== void 0 ? _k : '';
    if (schemaVersion === '2007B') {
        return {
            element: extRefElement,
            attributes: {
                intAddr,
                desc,
                iedName,
                serviceType: serviceTypes[controlElement.tagName],
                ldInst,
                lnClass,
                lnInst,
                prefix,
                doName,
                daName,
                srcLDInst,
                srcPrefix,
                srcLNClass,
                ...(srcLNInst && { srcLNInst }),
                srcCBName,
            },
        };
    }
    // We must be on schemaVersion 2007B4 or later
    // We should ensure that that the pXX fields are transferred if present
    return {
        element: extRefElement,
        attributes: {
            intAddr,
            desc,
            iedName,
            serviceType: serviceTypes[controlElement.tagName],
            ldInst,
            lnClass,
            lnInst,
            prefix,
            doName,
            daName,
            srcLDInst,
            srcPrefix,
            srcLNClass,
            ...(srcLNInst && { srcLNInst }),
            srcCBName,
            ...(pLN && { pLN }),
            ...(pDO && { pDO }),
            ...(pDA && { pDA }),
            ...(pServT && { pServT }),
        },
    };
}
function canRemoveSubscriptionSupervision(subscribedExtRef) {
    var _a, _b;
    const [srcCBName, srcLDInst, srcLNClass, iedName, srcPrefix, srcLNInst] = [
        'srcCBName',
        'srcLDInst',
        'srcLNClass',
        'iedName',
        'srcPrefix',
        'srcLNInst',
    ].map(attr => subscribedExtRef.getAttribute(attr));
    return !Array.from((_b = (_a = subscribedExtRef.closest('IED')) === null || _a === void 0 ? void 0 : _a.getElementsByTagName('ExtRef')) !== null && _b !== void 0 ? _b : [])
        .filter(isPublic)
        .some(extRef => {
        var _a, _b, _c, _d, _e, _f;
        return ((_a = extRef.getAttribute('srcCBName')) !== null && _a !== void 0 ? _a : '') === (srcCBName !== null && srcCBName !== void 0 ? srcCBName : '') &&
            ((_b = extRef.getAttribute('srcLDInst')) !== null && _b !== void 0 ? _b : '') === (srcLDInst !== null && srcLDInst !== void 0 ? srcLDInst : '') &&
            ((_c = extRef.getAttribute('srcLNClass')) !== null && _c !== void 0 ? _c : '') === (srcLNClass !== null && srcLNClass !== void 0 ? srcLNClass : '') &&
            ((_d = extRef.getAttribute('iedName')) !== null && _d !== void 0 ? _d : '') === (iedName !== null && iedName !== void 0 ? iedName : '') &&
            ((_e = extRef.getAttribute('srcPrefix')) !== null && _e !== void 0 ? _e : '') === (srcPrefix !== null && srcPrefix !== void 0 ? srcPrefix : '') &&
            ((_f = extRef.getAttribute('srcLNInst')) !== null && _f !== void 0 ? _f : '') === (srcLNInst !== null && srcLNInst !== void 0 ? srcLNInst : '') &&
            extRef !== subscribedExtRef;
    });
}
/**
 * Return an array with a single Remove action to delete the supervision element
 * for the given GOOSE/SMV message and subscriber IED.
 *
 * @param controlBlock The GOOSE or SMV message element
 * @param subscriberIED The subscriber IED
 * @returns an empty array if removing the supervision is not possible or an array
 * with a single Delete action that removes the LN if it was created in OpenSCD
 * or only the supervision structure DOI/DAI/Val if it was created by the user.
 */
function removeSubscriptionSupervision(controlBlock, subscriberIED) {
    if (!controlBlock || !subscriberIED)
        return [];
    const valElement = getSupervisionCbRefs(subscriberIED, controlBlock.tagName).find(val => val.textContent === controlBlockReference(controlBlock));
    if (!valElement)
        return [];
    const lnElement = valElement.closest('LN0, LN');
    if (!lnElement || !lnElement.parentElement)
        return [];
    // Check if that one has been created by OpenSCD (private section exists)
    const isOpenScdCreated = lnElement.querySelector('Private[type="OpenSCD.create"]');
    return isOpenScdCreated
        ? [
            {
                node: lnElement,
            },
        ]
        : [
            {
                node: valElement.closest('DOI'),
            },
        ];
}
function getOrderedIeds(doc) {
    return doc
        ? Array.from(doc.querySelectorAll(':root > IED')).sort((a, b) => compareNames(a, b))
        : [];
}
/**
 * Returns the used supervision LN instances for a given service type.
 *
 * @param doc - SCL document.
 * @param serviceType - either GOOSE or SMV.
 * @returns - array of Elements of supervision LN instances.
 */
function getUsedSupervisionInstances(doc, serviceType) {
    if (!doc)
        return [];
    const supervisionType = serviceType === 'GOOSE' ? 'LGOS' : 'LSVS';
    const refSelector = supervisionType === 'LGOS' ? 'DOI[name="GoCBRef"]' : 'DOI[name="SvCBRef"]';
    const supervisionInstances = Array.from(doc.querySelectorAll(`IED LDevice > LN[lnClass="${supervisionType}"]>${refSelector}>DAI[name="setSrcRef"]>Val`))
        .filter(val => val.textContent !== '')
        .map(val => val.closest('LN'));
    return supervisionInstances;
}
function getFcdaSrcControlBlockDescription(extRefElement) {
    const [srcPrefix, srcLDInst, srcLNClass, srcCBName] = [
        'srcPrefix',
        'srcLDInst',
        'srcLNClass',
        'srcCBName',
    ].map(name => { var _a; return (_a = extRefElement.getAttribute(name)) !== null && _a !== void 0 ? _a : ''; });
    return `${srcPrefix ? `${srcPrefix} ` : ''}${srcLDInst} / ${srcLNClass} ${srcCBName}`;
}
function findFCDAs(extRef) {
    if (extRef.tagName !== 'ExtRef' || extRef.closest('Private'))
        return [];
    const [iedName, ldInst, prefix, lnClass, lnInst, doName, daName] = [
        'iedName',
        'ldInst',
        'prefix',
        'lnClass',
        'lnInst',
        'doName',
        'daName',
    ].map(name => extRef.getAttribute(name));
    const ied = Array.from(extRef.ownerDocument.getElementsByTagName('IED')).find(element => element.getAttribute('name') === iedName && !element.closest('Private'));
    if (!ied)
        return [];
    return Array.from(ied.getElementsByTagName('FCDA'))
        .filter(item => !item.closest('Private'))
        .filter(fcda => {
        var _a, _b, _c, _d, _e, _f;
        return ((_a = fcda.getAttribute('ldInst')) !== null && _a !== void 0 ? _a : '') === (ldInst !== null && ldInst !== void 0 ? ldInst : '') &&
            ((_b = fcda.getAttribute('prefix')) !== null && _b !== void 0 ? _b : '') === (prefix !== null && prefix !== void 0 ? prefix : '') &&
            ((_c = fcda.getAttribute('lnClass')) !== null && _c !== void 0 ? _c : '') === (lnClass !== null && lnClass !== void 0 ? lnClass : '') &&
            ((_d = fcda.getAttribute('lnInst')) !== null && _d !== void 0 ? _d : '') === (lnInst !== null && lnInst !== void 0 ? lnInst : '') &&
            ((_e = fcda.getAttribute('doName')) !== null && _e !== void 0 ? _e : '') === (doName !== null && doName !== void 0 ? doName : '') &&
            ((_f = fcda.getAttribute('daName')) !== null && _f !== void 0 ? _f : '') === (daName !== null && daName !== void 0 ? daName : '');
    });
}
function getFcdaElements(controlElement) {
    const lnElement = controlElement.parentElement;
    if (lnElement) {
        return Array.from(lnElement.querySelectorAll(`:scope > DataSet[name=${controlElement.getAttribute('datSet')}] > FCDA`));
    }
    return [];
}
const serviceTypeControlBlockTags = {
    GOOSE: ['GSEControl'],
    SMV: ['SampledValueControl'],
    Report: ['ReportControl'],
    NONE: ['LogControl', 'GSEControl', 'SampledValueControl', 'ReportControl'],
};
/**
 * Locates the control block associated with an ExtRef.
 *
 * @param extRef - SCL ExtRef element
 * @returns - either a GSEControl or SampledValueControl block
 */
function findControlBlock(extRef) {
    var _a, _b;
    const fcdas = findFCDAs(extRef);
    const cbTags = (_b = serviceTypeControlBlockTags[(_a = extRef.getAttribute('serviceType')) !== null && _a !== void 0 ? _a : 'NONE']) !== null && _b !== void 0 ? _b : [];
    const controlBlocks = new Set(fcdas.flatMap(fcda => {
        var _a;
        const dataSet = fcda.parentElement;
        const dsName = (_a = dataSet.getAttribute('name')) !== null && _a !== void 0 ? _a : '';
        const anyLN = dataSet.parentElement;
        return cbTags
            .flatMap(tag => Array.from(anyLN.getElementsByTagName(tag)))
            .filter(cb => {
            var _a, _b, _c, _d, _e;
            if (extRef.getAttribute('srcCBName')) {
                const ln = cb.closest('LN0');
                const lnClass = ln.getAttribute('lnClass');
                const lnPrefix = (_a = ln.getAttribute('prefix')) !== null && _a !== void 0 ? _a : '';
                const lnInst = ln.getAttribute('inst');
                const ld = ln.closest('LDevice');
                const ldInst = ld.getAttribute('inst');
                const cbName = cb.getAttribute('name');
                return (extRef.getAttribute('srcCBName') === cbName &&
                    ((_b = extRef.getAttribute('srcLNInst')) !== null && _b !== void 0 ? _b : '') === lnInst &&
                    ((_c = extRef.getAttribute('srcLNClass')) !== null && _c !== void 0 ? _c : 'LLN0') === lnClass &&
                    ((_d = extRef.getAttribute('srcPrefix')) !== null && _d !== void 0 ? _d : '') === lnPrefix &&
                    ((_e = extRef.getAttribute('srcLDInst')) !== null && _e !== void 0 ? _e : extRef.getAttribute('ldInst')) === ldInst);
            }
            return cb.getAttribute('datSet') === dsName;
        });
    }));
    return controlBlocks.values().next().value;
}
/**
 * Given an ExtRef SCL element, will locate the FCDA within the correct dataset the subscription comes from.
 * @param extRef  - SCL ExtRef Element.
 * @param controlBlock  - SCL GSEControl or SampledValueControl associated with the ExtRef.
 * @returns - SCL FCDA element
 */
function findFCDA(extRef, controlBlock) {
    var _a;
    if (extRef.tagName !== 'ExtRef' || extRef.closest('Private'))
        return null;
    const [iedName, ldInst, prefix, lnClass, lnInst, doName, daName] = [
        'iedName',
        'ldInst',
        'prefix',
        'lnClass',
        'lnInst',
        'doName',
        'daName',
    ].map(name => extRef.getAttribute(name));
    const ied = Array.from(extRef.ownerDocument.getElementsByTagName('IED')).find(element => element.getAttribute('name') === iedName && !element.closest('Private'));
    if (!ied)
        return null;
    const dataSetRef = controlBlock.getAttribute('datSet');
    const candidateFCDAs = Array.from(ied.getElementsByTagName('FCDA'))
        .filter(item => !item.closest('Private'))
        .filter(fcda => {
        var _a, _b, _c, _d, _e, _f, _g;
        return ((_a = fcda.getAttribute('ldInst')) !== null && _a !== void 0 ? _a : '') === (ldInst !== null && ldInst !== void 0 ? ldInst : '') &&
            ((_b = fcda.getAttribute('prefix')) !== null && _b !== void 0 ? _b : '') === (prefix !== null && prefix !== void 0 ? prefix : '') &&
            ((_c = fcda.getAttribute('lnClass')) !== null && _c !== void 0 ? _c : '') === (lnClass !== null && lnClass !== void 0 ? lnClass : '') &&
            ((_d = fcda.getAttribute('lnInst')) !== null && _d !== void 0 ? _d : '') === (lnInst !== null && lnInst !== void 0 ? lnInst : '') &&
            ((_e = fcda.getAttribute('doName')) !== null && _e !== void 0 ? _e : '') === (doName !== null && doName !== void 0 ? doName : '') &&
            ((_f = fcda.getAttribute('daName')) !== null && _f !== void 0 ? _f : '') === (daName !== null && daName !== void 0 ? daName : '') &&
            ((_g = fcda.parentElement) === null || _g === void 0 ? void 0 : _g.getAttribute('name')) === dataSetRef;
    });
    return (_a = candidateFCDAs[0]) !== null && _a !== void 0 ? _a : null;
}

const pathsSVG = {
    gooseIcon: b `<path d="M11,7H15V9H11V15H13V11H15V15A2,2 0 0,1 13,17H11A2,2 0 0,1 9,15V9A2,2 0 0,1 11,7M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z" />`,
    smvIcon: b `'<path d="M11,7H15V9H11V11H13A2,2 0 0,1 15,13V15A2,2 0 0,1 13,17H9V15H13V13H11A2,2 0 0,1 9,11V9A2,2 0 0,1 11,7M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z" />`,
};
const gooseIcon = b `<svg style="width:24px;height:24px" viewBox="0 0 24 24">${pathsSVG.gooseIcon}</svg>`;
const smvIcon = b `<svg style="width:24px;height:24px" viewBox="0 0 24 24">${pathsSVG.smvIcon}</svg>`;
const gooseActionIcon = b `<svg slot="onIcon" viewBox="0 0 24 24">${pathsSVG.gooseIcon}</svg>`;
const smvActionIcon = b `<svg slot="offIcon" viewBox="0 0 24 24">${pathsSVG.smvIcon}</svg>`;

const iconControlLookup = {
    SampledValueControl: smvIcon,
    GSEControl: gooseIcon,
};
const serviceTypeLookup = {
    GSEControl: 'GOOSE',
    SampledValueControl: 'SMV',
};
const storedProperties = [
    'subscriberView',
    'controlTag',
    'hideSubscribed',
    'hideNotSubscribed',
    'hideDataObjects',
    'hidePreconfiguredNotMatching',
    'notAutoIncrement',
    'notChangeSupervisionLNs',
    'hideBound',
    'hideNotBound',
    'strictServiceTypes',
];
function trimIdentityParent(idString) {
    return idString.split('>').slice(1).join('>').trim().slice(1);
}
function extRefPath(extRef) {
    var _a;
    if (!extRef)
        return 'Unknown';
    const lN = (_a = extRef.closest('LN')) !== null && _a !== void 0 ? _a : extRef.closest('LN0');
    const lDevice = lN.closest('LDevice');
    const ldInst = lDevice === null || lDevice === void 0 ? void 0 : lDevice.getAttribute('inst');
    const lnPrefix = lN === null || lN === void 0 ? void 0 : lN.getAttribute('prefix');
    const lnClass = lN === null || lN === void 0 ? void 0 : lN.getAttribute('lnClass');
    const lnInst = lN === null || lN === void 0 ? void 0 : lN.getAttribute('inst');
    return [ldInst, '/', lnPrefix, lnClass, lnInst].filter(a => !!a).join(' ');
}
// TODO: This needs careful review!
function getFcdaInstDesc(fcda, includeDai) {
    var _a, _b;
    const [doName, daName] = ['doName', 'daName'].map(attr => fcda.getAttribute(attr));
    const ied = fcda.closest('IED');
    const anyLn = Array.from((_a = ied === null || ied === void 0 ? void 0 : ied.querySelectorAll(`LDevice[inst="${fcda.getAttribute('ldInst')}"] > LN, LDevice[inst="${fcda.getAttribute('ldInst')}"] LN0`)) !== null && _a !== void 0 ? _a : []).find(lN => {
        var _a, _b, _c, _d, _e, _f;
        return ((_a = lN.getAttribute('prefix')) !== null && _a !== void 0 ? _a : '') ===
            ((_b = fcda.getAttribute('prefix')) !== null && _b !== void 0 ? _b : '') &&
            ((_c = lN.getAttribute('lnClass')) !== null && _c !== void 0 ? _c : '') ===
                ((_d = fcda.getAttribute('lnClass')) !== null && _d !== void 0 ? _d : '') &&
            ((_e = lN.getAttribute('inst')) !== null && _e !== void 0 ? _e : '') === ((_f = fcda.getAttribute('lnInst')) !== null && _f !== void 0 ? _f : '');
    });
    if (!anyLn)
        return [];
    const descs = [];
    descs.push((_b = anyLn.closest('LDevice')) === null || _b === void 0 ? void 0 : _b.getAttribute('desc'));
    descs.push(anyLn.getAttribute('desc'));
    const doNames = doName.split('.');
    const doi = anyLn.querySelector(`DOI[name="${doNames[0]}"`);
    if (!doi)
        return descs.filter(d => d !== null && d !== undefined);
    descs.push(doi === null || doi === void 0 ? void 0 : doi.getAttribute('desc'));
    let previousDI = doi;
    doNames.slice(1).forEach(sdiName => {
        const sdi = previousDI.querySelector(`SDI[name="${sdiName}"]`);
        if (sdi)
            previousDI = sdi;
        descs.push(sdi === null || sdi === void 0 ? void 0 : sdi.getAttribute('desc'));
    });
    if (!includeDai || !daName)
        return descs.filter(d => d !== null && d !== undefined);
    const daNames = daName === null || daName === void 0 ? void 0 : daName.split('.');
    const dai = previousDI.querySelector(`DAI[name="${daNames[0]}"]`);
    descs.push(dai === null || dai === void 0 ? void 0 : dai.getAttribute('desc'));
    return descs.filter(d => d !== null && d !== undefined);
}
function getLnTitle(childElement) {
    var _a;
    if (!childElement)
        return 'Unknown';
    const lN = (_a = childElement.closest('LN')) !== null && _a !== void 0 ? _a : childElement.closest('LN0');
    const lDevice = lN.closest('LDevice');
    const ldInst = lDevice === null || lDevice === void 0 ? void 0 : lDevice.getAttribute('inst');
    const lnPrefix = lN === null || lN === void 0 ? void 0 : lN.getAttribute('prefix');
    const lnClass = lN === null || lN === void 0 ? void 0 : lN.getAttribute('lnClass');
    const lnInst = lN === null || lN === void 0 ? void 0 : lN.getAttribute('inst');
    return [ldInst, '/', lnPrefix, lnClass, lnInst]
        .filter(a => a !== null)
        .join(' ');
}
class SubscriberLaterBinding extends s$1 {
    constructor() {
        super(...arguments);
        this.controlBlockFcdaInfo = new Map();
        this.fcdaInfo = new Map();
        this.extRefInfo = new Map();
        this.supervisionData = new Map();
    }
    storeSettings() {
        const storedConfiguration = {
            subscriberView: this.switchViewUI.on,
            controlTag: this.switchControlTypeUI.on
                ? 'GSEControl'
                : 'SampledValueControl',
            hideSubscribed: this.hideSubscribed,
            hideNotSubscribed: this.hideNotSubscribed,
            hideDataObjects: this.hideDataObjects,
            hidePreconfiguredNotMatching: this.hidePreconfiguredNotMatching,
            notAutoIncrement: this.notAutoIncrement,
            notChangeSupervisionLNs: this.notChangeSupervisionLNs,
            hideBound: this.hideBound,
            hideNotBound: this.hideNotBound,
            strictServiceTypes: this.strictServiceTypes,
        };
        localStorage.setItem('oscd-subscriber-later-binding', JSON.stringify(storedConfiguration));
    }
    restoreSettings() {
        var _a, _b, _c, _d, _e, _f, _g;
        const storedSettings = localStorage.getItem('oscd-subscriber-later-binding');
        const storedConfiguration = storedSettings
            ? JSON.parse(storedSettings)
            : undefined;
        this.subscriberView = (_a = storedConfiguration === null || storedConfiguration === void 0 ? void 0 : storedConfiguration.subscriberView) !== null && _a !== void 0 ? _a : false;
        this.controlTag = (_b = storedConfiguration === null || storedConfiguration === void 0 ? void 0 : storedConfiguration.controlTag) !== null && _b !== void 0 ? _b : 'GSEControl';
        this.hideSubscribed = (storedConfiguration === null || storedConfiguration === void 0 ? void 0 : storedConfiguration.hideSubscribed) || false;
        this.hideNotSubscribed = (storedConfiguration === null || storedConfiguration === void 0 ? void 0 : storedConfiguration.hideNotSubscribed) || false;
        this.hideDataObjects = (storedConfiguration === null || storedConfiguration === void 0 ? void 0 : storedConfiguration.hideDataObjects) || false;
        this.hidePreconfiguredNotMatching =
            (storedConfiguration === null || storedConfiguration === void 0 ? void 0 : storedConfiguration.hidePreconfiguredNotMatching) || false;
        this.notAutoIncrement = (_c = storedConfiguration === null || storedConfiguration === void 0 ? void 0 : storedConfiguration.notAutoIncrement) !== null && _c !== void 0 ? _c : false;
        this.notChangeSupervisionLNs =
            (_d = storedConfiguration === null || storedConfiguration === void 0 ? void 0 : storedConfiguration.notChangeSupervisionLNs) !== null && _d !== void 0 ? _d : false;
        this.hideBound = (_e = storedConfiguration === null || storedConfiguration === void 0 ? void 0 : storedConfiguration.hideBound) !== null && _e !== void 0 ? _e : false;
        this.hideNotBound = (_f = storedConfiguration === null || storedConfiguration === void 0 ? void 0 : storedConfiguration.hideNotBound) !== null && _f !== void 0 ? _f : false;
        this.strictServiceTypes = (_g = storedConfiguration === null || storedConfiguration === void 0 ? void 0 : storedConfiguration.strictServiceTypes) !== null && _g !== void 0 ? _g : false;
    }
    getControlElements(controlTag) {
        if (this.doc) {
            return Array.from(this.doc.querySelectorAll(`LN0 > ${controlTag}`)).filter(control => {
                var _a;
                return !this.subscriberView ||
                    !this.currentSelectedExtRefElement ||
                    control.closest('IED') !==
                        ((_a = this.currentSelectedExtRefElement) === null || _a === void 0 ? void 0 : _a.closest('IED'));
            });
        }
        return [];
    }
    getExtRefCount(fcdaElement, controlElement) {
        const controlBlockFcdaId = `${identity(controlElement)} ${identity(fcdaElement)}`;
        if (!this.controlBlockFcdaInfo.has(controlBlockFcdaId)) {
            const extRefCount = getSubscribedExtRefElements(this.doc.getRootNode(), this.controlTag, fcdaElement, controlElement, true // TODO: do we need this?
            ).length;
            this.controlBlockFcdaInfo.set(controlBlockFcdaId, extRefCount);
        }
        return this.controlBlockFcdaInfo.get(controlBlockFcdaId);
    }
    getFcdaInfo(fcdaElement) {
        const id = `${identity(fcdaElement)}`;
        if (!this.fcdaInfo.has(id)) {
            const spec = fcdaSpecification(fcdaElement);
            const desc = getFcdaInstDesc(fcdaElement, true);
            this.fcdaInfo.set(id, { spec, desc });
        }
        return this.fcdaInfo.get(id);
    }
    getExtRefInfo(extRefElement) {
        const id = `${identity(extRefElement)}`;
        if (!this.extRefInfo.has(id)) {
            const spec = inputRestriction(extRefElement);
            this.extRefInfo.set(id, { spec });
        }
        return this.extRefInfo.get(id);
    }
    updated(_changedProperties) {
        super.updated(_changedProperties);
        // When a new document is loaded or we do a subscription/we will reset the Map to clear old entries.
        // TODO: Be able to detect the same document loaded twice, currently lack a way to check for this
        // https://github.com/openscd/open-scd-core/issues/92
        if (_changedProperties.has('docName')) {
            // reset caching
            this.controlBlockFcdaInfo = new Map();
            this.fcdaInfo = new Map();
            this.extRefInfo = new Map();
            this.currentSelectedControlElement = undefined;
            this.currentSelectedFcdaElement = undefined;
            this.currentSelectedExtRefElement = undefined;
            // reset supervision cache
            this.reCreateSupervisionCache();
            // deselect in UI
            if (this.extRefListSubscriberSelectedUI) {
                this.extRefListSubscriberSelectedUI.selected = false;
                this.extRefListSubscriberSelectedUI.activated = false;
            }
            if (this.fcdaListSelectedUI) {
                this.fcdaListSelectedUI.selected = false;
                this.fcdaListSelectedUI.activated = false;
            }
        }
        if (_changedProperties.has('subscriberView')) {
            // re-attach anchors
            this.updateView();
        }
        const settingsUpdateRequired = Array.from(_changedProperties.keys()).some(r => storedProperties.includes(r.toString()));
        if (settingsUpdateRequired)
            this.storeSettings();
    }
    /**
     * Unsubscribing means removing a list of attributes from the ExtRef Element.
     *
     * @param extRef - The Ext Ref Element to clean from attributes.
     */
    unsubscribe(extRef) {
        const editActions = [];
        editActions.push({
            element: extRef,
            attributes: {
                intAddr: extRef.getAttribute('intAddr'),
                desc: extRef.getAttribute('desc'),
                iedName: null,
                ldInst: null,
                prefix: null,
                lnClass: null,
                lnInst: null,
                doName: null,
                daName: null,
                serviceType: extRef.getAttribute('serviceType'),
                srcLDInst: null,
                srcPrefix: null,
                srcLNClass: null,
                srcLNInst: null,
                srcCBName: null,
            },
        });
        const subscriberIed = extRef.closest('IED');
        let controlBlockElement;
        let fcdaElement;
        if (this.subscriberView) {
            controlBlockElement = findControlBlock(extRef);
            // invalid mappings may not have a control block but can still be removed
            if (controlBlockElement)
                fcdaElement = findFCDA(extRef, controlBlockElement);
        }
        else {
            controlBlockElement = this.currentSelectedControlElement;
            fcdaElement = this.currentSelectedFcdaElement;
        }
        if (!this.notChangeSupervisionLNs &&
            canRemoveSubscriptionSupervision(extRef))
            editActions.push(...removeSubscriptionSupervision(controlBlockElement, subscriberIed));
        if (controlBlockElement && fcdaElement) {
            const controlBlockFcdaId = `${identity(controlBlockElement)} ${identity(fcdaElement)}`;
            this.controlBlockFcdaInfo.delete(controlBlockFcdaId);
        }
        this.dispatchEvent(newEditEvent(editActions));
        if (!this.notChangeSupervisionLNs)
            this.reCreateSupervisionCache();
    }
    /**
     * Subscribing means copying a list of attributes from the FCDA Element (and others) to the ExtRef Element.
     *
     * @param extRef - The ExtRef Element to add the attributes to.
     */
    subscribe(extRef, controlElement, fcdaElement) {
        const updateEdit = updateExtRefElement(extRef, controlElement, fcdaElement);
        const subscriberIed = extRef.closest('IED');
        let supervisionActions = [];
        if (!this.notChangeSupervisionLNs)
            supervisionActions = instantiateSubscriptionSupervision(controlElement, subscriberIed);
        this.dispatchEvent(newEditEvent([updateEdit, ...supervisionActions]));
        const controlBlockFcdaId = `${identity(controlElement)} ${identity(fcdaElement)}`;
        this.controlBlockFcdaInfo.delete(controlBlockFcdaId);
        if (!this.notChangeSupervisionLNs)
            this.reCreateSupervisionCache();
    }
    getSubscribedExtRefElements() {
        return getSubscribedExtRefElements(this.doc.getRootNode(), this.controlTag, this.currentSelectedFcdaElement, this.currentSelectedControlElement, true);
    }
    isExtRefViewable(extRefElement) {
        return (extRefElement.hasAttribute('intAddr') &&
            ((!this.strictServiceTypes &&
                !extRefElement.hasAttribute('serviceType') &&
                !extRefElement.hasAttribute('pServT')) ||
                extRefElement.getAttribute('serviceType') ===
                    serviceTypeLookup[this.controlTag] ||
                extRefElement.getAttribute('pServT') ===
                    serviceTypeLookup[this.controlTag]));
    }
    getAvailableExtRefElements() {
        return getExtRefElements(this.doc.getRootNode(), this.currentSelectedFcdaElement, true).filter(extRefElement => (!isSubscribed(extRefElement) ||
            !findFCDAs$1(extRefElement).find(x => x !== undefined)) &&
            this.isExtRefViewable(extRefElement));
    }
    reCreateSupervisionCache() {
        this.supervisionData = new Map();
        const supervisionType = serviceTypeLookup[this.controlTag] === 'GOOSE' ? 'LGOS' : 'LSVS';
        const refSelector = supervisionType === 'LGOS'
            ? 'DOI[name="GoCBRef"]'
            : 'DOI[name="SvCBRef"]';
        getUsedSupervisionInstances(this.doc, serviceTypeLookup[this.controlTag]).forEach(supervisionLN => {
            var _a;
            const cbRef = supervisionLN.querySelector(`${refSelector}>DAI[name="setSrcRef"]>Val`);
            const iedName = supervisionLN.closest('IED').getAttribute('name');
            if (cbRef)
                this.supervisionData.set(`${iedName} ${(_a = cbRef.textContent) !== null && _a !== void 0 ? _a : ''}`, supervisionLN);
        });
    }
    // eslint-disable-next-line class-methods-use-this
    getExtRefElementsByIED(ied) {
        return Array.from(ied.querySelectorAll(':scope > AccessPoint > Server > LDevice > LN > Inputs > ExtRef, :scope > AccessPoint > Server > LDevice > LN0 > Inputs > ExtRef')).filter(extRefElement => this.isExtRefViewable(extRefElement));
    }
    getCachedSupervision(extRefElement) {
        const iedName = extRefElement.closest('IED').getAttribute('name');
        const cbRefKey = getCbReference(extRefElement);
        return this.supervisionData.get(`${iedName} ${cbRefKey}`);
    }
    updateView() {
        if (this.subscriberView) {
            this.filterMenuExtRefSubscriberUI.anchor = (this.filterMenuExtRefSubscriberButtonUI);
            this.filterMenuExtRefSubscriberUI.addEventListener('closed', () => {
                this.hideBound = !(this.filterMenuExtRefSubscriberUI.index).has(0);
                this.hideNotBound = !(this.filterMenuExtRefSubscriberUI.index).has(1);
                this.strictServiceTypes = !(this.filterMenuExtRefSubscriberUI.index).has(2);
            });
            this.settingsMenuExtRefSubscriberUI.anchor = (this.settingsMenuExtRefSubscriberButtonUI);
            this.settingsMenuExtRefSubscriberUI.addEventListener('closed', () => {
                this.notAutoIncrement = !(this.settingsMenuExtRefSubscriberUI.index).has(0);
                this.notChangeSupervisionLNs = !(this.settingsMenuExtRefSubscriberUI.index).has(1);
            });
        }
        else {
            this.filterMenuExtRefPublisherUI.anchor = (this.filterMenuExtrefPublisherButtonUI);
            this.filterMenuExtRefPublisherUI.addEventListener('closed', () => {
                this.strictServiceTypes = !(this.filterMenuExtRefPublisherUI.index).has(0);
                this.hidePreconfiguredNotMatching = !(this.filterMenuExtRefPublisherUI.index).has(1);
            });
            this.settingsMenuExtRefPublisherUI.anchor = (this.settingsMenuExtRefPublisherButtonUI);
            this.settingsMenuExtRefPublisherUI.addEventListener('closed', () => {
                this.notChangeSupervisionLNs = !(this.settingsMenuExtRefPublisherUI.index).has(0);
            });
        }
    }
    connectedCallback() {
        super.connectedCallback();
        this.restoreSettings();
    }
    async firstUpdated() {
        this.filterMenuFcdaUI.anchor = this.filterMenuFcdaButtonUI;
        this.filterMenuFcdaUI.addEventListener('closed', () => {
            this.hideSubscribed = !this.filterMenuFcdaUI.index.has(0);
            this.hideNotSubscribed = !this.filterMenuFcdaUI.index.has(1);
            this.hideDataObjects = !this.filterMenuFcdaUI.index.has(2);
            if (this.subscriberView)
                this.hidePreconfiguredNotMatching = !(this.filterMenuFcdaUI.index).has(3);
        });
        // update other anchors, especially filterMenuExtRefPublisherUI and
        // settingsMenuExtRefPublisherUI
        this.updateView();
        // if (this.filterMenuExtRefPublisherUI) {
        //   this.filterMenuExtRefPublisherUI.anchor = <HTMLElement>(
        //     this.filterMenuExtrefPublisherButtonUI
        //   );
        //   // TODO: Code duplication with the above
        //   this.filterMenuExtRefPublisherUI.addEventListener('closed', () => {
        //     this.strictServiceTypes = !(<Set<number>>(
        //       this.filterMenuExtRefPublisherUI.index
        //     )).has(0);
        //     this.hidePreconfiguredNotMatching = !(<Set<number>>(
        //       this.filterMenuExtRefPublisherUI.index
        //     )).has(1);
        //   });
        // }
        // if (this.settingsMenuExtRefPublisherUI) {
        //   this.settingsMenuExtRefPublisherUI.anchor = <HTMLElement>(
        //     this.settingsMenuExtRefPublisherButtonUI
        //   );
        //   this.settingsMenuExtRefPublisherUI.addEventListener('closed', () => {
        //     this.notChangeSupervisionLNs = !(<Set<number>>(
        //       this.settingsMenuExtRefPublisherUI.index
        //     )).has(0);
        //   });
        // }
        this.requestUpdate();
        await this.updateComplete;
    }
    // eslint-disable-next-line class-methods-use-this
    renderSubscribedExtRefElement(extRefElement) {
        var _a, _b;
        const supervisionNode = getExistingSupervision(extRefElement);
        const { spec } = this.getExtRefInfo(extRefElement);
        const desc = getDescriptionAttribute(extRefElement);
        return x ` <mwc-list-item
      graphic="large"
      ?hasMeta=${supervisionNode !== null}
      ?twoline=${desc || supervisionNode}
      class="extref"
      value="${identity(extRefElement)}"
      data-extref="${identity(extRefElement)}"
      title="${spec.cdc && spec.bType
            ? `CDC: ${(_a = spec.cdc) !== null && _a !== void 0 ? _a : '?'}\nBasic Type: ${(_b = spec.bType) !== null && _b !== void 0 ? _b : '?'}`
            : ''}"
    >
      <span
        >${identity(extRefElement.parentElement)}
        ${extRefElement.getAttribute('intAddr')}
      </span>
      <span slot="secondary"
        >${desc}${supervisionNode !== null
            ? ` (${identity(supervisionNode)})`
            : ''}</span
      >
      <mwc-icon slot="graphic">link</mwc-icon>
      ${supervisionNode !== null
            ? x `<mwc-icon title="${identity(supervisionNode)}" slot="meta"
            >monitor_heart</mwc-icon
          >`
            : A}
    </mwc-list-item>`;
    }
    /**
     * Check data consistency of source `FCDA` and sink `ExtRef` based on
     * `ExtRef`'s `pLN`, `pDO`, `pDA` and `pServT` attributes.
     * Consistent means `CDC` and `bType` of both ExtRef and FCDA is equal.
     * In case
     *  - `pLN`, `pDO`, `pDA` or `pServT` attributes are not present, allow subscribing
     *  - no CDC or bType can be extracted, do not allow subscribing
     *
     * @param extRef - The `ExtRef` Element to check against
     * @param fcdaElement - The SCL `FCDA` element within the DataSet
     * @param controlElement - The control element associated with the `FCDA` `DataSet`
     */
    nonMatchingExtRefElement(extRef, fcdaElement, controlElement) {
        if (!extRef)
            return false;
        // Vendor does not provide data for the check
        if (!extRef.hasAttribute('pLN') ||
            !extRef.hasAttribute('pDO') ||
            !extRef.hasAttribute('pDA') ||
            !extRef.hasAttribute('pServT'))
            return false;
        // Not ready for any kind of subscription
        if (!fcdaElement)
            return true;
        const fcda = this.getFcdaInfo(fcdaElement).spec;
        const input = this.getExtRefInfo(extRef).spec;
        if (fcda.cdc === null && input.cdc === null)
            return true;
        if (fcda.bType === null && input.bType === null)
            return true;
        if (serviceTypeLookup[controlElement.tagName] !== extRef.getAttribute('pServT'))
            return true;
        return fcda.cdc !== input.cdc || fcda.bType !== input.bType;
    }
    isFcdaDisabled(fcdaElement, controlElement, withFilter = false) {
        // If daName is missing, we have an FCDO which is not currently supported
        // TODO: Remove this and actually support FCDOs
        const isFcdo = !fcdaElement.getAttribute('daName');
        const isPreconfiguredNotMatching = this.subscriberView &&
            this.nonMatchingExtRefElement(this.currentSelectedExtRefElement, fcdaElement, controlElement);
        const disabledFcdo = (isFcdo && !withFilter) || (withFilter && isFcdo && this.hideDataObjects);
        const disablePreconfigured = (isPreconfiguredNotMatching && !withFilter) ||
            (withFilter &&
                isPreconfiguredNotMatching &&
                this.hidePreconfiguredNotMatching);
        return disabledFcdo || disablePreconfigured;
    }
    renderFCDA(controlElement, fcdaElement) {
        var _a;
        const fcdaCount = this.getExtRefCount(fcdaElement, controlElement);
        const isDisabled = this.isFcdaDisabled(fcdaElement, controlElement);
        const filterClasses = {
            'show-subscribed': fcdaCount !== 0,
            'show-not-subscribed': fcdaCount === 0,
            'show-data-objects': !fcdaElement.getAttribute('daName'),
            'show-pxx-mismatch': this.subscriberView &&
                this.nonMatchingExtRefElement(this.currentSelectedExtRefElement, fcdaElement, controlElement),
        };
        const { spec, desc } = this.getFcdaInfo(fcdaElement);
        const fcdaDesc = desc.join(' > ');
        return x `<mwc-list-item
      graphic="large"
      ?hasMeta=${fcdaCount !== 0}
      ?disabled=${isDisabled}
      ?twoline=${fcdaDesc !== ''}
      class="fcda ${o(filterClasses)}"
      data-control="${identity(controlElement)}"
      data-fcda="${identity(fcdaElement)}"
      value="${identity(controlElement)}
             ${identity(fcdaElement)}"
      title="CDC: ${(_a = spec.cdc) !== null && _a !== void 0 ? _a : '?'}
Basic Type: ${spec.bType}"
    >
      <span
        >${getFcdaOrExtRefSubtitleValue(fcdaElement)}
        ${getFcdaOrExtRefTitleValue(fcdaElement)}
      </span>
      <span slot="secondary"> ${fcdaDesc}</span>
      <mwc-icon slot="graphic">subdirectory_arrow_right</mwc-icon>
      ${fcdaCount !== 0 ? x `<span slot="meta">${fcdaCount}</span>` : A}
    </mwc-list-item>`;
    }
    renderFCDAListTitle() {
        const menuClasses = {
            'filter-off': this.hideSubscribed ||
                this.hideNotSubscribed ||
                this.hideDataObjects ||
                (this.hidePreconfiguredNotMatching && this.subscriberView),
        };
        return x `
      <h1>
        ${this.renderControlTypeSelector()}
        ${this.controlTag === 'SampledValueControl'
            ? msg('Publisher Sampled Value Messages')
            : msg('Publisher GOOSE Messages')}
        <mwc-icon-button
          id="filterFcdaIcon"
          class="${o(menuClasses)}"
          icon="filter_list"
          @click=${() => {
            if (!this.filterMenuFcdaUI.open)
                this.filterMenuFcdaUI.show();
        }}
        ></mwc-icon-button>
        <mwc-menu
          id="filterFcdaMenu"
          multi
          corner="BOTTOM_RIGHT"
          menuCorner="END"
        >
          <mwc-check-list-item
            class="filter-subscribed"
            left
            ?selected=${!this.hideSubscribed}
          >
            <span>${msg('Subscribed')}</span>
          </mwc-check-list-item>
          <mwc-check-list-item
            class="filter-not-subscribed"
            left
            ?selected=${!this.hideNotSubscribed}
          >
            <span>${msg('Not Subscribed')}</span>
          </mwc-check-list-item>
          <mwc-check-list-item
            class="filter-data-objects"
            left
            ?selected=${!this.hideDataObjects}
          >
            <span>${msg('Show Data Objects')}</span>
          </mwc-check-list-item>
          ${this.subscriberView
            ? x `<mwc-check-list-item
                class="filter-preconfigured"
                left
                ?selected=${!this.hidePreconfiguredNotMatching}
              >
                <span
                  >${msg('Show Non-Matching Preconfigured')}</span
                ></mwc-check-list-item
              >`
            : A}
        </mwc-menu>
      </h1>
    `;
    }
    renderControlList(controlElements) {
        const filteredListClasses = {
            'show-subscribed': !this.hideSubscribed,
            'show-not-subscribed': !this.hideNotSubscribed,
            'show-pxx-mismatch': !this.hidePreconfiguredNotMatching,
            'show-data-objects': !this.hideDataObjects,
        };
        return x `<oscd-filtered-list
      id="fcdaList"
      ?activatable=${!this.subscriberView}
      class="styled-scrollbars ${o(filteredListClasses)}"
      @selected="${async (ev) => {
            var _a, _b, _c;
            const selectedListItem = ev.target.selected;
            if (!selectedListItem)
                return;
            const { control, fcda } = selectedListItem.dataset;
            this.currentSelectedControlElement =
                (_a = this.doc.querySelector(selector(this.controlTag, control !== null && control !== void 0 ? control : 'Unknown'))) !== null && _a !== void 0 ? _a : undefined;
            this.currentSelectedFcdaElement =
                (_b = this.doc.querySelector(selector('FCDA', fcda !== null && fcda !== void 0 ? fcda : 'Unknown'))) !== null && _b !== void 0 ? _b : undefined;
            // only continue if conditions for subscription met
            if (!(this.subscriberView &&
                this.currentSelectedControlElement &&
                this.currentSelectedFcdaElement &&
                this.currentSelectedExtRefElement)) {
                // in the subscriber view if an FCDA is selected, deactivate it
                // so that when it is re-selected it will trigger an event
                if (this.subscriberView) {
                    selectedListItem.selected = false;
                    selectedListItem.activated = false;
                }
                // conditions for a subscription have not been met
                return;
            }
            this.subscribe(this.currentSelectedExtRefElement, this.currentSelectedControlElement, this.currentSelectedFcdaElement);
            this.currentSelectedExtRefElement = undefined;
            // if incrementing, click on next ExtRef list item if not subscribed
            if (this.extRefListSubscriberSelectedUI && !this.notAutoIncrement) {
                const nextActivatableItem = (this.extRefListSubscriberUI.querySelector('mwc-list-item[activated].extref ~ mwc-list-item.extref'));
                if (nextActivatableItem) {
                    const { extref } = nextActivatableItem.dataset;
                    const nextExtRef = (_c = this.doc.querySelector(selector('ExtRef', extref !== null && extref !== void 0 ? extref : 'Unknown'))) !== null && _c !== void 0 ? _c : undefined;
                    if (nextExtRef && !isSubscribed(nextExtRef)) {
                        nextActivatableItem.click();
                    }
                    else {
                        this.extRefListSubscriberSelectedUI.selected = false;
                        this.extRefListSubscriberSelectedUI.activated = false;
                    }
                }
                else {
                    // next ExtRef is already bound, deselect
                    this.extRefListSubscriberSelectedUI.selected = false;
                    this.extRefListSubscriberSelectedUI.activated = false;
                }
            }
            // deselect ExtRef
            if (this.extRefListSubscriberSelectedUI && this.notAutoIncrement) {
                this.extRefListSubscriberSelectedUI.selected = false;
                this.extRefListSubscriberSelectedUI.activated = false;
            }
            // deselect FCDA
            selectedListItem.selected = false;
            selectedListItem.activated = false;
            // reset state
            this.currentSelectedControlElement = undefined;
            this.currentSelectedFcdaElement = undefined;
        }}"
    >
      ${controlElements
            .filter(controlElement => {
            const fcdaElements = getFcdaElements(controlElement);
            // if disabled (non-matching pXX or DOs) are filtered
            // then don't show them
            const onlyHasDisabledItems = fcdaElements.every(fcda => this.isFcdaDisabled(fcda, controlElement, true));
            return fcdaElements.length && !onlyHasDisabledItems;
        })
            .map(controlElement => {
            var _a;
            const fcdaElements = getFcdaElements(controlElement);
            const someSubscribed = fcdaElements.some(fcda => this.getExtRefCount(fcda, controlElement) !== 0);
            const someNotSubscribed = fcdaElements.some(fcda => this.getExtRefCount(fcda, controlElement) === 0);
            const filterClasses = {
                'show-subscribed': someSubscribed,
                'show-not-subscribed': someNotSubscribed,
            };
            const iedName = (_a = controlElement.closest('IED')) === null || _a === void 0 ? void 0 : _a.getAttribute('name');
            // TODO: Restore wizard editing functionality
            return x `
            <mwc-list-item
              noninteractive
              class="control ${o(filterClasses)}"
              graphic="icon"
              twoline
              hasMeta
              value="${identity(controlElement)}${fcdaElements
                .map(fcdaElement => `
                        ${getFcdaOrExtRefTitleValue(fcdaElement)}
                        ${getFcdaOrExtRefSubtitleValue(fcdaElement)}
                        ${identity(fcdaElement)}`)
                .join('')}"
            >
              <span>${iedName} > ${getNameAttribute(controlElement)} </span>
              <span slot="secondary"
                >${getLnTitle(controlElement)}
                ${getDescriptionAttribute(controlElement)
                ? x ` - ${getDescriptionAttribute(controlElement)}`
                : A}</span
              >
              <mwc-icon slot="graphic"
                >${iconControlLookup[this.controlTag]}</mwc-icon
              >
            </mwc-list-item>
            ${fcdaElements.map(fcdaElement => this.renderFCDA(controlElement, fcdaElement))}
          `;
        })}
    </oscd-filtered-list>`;
    }
    renderPublisherViewSubscribedExtRefs() {
        const subscribedExtRefs = this.getSubscribedExtRefElements();
        return x `
      <mwc-list-item
        noninteractive
        value="${subscribedExtRefs
            .map(extRefElement => `${getDescriptionAttribute(extRefElement)} ${identity(extRefElement)}`)
            .join(' ')}"
      >
        <span>${msg('Subscribed')}</span>
      </mwc-list-item>
      <li divider role="separator"></li>
      ${subscribedExtRefs.length > 0
            ? x `${subscribedExtRefs.map(extRefElement => this.renderSubscribedExtRefElement(extRefElement))}`
            : x `<mwc-list-item graphic="large" noninteractive>
            ${msg('No subscribed inputs')}
          </mwc-list-item>`}
    `;
    }
    renderPublisherViewAvailableExtRefs() {
        const availableExtRefs = this.getAvailableExtRefElements();
        return x `
      <mwc-list-item
        noninteractive
        value="${availableExtRefs
            .map(extRefElement => `${getDescriptionAttribute(extRefElement)} ${identity(extRefElement)}`)
            .join(' ')}"
      >
        <span> ${msg('Available to subscribe')} </span>
      </mwc-list-item>
      <li divider role="separator"></li>
      ${availableExtRefs.length > 0
            ? x `${availableExtRefs.map(extRefElement => {
                var _a, _b;
                const hasMissingMapping = isSubscribed(extRefElement) &&
                    !findFCDAs$1(extRefElement).find(x => x !== undefined);
                const { spec } = this.getExtRefInfo(extRefElement);
                const desc = getDescriptionAttribute(extRefElement);
                const disabledExtRef = this.nonMatchingExtRefElement(extRefElement, this.currentSelectedFcdaElement, this.currentSelectedControlElement);
                return x `<mwc-list-item
              graphic="large"
              ?disabled=${disabledExtRef}
              ?hasMeta=${isPartiallyConfigured(extRefElement) ||
                    hasMissingMapping}
              ?twoline=${desc}
              class="extref ${disabledExtRef ? 'show-pxx-mismatch' : ''}"
              data-extref="${identity(extRefElement)}"
              value="${identity(extRefElement)}"
              title="${spec.cdc && spec.bType
                    ? `CDC: ${(_a = spec.cdc) !== null && _a !== void 0 ? _a : '?'}\nBasic Type: ${(_b = spec.bType) !== null && _b !== void 0 ? _b : '?'}`
                    : ''}"
            >
              <span>
                ${identity(extRefElement.parentElement)}
                ${extRefElement.getAttribute('intAddr')}
              </span>
              <span slot="secondary">${desc}</span>
              <mwc-icon slot="graphic">link_off</mwc-icon>
              ${isPartiallyConfigured(extRefElement)
                    ? x `<mwc-icon
                    slot="meta"
                    class="invalid-mapping"
                    title="${msg('Invalid Mapping')}"
                    >error</mwc-icon
                  >`
                    : A}
              ${hasMissingMapping
                    ? x `<mwc-icon
                    class="missing-mapping"
                    title="${msg('The subscription is valid but the element is not present -- check that IED, control block and dataset are correct.')}"
                    slot="meta"
                    >warning</mwc-icon
                  >`
                    : A}
            </mwc-list-item>`;
            })}`
            : x `<mwc-list-item graphic="large" noninteractive>
            ${msg('No available inputs to subscribe')}
          </mwc-list-item>`}
    `;
    }
    renderPublisherViewExtRefListTitle() {
        const menuClasses = {
            'filter-off': this.strictServiceTypes || this.hidePreconfiguredNotMatching,
        };
        return x `<h1>
      ${msg('Subscriber Inputs')}
      <mwc-menu
        id="filterExtRefMenuPublisher"
        multi
        class="filter-menu"
        corner="BOTTOM_RIGHT"
        menuCorner="END"
      >
        <mwc-check-list-item
          class="show-unspecified-service-types"
          left
          ?selected=${!this.strictServiceTypes}
        >
          <span>${msg('Unspecified Service Types')}</span>
        </mwc-check-list-item>
        <mwc-check-list-item
          class="filter-preconfigured"
          left
          ?selected=${!this.hidePreconfiguredNotMatching}
        >
          <span>${msg('Show Non-Matching Preconfigured')}</span>
        </mwc-check-list-item>
      </mwc-menu>
      <mwc-icon-button
        id="filterExtRefPublisherIcon"
        class="${o(menuClasses)}"
        title="${msg('Filter')}"
        icon="filter_list"
        @click=${() => {
            if (!this.filterMenuExtRefPublisherUI.open)
                this.filterMenuExtRefPublisherUI.show();
        }}
      ></mwc-icon-button>
      <mwc-icon-button
        id="settingsExtRefPublisherIcon"
        title="${msg('Settings')}"
        icon="settings"
        @click=${() => {
            if (!this.settingsMenuExtRefPublisherUI.open)
                this.settingsMenuExtRefPublisherUI.show();
        }}
      ></mwc-icon-button>
      <mwc-menu
        id="settingsExtRefPublisherMenu"
        multi
        corner="BOTTOM_RIGHT"
        menuCorner="END"
      >
        <mwc-check-list-item
          class="no-supervisions"
          left
          ?selected=${!this.notChangeSupervisionLNs}
        >
          <span>${msg('Change Supervision LNs')}</span>
        </mwc-check-list-item>
      </mwc-menu>
    </h1>`;
    }
    renderSubscriberViewExtRefListTitle() {
        const menuClasses = {
            'filter-off': this.hideBound || this.hideNotBound || this.strictServiceTypes,
        };
        return x `<h1 class="subscriber-title">
      ${msg('Subscriber Inputs')}
      <mwc-icon-button
        id="filterExtRefSubscriberIcon"
        class="${o(menuClasses)}"
        title="${msg('Filter')}"
        icon="filter_list"
        @click=${() => {
            if (!this.filterMenuExtRefSubscriberUI.open)
                this.filterMenuExtRefSubscriberUI.show();
        }}
      ></mwc-icon-button>
      <mwc-menu
        id="filterExtRefMenuSubscriber"
        multi
        class="filter-menu"
        corner="BOTTOM_RIGHT"
        menuCorner="END"
      >
        <mwc-check-list-item
          class="show-bound"
          left
          ?selected=${!this.hideBound}
        >
          <span>${msg('Subscribed')}</span>
        </mwc-check-list-item>
        <mwc-check-list-item
          class="show-not-bound"
          left
          ?selected=${!this.hideNotBound}
        >
          <span>${msg('Not Subscribed')}</span>
        </mwc-check-list-item>
        <mwc-check-list-item
          class="show-unspecified-service-types"
          left
          ?selected=${!this.strictServiceTypes}
        >
          <span>${msg('Unspecified Service Types')}</span>
        </mwc-check-list-item>
      </mwc-menu>
      <mwc-icon-button
        id="settingsExtRefSubscriberIcon"
        title="${msg('Settings')}"
        icon="settings"
        @click=${() => {
            if (!this.settingsMenuExtRefSubscriberUI.open)
                this.settingsMenuExtRefSubscriberUI.show();
        }}
      ></mwc-icon-button>
      <mwc-menu
        id="settingsExtRefSubscriberMenu"
        multi
        corner="BOTTOM_RIGHT"
        menuCorner="END"
      >
        <mwc-check-list-item
          class="auto-increment"
          left
          ?selected=${!this.notAutoIncrement}
        >
          <span>${msg('Auto-increment')}</span>
        </mwc-check-list-item>
        <mwc-check-list-item
          class="no-supervisions"
          left
          ?selected=${!this.notChangeSupervisionLNs}
        >
          <span>${msg('Change Supervision LNs')}</span>
        </mwc-check-list-item>
      </mwc-menu>
    </h1>`;
    }
    renderSubscriberViewExtRef(extRefElement) {
        var _a, _b, _c, _d, _e;
        let subscriberFCDA;
        let supervisionNode;
        let controlBlockDescription;
        let supervisionDescription;
        const subscribed = isSubscribed(extRefElement);
        if (subscribed) {
            subscriberFCDA = findFCDAs$1(extRefElement).find(x => x !== undefined);
            supervisionNode = this.getCachedSupervision(extRefElement);
            controlBlockDescription =
                getFcdaSrcControlBlockDescription(extRefElement);
        }
        if (supervisionNode) {
            supervisionDescription = trimIdentityParent(identity(supervisionNode));
        }
        const extRefDescription = getDescriptionAttribute(extRefElement);
        const supAndctrlDescription = supervisionDescription || controlBlockDescription
            ? `${[controlBlockDescription, supervisionDescription]
                .filter(desc => desc !== undefined)
                .join(', ')}`
            : A;
        const hasInvalidMapping = isPartiallyConfigured(extRefElement);
        const hasMissingMapping = subscribed && !subscriberFCDA;
        const bound = subscribed || hasInvalidMapping;
        const specExtRef = this.getExtRefInfo(extRefElement).spec;
        const specFcda = subscriberFCDA
            ? this.getFcdaInfo(subscriberFCDA).spec
            : null;
        // this fcda name is taken from the ExtRef so even if an FCDA
        // cannot be located we can "show" the subscription
        const fcdaName = subscribed || hasMissingMapping
            ? `${(_a = extRefElement.getAttribute('iedName')) !== null && _a !== void 0 ? _a : 'Unknown'} > ${getFcdaOrExtRefSubtitleValue(extRefElement)} ${getFcdaOrExtRefTitleValue(extRefElement)} `
            : '';
        const fcdaDesc = subscriberFCDA
            ? this.getFcdaInfo(subscriberFCDA).desc.join('>')
            : null;
        const specExtRefText = specExtRef.cdc || specExtRef.bType
            ? `ExtRef: CDC: ${(_b = specExtRef.cdc) !== null && _b !== void 0 ? _b : '?'}, Basic Type: ${(_c = specExtRef.bType) !== null && _c !== void 0 ? _c : '?'}`
            : '';
        const specFcdaText = specFcda && (specFcda.cdc || specFcda.bType)
            ? `FCDA: CDC: ${(_d = specFcda.cdc) !== null && _d !== void 0 ? _d : '?'}, Basic Type: ${(_e = specFcda.bType) !== null && _e !== void 0 ? _e : '?'}`
            : '';
        const filterClasses = {
            'show-bound': bound,
            'show-not-bound': !bound,
        };
        return x `<mwc-list-item
      twoline
      class="extref ${o(filterClasses)}"
      graphic="large"
      ?hasMeta=${supervisionNode !== undefined ||
            hasInvalidMapping ||
            hasMissingMapping}
      data-extref="${identity(extRefElement)}"
      value="${identity(extRefElement)}${supervisionNode
            ? ` ${identity(supervisionNode)}`
            : ''}"
      title="${[specExtRefText, specFcdaText].join('\n')}"
    >
      <span class="extref-firstline">
        ${extRefPath(extRefElement)}: ${extRefElement.getAttribute('intAddr')}
        ${subscribed || hasInvalidMapping
            ? x `<mwc-icon class="left-inline-arrow">arrow_back</mwc-icon>
              ${subscribed ? `${fcdaName}` : ''}
              ${hasInvalidMapping ? `${msg('Invalid Mapping')}` : ''} `
            : A}
      </span>
      <span slot="secondary"
        >${extRefDescription ? x ` ${extRefDescription}` : A}
        ${extRefDescription && fcdaDesc && fcdaDesc !== ''
            ? `🡄 ${fcdaDesc}`
            : A}
        ${extRefDescription && supAndctrlDescription !== A
            ? `(${supAndctrlDescription})`
            : supAndctrlDescription}
      </span>
      <mwc-icon slot="graphic">${subscribed ? 'link' : 'link_off'}</mwc-icon>
      ${subscribed &&
            supervisionNode !== undefined &&
            !hasInvalidMapping &&
            !hasMissingMapping
            ? x `<mwc-icon title="${identity(supervisionNode)}" slot="meta"
            >monitor_heart</mwc-icon
          >`
            : A}
      ${hasInvalidMapping
            ? x `<mwc-icon
            class="${hasInvalidMapping ? 'invalid-mapping' : ''}"
            title="${msg('Invalid Mapping')}"
            slot="meta"
            >error</mwc-icon
          >`
            : A}
      ${hasMissingMapping
            ? x `<mwc-icon
            class="${hasMissingMapping ? 'missing-mapping' : ''}"
            title="${msg('The subscription is valid but the element is not present -- check that IED, control block and dataset are correct.')}"
            slot="meta"
            >warning</mwc-icon
          >`
            : A}
    </mwc-list-item>`;
    }
    renderSubscriberViewExtRefs() {
        if (this.supervisionData.size === 0)
            this.reCreateSupervisionCache();
        return x `${c(getOrderedIeds(this.doc), i => `${identity(i)} ${this.controlTag}`, ied => {
            const extRefs = Array.from(this.getExtRefElementsByIED(ied));
            const someBound = extRefs.some(extRef => isSubscribed(extRef));
            const someNotBound = extRefs.some(extRef => !isSubscribed(extRef));
            if (!extRefs.length)
                return x ``;
            const filterClasses = {
                control: true,
                'show-bound': someBound,
                'show-not-bound': someNotBound,
            };
            const [iedDesc, iedType, iedMfg] = ['desc', 'type', 'manufacturer'].map(attr => ied.getAttribute(attr));
            return x `
          <mwc-list-item
            class="ied ${o(filterClasses)}"
            ?twoline=${iedDesc || iedType || iedMfg}
            noninteractive
            graphic="icon"
            value="${[iedDesc, iedMfg, iedType].join(' - ')} ${Array.from(ied.querySelectorAll('Inputs > ExtRef'))
                .map(extRef => {
                const extRefid = identity(extRef);
                const supervisionId = this.getCachedSupervision(extRef) !== undefined
                    ? identity(this.getCachedSupervision(extRef))
                    : '';
                const controlBlockDescription = getFcdaSrcControlBlockDescription(extRef);
                const extRefDescription = getDescriptionAttribute(extRef);
                const subscribed = isSubscribed(extRef);
                let subscriberFCDA;
                if (subscribed) {
                    subscriberFCDA = findFCDAs$1(extRef).find(x => x !== undefined);
                }
                return `${typeof extRefid === 'string' ? extRefid : ''} ${supervisionId} ${controlBlockDescription} ${extRefDescription} ${subscriberFCDA ? identity(subscriberFCDA) : ''}`;
            })
                .join(' ')}"
          >
            <span>${getNameAttribute(ied)}</span>
            <span slot="secondary"
              >${[iedDesc, iedMfg, iedType]
                .filter(val => !!val)
                .join(' - ')}</span
            >
            <mwc-icon slot="graphic">developer_board</mwc-icon>
          </mwc-list-item>
          ${c(Array.from(this.getExtRefElementsByIED(ied)), exId => `${identity(exId)} ${this.controlTag}`, extRef => this.renderSubscriberViewExtRef(extRef))}
        `;
        })}`;
    }
    renderExtRefs() {
        var _a;
        if (!this.subscriberView) {
            return x `<section class="column">
        ${this.renderPublisherViewExtRefListTitle()}
        ${this.currentSelectedControlElement && this.currentSelectedFcdaElement
                ? x `<oscd-filtered-list
              id="publisherExtRefList"
              class="styled-scrollbars ${!this.hidePreconfiguredNotMatching
                    ? 'show-pxx-mismatch'
                    : ''}"
              @selected=${(ev) => {
                    const selectedListItem = ev.target.selected;
                    if (!selectedListItem)
                        return;
                    const { extref } = selectedListItem.dataset;
                    // TODO: The selector function does not work correctly when there are multiple ExtRefs with the
                    // same desc and intAddr.
                    // See: https://github.com/openscd/open-scd/issues/1214
                    const selectedExtRefElement = this.doc.querySelector(selector('ExtRef', extref !== null && extref !== void 0 ? extref : 'Unknown ExtRef'));
                    if (!selectedExtRefElement)
                        return;
                    if (!isSubscribed(selectedExtRefElement) ||
                        !findFCDAs$1(selectedExtRefElement).find(x => x !== undefined)) {
                        this.subscribe(selectedExtRefElement, this.currentSelectedControlElement, this.currentSelectedFcdaElement);
                    }
                    else {
                        this.unsubscribe(selectedExtRefElement);
                    }
                    // without this statement, neither the ExtRef list or the FCDA list
                    // (with the count) update correctly. It is unclear why.
                    this.requestUpdate();
                    selectedListItem.selected = false;
                }}
            >
              ${this.renderPublisherViewSubscribedExtRefs()}
              ${this.renderPublisherViewAvailableExtRefs()}
            </oscd-filtered-list>`
                : x `<h3>${msg('No published item selected')}</h3>`}
      </section>`;
        }
        const filteredListClasses = {
            'show-bound': !this.hideBound,
            'show-not-bound': !this.hideNotBound,
        };
        const hasExtRefs = (_a = this.doc) === null || _a === void 0 ? void 0 : _a.querySelector('IED > AccessPoint > Server > LDevice > LN > Inputs > ExtRef, IED > AccessPoint > Server > LDevice > LN0 > Inputs > ExtRef');
        return x `<section class="column extref">
      ${this.renderSubscriberViewExtRefListTitle()}
      ${!hasExtRefs
            ? x `<h3>${msg('No inputs')}</h3>`
            : x `<oscd-filtered-list
            id="subscriberExtRefList"
            class="styled-scrollbars ${o(filteredListClasses)}"
            activatable
            @selected=${(ev) => {
                const selectedListItem = ev.target.selected;
                if (!selectedListItem)
                    return;
                const { extref } = selectedListItem.dataset;
                const selectedExtRefElement = (this.doc.querySelector(selector('ExtRef', extref !== null && extref !== void 0 ? extref : 'Unknown ExtRef')));
                if (!selectedExtRefElement)
                    return;
                if (isSubscribed(selectedExtRefElement) ||
                    isPartiallyConfigured(selectedExtRefElement)) {
                    this.unsubscribe(selectedExtRefElement);
                    // deselect in UI
                    // list item is left selected to allow further subscription
                    this.currentSelectedFcdaElement = undefined;
                    this.currentSelectedControlElement = undefined;
                }
                this.currentSelectedExtRefElement = selectedExtRefElement;
            }}
            >${this.renderSubscriberViewExtRefs()}
          </oscd-filtered-list>`}
    </section>`;
    }
    renderControlTypeSelector() {
        return x `
      <mwc-icon-button-toggle
        id="switchControlType"
        ?on=${this.controlTag === 'GSEControl'}
        title="${msg('Change between GOOSE and Sampled Value publishers')}"
        @click=${() => {
            if (this.controlTag === 'GSEControl') {
                this.controlTag = 'SampledValueControl';
            }
            else {
                this.controlTag = 'GSEControl';
            }
            this.reCreateSupervisionCache();
        }}
      >
        ${gooseActionIcon} ${smvActionIcon}
      </mwc-icon-button-toggle>
    `;
    }
    renderPublisherFCDAs() {
        const controlElements = this.getControlElements(this.controlTag);
        return x `<section class="column fcda">
      ${this.renderFCDAListTitle()}
      ${controlElements.length !== 0
            ? this.renderControlList(controlElements)
            : x `<h3>
            ${this.subscriberView
                ? msg('No input selected')
                : msg('No published items')}
          </h3>`}
    </section>`;
    }
    renderSwitchView() {
        return x `<mwc-icon-button-toggle
      id="switchView"
      ?on=${this.subscriberView}
      onIcon="swap_horiz"
      offIcon="swap_horiz"
      title="${msg('Switch between Publisher and Subscriber view')}"
      @click=${async () => {
            var _a, _b;
            this.subscriberView = (_b = (_a = this.switchViewUI) === null || _a === void 0 ? void 0 : _a.on) !== null && _b !== void 0 ? _b : false;
            // deselect in UI
            if (this.fcdaListSelectedUI) {
                this.fcdaListSelectedUI.selected = false;
                this.fcdaListSelectedUI.activated = false;
            }
            // reset state
            this.currentSelectedControlElement = undefined;
            this.currentSelectedFcdaElement = undefined;
            // required to update CSS state for filter buttons?
            this.requestUpdate();
            await this.updateComplete;
            // await for regeneration of UI and then attach anchors
            this.updateView();
        }}
    ></mwc-icon-button-toggle>`;
    }
    render() {
        var _a;
        const classList = { 'subscriber-view': (_a = this.subscriberView) !== null && _a !== void 0 ? _a : false };
        return x `<div id="listContainer" class="${o(classList)}">
        ${this.renderPublisherFCDAs()} ${this.renderExtRefs()}
      </div>
      ${this.renderSwitchView()}`;
    }
}
SubscriberLaterBinding.styles = i$5 `
    :host {
      width: 100vw;
      display: flex;

      --scrollbarBG: var(--mdc-theme-background, #cfcfcf00);
      --thumbBG: var(--mdc-button-disabled-ink-color, #996cd8cc);
    }

    @media (min-width: 700px) {
      #listContainer.subscriber-view {
        flex: auto;
      }

      #listContainer.subscriber-view .column.extref {
        resize: horizontal;
        width: 65%;
        flex: none;
      }

      #listContainer.subscriber-view .column.fcda {
        width: auto;
      }
    }

    h1,
    h2,
    h3 {
      color: var(--mdc-theme-on-surface);
      font-family: 'Roboto', sans-serif;
      font-weight: 300;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      margin: 0px;
      line-height: 48px;
      padding-left: 0.3em;
    }

    h3 {
      margin: 4px 8px 16px;
    }

    .column {
      flex: 50%;
      margin: 0px 6px 0px;
      min-width: 300px;
      height: 100%;
      overflow-y: clip;
      overflow-x: auto;
    }

    .fcda,
    .extref {
      padding-left: var(--mdc-list-side-padding, 16px);
    }

    #filterFcdaIcon,
    #filterExtRefSubscriberIcon,
    #settingsExtRefSubscriberIcon,
    #settingsExtRefPublisherIcon,
    #filterExtRefPublisherIcon {
      float: right;
    }

    #filterFcdaIcon.filter-off,
    #filterExtRefSubscriberIcon.filter-off,
    #filterExtRefPublisherIcon.filter-off {
      color: var(--mdc-theme-secondary, #018786);
      background-color: var(--mdc-theme-background);
    }

    /* Filtering rules for control blocks end up implementing logic to allow
    very fast CSS response. The following rules appear to be minimal but can be
    hard to understand intuitively for the multiple conditions. If modifying,
    it is suggested to create a truth-table to check for side-effects */

    /* remove all control blocks if no filters */
    #fcdaList:not(.show-subscribed, .show-not-subscribed) mwc-list-item {
      display: none;
    }

    /* remove control blocks taking care to respect multiple conditions */
    #fcdaList.show-not-subscribed:not(.show-subscribed)
      mwc-list-item.control.show-subscribed:not(.show-not-subscribed) {
      display: none;
    }

    #fcdaList.show-subscribed:not(.show-not-subscribed)
      mwc-list-item.control.show-not-subscribed:not(.show-subscribed) {
      display: none;
    }

    /* remove fcdas if not part of filter */
    #fcdaList:not(.show-not-subscribed) mwc-list-item.fcda.show-not-subscribed {
      display: none;
    }

    #fcdaList:not(.show-subscribed) mwc-list-item.fcda.show-subscribed {
      display: none;
    }

    /* hide data objects if filter enabled */
    #fcdaList:not(.show-data-objects) mwc-list-item.fcda.show-data-objects {
      display: none;
    }

    /* hide preferred items mismatch if filter enabled */
    #fcdaList:not(.show-pxx-mismatch) mwc-list-item.fcda.show-pxx-mismatch {
      display: none;
    }

    /* hide mismatch preferred items for publisher view available extrefs */
    #publisherExtRefList:not(.show-pxx-mismatch)
      mwc-list-item.extref.show-pxx-mismatch {
      display: none;
    }

    .invalid-mapping {
      color: var(--mdc-theme-error, red);
    }

    /* TODO: OpenSCD currently doesn't have "warning" or "invalid" colours 
    outside of logging but these may be generally useful to plugin authors */
    .missing-mapping {
      color: var(--mdc-theme-error, orange);
    }

    #listContainer {
      width: 100%;
      display: flex;
      padding: 8px 6px 16px;
      height: calc(100vh - 136px);
    }

    #listContainer:not(.subscriber-view) {
      flex-direction: row;
    }

    #listContainer.subscriber-view {
      width: 100%;
      flex-direction: row-reverse;
    }

    #listContainer.subscriber-view .column.fcda {
      flex: 1;
      width: 25%;
      position: relative;
    }

    mwc-list-item {
      --mdc-list-item-meta-size: 48px;
    }

    mwc-list-item.hidden[noninteractive] + li[divider] {
      display: none;
    }

    section {
      position: relative;
      max-height: 100%;
      background-color: var(--mdc-theme-surface);
    }

    /* TODO: Can we do better than a hard-coded max-height */
    .styled-scrollbars {
      max-height: 78vh;
      overflow: auto;
    }

    .styled-scrollbars {
      scrollbar-width: auto;
      scrollbar-color: var(--thumbBG) var(--scrollbarBG);
    }

    .styled-scrollbars::-webkit-scrollbar {
      width: 6px;
    }

    .styled-scrollbars::-webkit-scrollbar-track {
      background: var(--scrollbarBG);
    }

    .styled-scrollbars::-webkit-scrollbar-thumb {
      background: var(--thumbBG);
      border-radius: 6px;
    }

    mwc-list-item.ied,
    mwc-list-item.control {
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }

    /* Filtering rules for ExtRefs end up implementing logic to allow
    very fast CSS response. The following rules appear to be minimal but can be
    hard to understand intuitively for the multiple conditions. If modifying,
    it is suggested to create a truth-table to check for side-effects */

    /* remove all ExtRefs if no filters */
    #subscriberExtRefList:not(.show-bound, .show-not-bound) mwc-list-item {
      display: none;
    }

    /* remove ExtRefs taking care to respect multiple conditions */
    #subscriberExtRefList.show-not-bound:not(.show-bound)
      mwc-list-item.ied.show-bound:not(.show-not-bound) {
      display: none;
    }

    #subscriberExtRefList.show-bound:not(.show-not-bound)
      mwc-list-item.ied.show-not-bound:not(.show-bound) {
      display: none;
    }

    /* remove ExtRefs if not part of filter */
    #subscriberExtRefList:not(.show-not-bound)
      mwc-list-item.extref.show-not-bound {
      display: none;
    }

    #subscriberExtRefList:not(.show-bound) mwc-list-item.extref.show-bound {
      display: none;
    }

    #switchView {
      z-index: 1;
      position: absolute;
      bottom: 16px;
      right: 16px;
    }

    #switchControlType,
    #switchView {
      --mdc-icon-size: 32px;
    }

    .left-inline-arrow {
      position: relative;
      top: 5px;
    }
  `;
__decorate([
    e$4({ attribute: false })
], SubscriberLaterBinding.prototype, "doc", void 0);
__decorate([
    e$4()
], SubscriberLaterBinding.prototype, "docName", void 0);
__decorate([
    e$4()
], SubscriberLaterBinding.prototype, "editCount", void 0);
__decorate([
    e$4({ type: Boolean })
], SubscriberLaterBinding.prototype, "controlTag", void 0);
__decorate([
    e$4({ type: Boolean })
], SubscriberLaterBinding.prototype, "subscriberView", void 0);
__decorate([
    e$4({ type: Boolean })
], SubscriberLaterBinding.prototype, "hideSubscribed", void 0);
__decorate([
    e$4({ type: Boolean })
], SubscriberLaterBinding.prototype, "hideNotSubscribed", void 0);
__decorate([
    e$4({ type: Boolean })
], SubscriberLaterBinding.prototype, "hideDataObjects", void 0);
__decorate([
    e$4({ type: Boolean })
], SubscriberLaterBinding.prototype, "hidePreconfiguredNotMatching", void 0);
__decorate([
    e$4({ type: Boolean })
], SubscriberLaterBinding.prototype, "notAutoIncrement", void 0);
__decorate([
    e$4({ type: Boolean })
], SubscriberLaterBinding.prototype, "notChangeSupervisionLNs", void 0);
__decorate([
    e$4({ type: Boolean })
], SubscriberLaterBinding.prototype, "hideBound", void 0);
__decorate([
    e$4({ type: Boolean })
], SubscriberLaterBinding.prototype, "hideNotBound", void 0);
__decorate([
    e$4({ type: Boolean })
], SubscriberLaterBinding.prototype, "strictServiceTypes", void 0);
__decorate([
    i$2('#switchView')
], SubscriberLaterBinding.prototype, "switchViewUI", void 0);
__decorate([
    i$2('#switchControlType')
], SubscriberLaterBinding.prototype, "switchControlTypeUI", void 0);
__decorate([
    i$2('#filterFcdaMenu')
], SubscriberLaterBinding.prototype, "filterMenuFcdaUI", void 0);
__decorate([
    i$2('#filterFcdaIcon')
], SubscriberLaterBinding.prototype, "filterMenuFcdaButtonUI", void 0);
__decorate([
    i$2('#filterExtRefMenuSubscriber')
], SubscriberLaterBinding.prototype, "filterMenuExtRefSubscriberUI", void 0);
__decorate([
    i$2('#filterExtRefMenuPublisher')
], SubscriberLaterBinding.prototype, "filterMenuExtRefPublisherUI", void 0);
__decorate([
    i$2('#filterExtRefSubscriberIcon')
], SubscriberLaterBinding.prototype, "filterMenuExtRefSubscriberButtonUI", void 0);
__decorate([
    i$2('#filterExtRefPublisherIcon')
], SubscriberLaterBinding.prototype, "filterMenuExtrefPublisherButtonUI", void 0);
__decorate([
    i$2('#listContainer')
], SubscriberLaterBinding.prototype, "listContainerUI", void 0);
__decorate([
    i$2('#settingsExtRefSubscriberMenu')
], SubscriberLaterBinding.prototype, "settingsMenuExtRefSubscriberUI", void 0);
__decorate([
    i$2('#settingsExtRefPublisherMenu')
], SubscriberLaterBinding.prototype, "settingsMenuExtRefPublisherUI", void 0);
__decorate([
    i$2('#settingsExtRefSubscriberIcon')
], SubscriberLaterBinding.prototype, "settingsMenuExtRefSubscriberButtonUI", void 0);
__decorate([
    i$2('#settingsExtRefPublisherIcon')
], SubscriberLaterBinding.prototype, "settingsMenuExtRefPublisherButtonUI", void 0);
__decorate([
    i$2('#fcdaList')
], SubscriberLaterBinding.prototype, "fcdaListUI", void 0);
__decorate([
    i$2('#publisherExtRefList')
], SubscriberLaterBinding.prototype, "extRefListPublisherUI", void 0);
__decorate([
    i$2('#publisherExtRefSection')
], SubscriberLaterBinding.prototype, "publisherExtRefSectionUI", void 0);
__decorate([
    i$2('#subscriberExtRefList')
], SubscriberLaterBinding.prototype, "extRefListSubscriberUI", void 0);
__decorate([
    i$2('#subscriberExtRefList mwc-list-item[selected]')
], SubscriberLaterBinding.prototype, "extRefListSubscriberSelectedUI", void 0);
__decorate([
    i$2('#fcdaList mwc-list-item[selected]')
], SubscriberLaterBinding.prototype, "fcdaListSelectedUI", void 0);
__decorate([
    t$1()
], SubscriberLaterBinding.prototype, "currentSelectedControlElement", void 0);
__decorate([
    t$1()
], SubscriberLaterBinding.prototype, "currentSelectedFcdaElement", void 0);
__decorate([
    t$1()
], SubscriberLaterBinding.prototype, "currentIedElement", void 0);
__decorate([
    t$1()
], SubscriberLaterBinding.prototype, "currentSelectedExtRefElement", void 0);
__decorate([
    t$1()
], SubscriberLaterBinding.prototype, "controlBlockFcdaInfo", void 0);
__decorate([
    t$1()
], SubscriberLaterBinding.prototype, "fcdaInfo", void 0);
__decorate([
    t$1()
], SubscriberLaterBinding.prototype, "extRefInfo", void 0);
__decorate([
    t$1()
], SubscriberLaterBinding.prototype, "supervisionData", void 0);

export { SubscriberLaterBinding as default };
//# sourceMappingURL=oscd-subscriber-later-binding.js.map
