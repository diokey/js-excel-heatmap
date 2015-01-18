(function (that, environment) { 
    'use strict';

    var ExcelHeatMap = (function () {
   
        /*
         * private variables and functions
         */

        var tableData, //holds the table data. Each cell value should be only numbers, if not we will consider that value as null

        // hold the library default options
        defaultOptions = {};
        
        /*
         * Common Utils
         */
        var Utils = {
            extend : function (options) {
                defaultOptions.max = options.max || defaultOptions.max;
                defaultOptions.min = options.min || defaultOptions.min;
                defaultOptions.defaultTextColor = options.defaultTextColor || defaultOptions.defaultTextColor;
                defaultOptions.NaNcolor = options.NaNcolor || defaultOptions.Nancolor;
                defaultOptions.defaultColors =  
                    (options.defaultColors && this.isArray(options.defaultColors))?
                    options.defaultColors : defaultOptions.defaultColors;

            },
            isArray : function (obj) {
                return Object.prototype.toString.call (obj) === '[object Array]'; 
            },
            findMaxMin : function (selector) {
                var cells = document.querySelectorAll(selector);
                var max = defaultOptions.max;
                var min = defaultOptions.min;
                for( var i=0, l=cells.length; i < l; i++ ) {
                   var val = this.getCellValue(cells[i].innerText);
                  
                   if( val !== null && val !== '' && !isNaN(val) ) {
                       max = this.getMax(max,val);
                       min = this.getMin(min,val);
                   }
                }
                defaultOptions.max = max;
                defaultOptions.min = min;

                return cells;
            },
            getCellValue : function (val) {
                if(this.isNumber(val)) {
                   return parseFloat(val); 
                }
                return '';
            },
            computeColor : function (percent) {
                if( percent === null && isNaN(percent) ) {
                    return defaultOptions.NaNcolor;
                }

                var colors = defaultOptions.defaultColors;
                var nColors = colors.length;

                var colorPosition = percent * (nColors - 1);

                var sIndex = Math.floor(colorPosition);
                sIndex = Math.min(nColors -2, sIndex);

                var start = colors[sIndex];
                var end = colors[sIndex+1];

                var hsvStart = this.rgb2hsv(this.hex2num(start));
                var hsvEnd = this.rgb2hsv(this.hex2num(end));

                var interiorPercent = (percent * (nColors - 1)) - sIndex;

                var hsvResult = this.transition3(interiorPercent, 1, hsvStart, hsvEnd);

                var dispRGB = this.hsv2rgb(hsvResult);

                var color = this.num2hex(dispRGB);

                return color;

            },
            getMax : function (a,b) {
                return Math.max(a,b); 
            },
            getMin : function (a,b) {
                return Math.min(a,b); 
            },
            isNumber : function (number) {
               return !isNaN(parseFloat(number)) && isFinite(number); 
            },
            hex2num : function (val) {
                if(val.charAt(0) === '#') {
                    val = val.slice(1); //remove the # character 
               }

               if (val.length !== 6) {
                    throw new Error('Exception color to be in format of "#FFFFFF"');
               }

               var rgb = [];

               for(var i=0; i < 6; i+=2) {
                   var part = val.charAt(i) + val.charAt(i+1);

                   rgb.push(parseInt(part,16));
               }

               return rgb;
            },
            num2hex : function (rgb) {
               var res = '#';
               for (var i= 0,l = rgb.length; i<l; i++) {
                    var hex = Math.round(rgb[i]).toString(16);
                    while (hex.length < 2) {
                        hex = '0' + hex;
                    }
                    res +=hex;
               }

               return res;
            },
            rgb2hsv : function( rgb ) {
                var r, g, b;
                r = rgb[0];
                g = rgb[1];
                b = rgb[2];

                r = r/255;
                g = g/255;
                b = b/255;

                var max = Math.max(r,g,b);
                var min = Math.min(r,g,b);

                var h,s,v = max;

                var diff = max - min;
                s = (max === 0) ? 0 : diff / max;
                if (max === min) {
                    h = 0;
                } else {
                    switch (max) {
                        case r : h = (g - b) / diff + (g < b ? 6 : 0);
                        break;
                        case g : h = (b - r) / diff + 2; 
                        break;
                        case h : h = (r - g) / diff + 4;
                        break;
                    }
                    h = h / 6;
                }
                h = Math.max(0,Math.min(h,1));
                s = Math.max(0,Math.min(s,1));
                v = Math.max(0,Math.min(v,1));

                return [h,s,v];

            },
            hsv2rgb : function ( hsv ) {
                var h = hsv[0];
                var s = hsv[1];
                var v = hsv[2];

                var r,g,b;

                var i = Math.floor(h * 6);
                var f = h * 6 - i;
                var p = v * (1 - s);
                var q = v * (1 - f * s);
                var t = v * (1 - (1 - f) * s);

                switch (i % 6) {
                    case 0 : r = v; g = t; b = p;
                    break;
                    case 1 : r = q; g = v; b = p;
                    break;
                    case 2 : r = p; g = v; b = t;
                    break;
                    case 3 : r = p; g = q; b = v;
                    break;
                    case 4 : r = t; g = p; b = v;
                    break;
                    case 5 : r = v; g = p; b = q;
                    break;
                }

                r = (Math.min(r,1)) * 255;
                g = (Math.min(g,1)) * 255;
                b = (Math.min(b,1)) * 255;

                return [r,g,b];


            },
            transition : function(value, max, start, end) {
                return start + (end - start) * value / max;
            },
            transition3 : function (val, max, start, end) {
                //handle situation where grey scale colors have red hue
                if (start[1] === 0) { start[0] = end[0]; }
                if (end[1] === 0) { end[0] = start[0]; }

                //handle black saturation issue
                if (start[2] === 0) { start[1] = end[1]; }
                if (end[2] === 0) { end[1] = start[1]; }

                var p = val / max;
                //hue has to wrap correctly around zero
                
                var distCCW = (start[0] >= end[0]) ? start[0] - end[0] : 1 + start[0] - end[0];
                var distCW = (start[0] >= end[0]) ? 1 + end[0] - start[0] : end[0] - start[0];

                var hue = (distCW <= distCCW) ? start[0] + (distCW * p) : start[0] - (distCCW * p);
                if(hue<0) { hue += 1; }

                var saturation = this.transition(val,max,start[1],end[1]);

                var value = this.transition(val, max, start[1], end[1]);

                return [hue, saturation, value];
            }
        };

        /*
         * Public Api to expose to the user
         */

        var init = function (id, data, func) {
            
            defaultOptions = {
                max : 0,
                min : 0,
                // colors pattern
                defaultColors : [      
                    '#63BE7B',
                    '#FBE983',
                    '#F8696B',
                    '#ffff00'
                ],
                defaultTextColor : '#FFFFFF',
                NaNcolor : '#808080' //grey color
            };

            if (data) {
                Utils.extend(data);
            }

            tableData = Utils.findMaxMin(id);


            if (!tableData) {
                throw new Error('Error : Couldn\'t find the specified id');
            }

            return this;
        }, 
        
        renderHtml = function () {
           
            var range = defaultOptions.max - defaultOptions.min;
            for( var i = 0, l = tableData.length; i < l; i++ ) {
                var val = Utils.getCellValue(tableData[i].innerText); 
                var color = defaultOptions.NaNcolor;
                if ( val !== undefined && val !== '' && !isNaN(val) && range !== 0 ) {

                   var adj = val - defaultOptions.min;

                   var percent = ( 1.0 * adj ) / range;

                   color = Utils.computeColor(percent);

                }

                tableData[i].style.backgroundColor = color;
                tableData[i].style.color = defaultOptions.defaultTextColor;
                
            }
        };

        return {
            init : init,
            render : renderHtml
        };
    }());

    environment.ExcelHeatMap = environment.ExcelHeatMap || ExcelHeatMap;

})(this,window,undefined);
