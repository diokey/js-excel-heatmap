/*
 * Test Excel heatmap library
 * Test uses Jasmine.js
 */

(function () {
   //test goes here
    "use strict";
   describe('ExcelHeatMap', function() {
       
       it('Should should expose ExcepHeatMap', function() {
           expect(window.ExcelHeatMap).toBeDefined();

       });

       it('should have init method', function() {
          expect(ExcelHeatMap.init()).toBeDefined();
       });

       it('should have render method', function() {
           var table = ExcelHeatMap.init('#mytable td',{}); 
           console.log(table);
           expect(table.render).toBeDefined();
       });

        //add more test here

   });
}());
