var ObjectiveJ={};
(function(_1,_2){
if(!Object.create){
Object.create=function(o){
if(arguments.length>1){
throw new Error("Object.create implementation only accepts the first parameter.");
}
function F(){
};
F.prototype=o;
return new F();
};
}
if(!Object.keys){
Object.keys=(function(){
var _3=Object.prototype.hasOwnProperty,_4=!{toString:null}.propertyIsEnumerable("toString"),_5=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],_6=_5.length;
return function(_7){
if(typeof _7!=="object"&&typeof _7!=="function"||_7===null){
throw new TypeError("Object.keys called on non-object");
}
var _8=[];
for(var _9 in _7){
if(_3.call(_7,_9)){
_8.push(_9);
}
}
if(_4){
for(var i=0;i<_6;i++){
if(_3.call(_7,_5[i])){
_8.push(_5[i]);
}
}
}
return _8;
};
})();
}
if(!Array.prototype.indexOf){
Array.prototype.indexOf=function(_a){
"use strict";
if(this===null){
throw new TypeError();
}
var t=new Object(this),_b=t.length>>>0;
if(_b===0){
return -1;
}
var n=0;
if(arguments.length>1){
n=Number(arguments[1]);
if(n!=n){
n=0;
}else{
if(n!==0&&n!=Infinity&&n!=-Infinity){
n=(n>0||-1)*Math.floor(Math.abs(n));
}
}
}
if(n>=_b){
return -1;
}
var k=n>=0?n:Math.max(_b-Math.abs(n),0);
for(;k<_b;k++){
if(k in t&&t[k]===_a){
return k;
}
}
return -1;
};
}
if(!Array.prototype.findIndex){
Object.defineProperty(Array.prototype,"findIndex",{value:function(_c){
if(this==null){
throw new TypeError("\"this\" is null or not defined");
}
var o=Object(this);
var _d=o.length>>>0;
if(typeof _c!=="function"){
throw new TypeError("predicate must be a function");
}
var _e=arguments[1];
var k=0;
while(k<_d){
var _f=o[k];
if(_c.call(_e,_f,k,o)){
return k;
}
k++;
}
return -1;
},configurable:true,writable:true});
}
if(!String.prototype.startsWith){
String.prototype.startsWith=function(_10,_11){
_11=_11||0;
return this.substr(_11,_10.length)===_10;
};
}
if(!String.prototype.endsWith){
String.prototype.endsWith=function(_12,_13){
var _14=this.toString();
if(typeof _13!=="number"||!isFinite(_13)||Math.floor(_13)!==_13||_13>_14.length){
_13=_14.length;
}
_13-=_12.length;
var _15=_14.indexOf(_12,_13);
return _15!==-1&&_15===_13;
};
}
if(!Array.prototype.includes){
Object.defineProperty(Array.prototype,"includes",{value:function(_16,_17){
if(this==null){
throw new TypeError("\"this\" is null or not defined");
}
var o=Object(this);
var len=o.length>>>0;
if(len===0){
return false;
}
var n=_17|0;
var k=Math.max(n>=0?n:len-Math.abs(n),0);
while(k<len){
if(o[k]===_16){
return true;
}
k++;
}
return false;
}});
}
if(!Array.prototype.find){
Object.defineProperty(Array.prototype,"find",{value:function(_18){
if(this==null){
throw TypeError("\"this\" is null or not defined");
}
var o=Object(this);
var len=o.length>>>0;
if(typeof _18!=="function"){
throw TypeError("predicate must be a function");
}
var _19=arguments[1];
var k=0;
while(k<len){
var _1a=o[k];
if(_18.call(_19,_1a,k,o)){
return _1a;
}
k++;
}
return _1b;
},configurable:true,writable:true});
}
if(!this.JSON){
JSON={};
}
(function(){
function f(n){
return n<10?"0"+n:n;
};
if(typeof Date.prototype.toJSON!=="function"){
Date.prototype.toJSON=function(key){
return this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z";
};
String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){
return this.valueOf();
};
}
var cx=new RegExp("[\\u0000\\u00ad\\u0600-\\u0604\\u070f\\u17b4\\u17b5\\u200c-\\u200f\\u2028-\\u202f\\u2060-\\u206f\\ufeff\\ufff0-\\uffff]","g");
var _1c=new RegExp("[\\\\\\\"\\x00-\\x1f\\x7f-\\x9f\\u00ad\\u0600-\\u0604\\u070f\\u17b4\\u17b5\\u200c-\\u200f\\u2028-\\u202f\\u2060-\\u206f\\ufeff\\ufff0-\\uffff]","g");
var gap,_1d,_1e={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r","\"":"\\\"","\\":"\\\\"},rep;
function _1f(_20){
_1c.lastIndex=0;
return _1c.test(_20)?"\""+_20.replace(_1c,function(a){
var c=_1e[a];
return typeof c==="string"?c:"\\u"+("0000"+(a.charCodeAt(0)).toString(16)).slice(-4);
})+"\"":"\""+_20+"\"";
};
function str(key,_21){
var i,k,v,_22,_23=gap,_24,_25=_21[key];
if(_25&&typeof _25==="object"&&typeof _25.toJSON==="function"){
_25=_25.toJSON(key);
}
if(typeof rep==="function"){
_25=rep.call(_21,key,_25);
}
switch(typeof _25){
case "string":
return _1f(_25);
case "number":
return isFinite(_25)?String(_25):"null";
case "boolean":
case "null":
return String(_25);
case "object":
if(!_25){
return "null";
}
gap+=_1d;
_24=[];
if(Object.prototype.toString.apply(_25)==="[object Array]"){
_22=_25.length;
for(i=0;i<_22;i+=1){
_24[i]=str(i,_25)||"null";
}
v=_24.length===0?"[]":gap?"[\n"+gap+_24.join(",\n"+gap)+"\n"+_23+"]":"["+_24.join(",")+"]";
gap=_23;
return v;
}
if(rep&&typeof rep==="object"){
_22=rep.length;
for(i=0;i<_22;i+=1){
k=rep[i];
if(typeof k==="string"){
v=str(k,_25);
if(v){
_24.push(_1f(k)+(gap?": ":":")+v);
}
}
}
}else{
for(k in _25){
if(Object.hasOwnProperty.call(_25,k)){
v=str(k,_25);
if(v){
_24.push(_1f(k)+(gap?": ":":")+v);
}
}
}
}
v=_24.length===0?"{}":gap?"{\n"+gap+_24.join(",\n"+gap)+"\n"+_23+"}":"{"+_24.join(",")+"}";
gap=_23;
return v;
}
};
if(typeof JSON.stringify!=="function"){
JSON.stringify=function(_26,_27,_28){
var i;
gap="";
_1d="";
if(typeof _28==="number"){
for(i=0;i<_28;i+=1){
_1d+=" ";
}
}else{
if(typeof _28==="string"){
_1d=_28;
}
}
rep=_27;
if(_27&&typeof _27!=="function"&&(typeof _27!=="object"||typeof _27.length!=="number")){
throw new Error("JSON.stringify");
}
return str("",{"":_26});
};
}
if(typeof JSON.parse!=="function"){
JSON.parse=function(_29,_2a){
var j;
function _2b(_2c,key){
var k,v,_2d=_2c[key];
if(_2d&&typeof _2d==="object"){
for(k in _2d){
if(Object.hasOwnProperty.call(_2d,k)){
v=_2b(_2d,k);
if(v!==_1b){
_2d[k]=v;
}else{
delete _2d[k];
}
}
}
}
return _2a.call(_2c,key,_2d);
};
cx.lastIndex=0;
if(cx.test(_29)){
_29=_29.replace(cx,function(a){
return "\\u"+("0000"+(a.charCodeAt(0)).toString(16)).slice(-4);
});
}
if(/^[\],:{}\s]*$/.test(((_29.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@")).replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]")).replace(/(?:^|:|,)(?:\s*\[)+/g,""))){
j=eval("("+_29+")");
return typeof _2a==="function"?_2b({"":j},""):j;
}
throw new SyntaxError("JSON.parse");
};
}
})();
var _2e=/([^%]+|%(?:\d+\$)?[\+\-\ \#0]*[0-9\*]*(.[0-9\*]+)?[hlL]?[cbBdieEfgGosuxXpn%@])/g,_2f=/(%)(?:(\d+)\$)?([\+\-\ \#0]*)([0-9\*]*)((?:.[0-9\*]+)?)([hlL]?)([cbBdieEfgGosuxXpn%@])/;
_2.sprintf=function(_30){
var _30=arguments[0],_31=_30.match(_2e),_32=0,_33="",arg=1;
for(var i=0;i<_31.length;i++){
var t=_31[i];
if(_30.substring(_32,_32+t.length)!==t){
return _33;
}
_32+=t.length;
if(t.charAt(0)!=="%"){
_33+=t;
}else{
if(t==="%%"){
_33+="%";
}else{
var _34=t.match(_2f);
if(_34.length!==8||_34[0]!==t){
return _33;
}
var _35=_34[1],_36=_34[2],_37=_34[3],_38=_34[4],_39=_34[5],_3a=_34[6],_3b=_34[7];
if(_36===_1b||_36===null||_36===""){
_36=arg++;
}else{
_36=Number(_36);
}
var _3c=null;
if(_38=="*"){
_3c=arguments[_36];
}else{
if(_38!==""){
_3c=Number(_38);
}
}
var _3d=null;
if(_39===".*"){
_3d=arguments[_36];
}else{
if(_39!==""){
_3d=Number(_39.substring(1));
}
}
var _3e=_37.indexOf("-")>=0,_3f=_37.indexOf("0")>=0,_40="";
if(/[bBdiufeExXo]/.test(_3b)){
var num=Number(arguments[_36]),_41="";
if(num<0){
_41="-";
}else{
if(_37.indexOf("+")>=0){
_41="+";
}else{
if(_37.indexOf(" ")>=0){
_41=" ";
}
}
}
if(_3b==="d"||_3b==="i"||_3b==="u"){
var _42=String(Math.abs(Math.floor(num)));
_40=_43(_41,"",_42,"",_3c,_3e,_3f);
}
if(_3b=="f"){
var _42=String(_3d!==null?(Math.abs(num)).toFixed(_3d):Math.abs(num)),_44=_37.indexOf("#")>=0&&_42.indexOf(".")<0?".":"";
_40=_43(_41,"",_42,_44,_3c,_3e,_3f);
}
if(_3b==="e"||_3b==="E"){
var _42=String((Math.abs(num)).toExponential(_3d!==null?_3d:21)),_44=_37.indexOf("#")>=0&&_42.indexOf(".")<0?".":"";
_40=_43(_41,"",_42,_44,_3c,_3e,_3f);
}
if(_3b=="x"||_3b=="X"){
var _42=String((Math.abs(num)).toString(16));
var _45=_37.indexOf("#")>=0&&num!=0?"0x":"";
_40=_43(_41,_45,_42,"",_3c,_3e,_3f);
}
if(_3b=="b"||_3b=="B"){
var _42=String((Math.abs(num)).toString(2));
var _45=_37.indexOf("#")>=0&&num!=0?"0b":"";
_40=_43(_41,_45,_42,"",_3c,_3e,_3f);
}
if(_3b=="o"){
var _42=String((Math.abs(num)).toString(8));
var _45=_37.indexOf("#")>=0&&num!=0?"0":"";
_40=_43(_41,_45,_42,"",_3c,_3e,_3f);
}
if(/[A-Z]/.test(_3b)){
_40=_40.toUpperCase();
}else{
_40=_40.toLowerCase();
}
}else{
var _40="";
if(_3b==="%"){
_40="%";
}else{
if(_3b==="c"){
_40=(String(arguments[_36])).charAt(0);
}else{
if(_3b==="s"||_3b==="@"){
_40=String(arguments[_36]);
}else{
if(_3b==="p"||_3b==="n"){
_40="";
}
}
}
}
_40=_43("","",_40,"",_3c,_3e,false);
}
_33+=_40;
}
}
}
return _33;
};
function _43(_46,_47,_48,_49,_4a,_4b,_4c){
var _4d=_46.length+_47.length+_48.length+_49.length;
if(_4b){
return _46+_47+_48+_49+pad(_4a-_4d," ");
}else{
if(_4c){
return _46+_47+pad(_4a-_4d,"0")+_48+_49;
}else{
return pad(_4a-_4d," ")+_46+_47+_48+_49;
}
}
};
function pad(n,ch){
return (Array(MAX(0,n)+1)).join(ch);
};
CPLogDisable=false;
var _4e="Cappuccino";
var _4f=["fatal","error","warn","info","debug","trace"];
var _50=_4f[3];
var _51={};
for(var i=0;i<_4f.length;i++){
_51[_4f[i]]=i;
}
var _52={};
CPLogRegister=function(_53,_54,_55){
CPLogRegisterRange(_53,_4f[0],_54||_4f[_4f.length-1],_55);
};
CPLogRegisterRange=function(_56,_57,_58,_59){
var min=_51[_57];
var max=_51[_58];
if(min!==_1b&&max!==_1b&&min<=max){
for(var i=min;i<=max;i++){
CPLogRegisterSingle(_56,_4f[i],_59);
}
}
};
CPLogRegisterSingle=function(_5a,_5b,_5c){
if(!_52[_5b]){
_52[_5b]=[];
}
for(var i=0;i<_52[_5b].length;i++){
if(_52[_5b][i][0]===_5a){
_52[_5b][i][1]=_5c;
return;
}
}
_52[_5b].push([_5a,_5c]);
};
CPLogUnregister=function(_5d){
for(var _5e in _52){
for(var i=0;i<_52[_5e].length;i++){
if(_52[_5e][i][0]===_5d){
_52[_5e].splice(i--,1);
}
}
}
};
function _5f(_60,_61,_62){
if(_62==_1b){
_62=_4e;
}
if(_61==_1b){
_61=_50;
}
var _63=typeof _60[0]=="string"&&_60.length>1?_2.sprintf.apply(null,_60):String(_60[0]);
if(_52[_61]){
for(var i=0;i<_52[_61].length;i++){
var _64=_52[_61][i];
_64[0](_63,_61,_62,_64[1]);
}
}
};
CPLog=function(){
_5f(arguments);
};
for(var i=0;i<_4f.length;i++){
CPLog[_4f[i]]=(function(_65){
return function(){
_5f(arguments,_65);
};
})(_4f[i]);
}
var _66=function(_67,_68,_69){
var now=new Date(),_6a;
if(_68===null){
_68="";
}else{
_68=_68||"info";
_68="["+CPLogColorize(_68,_68)+"]";
}
_69=_69||"";
if(_69&&_68){
_69+=" ";
}
_6a=_69+_68;
if(_6a){
_6a+=": ";
}
if(typeof _2.sprintf=="function"){
return _2.sprintf("%4d-%02d-%02d %02d:%02d:%02d.%03d %s%s",now.getFullYear(),now.getMonth()+1,now.getDate(),now.getHours(),now.getMinutes(),now.getSeconds(),now.getMilliseconds(),_6a,_67);
}else{
return now+" "+_6a+": "+_67;
}
};
CPLogConsole=function(_6b,_6c,_6d,_6e){
if(typeof console!="undefined"){
var _6f=(_6e||_66)(_6b,_6c,_6d),_70={"fatal":"error","error":"error","warn":"warn","info":"info","debug":"debug","trace":"debug"}[_6c];
if(_70&&console[_70]){
console[_70](_6f);
}else{
if(console.log){
console.log(_6f);
}
}
}
};
CPLogColorize=function(_71,_72){
return _71;
};
CPLogAlert=function(_73,_74,_75,_76){
if(typeof alert!="undefined"&&!CPLogDisable){
var _77=(_76||_66)(_73,_74,_75);
CPLogDisable=!confirm(_77+"\n\n(Click cancel to stop log alerts)");
}
};
var _78=null;
CPLogPopup=function(_79,_7a,_7b,_7c){
try{
if(CPLogDisable||window.open==_1b){
return;
}
if(!_78||!_78.document){
_78=window.open("","_blank","width=600,height=400,status=no,resizable=yes,scrollbars=yes");
if(!_78){
CPLogDisable=!confirm(_79+"\n\n(Disable pop-up blocking for CPLog window; Click cancel to stop log alerts)");
return;
}
_7d(_78);
}
var _7e=_78.document.createElement("div");
_7e.setAttribute("class",_7a||"fatal");
var _7f=(_7c||_66)(_79,_7c?_7a:null,_7b);
_7e.appendChild(_78.document.createTextNode(_7f));
_78.log.appendChild(_7e);
if(_78.focusEnabled.checked){
_78.focus();
}
if(_78.blockEnabled.checked){
_78.blockEnabled.checked=_78.confirm(_7f+"\nContinue blocking?");
}
if(_78.scrollEnabled.checked){
_78.scrollToBottom();
}
}
catch(e){
}
};
var _80="<style type=\"text/css\" media=\"screen\"> body{font:10px Monaco,Courier,\"Courier New\",monospace,mono;padding-top:15px;} div > .fatal,div > .error,div > .warn,div > .info,div > .debug,div > .trace{display:none;overflow:hidden;white-space:pre;padding:0px 5px 0px 5px;margin-top:2px;-moz-border-radius:5px;-webkit-border-radius:5px;} div[wrap=\"yes\"] > div{white-space:normal;} .fatal{background-color:#ffb2b3;} .error{background-color:#ffe2b2;} .warn{background-color:#fdffb2;} .info{background-color:#e4ffb2;} .debug{background-color:#a0e5a0;} .trace{background-color:#99b9ff;} .enfatal .fatal,.enerror .error,.enwarn .warn,.eninfo .info,.endebug .debug,.entrace .trace{display:block;} div#header{background-color:rgba(240,240,240,0.82);position:fixed;top:0px;left:0px;width:100%;border-bottom:1px solid rgba(0,0,0,0.33);text-align:center;} ul#enablers{display:inline-block;margin:1px 15px 0 15px;padding:2px 0 2px 0;} ul#enablers li{display:inline;padding:0px 5px 0px 5px;margin-left:4px;-moz-border-radius:5px;-webkit-border-radius:5px;} [enabled=\"no\"]{opacity:0.25;} ul#options{display:inline-block;margin:0 15px 0px 15px;padding:0 0px;} ul#options li{margin:0 0 0 0;padding:0 0 0 0;display:inline;} </style>";
function _7d(_81){
var doc=_81.document;
doc.writeln("<html><head><title></title>"+_80+"</head><body></body></html>");
doc.title=_4e+" Run Log";
var _82=(doc.getElementsByTagName("head"))[0];
var _83=(doc.getElementsByTagName("body"))[0];
var _84=window.location.protocol+"//"+window.location.host+window.location.pathname;
_84=_84.substring(0,_84.lastIndexOf("/")+1);
var div=doc.createElement("div");
div.setAttribute("id","header");
_83.appendChild(div);
var ul=doc.createElement("ul");
ul.setAttribute("id","enablers");
div.appendChild(ul);
for(var i=0;i<_4f.length;i++){
var li=doc.createElement("li");
li.setAttribute("id","en"+_4f[i]);
li.setAttribute("class",_4f[i]);
li.setAttribute("onclick","toggle(this);");
li.setAttribute("enabled","yes");
li.appendChild(doc.createTextNode(_4f[i]));
ul.appendChild(li);
}
var ul=doc.createElement("ul");
ul.setAttribute("id","options");
div.appendChild(ul);
var _85={"focus":["Focus",false],"block":["Block",false],"wrap":["Wrap",false],"scroll":["Scroll",true],"close":["Close",true]};
for(o in _85){
var li=doc.createElement("li");
ul.appendChild(li);
_81[o+"Enabled"]=doc.createElement("input");
_81[o+"Enabled"].setAttribute("id",o);
_81[o+"Enabled"].setAttribute("type","checkbox");
if(_85[o][1]){
_81[o+"Enabled"].setAttribute("checked","checked");
}
li.appendChild(_81[o+"Enabled"]);
var _86=doc.createElement("label");
_86.setAttribute("for",o);
_86.appendChild(doc.createTextNode(_85[o][0]));
li.appendChild(_86);
}
_81.log=doc.createElement("div");
_81.log.setAttribute("class","enerror endebug enwarn eninfo enfatal entrace");
_83.appendChild(_81.log);
_81.toggle=function(_87){
var _88=_87.getAttribute("enabled")=="yes"?"no":"yes";
_87.setAttribute("enabled",_88);
if(_88=="yes"){
_81.log.className+=" "+_87.id;
}else{
_81.log.className=_81.log.className.replace(new RegExp("[\\s]*"+_87.id,"g"),"");
}
};
_81.scrollToBottom=function(){
_81.scrollTo(0,_83.offsetHeight);
};
_81.wrapEnabled.addEventListener("click",function(){
_81.log.setAttribute("wrap",_81.wrapEnabled.checked?"yes":"no");
},false);
_81.addEventListener("keydown",function(e){
var e=e||_81.event;
if(e.keyCode==75&&(e.ctrlKey||e.metaKey)){
while(_81.log.firstChild){
_81.log.removeChild(_81.log.firstChild);
}
e.preventDefault();
}
},"false");
window.addEventListener("unload",function(){
if(_81&&_81.closeEnabled&&_81.closeEnabled.checked){
CPLogDisable=true;
_81.close();
}
},false);
_81.addEventListener("unload",function(){
if(!CPLogDisable){
CPLogDisable=!confirm("Click cancel to stop logging");
}
},false);
};
CPLogDefault=typeof window==="object"&&window.console?CPLogConsole:CPLogPopup;
var _1b;
if(typeof window!=="undefined"){
window.setNativeTimeout=window.setTimeout;
window.clearNativeTimeout=window.clearTimeout;
window.setNativeInterval=window.setInterval;
window.clearNativeInterval=window.clearInterval;
}
NO=false;
YES=true;
nil=null;
Nil=null;
NULL=null;
ABS=Math.abs;
ASIN=Math.asin;
ACOS=Math.acos;
ATAN=Math.atan;
ATAN2=Math.atan2;
SIN=Math.sin;
COS=Math.cos;
TAN=Math.tan;
EXP=Math.exp;
POW=Math.pow;
CEIL=Math.ceil;
FLOOR=Math.floor;
ROUND=Math.round;
MIN=Math.min;
MAX=Math.max;
RAND=Math.random;
SQRT=Math.sqrt;
E=Math.E;
LN2=Math.LN2;
LN10=Math.LN10;
LOG=Math.log;
LOG2E=Math.LOG2E;
LOG10E=Math.LOG10E;
PI=Math.PI;
PI2=Math.PI*2;
PI_2=Math.PI/2;
SQRT1_2=Math.SQRT1_2;
SQRT2=Math.SQRT2;
function _89(_8a){
this._eventListenersForEventNames={};
this._owner=_8a;
};
_89.prototype.addEventListener=function(_8b,_8c){
var _8d=this._eventListenersForEventNames;
if(!_8e.call(_8d,_8b)){
var _8f=[];
_8d[_8b]=_8f;
}else{
var _8f=_8d[_8b];
}
var _90=_8f.length;
while(_90--){
if(_8f[_90]===_8c){
return;
}
}
_8f.push(_8c);
};
_89.prototype.removeEventListener=function(_91,_92){
var _93=this._eventListenersForEventNames;
if(!_8e.call(_93,_91)){
return;
}
var _94=_93[_91],_95=_94.length;
while(_95--){
if(_94[_95]===_92){
return _94.splice(_95,1);
}
}
};
_89.prototype.dispatchEvent=function(_96){
var _97=_96.type,_98=this._eventListenersForEventNames;
if(_8e.call(_98,_97)){
var _99=this._eventListenersForEventNames[_97],_9a=0,_9b=_99.length;
for(;_9a<_9b;++_9a){
_99[_9a](_96);
}
}
var _9c=(this._owner||this)["on"+_97];
if(_9c){
_9c(_96);
}
};
var _9d=0,_9e=null,_9f=[];
function _a0(_a1){
var _a2=_9d;
if(_9e===null){
window.setNativeTimeout(function(){
var _a3=_9f,_a4=0,_a5=_9f.length;
++_9d;
_9e=null;
_9f=[];
for(;_a4<_a5;++_a4){
_a3[_a4]();
}
},0);
}
return function(){
var _a6=arguments;
if(_9d>_a2){
_a1.apply(this,_a6);
}else{
_9f.push(function(){
_a1.apply(this,_a6);
});
}
};
};
var _a7=null;
if(window.XMLHttpRequest){
_a7=window.XMLHttpRequest;
}else{
if(window.ActiveXObject!==_1b){
var _a8=["Msxml2.XMLHTTP.3.0","Msxml2.XMLHTTP.6.0"],_a9=_a8.length;
while(_a9--){
try{
var _aa=_a8[_a9];
new ActiveXObject(_aa);
_a7=function(){
return new ActiveXObject(_aa);
};
break;
}
catch(anException){
}
}
}
}
CFHTTPRequest=function(){
this._isOpen=false;
this._requestHeaders={};
this._mimeType=null;
this._eventDispatcher=new _89(this);
this._nativeRequest=new _a7();
this._withCredentials=false;
this._timeout=60000;
var _ab=this;
this._stateChangeHandler=function(){
_c4(_ab);
};
this._timeoutHandler=function(){
_c2(_ab);
};
this._nativeRequest.onreadystatechange=this._stateChangeHandler;
this._nativeRequest.ontimeout=this._timeoutHandler;
if(CFHTTPRequest.AuthenticationDelegate!==nil){
this._eventDispatcher.addEventListener("HTTP403",function(){
CFHTTPRequest.AuthenticationDelegate(_ab);
});
}
};
CFHTTPRequest.UninitializedState=0;
CFHTTPRequest.LoadingState=1;
CFHTTPRequest.LoadedState=2;
CFHTTPRequest.InteractiveState=3;
CFHTTPRequest.CompleteState=4;
CFHTTPRequest.AuthenticationDelegate=nil;
CFHTTPRequest.prototype.status=function(){
try{
return this._nativeRequest.status||0;
}
catch(anException){
return 0;
}
};
CFHTTPRequest.prototype.statusText=function(){
try{
return this._nativeRequest.statusText||"";
}
catch(anException){
return "";
}
};
CFHTTPRequest.prototype.readyState=function(){
return this._nativeRequest.readyState;
};
CFHTTPRequest.prototype.success=function(){
var _ac=this.status();
if(_ac>=200&&_ac<300){
return YES;
}
return _ac===0&&this.responseText()&&(this.responseText()).length;
};
CFHTTPRequest.prototype.responseXML=function(){
var _ad=this._nativeRequest.responseXML;
if(_ad&&_a7===window.XMLHttpRequest&&_ad.documentRoot){
return _ad;
}
return _ae(this.responseText());
};
CFHTTPRequest.prototype.responsePropertyList=function(){
var _af=this.responseText();
if(CFPropertyList.sniffedFormatOfString(_af)===CFPropertyList.FormatXML_v1_0){
return CFPropertyList.propertyListFromXML(this.responseXML());
}
return CFPropertyList.propertyListFromString(_af);
};
CFHTTPRequest.prototype.responseText=function(){
return this._nativeRequest.responseText;
};
CFHTTPRequest.prototype.setRequestHeader=function(_b0,_b1){
this._requestHeaders[_b0]=_b1;
};
CFHTTPRequest.prototype.getResponseHeader=function(_b2){
return this._nativeRequest.getResponseHeader(_b2);
};
CFHTTPRequest.prototype.setTimeout=function(_b3){
this._timeout=_b3;
if(this._isOpen){
this._nativeRequest.timeout=_b3;
}
};
CFHTTPRequest.prototype.getTimeout=function(_b4){
return this._timeout;
};
CFHTTPRequest.prototype.getAllResponseHeaders=function(){
return this._nativeRequest.getAllResponseHeaders();
};
CFHTTPRequest.prototype.overrideMimeType=function(_b5){
this._mimeType=_b5;
};
CFHTTPRequest.prototype.open=function(_b6,_b7,_b8,_b9,_ba){
var _bb;
this._isOpen=true;
this._URL=_b7;
this._async=_b8;
this._method=_b6;
this._user=_b9;
this._password=_ba;
requestReturnValue=this._nativeRequest.open(_b6,_b7,_b8,_b9,_ba);
if(this._async){
this._nativeRequest.withCredentials=this._withCredentials;
this._nativeRequest.timeout=this._timeout;
}
return requestReturnValue;
};
CFHTTPRequest.prototype.send=function(_bc){
if(!this._isOpen){
delete this._nativeRequest.onreadystatechange;
delete this._nativeRequest.ontimeout;
this._nativeRequest.open(this._method,this._URL,this._async,this._user,this._password);
this._nativeRequest.ontimeout=this._timeoutHandler;
this._nativeRequest.onreadystatechange=this._stateChangeHandler;
}
for(var i in this._requestHeaders){
if(this._requestHeaders.hasOwnProperty(i)){
this._nativeRequest.setRequestHeader(i,this._requestHeaders[i]);
}
}
if(this._mimeType&&"overrideMimeType" in this._nativeRequest){
this._nativeRequest.overrideMimeType(this._mimeType);
}
this._isOpen=false;
try{
return this._nativeRequest.send(_bc);
}
catch(anException){
this._eventDispatcher.dispatchEvent({type:"failure",request:this});
}
};
CFHTTPRequest.prototype.abort=function(){
this._isOpen=false;
return this._nativeRequest.abort();
};
CFHTTPRequest.prototype.addEventListener=function(_bd,_be){
this._eventDispatcher.addEventListener(_bd,_be);
};
CFHTTPRequest.prototype.removeEventListener=function(_bf,_c0){
this._eventDispatcher.removeEventListener(_bf,_c0);
};
CFHTTPRequest.prototype.setWithCredentials=function(_c1){
this._withCredentials=_c1;
if(this._isOpen&&this._async){
this._nativeRequest.withCredentials=_c1;
}
};
CFHTTPRequest.prototype.withCredentials=function(){
return this._withCredentials;
};
CFHTTPRequest.prototype.isTimeoutRequest=function(){
return !this.success()&&!this._nativeRequest.response&&!this._nativeRequest.responseText&&!this._nativeRequest.responseType&&!this._nativeRequest.responseURL&&!this._nativeRequest.responseXML;
};
function _c2(_c3){
_c3._eventDispatcher.dispatchEvent({type:"timeout",request:_c3});
};
function _c4(_c5){
var _c6=_c5._eventDispatcher,_c7=["uninitialized","loading","loaded","interactive","complete"];
_c6.dispatchEvent({type:"readystatechange",request:_c5});
if(_c7[_c5.readyState()]==="complete"){
var _c8="HTTP"+_c5.status();
_c6.dispatchEvent({type:_c8,request:_c5});
var _c9=_c5.success()?"success":"failure";
_c6.dispatchEvent({type:_c9,request:_c5});
_c6.dispatchEvent({type:_c7[_c5.readyState()],request:_c5});
}else{
_c6.dispatchEvent({type:_c7[_c5.readyState()],request:_c5});
}
};
function _ca(_cb,_cc,_cd,_ce){
var _cf=new CFHTTPRequest();
if(_cb.pathExtension()==="plist"){
_cf.overrideMimeType("text/xml");
}
var _d0=0,_d1=null;
function _d2(_d3){
_ce(_d3.loaded-_d0);
_d0=_d3.loaded;
};
function _d4(_d5){
if(_ce&&_d1===null){
_ce((_d5.request.responseText()).length);
}
_cc(_d5);
};
if(_2.asyncLoader){
_cf.onsuccess=_a0(_d4);
_cf.onfailure=_a0(_cd);
}else{
_cf.onsuccess=_d4;
_cf.onfailure=_cd;
}
if(_ce){
var _d6=true;
if(document.all){
_d6=!!window.atob;
}
if(_d6){
try{
_d1=_2.asyncLoader?_a0(_d2):_d2;
_cf._nativeRequest.onprogress=_d1;
}
catch(anException){
_d1=null;
}
}
}
_cf.open("GET",_cb.absoluteString(),_2.asyncLoader);
_cf.send("");
};
_2.asyncLoader=YES;
_2.Asynchronous=_a0;
_2.determineAndDispatchHTTPRequestEvents=_c4;
var _d7=0;
objj_generateObjectUID=function(){
return _d7++;
};
CFPropertyList=function(){
this._UID=objj_generateObjectUID();
};
CFPropertyList.DTDRE=/^\s*(?:<\?\s*xml\s+version\s*=\s*\"1.0\"[^>]*\?>\s*)?(?:<\!DOCTYPE[^>]*>\s*)?/i;
CFPropertyList.XMLRE=/^\s*(?:<\?\s*xml\s+version\s*=\s*\"1.0\"[^>]*\?>\s*)?(?:<\!DOCTYPE[^>]*>\s*)?<\s*plist[^>]*\>/i;
CFPropertyList.FormatXMLDTD="<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">";
CFPropertyList.Format280NorthMagicNumber="280NPLIST";
(CFPropertyList.FormatOpenStep=1,CFPropertyList.FormatXML_v1_0=100,CFPropertyList.FormatBinary_v1_0=200,CFPropertyList.Format280North_v1_0=-1000);
CFPropertyList.sniffedFormatOfString=function(_d8){
if(_d8.match(CFPropertyList.XMLRE)){
return CFPropertyList.FormatXML_v1_0;
}
if(_d8.substr(0,CFPropertyList.Format280NorthMagicNumber.length)===CFPropertyList.Format280NorthMagicNumber){
return CFPropertyList.Format280North_v1_0;
}
return NULL;
};
CFPropertyList.dataFromPropertyList=function(_d9,_da){
var _db=new CFMutableData();
_db.setRawString(CFPropertyList.stringFromPropertyList(_d9,_da));
return _db;
};
CFPropertyList.stringFromPropertyList=function(_dc,_dd){
if(!_dd){
_dd=CFPropertyList.Format280North_v1_0;
}
var _de=_df[_dd];
return _de["start"]()+_e0(_dc,_de)+_de["finish"]();
};
function _e0(_e1,_e2){
var _e3=typeof _e1,_e4=_e1.valueOf(),_e5=typeof _e4;
if(_e3!==_e5){
_e3=_e5;
_e1=_e4;
}
if(_e1===YES||_e1===NO){
_e3="boolean";
}else{
if(_e3==="number"){
if(FLOOR(_e1)===_e1&&(""+_e1).indexOf("e")==-1){
_e3="integer";
}else{
_e3="real";
}
}else{
if(_e3!=="string"){
if(_e1.slice){
_e3="array";
}else{
_e3="dictionary";
}
}
}
}
return _e2[_e3](_e1,_e2);
};
var _df={};
_df[CFPropertyList.FormatXML_v1_0]={"start":function(){
return CFPropertyList.FormatXMLDTD+"<plist version = \"1.0\">";
},"finish":function(){
return "</plist>";
},"string":function(_e6){
return "<string>"+_e7(_e6)+"</string>";
},"boolean":function(_e8){
return _e8?"<true/>":"<false/>";
},"integer":function(_e9){
return "<integer>"+_e9+"</integer>";
},"real":function(_ea){
return "<real>"+_ea+"</real>";
},"array":function(_eb,_ec){
var _ed=0,_ee=_eb.length,_ef="<array>";
for(;_ed<_ee;++_ed){
_ef+=_e0(_eb[_ed],_ec);
}
return _ef+"</array>";
},"dictionary":function(_f0,_f1){
var _f2=_f0._keys,_a9=0,_f3=_f2.length,_f4="<dict>";
for(;_a9<_f3;++_a9){
var key=_f2[_a9];
_f4+="<key>"+key+"</key>";
_f4+=_e0(_f0.valueForKey(key),_f1);
}
return _f4+"</dict>";
}};
var _f5="A",_f6="D",_f7="f",_f8="d",_f9="S",_fa="T",_fb="F",_fc="K",_fd="E";
_df[CFPropertyList.Format280North_v1_0]={"start":function(){
return CFPropertyList.Format280NorthMagicNumber+";1.0;";
},"finish":function(){
return "";
},"string":function(_fe){
return _f9+";"+_fe.length+";"+_fe;
},"boolean":function(_ff){
return (_ff?_fa:_fb)+";";
},"integer":function(_100){
var _101=""+_100;
return _f8+";"+_101.length+";"+_101;
},"real":function(_102){
var _103=""+_102;
return _f7+";"+_103.length+";"+_103;
},"array":function(_104,_105){
var _106=0,_107=_104.length,_108=_f5+";";
for(;_106<_107;++_106){
_108+=_e0(_104[_106],_105);
}
return _108+_fd+";";
},"dictionary":function(_109,_10a){
var keys=_109._keys,_a9=0,_10b=keys.length,_10c=_f6+";";
for(;_a9<_10b;++_a9){
var key=keys[_a9];
_10c+=_fc+";"+key.length+";"+key;
_10c+=_e0(_109.valueForKey(key),_10a);
}
return _10c+_fd+";";
}};
var _10d="xml",_10e="#document",_10f="plist",_110="key",_111="dict",_112="array",_113="string",_114="date",_115="true",_116="false",_117="real",_118="integer",_119="data";
var _11a=function(_11b){
var text="",_a9=0,_11c=_11b.length;
for(;_a9<_11c;++_a9){
var node=_11b[_a9];
if(node.nodeType===3||node.nodeType===4){
text+=node.nodeValue;
}else{
if(node.nodeType!==8){
text+=_11a(node.childNodes);
}
}
}
return text;
};
var _11d=function(_11e,_11f,_120){
var node=_11e;
node=node.firstChild;
if(node!=NULL&&(node.nodeType===8||node.nodeType===3||node.nodeType===7)){
while((node=node.nextSibling)&&(node.nodeType===8||node.nodeType===3||node.nodeType===7)){
}
}
if(node){
return node;
}
if(String(_11e.nodeName)===_112||String(_11e.nodeName)===_111){
_120.pop();
}else{
if(node===_11f){
return NULL;
}
node=_11e;
while((node=node.nextSibling)&&(node.nodeType===8||node.nodeType===3||node.nodeType===7)){
}
if(node){
return node;
}
}
node=_11e;
while(node){
var next=node;
while((next=next.nextSibling)&&(next.nodeType===8||next.nodeType===3||next.nodeType===7)){
}
if(next){
return next;
}
var node=node.parentNode;
if(_11f&&node===_11f){
return NULL;
}
_120.pop();
}
return NULL;
};
CFPropertyList.propertyListFromData=function(_121,_122){
return CFPropertyList.propertyListFromString(_121.rawString(),_122);
};
CFPropertyList.propertyListFromString=function(_123,_124){
if(!_124){
_124=CFPropertyList.sniffedFormatOfString(_123);
}
if(_124===CFPropertyList.FormatXML_v1_0){
return CFPropertyList.propertyListFromXML(_123);
}
if(_124===CFPropertyList.Format280North_v1_0){
return _125(_123);
}
return NULL;
};
var _f5="A",_f6="D",_f7="f",_f8="d",_f9="S",_fa="T",_fb="F",_fc="K",_fd="E";
function _125(_126){
var _127=new _128(_126),_129=NULL,key="",_12a=NULL,_12b=NULL,_12c=[],_12d=NULL;
while(_129=_127.getMarker()){
if(_129===_fd){
_12c.pop();
continue;
}
var _12e=_12c.length;
if(_12e){
_12d=_12c[_12e-1];
}
if(_129===_fc){
key=_127.getString();
_129=_127.getMarker();
}
switch(_129){
case _f5:
_12a=[];
_12c.push(_12a);
break;
case _f6:
_12a=new CFMutableDictionary();
_12c.push(_12a);
break;
case _f7:
_12a=parseFloat(_127.getString());
break;
case _f8:
_12a=parseInt(_127.getString(),10);
break;
case _f9:
_12a=_127.getString();
break;
case _fa:
_12a=YES;
break;
case _fb:
_12a=NO;
break;
default:
throw new Error("*** "+_129+" marker not recognized in Plist.");
}
if(!_12b){
_12b=_12a;
}else{
if(_12d){
if(_12d.slice){
_12d.push(_12a);
}else{
_12d.setValueForKey(key,_12a);
}
}
}
}
return _12b;
};
function _e7(_12f){
return ((((_12f.replace(/&/g,"&amp;")).replace(/"/g,"&quot;")).replace(/'/g,"&apos;")).replace(/</g,"&lt;")).replace(/>/g,"&gt;");
};
function _130(_131){
return ((((_131.replace(/&quot;/g,"\"")).replace(/&apos;/g,"'")).replace(/&lt;/g,"<")).replace(/&gt;/g,">")).replace(/&amp;/g,"&");
};
function _ae(_132){
if(window.DOMParser){
return (new window.DOMParser()).parseFromString(_132,"text/xml")&&((new window.DOMParser()).parseFromString(_132,"text/xml")).documentElement;
}else{
if(window.ActiveXObject){
XMLNode=new ActiveXObject("Microsoft.XMLDOM");
var _133=_132.match(CFPropertyList.DTDRE);
if(_133){
_132=_132.substr(_133[0].length);
}
XMLNode.loadXML(_132);
return XMLNode;
}
}
return NULL;
};
CFPropertyList.propertyListFromXML=function(_134){
var _135=_134;
if(_134.valueOf&&typeof _134.valueOf()==="string"){
_135=_ae(_134);
}
while(_135&&(String(_135.nodeName)===_10e||String(_135.nodeName)===_10d)){
_135=_135.firstChild;
if(_135!=NULL&&(_135.nodeType===8||_135.nodeType===3||_135.nodeType===7)){
while((_135=_135.nextSibling)&&(_135.nodeType===8||_135.nodeType===3||_135.nodeType===7)){
}
}
}
if(_135&&_135.nodeType===10){
while((_135=_135.nextSibling)&&(_135.nodeType===8||_135.nodeType===3||_135.nodeType===7)){
}
}
if(!_135||!(String(_135.nodeName)===_10f)){
return NULL;
}
var key="",_136=NULL,_137=NULL,_138=_135,_139=[],_13a=NULL;
while(_135=_11d(_135,_138,_139)){
var _13b=_139.length;
if(_13b){
_13a=_139[_13b-1];
}
if(String(_135.nodeName)===_110){
key=_135.textContent||_135.textContent!==""&&_11a([_135]);
while((_135=_135.nextSibling)&&(_135.nodeType===8||_135.nodeType===3||_135.nodeType===7)){
}
}
switch(String(String(_135.nodeName))){
case _112:
_136=[];
_139.push(_136);
break;
case _111:
_136=new CFMutableDictionary();
_139.push(_136);
break;
case _117:
_136=parseFloat(_135.textContent||_135.textContent!==""&&_11a([_135]));
break;
case _118:
_136=parseInt(_135.textContent||_135.textContent!==""&&_11a([_135]),10);
break;
case _113:
if(_135.getAttribute("type")==="base64"){
_136=_135.firstChild?CFData.decodeBase64ToString(_135.textContent||_135.textContent!==""&&_11a([_135])):"";
}else{
_136=_130(_135.firstChild?_135.textContent||_135.textContent!==""&&_11a([_135]):"");
}
break;
case _114:
var _13c=Date.parseISO8601(_135.textContent||_135.textContent!==""&&_11a([_135]));
_136=isNaN(_13c)?new Date():new Date(_13c);
break;
case _115:
_136=YES;
break;
case _116:
_136=NO;
break;
case _119:
_136=new CFMutableData();
var _13d=_135.firstChild?CFData.decodeBase64ToArray(_135.textContent||_135.textContent!==""&&_11a([_135]),YES):[];
_136.setBytes(_13d);
break;
default:
throw new Error("*** "+String(_135.nodeName)+" tag not recognized in Plist.");
}
if(!_137){
_137=_136;
}else{
if(_13a){
if(_13a.slice){
_13a.push(_136);
}else{
_13a.setValueForKey(key,_136);
}
}
}
}
return _137;
};
kCFPropertyListOpenStepFormat=CFPropertyList.FormatOpenStep;
kCFPropertyListXMLFormat_v1_0=CFPropertyList.FormatXML_v1_0;
kCFPropertyListBinaryFormat_v1_0=CFPropertyList.FormatBinary_v1_0;
kCFPropertyList280NorthFormat_v1_0=CFPropertyList.Format280North_v1_0;
CFPropertyListCreate=function(){
return new CFPropertyList();
};
CFPropertyListCreateFromXMLData=function(data){
return CFPropertyList.propertyListFromData(data,CFPropertyList.FormatXML_v1_0);
};
CFPropertyListCreateXMLData=function(_13e){
return CFPropertyList.dataFromPropertyList(_13e,CFPropertyList.FormatXML_v1_0);
};
CFPropertyListCreateFrom280NorthData=function(data){
return CFPropertyList.propertyListFromData(data,CFPropertyList.Format280North_v1_0);
};
CFPropertyListCreate280NorthData=function(_13f){
return CFPropertyList.dataFromPropertyList(_13f,CFPropertyList.Format280North_v1_0);
};
CPPropertyListCreateFromData=function(data,_140){
return CFPropertyList.propertyListFromData(data,_140);
};
CPPropertyListCreateData=function(_141,_142){
return CFPropertyList.dataFromPropertyList(_141,_142);
};
CFDictionary=function(_143){
this._keys=[];
this._count=0;
this._buckets={};
this._UID=objj_generateObjectUID();
};
var _144=Array.prototype.indexOf,_8e=Object.prototype.hasOwnProperty;
CFDictionary.prototype.copy=function(){
return this;
};
CFDictionary.prototype.mutableCopy=function(){
var _145=new CFMutableDictionary(),keys=this._keys,_146=this._count;
_145._keys=keys.slice();
_145._count=_146;
var _147=0,_148=this._buckets,_149=_145._buckets;
for(;_147<_146;++_147){
var key=keys[_147];
_149[key]=_148[key];
}
return _145;
};
CFDictionary.prototype.containsKey=function(aKey){
return _8e.apply(this._buckets,[aKey]);
};
CFDictionary.prototype.containsValue=function(_14a){
var keys=this._keys,_14b=this._buckets,_a9=0,_14c=keys.length;
for(;_a9<_14c;++_a9){
if(_14b[keys[_a9]]===_14a){
return YES;
}
}
return NO;
};
CFDictionary.prototype.count=function(){
return this._count;
};
CFDictionary.prototype.countOfKey=function(aKey){
return this.containsKey(aKey)?1:0;
};
CFDictionary.prototype.countOfValue=function(_14d){
var keys=this._keys,_14e=this._buckets,_a9=0,_14f=keys.length,_150=0;
for(;_a9<_14f;++_a9){
if(_14e[keys[_a9]]===_14d){
++_150;
}
}
return _150;
};
CFDictionary.prototype.keys=function(){
return this._keys.slice();
};
CFDictionary.prototype.valueForKey=function(aKey){
var _151=this._buckets;
if(!_8e.apply(_151,[aKey])){
return nil;
}
return _151[aKey];
};
CFDictionary.prototype.toString=function(){
var _152="{\n",keys=this._keys,_a9=0,_153=this._count;
for(;_a9<_153;++_a9){
var key=keys[_a9];
_152+="\t"+key+" = \""+((String(this.valueForKey(key))).split("\n")).join("\n\t")+"\"\n";
}
return _152+"}";
};
CFMutableDictionary=function(_154){
CFDictionary.apply(this,[]);
};
CFMutableDictionary.prototype=new CFDictionary();
CFMutableDictionary.prototype.copy=function(){
return this.mutableCopy();
};
CFMutableDictionary.prototype.addValueForKey=function(aKey,_155){
if(this.containsKey(aKey)){
return;
}
++this._count;
this._keys.push(aKey);
this._buckets[aKey]=_155;
};
CFMutableDictionary.prototype.removeValueForKey=function(aKey){
var _156=-1;
if(_144){
_156=_144.call(this._keys,aKey);
}else{
var keys=this._keys,_a9=0,_157=keys.length;
for(;_a9<_157;++_a9){
if(keys[_a9]===aKey){
_156=_a9;
break;
}
}
}
if(_156===-1){
return;
}
--this._count;
this._keys.splice(_156,1);
delete this._buckets[aKey];
};
CFMutableDictionary.prototype.removeAllValues=function(){
this._count=0;
this._keys=[];
this._buckets={};
};
CFMutableDictionary.prototype.replaceValueForKey=function(aKey,_158){
if(!this.containsKey(aKey)){
return;
}
this._buckets[aKey]=_158;
};
CFMutableDictionary.prototype.setValueForKey=function(aKey,_159){
if(_159==nil){
this.removeValueForKey(aKey);
}else{
if(this.containsKey(aKey)){
this.replaceValueForKey(aKey,_159);
}else{
this.addValueForKey(aKey,_159);
}
}
};
kCFErrorLocalizedDescriptionKey="CPLocalizedDescription";
kCFErrorLocalizedFailureReasonKey="CPLocalizedFailureReason";
kCFErrorLocalizedRecoverySuggestionKey="CPLocalizedRecoverySuggestion";
kCFErrorDescriptionKey="CPDescription";
kCFErrorUnderlyingErrorKey="CPUnderlyingError";
kCFErrorURLKey="CPURL";
kCFErrorFilePathKey="CPFilePath";
kCFErrorDomainCappuccino="CPCappuccinoErrorDomain";
kCFErrorDomainCocoa=kCFErrorDomainCappuccino;
CFError=function(_15a,code,_15b){
this._domain=_15a||NULL;
this._code=code||0;
this._userInfo=_15b||new CFDictionary();
this._UID=objj_generateObjectUID();
};
CFError.prototype.domain=function(){
return this._domain;
};
CFError.prototype.code=function(){
return this._code;
};
CFError.prototype.description=function(){
var _15c=this._userInfo.valueForKey(kCFErrorLocalizedDescriptionKey);
if(_15c){
return _15c;
}
var _15d=this._userInfo.valueForKey(kCFErrorLocalizedFailureReasonKey);
if(_15d){
var _15e="The operation couldn’t be completed. "+_15d;
return _15e;
}
var _15f="",desc=this._userInfo.valueForKey(kCFErrorDescriptionKey);
if(desc){
var _15f="The operation couldn’t be completed. (error "+this._code+" - "+desc+")";
}else{
var _15f="The operation couldn’t be completed. (error "+this._code+")";
}
return _15f;
};
CFError.prototype.failureReason=function(){
return this._userInfo.valueForKey(kCFErrorLocalizedFailureReasonKey);
};
CFError.prototype.recoverySuggestion=function(){
return this._userInfo.valueForKey(kCFErrorLocalizedRecoverySuggestionKey);
};
CFError.prototype.userInfo=function(){
return this._userInfo;
};
CFErrorCreate=function(_160,code,_161){
return new CFError(_160,code,_161);
};
CFErrorCreateWithUserInfoKeysAndValues=function(_162,code,_163,_164,_165){
var _166=new CFMutableDictionary();
while(_165--){
_166.setValueForKey(_163[_165],_164[_165]);
}
return new CFError(_162,code,_166);
};
CFErrorGetCode=function(err){
return err.code();
};
CFErrorGetDomain=function(err){
return err.domain();
};
CFErrorCopyDescription=function(err){
return err.description();
};
CFErrorCopyUserInfo=function(err){
return err.userInfo();
};
CFErrorCopyFailureReason=function(err){
return err.failureReason();
};
CFErrorCopyRecoverySuggestion=function(err){
return err.recoverySuggestion();
};
kCFURLErrorUnknown=-998;
kCFURLErrorCancelled=-999;
kCFURLErrorBadURL=-1000;
kCFURLErrorTimedOut=-1001;
kCFURLErrorUnsupportedURL=-1002;
kCFURLErrorCannotFindHost=-1003;
kCFURLErrorCannotConnectToHost=-1004;
kCFURLErrorNetworkConnectionLost=-1005;
kCFURLErrorDNSLookupFailed=-1006;
kCFURLErrorHTTPTooManyRedirects=-1007;
kCFURLErrorResourceUnavailable=-1008;
kCFURLErrorNotConnectedToInternet=-1009;
kCFURLErrorRedirectToNonExistentLocation=-1010;
kCFURLErrorBadServerResponse=-1011;
kCFURLErrorUserCancelledAuthentication=-1012;
kCFURLErrorUserAuthenticationRequired=-1013;
kCFURLErrorZeroByteResource=-1014;
kCFURLErrorCannotDecodeRawData=-1015;
kCFURLErrorCannotDecodeContentData=-1016;
kCFURLErrorCannotParseResponse=-1017;
kCFURLErrorRequestBodyStreamExhausted=-1021;
kCFURLErrorFileDoesNotExist=-1100;
kCFURLErrorFileIsDirectory=-1101;
kCFURLErrorNoPermissionsToReadFile=-1102;
kCFURLErrorDataLengthExceedsMaximum=-1103;
CFData=function(){
this._rawString=NULL;
this._propertyList=NULL;
this._propertyListFormat=NULL;
this._JSONObject=NULL;
this._bytes=NULL;
this._base64=NULL;
};
CFData.prototype.propertyList=function(){
if(!this._propertyList){
this._propertyList=CFPropertyList.propertyListFromString(this.rawString());
}
return this._propertyList;
};
CFData.prototype.JSONObject=function(){
if(!this._JSONObject){
try{
this._JSONObject=JSON.parse(this.rawString());
}
catch(anException){
}
}
return this._JSONObject;
};
CFData.prototype.rawString=function(){
if(this._rawString===NULL){
if(this._propertyList){
this._rawString=CFPropertyList.stringFromPropertyList(this._propertyList,this._propertyListFormat);
}else{
if(this._JSONObject){
this._rawString=JSON.stringify(this._JSONObject);
}else{
if(this._bytes){
this._rawString=CFData.bytesToString(this._bytes);
}else{
if(this._base64){
this._rawString=CFData.decodeBase64ToString(this._base64,true);
}else{
throw new Error("Can't convert data to string.");
}
}
}
}
}
return this._rawString;
};
CFData.prototype.bytes=function(){
if(this._bytes===NULL){
var _167=CFData.stringToBytes(this.rawString());
this.setBytes(_167);
}
return this._bytes;
};
CFData.prototype.base64=function(){
if(this._base64===NULL){
var _168;
if(this._bytes){
_168=CFData.encodeBase64Array(this._bytes);
}else{
_168=CFData.encodeBase64String(this.rawString());
}
this.setBase64String(_168);
}
return this._base64;
};
CFMutableData=function(){
CFData.call(this);
};
CFMutableData.prototype=new CFData();
function _169(_16a){
this._rawString=NULL;
this._propertyList=NULL;
this._propertyListFormat=NULL;
this._JSONObject=NULL;
this._bytes=NULL;
this._base64=NULL;
};
CFMutableData.prototype.setPropertyList=function(_16b,_16c){
_169(this);
this._propertyList=_16b;
this._propertyListFormat=_16c;
};
CFMutableData.prototype.setJSONObject=function(_16d){
_169(this);
this._JSONObject=_16d;
};
CFMutableData.prototype.setRawString=function(_16e){
_169(this);
this._rawString=_16e;
};
CFMutableData.prototype.setBytes=function(_16f){
_169(this);
this._bytes=_16f;
};
CFMutableData.prototype.setBase64String=function(_170){
_169(this);
this._base64=_170;
};
var _171=["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9","+","/","="],_172=[];
for(var i=0;i<_171.length;i++){
_172[_171[i].charCodeAt(0)]=i;
}
CFData.decodeBase64ToArray=function(_173,_174){
if(_174){
_173=_173.replace(/[^A-Za-z0-9\+\/\=]/g,"");
}
var pad=(_173[_173.length-1]=="="?1:0)+(_173[_173.length-2]=="="?1:0),_175=_173.length,_176=[];
var i=0;
while(i<_175){
var bits=_172[_173.charCodeAt(i++)]<<18|_172[_173.charCodeAt(i++)]<<12|_172[_173.charCodeAt(i++)]<<6|_172[_173.charCodeAt(i++)];
_176.push((bits&16711680)>>16);
_176.push((bits&65280)>>8);
_176.push(bits&255);
}
if(pad>0){
return _176.slice(0,-1*pad);
}
return _176;
};
CFData.encodeBase64Array=function(_177){
var pad=(3-_177.length%3)%3,_178=_177.length+pad,_179=[];
if(pad>0){
_177.push(0);
}
if(pad>1){
_177.push(0);
}
var i=0;
while(i<_178){
var bits=_177[i++]<<16|_177[i++]<<8|_177[i++];
_179.push(_171[(bits&16515072)>>18]);
_179.push(_171[(bits&258048)>>12]);
_179.push(_171[(bits&4032)>>6]);
_179.push(_171[bits&63]);
}
if(pad>0){
_179[_179.length-1]="=";
_177.pop();
}
if(pad>1){
_179[_179.length-2]="=";
_177.pop();
}
return _179.join("");
};
CFData.decodeBase64ToString=function(_17a,_17b){
return CFData.bytesToString(CFData.decodeBase64ToArray(_17a,_17b));
};
CFData.decodeBase64ToUtf16String=function(_17c,_17d){
return CFData.bytesToUtf16String(CFData.decodeBase64ToArray(_17c,_17d));
};
CFData.bytesToString=function(_17e){
return String.fromCharCode.apply(NULL,_17e);
};
CFData.stringToBytes=function(_17f){
var temp=[];
for(var i=0;i<_17f.length;i++){
temp.push(_17f.charCodeAt(i));
}
return temp;
};
CFData.encodeBase64String=function(_180){
var temp=[];
for(var i=0;i<_180.length;i++){
temp.push(_180.charCodeAt(i));
}
return CFData.encodeBase64Array(temp);
};
CFData.bytesToUtf16String=function(_181){
var temp=[];
for(var i=0;i<_181.length;i+=2){
temp.push(_181[i+1]<<8|_181[i]);
}
return String.fromCharCode.apply(NULL,temp);
};
CFData.encodeBase64Utf16String=function(_182){
var temp=[];
for(var i=0;i<_182.length;i++){
var c=_182.charCodeAt(i);
temp.push(c&255);
temp.push((c&65280)>>8);
}
return CFData.encodeBase64Array(temp);
};
var _183,_184,_185=0;
function _186(){
if(++_185!==1){
return;
}
_183={};
_184={};
};
function _187(){
_185=MAX(_185-1,0);
if(_185!==0){
return;
}
delete _183;
delete _184;
};
var _188=new RegExp("^"+"(?:"+"([^:/?#]+):"+")?"+"(?:"+"(//)"+"("+"(?:"+"("+"([^:@]*)"+":?"+"([^:@]*)"+")?"+"@"+")?"+"([^:/?#]*)"+"(?::(\\d*))?"+")"+")?"+"([^?#]*)"+"(?:\\?([^#]*))?"+"(?:#(.*))?");
var _189=["url","scheme","authorityRoot","authority","userInfo","user","password","domain","portNumber","path","queryString","fragment"];
function _18a(aURL){
if(aURL._parts){
return aURL._parts;
}
var _18b=aURL.string(),_18c=_18b.match(/^mhtml:/);
if(_18c){
_18b=_18b.substr("mhtml:".length);
}
if(_185>0&&_8e.call(_184,_18b)){
aURL._parts=_184[_18b];
return aURL._parts;
}
aURL._parts={};
var _18d=aURL._parts,_18e=_188.exec(_18b),_a9=_18e.length;
while(_a9--){
_18d[_189[_a9]]=_18e[_a9]||NULL;
}
_18d.portNumber=parseInt(_18d.portNumber,10);
if(isNaN(_18d.portNumber)){
_18d.portNumber=-1;
}
_18d.pathComponents=[];
if(_18d.path){
var _18f=_18d.path.split("/"),_190=_18d.pathComponents,_191=_18f.length;
for(_a9=0;_a9<_191;++_a9){
var _192=_18f[_a9];
if(_192){
_190.push(_192);
}else{
if(_a9===0){
_190.push("/");
}
}
}
_18d.pathComponents=_190;
}
if(_18c){
_18d.url="mhtml:"+_18d.url;
_18d.scheme="mhtml:"+_18d.scheme;
}
if(_185>0){
_184[_18b]=_18d;
}
return _18d;
};
CFURL=function(aURL,_193){
aURL=aURL||"";
if(aURL instanceof CFURL){
if(!_193){
return new CFURL(aURL.absoluteString());
}
var _194=aURL.baseURL();
if(_194){
_193=new CFURL(_194.absoluteURL(),_193);
}
aURL=aURL.string();
}
if(_185>0){
var _195=aURL+" "+(_193&&_193.UID()||"");
if(_8e.call(_183,_195)){
return _183[_195];
}
_183[_195]=this;
}
if(aURL.match(/^data:/)){
var _196={},_a9=_189.length;
while(_a9--){
_196[_189[_a9]]="";
}
_196.url=aURL;
_196.scheme="data";
_196.pathComponents=[];
this._parts=_196;
this._standardizedURL=this;
this._absoluteURL=this;
}
this._UID=objj_generateObjectUID();
this._string=aURL;
this._baseURL=_193;
};
CFURL.prototype.UID=function(){
return this._UID;
};
var _197={};
CFURL.prototype.mappedURL=function(){
return _197[this.absoluteString()]||this;
};
CFURL.setMappedURLForURL=function(_198,_199){
_197[_198.absoluteString()]=_199;
};
CFURL.prototype.schemeAndAuthority=function(){
var _19a="",_19b=this.scheme();
if(_19b){
_19a+=_19b+":";
}
var _19c=this.authority();
if(_19c){
_19a+="//"+_19c;
}
return _19a;
};
CFURL.prototype.absoluteString=function(){
if(this._absoluteString===_1b){
this._absoluteString=(this.absoluteURL()).string();
}
return this._absoluteString;
};
CFURL.prototype.toString=function(){
return this.absoluteString();
};
function _19d(aURL){
aURL=aURL.standardizedURL();
var _19e=aURL.baseURL();
if(!_19e){
return aURL;
}
var _19f=aURL._parts||_18a(aURL),_1a0,_1a1=_19e.absoluteURL(),_1a2=_1a1._parts||_18a(_1a1);
if(!_19f.scheme&&_19f.authorityRoot){
_1a0=_1a3(_19f);
_1a0.scheme=_19e.scheme();
}else{
if(_19f.scheme||_19f.authority){
_1a0=_19f;
}else{
_1a0={};
_1a0.scheme=_1a2.scheme;
_1a0.authority=_1a2.authority;
_1a0.userInfo=_1a2.userInfo;
_1a0.user=_1a2.user;
_1a0.password=_1a2.password;
_1a0.domain=_1a2.domain;
_1a0.portNumber=_1a2.portNumber;
_1a0.queryString=_19f.queryString;
_1a0.fragment=_19f.fragment;
var _1a4=_19f.pathComponents;
if(_1a4.length&&_1a4[0]==="/"){
_1a0.path=_19f.path;
_1a0.pathComponents=_1a4;
}else{
var _1a5=_1a2.pathComponents,_1a6=_1a5.concat(_1a4);
if(!_19e.hasDirectoryPath()&&_1a5.length){
_1a6.splice(_1a5.length-1,1);
}
if(_1a4.length&&(_1a4[0]===".."||_1a4[0]===".")){
_1a7(_1a6,YES);
}
_1a0.pathComponents=_1a6;
_1a0.path=_1a8(_1a6,_1a4.length<=0||aURL.hasDirectoryPath());
}
}
}
var _1a9=_1aa(_1a0),_1ab=new CFURL(_1a9);
_1ab._parts=_1a0;
_1ab._standardizedURL=_1ab;
_1ab._standardizedString=_1a9;
_1ab._absoluteURL=_1ab;
_1ab._absoluteString=_1a9;
return _1ab;
};
function _1a8(_1ac,_1ad){
var path=_1ac.join("/");
if(path.length&&path.charAt(0)==="/"){
path=path.substr(1);
}
if(_1ad){
path+="/";
}
return path;
};
function _1a7(_1ae,_1af){
var _1b0=0,_1b1=0,_1b2=_1ae.length,_1b3=_1af?_1ae:[],_1b4=NO;
for(;_1b0<_1b2;++_1b0){
var _1b5=_1ae[_1b0];
if(_1b5===""){
continue;
}
if(_1b5==="."){
_1b4=_1b1===0;
continue;
}
if(_1b5!==".."||_1b1===0||_1b3[_1b1-1]===".."){
_1b3[_1b1]=_1b5;
_1b1++;
continue;
}
if(_1b1>0&&_1b3[_1b1-1]!=="/"){
--_1b1;
}
}
if(_1b4&&_1b1===0){
_1b3[_1b1++]=".";
}
_1b3.length=_1b1;
return _1b3;
};
function _1aa(_1b6){
var _1b7="",_1b8=_1b6.scheme;
if(_1b8){
_1b7+=_1b8+":";
}
var _1b9=_1b6.authority;
if(_1b9){
_1b7+="//"+_1b9;
}
_1b7+=_1b6.path;
var _1ba=_1b6.queryString;
if(_1ba){
_1b7+="?"+_1ba;
}
var _1bb=_1b6.fragment;
if(_1bb){
_1b7+="#"+_1bb;
}
return _1b7;
};
CFURL.prototype.absoluteURL=function(){
if(this._absoluteURL===_1b){
this._absoluteURL=_19d(this);
}
return this._absoluteURL;
};
CFURL.prototype.standardizedURL=function(){
if(this._standardizedURL===_1b){
var _1bc=this._parts||_18a(this),_1bd=_1bc.pathComponents,_1be=_1a7(_1bd,NO);
var _1bf=_1a8(_1be,this.hasDirectoryPath());
if(_1bc.path===_1bf){
this._standardizedURL=this;
}else{
var _1c0=_1a3(_1bc);
_1c0.pathComponents=_1be;
_1c0.path=_1bf;
var _1c1=new CFURL(_1aa(_1c0),this.baseURL());
_1c1._parts=_1c0;
_1c1._standardizedURL=_1c1;
this._standardizedURL=_1c1;
}
}
return this._standardizedURL;
};
function _1a3(_1c2){
var _1c3={},_1c4=_189.length;
while(_1c4--){
var _1c5=_189[_1c4];
_1c3[_1c5]=_1c2[_1c5];
}
return _1c3;
};
CFURL.prototype.string=function(){
return this._string;
};
CFURL.prototype.authority=function(){
var _1c6=(this._parts||_18a(this)).authority;
if(_1c6){
return _1c6;
}
var _1c7=this.baseURL();
return _1c7&&_1c7.authority()||"";
};
CFURL.prototype.hasDirectoryPath=function(){
var _1c8=this._hasDirectoryPath;
if(_1c8===_1b){
var path=this.path();
if(!path){
return NO;
}
if(path.charAt(path.length-1)==="/"){
return YES;
}
var _1c9=this.lastPathComponent();
_1c8=_1c9==="."||_1c9==="..";
this._hasDirectoryPath=_1c8;
}
return _1c8;
};
CFURL.prototype.hostName=function(){
return this.authority();
};
CFURL.prototype.fragment=function(){
return (this._parts||_18a(this)).fragment;
};
CFURL.prototype.lastPathComponent=function(){
if(this._lastPathComponent===_1b){
var _1ca=this.pathComponents(),_1cb=_1ca.length;
if(!_1cb){
this._lastPathComponent="";
}else{
this._lastPathComponent=_1ca[_1cb-1];
}
}
return this._lastPathComponent;
};
CFURL.prototype.path=function(){
return (this._parts||_18a(this)).path;
};
CFURL.prototype.createCopyDeletingLastPathComponent=function(){
var _1cc=this._parts||_18a(this),_1cd=_1a7(_1cc.pathComponents,NO);
if(_1cd.length>0){
if(_1cd.length>1||_1cd[0]!=="/"){
_1cd.pop();
}
}
var _1ce=_1cd.length===1&&_1cd[0]==="/";
_1cc.pathComponents=_1cd;
_1cc.path=_1ce?"/":_1a8(_1cd,NO);
return new CFURL(_1aa(_1cc));
};
CFURL.prototype.pathComponents=function(){
return (this._parts||_18a(this)).pathComponents;
};
CFURL.prototype.pathExtension=function(){
var _1cf=this.lastPathComponent();
if(!_1cf){
return NULL;
}
_1cf=_1cf.replace(/^\.*/,"");
var _1d0=_1cf.lastIndexOf(".");
return _1d0<=0?"":_1cf.substring(_1d0+1);
};
CFURL.prototype.queryString=function(){
return (this._parts||_18a(this)).queryString;
};
CFURL.prototype.scheme=function(){
var _1d1=this._scheme;
if(_1d1===_1b){
_1d1=(this._parts||_18a(this)).scheme;
if(!_1d1){
var _1d2=this.baseURL();
_1d1=_1d2&&_1d2.scheme();
}
this._scheme=_1d1;
}
return _1d1;
};
CFURL.prototype.user=function(){
return (this._parts||_18a(this)).user;
};
CFURL.prototype.password=function(){
return (this._parts||_18a(this)).password;
};
CFURL.prototype.portNumber=function(){
return (this._parts||_18a(this)).portNumber;
};
CFURL.prototype.domain=function(){
return (this._parts||_18a(this)).domain;
};
CFURL.prototype.baseURL=function(){
return this._baseURL;
};
CFURL.prototype.asDirectoryPathURL=function(){
if(this.hasDirectoryPath()){
return this;
}
var _1d3=this.lastPathComponent();
if(_1d3!=="/"){
_1d3="./"+_1d3;
}
return new CFURL(_1d3+"/",this);
};
function _1d4(aURL){
if(!aURL._resourcePropertiesForKeys){
aURL._resourcePropertiesForKeys=new CFMutableDictionary();
}
return aURL._resourcePropertiesForKeys;
};
CFURL.prototype.resourcePropertyForKey=function(aKey){
return (_1d4(this)).valueForKey(aKey);
};
CFURL.prototype.setResourcePropertyForKey=function(aKey,_1d5){
(_1d4(this)).setValueForKey(aKey,_1d5);
};
CFURL.prototype.staticResourceData=function(){
var data=new CFMutableData();
data.setRawString((_1d6.resourceAtURL(this)).contents());
return data;
};
function _128(_1d7){
this._string=_1d7;
var _1d8=_1d7.indexOf(";");
this._magicNumber=_1d7.substr(0,_1d8);
this._location=_1d7.indexOf(";",++_1d8);
this._version=_1d7.substring(_1d8,this._location++);
};
_128.prototype.magicNumber=function(){
return this._magicNumber;
};
_128.prototype.version=function(){
return this._version;
};
_128.prototype.getMarker=function(){
var _1d9=this._string,_1da=this._location;
if(_1da>=_1d9.length){
return null;
}
var next=_1d9.indexOf(";",_1da);
if(next<0){
return null;
}
var _1db=_1d9.substring(_1da,next);
if(_1db==="e"){
return null;
}
this._location=next+1;
return _1db;
};
_128.prototype.getString=function(){
var _1dc=this._string,_1dd=this._location;
if(_1dd>=_1dc.length){
return null;
}
var next=_1dc.indexOf(";",_1dd);
if(next<0){
return null;
}
var size=parseInt(_1dc.substring(_1dd,next),10),text=_1dc.substr(next+1,size);
this._location=next+1+size;
return text;
};
var _1de=0,_1df=1<<0,_1e0=1<<1,_1e1=1<<2,_1e2=1<<3,_1e3=1<<4,_1e4=1<<5;
var _1e5={},_1e6={},_1e7={},_1e8=(new Date()).getTime(),_1e9=0,_1ea=0;
var _1eb="CPBundleDefaultBrowserLanguage",_1ec="CPBundleDefaultLanguage";
CFBundle=function(aURL){
aURL=(_1ed(aURL)).asDirectoryPathURL();
var _1ee=aURL.absoluteString(),_1ef=_1e5[_1ee];
if(_1ef){
return _1ef;
}
_1e5[_1ee]=this;
this._bundleURL=aURL;
this._resourcesDirectoryURL=new CFURL("Resources/",aURL);
this._staticResource=NULL;
this._isValid=NO;
this._loadStatus=_1de;
this._loadRequests=[];
this._infoDictionary=new CFDictionary();
this._eventDispatcher=new _89(this);
this._localizableStrings=[];
this._loadedLanguage=NULL;
};
CFBundle.environments=function(){
return ["Browser","ObjJ"];
};
CFBundle.bundleContainingURL=function(aURL){
aURL=new CFURL(".",_1ed(aURL));
var _1f0,_1f1=aURL.absoluteString();
while(!_1f0||_1f0!==_1f1){
var _1f2=_1e5[_1f1];
if(_1f2&&_1f2._isValid){
return _1f2;
}
aURL=new CFURL("..",aURL);
_1f0=_1f1;
_1f1=aURL.absoluteString();
}
return NULL;
};
CFBundle.mainBundle=function(){
return new CFBundle(_1f3);
};
function _1f4(_1f5,_1f6){
if(_1f6){
_1e6[_1f5.name]=_1f6;
}
};
function _1f7(){
_1e5={};
_1e6={};
_1e7={};
_1e9=0;
_1ea=0;
};
CFBundle.bundleForClass=function(_1f8){
return _1e6[_1f8.name]||CFBundle.mainBundle();
};
CFBundle.bundleWithIdentifier=function(_1f9){
return _1e7[_1f9]||NULL;
};
CFBundle.prototype.bundleURL=function(){
return this._bundleURL.absoluteURL();
};
CFBundle.prototype.resourcesDirectoryURL=function(){
return this._resourcesDirectoryURL;
};
CFBundle.prototype.resourceURL=function(_1fa,_1fb,_1fc,_1fd){
if(_1fb){
_1fa=_1fa+"."+_1fb;
}
if(_1fd){
_1fa=_1fd+_1fa;
}
if(_1fc){
_1fa=_1fc+"/"+_1fa;
}
var _1fe=(new CFURL(_1fa,this.resourcesDirectoryURL())).mappedURL();
return _1fe.absoluteURL();
};
CFBundle.prototype.mostEligibleEnvironmentURL=function(){
if(this._mostEligibleEnvironmentURL===_1b){
this._mostEligibleEnvironmentURL=new CFURL(this.mostEligibleEnvironment()+".environment/",this.bundleURL());
}
return this._mostEligibleEnvironmentURL;
};
CFBundle.prototype.executableURL=function(){
if(this._executableURL===_1b){
var _1ff=this.valueForInfoDictionaryKey("CPBundleExecutable");
if(!_1ff){
this._executableURL=NULL;
}else{
this._executableURL=new CFURL(_1ff,this.mostEligibleEnvironmentURL());
}
}
return this._executableURL;
};
CFBundle.prototype.infoDictionary=function(){
return this._infoDictionary;
};
CFBundle.prototype.loadedLanguage=function(){
return this._loadedLanguage;
};
CFBundle.prototype.valueForInfoDictionaryKey=function(aKey){
return this._infoDictionary.valueForKey(aKey);
};
CFBundle.prototype.identifier=function(){
return this._infoDictionary.valueForKey("CPBundleIdentifier");
};
CFBundle.prototype.hasSpritedImages=function(){
var _200=this._infoDictionary.valueForKey("CPBundleEnvironmentsWithImageSprites")||[],_a9=_200.length,_201=this.mostEligibleEnvironment();
while(_a9--){
if(_200[_a9]===_201){
return YES;
}
}
return NO;
};
CFBundle.prototype.environments=function(){
return this._infoDictionary.valueForKey("CPBundleEnvironments")||["ObjJ"];
};
CFBundle.prototype.mostEligibleEnvironment=function(_202){
_202=_202||this.environments();
var _203=CFBundle.environments(),_a9=0,_204=_203.length,_205=_202.length;
for(;_a9<_204;++_a9){
var _206=0,_207=_203[_a9];
for(;_206<_205;++_206){
if(_207===_202[_206]){
return _207;
}
}
}
return NULL;
};
CFBundle.prototype.isLoading=function(){
return this._loadStatus&_1df;
};
CFBundle.prototype.isLoaded=function(){
return !!(this._loadStatus&_1e4);
};
CFBundle.prototype.load=function(_208){
if(this._loadStatus!==_1de){
return;
}
this._loadStatus=_1df|_1e0;
var self=this,_209=this.bundleURL(),_20a=new CFURL("..",_209);
if(_20a.absoluteString()===_209.absoluteString()){
_20a=_20a.schemeAndAuthority();
}
_1d6.resolveResourceAtURL(_20a,YES,function(_20b){
var _20c=_209.lastPathComponent();
self._staticResource=_20b._children[_20c]||new _1d6(_209,_20b,YES,NO);
function _20d(_20e){
self._loadStatus&=~_1e0;
var _20f=_20e.request.responsePropertyList();
self._isValid=!!_20f||CFBundle.mainBundle()===self;
if(_20f){
self._infoDictionary=_20f;
var _210=self._infoDictionary.valueForKey("CPBundleIdentifier");
if(_210){
_1e7[_210]=self;
}
}
if(!self._infoDictionary){
_212(self,new Error("Could not load bundle at \""+path+"\""));
return;
}
if(self===CFBundle.mainBundle()&&self.valueForInfoDictionaryKey("CPApplicationSize")){
_1ea=(self.valueForInfoDictionaryKey("CPApplicationSize")).valueForKey("executable")||0;
}
_253(self);
_216(self,_208);
};
function _211(){
self._isValid=CFBundle.mainBundle()===self;
self._loadStatus=_1de;
_212(self,new Error("Could not load bundle at \""+self.bundleURL()+"\""));
};
new _ca(new CFURL("Info.plist",self.bundleURL()),_20d,_211);
});
};
function _212(_213,_214){
_215(_213._staticResource);
_213._eventDispatcher.dispatchEvent({type:"error",error:_214,bundle:_213});
};
function _216(_217,_218){
if(!_217.mostEligibleEnvironment()){
return _219();
}
_21a(_217,_21b,_219,_21c);
_21d(_217,_21b,_219,_21c);
_21e(_217,_21b,_219,_21c);
if(_217._loadStatus===_1df){
return _21b();
}
function _219(_21f){
var _220=_217._loadRequests,_221=_220.length;
while(_221--){
_220[_221].abort();
}
this._loadRequests=[];
_217._loadStatus=_1de;
_212(_217,_21f||new Error("Could not recognize executable code format in Bundle "+_217));
};
function _21c(_222){
if((typeof CPApp==="undefined"||!CPApp||!CPApp._finishedLaunching)&&typeof OBJJ_PROGRESS_CALLBACK==="function"){
_1e9+=_222;
var _223=_1ea?MAX(MIN(1,_1e9/_1ea),0):0;
OBJJ_PROGRESS_CALLBACK(_223,_1ea,_217.bundlePath());
}
};
function _21b(){
if(_217._loadStatus===_1df){
_217._loadStatus=_1e4;
}else{
return;
}
_215(_217._staticResource);
function _224(){
_217._eventDispatcher.dispatchEvent({type:"load",bundle:_217});
};
if(_218){
_225(_217,_224);
}else{
_224();
}
};
};
function _21a(_226,_227,_228,_229){
var _22a=_226.executableURL();
if(!_22a){
return;
}
_226._loadStatus|=_1e1;
new _ca(_22a,function(_22b){
try{
_22c(_226,_22b.request.responseText(),_22a);
_226._loadStatus&=~_1e1;
_227();
}
catch(anException){
_228(anException);
}
},_228,_229);
};
function _22d(_22e){
return "mhtml:"+new CFURL("MHTMLTest.txt",_22e.mostEligibleEnvironmentURL());
};
function _22f(_230){
if(_231===_232){
return new CFURL("dataURLs.txt",_230.mostEligibleEnvironmentURL());
}
if(_231===_233||_231===_234){
return new CFURL("MHTMLPaths.txt",_230.mostEligibleEnvironmentURL());
}
return NULL;
};
function _21d(_235,_236,_237,_238){
if(!_235.hasSpritedImages()){
return;
}
_235._loadStatus|=_1e2;
if(!_239()){
return _23a(_22d(_235),function(){
_21d(_235,_236,_237,_238);
});
}
var _23b=_22f(_235);
if(!_23b){
_235._loadStatus&=~_1e2;
return _236();
}
new _ca(_23b,function(_23c){
try{
_22c(_235,_23c.request.responseText(),_23b);
_235._loadStatus&=~_1e2;
_236();
}
catch(anException){
_237(anException);
}
},_237,_238);
};
function _21e(_23d,_23e,_23f,_240){
var _241=_23d._loadedLanguage;
if(!_241){
return;
}
var _242=_23d.valueForInfoDictionaryKey("CPBundleLocalizableStrings");
if(!_242){
return;
}
var self=_23d,_243=_242.length,_244=new CFURL(_241+".lproj/",self.resourcesDirectoryURL()),_245=0;
for(var i=0;i<_243;i++){
var _246=_242[i];
function _247(_248){
var _249=_248.request.responseText(),_24a=(new CFURL(_248.request._URL)).lastPathComponent();
try{
_24b(self,_249,_24a);
if(++_245==_243){
_23d._loadStatus&=~_1e3;
_23e();
}
}
catch(e){
_23f(new Error("Error when parsing the localizable file "+_24a));
}
};
_23d._loadStatus|=_1e3;
new _ca(new CFURL(_246,_244),_247,_23f,_240);
}
};
function _24b(_24c,_24d,_24e){
var _24f={},_250=_24d.split("\n"),_251;
_24c._localizableStrings[_24e]=_24f;
for(var i=0;i<_250.length;i++){
var line=_250[i];
if(line[0]=="/"){
_251=(line.substring(2,line.length-2)).trim();
continue;
}
if(line[0]=="\""){
var _252=line.split("\"");
var key=_252[1];
if(!(key in _24f)){
_24f[key]=_252[3];
}
key+=_251;
if(!(key in _24f)){
_24f[key]=_252[3];
}
continue;
}
}
};
function _253(_254){
if(_254._loadedLanguage){
return;
}
var _255=_254.valueForInfoDictionaryKey(_1ec);
if(_255!=_1eb&&_255){
_254._loadedLanguage=_255;
return;
}
if(typeof navigator=="undefined"){
return;
}
var _256=typeof navigator.language!=="undefined"?navigator.language:navigator.userLanguage;
if(!_256){
return;
}
_254._loadedLanguage=_256.substring(0,2);
};
var _257=[],_231=-1,_258=0,_232=1,_233=2,_234=3;
function _239(){
return _231!==-1;
};
function _23a(_259,_25a){
if(_239()){
return;
}
_257.push(_25a);
if(_257.length>1){
return;
}
_257.push(function(){
var size=0,_25b=(CFBundle.mainBundle()).valueForInfoDictionaryKey("CPApplicationSize");
if(!_25b){
return;
}
switch(_231){
case _232:
size=_25b.valueForKey("data");
break;
case _233:
case _234:
size=_25b.valueForKey("mhtml");
break;
}
_1ea+=size;
});
_25c([_232,"data:image/gif;base64,R0lGODlhAQABAIAAAMc9BQAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==",_233,_259+"!test",_234,_259+"?"+_1e8+"!test"]);
};
function _25d(){
var _25e=_257.length;
while(_25e--){
_257[_25e]();
}
};
function _25c(_25f){
if(!("Image" in _1)||_25f.length<2){
_231=_258;
_25d();
return;
}
var _260=new Image();
_260.onload=function(){
if(_260.width===1&&_260.height===1){
_231=_25f[0];
_25d();
}else{
_260.onerror();
}
};
_260.onerror=function(){
_25c(_25f.slice(2));
};
_260.src=_25f[1];
};
function _225(_261,_262){
var _263=[_261._staticResource];
function _264(_265){
for(;_265<_263.length;++_265){
var _266=_263[_265];
if(_266.isNotFound()){
continue;
}
if(_266.isFile()){
var _267=new _993(_266.URL());
if(_267.hasLoadedFileDependencies()){
_267.execute();
}else{
_267.loadFileDependencies(function(){
_264(_265);
});
return;
}
}else{
if((_266.URL()).absoluteString()===(_261.resourcesDirectoryURL()).absoluteString()){
continue;
}
var _268=_266.children();
for(var name in _268){
if(_8e.call(_268,name)){
_263.push(_268[name]);
}
}
}
}
_262();
};
_264(0);
};
var _269="@STATIC",_26a="p",_26b="u",_26c="c",_26d="t",_26e="I",_26f="i";
MARKER_SOURCE_MAP="S";
function _22c(_270,_271,_272){
var _273=new _128(_271);
if(_273.magicNumber()!==_269){
throw new Error("Could not read static file: "+_272);
}
if(_273.version()!=="1.0"){
throw new Error("Could not read static file: "+_272);
}
var _274,_275=_270.bundleURL(),file=NULL;
while(_274=_273.getMarker()){
var text=_273.getString();
if(_274===_26a){
var _276=new CFURL(text,_275),_277=_1d6.resourceAtURL(new CFURL(".",_276),YES);
file=new _1d6(_276,_277,NO,YES);
}else{
if(_274===_26b){
var URL=new CFURL(text,_275),_278=_273.getString();
if(_278.indexOf("mhtml:")===0){
_278="mhtml:"+new CFURL(_278.substr("mhtml:".length),_275);
if(_231===_234){
var _279=_278.indexOf("!"),_27a=_278.substring(0,_279),_27b=_278.substring(_279);
_278=_27a+"?"+_1e8+_27b;
}
}
CFURL.setMappedURLForURL(URL,new CFURL(_278));
var _277=_1d6.resourceAtURL(new CFURL(".",URL),YES);
new _1d6(URL,_277,NO,YES);
}else{
if(_274===_26d){
file.write(text);
}
}
}
}
};
CFBundle.prototype.addEventListener=function(_27c,_27d){
this._eventDispatcher.addEventListener(_27c,_27d);
};
CFBundle.prototype.removeEventListener=function(_27e,_27f){
this._eventDispatcher.removeEventListener(_27e,_27f);
};
CFBundle.prototype.onerror=function(_280){
throw _280.error;
};
CFBundle.prototype.bundlePath=function(){
return (this.bundleURL()).path();
};
CFBundle.prototype.path=function(){
CPLog.warn("CFBundle.prototype.path is deprecated, use CFBundle.prototype.bundlePath instead.");
return this.bundlePath.apply(this,arguments);
};
CFBundle.prototype.pathForResource=function(_281,_282,_283,_284){
return (this.resourceURL(_281,_282,_283,_284)).absoluteString();
};
CFBundleCopyLocalizedString=function(_285,key,_286,_287){
return CFCopyLocalizedStringWithDefaultValue(key,_287,_285,_286,"");
};
CFBundleCopyBundleLocalizations=function(_288){
return [this._loadedLanguage];
};
CFCopyLocalizedString=function(key,_289){
return CFCopyLocalizedStringFromTable(key,"Localizable",_289);
};
CFCopyLocalizedStringFromTable=function(key,_28a,_28b){
return CFCopyLocalizedStringFromTableInBundle(key,_28a,CFBundleGetMainBundle(),_28b);
};
CFCopyLocalizedStringFromTableInBundle=function(key,_28c,_28d,_28e){
return CFCopyLocalizedStringWithDefaultValue(key,_28c,_28d,null,_28e);
};
CFCopyLocalizedStringWithDefaultValue=function(key,_28f,_290,_291,_292){
var _293;
if(!_28f){
_28f="Localizable";
}
_28f+=".strings";
var _294=_290._localizableStrings[_28f];
_293=_294?_294[key+_292]:null;
return _293||(_291||key);
};
CFBundleGetMainBundle=function(){
return CFBundle.mainBundle();
};
var _295={};
function _1d6(aURL,_296,_297,_298,_299){
this._parent=_296;
this._eventDispatcher=new _89(this);
var name=(aURL.absoluteURL()).lastPathComponent()||aURL.schemeAndAuthority();
this._name=name;
this._URL=aURL;
this._isResolved=!!_298;
this._filenameTranslateDictionary=_299;
if(_297){
this._URL=this._URL.asDirectoryPathURL();
}
if(!_296){
_295[name]=this;
}
this._isDirectory=!!_297;
this._isNotFound=NO;
if(_296){
_296._children[name]=this;
}
if(_297){
this._children={};
}else{
this._contents="";
}
};
_1d6.rootResources=function(){
return _295;
};
function _29a(x){
var _29b=0;
for(var k in x){
if(x.hasOwnProperty(k)){
++_29b;
}
}
return _29b;
};
_1d6.resetRootResources=function(){
_295={};
};
_1d6.prototype.filenameTranslateDictionary=function(){
return this._filenameTranslateDictionary||{};
};
_2.StaticResource=_1d6;
function _215(_29c){
_29c._isResolved=YES;
_29c._eventDispatcher.dispatchEvent({type:"resolve",staticResource:_29c});
};
_1d6.prototype.resolve=function(){
if(this.isDirectory()){
var _29d=new CFBundle(this.URL());
_29d.onerror=function(){
};
_29d.load(NO);
}else{
var self=this;
function _29e(_29f){
self._contents=_29f.request.responseText();
_215(self);
};
function _2a0(){
self._isNotFound=YES;
_215(self);
};
var url=this.URL(),_2a1=this.filenameTranslateDictionary();
if(_2a1){
var _2a2=url.toString(),_2a3=url.lastPathComponent(),_2a4=_2a2.substring(0,_2a2.length-_2a3.length),_2a5=_2a1[_2a3];
if(_2a5&&_2a2.slice(-_2a5.length)!==_2a5){
url=new CFURL(_2a4+_2a5);
}
}
new _ca(url,_29e,_2a0);
}
};
_1d6.prototype.name=function(){
return this._name;
};
_1d6.prototype.URL=function(){
return this._URL;
};
_1d6.prototype.contents=function(){
return this._contents;
};
_1d6.prototype.children=function(){
return this._children;
};
_1d6.prototype.parent=function(){
return this._parent;
};
_1d6.prototype.isResolved=function(){
return this._isResolved;
};
_1d6.prototype.write=function(_2a6){
this._contents+=_2a6;
};
function _2a7(_2a8){
var _2a9=_2a8.schemeAndAuthority(),_2aa=_295[_2a9];
if(!_2aa){
_2aa=new _1d6(new CFURL(_2a9),NULL,YES,YES);
}
return _2aa;
};
_1d6.resourceAtURL=function(aURL,_2ab){
aURL=(_1ed(aURL)).absoluteURL();
var _2ac=_2a7(aURL),_2ad=aURL.pathComponents(),_a9=0,_2ae=_2ad.length;
for(;_a9<_2ae;++_a9){
var name=_2ad[_a9];
if(_8e.call(_2ac._children,name)){
_2ac=_2ac._children[name];
}else{
if(_2ab){
if(name!=="/"){
name="./"+name;
}
_2ac=new _1d6(new CFURL(name,_2ac.URL()),_2ac,YES,YES);
}else{
throw new Error("Static Resource at "+aURL+" is not resolved (\""+name+"\")");
}
}
}
return _2ac;
};
_1d6.prototype.resourceAtURL=function(aURL,_2af){
return _1d6.resourceAtURL(new CFURL(aURL,this.URL()),_2af);
};
_1d6.resolveResourcesAtURLs=function(URLs,_2b0){
var _2b1=URLs.length,_2b2={};
for(var i=0,size=_2b1;i<size;i++){
var url=URLs[i];
_1d6.resolveResourceAtURL(url,NO,function(_2b3){
_2b2[url]=_2b3;
if(--_2b1===0){
_2b0(_2b2);
}
});
}
};
_1d6.resolveResourceAtURL=function(aURL,_2b4,_2b5,_2b6){
aURL=(_1ed(aURL)).absoluteURL();
_2b7(_2a7(aURL),_2b4,aURL.pathComponents(),0,_2b5,_2b6);
};
_1d6.prototype.resolveResourceAtURL=function(aURL,_2b8,_2b9){
_1d6.resolveResourceAtURL((new CFURL(aURL,this.URL())).absoluteURL(),_2b8,_2b9);
};
function _2b7(_2ba,_2bb,_2bc,_2bd,_2be,_2bf){
var _2c0=_2bc.length;
for(;_2bd<_2c0;++_2bd){
var name=_2bc[_2bd],_2c1=_8e.call(_2ba._children,name)&&_2ba._children[name];
if(!_2c1){
_2c1=new _1d6(new CFURL(name,_2ba.URL()),_2ba,_2bd+1<_2c0||_2bb,NO,_2bf);
_2c1.resolve();
}
if(!_2c1.isResolved()){
return _2c1.addEventListener("resolve",function(){
_2b7(_2ba,_2bb,_2bc,_2bd,_2be,_2bf);
});
}
if(_2c1.isNotFound()){
return _2be(null,new Error("File not found: "+_2bc.join("/")));
}
if(_2bd+1<_2c0&&_2c1.isFile()){
return _2be(null,new Error("File is not a directory: "+_2bc.join("/")));
}
_2ba=_2c1;
}
_2be(_2ba);
};
function _2c2(aURL,_2c3,_2c4){
var _2c5=_1d6.includeURLs(),_2c6=(new CFURL(aURL,_2c5[_2c3])).absoluteURL();
_1d6.resolveResourceAtURL(_2c6,NO,function(_2c7){
if(!_2c7){
if(_2c3+1<_2c5.length){
_2c2(aURL,_2c3+1,_2c4);
}else{
_2c4(NULL);
}
return;
}
_2c4(_2c7);
});
};
_1d6.resolveResourceAtURLSearchingIncludeURLs=function(aURL,_2c8){
_2c2(aURL,0,_2c8);
};
_1d6.prototype.addEventListener=function(_2c9,_2ca){
this._eventDispatcher.addEventListener(_2c9,_2ca);
};
_1d6.prototype.removeEventListener=function(_2cb,_2cc){
this._eventDispatcher.removeEventListener(_2cb,_2cc);
};
_1d6.prototype.isNotFound=function(){
return this._isNotFound;
};
_1d6.prototype.isFile=function(){
return !this._isDirectory;
};
_1d6.prototype.isDirectory=function(){
return this._isDirectory;
};
_1d6.prototype.toString=function(_2cd){
if(this.isNotFound()){
return "<file not found: "+this.name()+">";
}
var _2ce=this.name();
if(this.isDirectory()){
var _2cf=this._children;
for(var name in _2cf){
if(_2cf.hasOwnProperty(name)){
var _2d0=_2cf[name];
if(_2cd||!_2d0.isNotFound()){
_2ce+="\n\t"+((_2cf[name].toString(_2cd)).split("\n")).join("\n\t");
}
}
}
}
return _2ce;
};
var _2d1=NULL;
_1d6.includeURLs=function(){
if(_2d1!==NULL){
return _2d1;
}
_2d1=[];
if(!_1.OBJJ_INCLUDE_PATHS&&!_1.OBJJ_INCLUDE_URLS){
_2d1=["Frameworks","Frameworks/Debug"];
}else{
_2d1=(_1.OBJJ_INCLUDE_PATHS||[]).concat(_1.OBJJ_INCLUDE_URLS||[]);
}
var _2d2=_2d1.length;
while(_2d2--){
_2d1[_2d2]=(new CFURL(_2d1[_2d2])).asDirectoryPathURL();
}
return _2d1;
};
var _2d3="accessors",_2d4="class",_2d5="end",_2d6="function",_2d7="implementation",_2d8="import",_2d9="each",_2da="outlet",_2db="action",_2dc="new",_2dd="selector",_2de="super",_2df="var",_2e0="in",_2e1="pragma",_2e2="mark",_2e3="=",_2e4="+",_2e5="-",_2e6=":",_2e7=",",_2e8=".",_2e9="*",_2ea=";",_2eb="<",_2ec="{",_2ed="}",_2ee=">",_2ef="[",_2f0="\"",_2f1="@",_2f2="#",_2f3="]",_2f4="?",_2f5="(",_2f6=")",_2f7=/^(?:(?:\s+$)|(?:\/(?:\/|\*)))/,_2f8=/^[+-]?\d+(([.]\d+)*([eE][+-]?\d+))?$/,_2f9=/^[a-zA-Z_$](\w|$)*$/;
function _2fa(_2fb){
this._index=-1;
this._tokens=(_2fb+"\n").match(/\/\/.*(\r|\n)?|\/\*(?:.|\n|\r)*?\*\/|\w+\b|[+-]?\d+(([.]\d+)*([eE][+-]?\d+))?|"[^"\\]*(\\[\s\S][^"\\]*)*"|'[^'\\]*(\\[\s\S][^'\\]*)*'|\s+|./g);
this._context=[];
return this;
};
_2fa.prototype.push=function(){
this._context.push(this._index);
};
_2fa.prototype.pop=function(){
this._index=this._context.pop();
};
_2fa.prototype.peek=function(_2fc){
if(_2fc){
this.push();
var _2fd=this.skip_whitespace();
this.pop();
return _2fd;
}
return this._tokens[this._index+1];
};
_2fa.prototype.next=function(){
return this._tokens[++this._index];
};
_2fa.prototype.previous=function(){
return this._tokens[--this._index];
};
_2fa.prototype.last=function(){
if(this._index<0){
return NULL;
}
return this._tokens[this._index-1];
};
_2fa.prototype.skip_whitespace=function(_2fe){
var _2ff;
if(_2fe){
while((_2ff=this.previous())&&_2f7.test(_2ff)){
}
}else{
while((_2ff=this.next())&&_2f7.test(_2ff)){
}
}
return _2ff;
};
_2.Lexer=_2fa;
function _300(){
this.atoms=[];
};
_300.prototype.toString=function(){
return this.atoms.join("");
};
_2.preprocess=function(_301,aURL,_302){
return (new _303(_301,aURL,_302)).executable();
};
_2.eval=function(_304){
return eval((_2.preprocess(_304)).code());
};
var _303=function(_305,aURL,_306){
this._URL=new CFURL(aURL);
_305=_305.replace(/^#[^\n]+\n/,"\n");
this._currentSelector="";
this._currentClass="";
this._currentSuperClass="";
this._currentSuperMetaClass="";
this._buffer=new _300();
this._preprocessed=NULL;
this._dependencies=[];
this._tokens=new _2fa(_305);
this._flags=_306;
this._classMethod=false;
this._executable=NULL;
this._classLookupTable={};
this._classVars={};
var _307=new objj_class();
for(var i in _307){
this._classVars[i]=1;
}
this.preprocess(this._tokens,this._buffer);
};
_303.prototype.setClassInfo=function(_308,_309,_30a){
this._classLookupTable[_308]={superClassName:_309,ivars:_30a};
};
_303.prototype.getClassInfo=function(_30b){
return this._classLookupTable[_30b];
};
_303.prototype.allIvarNamesForClassName=function(_30c){
var _30d={},_30e=this.getClassInfo(_30c);
while(_30e){
for(var i in _30e.ivars){
_30d[i]=1;
}
_30e=this.getClassInfo(_30e.superClassName);
}
return _30d;
};
_2.Preprocessor=_303;
_303.Flags={};
_303.Flags.IncludeDebugSymbols=1<<0;
_303.Flags.IncludeTypeSignatures=1<<1;
_303.prototype.executable=function(){
if(!this._executable){
this._executable=new _30f(this._buffer.toString(),this._dependencies,this._URL);
}
return this._executable;
};
_303.prototype.accessors=function(_310){
var _311=_310.skip_whitespace(),_312={};
if(_311!=_2f5){
_310.previous();
return _312;
}
while((_311=_310.skip_whitespace())!=_2f6){
var name=_311,_313=true;
if(!/^ w+$/.test(name)){
throw new SyntaxError(this.error_message("*** @accessors attribute name not valid."));
}
if((_311=_310.skip_whitespace())==_2e3){
_313=_310.skip_whitespace();
if(!/^ w+$/.test(_313)){
throw new SyntaxError(this.error_message("*** @accessors attribute value not valid."));
}
if(name=="setter"){
if((_311=_310.next())!=_2e6){
throw new SyntaxError(this.error_message("*** @accessors setter attribute requires argument with \":\" at end of selector name."));
}
_313+=":";
}
_311=_310.skip_whitespace();
}
_312[name]=_313;
if(_311==_2f6){
break;
}
if(_311!=_2e7){
throw new SyntaxError(this.error_message("*** Expected ',' or ')' in @accessors attribute list."));
}
}
return _312;
};
_303.prototype.brackets=function(_314,_315){
var _316=[];
while(this.preprocess(_314,NULL,NULL,NULL,_316[_316.length]=[])){
}
if(_316[0].length===1){
_315.atoms[_315.atoms.length]="[";
_315.atoms[_315.atoms.length]=_316[0][0];
_315.atoms[_315.atoms.length]="]";
}else{
var _317=new _300();
if(_316[0][0].atoms[0]==_2de){
_315.atoms[_315.atoms.length]="objj_msgSendSuper(";
_315.atoms[_315.atoms.length]="{ receiver:self, super_class:"+(this._classMethod?this._currentSuperMetaClass:this._currentSuperClass)+" }";
}else{
_315.atoms[_315.atoms.length]="objj_msgSend(";
_315.atoms[_315.atoms.length]=_316[0][0];
}
_317.atoms[_317.atoms.length]=_316[0][1];
var _318=1,_319=_316.length,_31a=new _300();
for(;_318<_319;++_318){
var pair=_316[_318];
_317.atoms[_317.atoms.length]=pair[1];
_31a.atoms[_31a.atoms.length]=", "+pair[0];
}
_315.atoms[_315.atoms.length]=", \"";
_315.atoms[_315.atoms.length]=_317;
_315.atoms[_315.atoms.length]="\"";
_315.atoms[_315.atoms.length]=_31a;
_315.atoms[_315.atoms.length]=")";
}
};
_303.prototype.directive=function(_31b,_31c,_31d){
var _31e=_31c?_31c:new _300(),_31f=_31b.next();
if(_31f.charAt(0)==_2f0){
_31e.atoms[_31e.atoms.length]=_31f;
}else{
if(_31f===_2d4){
_31b.skip_whitespace();
return;
}else{
if(_31f===_2d7){
this.implementation(_31b,_31e);
}else{
if(_31f===_2d8){
this._import(_31b);
}else{
if(_31f===_2dd){
this.selector(_31b,_31e);
}
}
}
}
}
if(!_31c){
return _31e;
}
};
_303.prototype.hash=function(_320,_321){
var _322=_321?_321:new _300(),_323=_320.next();
if(_323===_2e1){
_323=_320.skip_whitespace();
if(_323===_2e2){
while((_323=_320.next()).indexOf("\n")<0){
}
}
}else{
throw new SyntaxError(this.error_message("*** Expected \"pragma\" to follow # but instead saw \""+_323+"\"."));
}
};
_303.prototype.implementation=function(_324,_325){
var _326=_325,_327="",_328=NO,_329=_324.skip_whitespace(),_32a="Nil",_32b=new _300(),_32c=new _300();
if(!/^\w/.test(_329)){
throw new Error(this.error_message("*** Expected class name, found \""+_329+"\"."));
}
this._currentSuperClass="objj_getClass(\""+_329+"\").super_class";
this._currentSuperMetaClass="objj_getMetaClass(\""+_329+"\").super_class";
this._currentClass=_329;
this._currentSelector="";
if((_327=_324.skip_whitespace())==_2f5){
_327=_324.skip_whitespace();
if(_327==_2f6){
throw new SyntaxError(this.error_message("*** Can't Have Empty Category Name for class \""+_329+"\"."));
}
if(_324.skip_whitespace()!=_2f6){
throw new SyntaxError(this.error_message("*** Improper Category Definition for class \""+_329+"\"."));
}
_326.atoms[_326.atoms.length]="{\nvar the_class = objj_getClass(\""+_329+"\")\n";
_326.atoms[_326.atoms.length]="if(!the_class) throw new SyntaxError(\"*** Could not find definition for class \\\""+_329+"\\\"\");\n";
_326.atoms[_326.atoms.length]="var meta_class = the_class.isa;";
}else{
if(_327==_2e6){
_327=_324.skip_whitespace();
if(!_2f9.test(_327)){
throw new SyntaxError(this.error_message("*** Expected class name, found \""+_327+"\"."));
}
_32a=_327;
_327=_324.skip_whitespace();
}
_326.atoms[_326.atoms.length]="{var the_class = objj_allocateClassPair("+_32a+", \""+_329+"\"),\nmeta_class = the_class.isa;";
if(_327==_2ec){
var _32d={},_32e=0,_32f=[],_330,_331={},_332=[];
while((_327=_324.skip_whitespace())&&_327!=_2ed){
if(_327===_2f1){
_327=_324.next();
if(_327===_2d3){
_330=this.accessors(_324);
}else{
if(_327!==_2da){
throw new SyntaxError(this.error_message("*** Unexpected '@' token in ivar declaration ('@"+_327+"')."));
}else{
_332.push("@"+_327);
}
}
}else{
if(_327==_2ea){
if(_32e++===0){
_326.atoms[_326.atoms.length]="class_addIvars(the_class, [";
}else{
_326.atoms[_326.atoms.length]=", ";
}
var name=_32f[_32f.length-1];
if(this._flags&_303.Flags.IncludeTypeSignatures){
_326.atoms[_326.atoms.length]="new objj_ivar(\""+name+"\", \""+(_332.slice(0,_332.length-1)).join(" ")+"\")";
}else{
_326.atoms[_326.atoms.length]="new objj_ivar(\""+name+"\")";
}
_32d[name]=1;
_32f=[];
_332=[];
if(_330){
_331[name]=_330;
_330=NULL;
}
}else{
_32f.push(_327);
_332.push(_327);
}
}
}
if(_32f.length){
throw new SyntaxError(this.error_message("*** Expected ';' in ivar declaration, found '}'."));
}
if(_32e){
_326.atoms[_326.atoms.length]="]);\n";
}
if(!_327){
throw new SyntaxError(this.error_message("*** Expected '}'"));
}
this.setClassInfo(_329,_32a==="Nil"?null:_32a,_32d);
var _32d=this.allIvarNamesForClassName(_329);
for(ivar_name in _331){
var _333=_331[ivar_name],_334=_333["property"]||ivar_name;
var _335=_333["getter"]||_334,_336="(id)"+_335+"\n{\nreturn "+ivar_name+";\n}";
if(_32b.atoms.length!==0){
_32b.atoms[_32b.atoms.length]=",\n";
}
_32b.atoms[_32b.atoms.length]=this.method(new _2fa(_336),_32d);
if(_333["readonly"]){
continue;
}
var _337=_333["setter"];
if(!_337){
var _338=_334.charAt(0)=="_"?1:0;
_337=(_338?"_":"")+"set"+(_334.substr(_338,1)).toUpperCase()+_334.substring(_338+1)+":";
}
var _339="(void)"+_337+"(id)newValue\n{\n";
if(_333["copy"]){
_339+="if ("+ivar_name+" !== newValue)\n"+ivar_name+" = [newValue copy];\n}";
}else{
_339+=ivar_name+" = newValue;\n}";
}
if(_32b.atoms.length!==0){
_32b.atoms[_32b.atoms.length]=",\n";
}
_32b.atoms[_32b.atoms.length]=this.method(new _2fa(_339),_32d);
}
}else{
_324.previous();
}
_326.atoms[_326.atoms.length]="objj_registerClassPair(the_class);\n";
}
if(!_32d){
var _32d=this.allIvarNamesForClassName(_329);
}
while(_327=_324.skip_whitespace()){
if(_327==_2e4){
this._classMethod=true;
if(_32c.atoms.length!==0){
_32c.atoms[_32c.atoms.length]=", ";
}
_32c.atoms[_32c.atoms.length]=this.method(_324,this._classVars);
}else{
if(_327==_2e5){
this._classMethod=false;
if(_32b.atoms.length!==0){
_32b.atoms[_32b.atoms.length]=", ";
}
_32b.atoms[_32b.atoms.length]=this.method(_324,_32d);
}else{
if(_327==_2f2){
this.hash(_324,_326);
}else{
if(_327==_2f1){
if((_327=_324.next())==_2d5){
break;
}else{
throw new SyntaxError(this.error_message("*** Expected \"@end\", found \"@"+_327+"\"."));
}
}
}
}
}
}
if(_32b.atoms.length!==0){
_326.atoms[_326.atoms.length]="class_addMethods(the_class, [";
_326.atoms[_326.atoms.length]=_32b;
_326.atoms[_326.atoms.length]="]);\n";
}
if(_32c.atoms.length!==0){
_326.atoms[_326.atoms.length]="class_addMethods(meta_class, [";
_326.atoms[_326.atoms.length]=_32c;
_326.atoms[_326.atoms.length]="]);\n";
}
_326.atoms[_326.atoms.length]="}";
this._currentClass="";
};
_303.prototype._import=function(_33a){
var _33b="",_33c=_33a.skip_whitespace(),_33d=_33c!==_2eb;
if(_33c===_2eb){
while((_33c=_33a.next())&&_33c!==_2ee){
_33b+=_33c;
}
if(!_33c){
throw new SyntaxError(this.error_message("*** Unterminated import statement."));
}
}else{
if(_33c.charAt(0)===_2f0){
_33b=_33c.substr(1,_33c.length-2);
}else{
throw new SyntaxError(this.error_message("*** Expecting '<' or '\"', found \""+_33c+"\"."));
}
}
this._buffer.atoms[this._buffer.atoms.length]="objj_executeFile(\"";
this._buffer.atoms[this._buffer.atoms.length]=_33b;
this._buffer.atoms[this._buffer.atoms.length]=_33d?"\", YES);":"\", NO);";
this._dependencies.push(new _33e(new CFURL(_33b),_33d));
};
_303.prototype.method=function(_33f,_340){
var _341=new _300(),_342,_343="",_344=[],_345=[null];
_340=_340||{};
while((_342=_33f.skip_whitespace())&&_342!==_2ec&&_342!==_2ea){
if(_342==_2e6){
var type="";
_343+=_342;
_342=_33f.skip_whitespace();
if(_342==_2f5){
while((_342=_33f.skip_whitespace())&&_342!=_2f6){
type+=_342;
}
_342=_33f.skip_whitespace();
}
_345[_344.length+1]=type||null;
_344[_344.length]=_342;
if(_342 in _340){
CPLog.warn(this.error_message("*** Warning: Method ( "+_343+" ) uses a parameter name that is already in use ( "+_342+" )"));
}
}else{
if(_342==_2f5){
var type="";
while((_342=_33f.skip_whitespace())&&_342!=_2f6){
type+=_342;
}
_345[0]=type||null;
}else{
if(_342==_2e7){
if((_342=_33f.skip_whitespace())!=_2e8||_33f.next()!=_2e8||_33f.next()!=_2e8){
throw new SyntaxError(this.error_message("*** Argument list expected after ','."));
}
}else{
_343+=_342;
}
}
}
}
if(_342===_2ea){
_342=_33f.skip_whitespace();
if(_342!==_2ec){
throw new SyntaxError(this.error_message("Invalid semi-colon in method declaration. "+"Semi-colons are allowed only to terminate the method signature, before the open brace."));
}
}
var _346=0,_347=_344.length;
_341.atoms[_341.atoms.length]="new objj_method(sel_getUid(\"";
_341.atoms[_341.atoms.length]=_343;
_341.atoms[_341.atoms.length]="\"), function";
this._currentSelector=_343;
if(this._flags&_303.Flags.IncludeDebugSymbols){
_341.atoms[_341.atoms.length]=" $"+this._currentClass+"__"+_343.replace(/:/g,"_");
}
_341.atoms[_341.atoms.length]="(self, _cmd";
for(;_346<_347;++_346){
_341.atoms[_341.atoms.length]=", ";
_341.atoms[_341.atoms.length]=_344[_346];
}
_341.atoms[_341.atoms.length]=")\n{ with(self)\n{";
_341.atoms[_341.atoms.length]=this.preprocess(_33f,NULL,_2ed,_2ec);
_341.atoms[_341.atoms.length]="}\n}";
if(this._flags&_303.Flags.IncludeDebugSymbols){
_341.atoms[_341.atoms.length]=","+JSON.stringify(_345);
}
_341.atoms[_341.atoms.length]=")";
this._currentSelector="";
return _341;
};
_303.prototype.preprocess=function(_348,_349,_34a,_34b,_34c){
var _34d=_349?_349:new _300(),_34e=0,_34f="";
if(_34c){
_34c[0]=_34d;
var _350=false,_351=[0,0,0];
}
while((_34f=_348.next())&&(_34f!==_34a||_34e)){
if(_34c){
if(_34f===_2f4){
++_351[2];
}else{
if(_34f===_2ec){
++_351[0];
}else{
if(_34f===_2ed){
--_351[0];
}else{
if(_34f===_2f5){
++_351[1];
}else{
if(_34f===_2f6){
--_351[1];
}else{
if((_34f===_2e6&&_351[2]--===0||(_350=_34f===_2f3))&&_351[0]===0&&_351[1]===0){
_348.push();
var _352=_350?_348.skip_whitespace(true):_348.previous(),_353=_2f7.test(_352);
if(_353||_2f9.test(_352)&&_2f7.test(_348.previous())){
_348.push();
var last=_348.skip_whitespace(true),_354=true,_355=false;
if(last==="+"||last==="-"){
if(_348.previous()!==last){
_354=false;
}else{
last=_348.skip_whitespace(true);
_355=true;
}
}
_348.pop();
_348.pop();
if(_354&&(!_355&&last===_2ed||last===_2f6||last===_2f3||last===_2e8||_2f8.test(last)||last.charAt(last.length-1)==="\""||last.charAt(last.length-1)==="'"||_2f9.test(last)&&!/^(new|return|case|var)$/.test(last))){
if(_353){
_34c[1]=":";
}else{
_34c[1]=_352;
if(!_350){
_34c[1]+=":";
}
var _34e=_34d.atoms.length;
while(_34d.atoms[_34e--]!==_352){
}
_34d.atoms.length=_34e;
}
return !_350;
}
if(_350){
return NO;
}
}
_348.pop();
if(_350){
return NO;
}
}
}
}
}
}
}
_351[2]=MAX(_351[2],0);
}
if(_34b){
if(_34f===_34b){
++_34e;
}else{
if(_34f===_34a){
--_34e;
}
}
}
if(_34f===_2d6){
var _356="";
while((_34f=_348.next())&&_34f!==_2f5&&!/^\w/.test(_34f)){
_356+=_34f;
}
if(_34f===_2f5){
if(_34b===_2f5){
++_34e;
}
_34d.atoms[_34d.atoms.length]="function"+_356+"(";
if(_34c){
++_351[1];
}
}else{
_34d.atoms[_34d.atoms.length]=_34f+" = function";
}
}else{
if(_34f==_2f1){
this.directive(_348,_34d);
}else{
if(_34f==_2f2){
this.hash(_348,_34d);
}else{
if(_34f==_2ef){
this.brackets(_348,_34d);
}else{
_34d.atoms[_34d.atoms.length]=_34f;
}
}
}
}
}
if(_34c){
throw new SyntaxError(this.error_message("*** Expected ']' - Unterminated message send or array."));
}
if(!_349){
return _34d;
}
};
_303.prototype.selector=function(_357,_358){
var _359=_358?_358:new _300();
_359.atoms[_359.atoms.length]="sel_getUid(\"";
if(_357.skip_whitespace()!=_2f5){
throw new SyntaxError(this.error_message("*** Expected '('"));
}
var _35a=_357.skip_whitespace();
if(_35a==_2f6){
throw new SyntaxError(this.error_message("*** Unexpected ')', can't have empty @selector()"));
}
_358.atoms[_358.atoms.length]=_35a;
var _35b,_35c=true;
while((_35b=_357.next())&&_35b!=_2f6){
if(_35c&&/^\d+$/.test(_35b)||!/^(\w|$|\:)/.test(_35b)){
if(!/\S/.test(_35b)){
if(_357.skip_whitespace()==_2f6){
break;
}else{
throw new SyntaxError(this.error_message("*** Unexpected whitespace in @selector()."));
}
}else{
throw new SyntaxError(this.error_message("*** Illegal character '"+_35b+"' in @selector()."));
}
}
_359.atoms[_359.atoms.length]=_35b;
_35c=_35b==_2e6;
}
_359.atoms[_359.atoms.length]="\")";
if(!_358){
return _359;
}
};
_303.prototype.error_message=function(_35d){
return _35d+" <Context File: "+this._URL+(this._currentClass?" Class: "+this._currentClass:"")+(this._currentSelector?" Method: "+this._currentSelector:"")+">";
};
(function webpackUniversalModuleDefinition(root,_35e){
function _35f(_360,_361){
if(_360===nil){
return "nil";
}
if(_360===_1b){
return "undefined";
}
if(_360===window){
return "window";
}
if(_361===0){
return "...";
}
if(typeof _360!=="object"){
return String(_360);
}
var _362=[],desc;
for(var _363 in _360){
if(_360.hasOwnProperty(_363)){
_362.push(_363);
}
}
_362.sort();
desc="{";
for(var i=0;i<_362.length;++i){
if(i===0){
desc+="\n";
}
var _364=_360[_362[i]],_365=((_35f(_364,_361!==_1b?_361-1:_361)).split("\n")).join("\n    ");
desc+="    "+_362[i]+": "+_365;
if(i<_362.length-1){
desc+=",\n";
}else{
desc+="\n";
}
}
desc+="}";
return desc;
};
if(typeof _2==="object"&&typeof module==="object"){
module.exports=_35e();
}else{
if(typeof define==="function"&&define.amd){
define([],_35e);
}else{
if(typeof _2==="object"){
_2["sourceMap"]=_35e();
}else{
root["sourceMap"]=_35e();
}
}
}
})(this,function(){
return (function(_366){
var _367={};
function _368(_369){
if(_367[_369]){
return _367[_369].exports;
}
var _36a=_367[_369]={exports:{},id:_369,loaded:false};
_366[_369].call(_36a.exports,_36a,_36a.exports,_368);
_36a.loaded=true;
return _36a.exports;
};
_368.m=_366;
_368.c=_367;
_368.p="";
return _368(0);
})([function(_36b,_36c,_36d){
_36c.SourceMapGenerator=(_36d(1)).SourceMapGenerator;
_36c.SourceMapConsumer=(_36d(7)).SourceMapConsumer;
_36c.SourceNode=(_36d(10)).SourceNode;
},function(_36e,_36f,_370){
var _371=_370(2);
var util=_370(4);
var _372=(_370(5)).ArraySet;
var _373=(_370(6)).MappingList;
function _374(_375){
if(!_375){
_375={};
}
this._file=util.getArg(_375,"file",null);
this._sourceRoot=util.getArg(_375,"sourceRoot",null);
this._skipValidation=util.getArg(_375,"skipValidation",false);
this._sources=new _372();
this._names=new _372();
this._mappings=new _373();
this._sourcesContents=null;
};
_374.prototype._version=3;
_374.fromSourceMap=function SourceMapGenerator_fromSourceMap(_376){
var _377=_376.sourceRoot;
var _378=new _374({file:_376.file,sourceRoot:_377});
_376.eachMapping(function(_379){
var _37a={generated:{line:_379.generatedLine,column:_379.generatedColumn}};
if(_379.source!=null){
_37a.source=_379.source;
if(_377!=null){
_37a.source=util.relative(_377,_37a.source);
}
_37a.original={line:_379.originalLine,column:_379.originalColumn};
if(_379.name!=null){
_37a.name=_379.name;
}
}
_378.addMapping(_37a);
});
_376.sources.forEach(function(_37b){
var _37c=_376.sourceContentFor(_37b);
if(_37c!=null){
_378.setSourceContent(_37b,_37c);
}
});
return _378;
};
_374.prototype.addMapping=function SourceMapGenerator_addMapping(_37d){
var _37e=util.getArg(_37d,"generated");
var _37f=util.getArg(_37d,"original",null);
var _380=util.getArg(_37d,"source",null);
var name=util.getArg(_37d,"name",null);
if(!this._skipValidation){
this._validateMapping(_37e,_37f,_380,name);
}
if(_380!=null){
_380=String(_380);
if(!this._sources.has(_380)){
this._sources.add(_380);
}
}
if(name!=null){
name=String(name);
if(!this._names.has(name)){
this._names.add(name);
}
}
this._mappings.add({generatedLine:_37e.line,generatedColumn:_37e.column,originalLine:_37f!=null&&_37f.line,originalColumn:_37f!=null&&_37f.column,source:_380,name:name});
};
_374.prototype.setSourceContent=function SourceMapGenerator_setSourceContent(_381,_382){
var _383=_381;
if(this._sourceRoot!=null){
_383=util.relative(this._sourceRoot,_383);
}
if(_382!=null){
if(!this._sourcesContents){
this._sourcesContents=Object.create(null);
}
this._sourcesContents[util.toSetString(_383)]=_382;
}else{
if(this._sourcesContents){
delete this._sourcesContents[util.toSetString(_383)];
if((Object.keys(this._sourcesContents)).length===0){
this._sourcesContents=null;
}
}
}
};
_374.prototype.applySourceMap=function SourceMapGenerator_applySourceMap(_384,_385,_386){
var _387=_385;
if(_385==null){
if(_384.file==null){
throw new Error("SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, "+"or the source map's \"file\" property. Both were omitted.");
}
_387=_384.file;
}
var _388=this._sourceRoot;
if(_388!=null){
_387=util.relative(_388,_387);
}
var _389=new _372();
var _38a=new _372();
this._mappings.unsortedForEach(function(_38b){
if(_38b.source===_387&&_38b.originalLine!=null){
var _38c=_384.originalPositionFor({line:_38b.originalLine,column:_38b.originalColumn});
if(_38c.source!=null){
_38b.source=_38c.source;
if(_386!=null){
_38b.source=util.join(_386,_38b.source);
}
if(_388!=null){
_38b.source=util.relative(_388,_38b.source);
}
_38b.originalLine=_38c.line;
_38b.originalColumn=_38c.column;
if(_38c.name!=null){
_38b.name=_38c.name;
}
}
}
var _38d=_38b.source;
if(_38d!=null&&!_389.has(_38d)){
_389.add(_38d);
}
var name=_38b.name;
if(name!=null&&!_38a.has(name)){
_38a.add(name);
}
},this);
this._sources=_389;
this._names=_38a;
_384.sources.forEach(function(_38e){
var _38f=_384.sourceContentFor(_38e);
if(_38f!=null){
if(_386!=null){
_38e=util.join(_386,_38e);
}
if(_388!=null){
_38e=util.relative(_388,_38e);
}
this.setSourceContent(_38e,_38f);
}
},this);
};
_374.prototype._validateMapping=function SourceMapGenerator_validateMapping(_390,_391,_392,_393){
if(_390&&"line" in _390&&"column" in _390&&_390.line>0&&_390.column>=0&&!_391&&!_392&&!_393){
return;
}else{
if(_390&&"line" in _390&&"column" in _390&&_391&&"line" in _391&&"column" in _391&&_390.line>0&&_390.column>=0&&_391.line>0&&_391.column>=0&&_392){
return;
}else{
throw new Error("Invalid mapping: "+JSON.stringify({generated:_390,source:_392,original:_391,name:_393}));
}
}
};
_374.prototype._serializeMappings=function SourceMapGenerator_serializeMappings(){
var _394=0;
var _395=1;
var _396=0;
var _397=0;
var _398=0;
var _399=0;
var _39a="";
var next;
var _39b;
var _39c;
var _39d;
var _39e=this._mappings.toArray();
for(var i=0,len=_39e.length;i<len;i++){
_39b=_39e[i];
next="";
if(_39b.generatedLine!==_395){
_394=0;
while(_39b.generatedLine!==_395){
next+=";";
_395++;
}
}else{
if(i>0){
if(!util.compareByGeneratedPositionsInflated(_39b,_39e[i-1])){
continue;
}
next+=",";
}
}
next+=_371.encode(_39b.generatedColumn-_394);
_394=_39b.generatedColumn;
if(_39b.source!=null){
_39d=this._sources.indexOf(_39b.source);
next+=_371.encode(_39d-_399);
_399=_39d;
next+=_371.encode(_39b.originalLine-1-_397);
_397=_39b.originalLine-1;
next+=_371.encode(_39b.originalColumn-_396);
_396=_39b.originalColumn;
if(_39b.name!=null){
_39c=this._names.indexOf(_39b.name);
next+=_371.encode(_39c-_398);
_398=_39c;
}
}
_39a+=next;
}
return _39a;
};
_374.prototype._generateSourcesContent=function SourceMapGenerator_generateSourcesContent(_39f,_3a0){
return _39f.map(function(_3a1){
if(!this._sourcesContents){
return null;
}
if(_3a0!=null){
_3a1=util.relative(_3a0,_3a1);
}
var key=util.toSetString(_3a1);
return Object.prototype.hasOwnProperty.call(this._sourcesContents,key)?this._sourcesContents[key]:null;
},this);
};
_374.prototype.toJSON=function SourceMapGenerator_toJSON(){
var map={version:this._version,sources:this._sources.toArray(),names:this._names.toArray(),mappings:this._serializeMappings()};
if(this._file!=null){
map.file=this._file;
}
if(this._sourceRoot!=null){
map.sourceRoot=this._sourceRoot;
}
if(this._sourcesContents){
map.sourcesContent=this._generateSourcesContent(map.sources,map.sourceRoot);
}
return map;
};
_374.prototype.toString=function SourceMapGenerator_toString(){
return JSON.stringify(this.toJSON());
};
_36f.SourceMapGenerator=_374;
},function(_3a2,_3a3,_3a4){
var _3a5=_3a4(3);
var _3a6=5;
var _3a7=1<<_3a6;
var _3a8=_3a7-1;
var _3a9=_3a7;
function _3aa(_3ab){
return _3ab<0?(-_3ab<<1)+1:(_3ab<<1)+0;
};
function _3ac(_3ad){
var _3ae=(_3ad&1)===1;
var _3af=_3ad>>1;
return _3ae?-_3af:_3af;
};
_3a3.encode=function base64VLQ_encode(_3b0){
var _3b1="";
var _3b2;
var vlq=_3aa(_3b0);
do{
_3b2=vlq&_3a8;
vlq>>>=_3a6;
if(vlq>0){
_3b2|=_3a9;
}
_3b1+=_3a5.encode(_3b2);
}while(vlq>0);
return _3b1;
};
_3a3.decode=function base64VLQ_decode(aStr,_3b3,_3b4){
var _3b5=aStr.length;
var _3b6=0;
var _3b7=0;
var _3b8,_3b9;
do{
if(_3b3>=_3b5){
throw new Error("Expected more digits in base 64 VLQ value.");
}
_3b9=_3a5.decode(aStr.charCodeAt(_3b3++));
if(_3b9===-1){
throw new Error("Invalid base64 digit: "+aStr.charAt(_3b3-1));
}
_3b8=!!(_3b9&_3a9);
_3b9&=_3a8;
_3b6=_3b6+(_3b9<<_3b7);
_3b7+=_3a6;
}while(_3b8);
_3b4.value=_3ac(_3b6);
_3b4.rest=_3b3;
};
},function(_3ba,_3bb){
var _3bc="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
_3bb.encode=function(_3bd){
if(0<=_3bd&&_3bd<_3bc.length){
return _3bc[_3bd];
}
throw new TypeError("Must be between 0 and 63: "+_3bd);
};
_3bb.decode=function(_3be){
var bigA=65;
var bigZ=90;
var _3bf=97;
var _3c0=122;
var zero=48;
var nine=57;
var plus=43;
var _3c1=47;
var _3c2=26;
var _3c3=52;
if(bigA<=_3be&&_3be<=bigZ){
return _3be-bigA;
}
if(_3bf<=_3be&&_3be<=_3c0){
return _3be-_3bf+_3c2;
}
if(zero<=_3be&&_3be<=nine){
return _3be-zero+_3c3;
}
if(_3be==plus){
return 62;
}
if(_3be==_3c1){
return 63;
}
return -1;
};
},function(_3c4,_3c5){
function _3c6(_3c7,_3c8,_3c9){
if(_3c8 in _3c7){
return _3c7[_3c8];
}else{
if(arguments.length===3){
return _3c9;
}else{
throw new Error("\""+_3c8+"\" is a required argument.");
}
}
};
_3c5.getArg=_3c6;
var _3ca=/^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.]*)(?::(\d+))?(\S*)$/;
var _3cb=/^data:.+\,.+$/;
function _3cc(aUrl){
var _3cd=aUrl.match(_3ca);
if(!_3cd){
return null;
}
return {scheme:_3cd[1],auth:_3cd[2],host:_3cd[3],port:_3cd[4],path:_3cd[5]};
};
_3c5.urlParse=_3cc;
function _3ce(_3cf){
var url="";
if(_3cf.scheme){
url+=_3cf.scheme+":";
}
url+="//";
if(_3cf.auth){
url+=_3cf.auth+"@";
}
if(_3cf.host){
url+=_3cf.host;
}
if(_3cf.port){
url+=":"+_3cf.port;
}
if(_3cf.path){
url+=_3cf.path;
}
return url;
};
_3c5.urlGenerate=_3ce;
function _3d0(_3d1){
var path=_3d1;
var url=_3cc(_3d1);
if(url){
if(!url.path){
return _3d1;
}
path=url.path;
}
var _3d2=_3c5.isAbsolute(path);
var _3d3=path.split(/\/+/);
for(var part,up=0,i=_3d3.length-1;i>=0;i--){
part=_3d3[i];
if(part==="."){
_3d3.splice(i,1);
}else{
if(part===".."){
up++;
}else{
if(up>0){
if(part===""){
_3d3.splice(i+1,up);
up=0;
}else{
_3d3.splice(i,2);
up--;
}
}
}
}
}
path=_3d3.join("/");
if(path===""){
path=_3d2?"/":".";
}
if(url){
url.path=path;
return _3ce(url);
}
return path;
};
_3c5.normalize=_3d0;
function join(_3d4,_3d5){
if(_3d4===""){
_3d4=".";
}
if(_3d5===""){
_3d5=".";
}
var _3d6=_3cc(_3d5);
var _3d7=_3cc(_3d4);
if(_3d7){
_3d4=_3d7.path||"/";
}
if(_3d6&&!_3d6.scheme){
if(_3d7){
_3d6.scheme=_3d7.scheme;
}
return _3ce(_3d6);
}
if(_3d6||_3d5.match(_3cb)){
return _3d5;
}
if(_3d7&&!_3d7.host&&!_3d7.path){
_3d7.host=_3d5;
return _3ce(_3d7);
}
var _3d8=_3d5.charAt(0)==="/"?_3d5:_3d0(_3d4.replace(/\/+$/,"")+"/"+_3d5);
if(_3d7){
_3d7.path=_3d8;
return _3ce(_3d7);
}
return _3d8;
};
_3c5.join=join;
_3c5.isAbsolute=function(_3d9){
return _3d9.charAt(0)==="/"||!!_3d9.match(_3ca);
};
function _3da(_3db,_3dc){
if(_3db===""){
_3db=".";
}
_3db=_3db.replace(/\/$/,"");
var _3dd=0;
while(_3dc.indexOf(_3db+"/")!==0){
var _3de=_3db.lastIndexOf("/");
if(_3de<0){
return _3dc;
}
_3db=_3db.slice(0,_3de);
if(_3db.match(/^([^\/]+:\/)?\/*$/)){
return _3dc;
}
++_3dd;
}
return (Array(_3dd+1)).join("../")+_3dc.substr(_3db.length+1);
};
_3c5.relative=_3da;
var _3df=(function(){
var obj=Object.create(null);
return !("__proto__" in obj);
})();
function _3e0(s){
return s;
};
function _3e1(aStr){
if(_3e2(aStr)){
return "$"+aStr;
}
return aStr;
};
_3c5.toSetString=_3df?_3e0:_3e1;
function _3e3(aStr){
if(_3e2(aStr)){
return aStr.slice(1);
}
return aStr;
};
_3c5.fromSetString=_3df?_3e0:_3e3;
function _3e2(s){
if(!s){
return false;
}
var _3e4=s.length;
if(_3e4<9){
return false;
}
if(s.charCodeAt(_3e4-1)!==95||s.charCodeAt(_3e4-2)!==95||s.charCodeAt(_3e4-3)!==111||s.charCodeAt(_3e4-4)!==116||s.charCodeAt(_3e4-5)!==111||s.charCodeAt(_3e4-6)!==114||s.charCodeAt(_3e4-7)!==112||s.charCodeAt(_3e4-8)!==95||s.charCodeAt(_3e4-9)!==95){
return false;
}
for(var i=_3e4-10;i>=0;i--){
if(s.charCodeAt(i)!==36){
return false;
}
}
return true;
};
function _3e5(_3e6,_3e7,_3e8){
var cmp=_3e6.source-_3e7.source;
if(cmp!==0){
return cmp;
}
cmp=_3e6.originalLine-_3e7.originalLine;
if(cmp!==0){
return cmp;
}
cmp=_3e6.originalColumn-_3e7.originalColumn;
if(cmp!==0||_3e8){
return cmp;
}
cmp=_3e6.generatedColumn-_3e7.generatedColumn;
if(cmp!==0){
return cmp;
}
cmp=_3e6.generatedLine-_3e7.generatedLine;
if(cmp!==0){
return cmp;
}
return _3e6.name-_3e7.name;
};
_3c5.compareByOriginalPositions=_3e5;
function _3e9(_3ea,_3eb,_3ec){
var cmp=_3ea.generatedLine-_3eb.generatedLine;
if(cmp!==0){
return cmp;
}
cmp=_3ea.generatedColumn-_3eb.generatedColumn;
if(cmp!==0||_3ec){
return cmp;
}
cmp=_3ea.source-_3eb.source;
if(cmp!==0){
return cmp;
}
cmp=_3ea.originalLine-_3eb.originalLine;
if(cmp!==0){
return cmp;
}
cmp=_3ea.originalColumn-_3eb.originalColumn;
if(cmp!==0){
return cmp;
}
return _3ea.name-_3eb.name;
};
_3c5.compareByGeneratedPositionsDeflated=_3e9;
function _3ed(_3ee,_3ef){
if(_3ee===_3ef){
return 0;
}
if(_3ee>_3ef){
return 1;
}
return -1;
};
function _3f0(_3f1,_3f2){
var cmp=_3f1.generatedLine-_3f2.generatedLine;
if(cmp!==0){
return cmp;
}
cmp=_3f1.generatedColumn-_3f2.generatedColumn;
if(cmp!==0){
return cmp;
}
cmp=_3ed(_3f1.source,_3f2.source);
if(cmp!==0){
return cmp;
}
cmp=_3f1.originalLine-_3f2.originalLine;
if(cmp!==0){
return cmp;
}
cmp=_3f1.originalColumn-_3f2.originalColumn;
if(cmp!==0){
return cmp;
}
return _3ed(_3f1.name,_3f2.name);
};
_3c5.compareByGeneratedPositionsInflated=_3f0;
},function(_3f3,_3f4,_3f5){
var util=_3f5(4);
var has=Object.prototype.hasOwnProperty;
function _3f6(){
this._array=[];
this._set=Object.create(null);
};
_3f6.fromArray=function ArraySet_fromArray(_3f7,_3f8){
var set=new _3f6();
for(var i=0,len=_3f7.length;i<len;i++){
set.add(_3f7[i],_3f8);
}
return set;
};
_3f6.prototype.size=function ArraySet_size(){
return (Object.getOwnPropertyNames(this._set)).length;
};
_3f6.prototype.add=function ArraySet_add(aStr,_3f9){
var sStr=util.toSetString(aStr);
var _3fa=has.call(this._set,sStr);
var idx=this._array.length;
if(!_3fa||_3f9){
this._array.push(aStr);
}
if(!_3fa){
this._set[sStr]=idx;
}
};
_3f6.prototype.has=function ArraySet_has(aStr){
var sStr=util.toSetString(aStr);
return has.call(this._set,sStr);
};
_3f6.prototype.indexOf=function ArraySet_indexOf(aStr){
var sStr=util.toSetString(aStr);
if(has.call(this._set,sStr)){
return this._set[sStr];
}
throw new Error("\""+aStr+"\" is not in the set.");
};
_3f6.prototype.at=function ArraySet_at(aIdx){
if(aIdx>=0&&aIdx<this._array.length){
return this._array[aIdx];
}
throw new Error("No element indexed by "+aIdx);
};
_3f6.prototype.toArray=function ArraySet_toArray(){
return this._array.slice();
};
_3f4.ArraySet=_3f6;
},function(_3fb,_3fc,_3fd){
var util=_3fd(4);
function _3fe(_3ff,_400){
var _401=_3ff.generatedLine;
var _402=_400.generatedLine;
var _403=_3ff.generatedColumn;
var _404=_400.generatedColumn;
return _402>_401||_402==_401&&_404>=_403||util.compareByGeneratedPositionsInflated(_3ff,_400)<=0;
};
function _405(){
this._array=[];
this._sorted=true;
this._last={generatedLine:-1,generatedColumn:0};
};
_405.prototype.unsortedForEach=function MappingList_forEach(_406,_407){
this._array.forEach(_406,_407);
};
_405.prototype.add=function MappingList_add(_408){
if(_3fe(this._last,_408)){
this._last=_408;
this._array.push(_408);
}else{
this._sorted=false;
this._array.push(_408);
}
};
_405.prototype.toArray=function MappingList_toArray(){
if(!this._sorted){
this._array.sort(util.compareByGeneratedPositionsInflated);
this._sorted=true;
}
return this._array;
};
_3fc.MappingList=_405;
},function(_409,_40a,_40b){
var util=_40b(4);
var _40c=_40b(8);
var _40d=(_40b(5)).ArraySet;
var _40e=_40b(2);
var _40f=(_40b(9)).quickSort;
function _410(_411){
var _412=_411;
if(typeof _411==="string"){
_412=JSON.parse(_411.replace(/^\)\]\}'/,""));
}
return _412.sections!=null?new _413(_412):new _414(_412);
};
_410.fromSourceMap=function(_415){
return _414.fromSourceMap(_415);
};
_410.prototype._version=3;
_410.prototype.__generatedMappings=null;
Object.defineProperty(_410.prototype,"_generatedMappings",{get:function(){
if(!this.__generatedMappings){
this._parseMappings(this._mappings,this.sourceRoot);
}
return this.__generatedMappings;
}});
_410.prototype.__originalMappings=null;
Object.defineProperty(_410.prototype,"_originalMappings",{get:function(){
if(!this.__originalMappings){
this._parseMappings(this._mappings,this.sourceRoot);
}
return this.__originalMappings;
}});
_410.prototype._charIsMappingSeparator=function SourceMapConsumer_charIsMappingSeparator(aStr,_416){
var c=aStr.charAt(_416);
return c===";"||c===",";
};
_410.prototype._parseMappings=function SourceMapConsumer_parseMappings(aStr,_417){
throw new Error("Subclasses must implement _parseMappings");
};
_410.GENERATED_ORDER=1;
_410.ORIGINAL_ORDER=2;
_410.GREATEST_LOWER_BOUND=1;
_410.LEAST_UPPER_BOUND=2;
_410.prototype.eachMapping=function SourceMapConsumer_eachMapping(_418,_419,_41a){
var _41b=_419||null;
var _41c=_41a||_410.GENERATED_ORDER;
var _41d;
switch(_41c){
case _410.GENERATED_ORDER:
_41d=this._generatedMappings;
break;
case _410.ORIGINAL_ORDER:
_41d=this._originalMappings;
break;
default:
throw new Error("Unknown order of iteration.");
}
var _41e=this.sourceRoot;
(_41d.map(function(_41f){
var _420=_41f.source===null?null:this._sources.at(_41f.source);
if(_420!=null&&_41e!=null){
_420=util.join(_41e,_420);
}
return {source:_420,generatedLine:_41f.generatedLine,generatedColumn:_41f.generatedColumn,originalLine:_41f.originalLine,originalColumn:_41f.originalColumn,name:_41f.name===null?null:this._names.at(_41f.name)};
},this)).forEach(_418,_41b);
};
_410.prototype.allGeneratedPositionsFor=function SourceMapConsumer_allGeneratedPositionsFor(_421){
var line=util.getArg(_421,"line");
var _422={source:util.getArg(_421,"source"),originalLine:line,originalColumn:util.getArg(_421,"column",0)};
if(this.sourceRoot!=null){
_422.source=util.relative(this.sourceRoot,_422.source);
}
if(!this._sources.has(_422.source)){
return [];
}
_422.source=this._sources.indexOf(_422.source);
var _423=[];
var _424=this._findMapping(_422,this._originalMappings,"originalLine","originalColumn",util.compareByOriginalPositions,_40c.LEAST_UPPER_BOUND);
if(_424>=0){
var _425=this._originalMappings[_424];
if(_421.column===_1b){
var _426=_425.originalLine;
while(_425&&_425.originalLine===_426){
_423.push({line:util.getArg(_425,"generatedLine",null),column:util.getArg(_425,"generatedColumn",null),lastColumn:util.getArg(_425,"lastGeneratedColumn",null)});
_425=this._originalMappings[++_424];
}
}else{
var _427=_425.originalColumn;
while(_425&&_425.originalLine===line&&_425.originalColumn==_427){
_423.push({line:util.getArg(_425,"generatedLine",null),column:util.getArg(_425,"generatedColumn",null),lastColumn:util.getArg(_425,"lastGeneratedColumn",null)});
_425=this._originalMappings[++_424];
}
}
}
return _423;
};
_40a.SourceMapConsumer=_410;
function _414(_428){
var _429=_428;
if(typeof _428==="string"){
_429=JSON.parse(_428.replace(/^\)\]\}'/,""));
}
var _42a=util.getArg(_429,"version");
var _42b=util.getArg(_429,"sources");
var _42c=util.getArg(_429,"names",[]);
var _42d=util.getArg(_429,"sourceRoot",null);
var _42e=util.getArg(_429,"sourcesContent",null);
var _42f=util.getArg(_429,"mappings");
var file=util.getArg(_429,"file",null);
if(_42a!=this._version){
throw new Error("Unsupported version: "+_42a);
}
_42b=((_42b.map(String)).map(util.normalize)).map(function(_430){
return _42d&&util.isAbsolute(_42d)&&util.isAbsolute(_430)?util.relative(_42d,_430):_430;
});
this._names=_40d.fromArray(_42c.map(String),true);
this._sources=_40d.fromArray(_42b,true);
this.sourceRoot=_42d;
this.sourcesContent=_42e;
this._mappings=_42f;
this.file=file;
};
_414.prototype=Object.create(_410.prototype);
_414.prototype.consumer=_410;
_414.fromSourceMap=function SourceMapConsumer_fromSourceMap(_431){
var smc=Object.create(_414.prototype);
var _432=smc._names=_40d.fromArray(_431._names.toArray(),true);
var _433=smc._sources=_40d.fromArray(_431._sources.toArray(),true);
smc.sourceRoot=_431._sourceRoot;
smc.sourcesContent=_431._generateSourcesContent(smc._sources.toArray(),smc.sourceRoot);
smc.file=_431._file;
var _434=(_431._mappings.toArray()).slice();
var _435=smc.__generatedMappings=[];
var _436=smc.__originalMappings=[];
for(var i=0,_437=_434.length;i<_437;i++){
var _438=_434[i];
var _439=new _43a();
_439.generatedLine=_438.generatedLine;
_439.generatedColumn=_438.generatedColumn;
if(_438.source){
_439.source=_433.indexOf(_438.source);
_439.originalLine=_438.originalLine;
_439.originalColumn=_438.originalColumn;
if(_438.name){
_439.name=_432.indexOf(_438.name);
}
_436.push(_439);
}
_435.push(_439);
}
_40f(smc.__originalMappings,util.compareByOriginalPositions);
return smc;
};
_414.prototype._version=3;
Object.defineProperty(_414.prototype,"sources",{get:function(){
return (this._sources.toArray()).map(function(s){
return this.sourceRoot!=null?util.join(this.sourceRoot,s):s;
},this);
}});
function _43a(){
this.generatedLine=0;
this.generatedColumn=0;
this.source=null;
this.originalLine=null;
this.originalColumn=null;
this.name=null;
};
_414.prototype._parseMappings=function SourceMapConsumer_parseMappings(aStr,_43b){
var _43c=1;
var _43d=0;
var _43e=0;
var _43f=0;
var _440=0;
var _441=0;
var _442=aStr.length;
var _443=0;
var _444={};
var temp={};
var _445=[];
var _446=[];
var _447,str,_448,end,_449;
while(_443<_442){
if(aStr.charAt(_443)===";"){
_43c++;
_443++;
_43d=0;
}else{
if(aStr.charAt(_443)===","){
_443++;
}else{
_447=new _43a();
_447.generatedLine=_43c;
for(end=_443;end<_442;end++){
if(this._charIsMappingSeparator(aStr,end)){
break;
}
}
str=aStr.slice(_443,end);
_448=_444[str];
if(_448){
_443+=str.length;
}else{
_448=[];
while(_443<end){
_40e.decode(aStr,_443,temp);
_449=temp.value;
_443=temp.rest;
_448.push(_449);
}
if(_448.length===2){
throw new Error("Found a source, but no line and column");
}
if(_448.length===3){
throw new Error("Found a source and line, but no column");
}
_444[str]=_448;
}
_447.generatedColumn=_43d+_448[0];
_43d=_447.generatedColumn;
if(_448.length>1){
_447.source=_440+_448[1];
_440+=_448[1];
_447.originalLine=_43e+_448[2];
_43e=_447.originalLine;
_447.originalLine+=1;
_447.originalColumn=_43f+_448[3];
_43f=_447.originalColumn;
if(_448.length>4){
_447.name=_441+_448[4];
_441+=_448[4];
}
}
_446.push(_447);
if(typeof _447.originalLine==="number"){
_445.push(_447);
}
}
}
}
_40f(_446,util.compareByGeneratedPositionsDeflated);
this.__generatedMappings=_446;
_40f(_445,util.compareByOriginalPositions);
this.__originalMappings=_445;
};
_414.prototype._findMapping=function SourceMapConsumer_findMapping(_44a,_44b,_44c,_44d,_44e,_44f){
if(_44a[_44c]<=0){
throw new TypeError("Line must be greater than or equal to 1, got "+_44a[_44c]);
}
if(_44a[_44d]<0){
throw new TypeError("Column must be greater than or equal to 0, got "+_44a[_44d]);
}
return _40c.search(_44a,_44b,_44e,_44f);
};
_414.prototype.computeColumnSpans=function SourceMapConsumer_computeColumnSpans(){
for(var _450=0;_450<this._generatedMappings.length;++_450){
var _451=this._generatedMappings[_450];
if(_450+1<this._generatedMappings.length){
var _452=this._generatedMappings[_450+1];
if(_451.generatedLine===_452.generatedLine){
_451.lastGeneratedColumn=_452.generatedColumn-1;
continue;
}
}
_451.lastGeneratedColumn=Infinity;
}
};
_414.prototype.originalPositionFor=function SourceMapConsumer_originalPositionFor(_453){
var _454={generatedLine:util.getArg(_453,"line"),generatedColumn:util.getArg(_453,"column")};
var _455=this._findMapping(_454,this._generatedMappings,"generatedLine","generatedColumn",util.compareByGeneratedPositionsDeflated,util.getArg(_453,"bias",_410.GREATEST_LOWER_BOUND));
if(_455>=0){
var _456=this._generatedMappings[_455];
if(_456.generatedLine===_454.generatedLine){
var _457=util.getArg(_456,"source",null);
if(_457!==null){
_457=this._sources.at(_457);
if(this.sourceRoot!=null){
_457=util.join(this.sourceRoot,_457);
}
}
var name=util.getArg(_456,"name",null);
if(name!==null){
name=this._names.at(name);
}
return {source:_457,line:util.getArg(_456,"originalLine",null),column:util.getArg(_456,"originalColumn",null),name:name};
}
}
return {source:null,line:null,column:null,name:null};
};
_414.prototype.hasContentsOfAllSources=function BasicSourceMapConsumer_hasContentsOfAllSources(){
if(!this.sourcesContent){
return false;
}
return this.sourcesContent.length>=this._sources.size()&&!this.sourcesContent.some(function(sc){
return sc==null;
});
};
_414.prototype.sourceContentFor=function SourceMapConsumer_sourceContentFor(_458,_459){
if(!this.sourcesContent){
return null;
}
if(this.sourceRoot!=null){
_458=util.relative(this.sourceRoot,_458);
}
if(this._sources.has(_458)){
return this.sourcesContent[this._sources.indexOf(_458)];
}
var url;
if(this.sourceRoot!=null&&(url=util.urlParse(this.sourceRoot))){
var _45a=_458.replace(/^file:\/\//,"");
if(url.scheme=="file"&&this._sources.has(_45a)){
return this.sourcesContent[this._sources.indexOf(_45a)];
}
if((!url.path||url.path=="/")&&this._sources.has("/"+_458)){
return this.sourcesContent[this._sources.indexOf("/"+_458)];
}
}
if(_459){
return null;
}else{
throw new Error("\""+_458+"\" is not in the SourceMap.");
}
};
_414.prototype.generatedPositionFor=function SourceMapConsumer_generatedPositionFor(_45b){
var _45c=util.getArg(_45b,"source");
if(this.sourceRoot!=null){
_45c=util.relative(this.sourceRoot,_45c);
}
if(!this._sources.has(_45c)){
return {line:null,column:null,lastColumn:null};
}
_45c=this._sources.indexOf(_45c);
var _45d={source:_45c,originalLine:util.getArg(_45b,"line"),originalColumn:util.getArg(_45b,"column")};
var _45e=this._findMapping(_45d,this._originalMappings,"originalLine","originalColumn",util.compareByOriginalPositions,util.getArg(_45b,"bias",_410.GREATEST_LOWER_BOUND));
if(_45e>=0){
var _45f=this._originalMappings[_45e];
if(_45f.source===_45d.source){
return {line:util.getArg(_45f,"generatedLine",null),column:util.getArg(_45f,"generatedColumn",null),lastColumn:util.getArg(_45f,"lastGeneratedColumn",null)};
}
}
return {line:null,column:null,lastColumn:null};
};
_40a.BasicSourceMapConsumer=_414;
function _413(_460){
var _461=_460;
if(typeof _460==="string"){
_461=JSON.parse(_460.replace(/^\)\]\}'/,""));
}
var _462=util.getArg(_461,"version");
var _463=util.getArg(_461,"sections");
if(_462!=this._version){
throw new Error("Unsupported version: "+_462);
}
this._sources=new _40d();
this._names=new _40d();
var _464={line:-1,column:0};
this._sections=_463.map(function(s){
if(s.url){
throw new Error("Support for url field in sections not implemented.");
}
var _465=util.getArg(s,"offset");
var _466=util.getArg(_465,"line");
var _467=util.getArg(_465,"column");
if(_466<_464.line||_466===_464.line&&_467<_464.column){
throw new Error("Section offsets must be ordered and non-overlapping.");
}
_464=_465;
return {generatedOffset:{generatedLine:_466+1,generatedColumn:_467+1},consumer:new _410(util.getArg(s,"map"))};
});
};
_413.prototype=Object.create(_410.prototype);
_413.prototype.constructor=_410;
_413.prototype._version=3;
Object.defineProperty(_413.prototype,"sources",{get:function(){
var _468=[];
for(var i=0;i<this._sections.length;i++){
for(var j=0;j<this._sections[i].consumer.sources.length;j++){
_468.push(this._sections[i].consumer.sources[j]);
}
}
return _468;
}});
_413.prototype.originalPositionFor=function IndexedSourceMapConsumer_originalPositionFor(_469){
var _46a={generatedLine:util.getArg(_469,"line"),generatedColumn:util.getArg(_469,"column")};
var _46b=_40c.search(_46a,this._sections,function(_46c,_46d){
var cmp=_46c.generatedLine-_46d.generatedOffset.generatedLine;
if(cmp){
return cmp;
}
return _46c.generatedColumn-_46d.generatedOffset.generatedColumn;
});
var _46e=this._sections[_46b];
if(!_46e){
return {source:null,line:null,column:null,name:null};
}
return _46e.consumer.originalPositionFor({line:_46a.generatedLine-(_46e.generatedOffset.generatedLine-1),column:_46a.generatedColumn-(_46e.generatedOffset.generatedLine===_46a.generatedLine?_46e.generatedOffset.generatedColumn-1:0),bias:_469.bias});
};
_413.prototype.hasContentsOfAllSources=function IndexedSourceMapConsumer_hasContentsOfAllSources(){
return this._sections.every(function(s){
return s.consumer.hasContentsOfAllSources();
});
};
_413.prototype.sourceContentFor=function IndexedSourceMapConsumer_sourceContentFor(_46f,_470){
for(var i=0;i<this._sections.length;i++){
var _471=this._sections[i];
var _472=_471.consumer.sourceContentFor(_46f,true);
if(_472){
return _472;
}
}
if(_470){
return null;
}else{
throw new Error("\""+_46f+"\" is not in the SourceMap.");
}
};
_413.prototype.generatedPositionFor=function IndexedSourceMapConsumer_generatedPositionFor(_473){
for(var i=0;i<this._sections.length;i++){
var _474=this._sections[i];
if(_474.consumer.sources.indexOf(util.getArg(_473,"source"))===-1){
continue;
}
var _475=_474.consumer.generatedPositionFor(_473);
if(_475){
var ret={line:_475.line+(_474.generatedOffset.generatedLine-1),column:_475.column+(_474.generatedOffset.generatedLine===_475.line?_474.generatedOffset.generatedColumn-1:0)};
return ret;
}
}
return {line:null,column:null};
};
_413.prototype._parseMappings=function IndexedSourceMapConsumer_parseMappings(aStr,_476){
this.__generatedMappings=[];
this.__originalMappings=[];
for(var i=0;i<this._sections.length;i++){
var _477=this._sections[i];
var _478=_477.consumer._generatedMappings;
for(var j=0;j<_478.length;j++){
var _479=_478[j];
var _47a=_477.consumer._sources.at(_479.source);
if(_477.consumer.sourceRoot!==null){
_47a=util.join(_477.consumer.sourceRoot,_47a);
}
this._sources.add(_47a);
_47a=this._sources.indexOf(_47a);
var name=_477.consumer._names.at(_479.name);
this._names.add(name);
name=this._names.indexOf(name);
var _47b={source:_47a,generatedLine:_479.generatedLine+(_477.generatedOffset.generatedLine-1),generatedColumn:_479.generatedColumn+(_477.generatedOffset.generatedLine===_479.generatedLine?_477.generatedOffset.generatedColumn-1:0),originalLine:_479.originalLine,originalColumn:_479.originalColumn,name:name};
this.__generatedMappings.push(_47b);
if(typeof _47b.originalLine==="number"){
this.__originalMappings.push(_47b);
}
}
}
_40f(this.__generatedMappings,util.compareByGeneratedPositionsDeflated);
_40f(this.__originalMappings,util.compareByOriginalPositions);
};
_40a.IndexedSourceMapConsumer=_413;
},function(_47c,_47d){
_47d.GREATEST_LOWER_BOUND=1;
_47d.LEAST_UPPER_BOUND=2;
function _47e(aLow,_47f,_480,_481,_482,_483){
var mid=Math.floor((_47f-aLow)/2)+aLow;
var cmp=_482(_480,_481[mid],true);
if(cmp===0){
return mid;
}else{
if(cmp>0){
if(_47f-mid>1){
return _47e(mid,_47f,_480,_481,_482,_483);
}
if(_483==_47d.LEAST_UPPER_BOUND){
return _47f<_481.length?_47f:-1;
}else{
return mid;
}
}else{
if(mid-aLow>1){
return _47e(aLow,mid,_480,_481,_482,_483);
}
if(_483==_47d.LEAST_UPPER_BOUND){
return mid;
}else{
return aLow<0?-1:aLow;
}
}
}
};
_47d.search=function search(_484,_485,_486,_487){
if(_485.length===0){
return -1;
}
var _488=_47e(-1,_485.length,_484,_485,_486,_487||_47d.GREATEST_LOWER_BOUND);
if(_488<0){
return -1;
}
while(_488-1>=0){
if(_486(_485[_488],_485[_488-1],true)!==0){
break;
}
--_488;
}
return _488;
};
},function(_489,_48a){
function swap(ary,x,y){
var temp=ary[x];
ary[x]=ary[y];
ary[y]=temp;
};
function _48b(low,high){
return Math.round(low+Math.random()*(high-low));
};
function _48c(ary,_48d,p,r){
if(p<r){
var _48e=_48b(p,r);
var i=p-1;
swap(ary,_48e,r);
var _48f=ary[r];
for(var j=p;j<r;j++){
if(_48d(ary[j],_48f)<=0){
i+=1;
swap(ary,i,j);
}
}
swap(ary,i+1,j);
var q=i+1;
_48c(ary,_48d,p,q-1);
_48c(ary,_48d,q+1,r);
}
};
_48a.quickSort=function(ary,_490){
_48c(ary,_490,0,ary.length-1);
};
},function(_491,_492,_493){
var _494=(_493(1)).SourceMapGenerator;
var util=_493(4);
var _495=/(\r?\n)/;
var _496=10;
var _497="$$$isSourceNode$$$";
function _498(_499,_49a,_49b,_49c,_49d){
this.children=[];
this.sourceContents={};
this.line=_499==null?null:_499;
this.column=_49a==null?null:_49a;
this.source=_49b==null?null:_49b;
this.name=_49d==null?null:_49d;
this[_497]=true;
if(_49c!=null){
this.add(_49c);
}
};
_498.fromStringWithSourceMap=function SourceNode_fromStringWithSourceMap(_49e,_49f,_4a0){
var node=new _498();
var _4a1=_49e.split(_495);
var _4a2=function(){
var _4a3=_4a1.shift();
var _4a4=_4a1.shift()||"";
return _4a3+_4a4;
};
var _4a5=1,_4a6=0;
var _4a7=null;
_49f.eachMapping(function(_4a8){
if(_4a7!==null){
if(_4a5<_4a8.generatedLine){
_4a9(_4a7,_4a2());
_4a5++;
_4a6=0;
}else{
var _4aa=_4a1[0];
var code=_4aa.substr(0,_4a8.generatedColumn-_4a6);
_4a1[0]=_4aa.substr(_4a8.generatedColumn-_4a6);
_4a6=_4a8.generatedColumn;
_4a9(_4a7,code);
_4a7=_4a8;
return;
}
}
while(_4a5<_4a8.generatedLine){
node.add(_4a2());
_4a5++;
}
if(_4a6<_4a8.generatedColumn){
var _4aa=_4a1[0];
node.add(_4aa.substr(0,_4a8.generatedColumn));
_4a1[0]=_4aa.substr(_4a8.generatedColumn);
_4a6=_4a8.generatedColumn;
}
_4a7=_4a8;
},this);
if(_4a1.length>0){
if(_4a7){
_4a9(_4a7,_4a2());
}
node.add(_4a1.join(""));
}
_49f.sources.forEach(function(_4ab){
var _4ac=_49f.sourceContentFor(_4ab);
if(_4ac!=null){
if(_4a0!=null){
_4ab=util.join(_4a0,_4ab);
}
node.setSourceContent(_4ab,_4ac);
}
});
return node;
function _4a9(_4ad,code){
if(_4ad===null||_4ad.source===_1b){
node.add(code);
}else{
var _4ae=_4a0?util.join(_4a0,_4ad.source):_4ad.source;
node.add(new _498(_4ad.originalLine,_4ad.originalColumn,_4ae,code,_4ad.name));
}
};
};
_498.prototype.add=function SourceNode_add(_4af){
if(Array.isArray(_4af)){
_4af.forEach(function(_4b0){
this.add(_4b0);
},this);
}else{
if(_4af[_497]||typeof _4af==="string"){
if(_4af){
this.children.push(_4af);
}
}else{
throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got "+_4af);
}
}
return this;
};
_498.prototype.prepend=function SourceNode_prepend(_4b1){
if(Array.isArray(_4b1)){
for(var i=_4b1.length-1;i>=0;i--){
this.prepend(_4b1[i]);
}
}else{
if(_4b1[_497]||typeof _4b1==="string"){
this.children.unshift(_4b1);
}else{
throw new TypeError("Expected a SourceNode, string, or an array of SourceNodes and strings. Got "+_4b1);
}
}
return this;
};
_498.prototype.walk=function SourceNode_walk(aFn){
var _4b2;
for(var i=0,len=this.children.length;i<len;i++){
_4b2=this.children[i];
if(_4b2[_497]){
_4b2.walk(aFn);
}else{
if(_4b2!==""){
aFn(_4b2,{source:this.source,line:this.line,column:this.column,name:this.name});
}
}
}
};
_498.prototype.join=function SourceNode_join(aSep){
var _4b3;
var i;
var len=this.children.length;
if(len>0){
_4b3=[];
for(i=0;i<len-1;i++){
_4b3.push(this.children[i]);
_4b3.push(aSep);
}
_4b3.push(this.children[i]);
this.children=_4b3;
}
return this;
};
_498.prototype.replaceRight=function SourceNode_replaceRight(_4b4,_4b5){
var _4b6=this.children[this.children.length-1];
if(_4b6[_497]){
_4b6.replaceRight(_4b4,_4b5);
}else{
if(typeof _4b6==="string"){
this.children[this.children.length-1]=_4b6.replace(_4b4,_4b5);
}else{
this.children.push("".replace(_4b4,_4b5));
}
}
return this;
};
_498.prototype.setSourceContent=function SourceNode_setSourceContent(_4b7,_4b8){
this.sourceContents[util.toSetString(_4b7)]=_4b8;
};
_498.prototype.walkSourceContents=function SourceNode_walkSourceContents(aFn){
for(var i=0,len=this.children.length;i<len;i++){
if(this.children[i][_497]){
this.children[i].walkSourceContents(aFn);
}
}
var _4b9=Object.keys(this.sourceContents);
for(var i=0,len=_4b9.length;i<len;i++){
aFn(util.fromSetString(_4b9[i]),this.sourceContents[_4b9[i]]);
}
};
_498.prototype.toString=function SourceNode_toString(){
var str="";
this.walk(function(_4ba){
str+=_4ba;
});
return str;
};
_498.prototype.toStringWithSourceMap=function SourceNode_toStringWithSourceMap(_4bb){
var _4bc={code:"",line:1,column:0};
var map=new _494(_4bb);
var _4bd=false;
var _4be=null;
var _4bf=null;
var _4c0=null;
var _4c1=null;
this.walk(function(_4c2,_4c3){
_4bc.code+=_4c2;
if(_4c3.source!==null&&_4c3.line!==null&&_4c3.column!==null){
if(_4be!==_4c3.source||_4bf!==_4c3.line||_4c0!==_4c3.column||_4c1!==_4c3.name){
map.addMapping({source:_4c3.source,original:{line:_4c3.line,column:_4c3.column},generated:{line:_4bc.line,column:_4bc.column},name:_4c3.name});
}
_4be=_4c3.source;
_4bf=_4c3.line;
_4c0=_4c3.column;
_4c1=_4c3.name;
_4bd=true;
}else{
if(_4bd){
map.addMapping({generated:{line:_4bc.line,column:_4bc.column}});
_4be=null;
_4bd=false;
}
}
for(var idx=0,_4c4=_4c2.length;idx<_4c4;idx++){
if(_4c2.charCodeAt(idx)===_496){
_4bc.line++;
_4bc.column=0;
if(idx+1===_4c4){
_4be=null;
_4bd=false;
}else{
if(_4bd){
map.addMapping({source:_4c3.source,original:{line:_4c3.line,column:_4c3.column},generated:{line:_4bc.line,column:_4bc.column},name:_4c3.name});
}
}
}else{
_4bc.column++;
}
}
});
this.walkSourceContents(function(_4c5,_4c6){
map.setSourceContent(_4c5,_4c6);
});
return {code:_4bc.code,map:map};
};
_492.SourceNode=_498;
}]);
});
(function(_4c7,walk){
"use strict";
_4c7.version="0.3.3-objj-3";
var _4c8,_4c9,_4ca,_4cb;
_4c7.parse=function(inpt,opts){
_4c9=String(inpt);
_4ca=_4c9.length;
_4cc(opts);
_4cd();
if(_4c8.macros){
_4ce(_4c8.macros);
}
_4cf();
return _4d0(_4c8.program);
};
var _4d1=_4c7.defaultOptions={ecmaVersion:5,strictSemicolons:false,allowTrailingCommas:true,forbidReserved:false,trackComments:false,trackCommentsIncludeLineBreak:false,trackSpaces:false,locations:false,onComment:null,ranges:false,program:null,sourceFile:null,objj:true,preprocess:true,preprocessGetIncludeFile:_4d2,preprocessAddMacro:_4d3,preprocessGetMacro:_4d4,preprocessUndefineMacro:_4d5,preprocessIsMacro:_4d6,macros:null,lineNoInErrorMessage:true,preIncludeFiles:null};
function _4cc(opts){
_4c8=opts||{};
for(var opt in _4d1){
if(!Object.prototype.hasOwnProperty.call(_4c8,opt)){
_4c8[opt]=_4d1[opt];
}
}
_4cb=_4c8.sourceFile||null;
};
var _4d7;
var _4d8;
var _4d9=function(name,_4da,_4db){
return new _4dc(name,_4da,null,_4db-name.length);
};
var _4dd={1:function(){
return _4d9("__OBJJ__",_4c8.objj?"1":null,_4de);
}};
_4dd["__"+"BROWSER"+"__"]=function(){
return _4d9("__BROWSER__",typeof window!=="undefined"?"1":null,_4de);
};
_4dd["__"+"LINE"+"__"]=function(){
return _4d9("__LINE__",String(_4c8.locations?_4df:(_4e0(_4c9,_4de)).line),_4de);
};
_4dd["__"+"DATE"+"__"]=function(){
var date,day;
return _4d9("__DATE__",(date=new Date(),day=String(date.getDate()),["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][date.getMonth()]+(day.length>1?" ":"  ")+day+" "+date.getFullYear()),_4de);
};
_4dd["__"+"TIME"+"__"]=function(){
var date;
return _4d9("__TIME__",(date=new Date(),("0"+date.getHours()).slice(-2)+":"+("0"+date.getMinutes()).slice(-2)+":"+("0"+date.getSeconds()).slice(-2)),_4de);
};
function _4d2(_4e1){
return {include:"#define FOO(x) x\n",sourceFile:_4e1};
};
function _4d3(_4e2){
_4d7[_4e2.identifier]=_4e2;
_4d8=null;
};
function _4d4(_4e3){
return _4d7[_4e3];
};
function _4d5(_4e4){
delete _4d7[_4e4];
_4d8=null;
};
function _4d6(_4e5){
return (_4d8||(_4d8=_4e6(((Object.keys(_4d7)).concat((Object.keys(_4dd)).filter(function(key){
return (this[key]()).macro!=null;
},_4dd))).join(" "))))(_4e5);
};
function _4e7(_4e8){
var _4e9=_4dd[_4e8];
return _4e9?_4e9():null;
};
function _4ce(_4ea){
for(var i=0,size=_4ea.length;i<size;i++){
var _4eb=_4c9;
var _4ec=_4ea[i].trim();
var pos=_4ec.indexOf("=");
if(pos===0){
_4ed(0,"Invalid macro definition: '"+_4ec+"'");
}
var name,body;
if(pos>0){
name=_4ec.slice(0,pos);
body=_4ec.slice(pos+1);
}else{
name=_4ec;
}
if(_4dd.hasOwnProperty(name)){
_4ed(0,"'"+name+"' is a predefined macro name");
}
_4c9=name+(body!=null?" "+body:"");
_4ca=_4c9.length;
_4cf();
_4ee();
_4c9=_4eb;
_4ca=_4c9.length;
}
};
var _4e0=_4c7.getLineInfo=function(_4ef,_4f0){
for(var line=1,cur=0;;){
_4f1.lastIndex=cur;
var _4f2=_4f1.exec(_4ef);
if(_4f2&&_4f2.index<_4f0){
++line;
cur=_4f2.index+_4f2[0].length;
}else{
break;
}
}
return {line:line,column:_4f0-cur,lineStart:cur,lineEnd:_4f2?_4f2.index+_4f2[0].length:_4ef.length};
};
_4c7.tokenize=function(inpt,opts){
_4c9=String(inpt);
_4ca=_4c9.length;
_4cc(opts);
_4cf();
_4cd();
var t={};
function _4f3(_4f4){
_5c6(_4f4);
t.start=_4fc;
t.end=_4fd;
t.startLoc=_504;
t.endLoc=_505;
t.type=_506;
t.value=_507;
return t;
};
_4f3.jumpTo=function(pos,_4f5){
_4de=pos;
if(_4c8.locations){
_4df=1;
_4f6=_4f1.lastIndex=0;
var _4f7;
while((_4f7=_4f1.exec(_4c9))&&_4f7.index<pos){
++_4df;
_4f6=_4f7.index+_4f7[0].length;
}
}
_4f8=_4f5;
_4f9();
};
return _4f3;
};
var _4de;
var _4fa,_4fb,_4fc,_4fd,_4fe,_4ff,_500;
var _501;
var _502,_503;
var _504,_505;
var _506,_507;
var _508,_509,_50a;
var _50b,_50c,_50d;
var _4f8,_50e,_50f;
var _4df,_4f6;
var _510,_511,_512;
var _513,_514,_515;
var _516;
var _517,_518,_519;
var _51a,_51b,_51c,_51d;
var _51e,_51f;
var _520;
var _521;
var _522;
var _523;
var _524;
var _525;
var _526;
var _527;
var _528;
var _529;
var _52a;
var _52b;
function _4ed(pos,_52c){
if(typeof pos=="number"){
pos=_4e0(_4c9,pos);
}
if(_4c8.lineNoInErrorMessage){
_52c+=" ("+pos.line+":"+pos.column+")";
}
var _52d=new SyntaxError(_52c);
_52d.messageOnLine=pos.line;
_52d.messageOnColumn=pos.column;
_52d.lineStart=pos.lineStart;
_52d.lineEnd=pos.lineEnd;
_52d.fileName=_4cb;
throw _52d;
};
var _52e=[];
var _52f={type:"num"},_530={type:"regexp"},_531={type:"string"};
var _532={type:"name"},_533={type:"eof"},_534={type:"eol"};
var _535={keyword:"break"},_536={keyword:"case",beforeExpr:true},_537={keyword:"catch"};
var _538={keyword:"continue"},_539={keyword:"debugger"},_53a={keyword:"default"};
var _53b={keyword:"do",isLoop:true},_53c={keyword:"else",beforeExpr:true};
var _53d={keyword:"finally"},_53e={keyword:"for",isLoop:true},_53f={keyword:"function"};
var _540={keyword:"if"},_541={keyword:"return",beforeExpr:true},_542={keyword:"switch"};
var _543={keyword:"throw",beforeExpr:true},_544={keyword:"try"},_545={keyword:"var"};
var _546={keyword:"while",isLoop:true},_547={keyword:"with"},_548={keyword:"new",beforeExpr:true};
var _549={keyword:"this"};
var _54a={keyword:"void",prefix:true,beforeExpr:true};
var _54b={keyword:"null",atomValue:null},_54c={keyword:"true",atomValue:true};
var _54d={keyword:"false",atomValue:false};
var _54e={keyword:"in",binop:7,beforeExpr:true};
var _54f={keyword:"implementation"},_550={keyword:"outlet"},_551={keyword:"accessors"};
var _552={keyword:"end"},_553={keyword:"import"};
var _554={keyword:"action"},_555={keyword:"selector"},_556={keyword:"class"},_557={keyword:"global"};
var _558={keyword:"{"},_559={keyword:"["};
var _55a={keyword:"ref"},_55b={keyword:"deref"};
var _55c={keyword:"protocol"},_55d={keyword:"optional"},_55e={keyword:"required"};
var _55f={keyword:"interface"};
var _560={keyword:"typedef"};
var _561={keyword:"filename"},_562={keyword:"unsigned",okAsIdent:true},_563={keyword:"signed",okAsIdent:true};
var _564={keyword:"byte",okAsIdent:true},_565={keyword:"char",okAsIdent:true},_566={keyword:"short",okAsIdent:true};
var _567={keyword:"int",okAsIdent:true},_568={keyword:"long",okAsIdent:true},_569={keyword:"id",okAsIdent:true};
var _56a={keyword:"BOOL",okAsIdent:true},_56b={keyword:"SEL",okAsIdent:true},_56c={keyword:"float",okAsIdent:true};
var _56d={keyword:"double",okAsIdent:true};
var _56e={keyword:"#"};
var _56f={keyword:"define"};
var _570={keyword:"undef"};
var _571={keyword:"ifdef"};
var _572={keyword:"ifndef"};
var _573={keyword:"if"};
var _574={keyword:"else"};
var _575={keyword:"endif"};
var _576={keyword:"elif"};
var _577={keyword:"elif (True)"};
var _578={keyword:"elif (false)"};
var _579={keyword:"pragma"};
var _57a={keyword:"defined"};
var _57b={keyword:"\\"};
var _57c={keyword:"error"};
var _57d={keyword:"warning"};
var _57e={type:"preprocessParamItem"};
var _57f={type:"skipLine"};
var _580={keyword:"include"};
var _581={"break":_535,"case":_536,"catch":_537,"continue":_538,"debugger":_539,"default":_53a,"do":_53b,"else":_53c,"finally":_53d,"for":_53e,"function":_53f,"if":_540,"return":_541,"switch":_542,"throw":_543,"try":_544,"var":_545,"while":_546,"with":_547,"null":_54b,"true":_54c,"false":_54d,"new":_548,"in":_54e,"instanceof":{keyword:"instanceof",binop:7,beforeExpr:true},"this":_549,"typeof":{keyword:"typeof",prefix:true,beforeExpr:true},"void":_54a,"delete":{keyword:"delete",prefix:true,beforeExpr:true}};
var _582={"IBAction":_554,"IBOutlet":_550,"unsigned":_562,"signed":_563,"byte":_564,"char":_565,"short":_566,"int":_567,"long":_568,"id":_569,"float":_56c,"BOOL":_56a,"SEL":_56b,"double":_56d};
var _583={"implementation":_54f,"outlet":_550,"accessors":_551,"end":_552,"import":_553,"action":_554,"selector":_555,"class":_556,"global":_557,"ref":_55a,"deref":_55b,"protocol":_55c,"optional":_55d,"required":_55e,"interface":_55f,"typedef":_560};
var _584={"define":_56f,"pragma":_579,"ifdef":_571,"ifndef":_572,"undef":_570,"if":_573,"endif":_575,"else":_574,"elif":_576,"defined":_57a,"warning":_57d,"error":_57c,"include":_580};
var _585={type:"[",beforeExpr:true},_586={type:"]"},_587={type:"{",beforeExpr:true};
var _588={type:"}"},_589={type:"(",beforeExpr:true},_58a={type:")"};
var _58b={type:",",beforeExpr:true},_58c={type:";",beforeExpr:true};
var _58d={type:":",beforeExpr:true},_58e={type:"."},_58f={type:"?",beforeExpr:true};
var _590={type:"..."};
var _591={binop:10,beforeExpr:true,preprocess:true},_592={isAssign:true,beforeExpr:true,preprocess:true};
var _593={isAssign:true,beforeExpr:true},_594={binop:9,prefix:true,beforeExpr:true,preprocess:true};
var _595={postfix:true,prefix:true,isUpdate:true},_596={prefix:true,beforeExpr:true,preprocess:true};
var _597={binop:1,beforeExpr:true,preprocess:true},_598={binop:2,beforeExpr:true,preprocess:true};
var _599={binop:3,beforeExpr:true,preprocess:true},_59a={binop:4,beforeExpr:true,preprocess:true};
var _59b={binop:5,beforeExpr:true,preprocess:true},_59c={binop:6,beforeExpr:true,preprocess:true};
var _59d={binop:7,beforeExpr:true,preprocess:true},_59e={binop:8,beforeExpr:true,preprocess:true};
var _59f={binop:10,beforeExpr:true,preprocess:true};
_4c7.tokTypes={bracketL:_585,bracketR:_586,braceL:_587,braceR:_588,parenL:_589,parenR:_58a,comma:_58b,semi:_58c,colon:_58d,dot:_58e,question:_58f,slash:_591,eq:_592,name:_532,eof:_533,num:_52f,regexp:_530,string:_531};
for(var kw in _581){
_4c7.tokTypes["_"+kw]=_581[kw];
}
function _4e6(_5a0){
_5a0=_5a0.split(" ");
var f="",cats=[];
out:
for(var i=0;i<_5a0.length;++i){
for(var j=0;j<cats.length;++j){
if(cats[j][0].length==_5a0[i].length){
cats[j].push(_5a0[i]);
continue out;
}
}
cats.push([_5a0[i]]);
}
function _5a1(arr){
if(arr.length==1){
return f+="return str === "+JSON.stringify(arr[0])+";";
}
f+="switch(str){";
for(var i=0;i<arr.length;++i){
f+="case "+JSON.stringify(arr[i])+":";
}
f+="return true}return false;";
};
if(cats.length>3){
cats.sort(function(a,b){
return b.length-a.length;
});
f+="switch(str.length){";
for(var i=0;i<cats.length;++i){
var cat=cats[i];
f+="case "+cat[0].length+":";
_5a1(cat);
}
f+="}";
}else{
_5a1(_5a0);
}
return new Function("str",f);
};
_4c7.makePredicate=_4e6;
var _5a2=_4e6("abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile");
var _5a3=_4e6("class enum extends super const export import");
var _5a4=_4e6("implements interface let package private protected public static yield");
var _5a5=_4e6("eval arguments");
var _5a6=_4e6("break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this");
var _5a7=_4e6("IBAction IBOutlet byte char short int long float unsigned signed id BOOL SEL double");
var _5a8=_4e6("define undef pragma if ifdef ifndef else elif endif defined error warning include");
var _5a9=/[\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff]/;
var _5aa=/[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
var _5ab="ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԧԱ-Ֆՙա-ևא-תװ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࢠࢢ-ࢬऄ-हऽॐक़-ॡॱ-ॷॹ-ॿঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-ళవ-హఽౘౙౠౡಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೞೠೡೱೲഅ-ഌഎ-ഐഒ-ഺഽൎൠൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄງຈຊຍດ-ທນ-ຟມ-ຣລວສຫອ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏼᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛰᜀ-ᜌᜎ-ᜑᜠ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡷᢀ-ᢨᢪᢰ-ᣵᤀ-ᤜᥐ-ᥭᥰ-ᥴᦀ-ᦫᧁ-ᧇᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭋᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᳩ-ᳬᳮ-ᳱᳵᳶᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕℙ-ℝℤΩℨK-ℭℯ-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞⸯ々-〇〡-〩〱-〵〸-〼ぁ-ゖゝ-ゟァ-ヺー-ヿㄅ-ㄭㄱ-ㆎㆠ-ㆺㇰ-ㇿ㐀-䶵一-鿌ꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚗꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-ꞎꞐ-ꞓꞠ-Ɦꟸ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꪀ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꯀ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ";
var _5ac="̀-ͯ҃-֑҇-ׇֽֿׁׂׅׄؐ-ؚؠ-ىٲ-ۓۧ-ۨۻ-ۼܰ-݊ࠀ-ࠔࠛ-ࠣࠥ-ࠧࠩ-࠭ࡀ-ࡗࣤ-ࣾऀ-ःऺ-़ा-ॏ॑-ॗॢ-ॣ०-९ঁ-ঃ়া-ৄেৈৗয়-ৠਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢ-ૣ૦-૯ଁ-ଃ଼ା-ୄେୈୋ-୍ୖୗୟ-ୠ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఁ-ఃె-ైొ-్ౕౖౢ-ౣ౦-౯ಂಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢ-ೣ೦-೯ംഃെ-ൈൗൢ-ൣ൦-൯ංඃ්ා-ුූෘ-ෟෲෳิ-ฺเ-ๅ๐-๙ິ-ູ່-ໍ໐-໙༘༙༠-༩༹༵༷ཁ-ཇཱ-྄྆-྇ྍ-ྗྙ-ྼ࿆က-ဩ၀-၉ၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟ᜎ-ᜐᜠ-ᜰᝀ-ᝐᝲᝳក-ឲ៝០-៩᠋-᠍᠐-᠙ᤠ-ᤫᤰ-᤻ᥑ-ᥭᦰ-ᧀᧈ-ᧉ᧐-᧙ᨀ-ᨕᨠ-ᩓ᩠-᩿᩼-᪉᪐-᪙ᭆ-ᭋ᭐-᭙᭫-᭳᮰-᮹᯦-᯳ᰀ-ᰢ᱀-᱉ᱛ-ᱽ᳐-᳒ᴀ-ᶾḁ-ἕ‌‍‿⁀⁔⃐-⃥⃜⃡-⃰ⶁ-ⶖⷠ-ⷿ〡-〨゙゚Ꙁ-ꙭꙴ-꙽ꚟ꛰-꛱ꟸ-ꠀ꠆ꠋꠣ-ꠧꢀ-ꢁꢴ-꣄꣐-꣙ꣳ-ꣷ꤀-꤉ꤦ-꤭ꤰ-ꥅꦀ-ꦃ꦳-꧀ꨀ-ꨧꩀ-ꩁꩌ-ꩍ꩐-꩙ꩻꫠ-ꫩꫲ-ꫳꯀ-ꯡ꯬꯭꯰-꯹ﬠ-ﬨ︀-️︠-︦︳︴﹍-﹏０-９＿";
var _5ad=new RegExp("["+_5ab+"]");
var _5ae=new RegExp("["+_5ab+_5ac+"]");
var _5af=/[\n\r\u2028\u2029]/;
var _4f1=/\r\n|[\n\r\u2028\u2029]/g;
var _5b0=_4c7.isIdentifierStart=function(code){
if(code<65){
return code===36;
}
if(code<91){
return true;
}
if(code<97){
return code===95;
}
if(code<123){
return true;
}
return code>=170&&_5ad.test(String.fromCharCode(code));
};
var _5b1=_4c7.isIdentifierChar=function(code){
if(code<48){
return code===36;
}
if(code<58){
return true;
}
if(code<65){
return false;
}
if(code<91){
return true;
}
if(code<97){
return code===95;
}
if(code<123){
return true;
}
return code>=170&&_5ae.test(String.fromCharCode(code));
};
function _5b2(){
this.line=_4df;
this.column=_4de-_4f6;
if(_521){
var _5b3=_521.macro;
var _5b4=_5b3.locationOffset;
if(_5b4){
var _5b5=_5b4.line;
if(_5b5){
this.line+=_5b5;
}
var _5b6=_5b4.column;
if(_5b6){
this.column+=_4ff-(_4df===1?_5b6:0);
}
}
}
};
function _5b7(line,_5b8){
this.line=line-1;
this.column=_5b8;
if(_521){
var _5b9=_521.macro;
var _5ba=_5b9.locationOffset;
if(_5ba){
var _5bb=_5ba.line;
if(_5bb){
this.line+=_5bb;
}
var _5bc=_5ba.column;
if(_5bc){
this.column+=_5bc;
}
}
}
};
function _4cf(){
_4df=1;
_4de=_4f6=_500=_4fe=_4ff=0;
_4f8=true;
_50e=null;
_50f=null;
_4f9();
};
function _4cd(){
_4d7=Object.create(null);
_4d8=null;
_525=null;
_526=null;
_523=false;
_524=false;
_520=[];
_521=null;
_522=null;
_528=false;
_52a=true;
_529=false;
_52b=[];
};
function _5bd(type,val,_5be){
if(_5be){
_4fb=_4fd=_5be;
if(_4c8.locations){
_505=preprocessOverrideTokLoc;
}
}else{
_4fb=_4fd=_4de;
if(_4c8.locations){
_505=new _5b2();
}
}
_506=type;
var ch=_4f9();
if(ch===35&&_4c8.preprocess&&_4c9.charCodeAt(_4de+1)===35){
var val1=val!=null?val:type.keyword||type.type;
_4de+=2;
if(val1!=null){
var _5bf=_4c8.locations&&new _5b7(_4df,_4f6);
var _5c0=_510,_5c1=_4fd,_5c2=_4fc,_5c3=_4fc+_4fe,_5c4=_521&&_521.macro&&_521.macro.variadicName;
_4f9();
if(_5c4&&_5c4===_4c9.slice(_4de,_4de+_5c4.length)){
var _5c5=true;
}
_529=true;
_5c6(null,2);
_529=false;
var val2=_507!=null?_507:_506.keyword||_506.type;
if(val2!=null){
if(_5c5&&val1===","&&val2===""){
return _5c6();
}
var _5c7=""+val1+val2,_5c8=_4fc+_4ff;
var _5c9=new _4dc(null,_5c7,null,_5c3,false,null,false,_5bf);
var r=_5ca(_5c9,_4ff,_521?_521.parameterDict:null,null,_4de,next,null);
if(_521&&_521.macro===_5c9){
_506=type;
_4fc=_5c2;
_4fd=_5c1;
_510=_5c0;
_4ff=_5c8-val1.length;
if(!_5c5){
console.log("Warning: pasting formed '"+_5c7+"', an invalid preprocessing token");
}
}else{
return r;
}
}
}
}
_507=val;
_50a=_509;
_50d=_50c;
_509=_50e;
_50c=_50f;
_4f8=type.beforeExpr;
};
function _5cb(_5cc,_5cd){
var _5ce=_4c8.onComment&&_4c8.locations&&new _5b2();
var _5cf=_4de,end=_4c9.indexOf("*/",_4de+=2);
if(end===-1){
_4ed(_4de-2,"Unterminated comment");
}
_4de=end+2;
if(_4c8.locations){
_4f1.lastIndex=_5cf;
var _5d0;
while((_5d0=_4f1.exec(_4c9))&&_5d0.index<_4de){
++_4df;
_4f6=_5d0.index+_5d0[0].length;
}
}
if(!_5cd){
if(_4c8.onComment){
_4c8.onComment(true,_4c9.slice(_5cf+2,end),_5cf,_4de,_5ce,_4c8.locations&&new _5b2());
}
if(_4c8.trackComments){
(_50e||(_50e=[])).push(_4c9.slice(_5cc!=null&&_4c8.trackCommentsIncludeLineBreak?_5cc:_5cf,_4de));
}
}
};
function _5d1(_5d2,_5d3){
var _5d4=_4de;
var _5d5=_4c8.onComment&&_4c8.locations&&new _5b2();
var ch=_4c9.charCodeAt(_4de+=2);
while(_4de<_4ca&&ch!==10&&ch!==13&&ch!==8232&&ch!==8233){
++_4de;
ch=_4c9.charCodeAt(_4de);
}
if(!_5d3){
if(_4c8.onComment){
_4c8.onComment(false,_4c9.slice(_5d4+2,_4de),_5d4,_4de,_5d5,_4c8.locations&&new _5b2());
}
if(_4c8.trackComments){
(_50e||(_50e=[])).push(_4c9.slice(_5d2!=null&&_4c8.trackCommentsIncludeLineBreak?_5d2:_5d4,_4de));
}
}
};
function _5d6(){
var ch=_4c9.charCodeAt(_4de);
var last;
while(_4de<_4ca&&(ch!==10&&ch!==13&&ch!==8232&&ch!==8233||last===92)){
if(ch!=32&&ch!=9&&ch!=160&&(ch<5760||!_5aa.test(String.fromCharCode(ch)))){
last=ch;
}
ch=_4c9.charCodeAt(++_4de);
}
};
function _4f9(){
_50e=null;
_50f=null;
return _5d7();
};
function _5d7(_5d8,_5d9,_5da){
var _5db=_4de,_5dc,ch;
for(;;){
ch=_4c9.charCodeAt(_4de);
if(ch===32){
++_4de;
}else{
if(ch===13){
if(_5d8){
break;
}
_5dc=_4de;
++_4de;
var next=_4c9.charCodeAt(_4de);
if(next===10){
++_4de;
}
if(_4c8.locations){
++_4df;
_4f6=_4de;
}
}else{
if(ch===10){
if(_5d8){
break;
}
_5dc=_4de;
++_4de;
if(_4c8.locations){
++_4df;
_4f6=_4de;
}
}else{
if(ch===9){
++_4de;
}else{
if(ch===47){
if(_5da){
break;
}
var next=_4c9.charCodeAt(_4de+1);
if(next===42){
if(_4c8.trackSpaces){
(_50f||(_50f=[])).push(_4c9.slice(_5db,_4de));
}
_5cb(_5dc);
_5db=_4de;
}else{
if(next===47){
if(_4c8.trackSpaces){
(_50f||(_50f=[])).push(_4c9.slice(_5db,_4de));
}
_5d1(_5dc);
_5db=_4de;
}else{
break;
}
}
}else{
if(ch===160||ch===11||ch===12||ch>=5760&&_5a9.test(String.fromCharCode(ch))){
++_4de;
}else{
if(_4de>=_4ca){
if(_4c8.preprocess){
if(_5d9){
return true;
}
if(!_520.length){
break;
}
if(_502==null){
_502=_4de;
}
var _5dd=_520.pop();
_4de=_5dd.end;
_4c9=_5dd.input;
_4ca=_5dd.inputLen;
_4df=_5dd.currentLine;
_4f6=_5dd.currentLineStart;
_522=_5dd.onlyTransformArgumentsForLastToken;
_525=_5dd.parameterScope;
_4ff=_5dd.macroOffset;
_4cb=_5dd.sourceFile;
_4fb=_5dd.lastEnd;
var _5de=_520.length;
_521=_5de?_520[_5de-1]:null;
return _5d7(_5d8);
}else{
break;
}
}else{
if(ch===92){
if(!_4c8.preprocess){
break;
}
var pos=_4de+1;
ch=_4c9.charCodeAt(pos);
while(pos<_4ca&&(ch===32||ch===9||ch===11||ch===12||ch>=5760&&_5aa.test(String.fromCharCode(ch)))){
ch=_4c9.charCodeAt(++pos);
}
_4f1.lastIndex=0;
var _5df=_4f1.exec(_4c9.slice(pos,pos+2));
if(_5df&&_5df.index===0){
_4de=pos+_5df[0].length;
if(_4c8.locations){
++_4df;
_4f6=_4de;
}
}else{
break;
}
}else{
break;
}
}
}
}
}
}
}
}
}
return ch;
};
function _5e0(code,_5e1){
var next=_4c9.charCodeAt(_4de+1);
if(next>=48&&next<=57){
return _5e2(String.fromCharCode(code),_5e1);
}
if(next===46&&_4c8.objj&&_4c9.charCodeAt(_4de+2)===46){
_4de+=3;
return _5e1(_590);
}
++_4de;
return _5e1(_58e);
};
function _5e3(_5e4){
var next=_4c9.charCodeAt(_4de+1);
if(_4f8){
++_4de;
return _5e5();
}
if(next===61){
return _5e6(_593,2,_5e4);
}
return _5e6(_591,1,_5e4);
};
function _5e7(_5e8){
var next=_4c9.charCodeAt(_4de+1);
if(next===61){
return _5e6(_593,2,_5e8);
}
return _5e6(_59f,1,_5e8);
};
function _5e9(code,_5ea){
var next=_4c9.charCodeAt(_4de+1);
if(next===code){
return _5e6(code===124?_597:_598,2,_5ea);
}
if(next===61){
return _5e6(_593,2,_5ea);
}
return _5e6(code===124?_599:_59b,1,_5ea);
};
function _5eb(_5ec){
var next=_4c9.charCodeAt(_4de+1);
if(next===61){
return _5e6(_593,2,_5ec);
}
return _5e6(_59a,1,_5ec);
};
function _5ed(code,_5ee){
var next=_4c9.charCodeAt(_4de+1);
if(next===code){
return _5e6(_595,2,_5ee);
}
if(next===61){
return _5e6(_593,2,_5ee);
}
return _5e6(_594,1,_5ee);
};
function _5ef(code,_5f0){
if(code===60&&(_506===_553||_51a===_580)&&_4c8.objj){
for(var _5f1=_4de+1;;){
var ch=_4c9.charCodeAt(++_4de);
if(ch===62){
return _5f0(_561,_4c9.slice(_5f1,_4de++));
}
if(_4de>=_4ca||ch===13||ch===10||ch===8232||ch===8233){
_4ed(_4fc,"Unterminated import statement");
}
}
}
var next=_4c9.charCodeAt(_4de+1);
var size=1;
if(next===code){
size=code===62&&_4c9.charCodeAt(_4de+2)===62?3:2;
if(_4c9.charCodeAt(_4de+size)===61){
return _5e6(_593,size+1,_5f0);
}
return _5e6(_59e,size,_5f0);
}
if(next===61){
size=_4c9.charCodeAt(_4de+2)===61?3:2;
}
return _5e6(_59d,size,_5f0);
};
function _5f2(code,_5f3){
var next=_4c9.charCodeAt(_4de+1);
if(next===61){
return _5e6(_59c,_4c9.charCodeAt(_4de+2)===61?3:2,_5f3);
}
return _5e6(code===61?_592:_596,1,_5f3);
};
function _5f4(code,_5f5){
var next=_4c9.charCodeAt(++_4de);
if(next===34||next===39){
return _5f6(next,_5f5);
}
if(next===123){
return _5f5(_558);
}
if(next===91){
return _5f5(_559);
}
var word=_5f7(),_5f8=_583[word];
if(!_5f8){
_4ed(_4fc,"Unrecognized Objective-J keyword '@"+word+"'");
}
return _5f5(_5f8);
};
function _5f9(_5fa){
++_4de;
_5fb();
_5fc(false,true);
switch(_51a){
case _56f:
if(_52a){
_4ee();
}else{
return _5fa(_56f);
}
break;
case _570:
_5fc();
_4c8.preprocessUndefineMacro(_5fd());
break;
case _573:
if(_52a){
var _5fe=_4f8;
_4f8=false;
_52b.push(_573);
_5fc(false,false,true);
var expr=_5ff(true);
var test=_600(expr);
if(!test){
_52a=false;
_601();
}
_4f8=_5fe;
}else{
return _5fa(_573);
}
break;
case _571:
if(_52a){
_52b.push(_573);
_5fc();
var _602=_5fd();
var test=_4c8.preprocessIsMacro(_602);
if(!test){
_52a=false;
_601();
}
}else{
return _5fa(_571);
}
break;
case _572:
if(_52a){
_52b.push(_573);
_5fc();
var _602=_5fd();
var test=_4c8.preprocessIsMacro(_602);
if(test){
_52a=false;
_601();
}
}else{
return _5fa(_572);
}
break;
case _574:
if(_52b.length){
if(_52a){
if(_52b[_52b.length-1]===_573){
_52b[_52b.length-1]=_574;
_52a=false;
_5fa(_574);
_5fc();
_601(true);
}else{
_4ed(_51c,"#else after #else");
}
}else{
_52b[_52b.length-1]=_574;
return _5fa(_574);
}
}else{
_4ed(_51c,"#else without #if");
}
break;
case _576:
if(_52b.length){
if(_52a){
if(_52b[_52b.length-1]===_573){
_52a=false;
_5fa(_576);
_5fc();
_601(true);
}else{
_4ed(_51c,"#elsif after #else");
}
}else{
var _5fe=_4f8;
_4f8=false;
_52a=true;
_5fc(false,false,true);
var expr=_5ff(true);
_52a=false;
_4f8=_5fe;
var test=_600(expr);
return _5fa(test?_577:_578);
}
}else{
_4ed(_51c,"#elif without #if");
}
break;
case _575:
if(_52b.length){
if(_52a){
_52b.pop();
break;
}
}else{
_4ed(_51c,"#endif without #if");
}
return _5fa(_575);
break;
case _579:
_5d6();
break;
case _596:
_5d6();
break;
case _57d:
_5fc(false,false,true);
var expr=_5ff();
console.log("Warning: "+String(_600(expr)));
break;
case _57c:
var _603=_51c;
_5fc(false,false,true);
var expr=_5ff();
_4ed(_603,"Error: "+String(_600(expr)));
break;
case _580:
if(!_52a){
return _5fa(_580);
}
_5fc();
if(_51a===_531){
var _604=true;
}else{
if(_51a===_561){
var _604=false;
}else{
_4ed(_51c,"Expected \"FILENAME\" or <FILENAME>: "+(_51a.keyword||_51a.type));
}
}
var _605=_51b;
var _606=_4c8.preprocessGetIncludeFile(_51b,_604)||_4ed(_51c,"'"+_605+"' file not found");
var _607=_606.include;
var _608=new _4dc(null,_607,null,0,false,null,false,null,_606.sourceFile);
_609(_56e,null,null,true);
_60a(_608,_608.macro,_4ff,null,null,_4de,null,true);
_4f9();
_5c6(null,null,true);
return;
break;
default:
if(_521){
if(_521.parameterDict&&_521.macro.isParameterFunction()(_51b)){
var _60b=_521.parameterDict[_51b];
if(_60b){
return _5bd(_531,_60b.macro);
}
}
}
_4ed(_51c,"Invalid preprocessing directive");
_5d6();
return _5fa(_56e);
}
if(_51a===_534&&_4c8.trackSpaces){
if(_50f&&_50f.length){
_50f.push("\n"+_50f.pop());
}else{
_50f=["\n"];
}
}
_609(_51a,null,null,true);
return next(true);
};
function _4ee(){
_524=true;
_5fc();
var _60c=_51d;
_528=true;
var _60d=_4c8.locations&&new _5b7(_4df,_4f6);
var _60e=_5fd();
if(_4c9.charCodeAt(_60c)===40){
_60f(_589);
var _610=[];
var _611=false;
var _612=true;
while(!_613(_58a)){
if(_611){
_4ed(_51c,"Variadic parameter must be last");
}
if(!_612){
_60f(_58b,"Expected ',' between macro parameters");
}else{
_612=false;
}
_610.push(_613(_590)?_611=true&&"__VA_ARGS__":_5fd());
if(_613(_590)){
_611=true;
}
_60d=_4c8.locations&&new _5b7(_4df,_4f6);
}
}
var _614=_51c;
while(_51a!==_534&&_51a!==_533){
_5fc();
}
_528=false;
var _615=_511.slice(_614,_51c);
_615=_615.replace(/\\/g," ");
_4c8.preprocessAddMacro(new _4dc(_60e,_615,_610,_614,false,null,_611&&_610[_610.length-1],_60d));
_524=false;
};
function _600(expr){
return walk.recursive(expr,{},{LogicalExpression:function(node,st,c){
var left=node.left,_616=node.right;
switch(node.operator){
case "||":
return c(left,st)||c(_616,st);
case "&&":
return c(left,st)&&c(_616,st);
}
},BinaryExpression:function(node,st,c){
var left=node.left,_617=node.right;
switch(node.operator){
case "+":
return c(left,st)+c(_617,st);
case "-":
return c(left,st)-c(_617,st);
case "*":
return c(left,st)*c(_617,st);
case "/":
return c(left,st)/c(_617,st);
case "%":
return c(left,st)%c(_617,st);
case "<":
return c(left,st)<c(_617,st);
case ">":
return c(left,st)>c(_617,st);
case "^":
return c(left,st)^c(_617,st);
case "&":
return c(left,st)&c(_617,st);
case "|":
return c(left,st)|c(_617,st);
case "==":
return c(left,st)==c(_617,st);
case "===":
return c(left,st)===c(_617,st);
case "!=":
return c(left,st)!=c(_617,st);
case "!==":
return c(left,st)!==c(_617,st);
case "<=":
return c(left,st)<=c(_617,st);
case ">=":
return c(left,st)>=c(_617,st);
case ">>":
return c(left,st)>>c(_617,st);
case ">>>":
return c(left,st)>>>c(_617,st);
case "<<":
return c(left,st)<<c(_617,st);
}
},UnaryExpression:function(node,st,c){
var arg=node.argument;
switch(node.operator){
case "-":
return -c(arg,st);
case "+":
return +c(arg,st);
case "!":
return !c(arg,st);
case "~":
return ~c(arg,st);
}
},Literal:function(node,st,c){
return node.value;
},Identifier:function(node,st,c){
return 0;
},DefinedExpression:function(node,st,c){
var _618=node.object;
if(_618.type==="Identifier"){
var name=_618.name,_619=_4c8.preprocessGetMacro(name)||_4e7(name);
return _619||0;
}else{
return c(_618,st);
}
}},{});
};
function _61a(code,_61b,_61c){
switch(code){
case 46:
return _5e0(code,_61b);
case 40:
++_4de;
return _61b(_589);
case 41:
++_4de;
return _61b(_58a);
case 59:
++_4de;
return _61b(_58c);
case 44:
++_4de;
return _61b(_58b);
case 91:
++_4de;
return _61b(_585);
case 93:
++_4de;
return _61b(_586);
case 123:
++_4de;
return _61b(_587);
case 125:
++_4de;
return _61b(_588);
case 58:
++_4de;
return _61b(_58d);
case 63:
++_4de;
return _61b(_58f);
case 48:
var next=_4c9.charCodeAt(_4de+1);
if(next===120||next===88){
return _61d(_61b);
}
case 49:
case 50:
case 51:
case 52:
case 53:
case 54:
case 55:
case 56:
case 57:
return _5e2(false,_61b);
case 34:
case 39:
return _5f6(code,_61b);
case 47:
return _5e3(_61b);
case 37:
case 42:
return _5e7(_61b);
case 124:
case 38:
return _5e9(code,_61b);
case 94:
return _5eb(_61b);
case 43:
case 45:
return _5ed(code,_61b);
case 60:
case 62:
return _5ef(code,_61b);
case 61:
case 33:
return _5f2(code,_61b);
case 126:
return _5e6(_596,1,_61b);
case 64:
if(_4c8.objj){
return _5f4(code,_61b);
}
return false;
case 35:
if(_4c8.preprocess){
if(_524){
++_4de;
return _61b(_56e);
}
_4f1.lastIndex=0;
var _61e=_4f1.exec(_4c9.slice(_501,_4de));
if(_514!==0&&_514!==_4de&&!_61e&&(_521&&!_521.isIncludeFile||_4de!==0)){
if(_521){
return _61f();
}else{
_4ed(_4de,"Preprocessor directives may only be used at the beginning of a line");
}
}
return _5f9(_61b);
}
return false;
case 92:
if(_4c8.preprocess){
return _5e6(_57b,1,_61b);
}
return false;
}
if(_61c){
if(code===13||code===10||code===8232||code===8233){
if(_4c8.locations){
++_4df;
_4f6=_4de;
}
return _5e6(_534,code===13&&_4c9.charCodeAt(_4de+1)===10?2:1,_61b);
}
}
return false;
};
function _61f(){
var _620=_520.length,_621=_521;
_4de++;
_529=true;
next(false,2);
_529=false;
var _622=_4fc+_4fe;
var _623=_4c8.locations&&new _5b7(_4df,_4f6);
var _624;
if(_506===_531){
var _625=_510.slice(_4fc,_4fc+1);
var _626=_625==="\""?"\\\"":"'";
_624=_626;
_624+=_627(_507);
_624+=_626;
}else{
_624=_507!=null?_507:_506.keyword||_506.type;
}
while(_520.length>_620&&_621===_520[_620-1]){
_529=true;
next(false,2);
_529=false;
if(_514!==_4fc){
_624+=" ";
}
if(_506===_531){
var _625=_510.slice(_4fc,_4fc+1);
var _626=_625==="\""?"\\\"":"'";
_624+=_626;
_624+=_627(_507);
_624+=_626;
}else{
_624+=_507!=null?_507:_506.keyword||_506.type;
}
}
var _628=new _4dc(null,"\""+_624+"\"",null,_622,false,null,false,_623);
return _5ca(_628,_4ff,null,null,_4de,next);
};
function _627(_629){
for(var _62a="",pos=0,size=_629.length,ch=_629.charCodeAt(pos);pos<size;ch=_629.charCodeAt(++pos)){
switch(ch){
case 34:
_62a+="\\\\\\\"";
break;
case 10:
_62a+="\\\\n";
break;
case 13:
_62a+="\\\\r";
break;
case 9:
_62a+="\\\\t";
break;
case 8:
_62a+="\\\\b";
break;
case 11:
_62a+="\\\\v";
break;
case 160:
_62a+="\\\\u00A0";
break;
case 8232:
_62a+="\\\\u2028";
break;
case 8233:
_62a+="\\\\u2029";
break;
case 92:
_62a+="\\\\";
break;
default:
_62a+=_629.charAt(pos);
break;
}
}
return _62a;
};
function _5fb(_62b,_62c){
var ch=_5d7(!_62c,false,_62b);
return ch;
};
function _601(_62d){
var _62e=[];
while(_62e.length>0||_51a!==_575&&(_51a!==_574&&_51a!==_577||_62d)){
switch(_51a){
case _573:
case _571:
case _572:
_62e.push(_573);
break;
case _574:
if(_62e[_62e.length-1]!==_573){
_4ed(_51c,"#else after #else");
}else{
_62e[_62e.length-1]=_574;
}
break;
case _576:
if(_62e[_62e.length-1]!==_573){
_4ed(_51c,"#elif after #else");
}
break;
case _575:
_62e.pop();
break;
case _533:
_52a=true;
_4ed(_51c,"Missing #endif");
}
_5fc(true);
}
_52a=true;
if(_51a===_575){
_52b.pop();
}
};
function _5fc(_62f,_630,_631,_632){
_51c=_4de;
_511=_4c9;
_526=_525;
if(_4de>=_4ca){
return _609(_533);
}
var code=_4c9.charCodeAt(_4de);
if(!_630&&!_52a&&code!==35){
_5d6();
_609(_57f,_4c9.slice(_51c,_4de));
_5fb(true,true);
return;
}else{
if(_523&&code!==41&&code!==44){
var _633=0;
while(_4de<_4ca&&(_633||code!==41&&code!==44)){
if(code===40){
_633++;
}
if(code===41){
_633--;
}
if(code===34||code===39){
var _634=code;
code=_4c9.charCodeAt(++_4de);
while(_4de<_4ca&&code!==_634){
if(code===92){
code=_4c9.charCodeAt(++_4de);
if(code!==_634){
continue;
}
}
code=_4c9.charCodeAt(++_4de);
}
}
code=_4c9.charCodeAt(++_4de);
}
return _609(_57e,_4c9.slice(_51c,_4de));
}
}
if(_5b0(code)||code===92&&_4c9.charCodeAt(_4de+1)===117){
return _635(_631);
}
if(_61a(code,_62f?_636:_609,true)===false){
var ch=String.fromCharCode(code);
if(ch==="\\"||_5ad.test(ch)){
return _635(_631);
}
_4ed(_4de,"Unexpected character '"+ch+"'");
}
};
function _635(_637,_638){
var word=_5f7();
var type=_532;
if(_637&&_4c8.preprocess){
var _639=_63a(word,_63b,_638);
if(_639===true){
return true;
}
}
if(!_63c&&_5a8(word)){
type=_584[word];
}
_609(type,word,_639,false,_637);
};
function _609(type,val,_63d,_63e,_63f){
_51a=type;
_51b=val;
_51d=_63d||_4de;
if(type!==_534){
_4fb=_51d;
}
var ch=_5fb(false,_63e);
if(ch===35&&_4c8.preprocess&&!_528&&_4c9.charCodeAt(_4de+1)===35){
var val1=val!=null?val:type.keyword||type.type;
_4de+=2;
if(val1!=null){
var _640=_4c8.locations&&new _5b7(_4df,_4f6);
var _641=_510,_642=_51d,_643=_51c,_644=_51c+_4fe,_645=_521&&_521.macro&&_521.macro.variadicName;
_4f9();
if(_645&&_645===_4c9.slice(_4de,_4de+_645.length)){
var _646=true;
}
_529=true;
_5fc(null,null,_63f,2);
_529=false;
var val2=_51b!=null?_51b:_51a.keyword||_51a.type;
if(val2!=null){
if(_646&&val1===","&&val2===""){
return _5fc();
}
var _647=""+val1+val2,_648=_51c+_4ff;
var _649=new _4dc(null,_647,null,_644,false,null,false,_640);
var r=_5ca(_649,_4ff,_521?_521.parameterDict:null,null,_4de,_63b,null);
if(_521&&_521.macro===_649){
_51a=type;
_51c=_643;
_51d=_642;
_510=_641;
_4ff=_648-val1.length;
if(!_646){
console.log("Warning: pasting formed '"+_647+"', an invalid preprocessing token");
}
}else{
return r;
}
}
}
}
};
function _636(type,val){
_51a=type;
_51b=val;
_4fb=_51d=_4de;
_5fb(true);
};
function _63b(_64a,_64b,_64c,_64d){
if(!_64a){
_51e=_51c;
_51f=_51d;
}
_501=_4fb;
return _5fc(false,false,_64d,_64b);
};
function _613(type,_64e){
if(_51a===type){
_63b(false,false,null,_64e);
return true;
}
};
function _60f(type,_64f,_650){
if(_51a===type){
_63b(false,_1b,null,_650);
}else{
_4ed(_51c,_64f||"Unexpected token");
}
};
function _651(){
};
function _5fd(_652){
var _653=_51a===_532?_51b:(!_4c8.forbidReserved||_51a.okAsIdent)&&_51a.keyword||_651();
_63b(false,false,null,_652);
return _653;
};
function _654(_655){
var node=_656();
node.name=_5fd(_655);
return _657(node,"Identifier");
};
function _5ff(_658){
return _659(_658);
};
function _659(_65a){
return _65b(_65c(_65a),-1,_65a);
};
function _65b(left,_65d,_65e){
var prec=_51a.binop;
if(prec){
if(!_51a.preprocess){
_4ed(_51c,"Unsupported macro operator");
}
if(prec>_65d){
var node=_65f(left);
node.left=left;
node.operator=_51b;
_63b(false,false,null,_65e);
node.right=_65b(_65c(_65e),prec,_65e);
var node=_657(node,/&&|\|\|/.test(node.operator)?"LogicalExpression":"BinaryExpression");
return _65b(node,_65d,_65e);
}
}
return left;
};
function _65c(_660){
if(_51a.preprocess&&_51a.prefix){
var node=_656();
node.operator=_51b;
node.prefix=true;
_63b(false,false,null,_660);
node.argument=_65c(_660);
return _657(node,"UnaryExpression");
}
return _661(_660);
};
function _661(_662){
switch(_51a){
case _532:
return _654(_662);
case _52f:
case _531:
return _663(_662);
case _589:
var _664=_51c;
_63b(false,false,null,_662);
var val=_5ff(_662);
val.start=_664;
val.end=_51d;
_60f(_58a,"Expected closing ')' in macro expression",_662);
return val;
case _57a:
var node=_656();
_63b(false,false,null,_662);
node.object=_665(_662);
return _657(node,"DefinedExpression");
default:
_666();
}
};
function _665(_667){
switch(_51a){
case _532:
return _654(_667);
case _52f:
case _531:
return _663(_667);
case _589:
var _668=_51c;
_63b(false,false,null,_667);
var val=_665(_667);
val.start=_668;
val.end=_51d;
_60f(_58a,"Expected closing ')' in macro expression",_667);
return val;
default:
_666();
}
};
function _663(_669){
var node=_656();
node.value=_51b;
node.raw=_511.slice(_51c,_51d);
_63b(false,false,null,_669);
return _657(node,"Literal");
};
function _657(node,type){
node.type=type;
node.end=_51f;
return node;
};
function _5c6(_66a,_66b,_66c){
_508=_50e;
_50b=_50f;
if(!_66a){
_4fc=_4de;
}else{
_4de=_4fc+1;
}
if(!_66c){
_4fa=_4fc;
}
_510=_4c9;
_4fe=_4ff;
_526=_525;
if(_4c8.locations){
_504=new _5b2();
}
if(_66a){
return _5e5();
}
if(_4de>=_4ca){
return _5bd(_533);
}
var code=_4c9.charCodeAt(_4de);
if(_5b0(code)||code===92){
return _66d(null,_66b,_66a);
}
var tok=_61a(code,_5bd);
if(tok===false){
var ch=String.fromCharCode(code);
if(ch==="\\"||_5ad.test(ch)){
return _66d(null,_66b,_66a);
}
_4ed(_4de,"Unexpected character '"+ch+"'");
}
return tok;
};
function _5e6(type,size,_66e){
var str=_4c9.slice(_4de,_4de+size);
_4de+=size;
_66e(type,str);
};
function _5e5(){
var _66f="",_670,_671,_672=_4de;
for(;;){
if(_4de>=_4ca){
_4ed(_672,"Unterminated regular expression");
}
var ch=_4c9.charAt(_4de);
if(_5af.test(ch)){
_4ed(_672,"Unterminated regular expression");
}
if(!_670){
if(ch==="["){
_671=true;
}else{
if(ch==="]"&&_671){
_671=false;
}else{
if(ch==="/"&&!_671){
break;
}
}
}
_670=ch==="\\";
}else{
_670=false;
}
++_4de;
}
var _66f=_4c9.slice(_672,_4de);
++_4de;
var mods=_5f7();
if(mods&&!/^[gmsiy]*$/.test(mods)){
_4ed(_672,"Invalid regexp flag");
}
return _5bd(_530,new RegExp(_66f,mods));
};
function _673(_674,len){
var _675=_4de,_676=0;
for(var i=0,e=len==null?Infinity:len;i<e;++i){
var code=_4c9.charCodeAt(_4de),val;
if(code>=97){
val=code-97+10;
}else{
if(code>=65){
val=code-65+10;
}else{
if(code>=48&&code<=57){
val=code-48;
}else{
val=Infinity;
}
}
}
if(val>=_674){
break;
}
++_4de;
_676=_676*_674+val;
}
if(_4de===_675||len!=null&&_4de-_675!==len){
return null;
}
return _676;
};
function _61d(_677){
_4de+=2;
var val=_673(16);
if(val==null){
_4ed(_4fc+2,"Expected hexadecimal number");
}
if(_5b0(_4c9.charCodeAt(_4de))){
_4ed(_4de,"Identifier directly after number");
}
return _677(_52f,val);
};
function _5e2(_678,_679){
var _67a=_4de,_67b=false,_67c=_4c9.charCodeAt(_4de)===48;
if(!_678&&_673(10)===null){
_4ed(_67a,"Invalid number");
}
if(_4c9.charCodeAt(_4de)===46){
++_4de;
_673(10);
_67b=true;
}
var next=_4c9.charCodeAt(_4de);
if(next===69||next===101){
next=_4c9.charCodeAt(++_4de);
if(next===43||next===45){
++_4de;
}
if(_673(10)===null){
_4ed(_67a,"Invalid number");
}
_67b=true;
}
if(_5b0(_4c9.charCodeAt(_4de))){
_4ed(_4de,"Identifier directly after number");
}
var str=_4c9.slice(_67a,_4de),val;
if(_67b){
val=parseFloat(str);
}else{
if(!_67c||str.length===1){
val=parseInt(str,10);
}else{
if(/[89]/.test(str)||_519){
_4ed(_67a,"Invalid number");
}else{
val=parseInt(str,8);
}
}
}
return _679(_52f,val);
};
function _5f6(_67d,_67e){
_4de++;
var out="";
for(;;){
if(_4de>=_4ca){
_4ed(_4fc,"Unterminated string constant");
}
var ch=_4c9.charCodeAt(_4de);
if(ch===_67d){
++_4de;
return _67e(_531,out);
}
if(ch===92){
ch=_4c9.charCodeAt(++_4de);
var _67f=/^[0-7]+/.exec(_4c9.slice(_4de,_4de+3));
if(_67f){
_67f=_67f[0];
}
while(_67f&&parseInt(_67f,8)>255){
_67f=_67f.slice(0,_67f.length-1);
}
if(_67f==="0"){
_67f=null;
}
++_4de;
if(_67f){
if(_519){
_4ed(_4de-2,"Octal literal in strict mode");
}
out+=String.fromCharCode(parseInt(_67f,8));
_4de+=_67f.length-1;
}else{
switch(ch){
case 110:
out+="\n";
break;
case 114:
out+="\r";
break;
case 120:
out+=String.fromCharCode(_680(2));
break;
case 117:
out+=String.fromCharCode(_680(4));
break;
case 85:
out+=String.fromCharCode(_680(8));
break;
case 116:
out+="\t";
break;
case 98:
out+="\b";
break;
case 118:
out+="\v";
break;
case 102:
out+="\f";
break;
case 48:
out+="\x00";
break;
case 13:
if(_4c9.charCodeAt(_4de)===10){
++_4de;
}
case 10:
if(_4c8.locations){
_4f6=_4de;
++_4df;
}
break;
default:
out+=String.fromCharCode(ch);
break;
}
}
}else{
if(ch===13||ch===10||ch===8232||ch===8233){
_4ed(_4fc,"Unterminated string constant");
}
out+=String.fromCharCode(ch);
++_4de;
}
}
};
function _680(len){
var n=_673(16,len);
if(n===null){
_4ed(_4fc,"Bad character escape sequence");
}
return n;
};
var _63c;
function _5f7(){
_63c=false;
var word,_681=true,_682=_4de;
for(;;){
var ch=_4c9.charCodeAt(_4de);
if(_5b1(ch)){
if(_63c){
word+=_4c9.charAt(_4de);
}
++_4de;
}else{
if(ch===92){
if(!_63c){
word=_4c9.slice(_682,_4de);
}
_63c=true;
if(_4c9.charCodeAt(++_4de)!=117){
_4ed(_4de,"Expecting Unicode escape sequence \\uXXXX");
}
++_4de;
var esc=_680(4);
var _683=String.fromCharCode(esc);
if(!_683){
_4ed(_4de-1,"Invalid Unicode escape");
}
if(!(_681?_5b0(esc):_5b1(esc))){
_4ed(_4de-4,"Invalid Unicode escape");
}
word+=_683;
}else{
break;
}
}
_681=false;
}
return _63c?word:_4c9.slice(_682,_4de);
};
function _66d(_684,_685,_686){
var word=_684||_5f7();
var type=_532;
if(_4c8.preprocess){
var _687=_63a(word,next,_685,_686);
if(_687===true){
return true;
}
}
if(!_63c){
if(_5a6(word)){
type=_581[word];
}else{
if(_4c8.objj&&_5a7(word)){
type=_582[word];
}else{
if(_4c8.forbidReserved&&(_4c8.ecmaVersion===3?_5a2:_5a3)(word)||_519&&_5a4(word)){
_4ed(_4fc,"The keyword '"+word+"' is reserved");
}
}
}
}
return _5bd(type,word,_687);
};
function _63a(word,_688,_689,_68a){
var _68b,_68c=_521,_68d=_525;
if(_68c){
var _68e=_526||_521;
if(_68e.parameterDict&&_68e.macro.isParameterFunction()(word)){
_68b=_68e.parameterDict[word];
if(!_68b&&_68e.macro.variadicName===word){
if(_529){
_5bd(_532,"");
return true;
}else{
_5d7();
_688(true,_689,_68a,true);
}
return true;
}
if(_5d7(true,true)===true){
if(_68f(35,35)){
_689=2;
}
}else{
if(_4c9.charCodeAt(_4de)===35&&_4c9.charCodeAt(_4de+1)===35){
_689=2;
}
}
_525=_68b&&_68b.parameterScope;
_689--;
}
}
if(!_68b&&(!_689&&!_522||_4de<_4ca)&&_4c8.preprocessIsMacro(word)){
_525=null;
_68b=_4c8.preprocessGetMacro(word);
if(_68b){
if(!_521||!_521.macro.isArgument){
var i=_520.length,_690;
while(i>0){
var item=_520[--i],_691=item.macro;
if(_691.identifier===word&&!(_690&&_690.isArgument)){
_68b=null;
}
_690=_691;
}
}
}else{
_68b=_4e7(word);
}
}
if(_68b){
var _692;
var _693=_68b.parameters;
var _694;
if(_693){
var pos=_4de;
var loc;
if(_4c8.locations){
loc=new _5b2();
}
if(_5d7(true,true)===true&&_68f(40)||_4c9.charCodeAt(_4de)===40){
_694=true;
}else{
_527=loc;
return pos;
}
}
if(!_693||_694){
if(_694){
var _695=_68b.variadicName;
var _696=true;
var _697=0;
_692=Object.create(null);
_5d7(true);
if(_4c9.charCodeAt(_4de++)!==40){
_4ed(_4de-1,"Expected '(' before macro prarameters");
}
_5d7(true,true,true);
var code=_4c9.charCodeAt(_4de++);
while(_4de<_4ca&&code!==41){
if(_696){
_696=false;
}else{
if(code===44){
_5d7(true,true,true);
code=_4c9.charCodeAt(_4de++);
}else{
_4ed(_4de-1,"Expected ',' between macro parameters");
}
}
var _698=_693[_697++];
var _699=_695&&_693.length===_697;
var _69a=_4de-1,_69b=0;
var _69c=_4c8.locations&&new _5b7(_4df,_4f6);
while(_4de<_4ca&&(_69b||code!==41&&(code!==44||_699))){
if(code===40){
_69b++;
}
if(code===41){
_69b--;
}
if(code===34||code===39){
var _69d=code;
code=_4c9.charCodeAt(_4de++);
while(_4de<_4ca&&code!==_69d){
if(code===92){
code=_4c9.charCodeAt(_4de++);
if(code!==_69d){
continue;
}
}
code=_4c9.charCodeAt(_4de++);
}
}
code=_4c9.charCodeAt(_4de++);
}
var val=_4c9.slice(_69a,_4de-1);
_692[_698]=new _4dc(_698,val,null,_69a+_4fe,true,_526||_521,false,_69c);
}
if(code!==41){
_4ed(_4de,"Expected ')' after macro prarameters");
}
_5d7(true,true);
}
return _5ca(_68b,_4ff,_692,_68d,_4de,_688,_689,_68a);
}
}
};
function _68f(_69e,_69f){
var i=_520.length;
stackloop:
while(i-->0){
var _6a0=_520[i],_6a1=_6a0.end,_6a2=_6a0.input,_6a3=_6a0.inputLen;
for(;;){
var ch=_6a2.charCodeAt(_6a1);
if(ch===32){
++_6a1;
}else{
if(ch===13){
++_6a1;
var next=_6a2.charCodeAt(_6a1);
if(next===10){
++_6a1;
}
}else{
if(ch===10){
++_6a1;
}else{
if(ch===9){
++_6a1;
}else{
if(ch===47){
var next=_6a2.charCodeAt(_6a1+1);
if(next===42){
var end=_6a2.indexOf("*/",_6a1+=2);
if(end===-1){
_4ed(_6a1-2,"Unterminated comment");
}
_6a1=end+2;
}else{
if(next===47){
ch=_6a2.charCodeAt(_6a1+=2);
while(_6a1<_4ca&&ch!==10&&ch!==13&&ch!==8232&&ch!==8233){
++_6a1;
ch=_6a2.charCodeAt(_6a1);
}
}else{
break stackloop;
}
}
}else{
if(ch===160||ch===11||ch===12||ch>=5760&&_5a9.test(String.fromCharCode(ch))){
++_6a1;
}else{
if(_6a1>=_6a3){
continue stackloop;
}else{
if(ch===92){
var pos=_6a1+1;
ch=_6a2.charCodeAt(pos);
while(pos<_6a3&&(ch===32||ch===9||ch===11||ch===12||ch>=5760&&_5aa.test(String.fromCharCode(ch)))){
ch=_6a2.charCodeAt(++pos);
}
_4f1.lastIndex=0;
var _6a4=_4f1.exec(_6a2.slice(pos,pos+2));
if(_6a4&&_6a4.index===0){
_6a1=pos+_6a4[0].length;
}else{
break stackloop;
}
}else{
break stackloop;
}
}
}
}
}
}
}
}
}
}
return _6a2&&_6a2.charCodeAt(_6a1)===_69e&&(_69f==null||_6a2.charCodeAt(_6a1+1)===_69f);
};
function _5ca(_6a5,_6a6,_6a7,_6a8,end,_6a9,_6aa,_6ab){
var _6ac=_6a5.macro;
if(!_6ac&&_6a9===_63b){
_6ac="1";
}
if(_6ac){
_60a(_6a5,_6ac,_6a6,_6a7,_6a8,end,_6aa);
}else{
if(_529){
(_6a9===next?_5bd:_609)(_532,"");
return true;
}
}
_5d7();
_6a9(true,_6aa,_6ab,true);
return true;
};
function _60a(_6ad,_6ae,_6af,_6b0,_6b1,end,_6b2,_6b3){
_521={macro:_6ad,macroOffset:_6af,parameterDict:_6b0,end:end,lastEnd:_501,inputLen:_4ca,tokStart:_4fc,onlyTransformArgumentsForLastToken:_522,currentLine:_4df,currentLineStart:_4f6,sourceFile:_4cb};
if(_6b1){
_521.parameterScope=_6b1;
}
if(_6b3){
_521.isIncludeFile=_6b3;
}
_521.input=_4c9;
_520.push(_521);
_522=_6b2;
_4c9=_6ae;
_4ca=_6ae.length;
_4ff=_6ad.start;
_4de=0;
_4df=1;
_4f6=0;
_4fb=0;
_501=0;
if(_6ad.sourceFile){
_4cb=_6ad.sourceFile;
}
};
var _4dc=_4c7.Macro=function _4dc(_6b4,_6b5,_6b6,_6b7,_6b8,_6b9,_6ba,_6bb,_6bc){
this.identifier=_6b4;
if(_6b5!=null){
this.macro=_6b5;
}
if(_6b6){
this.parameters=_6b6;
}
if(_6b7!=null){
this.start=_6b7;
}
if(_6b8){
this.isArgument=true;
}
if(_6b9){
this.parameterScope=_6b9;
}
if(_6ba){
this.variadicName=_6ba;
}
if(_6bb){
this.locationOffset=_6bb;
}
if(_6bc){
this.sourceFile=_6bc;
}
};
_4dc.prototype.isParameterFunction=function(){
return this.isParameterFunctionVar||(this.isParameterFunctionVar=_4e6((this.parameters||[]).join(" ")));
};
function next(_6bd,_6be,_6bf){
if(!_6bd){
_513=_4fc;
_514=_4fd;
_512=_510;
_503=_502;
_515=_505;
_500=_4fe;
}
_501=_4fb;
_502=_516=null;
return _5c6(_6bf,_6be,_6bd);
};
function _6c0(_6c1){
_519=_6c1;
_4de=_514;
while(_4de<_4f6){
_4f6=_4c9.lastIndexOf("\n",_4f6-2)+1;
--_4df;
}
_4f9();
_5c6();
};
function _6c2(){
this.type=null;
this.start=_4fc+_4fe;
this.end=null;
};
function _6c3(){
this.start=_504;
this.end=null;
if(_4cb!=null){
this.source=_4cb;
}
};
function _656(){
var node=new _6c2();
if(_4c8.trackComments&&_508){
node.commentsBefore=_508;
_508=null;
}
if(_4c8.trackSpaces&&_50b){
node.spacesBefore=_50b;
_50b=null;
}
if(_4c8.locations){
node.loc=new _6c3();
}
if(_4c8.ranges){
node.range=[_4fc,0];
}
return node;
};
function _65f(_6c4){
var node=new _6c2();
node.start=_6c4.start;
if(_6c4.commentsBefore){
node.commentsBefore=_6c4.commentsBefore;
delete _6c4.commentsBefore;
}
if(_6c4.spacesBefore){
node.spacesBefore=_6c4.spacesBefore;
delete _6c4.spacesBefore;
}
if(_4c8.locations){
node.loc=new _6c3();
node.loc.start=_6c4.loc.start;
}
if(_4c8.ranges){
node.range=[_6c4.range[0],0];
}
return node;
};
var _6c5;
function _6c6(node,type){
var _6c7=_514+_500;
node.type=type;
node.end=_6c7;
if(_4c8.trackComments){
if(_50a){
node.commentsAfter=_50a;
_50a=null;
}else{
if(_6c5&&_6c5.end===_514&&_6c5.commentsAfter){
node.commentsAfter=_6c5.commentsAfter;
delete _6c5.commentsAfter;
}
}
if(!_4c8.trackSpaces){
_6c5=node;
}
}
if(_4c8.trackSpaces){
if(_50d){
node.spacesAfter=_50d;
_50d=null;
}else{
if(_6c5&&_6c5.end===_514&&_6c5.spacesAfter){
node.spacesAfter=_6c5.spacesAfter;
delete _6c5.spacesAfter;
}
}
_6c5=node;
}
if(_4c8.locations){
node.loc.end=_515;
}
if(_4c8.ranges){
node.range[1]=_6c7;
}
return node;
};
function _6c8(stmt){
return _4c8.ecmaVersion>=5&&stmt.type==="ExpressionStatement"&&stmt.expression.type==="Literal"&&stmt.expression.value==="use strict";
};
function eat(type){
if(_506===type){
next();
return true;
}
};
function _6c9(){
return !_4c8.strictSemicolons&&(_506===_533||_506===_588||_5af.test(_512.slice(_514,_503||_4fa))||_516&&_4c8.objj||_503!=null);
};
function _6ca(){
if(!eat(_58c)&&!_6c9()){
_4ed(_4fc,"Expected a semicolon");
}
};
function _6cb(type,_6cc){
if(_506===type){
next();
}else{
_6cc?_4ed(_4fc,_6cc):_666();
}
};
function _666(){
_4ed(_4fc,"Unexpected token");
};
function _6cd(expr){
if(expr.type!=="Identifier"&&expr.type!=="MemberExpression"&&expr.type!=="Dereference"){
_4ed(expr.start,"Assigning to rvalue");
}
if(_519&&expr.type==="Identifier"&&_5a5(expr.name)){
_4ed(expr.start,"Assigning to "+expr.name+" in strict mode");
}
};
function _4d0(_6ce){
_513=_501=_514=0;
if(_4c8.preprocess){
var _6cf=_4c8.preIncludeFiles;
if(_6cf&&_6cf.length){
for(var i=_6cf.length-1;i>=0;i--){
var _6d0=_6cf[i];
var _6d1=new _4dc(null,_6d0.include,null,0,false,null,false,null,_6d0.sourceFile);
_60a(_6d1,_6d1.macro,0,null,null,_4de,null,true);
_4f9();
}
}
}
if(_4c8.locations){
_515=new _5b2();
}
_517=_519=null;
_518=[];
_5c6();
var node=_6ce||_656(),_6d2=true;
if(!_6ce){
node.body=[];
}
while(_506!==_533){
var stmt=_6d3();
node.body.push(stmt);
if(_6d2&&_6c8(stmt)){
_6c0(true);
}
_6d2=false;
}
return _6c6(node,"Program");
};
var _6d4={kind:"loop"},_6d5={kind:"switch"};
function _6d3(){
if(_506===_591||_506===_593&&_507=="/="){
_5c6(true);
}
var _6d6=_506,node=_656();
if(_516){
node.expression=_6d7(_516,_516.object);
_6ca();
return _6c6(node,"ExpressionStatement");
}
switch(_6d6){
case _535:
case _538:
next();
var _6d8=_6d6===_535;
if(eat(_58c)||_6c9()){
node.label=null;
}else{
if(_506!==_532){
_666();
}else{
node.label=_6d9();
_6ca();
}
}
for(var i=0;i<_518.length;++i){
var lab=_518[i];
if(node.label==null||lab.name===node.label.name){
if(lab.kind!=null&&(_6d8||lab.kind==="loop")){
break;
}
if(node.label&&_6d8){
break;
}
}
}
if(i===_518.length){
_4ed(node.start,"Unsyntactic "+_6d6.keyword);
}
return _6c6(node,_6d8?"BreakStatement":"ContinueStatement");
case _539:
next();
_6ca();
return _6c6(node,"DebuggerStatement");
case _53b:
next();
_518.push(_6d4);
node.body=_6d3();
_518.pop();
_6cb(_546,"Expected 'while' at end of do statement");
node.test=_6da();
_6ca();
return _6c6(node,"DoWhileStatement");
case _53e:
next();
_518.push(_6d4);
_6cb(_589,"Expected '(' after 'for'");
if(_506===_58c){
return _6db(node,null);
}
if(_506===_545){
var init=_656();
next();
_6dc(init,true);
if(init.declarations.length===1&&eat(_54e)){
return _6dd(node,init);
}
return _6db(node,init);
}
var init=_6de(false,true);
if(eat(_54e)){
_6cd(init);
return _6dd(node,init);
}
return _6db(node,init);
case _53f:
next();
return _6df(node,true);
case _540:
next();
node.test=_6da();
node.consequent=_6d3();
node.alternate=eat(_53c)?_6d3():null;
return _6c6(node,"IfStatement");
case _541:
if(!_517){
_4ed(_4fc,"'return' outside of function");
}
next();
if(eat(_58c)||_6c9()){
node.argument=null;
}else{
node.argument=_6de();
_6ca();
}
return _6c6(node,"ReturnStatement");
case _542:
next();
node.discriminant=_6da();
node.cases=[];
_6cb(_587,"Expected '{' in switch statement");
_518.push(_6d5);
for(var cur,_6e0;_506!=_588;){
if(_506===_536||_506===_53a){
var _6e1=_506===_536;
if(cur){
_6c6(cur,"SwitchCase");
}
node.cases.push(cur=_656());
cur.consequent=[];
next();
if(_6e1){
cur.test=_6de();
}else{
if(_6e0){
_4ed(_513,"Multiple default clauses");
}
_6e0=true;
cur.test=null;
}
_6cb(_58d,"Expected ':' after case clause");
}else{
if(!cur){
_666();
}
cur.consequent.push(_6d3());
}
}
if(cur){
_6c6(cur,"SwitchCase");
}
next();
_518.pop();
return _6c6(node,"SwitchStatement");
case _543:
next();
if(_5af.test(_510.slice(_514,_4fc))){
_4ed(_514,"Illegal newline after throw");
}
node.argument=_6de();
_6ca();
return _6c6(node,"ThrowStatement");
case _544:
next();
node.block=_6e2();
node.handler=null;
if(_506===_537){
var _6e3=_656();
next();
_6cb(_589,"Expected '(' after 'catch'");
_6e3.param=_6d9();
if(_519&&_5a5(_6e3.param.name)){
_4ed(_6e3.param.start,"Binding "+_6e3.param.name+" in strict mode");
}
_6cb(_58a,"Expected closing ')' after catch");
_6e3.guard=null;
_6e3.body=_6e2();
node.handler=_6c6(_6e3,"CatchClause");
}
node.guardedHandlers=_52e;
node.finalizer=eat(_53d)?_6e2():null;
if(!node.handler&&!node.finalizer){
_4ed(node.start,"Missing catch or finally clause");
}
return _6c6(node,"TryStatement");
case _545:
next();
node=_6dc(node);
_6ca();
return node;
case _546:
next();
node.test=_6da();
_518.push(_6d4);
node.body=_6d3();
_518.pop();
return _6c6(node,"WhileStatement");
case _547:
if(_519){
_4ed(_4fc,"'with' in strict mode");
}
next();
node.object=_6da();
node.body=_6d3();
return _6c6(node,"WithStatement");
case _587:
return _6e2();
case _58c:
next();
return _6c6(node,"EmptyStatement");
case _55f:
if(_4c8.objj){
next();
node.classname=_6d9(true);
if(eat(_58d)){
node.superclassname=_6d9(true);
}else{
if(eat(_589)){
node.categoryname=_6d9(true);
_6cb(_58a,"Expected closing ')' after category name");
}
}
if(_507==="<"){
next();
var _6e4=[],_6e5=true;
node.protocols=_6e4;
while(_507!==">"){
if(!_6e5){
_6cb(_58b,"Expected ',' between protocol names");
}else{
_6e5=false;
}
_6e4.push(_6d9(true));
}
next();
}
if(eat(_587)){
node.ivardeclarations=[];
for(;;){
if(eat(_588)){
break;
}
_6e6(node);
}
node.endOfIvars=_4fc;
}
node.body=[];
while(!eat(_552)){
if(_506===_533){
_4ed(_4de,"Expected '@end' after '@interface'");
}
node.body.push(_6e7());
}
return _6c6(node,"InterfaceDeclarationStatement");
}
break;
case _54f:
if(_4c8.objj){
next();
node.classname=_6d9(true);
if(eat(_58d)){
node.superclassname=_6d9(true);
}else{
if(eat(_589)){
node.categoryname=_6d9(true);
_6cb(_58a,"Expected closing ')' after category name");
}
}
if(_507==="<"){
next();
var _6e4=[],_6e5=true;
node.protocols=_6e4;
while(_507!==">"){
if(!_6e5){
_6cb(_58b,"Expected ',' between protocol names");
}else{
_6e5=false;
}
_6e4.push(_6d9(true));
}
next();
}
if(eat(_587)){
node.ivardeclarations=[];
for(;;){
if(eat(_588)){
break;
}
_6e6(node);
}
node.endOfIvars=_4fc;
}
node.body=[];
while(!eat(_552)){
if(_506===_533){
_4ed(_4de,"Expected '@end' after '@implementation'");
}
node.body.push(_6e7());
}
return _6c6(node,"ClassDeclarationStatement");
}
break;
case _55c:
if(_4c8.objj&&_4c9.charCodeAt(_4de)!==40){
next();
node.protocolname=_6d9(true);
if(_507==="<"){
next();
var _6e4=[],_6e5=true;
node.protocols=_6e4;
while(_507!==">"){
if(!_6e5){
_6cb(_58b,"Expected ',' between protocol names");
}else{
_6e5=false;
}
_6e4.push(_6d9(true));
}
next();
}
while(!eat(_552)){
if(_506===_533){
_4ed(_4de,"Expected '@end' after '@protocol'");
}
if(eat(_55e)){
continue;
}
if(eat(_55d)){
while(!eat(_55e)&&_506!==_552){
(node.optional||(node.optional=[])).push(_6e8());
}
}else{
(node.required||(node.required=[])).push(_6e8());
}
}
return _6c6(node,"ProtocolDeclarationStatement");
}
break;
case _553:
if(_4c8.objj){
next();
if(_506===_531){
node.localfilepath=true;
}else{
if(_506===_561){
node.localfilepath=false;
}else{
_666();
}
}
node.filename=_6e9();
return _6c6(node,"ImportStatement");
}
break;
case _56e:
if(_4c8.objj){
next();
return _6c6(node,"PreprocessStatement");
}
break;
case _556:
if(_4c8.objj){
next();
node.id=_6d9(false);
return _6c6(node,"ClassStatement");
}
break;
case _557:
if(_4c8.objj){
next();
node.id=_6d9(false);
return _6c6(node,"GlobalStatement");
}
break;
case _560:
if(_4c8.objj){
next();
node.typedefname=_6d9(true);
return _6c6(node,"TypeDefStatement");
}
break;
}
var _6ea=_507,expr=_6de();
if(_6d6===_532&&expr.type==="Identifier"&&eat(_58d)){
for(var i=0;i<_518.length;++i){
if(_518[i].name===_6ea){
_4ed(expr.start,"Label '"+_6ea+"' is already declared");
}
}
var kind=_506.isLoop?"loop":_506===_542?"switch":null;
_518.push({name:_6ea,kind:kind});
node.body=_6d3();
_518.pop();
node.label=expr;
return _6c6(node,"LabeledStatement");
}else{
node.expression=expr;
_6ca();
return _6c6(node,"ExpressionStatement");
}
};
function _6e6(node){
var _6eb;
if(eat(_550)){
_6eb=true;
}
var type=_6ec();
if(_519&&_5a5(type.name)){
_4ed(type.start,"Binding "+type.name+" in strict mode");
}
for(;;){
var decl=_656();
if(_6eb){
decl.outlet=_6eb;
}
decl.ivartype=type;
decl.id=_6d9();
if(_519&&_5a5(decl.id.name)){
_4ed(decl.id.start,"Binding "+decl.id.name+" in strict mode");
}
if(eat(_551)){
decl.accessors={};
if(eat(_589)){
if(!eat(_58a)){
for(;;){
var _6ed=_6d9(true);
switch(_6ed.name){
case "property":
case "getter":
_6cb(_592,"Expected '=' after 'getter' accessor attribute");
decl.accessors[_6ed.name]=_6d9(true);
break;
case "setter":
_6cb(_592,"Expected '=' after 'setter' accessor attribute");
var _6ee=_6d9(true);
decl.accessors[_6ed.name]=_6ee;
if(eat(_58d)){
_6ee.end=_4fc;
}
_6ee.name+=":";
break;
case "readwrite":
case "readonly":
case "copy":
decl.accessors[_6ed.name]=true;
break;
default:
_4ed(_6ed.start,"Unknown accessors attribute '"+_6ed.name+"'");
}
if(!eat(_58b)){
break;
}
}
_6cb(_58a,"Expected closing ')' after accessor attributes");
}
}
}
_6c6(decl,"IvarDeclaration");
node.ivardeclarations.push(decl);
if(!eat(_58b)){
break;
}
}
_6ca();
};
function _6ef(node){
node.methodtype=_507;
_6cb(_594,"Method declaration must start with '+' or '-'");
if(eat(_589)){
var _6f0=_656();
if(eat(_554)){
node.action=_6c6(_6f0,"ObjectiveJActionType");
_6f0=_656();
}
if(!eat(_58a)){
node.returntype=_6ec(_6f0);
_6cb(_58a,"Expected closing ')' after method return type");
}
}
var _6f1=true,_6f2=[],args=[];
node.selectors=_6f2;
node.arguments=args;
for(;;){
if(_506!==_58d){
_6f2.push(_6d9(true));
if(_6f1&&_506!==_58d){
break;
}
}else{
_6f2.push(null);
}
_6cb(_58d,"Expected ':' in selector");
var _6f3={};
args.push(_6f3);
if(eat(_589)){
_6f3.type=_6ec();
_6cb(_58a,"Expected closing ')' after method argument type");
}
_6f3.identifier=_6d9(false);
if(_506===_587||_506===_58c){
break;
}
if(eat(_58b)){
_6cb(_590,"Expected '...' after ',' in method declaration");
node.parameters=true;
break;
}
_6f1=false;
}
};
function _6e7(){
var _6f4=_656();
if(_507==="+"||_507==="-"){
_6ef(_6f4);
eat(_58c);
_6f4.startOfBody=_514;
var _6f5=_517,_6f6=_518;
_517=true;
_518=[];
_6f4.body=_6e2(true);
_517=_6f5;
_518=_6f6;
return _6c6(_6f4,"MethodDeclarationStatement");
}else{
return _6d3();
}
};
function _6e8(){
var _6f7=_656();
_6ef(_6f7);
_6ca();
return _6c6(_6f7,"MethodDeclarationStatement");
};
function _6da(){
_6cb(_589,"Expected '(' before expression");
var val=_6de();
_6cb(_58a,"Expected closing ')' after expression");
return val;
};
function _6e2(_6f8){
var node=_656(),_6f9=true,_519=false,_6fa;
node.body=[];
_6cb(_587,"Expected '{' before block");
while(!eat(_588)){
var stmt=_6d3();
node.body.push(stmt);
if(_6f9&&_6f8&&_6c8(stmt)){
_6fa=_519;
_6c0(_519=true);
}
_6f9=false;
}
if(_519&&!_6fa){
_6c0(false);
}
return _6c6(node,"BlockStatement");
};
function _6db(node,init){
node.init=init;
_6cb(_58c,"Expected ';' in for statement");
node.test=_506===_58c?null:_6de();
_6cb(_58c,"Expected ';' in for statement");
node.update=_506===_58a?null:_6de();
_6cb(_58a,"Expected closing ')' in for statement");
node.body=_6d3();
_518.pop();
return _6c6(node,"ForStatement");
};
function _6dd(node,init){
node.left=init;
node.right=_6de();
_6cb(_58a,"Expected closing ')' in for statement");
node.body=_6d3();
_518.pop();
return _6c6(node,"ForInStatement");
};
function _6dc(node,noIn){
node.declarations=[];
node.kind="var";
for(;;){
var decl=_656();
decl.id=_6d9();
if(_519&&_5a5(decl.id.name)){
_4ed(decl.id.start,"Binding "+decl.id.name+" in strict mode");
}
decl.init=eat(_592)?_6de(true,noIn):null;
node.declarations.push(_6c6(decl,"VariableDeclarator"));
if(!eat(_58b)){
break;
}
}
return _6c6(node,"VariableDeclaration");
};
function _6de(_6fb,noIn){
var expr=_6fc(noIn);
if(!_6fb&&_506===_58b){
var node=_65f(expr);
node.expressions=[expr];
while(eat(_58b)){
node.expressions.push(_6fc(noIn));
}
return _6c6(node,"SequenceExpression");
}
return expr;
};
function _6fc(noIn){
var left=_6fd(noIn);
if(_506.isAssign){
var node=_65f(left);
node.operator=_507;
node.left=left;
next();
node.right=_6fc(noIn);
_6cd(left);
return _6c6(node,"AssignmentExpression");
}
return left;
};
function _6fd(noIn){
var expr=_6fe(noIn);
if(eat(_58f)){
var node=_65f(expr);
node.test=expr;
node.consequent=_6de(true);
_6cb(_58d,"Expected ':' in conditional expression");
node.alternate=_6de(true,noIn);
return _6c6(node,"ConditionalExpression");
}
return expr;
};
function _6fe(noIn){
return _6ff(_700(),-1,noIn);
};
function _6ff(left,_701,noIn){
var prec=_506.binop;
if(prec!=null&&(!noIn||_506!==_54e)){
if(prec>_701){
var node=_65f(left);
node.left=left;
node.operator=_507;
next();
node.right=_6ff(_700(),prec,noIn);
var node=_6c6(node,/&&|\|\|/.test(node.operator)?"LogicalExpression":"BinaryExpression");
return _6ff(node,_701,noIn);
}
}
return left;
};
function _700(){
if(_506.prefix){
var node=_656(),_702=_506.isUpdate;
node.operator=_507;
node.prefix=true;
_4f8=true;
next();
node.argument=_700();
if(_702){
_6cd(node.argument);
}else{
if(_519&&node.operator==="delete"&&node.argument.type==="Identifier"){
_4ed(node.start,"Deleting local variable in strict mode");
}
}
return _6c6(node,_702?"UpdateExpression":"UnaryExpression");
}
var expr=_703();
while(_506.postfix&&!_6c9()){
var node=_65f(expr);
node.operator=_507;
node.prefix=false;
node.argument=expr;
_6cd(expr);
next();
expr=_6c6(node,"UpdateExpression");
}
return expr;
};
function _703(){
return _704(_705());
};
function _704(base,_706){
if(eat(_58e)){
var node=_65f(base);
node.object=base;
node.property=_6d9(true);
node.computed=false;
return _704(_6c6(node,"MemberExpression"),_706);
}else{
if(_4c8.objj){
var _707=_656();
}
if(eat(_585)){
var expr=_6de();
if(_4c8.objj&&_506!==_586){
_707.object=expr;
_516=_707;
return base;
}
var node=_65f(base);
node.object=base;
node.property=expr;
node.computed=true;
_6cb(_586,"Expected closing ']' in subscript");
return _704(_6c6(node,"MemberExpression"),_706);
}else{
if(!_706&&eat(_589)){
var node=_65f(base);
node.callee=base;
node.arguments=_708(_58a,_506===_58a?null:_6de(true),false);
return _704(_6c6(node,"CallExpression"),_706);
}
}
}
return base;
};
function _705(){
switch(_506){
case _549:
var node=_656();
next();
return _6c6(node,"ThisExpression");
case _532:
return _6d9();
case _52f:
case _531:
case _530:
return _6e9();
case _54b:
case _54c:
case _54d:
var node=_656();
node.value=_506.atomValue;
node.raw=_506.keyword;
next();
return _6c6(node,"Literal");
case _589:
var _709=_504,_70a=_4fe,_70b=_4fc+_70a;
next();
var val=_6de();
val.start=_70b;
val.end=_4fd+_70a;
if(_4c8.locations){
val.loc.start=_709;
val.loc.end=_505;
}
if(_4c8.ranges){
val.range=[_70b,_4fd+_500];
}
_6cb(_58a,"Expected closing ')' in expression");
return val;
case _559:
var node=_656(),_70c=null;
next();
_6cb(_585,"Expected '[' at beginning of array literal");
if(_506!==_586){
_70c=_6de(true,true);
}
node.elements=_708(_586,_70c,true,true);
return _6c6(node,"ArrayLiteral");
case _585:
var node=_656(),_70c=null;
next();
if(_506!==_58b&&_506!==_586){
_70c=_6de(true,true);
if(_506!==_58b&&_506!==_586){
return _6d7(node,_70c);
}
}
node.elements=_708(_586,_70c,true,true);
return _6c6(node,"ArrayExpression");
case _558:
var node=_656();
next();
var r=_70d();
node.keys=r[0];
node.values=r[1];
return _6c6(node,"DictionaryLiteral");
case _587:
return _70e();
case _53f:
var node=_656();
next();
return _6df(node,false);
case _548:
return _70f();
case _555:
var node=_656();
next();
_6cb(_589,"Expected '(' after '@selector'");
_710(node,_58a);
_6cb(_58a,"Expected closing ')' after selector");
return _6c6(node,"SelectorLiteralExpression");
case _55c:
var node=_656();
next();
_6cb(_589,"Expected '(' after '@protocol'");
node.id=_6d9(true);
_6cb(_58a,"Expected closing ')' after protocol name");
return _6c6(node,"ProtocolLiteralExpression");
case _55a:
var node=_656();
next();
_6cb(_589,"Expected '(' after '@ref'");
node.element=_6d9(node,_58a);
_6cb(_58a,"Expected closing ')' after ref");
return _6c6(node,"Reference");
case _55b:
var node=_656();
next();
_6cb(_589,"Expected '(' after '@deref'");
node.expr=_6de(true,true);
_6cb(_58a,"Expected closing ')' after deref");
return _6c6(node,"Dereference");
default:
if(_506.okAsIdent){
return _6d9();
}
_666();
}
};
function _6d7(node,_711){
_712(node,_586);
if(_711.type==="Identifier"&&_711.name==="super"){
node.superObject=true;
}else{
node.object=_711;
}
return _6c6(node,"MessageSendExpression");
};
function _710(node,_713){
var _714=true,_715=[];
for(;;){
if(_506!==_58d){
_715.push((_6d9(true)).name);
if(_714&&_506===_713){
break;
}
}
_6cb(_58d,"Expected ':' in selector");
_715.push(":");
if(_506===_713){
break;
}
_714=false;
}
node.selector=_715.join("");
};
function _712(node,_716){
var _717=true,_718=[],args=[],_719=[];
node.selectors=_718;
node.arguments=args;
for(;;){
if(_506!==_58d){
_718.push(_6d9(true));
if(_717&&eat(_716)){
break;
}
}else{
_718.push(null);
}
_6cb(_58d,"Expected ':' in selector");
args.push(_6de(true,true));
if(eat(_716)){
break;
}
if(_506===_58b){
node.parameters=[];
while(eat(_58b)){
node.parameters.push(_6de(true,true));
}
eat(_716);
break;
}
_717=false;
}
};
function _70f(){
var node=_656();
next();
node.callee=_704(_705(false),true);
if(eat(_589)){
node.arguments=_708(_58a,_506===_58a?null:_6de(true),false);
}else{
node.arguments=_52e;
}
return _6c6(node,"NewExpression");
};
function _70e(){
var node=_656(),_71a=true,_71b=false;
node.properties=[];
next();
while(!eat(_588)){
if(!_71a){
_6cb(_58b,"Expected ',' in object literal");
if(_4c8.allowTrailingCommas&&eat(_588)){
break;
}
}else{
_71a=false;
}
var prop={key:_71c()},_71d=false,kind;
if(eat(_58d)){
prop.value=_6de(true);
kind=prop.kind="init";
}else{
if(_4c8.ecmaVersion>=5&&prop.key.type==="Identifier"&&(prop.key.name==="get"||prop.key.name==="set")){
_71d=_71b=true;
kind=prop.kind=prop.key.name;
prop.key=_71c();
if(_506!==_589){
_666();
}
prop.value=_6df(_656(),false);
}else{
_666();
}
}
if(prop.key.type==="Identifier"&&(_519||_71b)){
for(var i=0;i<node.properties.length;++i){
var _71e=node.properties[i];
if(_71e.key.name===prop.key.name){
var _71f=kind==_71e.kind||_71d&&_71e.kind==="init"||kind==="init"&&(_71e.kind==="get"||_71e.kind==="set");
if(_71f&&!_519&&kind==="init"&&_71e.kind==="init"){
_71f=false;
}
if(_71f){
_4ed(prop.key.start,"Redefinition of property");
}
}
}
}
node.properties.push(prop);
}
return _6c6(node,"ObjectExpression");
};
function _71c(){
if(_506===_52f||_506===_531){
return _705();
}
return _6d9(true);
};
function _6df(node,_720){
if(_506===_532){
node.id=_6d9();
}else{
if(_720){
_666();
}else{
node.id=null;
}
}
node.params=[];
var _721=true;
_6cb(_589,"Expected '(' before function parameters");
while(!eat(_58a)){
if(!_721){
_6cb(_58b,"Expected ',' between function parameters");
}else{
_721=false;
}
node.params.push(_6d9());
}
var _722=_517,_723=_518;
_517=true;
_518=[];
node.body=_6e2(true);
_517=_722;
_518=_723;
if(_519||node.body.body.length&&_6c8(node.body.body[0])){
for(var i=node.id?-1:0;i<node.params.length;++i){
var id=i<0?node.id:node.params[i];
if(_5a4(id.name)||_5a5(id.name)){
_4ed(id.start,"Defining '"+id.name+"' in strict mode");
}
if(i>=0){
for(var j=0;j<i;++j){
if(id.name===node.params[j].name){
_4ed(id.start,"Argument name clash in strict mode");
}
}
}
}
}
return _6c6(node,_720?"FunctionDeclaration":"FunctionExpression");
};
function _708(_724,_725,_726,_727){
if(_725&&eat(_724)){
return [_725];
}
var elts=[],_728=true;
while(!eat(_724)){
if(_728){
_728=false;
if(_727&&_506===_58b&&!_725){
elts.push(null);
}else{
elts.push(_725);
}
}else{
_6cb(_58b,"Expected ',' between expressions");
if(_726&&_4c8.allowTrailingCommas&&eat(_724)){
break;
}
if(_727&&_506===_58b){
elts.push(null);
}else{
elts.push(_6de(true));
}
}
}
return elts;
};
function _70d(){
_6cb(_587,"Expected '{' before dictionary");
var keys=[],_729=[],_72a=true;
while(!eat(_588)){
if(!_72a){
_6cb(_58b,"Expected ',' between expressions");
if(_4c8.allowTrailingCommas&&eat(_588)){
break;
}
}
keys.push(_6de(true,true));
_6cb(_58d,"Expected ':' between dictionary key and value");
_729.push(_6de(true,true));
_72a=false;
}
return [keys,_729];
};
function _6d9(_72b){
var node=_656();
node.name=_506===_532?_507:(_72b&&!_4c8.forbidReserved||_506.okAsIdent)&&_506.keyword||_666();
_4f8=false;
next();
return _6c6(node,"Identifier");
};
function _6e9(){
var node=_656();
node.value=_507;
node.raw=_510.slice(_4fc,_4fd);
next();
return _6c6(node,"Literal");
};
function _6ec(_72c){
var node=_72c?_65f(_72c):_656(),_72d=false;
if(_506===_532){
node.name=_507;
node.typeisclass=true;
_72d=true;
next();
}else{
node.typeisclass=false;
node.name=_506.keyword;
if(!eat(_54a)){
if(eat(_569)){
_72d=true;
}else{
var _72e;
if(eat(_56c)||eat(_56a)||eat(_56b)||eat(_56d)){
_72e=_506.keyword;
}else{
if(eat(_563)||eat(_562)){
_72e=_506.keyword||true;
}
if(eat(_565)||eat(_564)||eat(_566)){
if(_72e){
node.name+=" "+_72e;
}
_72e=_506.keyword||true;
}else{
if(eat(_567)){
if(_72e){
node.name+=" "+_72e;
}
_72e=_506.keyword||true;
}
if(eat(_568)){
if(_72e){
node.name+=" "+_72e;
}
_72e=_506.keyword||true;
if(eat(_568)){
node.name+=" "+_72e;
}
}
}
if(!_72e){
node.name=!_4c8.forbidReserved&&_506.keyword||_666();
node.typeisclass=true;
_72d=true;
next();
}
}
}
}
}
if(_72d){
if(_507==="<"){
var _72f=true,_730=[];
node.protocols=_730;
do{
next();
if(_72f){
_72f=false;
}else{
eat(_58b);
}
_730.push(_6d9(true));
}while(_507!==">");
next();
}
}
return _6c6(node,"ObjectiveJType");
};
})(_2.acorn||(_2.acorn={}),_2.acorn.walk||(_2.acorn.walk=typeof acorn!=="undefined"&&acorn.walk)||(_2.acorn.walk={}));
if(!_2.acorn){
_2.acorn={};
_2.acorn.walk={};
}
(function(_731){
"use strict";
_731.simple=function(node,_732,base,_733){
if(!base){
base=_731;
}
function c(node,st,_734){
var type=_734||node.type,_735=_732[type];
if(_735){
_735(node,st);
}
base[type](node,st,c);
};
c(node,_733);
};
_731.recursive=function(node,_736,_737,base){
var _738=_731.make(_737,base);
function c(node,st,_739){
return _738[_739||node.type](node,st,c);
};
return c(node,_736);
};
_731.make=function(_73a,base){
if(!base){
base=_731;
}
var _73b={};
for(var type in base){
_73b[type]=base[type];
}
for(var type in _73a){
_73b[type]=_73a[type];
}
return _73b;
};
function _73c(node,st,c){
c(node,st);
};
function _73d(node,st,c){
};
_731.Program=_731.BlockStatement=function(node,st,c){
for(var i=0;i<node.body.length;++i){
c(node.body[i],st,"Statement");
}
};
_731.Statement=_73c;
_731.EmptyStatement=_73d;
_731.ExpressionStatement=function(node,st,c){
c(node.expression,st,"Expression");
};
_731.IfStatement=function(node,st,c){
c(node.test,st,"Expression");
c(node.consequent,st,"Statement");
if(node.alternate){
c(node.alternate,st,"Statement");
}
};
_731.LabeledStatement=function(node,st,c){
c(node.body,st,"Statement");
};
_731.BreakStatement=_731.ContinueStatement=_73d;
_731.WithStatement=function(node,st,c){
c(node.object,st,"Expression");
c(node.body,st,"Statement");
};
_731.SwitchStatement=function(node,st,c){
c(node.discriminant,st,"Expression");
for(var i=0;i<node.cases.length;++i){
var cs=node.cases[i];
if(cs.test){
c(cs.test,st,"Expression");
}
for(var j=0;j<cs.consequent.length;++j){
c(cs.consequent[j],st,"Statement");
}
}
};
_731.ReturnStatement=function(node,st,c){
if(node.argument){
c(node.argument,st,"Expression");
}
};
_731.ThrowStatement=function(node,st,c){
c(node.argument,st,"Expression");
};
_731.TryStatement=function(node,st,c){
c(node.block,st,"Statement");
if(node.handler){
c(node.handler.body,st,"ScopeBody");
}
if(node.finalizer){
c(node.finalizer,st,"Statement");
}
};
_731.WhileStatement=function(node,st,c){
c(node.test,st,"Expression");
c(node.body,st,"Statement");
};
_731.DoWhileStatement=function(node,st,c){
c(node.body,st,"Statement");
c(node.test,st,"Expression");
};
_731.ForStatement=function(node,st,c){
if(node.init){
c(node.init,st,"ForInit");
}
if(node.test){
c(node.test,st,"Expression");
}
if(node.update){
c(node.update,st,"Expression");
}
c(node.body,st,"Statement");
};
_731.ForInStatement=function(node,st,c){
c(node.left,st,"ForInit");
c(node.right,st,"Expression");
c(node.body,st,"Statement");
};
_731.ForInit=function(node,st,c){
if(node.type=="VariableDeclaration"){
c(node,st);
}else{
c(node,st,"Expression");
}
};
_731.DebuggerStatement=_73d;
_731.FunctionDeclaration=function(node,st,c){
c(node,st,"Function");
};
_731.VariableDeclaration=function(node,st,c){
for(var i=0;i<node.declarations.length;++i){
var decl=node.declarations[i];
if(decl.init){
c(decl.init,st,"Expression");
}
}
};
_731.Function=function(node,st,c){
c(node.body,st,"ScopeBody");
};
_731.ScopeBody=function(node,st,c){
c(node,st,"Statement");
};
_731.Expression=_73c;
_731.ThisExpression=_73d;
_731.ArrayExpression=_731.ArrayLiteral=function(node,st,c){
for(var i=0;i<node.elements.length;++i){
var elt=node.elements[i];
if(elt){
c(elt,st,"Expression");
}
}
};
_731.DictionaryLiteral=function(node,st,c){
for(var i=0;i<node.keys.length;i++){
var key=node.keys[i];
c(key,st,"Expression");
var _73e=node.values[i];
c(_73e,st,"Expression");
}
};
_731.ObjectExpression=function(node,st,c){
for(var i=0;i<node.properties.length;++i){
c(node.properties[i].value,st,"Expression");
}
};
_731.FunctionExpression=_731.FunctionDeclaration;
_731.SequenceExpression=function(node,st,c){
for(var i=0;i<node.expressions.length;++i){
c(node.expressions[i],st,"Expression");
}
};
_731.UnaryExpression=_731.UpdateExpression=function(node,st,c){
c(node.argument,st,"Expression");
};
_731.BinaryExpression=_731.AssignmentExpression=_731.LogicalExpression=function(node,st,c){
c(node.left,st,"Expression");
c(node.right,st,"Expression");
};
_731.ConditionalExpression=function(node,st,c){
c(node.test,st,"Expression");
c(node.consequent,st,"Expression");
c(node.alternate,st,"Expression");
};
_731.NewExpression=_731.CallExpression=function(node,st,c){
c(node.callee,st,"Expression");
if(node.arguments){
for(var i=0;i<node.arguments.length;++i){
c(node.arguments[i],st,"Expression");
}
}
};
_731.MemberExpression=function(node,st,c){
c(node.object,st,"Expression");
if(node.computed){
c(node.property,st,"Expression");
}
};
_731.Identifier=_731.Literal=_73d;
_731.ClassDeclarationStatement=function(node,st,c){
if(node.ivardeclarations){
for(var i=0;i<node.ivardeclarations.length;++i){
c(node.ivardeclarations[i],st,"IvarDeclaration");
}
}
for(var i=0;i<node.body.length;++i){
c(node.body[i],st,"Statement");
}
};
_731.ImportStatement=_73d;
_731.IvarDeclaration=_73d;
_731.PreprocessStatement=_73d;
_731.ClassStatement=_73d;
_731.GlobalStatement=_73d;
_731.ProtocolDeclarationStatement=function(node,st,c){
if(node.required){
for(var i=0;i<node.required.length;++i){
c(node.required[i],st,"Statement");
}
}
if(node.optional){
for(var i=0;i<node.optional.length;++i){
c(node.optional[i],st,"Statement");
}
}
};
_731.TypeDefStatement=_73d;
_731.MethodDeclarationStatement=function(node,st,c){
var body=node.body;
if(body){
c(body,st,"Statement");
}
};
_731.MessageSendExpression=function(node,st,c){
if(!node.superObject){
c(node.object,st,"Expression");
}
if(node.arguments){
for(var i=0;i<node.arguments.length;++i){
c(node.arguments[i],st,"Expression");
}
}
if(node.parameters){
for(var i=0;i<node.parameters.length;++i){
c(node.parameters[i],st,"Expression");
}
}
};
_731.SelectorLiteralExpression=_73d;
_731.ProtocolLiteralExpression=_73d;
_731.Reference=function(node,st,c){
c(node.element,st,"Identifier");
};
_731.Dereference=function(node,st,c){
c(node.expr,st,"Expression");
};
function _73f(prev){
return {vars:Object.create(null),prev:prev};
};
_731.scopeVisitor=_731.make({Function:function(node,_740,c){
var _741=_73f(_740);
for(var i=0;i<node.params.length;++i){
_741.vars[node.params[i].name]={type:"argument",node:node.params[i]};
}
if(node.id){
var decl=node.type=="FunctionDeclaration";
(decl?_740:_741).vars[node.id.name]={type:decl?"function":"function name",node:node.id};
}
c(node.body,_741,"ScopeBody");
},TryStatement:function(node,_742,c){
c(node.block,_742,"Statement");
if(node.handler){
var _743=_73f(_742);
_743.vars[node.handler.param.name]={type:"catch clause",node:node.handler.param};
c(node.handler.body,_743,"ScopeBody");
}
if(node.finalizer){
c(node.finalizer,_742,"Statement");
}
},VariableDeclaration:function(node,_744,c){
for(var i=0;i<node.declarations.length;++i){
var decl=node.declarations[i];
_744.vars[decl.id.name]={type:"var",node:decl.id};
if(decl.init){
c(decl.init,_744,"Expression");
}
}
}});
})(typeof _2=="undefined"?acorn.walk={}:_2.acorn.walk);
(function(mod){
mod(_2.ObjJCompiler||(_2.ObjJCompiler={}),_2.acorn||acorn,(_2.acorn||acorn).walk,typeof _2.sourceMap!="undefined"?_2.sourceMap:typeof module!="undefined"&&typeof module.exports==="object"?module.exports:null);
})(function(_745,_746,walk,_747){
"use strict";
_745.version="0.3.7";
var _748=function(prev,base){
this.vars=Object.create(null);
if(base){
for(var key in base){
this[key]=base[key];
}
}
this.prev=prev;
if(prev){
this.compiler=prev.compiler;
this.nodeStack=prev.nodeStack.slice(0);
this.nodePriorStack=prev.nodePriorStack.slice(0);
this.nodeStackOverrideType=prev.nodeStackOverrideType.slice(0);
}else{
this.nodeStack=[];
this.nodePriorStack=[];
this.nodeStackOverrideType=[];
}
};
_748.prototype.toString=function(){
return this.ivars?"ivars: "+JSON.stringify(this.ivars):"<No ivars>";
};
_748.prototype.compiler=function(){
return this.compiler;
};
_748.prototype.rootScope=function(){
return this.prev?this.prev.rootScope():this;
};
_748.prototype.isRootScope=function(){
return !this.prev;
};
_748.prototype.currentClassName=function(){
return this.classDef?this.classDef.name:this.prev?this.prev.currentClassName():null;
};
_748.prototype.currentProtocolName=function(){
return this.protocolDef?this.protocolDef.name:this.prev?this.prev.currentProtocolName():null;
};
_748.prototype.getIvarForCurrentClass=function(_749){
if(this.ivars){
var ivar=this.ivars[_749];
if(ivar){
return ivar;
}
}
var prev=this.prev;
if(prev&&!this.classDef){
return prev.getIvarForCurrentClass(_749);
}
return null;
};
_748.prototype.getLvarScope=function(_74a,_74b){
if(this.vars){
var lvar=this.vars[_74a];
if(lvar){
return this;
}
}
var prev=this.prev;
if(prev&&(!_74b||!this.methodType)){
return prev.getLvarScope(_74a,_74b);
}
return this;
};
_748.prototype.getLvar=function(_74c,_74d){
if(this.vars){
var lvar=this.vars[_74c];
if(lvar){
return lvar;
}
}
var prev=this.prev;
if(prev&&(!_74d||!this.methodType)){
return prev.getLvar(_74c,_74d);
}
return null;
};
_748.prototype.getVarScope=function(){
var prev=this.prev;
return prev?prev.getVarScope():this;
};
_748.prototype.currentMethodType=function(){
return this.methodType?this.methodType:this.prev?this.prev.currentMethodType():null;
};
_748.prototype.copyAddedSelfToIvarsToParent=function(){
if(this.prev&&this.addedSelfToIvars){
for(var key in this.addedSelfToIvars){
var _74e=this.addedSelfToIvars[key],_74f=(this.prev.addedSelfToIvars||(this.prev.addedSelfToIvars=Object.create(null)))[key]||(this.prev.addedSelfToIvars[key]=[]);
_74f.push.apply(_74f,_74e);
}
}
};
_748.prototype.addMaybeWarning=function(_750){
var _751=this.rootScope(),_752=_751._maybeWarnings;
if(!_752){
_751._maybeWarnings=_752=[_750];
}else{
var _753=_752[_752.length-1];
if(!_753.isEqualTo(_750)){
_752.push(_750);
}
}
};
_748.prototype.variablesNotReadWarnings=function(){
var _754=this.compiler;
if(_754.options.warnings.includes(_755)&&this.prev&&this.vars){
for(var key in this.vars){
var lvar=this.vars[key];
if(!lvar.isRead&&lvar.type==="var"){
_754.addWarning(_756("Variable '"+key+"' is never read",lvar.node,_754.source));
}
}
}
};
_748.prototype.maybeWarnings=function(){
return (this.rootScope())._maybeWarnings;
};
_748.prototype.pushNode=function(node,_757){
var _758=this.nodePriorStack,_759=_758.length,_75a=_759?_758[_759-1]:null,_75b=_759?this.nodeStack[_759-1]:null;
if(_75a){
if(_75b!==node){
_75a.push(node);
}
}
_758.push(_75b===node?_75a:[]);
this.nodeStack.push(node);
this.nodeStackOverrideType.push(_757);
};
_748.prototype.popNode=function(){
this.nodeStackOverrideType.pop();
this.nodePriorStack.pop();
return this.nodeStack.pop();
};
_748.prototype.currentNode=function(){
var _75c=this.nodeStack;
return _75c[_75c.length-1];
};
_748.prototype.currentOverrideType=function(){
var _75d=this.nodeStackOverrideType;
return _75d[_75d.length-1];
};
_748.prototype.priorNode=function(){
var _75e=this.nodePriorStack,_75f=_75e.length;
if(_75f>1){
var _760=_75e[_75f-2],l=_760.length;
return _760[l-2]||null;
}
return null;
};
_748.prototype.formatDescription=function(_761,_762,_763){
var _764=this.nodeStack,_765=_764.length;
_761=_761||0;
if(_761>=_765){
return null;
}
var i=_765-_761-1;
var _766=_764[i];
var _767=_762||this.compiler.formatDescription;
var _768=_762?_762.parent:_767;
var _769;
if(_768){
var _76a=_763===_766?this.nodeStackOverrideType[i]:_766.type;
_769=_768[_76a];
if(_763===_766&&!_769){
return null;
}
}
if(_769){
return this.formatDescription(_761+1,_769);
}else{
_769=this.formatDescription(_761+1,_762,_766);
if(_769){
return _769;
}else{
var _76b=_767.prior;
if(_76b){
var _76c=this.priorNode(),_76d=_76b[_76c?_76c.type:"None"];
if(_76d){
return _76d;
}
}
return _767;
}
}
};
var _76e=function(prev,base){
_748.call(this,prev,base);
};
_76e.prototype=Object.create(_748.prototype);
_76e.prototype.constructor=_76e;
_76e.prototype.getVarScope=function(){
return this;
};
_76e.prototype.variablesNotReadWarnings=function(){
_748.prototype.variablesNotReadWarnings.call(this);
var prev=this.prev;
if(prev&&this.possibleHoistedVariables){
for(var key in this.possibleHoistedVariables){
var _76f=this.possibleHoistedVariables[key];
if(_76f){
var _770=prev.vars&&prev.vars[key];
if(_770!=null){
var _771=(prev.possibleHoistedVariables||(prev.possibleHoistedVariables=Object.create(null)))[key];
if(_771==null){
prev.possibleHoistedVariables[key]=_76f;
}else{
throw new Error("Internal inconsistency, previous scope should not have this possible hoisted variable '"+key+"'");
}
}
}
}
}
};
var _772=function(_773,node,code){
this.message=_756(_773,node,code);
this.node=node;
};
_772.prototype.checkIfWarning=function(st){
var _774=this.node.name;
return !st.getLvar(_774)&&typeof _1[_774]==="undefined"&&(typeof window==="undefined"||typeof window[_774]==="undefined")&&!st.compiler.getClassDef(_774);
};
_772.prototype.isEqualTo=function(_775){
if(this.message.message!==_775.message.message){
return false;
}
if(this.node.start!==_775.node.start){
return false;
}
if(this.node.end!==_775.node.end){
return false;
}
return true;
};
function _300(_776,file,_777){
if(_776){
this.rootNode=new _747.SourceNode();
this.concat=this.concatSourceNode;
this.toString=this.toStringSourceNode;
this.isEmpty=this.isEmptySourceNode;
this.appendStringBuffer=this.appendStringBufferSourceNode;
this.length=this.lengthSourceNode;
if(file){
var _778=file.toString(),_779=_778.substr(_778.lastIndexOf("/")+1),_77a=_778.substr(0,_778.lastIndexOf("/")+1);
this.filename=_779;
if(_77a.length>0){
this.sourceRoot=_77a;
}
if(_777!=null){
this.rootNode.setSourceContent(_779,_777);
}
}
if(_777!=null){
this.sourceContent=_777;
}
}else{
this.atoms=[];
this.concat=this.concatString;
this.toString=this.toStringString;
this.isEmpty=this.isEmptyString;
this.appendStringBuffer=this.appendStringBufferString;
this.length=this.lengthString;
}
};
_300.prototype.toStringString=function(){
return this.atoms.join("");
};
_300.prototype.toStringSourceNode=function(){
return this.rootNode.toStringWithSourceMap({file:this.filename+"s",sourceRoot:this.sourceRoot});
};
_300.prototype.concatString=function(_77b){
this.atoms.push(_77b);
};
_300.prototype.concatSourceNode=function(_77c,node,_77d){
if(node){
this.rootNode.add(new _747.SourceNode(node.loc.start.line,node.loc.start.column,node.loc.source,_77c,_77d));
}else{
this.rootNode.add(_77c);
}
if(!this.notEmpty){
this.notEmpty=true;
}
};
_300.prototype.concatFormat=function(_77e){
if(!_77e){
return;
}
var _77f=_77e.split("\n"),size=_77f.length;
if(size>1){
this.concat(_77f[0]);
for(var i=1;i<size;i++){
var line=_77f[i];
this.concat("\n");
if(line.slice(0,1)==="\\"){
var _780=1;
var _781=line.slice(1,1+_780);
if(_781==="-"){
_780=2;
_781=line.slice(1,1+_780);
}
var _782=parseInt(_781);
if(_782){
this.concat(_782>0?_783+(Array(_782*_784+1)).join(_785):_783.substring(_786*-_782));
}
line=line.slice(1+_780);
}else{
if(line||i===size-1){
this.concat(_783);
}
}
if(line){
this.concat(line);
}
}
}else{
this.concat(_77e);
}
};
_300.prototype.isEmptyString=function(){
return this.atoms.length!==0;
};
_300.prototype.isEmptySourceNode=function(){
return this.notEmpty;
};
_300.prototype.appendStringBufferString=function(_787){
var _788=this.atoms;
var _789=_788.length;
var _78a=_787.atoms;
var _78b=_78a.length;
_788.length=_789+_78b;
for(var i=0;i<_78b;i++){
_788[_789+i]=_78a[i];
}
};
_300.prototype.appendStringBufferSourceNode=function(_78c){
this.rootNode.add(_78c.rootNode);
};
_300.prototype.lengthString=function(){
return this.atoms.length;
};
_300.prototype.lengthSourceNode=function(){
return this.rootNode.children.length;
};
var _78d=function(_78e,name,_78f,_790,_791,_792,_793){
this.name=name;
if(_78f){
this.superClass=_78f;
}
if(_790){
this.ivars=_790;
}
if(_78e){
this.instanceMethods=_791||Object.create(null);
this.classMethods=_792||Object.create(null);
}
if(_793){
this.protocols=_793;
}
};
_78d.prototype.addInstanceMethod=function(_794){
this.instanceMethods[_794.name]=_794;
};
_78d.prototype.addClassMethod=function(_795){
this.classMethods[_795.name]=_795;
};
_78d.prototype.listOfNotImplementedMethodsForProtocols=function(_796){
var _797=[],_798=this.getInstanceMethods(),_799=this.getClassMethods();
for(var i=0,size=_796.length;i<size;i++){
var _79a=_796[i],_79b=_79a.requiredInstanceMethods,_79c=_79a.requiredClassMethods,_79d=_79a.protocols;
if(_79b){
for(var _79e in _79b){
var _79f=_79b[_79e];
if(!_798[_79e]){
_797.push({"methodDef":_79f,"protocolDef":_79a});
}
}
}
if(_79c){
for(var _79e in _79c){
var _79f=_79c[_79e];
if(!_799[_79e]){
_797.push({"methodDef":_79f,"protocolDef":_79a});
}
}
}
if(_79d){
_797=_797.concat(this.listOfNotImplementedMethodsForProtocols(_79d));
}
}
return _797;
};
_78d.prototype.getInstanceMethod=function(name){
var _7a0=this.instanceMethods;
if(_7a0){
var _7a1=_7a0[name];
if(_7a1){
return _7a1;
}
}
var _7a2=this.superClass;
if(_7a2){
return _7a2.getInstanceMethod(name);
}
return null;
};
_78d.prototype.getClassMethod=function(name){
var _7a3=this.classMethods;
if(_7a3){
var _7a4=_7a3[name];
if(_7a4){
return _7a4;
}
}
var _7a5=this.superClass;
if(_7a5){
return _7a5.getClassMethod(name);
}
return null;
};
_78d.prototype.getInstanceMethods=function(){
var _7a6=this.instanceMethods;
if(_7a6){
var _7a7=this.superClass,_7a8=Object.create(null);
if(_7a7){
var _7a9=_7a7.getInstanceMethods();
for(var _7aa in _7a9){
_7a8[_7aa]=_7a9[_7aa];
}
}
for(var _7aa in _7a6){
_7a8[_7aa]=_7a6[_7aa];
}
return _7a8;
}
return [];
};
_78d.prototype.getClassMethods=function(){
var _7ab=this.classMethods;
if(_7ab){
var _7ac=this.superClass,_7ad=Object.create(null);
if(_7ac){
var _7ae=_7ac.getClassMethods();
for(var _7af in _7ae){
_7ad[_7af]=_7ae[_7af];
}
}
for(var _7af in _7ab){
_7ad[_7af]=_7ab[_7af];
}
return _7ad;
}
return [];
};
var _7b0=function(name,_7b1,_7b2,_7b3){
this.name=name;
this.protocols=_7b1;
if(_7b2){
this.requiredInstanceMethods=_7b2;
}
if(_7b3){
this.requiredClassMethods=_7b3;
}
};
_7b0.prototype.addInstanceMethod=function(_7b4){
(this.requiredInstanceMethods||(this.requiredInstanceMethods=Object.create(null)))[_7b4.name]=_7b4;
};
_7b0.prototype.addClassMethod=function(_7b5){
(this.requiredClassMethods||(this.requiredClassMethods=Object.create(null)))[_7b5.name]=_7b5;
};
_7b0.prototype.getInstanceMethod=function(name){
var _7b6=this.requiredInstanceMethods;
if(_7b6){
var _7b7=_7b6[name];
if(_7b7){
return _7b7;
}
}
var _7b8=this.protocols;
for(var i=0,size=_7b8.length;i<size;i++){
var _7b9=_7b8[i],_7b7=_7b9.getInstanceMethod(name);
if(_7b7){
return _7b7;
}
}
return null;
};
_7b0.prototype.getClassMethod=function(name){
var _7ba=this.requiredClassMethods;
if(_7ba){
var _7bb=_7ba[name];
if(_7bb){
return _7bb;
}
}
var _7bc=this.protocols;
for(var i=0,size=_7bc.length;i<size;i++){
var _7bd=_7bc[i],_7bb=_7bd.getClassMethod(name);
if(_7bb){
return _7bb;
}
}
return null;
};
var _7be=function(name){
this.name=name;
};
var _7bf=function(name,_7c0){
this.name=name;
this.types=_7c0;
};
var _7c1=_746.makePredicate("self _cmd undefined localStorage arguments");
var _7c2=_746.makePredicate("delete in instanceof new typeof void");
var _7c3=_746.makePredicate("LogicalExpression BinaryExpression");
var _755={name:"unused-but-set-variable"};
var _7c4={name:"shadow-ivar"};
var _7c5={name:"create-global-inside-function-or-method"};
var _7c6={name:"unknown-class-or-global"};
var _7c7={name:"unknown-ivar-type"};
var _7c8=[_755,_7c4,_7c5,_7c6,_7c7];
_745.warningUnusedButSetVariable=_755;
_745.warningShadowIvar=_7c4;
_745.warningCreateGlobalInsideFunctionOrMethod=_7c5;
_745.warningUnknownClassOrGlobal=_7c6;
_745.warningUnknownIvarType=_7c7;
var _7c9={acornOptions:function(){
return Object.create(null);
},sourceMap:false,sourceMapIncludeSource:false,pass:2,classDefs:function(){
return Object.create(null);
},protocolDefs:function(){
return Object.create(null);
},typeDefs:function(){
return Object.create(null);
},generate:true,generateObjJ:false,formatDescription:null,indentationSpaces:4,indentationType:" ",includeComments:false,transformNamedFunctionDeclarationToAssignment:false,includeMethodFunctionNames:true,includeMethodArgumentTypeSignatures:true,includeIvarTypeSignatures:true,inlineMsgSendFunctions:true,warnings:[_755,_7c4,_7c5,_7c6,_7c7],macros:null};
function _7ca(opts){
var _7cb=Object.create(null);
for(var opt in _7c9){
if(opts&&Object.prototype.hasOwnProperty.call(opts,opt)){
var _7cc=opts[opt];
_7cb[opt]=typeof _7cc==="function"?_7cc():_7cc;
}else{
if(_7c9.hasOwnProperty(opt)){
var _7cd=_7c9[opt];
_7cb[opt]=typeof _7cd==="function"?_7cd():_7cd;
}
}
}
return _7cb;
};
var _7ce=function(_7cf,aURL,_7d0){
this.source=_7cf;
this.URL=aURL&&aURL.toString();
_7d0=_7ca(_7d0);
this.options=_7d0;
this.pass=_7d0.pass;
this.classDefs=_7d0.classDefs;
this.protocolDefs=_7d0.protocolDefs;
this.typeDefs=_7d0.typeDefs;
this.generate=_7d0.generate;
this.createSourceMap=_7d0.sourceMap;
this.formatDescription=_7d0.formatDescription;
this.includeComments=_7d0.includeComments;
this.transformNamedFunctionDeclarationToAssignment=_7d0.transformNamedFunctionDeclarationToAssignment;
this.jsBuffer=new _300(this.createSourceMap,aURL,_7d0.sourceMap&&_7d0.sourceMapIncludeSource?this.source:null);
this.imBuffer=null;
this.cmBuffer=null;
this.dependencies=[];
this.warningsAndErrors=[];
this.lastPos=0;
var _7d1=_7d0.acornOptions;
if(_7d1){
if(this.URL){
_7d1.sourceFile=this.URL.substr(this.URL.lastIndexOf("/")+1);
}
if(_7d0.sourceMap&&!_7d1.locations){
_7d1.locations=true;
}
}else{
_7d1=_7d0.acornOptions=this.URL&&{sourceFile:this.URL.substr(this.URL.lastIndexOf("/")+1)};
if(_7d0.sourceMap){
_7d1.locations=true;
}
}
if(_7d0.macros){
if(_7d1.macros){
_7d1.macros.concat(_7d0.macros);
}else{
_7d1.macros=_7d0.macros;
}
}
try{
this.tokens=_746.parse(_7cf,_7d0.acornOptions);
(this.pass===2&&(_7d0.includeComments||_7d0.formatDescription)?_7d2:_7d3)(this.tokens,new _748(null,{compiler:this}),this.pass===2?_7d4:_7d5);
}
catch(e){
if(e.lineStart!=null){
e.messageForLine=_7cf.substring(e.lineStart,e.lineEnd);
}
this.addWarning(e);
return;
}
this.setCompiledCode(this.jsBuffer);
};
_7ce.prototype.setCompiledCode=function(_7d6){
if(this.createSourceMap){
var s=_7d6.toString();
this.compiledCode=s.code;
this.sourceMap=s.map;
}else{
this.compiledCode=_7d6.toString();
}
};
_745.compileToExecutable=function(_7d7,aURL,_7d8){
_745.currentCompileFile=aURL;
return (new _7ce(_7d7,aURL,_7d8)).executable();
};
_745.compileToIMBuffer=function(_7d9,aURL,_7da){
return (new _7ce(_7d9,aURL,_7da)).IMBuffer();
};
_745.compile=function(_7db,aURL,_7dc){
return new _7ce(_7db,aURL,_7dc);
};
_745.compileFileDependencies=function(_7dd,aURL,_7de){
_745.currentCompileFile=aURL;
(_7de||(_7de={})).pass=1;
return new _7ce(_7dd,aURL,_7de);
};
_745.numberOfLinesAtTopOfFunction=function(){
var f=new Function("x","return x;");
var _7df=f.toString();
var _7e0=_7df.indexOf("return x;");
var _7e1=_7df.substring(0,_7e0);
var _7e2=(_7e1.match(/\n/g)||[]).length;
_7ce.numberOfLinesAtTopOfFunction=function(){
return _7e2;
};
return _7e2;
};
_7ce.prototype.compilePass2=function(){
var _7e3=this.options;
_745.currentCompileFile=this.URL;
this.pass=_7e3.pass=2;
this.jsBuffer=new _300(this.createSourceMap,this.URL,_7e3.sourceMap&&_7e3.sourceMapIncludeSource?this.source:null);
if(this.createSourceMap){
this.jsBuffer.concat("\n\n");
}
this.warningsAndErrors=[];
try{
_7d3(this.tokens,new _748(null,{compiler:this}),_7d4);
}
catch(e){
this.addWarning(e);
return null;
}
this.setCompiledCode(this.jsBuffer);
return this.compiledCode;
};
_7ce.prototype.addWarning=function(_7e4){
if(_7e4.path==null){
_7e4.path=this.URL;
}
this.warningsAndErrors.push(_7e4);
};
_7ce.prototype.getIvarForClass=function(_7e5,_7e6){
var ivar=_7e6.getIvarForCurrentClass(_7e5);
if(ivar){
return ivar;
}
var c=this.getClassDef(_7e6.currentClassName());
while(c){
var _7e7=c.ivars;
if(_7e7){
var _7e8=_7e7[_7e5];
if(_7e8){
return _7e8;
}
}
c=c.superClass;
}
};
_7ce.prototype.getClassDef=function(_7e9){
if(!_7e9){
return null;
}
var c=this.classDefs[_7e9];
if(c){
return c;
}
if(typeof objj_getClass==="function"){
var _7ea=objj_getClass(_7e9);
if(_7ea){
var _7eb=class_copyIvarList(_7ea),_7ec=_7eb.length,_7ed=Object.create(null),_7ee=class_copyProtocolList(_7ea),_7ef=_7ee.length,_7f0=Object.create(null),_7f1=_7ce.methodDefsFromMethodList(class_copyMethodList(_7ea)),_7f2=_7ce.methodDefsFromMethodList(class_copyMethodList(_7ea.isa)),_7f3=class_getSuperclass(_7ea);
for(var i=0;i<_7ec;i++){
var ivar=_7eb[i];
_7ed[ivar.name]={"type":ivar.type,"name":ivar.name};
}
for(var i=0;i<_7ef;i++){
var _7f4=_7ee[i],_7f5=protocol_getName(_7f4),_7f6=this.getProtocolDef(_7f5);
_7f0[_7f5]=_7f6;
}
c=new _78d(true,_7e9,_7f3?this.getClassDef(_7f3.name):null,_7ed,_7f1,_7f2,_7f0);
this.classDefs[_7e9]=c;
return c;
}
}
return null;
};
_7ce.prototype.getProtocolDef=function(_7f7){
if(!_7f7){
return null;
}
var p=this.protocolDefs[_7f7];
if(p){
return p;
}
if(typeof objj_getProtocol==="function"){
var _7f8=objj_getProtocol(_7f7);
if(_7f8){
var _7f9=protocol_getName(_7f8),_7fa=protocol_copyMethodDescriptionList(_7f8,true,true),_7fb=_7ce.methodDefsFromMethodList(_7fa),_7fc=protocol_copyMethodDescriptionList(_7f8,true,false),_7fd=_7ce.methodDefsFromMethodList(_7fc),_7fe=_7f8.protocols,_7ff=[];
if(_7fe){
for(var i=0,size=_7fe.length;i<size;i++){
_7ff.push(compiler.getProtocolDef(_7fe[i].name));
}
}
p=new _7b0(_7f9,_7ff,_7fb,_7fd);
this.protocolDefs[_7f7]=p;
return p;
}
}
return null;
};
_7ce.prototype.getTypeDef=function(_800){
if(!_800){
return null;
}
var t=this.typeDefs[_800];
if(t){
return t;
}
if(typeof objj_getTypeDef==="function"){
var _801=objj_getTypeDef(_800);
if(_801){
var _802=typeDef_getName(_801);
t=new _7be(_802);
this.typeDefs[_802]=t;
return t;
}
}
return null;
};
_745.parseGccCompilerFlags=function(_803){
var args=(_803||"").split(" "),_804=args.length,_805={};
for(var _806=0;_806<_804;++_806){
var _807=args[_806];
if(_807.indexOf("-g")===0){
_805.includeMethodFunctionNames=true;
}else{
if(_807.indexOf("-O")===0){
_805.compress=true;
if(_807.length>2){
_805.inlineMsgSendFunctions=true;
}
}else{
if(_807.indexOf("-T")===0){
_805.includeIvarTypeSignatures=false;
_805.includeMethodArgumentTypeSignatures=false;
}else{
if(_807.indexOf("-S")===0){
_805.sourceMap=true;
_805.sourceMapIncludeSource=true;
}else{
if(_807.indexOf("--include")===0){
var _808=args[++_806],_809=_808&&_808.charCodeAt(0);
if(_809===34||_809===39){
_808=_808.substring(1,_808.length-1);
}
(_805.includeFiles||(_805.includeFiles=[])).push(_808);
}else{
if(_807.indexOf("--inline-msg-send")===0){
_805.inlineMsgSendFunctions=true;
}else{
if(_807.indexOf("-D")===0){
var _80a=_807.substring(2);
(_805.macros||(_805.macros=[])).push(_80a);
}else{
if(_807.indexOf("-W")===0){
var isNo=_807.indexOf("no-",2)===2;
var _80b=_807.substring(isNo?5:2);
var _80c=(_805.warnings||(_805.warnings=_7c9.warnings.slice())).findIndex(function(_80d){
return _80d.name===_80b;
});
if(isNo){
if(_80c!==-1){
_805.warnings.splice(_80c,1);
}
}else{
if(_80c===-1){
var _80e=_7c8.find(function(_80f){
return _80f.name===_80b;
});
if(_80e){
_805.warnings.push(_80e);
}
}
}
}
}
}
}
}
}
}
}
}
return _805;
};
_7ce.methodDefsFromMethodList=function(_810){
var _811=_810.length,_812=Object.create(null);
for(var i=0;i<_811;i++){
var _813=_810[i],_814=method_getName(_813);
_812[_814]=new _7bf(_814,_813.types);
}
return _812;
};
_7ce.prototype.executable=function(){
if(!this._executable){
this._executable=new _30f(this.jsBuffer?this.jsBuffer.toString():null,this.dependencies,this.URL,null,this);
}
return this._executable;
};
_7ce.prototype.IMBuffer=function(){
return this.imBuffer;
};
_7ce.prototype.code=function(){
return this.compiledCode;
};
_7ce.prototype.ast=function(){
return JSON.stringify(this.tokens,null,_784);
};
_7ce.prototype.map=function(){
return JSON.stringify(this.sourceMap);
};
_7ce.prototype.prettifyMessage=function(_815){
var line=_815.messageForLine,_816="\n"+(line||"");
_816+=(new Array((_815.messageOnColumn||0)+1)).join(" ");
if(line){
_816+=(new Array(Math.min(1,line.length||1)+1)).join("^")+"\n";
}
_816+=_815.messageType+" line "+_815.messageOnLine+" in "+this.URL+":"+_815.messageOnLine+": "+_815.message;
return _816;
};
_7ce.prototype.error_message=function(_817,node){
var pos=_746.getLineInfo(this.source,node.start),_818=new SyntaxError(_817);
_818.messageOnLine=pos.line;
_818.messageOnColumn=pos.column;
_818.path=this.URL;
_818.messageForNode=node;
_818.messageType="ERROR";
_818.messageForLine=this.source.substring(pos.lineStart,pos.lineEnd);
return _818;
};
_7ce.prototype.pushImport=function(url){
if(!_7ce.importStack){
_7ce.importStack=[];
}
_7ce.importStack.push(url);
};
_7ce.prototype.popImport=function(){
_7ce.importStack.pop();
};
function _756(_819,node,code){
var _81a=_746.getLineInfo(code,node.start);
_81a.message=_819;
_81a.messageOnLine=_81a.line;
_81a.messageOnColumn=_81a.column;
_81a.messageForNode=node;
_81a.messageType="WARNING";
_81a.messageForLine=code.substring(_81a.lineStart,_81a.lineEnd);
return _81a;
};
function _7d3(node,_81b,_81c){
function c(node,st,_81d){
_81c[_81d||node.type](node,st,c);
};
c(node,_81b);
};
function _7d2(node,_81e,_81f){
var _820,_821;
function c(node,st,_822){
var _823=st.compiler,_824=_823.includeComments,_825=_820,_826=_825===node;
_820=node;
if(_824&&!_826&&node.commentsBefore&&node.commentsBefore!==_821){
for(var i=0;i<node.commentsBefore.length;i++){
_823.jsBuffer.concat(node.commentsBefore[i]);
}
}
st.pushNode(node,_822);
var _827=st.formatDescription();
if(!_826&&_827&&_827.before){
_823.jsBuffer.concatFormat(_827.before);
}
_81f[_822||node.type](node,st,c,_827);
if(!_826&&_827&&_827.after){
_823.jsBuffer.concatFormat(_827.after);
}
st.popNode();
if(_824&&!_826&&node.commentsAfter){
for(var i=0;i<node.commentsAfter.length;i++){
_823.jsBuffer.concat(node.commentsAfter[i]);
}
_821=node.commentsAfter;
}else{
_821=null;
}
};
c(node,_81e);
};
function _828(node){
switch(node.type){
case "Literal":
case "Identifier":
return true;
case "ArrayExpression":
for(var i=0;i<node.elements.length;++i){
if(!_828(node.elements[i])){
return false;
}
}
return true;
case "DictionaryLiteral":
for(var i=0;i<node.keys.length;++i){
if(!_828(node.keys[i])){
return false;
}
if(!_828(node.values[i])){
return false;
}
}
return true;
case "ObjectExpression":
for(var i=0;i<node.properties.length;++i){
if(!_828(node.properties[i].value)){
return false;
}
}
return true;
case "FunctionExpression":
for(var i=0;i<node.params.length;++i){
if(!_828(node.params[i])){
return false;
}
}
return true;
case "SequenceExpression":
for(var i=0;i<node.expressions.length;++i){
if(!_828(node.expressions[i])){
return false;
}
}
return true;
case "UnaryExpression":
return _828(node.argument);
case "BinaryExpression":
return _828(node.left)&&_828(node.right);
case "ConditionalExpression":
return _828(node.test)&&_828(node.consequent)&&_828(node.alternate);
case "MemberExpression":
return _828(node.object)&&(!node.computed||_828(node.property));
case "Dereference":
return _828(node.expr);
case "Reference":
return _828(node.element);
default:
return false;
}
};
function _829(st,node){
if(!_828(node)){
throw st.compiler.error_message("Dereference of expression with side effects",node);
}
};
function _82a(c){
return function(node,st,_82b,_82c){
st.compiler.jsBuffer.concat("(");
c(node,st,_82b,_82c);
st.compiler.jsBuffer.concat(")");
};
};
var _82d={"*":3,"/":3,"%":3,"+":4,"-":4,"<<":5,">>":5,">>>":5,"<":6,"<=":6,">":6,">=":6,"in":6,"instanceof":6,"==":7,"!=":7,"===":7,"!==":7,"&":8,"^":9,"|":10,"&&":11,"||":12};
var _82e={MemberExpression:0,CallExpression:1,NewExpression:2,FunctionExpression:3,UnaryExpression:4,UpdateExpression:4,BinaryExpression:5,LogicalExpression:6,ConditionalExpression:7,AssignmentExpression:8};
function _82f(node,_830,_831){
var _832=node.type,_82f=_82e[_832]||-1,_833=_82e[_830.type]||-1,_834,_835;
return _82f<_833||_82f===_833&&_7c3(_832)&&((_834=_82d[node.operator])<(_835=_82d[_830.operator])||_831&&_834===_835);
};
var _7d5=walk.make({ImportStatement:function(node,st,c){
var _836=node.filename.value;
st.compiler.dependencies.push({url:_836,isLocal:node.localfilepath});
}});
var _785=" ";
var _784=4;
var _786=_784*_785.length;
var _837=(Array(_784+1)).join(_785);
var _783="";
var _7d4=walk.make({Program:function(node,st,c){
var _838=st.compiler,_839=_838.generate;
_785=_838.options.indentationType;
_784=_838.options.indentationSpaces;
_786=_784*_785.length;
_837=(Array(_784+1)).join(_785);
_783="";
for(var i=0;i<node.body.length;++i){
c(node.body[i],st,"Statement");
}
if(!_839){
_838.jsBuffer.concat(_838.source.substring(_838.lastPos,node.end));
}
var _83a=st.maybeWarnings();
if(_83a){
for(var i=0;i<_83a.length;i++){
var _83b=_83a[i];
if(_83b.checkIfWarning(st)){
_838.addWarning(_83b.message);
}
}
}
},BlockStatement:function(node,st,c,_83c){
var _83d=st.compiler,_83e=_83d.generate,_83f=st.endOfScopeBody,_840;
if(_83f){
delete st.endOfScopeBody;
}
if(_83e){
var _841=st.skipIndentation;
_840=_83d.jsBuffer;
if(_83c){
_840.concat("{",node);
_840.concatFormat(_83c.afterLeftBrace);
}else{
if(_841){
delete st.skipIndentation;
}else{
_840.concat(_783.substring(_786));
}
_840.concat("{\n",node);
}
}
for(var i=0;i<node.body.length;++i){
c(node.body[i],st,"Statement");
}
if(_83e){
var _842=st.maxReceiverLevel;
if(_83f&&_842){
_840.concat(_783);
_840.concat("var ");
for(var i=0;i<_842;i++){
if(i){
_840.concat(", ");
}
_840.concat("___r");
_840.concat(i+1+"");
}
_840.concat(";\n");
}
if(_83c){
_840.concatFormat(_83c.beforeRightBrace);
_840.concat("}",node);
}else{
_840.concat(_783.substring(_786));
_840.concat("}",node);
if(!_841&&st.isDecl!==false){
_840.concat("\n");
}
st.indentBlockLevel--;
}
}
},ExpressionStatement:function(node,st,c,_843){
var _844=st.compiler,_845=_844.generate&&!_843;
if(_845){
_844.jsBuffer.concat(_783);
}
c(node.expression,st,"Expression");
if(_845){
_844.jsBuffer.concat(";\n",node);
}
},IfStatement:function(node,st,c,_846){
var _847=st.compiler,_848=_847.generate,_849;
if(_848){
_849=_847.jsBuffer;
if(_846){
_849.concat("if",node);
_849.concatFormat(_846.beforeLeftParenthesis);
_849.concat("(");
}else{
if(!st.superNodeIsElse){
_849.concat(_783);
}else{
delete st.superNodeIsElse;
}
_849.concat("if (",node);
}
}
c(node.test,st,"Expression");
if(_848){
if(_846){
_849.concat(")",node);
_849.concatFormat(_846.afterRightParenthesis);
}else{
_849.concat(node.consequent.type==="EmptyStatement"?");\n":")\n",node);
}
}
_783+=_837;
c(node.consequent,st,"Statement");
_783=_783.substring(_786);
var _84a=node.alternate;
if(_84a){
var _84b=_84a.type!=="IfStatement";
if(_848){
if(_846){
_849.concatFormat(_846.beforeElse);
_849.concat("else",node);
_849.concatFormat(_846.afterElse);
}else{
var _84c=_84a.type==="EmptyStatement";
_849.concat(_783);
_849.concat(_84b?_84c?"else;\n":"else\n":"else ",node);
}
}
if(_84b){
_783+=_837;
}else{
st.superNodeIsElse=true;
}
c(_84a,st,"Statement");
if(_84b){
_783=_783.substring(_786);
}
}
},LabeledStatement:function(node,st,c,_84d){
var _84e=st.compiler;
if(_84e.generate){
var _84f=_84e.jsBuffer;
if(!_84d){
_84f.concat(_783);
}
c(node.label,st,"IdentifierName");
if(_84d){
_84f.concat(":",node);
_84f.concatFormat(_84d.afterColon);
}else{
_84f.concat(": ",node);
}
}
c(node.body,st,"Statement");
},BreakStatement:function(node,st,c,_850){
var _851=st.compiler;
if(_851.generate){
var _852=node.label,_853=_851.jsBuffer;
if(!_850){
_853.concat(_783);
}
if(_852){
if(_850){
_853.concat("break",node);
_853.concatFormat(_850.beforeLabel);
}else{
_853.concat("break ",node);
}
c(_852,st,"IdentifierName");
if(!_850){
_853.concat(";\n");
}
}else{
_853.concat(_850?"break":"break;\n",node);
}
}
},ContinueStatement:function(node,st,c,_854){
var _855=st.compiler;
if(_855.generate){
var _856=node.label,_857=_855.jsBuffer;
if(!_854){
_857.concat(_783);
}
if(_856){
if(_854){
_857.concat("continue",node);
_857.concatFormat(_854.beforeLabel);
}else{
_857.concat("continue ",node);
}
c(_856,st,"IdentifierName");
if(!_854){
_857.concat(";\n");
}
}else{
_857.concat(_854?"continue":"continue;\n",node);
}
}
},WithStatement:function(node,st,c,_858){
var _859=st.compiler,_85a=_859.generate,_85b;
if(_85a){
_85b=_859.jsBuffer;
if(_858){
_85b.concat("with",node);
_85b.concatFormat(_858.beforeLeftParenthesis);
_85b.concat("(");
}else{
_85b.concat(_783);
_85b.concat("with(",node);
}
}
c(node.object,st,"Expression");
if(_85a){
if(_858){
_85b.concat(")",node);
_85b.concatFormat(_858.afterRightParenthesis);
}else{
_85b.concat(")\n",node);
}
}
_783+=_837;
c(node.body,st,"Statement");
_783=_783.substring(_786);
},SwitchStatement:function(node,st,c,_85c){
var _85d=st.compiler,_85e=_85d.generate,_85f;
if(_85e){
_85f=_85d.jsBuffer;
if(_85c){
_85f.concat("switch",node);
_85f.concatFormat(_85c.beforeLeftParenthesis);
_85f.concat("(",node);
}else{
_85f.concat(_783);
_85f.concat("switch(",node);
}
}
c(node.discriminant,st,"Expression");
if(_85e){
if(_85c){
_85f.concat(")");
_85f.concatFormat(_85c.afterRightParenthesis);
_85f.concat("{");
_85f.concatFormat(_85c.afterLeftBrace);
}else{
_85f.concat(") {\n");
}
}
_783+=_837;
for(var i=0;i<node.cases.length;++i){
var cs=node.cases[i];
if(cs.test){
if(_85e){
if(_85c){
_85f.concatFormat(_85c.beforeCase);
_85f.concat("case",node);
_85f.concatFormat(_85c.afterCase);
}else{
_85f.concat(_783);
_85f.concat("case ");
}
}
c(cs.test,st,"Expression");
if(_85e){
if(_85c){
_85f.concat(":");
_85f.concatFormat(_85c.afterColon);
}else{
_85f.concat(":\n");
}
}
}else{
if(_85e){
if(_85c){
_85f.concatFormat(_85c.beforeCase);
_85f.concat("default");
_85f.concatFormat(_85c.afterCase);
_85f.concat(":");
_85f.concatFormat(_85c.afterColon);
}else{
_85f.concat("default:\n");
}
}
}
_783+=_837;
for(var j=0;j<cs.consequent.length;++j){
c(cs.consequent[j],st,"Statement");
}
_783=_783.substring(_786);
}
_783=_783.substring(_786);
if(_85e){
if(_85c){
_85f.concatFormat(_85c.beforeRightBrace);
_85f.concat("}");
}else{
_85f.concat(_783);
_85f.concat("}\n");
}
}
},ReturnStatement:function(node,st,c,_860){
var _861=st.compiler,_862=_861.generate,_863;
if(_862){
_863=_861.jsBuffer;
if(!_860){
_863.concat(_783);
}
_863.concat("return",node);
}
if(node.argument){
if(_862){
_863.concatFormat(_860?_860.beforeExpression:" ");
}
c(node.argument,st,"Expression");
}
if(_862&&!_860){
_863.concat(";\n");
}
},ThrowStatement:function(node,st,c,_864){
var _865=st.compiler,_866=_865.generate,_867;
if(_866){
_867=_865.jsBuffer;
if(!_864){
_867.concat(_783);
}
_867.concat("throw",node);
_867.concatFormat(_864?_864.beforeExpression:" ");
}
c(node.argument,st,"Expression");
if(_866&&!_864){
_867.concat(";\n");
}
},TryStatement:function(node,st,c,_868){
var _869=st.compiler,_86a=_869.generate,_86b;
if(_86a){
_86b=_869.jsBuffer;
if(!_868){
_86b.concat(_783);
}
_86b.concat("try",node);
_86b.concatFormat(_868?_868.beforeStatement:" ");
}
_783+=_837;
if(!_868){
st.skipIndentation=true;
}
c(node.block,st,"Statement");
_783=_783.substring(_786);
if(node.handler){
var _86c=node.handler,_86d=new _748(st),_86e=_86c.param,name=_86e.name;
_86d.vars[name]={type:"catch clause",node:_86e};
if(_86a){
if(_868){
_86b.concatFormat(_868.beforeCatch);
_86b.concat("catch");
_86b.concatFormat(_868.afterCatch);
_86b.concat("(");
c(_86e,st,"IdentifierName");
_86b.concat(")");
_86b.concatFormat(_868.beforeCatchStatement);
}else{
_86b.concat("\n");
_86b.concat(_783);
_86b.concat("catch(");
_86b.concat(name);
_86b.concat(") ");
}
}
_783+=_837;
_86d.skipIndentation=true;
_86d.endOfScopeBody=true;
c(_86c.body,_86d,"ScopeBody");
_86d.variablesNotReadWarnings();
_783=_783.substring(_786);
_86d.copyAddedSelfToIvarsToParent();
}
if(node.finalizer){
if(_86a){
if(_868){
_86b.concatFormat(_868.beforeCatch);
_86b.concat("finally");
_86b.concatFormat(_868.beforeCatchStatement);
}else{
_86b.concat("\n");
_86b.concat(_783);
_86b.concat("finally ");
}
}
_783+=_837;
st.skipIndentation=true;
c(node.finalizer,st,"Statement");
_783=_783.substring(_786);
}
if(_86a&&!_868){
_86b.concat("\n");
}
},WhileStatement:function(node,st,c,_86f){
var _870=st.compiler,_871=_870.generate,body=node.body,_872;
if(_871){
_872=_870.jsBuffer;
if(_86f){
_872.concat("while",node);
_872.concatFormat(_86f.beforeLeftParenthesis);
_872.concat("(");
}else{
_872.concat(_783);
_872.concat("while (",node);
}
}
c(node.test,st,"Expression");
if(_871){
if(_86f){
_872.concat(")");
_872.concatFormat(_86f.afterRightParenthesis);
}else{
_872.concat(body.type==="EmptyStatement"?");\n":")\n");
}
}
_783+=_837;
c(body,st,"Statement");
_783=_783.substring(_786);
},DoWhileStatement:function(node,st,c,_873){
var _874=st.compiler,_875=_874.generate,_876;
if(_875){
_876=_874.jsBuffer;
if(_873){
_876.concat("do",node);
_876.concatFormat(_873.beforeStatement);
}else{
_876.concat(_783);
_876.concat("do\n",node);
}
}
_783+=_837;
c(node.body,st,"Statement");
_783=_783.substring(_786);
if(_875){
if(_873){
_876.concat("while");
_876.concatFormat(_873.beforeLeftParenthesis);
_876.concat("(");
}else{
_876.concat(_783);
_876.concat("while (");
}
}
c(node.test,st,"Expression");
if(_875){
_876.concatFormat(_873?")":");\n");
}
},ForStatement:function(node,st,c,_877){
var _878=st.compiler,_879=_878.generate,body=node.body,_87a;
if(_879){
_87a=_878.jsBuffer;
if(_877){
_87a.concat("for",node);
_87a.concatFormat(_877.beforeLeftParenthesis);
_87a.concat("(");
}else{
_87a.concat(_783);
_87a.concat("for (",node);
}
}
if(node.init){
c(node.init,st,"ForInit");
}
if(_879){
_87a.concat(_877?";":"; ");
}
if(node.test){
c(node.test,st,"Expression");
}
if(_879){
_87a.concat(_877?";":"; ");
}
if(node.update){
c(node.update,st,"Expression");
}
if(_879){
if(_877){
_87a.concat(")");
_87a.concatFormat(_877.afterRightParenthesis);
}else{
_87a.concat(body.type==="EmptyStatement"?");\n":")\n");
}
}
_783+=_837;
c(body,st,"Statement");
_783=_783.substring(_786);
},ForInStatement:function(node,st,c,_87b){
var _87c=st.compiler,_87d=_87c.generate,body=node.body,_87e;
if(_87d){
_87e=_87c.jsBuffer;
if(_87b){
_87e.concat("for",node);
_87e.concatFormat(_87b.beforeLeftParenthesis);
_87e.concat("(");
}else{
_87e.concat(_783);
_87e.concat("for (",node);
}
}
c(node.left,st,"ForInit");
if(_87d){
if(_87b){
_87e.concatFormat(_87b.beforeIn);
_87e.concat("in");
_87e.concatFormat(_87b.afterIn);
}else{
_87e.concat(" in ");
}
}
c(node.right,st,"Expression");
if(_87d){
if(_87b){
_87e.concat(")");
_87e.concatFormat(_87b.afterRightParenthesis);
}else{
_87e.concat(body.type==="EmptyStatement"?");\n":")\n");
}
}
_783+=_837;
c(body,st,"Statement");
_783=_783.substring(_786);
},ForInit:function(node,st,c){
var _87f=st.compiler,_880=_87f.generate;
if(node.type==="VariableDeclaration"){
st.isFor=true;
c(node,st);
delete st.isFor;
}else{
c(node,st,"Expression");
}
},DebuggerStatement:function(node,st,c,_881){
var _882=st.compiler;
if(_882.generate){
var _883=_882.jsBuffer;
if(_881){
_883.concat("debugger",node);
}else{
_883.concat(_783);
_883.concat("debugger;\n",node);
}
}
},Function:function(node,st,c,_884){
var _885=st.compiler,_886=_885.generate,_887=_885.jsBuffer,_888=new _76e(st),decl=node.type=="FunctionDeclaration",id=node.id;
_888.isDecl=decl;
for(var i=0;i<node.params.length;++i){
_888.vars[node.params[i].name]={type:"argument",node:node.params[i]};
}
if(_886&&!_884){
_887.concat(_783);
}
if(id){
var name=id.name;
(decl?st:_888).vars[name]={type:decl?"function":"function name",node:id};
if(_885.transformNamedFunctionDeclarationToAssignment){
if(_886){
_887.concat(name);
_887.concat(" = ");
}else{
_887.concat(_885.source.substring(_885.lastPos,node.start));
_887.concat(name);
_887.concat(" = function");
_885.lastPos=id.end;
}
}
}
if(_886){
_887.concat("function",node);
if(!_885.transformNamedFunctionDeclarationToAssignment&&id){
if(!_884){
_887.concat(" ");
}
c(id,st,"IdentifierName");
}
if(_884){
_887.concatFormat(_884.beforeLeftParenthesis);
}
_887.concat("(");
for(var i=0;i<node.params.length;++i){
if(i){
_887.concat(_884?",":", ");
}
c(node.params[i],st,"IdentifierName");
}
if(_884){
_887.concat(")");
_887.concatFormat(_884.afterRightParenthesis);
}else{
_887.concat(")\n");
}
}
_783+=_837;
_888.endOfScopeBody=true;
c(node.body,_888,"ScopeBody");
_888.variablesNotReadWarnings();
_783=_783.substring(_786);
_888.copyAddedSelfToIvarsToParent();
},VariableDeclaration:function(node,st,c,_889){
var _88a=st.compiler,_88b=_88a.generate,_88c=st.getVarScope(),_88d;
if(_88b){
_88d=_88a.jsBuffer;
if(!st.isFor&&!_889){
_88d.concat(_783);
}
_88d.concat(_889?"var":"var ",node);
}
for(var i=0;i<node.declarations.length;++i){
var decl=node.declarations[i],_88e=decl.id.name,_88f=_88c.possibleHoistedVariables&&_88c.possibleHoistedVariables[_88e],_890={type:"var",node:decl.id,isRead:_88f?_88f.isRead:0};
if(_88f){
if(_88f.variable){
_88f.variable.isRead-=_88f.isRead;
}
_88c.possibleHoistedVariables[_88e]=null;
}
_88c.vars[_88e]=_890;
if(i){
if(_88b){
if(_889){
_88d.concat(",");
}else{
if(st.isFor){
_88d.concat(", ");
}else{
_88d.concat(",\n");
_88d.concat(_783);
_88d.concat("    ");
}
}
}
}
c(decl.id,st,"IdentifierName");
if(decl.init){
if(_88b){
if(_889){
_88d.concatFormat(_889.beforeEqual);
_88d.concat("=");
_88d.concatFormat(_889.afterEqual);
}else{
_88d.concat(" = ");
}
}
c(decl.init,st,"Expression");
}
if(st.addedSelfToIvars){
var _891=st.addedSelfToIvars[_88e];
if(_891){
var _892=st.compiler.jsBuffer.atoms;
for(var i=0,size=_891.length;i<size;i++){
var dict=_891[i];
_892[dict.index]="";
if(_88a.options.warnings.includes(_7c4)){
_88a.addWarning(_756("Local declaration of '"+_88e+"' hides instance variable",dict.node,_88a.source));
}
}
_890.isRead+=size;
st.addedSelfToIvars[_88e]=[];
}
}
}
if(_88b&&!_889&&!st.isFor){
_88d.concat(";\n",node);
}
},ThisExpression:function(node,st,c){
var _893=st.compiler;
if(_893.generate){
_893.jsBuffer.concat("this",node);
}
},ArrayExpression:function(node,st,c,_894){
var _895=st.compiler,_896=_895.generate,_897;
if(_896){
_897=_895.jsBuffer;
_897.concat("[",node);
}
for(var i=0;i<node.elements.length;++i){
var elt=node.elements[i];
if(_896&&i!==0){
if(_894){
_897.concatFormat(_894.beforeComma);
_897.concat(",");
_897.concatFormat(_894.afterComma);
}else{
_897.concat(", ");
}
}
if(elt){
c(elt,st,"Expression");
}
}
if(_896){
_897.concat("]");
}
},ObjectExpression:function(node,st,c,_898){
var _899=st.compiler,_89a=_899.generate,_89b=node.properties,_89c=_899.jsBuffer;
if(_89a){
_89c.concat("{",node);
}
for(var i=0,size=_89b.length;i<size;++i){
var prop=_89b[i];
if(_89a){
if(i){
if(_898){
_89c.concatFormat(_898.beforeComma);
_89c.concat(",");
_89c.concatFormat(_898.afterComma);
}else{
_89c.concat(", ");
}
}
st.isPropertyKey=true;
c(prop.key,st,"Expression");
delete st.isPropertyKey;
if(_898){
_89c.concatFormat(_898.beforeColon);
_89c.concat(":");
_89c.concatFormat(_898.afterColon);
}else{
_89c.concat(": ");
}
}else{
if(prop.key.raw&&prop.key.raw.charAt(0)==="@"){
_89c.concat(_899.source.substring(_899.lastPos,prop.key.start));
_899.lastPos=prop.key.start+1;
}
}
c(prop.value,st,"Expression");
}
if(_89a){
_89c.concat("}");
}
},SequenceExpression:function(node,st,c,_89d){
var _89e=st.compiler,_89f=_89e.generate,_8a0;
if(_89f){
_8a0=_89e.jsBuffer;
_8a0.concat("(",node);
}
for(var i=0;i<node.expressions.length;++i){
if(_89f&&i!==0){
if(_89d){
_8a0.concatFormat(_89d.beforeComma);
_8a0.concat(",");
_8a0.concatFormat(_89d.afterComma);
}else{
_8a0.concat(", ");
}
}
c(node.expressions[i],st,"Expression");
}
if(_89f){
_8a0.concat(")");
}
},UnaryExpression:function(node,st,c){
var _8a1=st.compiler,_8a2=_8a1.generate,_8a3=node.argument;
if(_8a2){
var _8a4=_8a1.jsBuffer;
if(node.prefix){
_8a4.concat(node.operator,node);
if(_7c2(node.operator)){
_8a4.concat(" ");
}
(_82f(node,_8a3)?_82a(c):c)(_8a3,st,"Expression");
}else{
(_82f(node,_8a3)?_82a(c):c)(_8a3,st,"Expression");
_8a4.concat(node.operator);
}
}else{
c(_8a3,st,"Expression");
}
},UpdateExpression:function(node,st,c){
var _8a5=st.compiler,_8a6=_8a5.generate,_8a7=_8a5.jsBuffer;
if(node.argument.type==="Dereference"){
_829(st,node.argument);
if(!_8a6){
_8a7.concat(_8a5.source.substring(_8a5.lastPos,node.start));
}
_8a7.concat((node.prefix?"":"(")+"(");
if(!_8a6){
_8a5.lastPos=node.argument.expr.start;
}
c(node.argument.expr,st,"Expression");
if(!_8a6){
_8a7.concat(_8a5.source.substring(_8a5.lastPos,node.argument.expr.end));
}
_8a7.concat(")(");
if(!_8a6){
_8a5.lastPos=node.argument.start;
}
c(node.argument,st,"Expression");
if(!_8a6){
_8a7.concat(_8a5.source.substring(_8a5.lastPos,node.argument.end));
}
_8a7.concat(" "+node.operator.substring(0,1)+" 1)"+(node.prefix?"":node.operator=="++"?" - 1)":" + 1)"));
if(!_8a6){
_8a5.lastPos=node.end;
}
return;
}
if(node.prefix){
if(_8a6){
_8a7.concat(node.operator,node);
if(_7c2(node.operator)){
_8a7.concat(" ");
}
}
(_8a6&&_82f(node,node.argument)?_82a(c):c)(node.argument,st,"Expression");
}else{
(_8a6&&_82f(node,node.argument)?_82a(c):c)(node.argument,st,"Expression");
if(_8a6){
_8a7.concat(node.operator);
}
}
},BinaryExpression:function(node,st,c,_8a8){
var _8a9=st.compiler,_8aa=_8a9.generate;
(_8aa&&_82f(node,node.left)?_82a(c):c)(node.left,st,"Expression");
if(_8aa){
var _8ab=_8a9.jsBuffer;
_8ab.concatFormat(_8a8?_8a8.beforeOperator:" ");
_8ab.concat(node.operator,node);
_8ab.concatFormat(_8a8?_8a8.afterOperator:" ");
}
(_8aa&&_82f(node,node.right,true)?_82a(c):c)(node.right,st,"Expression");
},LogicalExpression:function(node,st,c,_8ac){
var _8ad=st.compiler,_8ae=_8ad.generate;
(_8ae&&_82f(node,node.left)?_82a(c):c)(node.left,st,"Expression");
if(_8ae){
var _8af=_8ad.jsBuffer;
_8af.concatFormat(_8ac?_8ac.beforeOperator:" ");
_8af.concat(node.operator);
_8af.concatFormat(_8ac?_8ac.afterOperator:" ");
}
(_8ae&&_82f(node,node.right,true)?_82a(c):c)(node.right,st,"Expression");
},AssignmentExpression:function(node,st,c,_8b0){
var _8b1=st.compiler,_8b2=_8b1.generate,_8b3=st.assignment,_8b4=_8b1.jsBuffer;
if(node.left.type==="Dereference"){
_829(st,node.left);
if(!_8b2){
_8b4.concat(_8b1.source.substring(_8b1.lastPos,node.start));
}
_8b4.concat("(",node);
if(!_8b2){
_8b1.lastPos=node.left.expr.start;
}
c(node.left.expr,st,"Expression");
if(!_8b2){
_8b4.concat(_8b1.source.substring(_8b1.lastPos,node.left.expr.end));
}
_8b4.concat(")(");
if(node.operator!=="="){
if(!_8b2){
_8b1.lastPos=node.left.start;
}
c(node.left,st,"Expression");
if(!_8b2){
_8b4.concat(_8b1.source.substring(_8b1.lastPos,node.left.end));
}
_8b4.concat(" "+node.operator.substring(0,1)+" ");
}
if(!_8b2){
_8b1.lastPos=node.right.start;
}
c(node.right,st,"Expression");
if(!_8b2){
_8b4.concat(_8b1.source.substring(_8b1.lastPos,node.right.end));
}
_8b4.concat(")");
if(!_8b2){
_8b1.lastPos=node.end;
}
return;
}
var _8b3=st.assignment,_8b5=node.left;
st.assignment=true;
if(_8b5.type==="Identifier"&&_8b5.name==="self"){
var lVar=st.getLvar("self",true);
if(lVar){
var _8b6=lVar.scope;
if(_8b6){
_8b6.assignmentToSelf=true;
}
}
}
(_8b2&&_82f(node,_8b5)?_82a(c):c)(_8b5,st,"Expression");
if(_8b2){
_8b4.concatFormat(_8b0?_8b0.beforeOperator:" ");
_8b4.concat(node.operator);
_8b4.concatFormat(_8b0?_8b0.afterOperator:" ");
}
st.assignment=_8b3;
(_8b2&&_82f(node,node.right,true)?_82a(c):c)(node.right,st,"Expression");
if(st.isRootScope()&&_8b5.type==="Identifier"&&!st.getLvar(_8b5.name)){
st.vars[_8b5.name]={type:"global",node:_8b5};
}
},ConditionalExpression:function(node,st,c,_8b7){
var _8b8=st.compiler,_8b9=_8b8.generate,_8ba;
(_8b9&&_82f(node,node.test)?_82a(c):c)(node.test,st,"Expression");
if(_8b9){
_8ba=_8b8.jsBuffer;
if(_8b7){
_8ba.concatFormat(_8b7.beforeOperator);
_8ba.concat("?");
_8ba.concatFormat(_8b7.afterOperator);
}else{
_8ba.concat(" ? ");
}
}
c(node.consequent,st,"Expression");
if(_8b9){
if(_8b7){
_8ba.concatFormat(_8b7.beforeOperator);
_8ba.concat(":");
_8ba.concatFormat(_8b7.afterOperator);
}else{
_8ba.concat(" : ");
}
}
c(node.alternate,st,"Expression");
},NewExpression:function(node,st,c,_8bb){
var _8bc=st.compiler,_8bd=node.arguments,_8be=_8bc.generate,_8bf;
if(_8be){
_8bf=_8bc.jsBuffer;
_8bf.concat("new ",node);
}
(_8be&&_82f(node,node.callee)?_82a(c):c)(node.callee,st,"Expression");
if(_8be){
_8bf.concat("(");
}
if(_8bd){
for(var i=0,size=_8bd.length;i<size;++i){
if(i&&_8be){
_8bf.concatFormat(_8bb?",":", ");
}
c(_8bd[i],st,"Expression");
}
}
if(_8be){
_8bf.concat(")");
}
},CallExpression:function(node,st,c,_8c0){
var _8c1=st.compiler,_8c2=node.arguments,_8c3=_8c1.generate,_8c4=node.callee,_8c5;
if(_8c4.type==="Identifier"&&_8c4.name==="eval"){
var _8c6=st.getLvar("self",true);
if(_8c6){
var _8c7=_8c6.scope;
if(_8c7){
_8c7.assignmentToSelf=true;
}
}
}
(_8c3&&_82f(node,_8c4)?_82a(c):c)(_8c4,st,"Expression");
if(_8c3){
_8c5=_8c1.jsBuffer;
_8c5.concat("(");
}
if(_8c2){
for(var i=0,size=_8c2.length;i<size;++i){
if(i&&_8c3){
_8c5.concat(_8c0?",":", ");
}
c(_8c2[i],st,"Expression");
}
}
if(_8c3){
_8c5.concat(")");
}
},MemberExpression:function(node,st,c){
var _8c8=st.compiler,_8c9=_8c8.generate,_8ca=node.computed;
(_8c9&&_82f(node,node.object)?_82a(c):c)(node.object,st,"Expression");
if(_8c9){
_8c8.jsBuffer.concat(_8ca?"[":".",node);
}
st.secondMemberExpression=!_8ca;
(_8c9&&!_8ca&&_82f(node,node.property)?_82a(c):c)(node.property,st,"Expression");
st.secondMemberExpression=false;
if(_8c9&&_8ca){
_8c8.jsBuffer.concat("]");
}
},Identifier:function(node,st,c){
var _8cb=st.compiler,_8cc=_8cb.generate,_8cd=node.name;
if(!st.isPropertyKey){
var _8ce=st.getLvarScope(_8cd,true);
var lvar=_8ce.vars&&_8ce.vars[_8cd];
if(!st.secondMemberExpression&&st.currentMethodType()==="-"){
var ivar=_8cb.getIvarForClass(_8cd,st);
if(ivar){
if(lvar){
if(_8cb.options.warnings.includes(_7c4)){
_8cb.addWarning(_756("Local declaration of '"+_8cd+"' hides instance variable",node,_8cb.source));
}
}else{
var _8cf=node.start;
if(!_8cc){
do{
_8cb.jsBuffer.concat(_8cb.source.substring(_8cb.lastPos,_8cf));
_8cb.lastPos=_8cf;
}while(_8cb.source.substr(_8cf++,1)==="(");
}
((st.addedSelfToIvars||(st.addedSelfToIvars=Object.create(null)))[_8cd]||(st.addedSelfToIvars[_8cd]=[])).push({node:node,index:_8cb.jsBuffer.length()});
_8cb.jsBuffer.concat("self.",node);
}
}else{
if(!_7c1(_8cd)){
var _8d0,_8d1=typeof _1[_8cd]!=="undefined"||typeof window!=="undefined"&&typeof window[_8cd]!=="undefined"||_8cb.getClassDef(_8cd),_8d2=st.getLvar(_8cd);
if(_8d1&&(!_8d2||_8d2.type!=="class")){
}else{
if(!_8d2){
if(st.assignment&&_8cb.options.warnings.includes(_7c5)){
_8d0=new _772("Creating global variable inside function or method '"+_8cd+"'",node,_8cb.source);
st.vars[_8cd]={type:"remove global warning",node:node};
}else{
if(_8cb.options.warnings.includes(_7c6)){
_8d0=new _772("Using unknown class or uninitialized global variable '"+_8cd+"'",node,_8cb.source);
}
}
}
}
if(_8d0){
st.addMaybeWarning(_8d0);
}
}
}
}
if(!st.assignment||!st.secondMemberExpression){
if(lvar){
lvar.isRead++;
}else{
_8ce=_8ce.getLvarScope(_8cd);
lvar=_8ce.vars&&_8ce.vars[_8cd];
if(lvar){
lvar.isRead++;
}
var _8d3=(_8ce.possibleHoistedVariables||(_8ce.possibleHoistedVariables=Object.create(null)))[_8cd];
if(_8d3==null){
var _8d3={isRead:1};
_8ce.possibleHoistedVariables[_8cd]=_8d3;
}else{
_8d3.isRead++;
}
if(lvar){
if(_8d3.variable&&_8d3.variable!==lvar||_8d3.varScope&&_8d3.varScope!==_8ce){
throw new Error("Internal inconsistency, var or scope is not the same");
}
_8d3.variable=lvar;
_8d3.varScope=_8ce;
}
}
}
}
if(_8cc){
_8cb.jsBuffer.concat(_8cd,node,_8cd==="self"?"self":null);
}
},IdentifierName:function(node,st,c){
var _8d4=st.compiler;
if(_8d4.generate){
_8d4.jsBuffer.concat(node.name,node);
}
},Literal:function(node,st,c){
var _8d5=st.compiler,_8d6=_8d5.generate;
if(_8d6){
if(node.raw){
if(node.raw.charAt(0)==="@"){
_8d5.jsBuffer.concat(node.raw.substring(1),node);
}else{
_8d5.jsBuffer.concat(node.raw,node);
}
}else{
var _8d7=node.value,_8d8=_8d7.indexOf("\"")!==-1;
_8d5.jsBuffer.concat(_8d8?"'":"\"",node);
_8d5.jsBuffer.concat(_8d7);
_8d5.jsBuffer.concat(_8d8?"'":"\"");
}
}else{
if(node.raw.charAt(0)==="@"){
_8d5.jsBuffer.concat(_8d5.source.substring(_8d5.lastPos,node.start));
_8d5.lastPos=node.start+1;
}
}
},ArrayLiteral:function(node,st,c){
var _8d9=st.compiler,_8da=_8d9.generate,_8db=_8d9.jsBuffer,_8dc=_8d9.options.generateObjJ,_8dd=node.elements.length;
if(!_8da){
_8db.concat(_8d9.source.substring(_8d9.lastPos,node.start));
_8d9.lastPos=node.start;
}
if(!_8da){
_8db.concat(" ");
}
if(!st.receiverLevel){
st.receiverLevel=0;
}
if(_8dc){
_8db.concat("@[");
}else{
if(!_8dd){
if(_8d9.options.inlineMsgSendFunctions){
_8db.concat("(___r",node);
_8db.concat(++st.receiverLevel+"");
_8db.concat(" = (CPArray.isa.method_msgSend[\"alloc\"] || _objj_forward)(CPArray, \"alloc\"), ___r");
_8db.concat(st.receiverLevel+"");
_8db.concat(" == null ? ___r");
_8db.concat(st.receiverLevel+"");
_8db.concat(" : (___r");
_8db.concat(st.receiverLevel+"");
_8db.concat(".isa.method_msgSend[\"init\"] || _objj_forward)(___r");
_8db.concat(st.receiverLevel+"");
_8db.concat(", \"init\"))");
}else{
_8db.concat("(___r");
_8db.concat(++st.receiverLevel+"");
_8db.concat(" = CPArray.isa.objj_msgSend0(CPArray, \"alloc\"), ___r");
_8db.concat(st.receiverLevel+"");
_8db.concat(" == null ? ___r");
_8db.concat(st.receiverLevel+"");
_8db.concat(" : ___r");
_8db.concat(st.receiverLevel+"");
_8db.concat(".isa.objj_msgSend0(___r");
_8db.concat(st.receiverLevel+"");
_8db.concat(", \"init\"))");
}
if(!(st.maxReceiverLevel>=st.receiverLevel)){
st.maxReceiverLevel=st.receiverLevel;
}
}else{
if(_8d9.options.inlineMsgSendFunctions){
_8db.concat("(___r",node);
_8db.concat(++st.receiverLevel+"");
_8db.concat(" = (CPArray.isa.method_msgSend[\"alloc\"] || _objj_forward)(CPArray, \"alloc\"), ___r");
_8db.concat(st.receiverLevel+"");
_8db.concat(" == null ? ___r");
_8db.concat(st.receiverLevel+"");
_8db.concat(" : (___r");
_8db.concat(st.receiverLevel+"");
_8db.concat(".isa.method_msgSend[\"initWithObjects:count:\"] || _objj_forward)(___r");
_8db.concat(st.receiverLevel+"");
_8db.concat(", \"initWithObjects:count:\", [");
}else{
_8db.concat("(___r",node);
_8db.concat(++st.receiverLevel+"");
_8db.concat(" = CPArray.isa.objj_msgSend0(CPArray, \"alloc\"), ___r");
_8db.concat(st.receiverLevel+"");
_8db.concat(" == null ? ___r");
_8db.concat(st.receiverLevel+"");
_8db.concat(" : ___r");
_8db.concat(st.receiverLevel+"");
_8db.concat(".isa.objj_msgSend2(___r");
_8db.concat(st.receiverLevel+"");
_8db.concat(", \"initWithObjects:count:\", [");
}
if(!(st.maxReceiverLevel>=st.receiverLevel)){
st.maxReceiverLevel=st.receiverLevel;
}
}
}
if(_8dd){
for(var i=0;i<_8dd;i++){
var elt=node.elements[i];
if(i){
_8db.concat(", ");
}
if(!_8da){
_8d9.lastPos=elt.start;
}
c(elt,st,"Expression");
if(!_8da){
_8db.concat(_8d9.source.substring(_8d9.lastPos,elt.end));
}
}
if(!_8dc){
_8db.concat("], "+_8dd+"))");
}
}
if(_8dc){
_8db.concat("]");
}else{
st.receiverLevel--;
}
if(!_8da){
_8d9.lastPos=node.end;
}
},DictionaryLiteral:function(node,st,c){
var _8de=st.compiler,_8df=_8de.generate,_8e0=_8de.jsBuffer,_8e1=_8de.options.generateObjJ,_8e2=node.keys.length;
if(!_8df){
_8e0.concat(_8de.source.substring(_8de.lastPos,node.start));
_8de.lastPos=node.start;
}
if(!_8df){
_8e0.concat(" ");
}
if(!st.receiverLevel){
st.receiverLevel=0;
}
if(_8e1){
_8e0.concat("@{");
for(var i=0;i<_8e2;i++){
if(i!==0){
_8e0.concat(",");
}
c(node.keys[i],st,"Expression");
_8e0.concat(":");
c(node.values[i],st,"Expression");
}
_8e0.concat("}");
}else{
if(!_8e2){
if(_8de.options.inlineMsgSendFunctions){
_8e0.concat("(___r",node);
_8e0.concat(++st.receiverLevel+"");
_8e0.concat(" = (CPDictionary.isa.method_msgSend[\"alloc\"] || _objj_forward)(CPDictionary, \"alloc\"), ___r");
_8e0.concat(st.receiverLevel+"");
_8e0.concat(" == null ? ___r");
_8e0.concat(st.receiverLevel+"");
_8e0.concat(" : (___r");
_8e0.concat(st.receiverLevel+"");
_8e0.concat(".isa.method_msgSend[\"init\"] || _objj_forward)(___r");
_8e0.concat(st.receiverLevel+"");
_8e0.concat(", \"init\"))");
}else{
_8e0.concat("(___r");
_8e0.concat(++st.receiverLevel+"");
_8e0.concat(" = CPDictionary.isa.objj_msgSend0(CPDictionary, \"alloc\"), ___r");
_8e0.concat(st.receiverLevel+"");
_8e0.concat(" == null ? ___r");
_8e0.concat(st.receiverLevel+"");
_8e0.concat(" : ___r");
_8e0.concat(st.receiverLevel+"");
_8e0.concat(".isa.objj_msgSend0(___r");
_8e0.concat(st.receiverLevel+"");
_8e0.concat(", \"init\"))");
}
if(!(st.maxReceiverLevel>=st.receiverLevel)){
st.maxReceiverLevel=st.receiverLevel;
}
}else{
if(_8de.options.inlineMsgSendFunctions){
_8e0.concat("(___r",node);
_8e0.concat(++st.receiverLevel+"");
_8e0.concat(" = (CPDictionary.isa.method_msgSend[\"alloc\"] || _objj_forward)(CPDictionary, \"alloc\"), ___r");
_8e0.concat(st.receiverLevel+"");
_8e0.concat(" == null ? ___r");
_8e0.concat(st.receiverLevel+"");
_8e0.concat(" : (___r");
_8e0.concat(st.receiverLevel+"");
_8e0.concat(".isa.method_msgSend[\"initWithObjects:forKeys:\"] || _objj_forward)(___r");
_8e0.concat(st.receiverLevel+"");
_8e0.concat(", \"initWithObjects:forKeys:\", [");
}else{
_8e0.concat("(___r",node);
_8e0.concat(++st.receiverLevel+"");
_8e0.concat(" = CPDictionary.isa.objj_msgSend0(CPDictionary, \"alloc\"), ___r");
_8e0.concat(st.receiverLevel+"");
_8e0.concat(" == null ? ___r");
_8e0.concat(st.receiverLevel+"");
_8e0.concat(" : ___r");
_8e0.concat(st.receiverLevel+"");
_8e0.concat(".isa.objj_msgSend2(___r");
_8e0.concat(st.receiverLevel+"");
_8e0.concat(", \"initWithObjects:forKeys:\", [");
}
if(!(st.maxReceiverLevel>=st.receiverLevel)){
st.maxReceiverLevel=st.receiverLevel;
}
for(var i=0;i<_8e2;i++){
var _8e3=node.values[i];
if(i){
_8e0.concat(", ");
}
if(!_8df){
_8de.lastPos=_8e3.start;
}
c(_8e3,st,"Expression");
if(!_8df){
_8e0.concat(_8de.source.substring(_8de.lastPos,_8e3.end));
}
}
_8e0.concat("], [");
for(var i=0;i<_8e2;i++){
var key=node.keys[i];
if(i){
_8e0.concat(", ");
}
if(!_8df){
_8de.lastPos=key.start;
}
c(key,st,"Expression");
if(!_8df){
_8e0.concat(_8de.source.substring(_8de.lastPos,key.end));
}
}
_8e0.concat("]))");
}
}
if(!_8e1){
st.receiverLevel--;
}
if(!_8df){
_8de.lastPos=node.end;
}
},ImportStatement:function(node,st,c){
var _8e4=st.compiler,_8e5=_8e4.generate,_8e6=_8e4.jsBuffer,_8e7=node.localfilepath,_8e8=_8e4.options.generateObjJ;
if(!_8e5){
_8e6.concat(_8e4.source.substring(_8e4.lastPos,node.start));
}
if(_8e8){
_8e6.concat("@import ");
_8e6.concat(_8e7?"\"":"<");
_8e6.concat(node.filename.value);
_8e6.concat(_8e7?"\"":">");
}else{
_8e6.concat("objj_executeFile(\"",node);
_8e6.concat(node.filename.value);
_8e6.concat(_8e7?"\", YES);":"\", NO);");
}
if(!_8e5){
_8e4.lastPos=node.end;
}
},ClassDeclarationStatement:function(node,st,c,_8e9){
var _8ea=st.compiler,_8eb=_8ea.generate,_8ec=_8ea.jsBuffer,_8ed=node.classname.name,_8ee=_8ea.getClassDef(_8ed),_8ef=new _748(st),_8f0=node.type==="InterfaceDeclarationStatement",_8f1=node.protocols,_8f2=_8ea.options,_8f3=_8f2.generateObjJ;
_8ea.imBuffer=new _300(_8ea.createSourceMap,_8ea.URL,_8f2.sourceMap&&_8f2.sourceMapIncludeSource?_8ea.source:null);
_8ea.cmBuffer=new _300(_8ea.createSourceMap,_8ea.URL);
_8ea.classBodyBuffer=new _300(_8ea.createSourceMap,_8ea.URL);
if(_8ea.getTypeDef(_8ed)){
throw _8ea.error_message(_8ed+" is already declared as a type",node.classname);
}
if(!_8eb){
_8ec.concat(_8ea.source.substring(_8ea.lastPos,node.start));
}
if(node.superclassname){
if(_8ee&&_8ee.ivars){
throw _8ea.error_message("Duplicate class "+_8ed,node.classname);
}
if(_8f0&&_8ee&&_8ee.instanceMethods&&_8ee.classMethods){
throw _8ea.error_message("Duplicate interface definition for class "+_8ed,node.classname);
}
var _8f4=_8ea.getClassDef(node.superclassname.name);
if(!_8f4){
var _8f5="Can't find superclass "+node.superclassname.name;
if(_7ce.importStack){
for(var i=_7ce.importStack.length;--i>=0;){
_8f5+="\n"+(Array((_7ce.importStack.length-i)*2+1)).join(" ")+"Imported by: "+_7ce.importStack[i];
}
}
throw _8ea.error_message(_8f5,node.superclassname);
}
_8ee=new _78d(!_8f0,_8ed,_8f4,Object.create(null));
if(!_8f3){
_8ec.concat("\n{var the_class = objj_allocateClassPair("+node.superclassname.name+", \""+_8ed+"\"),\nmeta_class = the_class.isa;",node);
}
}else{
if(node.categoryname){
_8ee=_8ea.getClassDef(_8ed);
if(!_8ee){
throw _8ea.error_message("Class "+_8ed+" not found ",node.classname);
}
if(!_8f3){
_8ec.concat("{\nvar the_class = objj_getClass(\""+_8ed+"\")\n",node);
_8ec.concat("if(!the_class) throw new SyntaxError(\"*** Could not find definition for class \\\""+_8ed+"\\\"\");\n");
_8ec.concat("var meta_class = the_class.isa;");
}
}else{
_8ee=new _78d(!_8f0,_8ed,null,Object.create(null));
if(!_8f3){
_8ec.concat("{var the_class = objj_allocateClassPair(Nil, \""+_8ed+"\"),\nmeta_class = the_class.isa;",node);
}
}
}
if(_8f3){
_8ec.concat(_8f0?"@interface ":"@implementation ");
_8ec.concat(_8ed);
if(node.superclassname){
_8ec.concat(" : ");
c(node.superclassname,st,"IdentifierName");
}else{
if(node.categoryname){
_8ec.concat(" (");
c(node.categoryname,st,"IdentifierName");
_8ec.concat(")");
}
}
}
if(_8f1){
for(var i=0,size=_8f1.length;i<size;i++){
if(_8f3){
if(i){
_8ec.concat(", ");
}else{
_8ec.concat(" <");
}
c(_8f1[i],st,"IdentifierName");
if(i===size-1){
_8ec.concat(">");
}
}else{
_8ec.concat("\nvar aProtocol = objj_getProtocol(\""+_8f1[i].name+"\");",_8f1[i]);
_8ec.concat("\nif (!aProtocol) throw new SyntaxError(\"*** Could not find definition for protocol \\\""+_8f1[i].name+"\\\"\");");
_8ec.concat("\nclass_addProtocol(the_class, aProtocol);");
}
}
}
_8ef.classDef=_8ee;
_8ea.currentSuperClass="objj_getClass(\""+_8ed+"\").super_class";
_8ea.currentSuperMetaClass="objj_getMetaClass(\""+_8ed+"\").super_class";
var _8f6=true,_8f7=_8ee.ivars,_8f8=[],_8f9=false;
if(node.ivardeclarations){
if(_8f3){
_8ec.concat("{");
_783+=_837;
}
for(var i=0;i<node.ivardeclarations.length;++i){
var _8fa=node.ivardeclarations[i],_8fb=_8fa.ivartype?_8fa.ivartype.name:null,_8fc=_8fa.ivartype?_8fa.ivartype.typeisclass:false,_8fd=_8fa.id,_8fe=_8fd.name,ivar={"type":_8fb,"name":_8fe},_8ff=_8fa.accessors;
var _900=function(_901,_902){
if(_901.ivars[_8fe]){
throw _8ea.error_message("Instance variable '"+_8fe+"' is already declared for class "+_8ed+(_901.name!==_8ed?" in superclass "+_901.name:""),_8fa.id);
}
if(_901.superClass){
_902(_901.superClass,_902);
}
};
_900(_8ee,_900);
var _903=!_8fc||typeof _1[_8fb]!=="undefined"||typeof window[_8fb]!=="undefined"||_8ea.getClassDef(_8fb)||_8ea.getTypeDef(_8fb)||_8fb==_8ee.name;
if(!_903&&_8ea.options.warnings.includes(_7c7)){
_8ea.addWarning(_756("Unknown type '"+_8fb+"' for ivar '"+_8fe+"'",_8fa.ivartype,_8ea.source));
}
if(_8f3){
c(_8fa,st,"IvarDeclaration");
}else{
if(_8f6){
_8f6=false;
_8ec.concat("class_addIvars(the_class, [");
}else{
_8ec.concat(", ");
}
if(_8f2.includeIvarTypeSignatures){
_8ec.concat("new objj_ivar(\""+_8fe+"\", \""+_8fb+"\")",node);
}else{
_8ec.concat("new objj_ivar(\""+_8fe+"\")",node);
}
}
if(_8fa.outlet){
ivar.outlet=true;
}
_8f8.push(ivar);
if(!_8ef.ivars){
_8ef.ivars=Object.create(null);
}
_8ef.ivars[_8fe]={type:"ivar",name:_8fe,node:_8fd,ivar:ivar};
if(_8ff){
var _904=_8ff.property&&_8ff.property.name||_8fe,_905=_8ff.getter&&_8ff.getter.name||_904;
_8ee.addInstanceMethod(new _7bf(_905,[_8fb]));
if(!_8ff.readonly){
var _906=_8ff.setter?_8ff.setter.name:null;
if(!_906){
var _907=_904.charAt(0)=="_"?1:0;
_906=(_907?"_":"")+"set"+(_904.substr(_907,1)).toUpperCase()+_904.substring(_907+1)+":";
}
_8ee.addInstanceMethod(new _7bf(_906,["void",_8fb]));
}
_8f9=true;
}
}
}
if(_8f3){
_783=_783.substring(_786);
_8ec.concatFormat("\n}");
}else{
if(!_8f6){
_8ec.concat("]);");
}
}
if(!_8f3&&!_8f0&&_8f9){
var _908=new _300(false);
_908.concat((_8ea.source.substring(node.start,node.endOfIvars)).replace(/<.*>/g,""));
_908.concat("\n");
for(var i=0;i<node.ivardeclarations.length;++i){
var _8fa=node.ivardeclarations[i],_8fb=_8fa.ivartype?_8fa.ivartype.name:null,_8fe=_8fa.id.name,_8ff=_8fa.accessors;
if(!_8ff){
continue;
}
var _904=_8ff.property&&_8ff.property.name||_8fe,_905=_8ff.getter&&_8ff.getter.name||_904,_909="- ("+(_8fb?_8fb:"id")+")"+_905+"\n{\n    return "+_8fe+";\n}\n";
_908.concat(_909);
if(_8ff.readonly){
continue;
}
var _906=_8ff.setter?_8ff.setter.name:null;
if(!_906){
var _907=_904.charAt(0)=="_"?1:0;
_906=(_907?"_":"")+"set"+(_904.substr(_907,1)).toUpperCase()+_904.substring(_907+1)+":";
}
var _90a="- (void)"+_906+"("+(_8fb?_8fb:"id")+")newValue\n{\n    ";
if(_8ff.copy){
_90a+="if ("+_8fe+" !== newValue)\n        "+_8fe+" = [newValue copy];\n}\n";
}else{
_90a+=_8fe+" = newValue;\n}\n";
}
_908.concat(_90a);
}
_908.concat("\n@end");
var b=(_908.toString()).replace(/@accessors(\(.*\))?/g,"");
var _90b=_7ca(_8f2);
_90b.sourceMapIncludeSource=true;
var url=_8ea.url;
var _90c=url&&_8ea.URL.substr(_8ea.URL.lastIndexOf("/")+1);
var _90d=_90c&&_90c.lastIndexOf(".");
var _90e=_90c&&_90c.substr(0,_90d===-1?_90c.length:_90d);
var _90f=_90c&&_90c.substr(_90d===-1?_90c.length:_90d);
var _910=node.categoryname&&node.categoryname.id;
var _911=_745.compileToIMBuffer(b,_90e+"_"+_8ed+(_910?"_"+_910:"")+"_Accessors"+(_90f||""),_90b);
var _912=_911.toString();
if(_8ea.createSourceMap){
_8ea.imBuffer.concat(_747.SourceNode.fromStringWithSourceMap(_912.code,_747.SourceMapConsumer(_912.map.toString())));
}else{
_8ea.imBuffer.concat(_912);
}
}
for(var _913=_8f8.length,i=0;i<_913;i++){
var ivar=_8f8[i],_8fe=ivar.name;
_8f7[_8fe]=ivar;
}
_8ea.classDefs[_8ed]=_8ee;
var _914=node.body,_915=_914.length;
if(_915>0){
if(!_8eb){
_8ea.lastPos=_914[0].start;
}
for(var i=0;i<_915;++i){
var body=_914[i];
c(body,_8ef,"Statement");
}
if(!_8eb){
_8ec.concat(_8ea.source.substring(_8ea.lastPos,body.end));
}
}
if(!_8f3&&!_8f0&&!node.categoryname){
_8ec.concat("objj_registerClassPair(the_class);\n");
}
if(!_8f3&&_8ea.imBuffer.isEmpty()){
_8ec.concat("class_addMethods(the_class, [");
_8ec.appendStringBuffer(_8ea.imBuffer);
_8ec.concat("]);\n");
}
if(!_8f3&&_8ea.cmBuffer.isEmpty()){
_8ec.concat("class_addMethods(meta_class, [");
_8ec.appendStringBuffer(_8ea.cmBuffer);
_8ec.concat("]);\n");
}
if(!_8f3){
_8ec.concat("}\n");
}
_8ea.jsBuffer=_8ec;
if(!_8eb){
_8ea.lastPos=node.end;
}
if(_8f3){
_8ec.concat("\n@end");
}
if(_8f1){
var _916=[];
for(var i=0,size=_8f1.length;i<size;i++){
var _917=_8f1[i],_918=_8ea.getProtocolDef(_917.name);
if(!_918){
throw _8ea.error_message("Cannot find protocol declaration for '"+_917.name+"'",_917);
}
_916.push(_918);
}
var _919=_8ee.listOfNotImplementedMethodsForProtocols(_916);
if(_919&&_919.length>0){
for(var j=0,_91a=_919.length;j<_91a;j++){
var _91b=_919[j],_91c=_91b.methodDef,_918=_91b.protocolDef;
_8ea.addWarning(_756("Method '"+_91c.name+"' in protocol '"+_918.name+"' is not implemented",node.classname,_8ea.source));
}
}
}
},ProtocolDeclarationStatement:function(node,st,c){
var _91d=st.compiler,_91e=_91d.generate,_91f=_91d.jsBuffer,_920=node.protocolname.name,_921=_91d.getProtocolDef(_920),_922=node.protocols,_923=new _748(st),_924=[],_925=_91d.options.generateObjJ;
if(_921){
throw _91d.error_message("Duplicate protocol "+_920,node.protocolname);
}
_91d.imBuffer=new _300(_91d.createSourceMap,_91d.URL);
_91d.cmBuffer=new _300(_91d.createSourceMap,_91d.URL);
if(!_91e){
_91f.concat(_91d.source.substring(_91d.lastPos,node.start));
}
if(_925){
_91f.concat("@protocol ");
c(node.protocolname,st,"IdentifierName");
}else{
_91f.concat("{var the_protocol = objj_allocateProtocol(\""+_920+"\");",node);
}
if(_922){
if(_925){
_91f.concat(" <");
}
for(var i=0,size=_922.length;i<size;i++){
var _926=_922[i],_927=_926.name,_928=_91d.getProtocolDef(_927);
if(!_928){
throw _91d.error_message("Can't find protocol "+_927,_926);
}
if(_925){
if(i){
_91f.concat(", ");
}
c(_926,st,"IdentifierName");
}else{
_91f.concat("\nvar aProtocol = objj_getProtocol(\""+_927+"\");",node);
_91f.concat("\nif (!aProtocol) throw new SyntaxError(\"*** Could not find definition for protocol \\\""+_920+"\\\"\");",node);
_91f.concat("\nprotocol_addProtocol(the_protocol, aProtocol);",node);
}
_924.push(_928);
}
if(_925){
_91f.concat(">");
}
}
_921=new _7b0(_920,_924);
_91d.protocolDefs[_920]=_921;
_923.protocolDef=_921;
var _929=node.required;
if(_929){
var _92a=_929.length;
if(_92a>0){
for(var i=0;i<_92a;++i){
var _92b=_929[i];
if(!_91e){
_91d.lastPos=_92b.start;
}
c(_92b,_923,"Statement");
}
if(!_91e){
_91f.concat(_91d.source.substring(_91d.lastPos,_92b.end));
}
}
}
if(_925){
_91f.concatFormat("\n@end");
}else{
_91f.concat("\nobjj_registerProtocol(the_protocol);\n");
if(_91d.imBuffer.isEmpty()){
_91f.concat("protocol_addMethodDescriptions(the_protocol, [");
_91f.appendStringBuffer(_91d.imBuffer);
_91f.concat("], true, true);\n");
}
if(_91d.cmBuffer.isEmpty()){
_91f.concat("protocol_addMethodDescriptions(the_protocol, [");
_91f.appendStringBuffer(_91d.cmBuffer);
_91f.concat("], true, false);\n");
}
_91f.concat("}");
}
_91d.jsBuffer=_91f;
if(!_91e){
_91d.lastPos=node.end;
}
},IvarDeclaration:function(node,st,c,_92c){
var _92d=st.compiler,_92e=_92d.jsBuffer;
if(node.outlet){
_92e.concat("@outlet ");
}
c(node.ivartype,st,"IdentifierName");
_92e.concat(" ");
c(node.id,st,"IdentifierName");
if(node.accessors){
_92e.concat(" @accessors");
}
},MethodDeclarationStatement:function(node,st,c){
var _92f=st.compiler,_930=_92f.generate,_931=_92f.jsBuffer,_932=new _76e(st),_933=node.methodtype==="-",_934=node.selectors,_935=node.arguments,_936=node.returntype,_937=[_936?_936.name:node.action?"void":"id"],_938=_936?_936.protocols:null,_939=_934[0].name,_93a=_92f.options.generateObjJ;
if(_938){
for(var i=0,size=_938.length;i<size;i++){
var _93b=_938[i];
if(!_92f.getProtocolDef(_93b.name)){
_92f.addWarning(_756("Cannot find protocol declaration for '"+_93b.name+"'",_93b,_92f.source));
}
}
}
if(!_930){
_931.concat(_92f.source.substring(_92f.lastPos,node.start));
}
if(_93a){
_92f.jsBuffer.concat(_933?"- (":"+ (");
_92f.jsBuffer.concat(_937[0]);
_92f.jsBuffer.concat(")");
}else{
_92f.jsBuffer=_933?_92f.imBuffer:_92f.cmBuffer;
}
var size=_935.length;
if(size>0){
for(var i=0;i<_935.length;i++){
var _93c=_935[i],_93d=_93c.type,_93e=_93d?_93d.name:"id",_93f=_93d?_93d.protocols:null;
_937.push(_93e);
if(i===0){
_939+=":";
}else{
_939+=(_934[i]?_934[i].name:"")+":";
}
if(_93f){
for(var j=0,size=_93f.length;j<size;j++){
var _940=_93f[j];
if(!_92f.getProtocolDef(_940.name)){
_92f.addWarning(_756("Cannot find protocol declaration for '"+_940.name+"'",_940,_92f.source));
}
}
}
if(_93a){
var _941=_934[i];
if(i){
_92f.jsBuffer.concat(" ");
}
_92f.jsBuffer.concat((_941?_941.name:"")+":");
_92f.jsBuffer.concat("(");
_92f.jsBuffer.concat(_93e);
if(_93f){
_92f.jsBuffer.concat(" <");
for(var j=0,size=_93f.length;j<size;j++){
var _940=_93f[j];
if(j){
_92f.jsBuffer.concat(", ");
}
_92f.jsBuffer.concat(_940.name);
}
_92f.jsBuffer.concat(">");
}
_92f.jsBuffer.concat(")");
c(_93c.identifier,st,"IdentifierName");
}
}
}else{
if(_93a){
var _942=_934[0];
_92f.jsBuffer.concat(_942.name,_942);
}
}
if(_93a){
if(node.parameters){
_92f.jsBuffer.concat(", ...");
}
}else{
if(_92f.jsBuffer.isEmpty()){
_92f.jsBuffer.concat(", ");
}
_92f.jsBuffer.concat("new objj_method(sel_getUid(\"",node);
_92f.jsBuffer.concat(_939);
_92f.jsBuffer.concat("\"), ");
}
if(node.body){
if(!_93a){
_92f.jsBuffer.concat("function");
if(_92f.options.includeMethodFunctionNames){
_92f.jsBuffer.concat(" $"+st.currentClassName()+"__"+_939.replace(/:/g,"_"));
}
_92f.jsBuffer.concat("(self, _cmd");
}
_932.methodType=node.methodtype;
_932.vars["self"]={type:"method base",scope:_932};
_932.vars["_cmd"]={type:"method base",scope:_932};
if(_935){
for(var i=0;i<_935.length;i++){
var _93c=_935[i],_943=_93c.identifier.name;
if(!_93a){
_92f.jsBuffer.concat(", ");
_92f.jsBuffer.concat(_943,_93c.identifier);
}
_932.vars[_943]={type:"method argument",node:_93c};
}
}
if(!_93a){
_92f.jsBuffer.concat(")\n");
}
if(!_930){
_92f.lastPos=node.startOfBody;
}
_783+=_837;
_932.endOfScopeBody=true;
c(node.body,_932,"Statement");
_932.variablesNotReadWarnings();
_783=_783.substring(_786);
if(!_930){
_92f.jsBuffer.concat(_92f.source.substring(_92f.lastPos,node.body.end));
}
if(!_93a){
_92f.jsBuffer.concat("\n");
}
}else{
if(_93a){
_92f.jsBuffer.concat(";");
}else{
_92f.jsBuffer.concat("Nil\n");
}
}
if(!_93a){
if(_92f.options.includeMethodArgumentTypeSignatures){
_92f.jsBuffer.concat(","+JSON.stringify(_937));
}
_92f.jsBuffer.concat(")");
_92f.jsBuffer=_931;
}
if(!_930){
_92f.lastPos=node.end;
}
var def=st.classDef,_944;
if(def){
_944=_933?def.getInstanceMethod(_939):def.getClassMethod(_939);
}else{
def=st.protocolDef;
}
if(!def){
throw "InternalError: MethodDeclaration without ClassDeclaration or ProtocolDeclaration at line: "+(_746.getLineInfo(_92f.source,node.start)).line;
}
if(!_944){
var _945=def.protocols;
if(_945){
for(var i=0,size=_945.length;i<size;i++){
var _946=_945[i],_944=_933?_946.getInstanceMethod(_939):_946.getClassMethod(_939);
if(_944){
break;
}
}
}
}
if(_944){
var _947=_944.types;
if(_947){
var _948=_947.length;
if(_948>0){
var _949=_947[0];
if(_949!==_937[0]&&!(_949==="id"&&_936&&_936.typeisclass)){
_92f.addWarning(_756("Conflicting return type in implementation of '"+_939+"': '"+_949+"' vs '"+_937[0]+"'",_936||node.action||_934[0],_92f.source));
}
for(var i=1;i<_948;i++){
var _94a=_947[i];
if(_94a!==_937[i]&&!(_94a==="id"&&_935[i-1].type.typeisclass)){
_92f.addWarning(_756("Conflicting parameter types in implementation of '"+_939+"': '"+_94a+"' vs '"+_937[i]+"'",_935[i-1].type||_935[i-1].identifier,_92f.source));
}
}
}
}
}
var _94b=new _7bf(_939,_937);
if(_933){
def.addInstanceMethod(_94b);
}else{
def.addClassMethod(_94b);
}
},MessageSendExpression:function(node,st,c){
var _94c=st.compiler,_94d=_94c.generate,_94e=_94c.options.inlineMsgSendFunctions,_94f=_94c.jsBuffer,_950=node.object,_951=node.selectors,_952=node.arguments,_953=_952.length,_954=_951[0],_955=_954?_954.name:"",_956=node.parameters,_957=_94c.options,_958=_957.generateObjJ;
for(var i=0;i<_953;i++){
if(i!==0){
var _959=_951[i];
if(_959){
_955+=_959.name;
}
}
_955+=":";
}
if(!_94d){
_94f.concat(_94c.source.substring(_94c.lastPos,node.start));
_94c.lastPos=_950?_950.start:node.arguments.length?node.arguments[0].start:node.end;
}else{
if(!_94e){
var _95a=_953;
if(_956){
_95a+=_956.length;
}
}
}
if(node.superObject){
if(!_94d){
_94f.concat(" ");
}
if(_958){
_94f.concat("[super ");
}else{
if(_94e){
_94f.concat("(",node);
_94f.concat(st.currentMethodType()==="+"?_94c.currentSuperMetaClass:_94c.currentSuperClass);
_94f.concat(".method_dtable[\"",node);
_94f.concat(_955);
_94f.concat("\"] || _objj_forward)(self",node);
}else{
_94f.concat("objj_msgSendSuper",node);
if(_95a<4){
_94f.concat(""+_95a);
}
_94f.concat("({ receiver:self, super_class:"+(st.currentMethodType()==="+"?_94c.currentSuperMetaClass:_94c.currentSuperClass)+" }",node);
}
}
}else{
if(_94d){
var _95b=_950.type==="Identifier"&&!(st.currentMethodType()==="-"&&_94c.getIvarForClass(_950.name,st)&&!st.getLvar(_950.name,true)),_95c,_95d;
if(_95b){
var name=_950.name,_95c=st.getLvar(name);
if(name==="self"){
_95d=!_95c||!_95c.scope||_95c.scope.assignmentToSelf;
}else{
_95d=!!_95c||!_94c.getClassDef(name);
}
if(_95d){
_94f.concat("(",node);
c(_950,st,"Expression");
_94f.concat(" == null ? ",node);
c(_950,st,"Expression");
_94f.concat(" : ",node);
}
if(_94e){
_94f.concat("(",node);
}
c(_950,st,"Expression");
}else{
_95d=true;
if(!st.receiverLevel){
st.receiverLevel=0;
}
_94f.concat("((___r"+ ++st.receiverLevel,node);
_94f.concat(" = ",node);
c(_950,st,"Expression");
_94f.concat(")",node);
_94f.concat(", ___r"+st.receiverLevel,node);
_94f.concat(" == null ? ",node);
_94f.concat("___r"+st.receiverLevel,node);
_94f.concat(" : ",node);
if(_94e){
_94f.concat("(",node);
}
_94f.concat("___r"+st.receiverLevel,node);
if(!(st.maxReceiverLevel>=st.receiverLevel)){
st.maxReceiverLevel=st.receiverLevel;
}
}
if(_94e){
_94f.concat(".isa.method_msgSend[\"",node);
_94f.concat(_955,node);
_94f.concat("\"] || _objj_forward)",node);
}else{
_94f.concat(".isa.objj_msgSend",node);
}
}else{
_94f.concat(" ");
_94f.concat("objj_msgSend(");
_94f.concat(_94c.source.substring(_94c.lastPos,_950.end));
}
}
if(_958){
for(var i=0;i<_953||_953===0&&i===0;i++){
var _955=_951[i];
_94f.concat(" ");
_94f.concat(_955?_955.name:"");
if(_953>0){
var _95e=_952[i];
_94f.concat(":");
c(_95e,st,"Expression");
}
}
if(_956){
for(var i=0,size=_956.length;i<size;++i){
var _95f=_956[i];
_94f.concat(", ");
c(_95f,st,"Expression");
}
}
_94f.concat("]");
}else{
var _960;
if(_94d&&!node.superObject){
if(!_94e){
if(_95a<4){
_94f.concat(""+_95a,node);
}
}
if(_95b){
_94f.concat("(",node);
c(_950,st,"Expression");
}else{
_94f.concat("(___r"+st.receiverLevel,node);
}
if(_957.sourceMap&&_950.type==="Identifier"){
_94c.jsBuffer=new _300();
c(_950,st,"Expression");
var _961=_94c.jsBuffer.toString();
_960=_961+".isa.method_dtable[\""+_955+"\"]";
_94c.jsBuffer=_94f;
}
}
_94f.concat(", ",node);
if(_960){
_94f.concat("(",node);
for(var i=0;i<_951.length;i++){
var _959=_951[i];
if(_959){
_94f.concat(_960,_959);
_94f.concat(", ",node);
}
}
}
_94f.concat("\"",node);
_94f.concat(_955,node);
_94f.concat(_960?"\")":"\"",node);
if(_952){
for(var i=0;i<_952.length;i++){
var _95e=_952[i];
_94f.concat(", ",node);
if(!_94d){
_94c.lastPos=_95e.start;
}
c(_95e,st,"Expression");
if(!_94d){
_94f.concat(_94c.source.substring(_94c.lastPos,_95e.end));
_94c.lastPos=_95e.end;
}
}
}
if(_956){
for(var i=0;i<_956.length;++i){
var _95f=_956[i];
_94f.concat(", ",node);
if(!_94d){
_94c.lastPos=_95f.start;
}
c(_95f,st,"Expression");
if(!_94d){
_94f.concat(_94c.source.substring(_94c.lastPos,_95f.end));
_94c.lastPos=_95f.end;
}
}
}
if(_94d&&!node.superObject){
if(_95d){
_94f.concat(")",node);
}
if(!_95b){
st.receiverLevel--;
}
}
_94f.concat(")",node);
}
if(!_94d){
_94c.lastPos=node.end;
}
},SelectorLiteralExpression:function(node,st,c){
var _962=st.compiler,_963=_962.jsBuffer,_964=_962.generate,_965=_962.options.generateObjJ;
if(!_964){
_963.concat(_962.source.substring(_962.lastPos,node.start));
_963.concat(" ");
}
_963.concat(_965?"@selector(":"sel_getUid(\"",node);
_963.concat(node.selector);
_963.concat(_965?")":"\")");
if(!_964){
_962.lastPos=node.end;
}
},ProtocolLiteralExpression:function(node,st,c){
var _966=st.compiler,_967=_966.jsBuffer,_968=_966.generate,_969=_966.options.generateObjJ;
if(!_968){
_967.concat(_966.source.substring(_966.lastPos,node.start));
_967.concat(" ");
}
_967.concat(_969?"@protocol(":"objj_getProtocol(\"",node);
c(node.id,st,"IdentifierName");
_967.concat(_969?")":"\")");
if(!_968){
_966.lastPos=node.end;
}
},Reference:function(node,st,c){
var _96a=st.compiler,_96b=_96a.jsBuffer,_96c=_96a.generate,_96d=_96a.options.generateObjJ;
if(!_96c){
_96b.concat(_96a.source.substring(_96a.lastPos,node.start));
_96b.concat(" ");
}
if(_96d){
_96b.concat("@ref(",node);
_96b.concat(node.element.name,node.element);
_96b.concat(")",node);
}else{
_96b.concat("function(__input) { if (arguments.length) return ",node);
c(node.element,st,"Expression");
_96b.concat(" = __input; return ");
c(node.element,st,"Expression");
_96b.concat("; }");
}
if(!_96c){
_96a.lastPos=node.end;
}
},Dereference:function(node,st,c){
var _96e=st.compiler,_96f=_96e.jsBuffer,_970=_96e.generate,_971=_96e.options.generateObjJ;
_829(st,node.expr);
if(!_970){
_96f.concat(_96e.source.substring(_96e.lastPos,node.start));
_96e.lastPos=node.expr.start;
}
if(_971){
_96f.concat("@deref(");
}
c(node.expr,st,"Expression");
if(!_970){
_96f.concat(_96e.source.substring(_96e.lastPos,node.expr.end));
}
if(_971){
_96f.concat(")");
}else{
_96f.concat("()");
}
if(!_970){
_96e.lastPos=node.end;
}
},ClassStatement:function(node,st,c){
var _972=st.compiler,_973=_972.jsBuffer,_974=_972.options.generateObjJ;
if(!_972.generate){
_973.concat(_972.source.substring(_972.lastPos,node.start));
_972.lastPos=node.start;
_973.concat("//");
}
if(_974){
_973.concat("@class ");
c(node.id,st,"IdentifierName");
}
var _975=node.id.name;
if(_972.getTypeDef(_975)){
throw _972.error_message(_975+" is already declared as a type",node.id);
}
if(!_972.getClassDef(_975)){
_972.classDefs[_975]=new _78d(false,_975);
}
st.vars[node.id.name]={type:"class",node:node.id};
},GlobalStatement:function(node,st,c){
var _976=st.compiler,_977=_976.jsBuffer,_978=_976.options.generateObjJ;
if(!_976.generate){
_977.concat(_976.source.substring(_976.lastPos,node.start));
_976.lastPos=node.start;
_977.concat("//");
}
if(_978){
_977.concat("@global ");
c(node.id,st,"IdentifierName");
}
(st.rootScope()).vars[node.id.name]={type:"global",node:node.id};
},PreprocessStatement:function(node,st,c){
var _979=st.compiler;
if(!_979.generate){
_979.jsBuffer.concat(_979.source.substring(_979.lastPos,node.start));
_979.lastPos=node.start;
_979.jsBuffer.concat("//");
}
},TypeDefStatement:function(node,st,c){
var _97a=st.compiler,_97b=_97a.generate,_97c=_97a.jsBuffer,_97d=node.typedefname.name,_97e=_97a.getTypeDef(_97d),_97f=new _748(st);
if(_97e){
throw _97a.error_message("Duplicate type definition "+_97d,node.typedefname);
}
if(_97a.getClassDef(_97d)){
throw _97a.error_message(_97d+" is already declared as class",node.typedefname);
}
if(!_97b){
_97c.concat(_97a.source.substring(_97a.lastPos,node.start));
}
_97c.concat("{var the_typedef = objj_allocateTypeDef(\""+_97d+"\");",node);
_97e=new _7be(_97d);
_97a.typeDefs[_97d]=_97e;
_97f.typeDef=_97e;
_97c.concat("\nobjj_registerTypeDef(the_typedef);\n");
_97c.concat("}");
if(!_97b){
_97a.lastPos=node.end;
}
}});
});
function _33e(aURL,_980){
this._URL=aURL;
this._isLocal=_980;
};
_2.FileDependency=_33e;
_33e.prototype.URL=function(){
return this._URL;
};
_33e.prototype.isLocal=function(){
return this._isLocal;
};
_33e.prototype.toMarkedString=function(){
var _981=(this.URL()).absoluteString();
return (this.isLocal()?_26f:_26e)+";"+_981.length+";"+_981;
};
_33e.prototype.toString=function(){
return (this.isLocal()?"LOCAL: ":"STD: ")+this.URL();
};
var _982=0,_983=1,_984=2,_985=3,_986=0;
function _30f(_987,_988,aURL,_989,_98a,_98b,_98c){
if(arguments.length===0){
return this;
}
this._code=_987;
this._function=_989||null;
this._URL=_1ed(aURL||new CFURL("(Anonymous"+_986++ +")"));
this._compiler=_98a||null;
this._fileDependencies=_988;
this._filenameTranslateDictionary=_98b;
if(_98c){
this._base64EncodedSourceMap=_98c;
}
if(!_988){
this._fileDependencyStatus=_985;
this._fileDependencyCallbacks=[];
}else{
if(_988.length){
this._fileDependencyStatus=_982;
this._fileDependencyCallbacks=[];
}else{
this._fileDependencyStatus=_984;
}
}
if(this._function){
return;
}
if(!_98a){
this.setCode(_987);
}
};
_2.Executable=_30f;
_30f.prototype.path=function(){
return (this.URL()).path();
};
_30f.prototype.URL=function(){
return this._URL;
};
_30f.prototype.functionParameters=function(){
var _98d=["global","objj_executeFile","objj_importFile"];
return _98d;
};
_30f.prototype.functionArguments=function(){
var _98e=[_1,this.fileExecuter(),this.fileImporter()];
return _98e;
};
_30f.prototype.execute=function(){
if(this._compiler){
var _98f=this.fileDependencies(),_a9=0,_990=_98f.length;
this._compiler.pushImport((this.URL()).lastPathComponent());
for(;_a9<_990;++_a9){
var _991=_98f[_a9],_992=_991.isLocal(),URL=_991.URL();
this.fileExecuter()(URL,_992);
}
this._compiler.popImport();
this.setCode(this._compiler.compilePass2(),this._compiler.map());
if(_993.printWarningsAndErrors(this._compiler,_2.messageOutputFormatInXML)){
throw "Compilation error";
}
this._compiler=null;
}
var _994=_995;
_995=CFBundle.bundleContainingURL(this.URL());
var _996=this._function.apply(_1,this.functionArguments());
_995=_994;
return _996;
};
_30f.prototype.code=function(){
return this._code;
};
_30f.prototype.setCode=function(code,_997){
this._code=code;
var _998=(this.functionParameters()).join(",");
var _999;
_999=this._base64EncodedSourceMap;
var _99a=(this.URL()).absoluteString();
code+="/**/\n//# sourceURL="+_99a+"s";
if(_997){
if(typeof btoa==="function"){
_999=btoa(_99b(_997));
}else{
if(typeof Buffer==="function"){
_999=(new Buffer(_997)).toString("base64");
}
}
}
if(_999){
code=code.substring((_2.ObjJCompiler||ObjJCompiler).numberOfLinesAtTopOfFunction());
this._base64EncodedSourceMap=_999;
code+="\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,"+_999;
}
this._function=new Function(_998,code);
this._function.displayName=_99a;
};
_30f.prototype.fileDependencies=function(){
return this._fileDependencies;
};
_30f.prototype.setFileDependencies=function(_99c){
this._fileDependencies=_99c;
};
_30f.prototype.hasLoadedFileDependencies=function(){
return this._fileDependencyStatus===_984;
};
var _99d=0,_99e=[],_99f={};
_30f.prototype.loadFileDependencies=function(_9a0){
var _9a1=this._fileDependencyStatus;
if(_9a0){
if(_9a1===_984){
return _9a0();
}
this._fileDependencyCallbacks.push(_9a0);
}
if(_9a1===_982){
if(_99d){
throw "Can't load";
}
_9a2(this);
}
};
_30f.prototype.setExecutableUnloadedFileDependencies=function(){
if(this._fileDependencyStatus===_985){
this._fileDependencyStatus=_982;
}
};
_30f.prototype.isExecutableCantStartLoadYetFileDependencies=function(){
return this._fileDependencyStatus===_985;
};
function _9a2(_9a3){
_99e.push(_9a3);
_9a3._fileDependencyStatus=_983;
var _9a4=_9a3.fileDependencies(),_a9=0,_9a5=_9a4.length,_9a6=_9a3.referenceURL(),_9a7=_9a6.absoluteString(),_9a8=_9a3.fileExecutableSearcher();
_99d+=_9a5;
for(;_a9<_9a5;++_a9){
var _9a9=_9a4[_a9],_9aa=_9a9.isLocal(),URL=_9a9.URL(),_9ab=(_9aa&&_9a7+" "||"")+URL;
if(_99f[_9ab]){
if(--_99d===0){
_9ac();
}
continue;
}
_99f[_9ab]=YES;
_9a8(URL,_9aa,_9ad);
}
};
function _9ad(_9ae){
--_99d;
if(_9ae._fileDependencyStatus===_982){
_9a2(_9ae);
}else{
if(_99d===0){
_9ac();
}
}
};
function _9ac(){
var _9af=_99e,_a9=0,_9b0=_9af.length;
_99e=[];
for(;_a9<_9b0;++_a9){
_9af[_a9]._fileDependencyStatus=_984;
}
for(_a9=0;_a9<_9b0;++_a9){
var _9b1=_9af[_a9],_9b2=_9b1._fileDependencyCallbacks,_9b3=0,_9b4=_9b2.length;
for(;_9b3<_9b4;++_9b3){
_9b2[_9b3]();
}
_9b1._fileDependencyCallbacks=[];
}
};
_30f.prototype.referenceURL=function(){
if(this._referenceURL===_1b){
this._referenceURL=new CFURL(".",this.URL());
}
return this._referenceURL;
};
_30f.prototype.fileImporter=function(){
return _30f.fileImporterForURL(this.referenceURL());
};
_30f.prototype.fileExecuter=function(){
return _30f.fileExecuterForURL(this.referenceURL());
};
_30f.prototype.fileExecutableSearcher=function(){
return _30f.fileExecutableSearcherForURL(this.referenceURL());
};
var _9b5={};
_30f.fileExecuterForURL=function(aURL){
var _9b6=_1ed(aURL),_9b7=_9b6.absoluteString(),_9b8=_9b5[_9b7];
if(!_9b8){
_9b8=function(aURL,_9b9,_9ba){
_30f.fileExecutableSearcherForURL(_9b6)(aURL,_9b9,function(_9bb){
if(!_9bb.hasLoadedFileDependencies()){
throw "No executable loaded for file at URL "+aURL;
}
_9bb.execute(_9ba);
});
};
_9b5[_9b7]=_9b8;
}
return _9b8;
};
var _9bc={};
_30f.fileImporterForURL=function(aURL){
var _9bd=_1ed(aURL),_9be=_9bd.absoluteString(),_9bf=_9bc[_9be];
if(!_9bf){
_9bf=function(aURL,_9c0,_9c1){
_186();
_30f.fileExecutableSearcherForURL(_9bd)(aURL,_9c0,function(_9c2){
_9c2.loadFileDependencies(function(){
_9c2.execute();
_187();
if(_9c1){
_9c1();
}
});
});
};
_9bc[_9be]=_9bf;
}
return _9bf;
};
var _9c3={},_9c4={};
function _29a(x){
var _9c5=0;
for(var k in x){
if(x.hasOwnProperty(k)){
++_9c5;
}
}
return _9c5;
};
_30f.resetCachedFileExecutableSearchers=function(){
_9c3={};
_9c4={};
_9bc={};
_9b5={};
_99f={};
};
_30f.fileExecutableSearcherForURL=function(_9c6){
var _9c7=_9c6.absoluteString(),_9c8=_9c3[_9c7];
if(!_9c8){
var _9c9=_30f.filenameTranslateDictionary?_30f.filenameTranslateDictionary():null;
_9c8=function(aURL,_9ca,_9cb){
var _9cc=(_9ca&&_9c6||"")+aURL,_9cd=_9c4[_9cc];
if(_9cd){
return _9ce(_9cd);
}
var _9cf=aURL instanceof CFURL&&aURL.scheme();
if(_9ca||_9cf){
if(!_9cf){
aURL=new CFURL(aURL,_9c6);
}
_1d6.resolveResourceAtURL(aURL,NO,_9ce,_9c9);
}else{
_1d6.resolveResourceAtURLSearchingIncludeURLs(aURL,_9ce);
}
function _9ce(_9d0){
if(!_9d0){
var _9d1=_2.ObjJCompiler||ObjJCompiler?(_2.ObjJCompiler||ObjJCompiler).currentCompileFile:null;
throw new Error("Could not load file at "+aURL+(_9d1?" when compiling "+_9d1:"")+"\nwith includeURLs: "+_1d6.includeURLs());
}
_9c4[_9cc]=_9d0;
_9cb(new _993(_9d0.URL(),_9c9));
};
};
_9c3[_9c7]=_9c8;
}
return _9c8;
};
var _9d2=55296;
var _9d3=56319;
var _9d4=56320;
var _9d5=57343;
var _9d6=65533;
var _9d7=[0,192,224,240,248,252];
function _99b(_9d8){
var _9d9="";
var _9da=0;
for(var i=0;i<_9d8.length;i++){
var c=_9d8.charCodeAt(i);
if(c<128){
continue;
}
if(i>_9da){
_9d9+=_9d8.substring(_9da,i);
}
if(c>=_9d2&&c<=_9d3){
i++;
if(i<_9d8.length){
var c2=_9d8.charCodeAt(i);
if(c2>=_9d4&&c2<=_9d5){
c=(c-_9d2<<10)+(c2-_9d4)+65536;
}else{
return null;
}
}else{
return null;
}
}else{
if(c>=_9d4&&c<=_9d5){
return null;
}
}
_9da=i+1;
enc=[];
var cc=c;
if(cc>=1114112){
cc=2048;
c=_9d6;
}
if(cc>=65536){
enc.unshift(String.fromCharCode((c|128)&191));
c>>=6;
}
if(cc>=2048){
enc.unshift(String.fromCharCode((c|128)&191));
c>>=6;
}
if(cc>=128){
enc.unshift(String.fromCharCode((c|128)&191));
c>>=6;
}
enc.unshift(String.fromCharCode(c|_9d7[enc.length]));
_9d9+=enc.join("");
}
if(_9da===0){
return _9d8;
}
if(i>_9da){
_9d9+=_9d8.substring(_9da,i);
}
return _9d9;
};
var _9db={};
var _9dc={};
var _9dd="";
function _993(aURL,_9de){
aURL=_1ed(aURL);
var _9df=aURL.absoluteString(),_9e0=_9db[_9df];
if(_9e0){
return _9e0;
}
_9db[_9df]=this;
var _9e1=(_1d6.resourceAtURL(aURL)).contents(),_9e2=NULL,_9e3=(aURL.pathExtension()).toLowerCase();
this._hasExecuted=NO;
if(_9e1.match(/^@STATIC;/)){
_9e2=_9e4(_9e1,aURL);
}else{
if((_9e3==="j"||!_9e3)&&!_9e1.match(/^{/)){
var _9e5=_9dc||{};
this.cachedIncludeFileSearchResultsContent={};
this.cachedIncludeFileSearchResultsURL={};
_9e6(this,_9e1,aURL,_9e5,_9de);
return;
}else{
_9e2=new _30f(_9e1,[],aURL);
}
}
_30f.apply(this,[_9e2.code(),_9e2.fileDependencies(),aURL,_9e2._function,_9e2._compiler,_9de]);
};
_2.FileExecutable=_993;
_993.prototype=new _30f();
var _9e6=function(self,_9e7,aURL,_9e8,_9e9){
var _9ea=_9e8.acornOptions||(_9e8.acornOptions={});
_9ea.preprocessGetIncludeFile=function(_9eb,_9ec){
var _9ed=new CFURL(".",aURL),_9ee=new CFURL(_9eb);
var _9ef=(_9ec&&_9ed||"")+_9ee,_9f0=self.cachedIncludeFileSearchResultsContent[_9ef];
if(!_9f0){
var _9f1=_9ee instanceof CFURL&&_9ee.scheme(),_9f2=NO;
function _9f3(_9f4){
var _9f5=_9f4&&_9f4.contents(),_9f6=_9f5&&_9f5.charCodeAt(_9f5.length-1);
if(_9f5==null){
throw new Error("Can't load file "+_9ee);
}
if(_9f6!==10&&_9f6!==13&&_9f6!==8232&&_9f6!==8233){
_9f5+="\n";
}
self.cachedIncludeFileSearchResultsContent[_9ef]=_9f5;
self.cachedIncludeFileSearchResultsURL[_9ef]=_9f4.URL();
if(_9f2){
_9e6(self,_9e7,aURL,_9e8,_9e9);
}
};
if(_9ec||_9f1){
if(!_9f1){
_9ee=new CFURL(_9ee,new CFURL(_9e9[aURL.lastPathComponent()]||".",_9ed));
}
_1d6.resolveResourceAtURL(_9ee,NO,_9f3);
}else{
_1d6.resolveResourceAtURLSearchingIncludeURLs(_9ee,_9f3);
}
_9f0=self.cachedIncludeFileSearchResultsContent[_9ef];
}
if(_9f0){
return {include:_9f0,sourceFile:self.cachedIncludeFileSearchResultsURL[_9ef]};
}else{
_9f2=YES;
return null;
}
};
var _9f7=_9dc&&_9dc.includeFiles,_9f8=true;
_9ea.preIncludeFiles=[];
if(_9f7){
for(var i=0,size=_9f7.length;i<size;i++){
var _9f9=_1ed(_9f7[i]);
try{
var _9fa=_1d6.resourceAtURL(_1ed(_9f9));
}
catch(e){
_1d6.resolveResourcesAtURLs(_9f7.map(function(u){
return _1ed(u);
}),function(){
_9e6(self,_9e7,aURL,_9e8,_9e9);
});
_9f8=false;
break;
}
if(_9fa){
if(_9fa.isNotFound()){
throw new Error("--include file not found "+includeUrl);
}
var _9fb=_9fa.contents();
var _9fc=_9fb.charCodeAt(_9fb.length-1);
if(_9fc!==10&&_9fc!==13&&_9fc!==8232&&_9fc!==8233){
_9fb+="\n";
}
_9ea.preIncludeFiles.push({include:_9fb,sourceFile:_9f9.toString()});
}
}
}
if(_9f8){
var _9fd=(_2.ObjJCompiler||ObjJCompiler).compileFileDependencies(_9e7,aURL,_9e8);
var _9fe=_9fd.warningsAndErrors;
if(_9fe&&_9fe.length===1&&_9fe[0].message.indexOf("file not found")>-1){
return;
}
if(_993.printWarningsAndErrors(_9fd,_2.messageOutputFormatInXML)){
throw "Compilation error";
}
var _9ff=_9fd.dependencies.map(function(_a00){
return new _33e(new CFURL(_a00.url),_a00.isLocal);
});
}
if(self.isExecutableCantStartLoadYetFileDependencies()){
self.setFileDependencies(_9ff);
self.setExecutableUnloadedFileDependencies();
self.loadFileDependencies();
}else{
if(self._fileDependencyStatus==null){
executable=new _30f(_9fd&&_9fd.jsBuffer?_9fd.jsBuffer.toString():null,_9ff,aURL,null,_9fd);
_30f.apply(self,[executable.code(),executable.fileDependencies(),aURL,executable._function,executable._compiler,_9e9]);
}
}
};
_993.resetFileExecutables=function(){
_9db={};
_a01={};
};
_993.prototype.execute=function(_a02){
if(this._hasExecuted&&!_a02){
return;
}
this._hasExecuted=YES;
_30f.prototype.execute.call(this);
};
_993.prototype.hasExecuted=function(){
return this._hasExecuted;
};
function _9e4(_a03,aURL){
var _a04=new _128(_a03);
var _a05=NULL,code="",_a06=[],_a07;
while(_a05=_a04.getMarker()){
var text=_a04.getString();
if(_a05===_26d){
code+=text;
}else{
if(_a05===_26e){
_a06.push(new _33e(new CFURL(text),NO));
}else{
if(_a05===_26f){
_a06.push(new _33e(new CFURL(text),YES));
}else{
if(_a05===MARKER_SOURCE_MAP){
_a07=text;
}
}
}
}
}
var fn=_993._lookupCachedFunction(aURL);
if(fn){
return new _30f(code,_a06,aURL,fn,null,null,_a07);
}
return new _30f(code,_a06,aURL,null,null,null,_a07);
};
var _a01={};
_993._cacheFunction=function(aURL,fn){
aURL=typeof aURL==="string"?aURL:aURL.absoluteString();
_a01[aURL]=fn;
};
_993._lookupCachedFunction=function(aURL){
aURL=typeof aURL==="string"?aURL:aURL.absoluteString();
return _a01[aURL];
};
_993.setCurrentGccCompilerFlags=function(_a08){
if(_9dd===_a08){
return;
}
_9dd=_a08;
var _a09=(_2.ObjJCompiler||ObjJCompiler).parseGccCompilerFlags(_a08);
_993.setCurrentCompilerFlags(_a09);
};
_993.currentGccCompilerFlags=function(_a0a){
return _9dd;
};
_993.setCurrentCompilerFlags=function(_a0b){
_9dc=_a0b;
if(_9dc.transformNamedFunctionDeclarationToAssignment==null){
_9dc.transformNamedFunctionDeclarationToAssignment=true;
}
if(_9dc.sourceMap==null){
_9dc.sourceMap=false;
}
if(_9dc.inlineMsgSendFunctions==null){
_9dc.inlineMsgSendFunctions=false;
}
};
_993.currentCompilerFlags=function(_a0c){
return _9dc;
};
_993.printWarningsAndErrors=function(_a0d,_a0e){
var _a0f=[],_a10=false;
for(var i=0;i<_a0d.warningsAndErrors.length;i++){
var _a11=_a0d.warningsAndErrors[i],_a12=_a0d.prettifyMessage(_a11);
_a10=_a10||_a11.messageType==="ERROR";
console.log(_a12);
}
return _a10;
};
_993.setCurrentCompilerFlags({});
var _a13=1,_a14=2,_a15=4,_a16=8;
objj_ivar=function(_a17,_a18){
this.name=_a17;
this.type=_a18;
};
objj_method=function(_a19,_a1a,_a1b){
var _a1c=_a1a||function(_a1d,_a1e){
CPException.isa.objj_msgSend2(CPException,"raise:reason:",CPInternalInconsistencyException,_a1d.isa.method_msgSend0(self,"className")+" does not have an implementation for selector '"+_a1e+"'");
};
_a1c.method_name=_a19;
_a1c.method_imp=_a1a;
_a1c.method_types=_a1b;
return _a1c;
};
objj_class=function(_a1f){
this.isa=NULL;
this.version=0;
this.super_class=NULL;
this.name=NULL;
this.info=0;
this.ivar_list=[];
this.ivar_store=function(){
};
this.ivar_dtable=this.ivar_store.prototype;
this.method_list=[];
this.method_store=function(){
};
this.method_dtable=this.method_store.prototype;
this.protocol_list=[];
this.allocator=function(){
};
this._UID=-1;
};
objj_protocol=function(_a20){
this.name=_a20;
this.instance_methods={};
this.class_methods={};
};
objj_object=function(){
this.isa=NULL;
this._UID=-1;
};
objj_typeDef=function(_a21){
this.name=_a21;
};
class_getName=function(_a22){
if(_a22==Nil){
return "";
}
return _a22.name;
};
class_isMetaClass=function(_a23){
if(!_a23){
return NO;
}
return _a23.info&_a14;
};
class_getSuperclass=function(_a24){
if(_a24==Nil){
return Nil;
}
return _a24.super_class;
};
class_setSuperclass=function(_a25,_a26){
_a25.super_class=_a26;
_a25.isa.super_class=_a26.isa;
};
class_addIvar=function(_a27,_a28,_a29){
var _a2a=_a27.allocator.prototype;
if(typeof _a2a[_a28]!="undefined"){
return NO;
}
var ivar=new objj_ivar(_a28,_a29);
_a27.ivar_list.push(ivar);
_a27.ivar_dtable[_a28]=ivar;
_a2a[_a28]=NULL;
return YES;
};
class_addIvars=function(_a2b,_a2c){
var _a2d=0,_a2e=_a2c.length,_a2f=_a2b.allocator.prototype;
for(;_a2d<_a2e;++_a2d){
var ivar=_a2c[_a2d],name=ivar.name;
if(typeof _a2f[name]==="undefined"){
_a2b.ivar_list.push(ivar);
_a2b.ivar_dtable[name]=ivar;
_a2f[name]=NULL;
}
}
};
class_copyIvarList=function(_a30){
return _a30.ivar_list.slice(0);
};
class_addMethod=function(_a31,_a32,_a33,_a34){
var _a35=new objj_method(_a32,_a33,_a34);
_a31.method_list.push(_a35);
_a31.method_dtable[_a32]=_a35;
if(!(_a31.info&_a14)&&(_a31.info&_a14?_a31:_a31.isa).isa===(_a31.info&_a14?_a31:_a31.isa)){
class_addMethod(_a31.info&_a14?_a31:_a31.isa,_a32,_a33,_a34);
}
return YES;
};
class_addMethods=function(_a36,_a37){
var _a38=0,_a39=_a37.length,_a3a=_a36.method_list,_a3b=_a36.method_dtable;
for(;_a38<_a39;++_a38){
var _a3c=_a37[_a38];
_a3a.push(_a3c);
_a3b[_a3c.method_name]=_a3c;
}
if(!(_a36.info&_a14)&&(_a36.info&_a14?_a36:_a36.isa).isa===(_a36.info&_a14?_a36:_a36.isa)){
class_addMethods(_a36.info&_a14?_a36:_a36.isa,_a37);
}
};
class_getInstanceMethod=function(_a3d,_a3e){
if(!_a3d||!_a3e){
return NULL;
}
var _a3f=_a3d.method_dtable[_a3e];
return _a3f?_a3f:NULL;
};
class_getInstanceVariable=function(_a40,_a41){
if(!_a40||!_a41){
return NULL;
}
var _a42=_a40.ivar_dtable[_a41];
return _a42;
};
class_getClassMethod=function(_a43,_a44){
if(!_a43||!_a44){
return NULL;
}
var _a45=(_a43.info&_a14?_a43:_a43.isa).method_dtable[_a44];
return _a45?_a45:NULL;
};
class_respondsToSelector=function(_a46,_a47){
return class_getClassMethod(_a46,_a47)!=NULL;
};
class_copyMethodList=function(_a48){
return _a48.method_list.slice(0);
};
class_getVersion=function(_a49){
return _a49.version;
};
class_setVersion=function(_a4a,_a4b){
_a4a.version=parseInt(_a4b,10);
};
class_replaceMethod=function(_a4c,_a4d,_a4e){
if(!_a4c||!_a4d){
return NULL;
}
var _a4f=_a4c.method_dtable[_a4d],_a50=_a4f.method_imp,_a51=new objj_method(_a4f.method_name,_a4e,_a4f.method_types);
_a51.displayName=_a4f.displayName;
_a4c.method_dtable[_a4d]=_a51;
var _a52=_a4c.method_list.indexOf(_a4f);
if(_a52!==-1){
_a4c.method_list[_a52]=_a51;
}else{
_a4c.method_list.push(_a51);
}
return _a50;
};
class_addProtocol=function(_a53,_a54){
if(!_a54||class_conformsToProtocol(_a53,_a54)){
return;
}
(_a53.protocol_list||(_a53.protocol_list=[])).push(_a54);
return true;
};
class_conformsToProtocol=function(_a55,_a56){
if(!_a56){
return false;
}
while(_a55){
var _a57=_a55.protocol_list,size=_a57?_a57.length:0;
for(var i=0;i<size;i++){
var p=_a57[i];
if(p.name===_a56.name){
return true;
}
if(protocol_conformsToProtocol(p,_a56)){
return true;
}
}
_a55=class_getSuperclass(_a55);
}
return false;
};
class_copyProtocolList=function(_a58){
var _a59=_a58.protocol_list;
return _a59?_a59.slice(0):[];
};
protocol_conformsToProtocol=function(p1,p2){
if(!p1||!p2){
return false;
}
if(p1.name===p2.name){
return true;
}
var _a5a=p1.protocol_list,size=_a5a?_a5a.length:0;
for(var i=0;i<size;i++){
var p=_a5a[i];
if(p.name===p2.name){
return true;
}
if(protocol_conformsToProtocol(p,p2)){
return true;
}
}
return false;
};
var _a5b=Object.create(null);
objj_allocateProtocol=function(_a5c){
var _a5d=new objj_protocol(_a5c);
return _a5d;
};
objj_registerProtocol=function(_a5e){
_a5b[_a5e.name]=_a5e;
};
protocol_getName=function(_a5f){
return _a5f.name;
};
protocol_addMethodDescription=function(_a60,_a61,_a62,_a63,_a64){
if(!_a60||!_a61){
return;
}
if(_a63){
(_a64?_a60.instance_methods:_a60.class_methods)[_a61]=new objj_method(_a61,null,_a62);
}
};
protocol_addMethodDescriptions=function(_a65,_a66,_a67,_a68){
if(!_a67){
return;
}
var _a69=0,_a6a=_a66.length,_a6b=_a68?_a65.instance_methods:_a65.class_methods;
for(;_a69<_a6a;++_a69){
var _a6c=_a66[_a69];
_a6b[_a6c.method_name]=_a6c;
}
};
protocol_copyMethodDescriptionList=function(_a6d,_a6e,_a6f){
if(!_a6e){
return [];
}
var _a70=_a6f?_a6d.instance_methods:_a6d.class_methods,_a71=[];
for(var _a72 in _a70){
if(_a70.hasOwnProperty(_a72)){
_a71.push(_a70[_a72]);
}
}
return _a71;
};
protocol_addProtocol=function(_a73,_a74){
if(!_a73||!_a74){
return;
}
(_a73.protocol_list||(_a73.protocol_list=[])).push(_a74);
};
var _a75=Object.create(null);
objj_allocateTypeDef=function(_a76){
var _a77=new objj_typeDef(_a76);
return _a77;
};
objj_registerTypeDef=function(_a78){
_a75[_a78.name]=_a78;
};
typeDef_getName=function(_a79){
return _a79.name;
};
var _a7a=function(_a7b){
var meta=_a7b.info&_a14?_a7b:_a7b.isa;
if(_a7b.info&_a14){
_a7b=objj_getClass(_a7b.name);
}
if(_a7b.super_class&&!((_a7b.super_class.info&_a14?_a7b.super_class:_a7b.super_class.isa).info&_a15)){
_a7a(_a7b.super_class);
}
if(!(meta.info&_a15)&&!(meta.info&_a16)){
meta.info=(meta.info|_a16)&~0;
_a7b.objj_msgSend=objj_msgSendFast;
_a7b.objj_msgSend0=objj_msgSendFast0;
_a7b.objj_msgSend1=objj_msgSendFast1;
_a7b.objj_msgSend2=objj_msgSendFast2;
_a7b.objj_msgSend3=objj_msgSendFast3;
meta.objj_msgSend=objj_msgSendFast;
meta.objj_msgSend0=objj_msgSendFast0;
meta.objj_msgSend1=objj_msgSendFast1;
meta.objj_msgSend2=objj_msgSendFast2;
meta.objj_msgSend3=objj_msgSendFast3;
_a7b.method_msgSend=_a7b.method_dtable;
var _a7c=meta.method_msgSend=meta.method_dtable,_a7d=_a7c["initialize"];
if(_a7d){
_a7d(_a7b,"initialize");
}
meta.info=(meta.info|_a15)&~_a16;
}
};
_objj_forward=function(self,_a7e){
var isa=self.isa,meta=isa.info&_a14?isa:isa.isa;
if(!(meta.info&_a15)&&!(meta.info&_a16)){
_a7a(isa);
}
var _a7f=isa.method_msgSend[_a7e];
if(_a7f){
return _a7f.apply(isa,arguments);
}
_a7f=isa.method_dtable[_a80];
if(_a7f){
var _a81=_a7f(self,_a80,_a7e);
if(_a81&&_a81!==self){
arguments[0]=_a81;
return _a81.isa.objj_msgSend.apply(_a81.isa,arguments);
}
}
_a7f=isa.method_dtable[_a82];
if(_a7f){
var _a83=isa.method_dtable[_a84];
if(_a83){
var _a85=_a7f(self,_a82,_a7e);
if(_a85){
var _a86=objj_lookUpClass("CPInvocation");
if(_a86){
var _a87=_a86.isa.objj_msgSend1(_a86,_a88,_a85),_a9=0,_a89=arguments.length;
if(_a87!=null){
var _a8a=_a87.isa;
for(;_a9<_a89;++_a9){
_a8a.objj_msgSend2(_a87,_a8b,arguments[_a9],_a9);
}
}
_a83(self,_a84,_a87);
return _a87==null?null:_a8a.objj_msgSend0(_a87,_a8c);
}
}
}
}
_a7f=isa.method_dtable[_a8d];
if(_a7f){
return _a7f(self,_a8d,_a7e);
}
throw class_getName(isa)+" does not implement doesNotRecognizeSelector: when sending "+sel_getName(_a7e)+". Did you forget a superclass for "+class_getName(isa)+"?";
};
class_getMethodImplementation=function(_a8e,_a8f){
if(!((_a8e.info&_a14?_a8e:_a8e.isa).info&_a15)){
_a7a(_a8e);
}
var _a90=_a8e.method_dtable[_a8f]||_objj_forward;
return _a90;
};
var _a91=Object.create(null);
objj_enumerateClassesUsingBlock=function(_a92){
for(var key in _a91){
_a92(_a91[key]);
}
};
objj_allocateClassPair=function(_a93,_a94){
var _a95=new objj_class(_a94),_a96=new objj_class(_a94),_a97=_a95;
if(_a93){
_a97=_a93;
while(_a97.superclass){
_a97=_a97.superclass;
}
_a95.allocator.prototype=new _a93.allocator();
_a95.ivar_dtable=_a95.ivar_store.prototype=new _a93.ivar_store();
_a95.method_dtable=_a95.method_store.prototype=new _a93.method_store();
_a96.method_dtable=_a96.method_store.prototype=new _a93.isa.method_store();
_a95.super_class=_a93;
_a96.super_class=_a93.isa;
}else{
_a95.allocator.prototype=new objj_object();
}
_a95.isa=_a96;
_a95.name=_a94;
_a95.info=_a13;
_a95._UID=objj_generateObjectUID();
_a95.init=true;
_a96.isa=_a97.isa;
_a96.name=_a94;
_a96.info=_a14;
_a96._UID=objj_generateObjectUID();
_a96.init=true;
return _a95;
};
var _995=nil;
objj_registerClassPair=function(_a98){
_1[_a98.name]=_a98;
_a91[_a98.name]=_a98;
_1f4(_a98,_995);
};
objj_resetRegisterClasses=function(){
for(var key in _a91){
delete _1[key];
}
_a91=Object.create(null);
_a5b=Object.create(null);
_a75=Object.create(null);
_1f7();
};
class_createInstance=function(_a99){
if(!_a99){
throw new Error("*** Attempting to create object with Nil class.");
}
var _a9a=new _a99.allocator();
_a9a.isa=_a99;
_a9a._UID=objj_generateObjectUID();
return _a9a;
};
var _a9b=function(){
};
_a9b.prototype.member=false;
with(new _a9b()){
member=true;
}
if((new _a9b()).member){
var _a9c=class_createInstance;
class_createInstance=function(_a9d){
var _a9e=_a9c(_a9d);
if(_a9e){
var _a9f=_a9e.isa,_aa0=_a9f;
while(_a9f){
var _aa1=_a9f.ivar_list,_aa2=_aa1.length;
while(_aa2--){
_a9e[_aa1[_aa2].name]=NULL;
}
_a9f=_a9f.super_class;
}
_a9e.isa=_aa0;
}
return _a9e;
};
}
object_getClassName=function(_aa3){
if(!_aa3){
return "";
}
var _aa4=_aa3.isa;
return _aa4?class_getName(_aa4):"";
};
objj_lookUpClass=function(_aa5){
var _aa6=_a91[_aa5];
return _aa6?_aa6:Nil;
};
objj_getClass=function(_aa7){
var _aa8=_a91[_aa7];
if(!_aa8){
}
return _aa8?_aa8:Nil;
};
objj_getClassList=function(_aa9,_aaa){
for(var _aab in _a91){
_aa9.push(_a91[_aab]);
if(_aaa&&--_aaa===0){
break;
}
}
return _aa9.length;
};
objj_getMetaClass=function(_aac){
var _aad=objj_getClass(_aac);
return _aad.info&_a14?_aad:_aad.isa;
};
objj_getProtocol=function(_aae){
return _a5b[_aae];
};
objj_getTypeDef=function(_aaf){
return _a75[_aaf];
};
ivar_getName=function(_ab0){
return _ab0.name;
};
ivar_getTypeEncoding=function(_ab1){
return _ab1.type;
};
objj_msgSend=function(_ab2,_ab3){
if(_ab2==nil){
return _ab2;
}
var isa=_ab2.isa;
if(isa.init){
_a7a(isa);
}
var _ab4=isa.method_dtable[_ab3];
var _ab5=_ab4?_ab4.method_imp:_objj_forward;
switch(arguments.length){
case 2:
return _ab5(_ab2,_ab3);
case 3:
return _ab5(_ab2,_ab3,arguments[2]);
case 4:
return _ab5(_ab2,_ab3,arguments[2],arguments[3]);
case 5:
return _ab5(_ab2,_ab3,arguments[2],arguments[3],arguments[4]);
case 6:
return _ab5(_ab2,_ab3,arguments[2],arguments[3],arguments[4],arguments[5]);
case 7:
return _ab5(_ab2,_ab3,arguments[2],arguments[3],arguments[4],arguments[5],arguments[6]);
}
return _ab5.apply(_ab2,arguments);
};
objj_msgSendSuper=function(_ab6,_ab7){
var _ab8=_ab6.super_class;
arguments[0]=_ab6.receiver;
if(!((_ab8.info&_a14?_ab8:_ab8.isa).info&_a15)){
_a7a(_ab8);
}
var _ab9=_ab8.method_dtable[_ab7]||_objj_forward;
return _ab9.apply(_ab6.receiver,arguments);
};
objj_msgSendSuper0=function(_aba,_abb){
return (_aba.super_class.method_dtable[_abb]||_objj_forward)(_aba.receiver,_abb);
};
objj_msgSendSuper1=function(_abc,_abd,arg0){
return (_abc.super_class.method_dtable[_abd]||_objj_forward)(_abc.receiver,_abd,arg0);
};
objj_msgSendSuper2=function(_abe,_abf,arg0,arg1){
return (_abe.super_class.method_dtable[_abf]||_objj_forward)(_abe.receiver,_abf,arg0,arg1);
};
objj_msgSendSuper3=function(_ac0,_ac1,arg0,arg1,arg2){
return (_ac0.super_class.method_dtable[_ac1]||_objj_forward)(_ac0.receiver,_ac1,arg0,arg1,arg2);
};
objj_msgSendFast=function(_ac2,_ac3){
return (this.method_dtable[_ac3]||_objj_forward).apply(_ac2,arguments);
};
var _ac4=function(_ac5,_ac6){
_a7a(this);
return this.objj_msgSend.apply(this,arguments);
};
objj_msgSendFast0=function(_ac7,_ac8){
return (this.method_dtable[_ac8]||_objj_forward)(_ac7,_ac8);
};
var _ac9=function(_aca,_acb){
_a7a(this);
return this.objj_msgSend0(_aca,_acb);
};
objj_msgSendFast1=function(_acc,_acd,arg0){
return (this.method_dtable[_acd]||_objj_forward)(_acc,_acd,arg0);
};
var _ace=function(_acf,_ad0,arg0){
_a7a(this);
return this.objj_msgSend1(_acf,_ad0,arg0);
};
objj_msgSendFast2=function(_ad1,_ad2,arg0,arg1){
return (this.method_dtable[_ad2]||_objj_forward)(_ad1,_ad2,arg0,arg1);
};
var _ad3=function(_ad4,_ad5,arg0,arg1){
_a7a(this);
return this.objj_msgSend2(_ad4,_ad5,arg0,arg1);
};
objj_msgSendFast3=function(_ad6,_ad7,arg0,arg1,arg2){
return (this.method_dtable[_ad7]||_objj_forward)(_ad6,_ad7,arg0,arg1,arg2);
};
var _ad8=function(_ad9,_ada,arg0,arg1,arg2){
_a7a(this);
return this.objj_msgSend3(_ad9,_ada,arg0,arg1,arg2);
};
method_getName=function(_adb){
return _adb.method_name;
};
method_copyReturnType=function(_adc){
var _add=_adc.method_types;
if(_add){
var _ade=_add[0];
return _ade!=NULL?_ade:NULL;
}else{
return NULL;
}
};
method_copyArgumentType=function(_adf,_ae0){
switch(_ae0){
case 0:
return "id";
case 1:
return "SEL";
default:
var _ae1=_adf.method_types;
if(_ae1){
var _ae2=_ae1[_ae0-1];
return _ae2!=NULL?_ae2:NULL;
}else{
return NULL;
}
}
};
method_getNumberOfArguments=function(_ae3){
var _ae4=_ae3.method_types;
return _ae4?_ae4.length+1:(_ae3.method_name.match(/:/g)||[]).length+2;
};
method_getImplementation=function(_ae5){
return _ae5.method_imp;
};
method_setImplementation=function(_ae6,_ae7){
var _ae8=_ae6.method_imp;
_ae6.method_imp=_ae7;
return _ae8;
};
method_exchangeImplementations=function(lhs,rhs){
var _ae9=method_getImplementation(lhs),_aea=method_getImplementation(rhs);
method_setImplementation(lhs,_aea);
method_setImplementation(rhs,_ae9);
};
sel_getName=function(_aeb){
return _aeb?_aeb:"<null selector>";
};
sel_getUid=function(_aec){
return _aec;
};
sel_isEqual=function(lhs,rhs){
return lhs===rhs;
};
sel_registerName=function(_aed){
return _aed;
};
objj_class.prototype.toString=objj_object.prototype.toString=function(){
var isa=this.isa;
if(class_getInstanceMethod(isa,_aee)){
return isa.objj_msgSend0(this,_aee);
}
if(class_isMetaClass(isa)){
return this.name;
}
return "["+isa.name+" Object](-description not implemented)";
};
objj_class.prototype.objj_msgSend=_ac4;
objj_class.prototype.objj_msgSend0=_ac9;
objj_class.prototype.objj_msgSend1=_ace;
objj_class.prototype.objj_msgSend2=_ad3;
objj_class.prototype.objj_msgSend3=_ad8;
objj_class.prototype.method_msgSend=Object.create(null);
var _aee=sel_getUid("description"),_a80=sel_getUid("forwardingTargetForSelector:"),_a82=sel_getUid("methodSignatureForSelector:"),_a84=sel_getUid("forwardInvocation:"),_a8d=sel_getUid("doesNotRecognizeSelector:"),_a88=sel_getUid("invocationWithMethodSignature:"),_aef=sel_getUid("setTarget:"),_af0=sel_getUid("setSelector:"),_a8b=sel_getUid("setArgument:atIndex:"),_a8c=sel_getUid("returnValue");
objj_eval=function(_af1){
var url=_2.pageURL;
var _af2=_2.asyncLoader;
_2.asyncLoader=NO;
var _af3=_2.preprocess(_af1,url,0);
if(!_af3.hasLoadedFileDependencies()){
_af3.loadFileDependencies();
}
_1._objj_eval_scope={};
_1._objj_eval_scope.objj_executeFile=_30f.fileExecuterForURL(url);
_1._objj_eval_scope.objj_importFile=_30f.fileImporterForURL(url);
var code="with(_objj_eval_scope){"+_af3._code+"\n//*/\n}";
var _af4;
_af4=eval(code);
_2.asyncLoader=_af2;
return _af4;
};
_2.objj_eval=objj_eval;
_186();
var _af5=new CFURL(window.location.href),_af6=document.getElementsByTagName("base"),_af7=_af6.length;
if(_af7>0){
var _af8=_af6[_af7-1],_af9=_af8&&_af8.getAttribute("href");
if(_af9){
_af5=new CFURL(_af9,_af5);
}
}
if(typeof OBJJ_COMPILER_FLAGS!=="undefined"){
var _afa={};
for(var i=0;i<OBJJ_COMPILER_FLAGS.length;i++){
switch(OBJJ_COMPILER_FLAGS[i]){
case "IncludeDebugSymbols":
_afa.includeMethodFunctionNames=true;
break;
case "IncludeTypeSignatures":
_afa.includeIvarTypeSignatures=true;
_afa.includeMethodArgumentTypeSignatures=true;
break;
case "InlineMsgSend":
_afa.inlineMsgSendFunctions=true;
break;
case "SourceMap":
_afa.sourceMap=true;
break;
}
}
_993.setCurrentCompilerFlags(_afa);
}
var _afb=new CFURL(window.OBJJ_MAIN_FILE||"main.j"),_1f3=(new CFURL(".",new CFURL(_afb,_af5))).absoluteURL(),_afc=(new CFURL("..",_1f3)).absoluteURL();
if(_1f3===_afc){
_afc=new CFURL(_afc.schemeAndAuthority());
}
_1d6.resourceAtURL(_afc,YES);
_2.pageURL=_af5;
_2.bootstrap=function(){
_afd();
};
function _afd(){
_1d6.resolveResourceAtURL(_1f3,YES,function(_afe){
var _aff=_1d6.includeURLs(),_a9=0,_b00=_aff.length;
for(;_a9<_b00;++_a9){
_afe.resourceAtURL(_aff[_a9],YES);
}
_30f.fileImporterForURL(_1f3)(_afb.lastPathComponent(),YES,function(){
_187();
_b06(function(){
var _b01=window.location.hash.substring(1),args=[];
if(_b01.length){
args=_b01.split("/");
for(var i=0,_b00=args.length;i<_b00;i++){
args[i]=decodeURIComponent(args[i]);
}
}
var _b02=(window.location.search.substring(1)).split("&"),_b03=new CFMutableDictionary();
for(var i=0,_b00=_b02.length;i<_b00;i++){
var _b04=_b02[i].split("=");
if(!_b04[0]){
continue;
}
if(_b04[1]==null){
_b04[1]=true;
}
_b03.setValueForKey(decodeURIComponent(_b04[0]),decodeURIComponent(_b04[1]));
}
main(args,_b03);
});
});
});
};
var _b05=NO;
function _b06(_b07){
if(_b05||document.readyState==="complete"){
return _b07();
}
if(window.addEventListener){
window.addEventListener("load",_b07,NO);
}else{
if(window.attachEvent){
window.attachEvent("onload",_b07);
}
}
};
_b06(function(){
_b05=YES;
});
if(typeof OBJJ_AUTO_BOOTSTRAP==="undefined"||OBJJ_AUTO_BOOTSTRAP){
_2.bootstrap();
}
function _1ed(aURL){
if(aURL instanceof CFURL&&aURL.scheme()){
return aURL;
}
return new CFURL(aURL,_1f3);
};
objj_importFile=_30f.fileImporterForURL(_1f3);
objj_executeFile=_30f.fileExecuterForURL(_1f3);
objj_import=function(){
CPLog.warn("objj_import is deprecated, use objj_importFile instead");
objj_importFile.apply(this,arguments);
};
})(window,ObjectiveJ);
