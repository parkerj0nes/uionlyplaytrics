Highcharts.setOptions({
    lang: {
        loading: "No data to display"
    }
});

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

if (!Number.prototype.commaSeparate) {
    Number.prototype.commaSeparate = function (val) {
        var val = this;
        while (/(\d+)(\d{3})/.test(val.toString())) {
            val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
        }
        return val;
    }
}
if (!Date.prototype.addDays) {
    Date.prototype.addDays = function (days) {
        var dat = new Date(this.valueOf());
        dat.setDate(dat.getDate() + days);
        return dat;
    }
}

(function () {
    'use strict';
    
    var app = angular.module('app', [
        // Angular modules 
        'ngAnimate',        // animations
        'ngRoute',          // routing
        'ngSanitize',       // sanitizes html bindings (ex: sidebar.js)
        'ui.sortable',
        'datatables',
        'highcharts-ng',
        // Custom modules 
        'common',           // common functions, logger, spinner
        'common.bootstrap', // bootstrap dialog wrapper functions
        // 3rd Party Modules
        'ui.bootstrap',      // ui-bootstrap (ex: carousel, pagination, dialog),
        'ui.bootstrap.modal',
        'ui.dashboard',
        'pvWidgets'
    ]);
    
    // Handle routing errors and success events
    app.run(['$route',  function ($route) {
            // Include $route to kick start the router.
        }]);        
})();