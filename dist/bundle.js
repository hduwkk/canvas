!function(t){var e={};function n(i){if(e[i])return e[i].exports;var o=e[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=t,n.c=e,n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(n.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)n.d(i,o,function(e){return t[e]}.bind(null,o));return i},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){"use strict";function i(t){return"string"==typeof t&&(t=document.querySelector(t)),t&&1===t.nodeType?t:(e=`query filed [${t}]`,console.warn(`[dChart]: ${e}`),document.createElement("div"));var e}n.r(e);const o=["fillStyle","strokeStyle","shadowColor","shadowBlur","shadowOffsetX","shadowOffsetY","lineCap","lineJoin","lineWidth","miterLimit","font","textAlign","textBaseline"];function r(t,e){return t.currentStyle?t.currentStyle[e]:window.getComputedStyle(t,null)[e]}let s=0;class l{constructor(t){this.points=t.points||[],this.style=t.style||{lineWidth:1,strokeStyle:"#000"},this.needCache=t.needCache||!1,this.name=t.name||`lineid${s++}`}}class a{constructor(t){this.init(t)}initContext(t){const e=this.container=i(t.el),n=document.createElement("canvas");e.append(n),this.ctx=n.getContext("2d"),n.height=parseFloat(t.height||r(e,"height")),n.width=parseFloat(t.width||r(e,"width")),n.style.height=n.height+"px",n.style.width=n.width+"px",this.canvas=n}initState(t){this.lineMap={},this.PIXOFFSET=.5}init(t){this.initContext(t),this.initState(t)}}a.prototype.drawLine=function(t){const e=this.ctx;var n;t=(n=t)instanceof l?n:Array.isArray(n)?new l({points:n}):new l(n),console.log(t,"line");const i=t.style.lineWidth%2==1?this.PIXOFFSET:0;console.log(i,"PIXOFFSET"),t.isRestore&&e.restore(),t.style&&function(t,e){if(t&&e)for(let n in e)o.indexOf(n)>-1&&(t[n]=e[n])}(e,t.style),t&&t.points&&Array.isArray(t.points[0])&&t.points.forEach,t.needCache&&!this.lineMap.hasOwnProperty(t.name)&&(this.lineMap[t.name]=t)},window.dChart=function(t){return console.count("ss"),new a(t)}}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xpbmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RDaGFydC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvZHJhdy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsiaW5zdGFsbGVkTW9kdWxlcyIsIl9fd2VicGFja19yZXF1aXJlX18iLCJtb2R1bGVJZCIsImV4cG9ydHMiLCJtb2R1bGUiLCJpIiwibCIsIm1vZHVsZXMiLCJjYWxsIiwibSIsImMiLCJkIiwibmFtZSIsImdldHRlciIsIm8iLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImVudW1lcmFibGUiLCJnZXQiLCJyIiwiU3ltYm9sIiwidG9TdHJpbmdUYWciLCJ2YWx1ZSIsInQiLCJtb2RlIiwiX19lc01vZHVsZSIsIm5zIiwiY3JlYXRlIiwia2V5IiwiYmluZCIsIm4iLCJvYmplY3QiLCJwcm9wZXJ0eSIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwicCIsInMiLCJxdWVyeSIsImVsIiwiZG9jdW1lbnQiLCJxdWVyeVNlbGVjdG9yIiwibm9kZVR5cGUiLCJtc2ciLCJjb25zb2xlIiwid2FybiIsImNyZWF0ZUVsZW1lbnQiLCJTVFlMRSIsImdldENzcyIsImRvbSIsInB0eSIsImN1cnJlbnRTdHlsZSIsIndpbmRvdyIsImdldENvbXB1dGVkU3R5bGUiLCJfbGluZUlEIiwiTGluZSIsIltvYmplY3QgT2JqZWN0XSIsIm9wdGlvbiIsInRoaXMiLCJwb2ludHMiLCJzdHlsZSIsImxpbmVXaWR0aCIsInN0cm9rZVN0eWxlIiwibmVlZENhY2hlIiwiZENoYXJ0X0RyYXdpbmdCb2FyZCIsImluaXQiLCJjb250YWluZXIiLCJjYW52YXMiLCJhcHBlbmQiLCJjdHgiLCJnZXRDb250ZXh0IiwiaGVpZ2h0IiwicGFyc2VGbG9hdCIsIndpZHRoIiwibGluZU1hcCIsIlBJWE9GRlNFVCIsImluaXRDb250ZXh0IiwiaW5pdFN0YXRlIiwiZHJhd0xpbmUiLCJsaW5lIiwiQXJyYXkiLCJpc0FycmF5IiwibG9nIiwiaXNSZXN0b3JlIiwicmVzdG9yZSIsImluZGV4T2YiLCJyZXNldFN0eWxlIiwiZm9yRWFjaCIsImRDaGFydCIsImNvdW50Il0sIm1hcHBpbmdzIjoiYUFDQSxJQUFBQSxFQUFBLEdBR0EsU0FBQUMsRUFBQUMsR0FHQSxHQUFBRixFQUFBRSxHQUNBLE9BQUFGLEVBQUFFLEdBQUFDLFFBR0EsSUFBQUMsRUFBQUosRUFBQUUsR0FBQSxDQUNBRyxFQUFBSCxFQUNBSSxHQUFBLEVBQ0FILFFBQUEsSUFVQSxPQU5BSSxFQUFBTCxHQUFBTSxLQUFBSixFQUFBRCxRQUFBQyxJQUFBRCxRQUFBRixHQUdBRyxFQUFBRSxHQUFBLEVBR0FGLEVBQUFELFFBS0FGLEVBQUFRLEVBQUFGLEVBR0FOLEVBQUFTLEVBQUFWLEVBR0FDLEVBQUFVLEVBQUEsU0FBQVIsRUFBQVMsRUFBQUMsR0FDQVosRUFBQWEsRUFBQVgsRUFBQVMsSUFDQUcsT0FBQUMsZUFBQWIsRUFBQVMsRUFBQSxDQUEwQ0ssWUFBQSxFQUFBQyxJQUFBTCxLQUsxQ1osRUFBQWtCLEVBQUEsU0FBQWhCLEdBQ0Esb0JBQUFpQixlQUFBQyxhQUNBTixPQUFBQyxlQUFBYixFQUFBaUIsT0FBQUMsWUFBQSxDQUF3REMsTUFBQSxXQUV4RFAsT0FBQUMsZUFBQWIsRUFBQSxjQUFpRG1CLE9BQUEsS0FRakRyQixFQUFBc0IsRUFBQSxTQUFBRCxFQUFBRSxHQUVBLEdBREEsRUFBQUEsSUFBQUYsRUFBQXJCLEVBQUFxQixJQUNBLEVBQUFFLEVBQUEsT0FBQUYsRUFDQSxLQUFBRSxHQUFBLGlCQUFBRixRQUFBRyxXQUFBLE9BQUFILEVBQ0EsSUFBQUksRUFBQVgsT0FBQVksT0FBQSxNQUdBLEdBRkExQixFQUFBa0IsRUFBQU8sR0FDQVgsT0FBQUMsZUFBQVUsRUFBQSxXQUF5Q1QsWUFBQSxFQUFBSyxVQUN6QyxF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QixZQUFBTCxLQUFBZ0IsUUFBQXZDLGVBQUE0QyxFQUFBbEUsUUFDQTZDLEtBQUFnQixRQUFBSyxFQUFBbEUsTUFBQWtFLElDakJBM0IsT0FBQW9DLE9GZ0NPLFNBQWUvQixHQUV0QixPQURBYixRQUFBNkMsTUFBQSxNQUNBLElBQWF6QixFQUFZUCIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMCk7XG4iLCJleHBvcnQgZnVuY3Rpb24gcXVlcnkoZWwpIHtcclxuICBpZiAodHlwZW9mIGVsID09PSAnc3RyaW5nJykge1xyXG4gICAgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGVsKVxyXG4gIH1cclxuICBpZiAoZWwgJiYgZWwubm9kZVR5cGUgPT09IDEpIHtcclxuICAgIHJldHVybiBlbFxyXG4gIH1cclxuICB3YXJuKGBxdWVyeSBmaWxlZCBbJHtlbH1dYClcclxuICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcclxufVxyXG5cclxuY29uc3QgU1RZTEUgPSBbJ2ZpbGxTdHlsZScsICdzdHJva2VTdHlsZScsICdzaGFkb3dDb2xvcicsICdzaGFkb3dCbHVyJywgJ3NoYWRvd09mZnNldFgnLFxyXG4nc2hhZG93T2Zmc2V0WScsICdsaW5lQ2FwJywgJ2xpbmVKb2luJywgJ2xpbmVXaWR0aCcsICdtaXRlckxpbWl0JywgJ2ZvbnQnLCAndGV4dEFsaWduJywgJ3RleHRCYXNlbGluZScsIF1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZXNldFN0eWxlKGN0eCwgc3R5bGUpIHtcclxuICBpZiAoIWN0eCB8fCAhc3R5bGUpIHJldHVyblxyXG4gIGZvciAobGV0IHByb3BlcnR5IGluIHN0eWxlKSB7XHJcbiAgICBpZiAoU1RZTEUuaW5kZXhPZihwcm9wZXJ0eSkgPiAtMSkge1xyXG4gICAgICBjdHhbcHJvcGVydHldID0gc3R5bGVbcHJvcGVydHldXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q3NzKGRvbSwgcHR5KSB7XHJcbiAgaWYgKGRvbS5jdXJyZW50U3R5bGUpIHtcclxuICAgIHJldHVybiBkb20uY3VycmVudFN0eWxlW3B0eV1cclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGRvbSwgbnVsbClbcHR5XVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gd2Fybihtc2cpIHtcclxuICBjb25zb2xlLndhcm4oYFtkQ2hhcnRdOiAke21zZ31gKVxyXG59XHJcbiIsImxldCBfbGluZUlEID0gMFxyXG5cclxuY2xhc3MgTGluZSB7XHJcbiAgY29uc3RydWN0b3Iob3B0aW9uKSB7XHJcbiAgICB0aGlzLnBvaW50cyA9IG9wdGlvbi5wb2ludHMgfHwgW11cclxuICAgIHRoaXMuc3R5bGUgPSBvcHRpb24uc3R5bGUgfHwge2xpbmVXaWR0aDogMSwgc3Ryb2tlU3R5bGU6ICcjMDAwJ31cclxuICAgIHRoaXMubmVlZENhY2hlID0gb3B0aW9uLm5lZWRDYWNoZSB8fCBmYWxzZVxyXG4gICAgdGhpcy5uYW1lID0gb3B0aW9uLm5hbWUgfHwgYGxpbmVpZCR7X2xpbmVJRCsrfWBcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVMaW5lKG9wdGlvbikge1xyXG4gIGlmIChvcHRpb24gaW5zdGFuY2VvZiBMaW5lKSByZXR1cm4gb3B0aW9uXHJcbiAgaWYgKEFycmF5LmlzQXJyYXkob3B0aW9uKSkgcmV0dXJuIG5ldyBMaW5lKHtwb2ludHM6IG9wdGlvbn0pXHJcbiAgcmV0dXJuIG5ldyBMaW5lKG9wdGlvbilcclxufVxyXG4iLCJpbXBvcnQge3F1ZXJ5LCBnZXRDc3N9IGZyb20gJy4vdXRpbCc7XHJcbmltcG9ydCB7aW5pdERyYXd9IGZyb20gJy4vZHJhdy5qcydcclxuXHJcbmNsYXNzIERyYXdpbmdCb2FyZCB7XHJcbiAgY29uc3RydWN0b3Iob3B0aW9uKSB7XHJcbiAgICB0aGlzLmluaXQob3B0aW9uKVxyXG4gIH1cclxuICBpbml0Q29udGV4dChvcHRpb24pIHtcclxuICAgIGNvbnN0IGNvbnRhaW5lciA9IHRoaXMuY29udGFpbmVyID0gcXVlcnkob3B0aW9uLmVsKTtcclxuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG5cclxuICAgIGNvbnRhaW5lci5hcHBlbmQoY2FudmFzKTtcclxuICAgIHRoaXMuY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJylcclxuXHJcbiAgICBjYW52YXMuaGVpZ2h0ID0gcGFyc2VGbG9hdChvcHRpb24uaGVpZ2h0IHx8IGdldENzcyhjb250YWluZXIsICdoZWlnaHQnKSk7XHJcbiAgICBjYW52YXMud2lkdGggPSBwYXJzZUZsb2F0KG9wdGlvbi53aWR0aCB8fCBnZXRDc3MoY29udGFpbmVyLCAnd2lkdGgnKSk7XHJcbiAgICBjYW52YXMuc3R5bGUuaGVpZ2h0ID0gY2FudmFzLmhlaWdodCArICdweCc7XHJcbiAgICBjYW52YXMuc3R5bGUud2lkdGggPSBjYW52YXMud2lkdGggKyAncHgnO1xyXG4gICAgdGhpcy5jYW52YXMgPSBjYW52YXNcclxuICB9XHJcbiAgaW5pdFN0YXRlKG9wdGlvbikge1xyXG4gICAgLy8g5Yid5aeL5YyW6YWN572uXHJcbiAgICB0aGlzLmxpbmVNYXAgPSB7fVxyXG4gICAgdGhpcy5QSVhPRkZTRVQgPSAwLjVcclxuICB9XHJcbiAgaW5pdChvcHRpb24pIHtcclxuICAgIHRoaXMuaW5pdENvbnRleHQob3B0aW9uKVxyXG4gICAgdGhpcy5pbml0U3RhdGUob3B0aW9uKVxyXG4gIH1cclxufVxyXG5cclxuaW5pdERyYXcoRHJhd2luZ0JvYXJkKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkQ2hhcnQob3B0aW9uKSB7XHJcbiAgY29uc29sZS5jb3VudCgnc3MnKVxyXG4gIHJldHVybiBuZXcgRHJhd2luZ0JvYXJkKG9wdGlvbilcclxufSIsImltcG9ydCB7cmVzZXRTdHlsZX0gZnJvbSAnLi91dGlsLmpzJ1xyXG5pbXBvcnQge2NyZWF0ZUxpbmV9IGZyb20gJy4vbGluZS5qcydcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpbml0RHJhdyhkQ2hhcnQpIHtcclxuICBkQ2hhcnQucHJvdG90eXBlLmRyYXdMaW5lID0gZnVuY3Rpb24obGluZSkge1xyXG4gICAgY29uc3QgY3R4ID0gdGhpcy5jdHhcclxuICAgIGxpbmUgPSBjcmVhdGVMaW5lKGxpbmUpXHJcbiAgICBjb25zb2xlLmxvZyhsaW5lLCAnbGluZScpXHJcbiAgICBjb25zdCBQSVhPRkZTRVQgPSBsaW5lLnN0eWxlLmxpbmVXaWR0aCAlIDIgPT09IDEgPyB0aGlzLlBJWE9GRlNFVCA6IDBcclxuICAgIGNvbnNvbGUubG9nKFBJWE9GRlNFVCwgJ1BJWE9GRlNFVCcpXHJcbiAgICBpZiAobGluZS5pc1Jlc3RvcmUpIGN0eC5yZXN0b3JlKClcclxuICAgIGlmIChsaW5lLnN0eWxlKSByZXNldFN0eWxlKGN0eCwgbGluZS5zdHlsZSlcclxuICAgIGlmIChsaW5lICYmIGxpbmUucG9pbnRzKSB7XHJcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KGxpbmUucG9pbnRzWzBdKSkge1xyXG4gICAgICAgIGxpbmUucG9pbnRzLmZvckVhY2hcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKGxpbmUubmVlZENhY2hlICYmICF0aGlzLmxpbmVNYXAuaGFzT3duUHJvcGVydHkobGluZS5uYW1lKSkge1xyXG4gICAgICB0aGlzLmxpbmVNYXBbbGluZS5uYW1lXSA9IGxpbmVcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRyYXdMaW5lKGN0eCwgcG9pbnRzLCBQSVhPRkZTRVQsIG5lZWRTdHJva2UpIHtcclxuICBjb25zdCBzdGFydFBvaW50ID0gcG9pbnRzWzBdXHJcbiAgY3R4LmJlZ2luUGF0aCgpXHJcbiAgY3R4Lm1vdmVUbyhzdGFydFBvaW50LnggKyBQSVhPRkZTRVQsIHN0YXJ0UG9pbnQueSArIFBJWE9GRlNFVClcclxuICBwb2ludHMuZm9yRWFjaCgocG9pbnQpID0+IHtcclxuICAgIGN0eC5saW5lVG8ocG9pbnQueCArIFBJWE9GRlNFVCwgcG9pbnQueSArIFBJWE9GRlNFVClcclxuICB9KVxyXG4gIGlmIChuZWVkU3Ryb2tlKSBjdHguc3Ryb2tlKClcclxufSIsImltcG9ydCB7ZENoYXJ0fSBmcm9tICcuL2RDaGFydC5qcydcclxud2luZG93LmRDaGFydCA9IGRDaGFydCJdLCJzb3VyY2VSb290IjoiIn0=