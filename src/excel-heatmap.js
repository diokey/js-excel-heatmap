(function (that, environment) { 
    'use strict';

    var ExcelHeatMap = (function () {
   
        /*
         * private variables and functions
         */

        var tableData, //holds the table data. Each cell value should be only numbers, if not we will consider that value as null

        // hold the library default options
        defaultOptions = {
        
        }, 

        // colors pattern
        defaultColors = {
        
        }
        ;
        
        /*
         * Common DOM utily
         * To avoid external library depedency, i avoided jquery,
         * so i need to write some DOM utils for cross browser compatibly
         */
        var DomUtils = {
        
        };

        /*
         * Common Utils
         */
        var Utils = {
            computeColor : function (argument) {
                
            } 
        };

        /*
         * Public Api to expose to the user
         */

        var renderHtml = function () {
            return 'Coming soon'; 
        };

        return {
            render : renderHtml
        };
    }());

    environment.ExcelHeatMap = environment.ExcelHeatMap || ExcelHeatMap;

})(this,window,undefined);
