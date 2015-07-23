//cb function is a function that executes after the ajax call has completed
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

function Response(data, meta, status){
    this.data = data;
    this.meta = meta;
    this.status = status;
}
Response.prototype = {
    data: [],
    meta: {},
    status: {}
}
function PlaytricsRequest(requestParams){ 
    
    if(requestParams.game && typeof requestParams.game === 'string'){
        this.game = requestParams.game;                
    }
    if(requestParams.region && (typeof requestParams.region === 'string' || typeof requestParams.region === 'Number')){
        this.region = requestParams.region.id;
    }
    if(requestParams.interval && (typeof requestParams.interval === 'string' || typeof requestParams.interval === 'Number')){
        this.interval = requestParams.interval.id;                
    }
    if(requestParams.start && typeof requestParams.start === 'string'){
        this.start = requestParams.start;                
    }
    else if(requestParams.start && requestParams.start instanceof Date || requestParams.start instanceof Moment){
        this.start = moment(requestParams.start).toJSON();                
    }
    if(requestParams.end && typeof requestParams.end === 'string'){
        this.end = requestParams.end;                
    }
    else if(requestParams.end && requestParams.end instanceof Date || requestParams.start instanceof Moment){
        this.end = moment(requestParams.end).toJSON();                
    }
              
} 
PlaytricsRequest.prototype = {
    game: "all",
    region: 0,
    interval: 15,
    start: moment.utc().subtract(7, 'days').toJSON(),
    end: moment.utc().toJSON(),
    chartType: 0               
}   