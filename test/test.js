/*
 * Test Excel heatmap library
 * Test uses Jasmine.js
 */

(function () {
   //test goes here
    "use strict";
   describe('ExcelHeatMap', function() {
       
       it('Should expose ExcelHeatMap Object', function() {
           expect(window.ExcelHeatMap).toBeDefined();
           var ExcelHeatMap = window.ExcelHeatMap;
           expect(ExcelHeatMap.render()).toEqual('Coming soon');
       });
   });
}());
