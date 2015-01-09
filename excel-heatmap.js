(function (that, environment) { 
    'use strict';

    var ExcelHeatMap = (function () {
   
        /*
         * private variables and functions
         */

        var tableData, //holds the table data. Each cell value should be only numbers, if not we will consider that value as null

        defaultOptions, // hold the library default options

        defaultColors
        ;

        /*
         * Public Api to expose to the user
         */

        var renderHtml = function () {
            console.log('Coming soon'); 
        };

        return {
            render : renderHtml
        };
    }());

    environment.ExcelHeatMap = environment.ExcelHeatMap || ExcelHeatMap;

})(this,window,undefined);
