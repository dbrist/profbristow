/*
* Print Element Plugin 1.1
*
* Copyright (c) 2010 Erik Zaadi
*
* Inspired by PrintArea (http://plugins.jquery.com/project/PrintArea) and
* http://stackoverflow.com/questions/472951/how-do-i-print-an-iframe-from-javascript-in-safari-chrome
*
*  jQuery plugin page : http://plugins.jquery.com/project/printElement 
*  Wiki : http://wiki.github.com/erikzaadi/jQueryPlugins/jqueryprintelement 
*  Home Page : http://erikzaadi.github.com/jQueryPlugins/jQuery.printElement 
*  
*  Thanks to David B (http://github.com/ungenio) and icgJohn (http://www.blogger.com/profile/11881116857076484100)
*  For their great contributions!
* 
* Dual licensed under the MIT and GPL licenses:
*   http://www.opensource.org/licenses/mit-license.php
*   http://www.gnu.org/licenses/gpl.html
*   
*   Note, Iframe Printing is not supported in Opera and Chrome 3.0, a popup window will be shown instead
*/
;(
function($){$.fn.printElement=function(options){var mainOptions=$.extend({},$.fn.printElement.defaults,options);if(mainOptions.printMode=='iframe'){if($.browser.opera||(/chrome/.test(navigator.userAgent.toLowerCase())))mainOptions.printMode='popup';}$("[id^='printElement_']").remove();return this.each(function(){var opts=$.meta?$.extend({},mainOptions,$this.data()):mainOptions;_printElement($(this),opts);});};$.fn.printElement.defaults={printMode:'iframe',pageTitle:'',overrideElementCSS:null,printBodyOptions:{styleToAdd:'padding:10px;margin:10px;',classNameToAdd:''},leaveOpen:false,iframeElementOptions:{styleToAdd:'border:none;position:absolute;width:0px;height:0px;bottom:0px;left:0px;',classNameToAdd:''}};$.fn.printElement.cssElement={href:'',media:''};function _printElement(element,opts){var html=_getMarkup(element,opts);var popupOrIframe=null;var documentToWriteTo=null;if(opts.printMode.toLowerCase()=='popup'){popupOrIframe=window.open('about:blank','printElementWindow','width=650,height=440,scrollbars=yes');documentToWriteTo=popupOrIframe.document;}else{var printElementID="printElement_"+(Math.round(Math.random()*99999)).toString();var iframe=document.createElement('IFRAME');$(iframe).attr({style:opts.iframeElementOptions.styleToAdd,id:printElementID,className:opts.iframeElementOptions.classNameToAdd,frameBorder:0,scrolling:'no',src:'about:blank'});document.body.appendChild(iframe);documentToWriteTo=(iframe.contentWindow||iframe.contentDocument);if(documentToWriteTo.document)documentToWriteTo=documentToWriteTo.document;iframe=document.frames?document.frames[printElementID]:document.getElementById(printElementID);popupOrIframe=iframe.contentWindow||iframe;}focus();documentToWriteTo.open();documentToWriteTo.write(html);documentToWriteTo.close();_callPrint(popupOrIframe);};function _callPrint(element){if(element&&element.printPage)element.printPage();else setTimeout(function(){_callPrint(element);},50);}function _getElementHTMLIncludingFormElements(element){var $element=$(element);$(":checked",$element).each(function(){this.setAttribute('checked','checked');});$("input[type='text']",$element).each(function(){this.setAttribute('value',$(this).val());});$("select",$element).each(function(){var $select=$(this);$("option",$select).each(function(){if($select.val()==$(this).val())this.setAttribute('selected','selected');});});$("textarea",$element).each(function(){var value=$(this).attr('value');if($.browser.mozilla)this.firstChild.textContent=value;else this.innerHTML=value;});var elementHtml=$('<div></div>').append($element.clone()).html();return elementHtml;}function _getBaseHref(){return window.location.protocol+"//"+window.location.hostname+(window.location.port?":"+window.location.port:"")+window.location.pathname;}function _getMarkup(element,opts){var $element=$(element);var elementHtml=_getElementHTMLIncludingFormElements(element);var html=new Array();html.push('<html><head><title>'+opts.pageTitle+'</title>');if(opts.overrideElementCSS){if(opts.overrideElementCSS.length>0){for(var x=0;x<opts.overrideElementCSS.length;x++){var current=opts.overrideElementCSS[x];if(typeof(current)=='string')html.push('<link type="text/css" rel="stylesheet" href="'+current+'" >');else html.push('<link type="text/css" rel="stylesheet" href="'+current.href+'" media="'+current.media+'" >');}}}else{$(document).find("link").filter(function(){return $(this).attr("rel").toLowerCase()=="stylesheet";}).each(function(){html.push('<link type="text/css" rel="stylesheet" href="'+$(this).attr("href")+'" media="'+$(this).attr('media')+'" >');});}html.push('<base href="'+_getBaseHref()+'" />');html.push('</head><body style="'+opts.printBodyOptions.styleToAdd+'" class="'+opts.printBodyOptions.classNameToAdd+'">');html.push('<div class="'+$element.attr('class')+'">'+elementHtml+'</div>');html.push('<script type="text/javascript">function printPage(){focus();print();'+((!$.browser.opera&&!opts.leaveOpen&&opts.printMode.toLowerCase()=='popup')?'close();':'')+'}</script>');html.push('</body></html>');return html.join('');};})(jQuery);