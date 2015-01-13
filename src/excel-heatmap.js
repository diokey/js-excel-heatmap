(function (that, environment) { 
    'use strict';

    var ExcelHeatMap = (function () {
   
        /*
         * private variables and functions
         */

        var tableData, //holds the table data. Each cell value should be only numbers, if not we will consider that value as null

        // hold the library default options
        defaultOptions = {
            max : 0,
            min : 0,
            // colors pattern
            defaultColors : [
                '#63BE7B',
                '#FBE983',
                '#F8696B'
            ],
            NaNcolor : '#808080' //grey color
        };
        
        /*
         * Common Utils
         */
        var Utils = {
            findMaxMin : function (tableId) {
                var cells = document.querySelectorAll('#'+tableId+' td');
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

                var s = colors[sIndex];
                var e = colors[sIndex+1];
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
            }
        };

        /*
         * Public Api to expose to the user
         */

        var init = function (id, data, func) {
            tableData = Utils.findMaxMin(id);
        }, 
        
        renderHtml = function () {
           
            var range = defaultOptions.max - defaultOptions.min;
            for( var i = 0, l = tableData.length; i < l; i++ ) {
                var val = Utils.getCellValue(tableData[i].innerText); 
                var color = defaultOptions.NaNcolor;
                if ( val !== undefined && val !== '' && !isNaN(val) && range !== 0 ) {

                   var adj = val - defaultOptions.min;

                   var percent = ( 1.0 * adj ) / range;

                   //color = Utils.computeColor(percent);

                   //console.log('value : '+val+' percent : '+percent);
                   //console.log('adj : '+adj+' range : '+range);
                }

                tableData[i].style.backgroundColor = color;
                
            }
        };

        return {
            init : init,
            render : renderHtml
        };
    }());

    environment.ExcelHeatMap = environment.ExcelHeatMap || ExcelHeatMap;

})(this,window,undefined);
