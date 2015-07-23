
(function () {
    'use strict';
    var $q;
    var serviceId = 'datacontext';
    angular.module('app').factory(serviceId, ['common', 'config', datacontext]);
    
    function datacontext(common, config) {
        // console.log("app config %o", config);
        var serviceEndpointUrl = config.appDataUrl;
        $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var errorLog = getLogFn(serviceId, 'error');
        var service = {
            GameEconomy: GameEconomy,
            GameSessions: GameSessions,
            HostingInstances: HostingInstances,
            UserSessions: UserSessions
        };

        return service;
        

        function GameEconomy(scope, isDataTable) {

            var moduleName = "Economy"
            var coinFlow = function () {
                var widgetName = "GetCoinFlowMacro";
                var processor = new Processor(moduleName, widgetName);
                function onTimeSeriesSuccess(results) {
                    var CAT_PROCESS = false;
                    console.log("in onTimeSeriesSuccess function: %o", results);
                    var SeriesFactory = function (TimeSeries) {

                        if (TimeSeries.Type == "Purchase") {
                            var series = {
                                pointStart: TimeSeries.StartDate,
                                pointInterval: TimeSeries.interval, // one day
                                stack: 'aggregate',
                                name: "Outflow",
                                data: $.map(TimeSeries.coinData, function (x) {
                                    return -x;
                                })
                            };
                        } else if (TimeSeries.Type == "AddCredits") {
                            var series = {
                                pointStart: TimeSeries.StartDate,
                                pointInterval: TimeSeries.interval, // one day
                                stack: 'aggregate',
                                name: "Inflow",
                                data: TimeSeries.coinData
                            };
                        }

                        return series;
                    }

                    var processAggregates = function (results) {
                        var s = [];
                        console.log("in processing function: %o", results);
                        if ((results.hasOwnProperty("Inflows") && results.Inflows.length > 0) ||
                            (results.hasOwnProperty("Outflows") && results.Outflows.length > 0)) {
                            $.each(results.Inflows, function (idx, flowData) {
                                // console.log(SeriesFactory(flowData));
                                scope.ts.ChartConfig.series.push(SeriesFactory(flowData));
                                //console.log(flowData);
                            });
                            $.each(results.Outflows, function (idx, flowData) {
                                scope.ts.ChartConfig.series.push(SeriesFactory(flowData));
                                //console.log(flowData);
                            });
                        } else {
                            //$rootScope.$broadcast('NoData');
                            console.log("no data");
                        }
                    }
                    if (!CAT_PROCESS) {
                        processAggregates(results);
                    }
                    //console.log(results);
                }
                // console.log(ProcessEconomy);
                return {
                    process: processor,
                    successTimeSeries: onTimeSeriesSuccess,
                    successDataTable: function(data){
                        errorLog("No Data Table data Implemented", {
                            module: moduleName,
                            metric: widgetName
                        })                        
                    },
                    fail: function(data){
                        errorLog("call failed", {
                            module: moduleName,
                            metric: widgetName
                        })
                    }
                }
            }

            var AccessibleModule = {};
            
            function HighChartMethods(){
                return {
                    coinFlow: coinFlow
                };
            }
            function DTMethods(){
                return {
                    noTableMethods:"no table methods Implemented"
                };
            } 

            if(!isDataTable){
                AccessibleModule = HighChartMethods()
            } else{
                AccessibleModule = DTMethods()
            }
            return AccessibleModule;   
        };
        function UserSessions(scope, isDataTable) {
            var moduleName = "User";
            var privacyCompare = function () {
                var processor = new Processor(moduleName, widgetName);
                var widgetName = "PrivacyChartData"
                // var processor = new Processor(moduleName, widgetName);
                function onTimeSeriesSuccess(data){
                    console.log("huzzah!");
                }

                return {
                    process: processor,
                    successTimeSeries: onTimeSeriesSuccess,
                    successDataTable: function(data){
                        errorLog("No Data Table data Implemented", {
                            module: moduleName,
                            metric: widgetName
                        })                        
                    },
                    fail: function(data){
                        errorLog("call failed", {
                            module: moduleName,
                            metric: widgetName
                        })
                    }
                }
            }
            var installsDAU = function () {

                moduleName = "Retention";
                var widgetName = "installslogins";
                var processor = new Processor(moduleName, widgetName);
                // var processor = new Processor(moduleName, widgetName);
                function onTimeSeriesSuccess(data){
                    console.log("huzzah! %o", data);
                    scope.ts.ChartConfig.series = data.data;
                }

                return {
                    process: processor,
                    successTimeSeries: onTimeSeriesSuccess,
                    successDataTable: function(data){
                        errorLog("No Data Table data Implemented", {
                            module: moduleName,
                            metric: widgetName
                        })                        
                    },
                    fail: function(data){
                        errorLog("call failed", {
                            module: moduleName,
                            metric: widgetName
                        })
                    }
                }
            }            
            var usersByRegion = function () {
                var widgetName = "GetUsersByRegion";
                var processor = new Processor(moduleName, widgetName);
                // var processor = new Processor(moduleName, widgetName);
                function onTimeSeriesSuccess(data){
                    console.log("huzzah! %o", data);
                    scope.ts.ChartConfig.series = data.data;
                }

                return {
                    process: processor,
                    successTimeSeries: onTimeSeriesSuccess,
                    successDataTable: function(data){
                        errorLog("No Data Table data Implemented", {
                            module: moduleName,
                            metric: widgetName
                        })                        
                    },
                    fail: function(data){
                        errorLog("call failed", {
                            module: moduleName,
                            metric: widgetName
                        })
                    }
                }
            }   
            var currentOnline = function (game, region, interval, start, end) {
                
                var widgetName = "getCurrentOn"
                var processor = new Processor(moduleName, widgetName);
                function onTimeSeriesSuccess(data){
                    console.log("huzzah! %o", data);
                }

                return {
                    process: processor,
                    successTimeSeries: onTimeSeriesSuccess,
                    successDataTable: function(data){
                        errorLog("No Data Table data Implemented", {
                            module: moduleName,
                            metric: widgetName
                        })                        
                    },
                    fail: function(data){
                        errorLog("call failed", {
                            module: moduleName,
                            metric: widgetName
                        })
                    }
                }
            }
            var RetentionReport = function(){
                moduleName = "Retention";
                var widgetName = "Report";
                var deferred = $q.defer();                
                var dtRetentionArray = [];

                var processor = new Processor(moduleName, widgetName);
                function onTimeSeriesSuccess(data){
                    console.log("huzzah! %o", data);
                }

                return {
                    process: processor,
                    successTimeSeries: onTimeSeriesSuccess,
                    fail: function(data){
                        errorLog("call failed", {
                            module: moduleName,
                            metric: widgetName
                        })
                    }
                }
            }
            var AccessibleModule = {};
            function HighChartMethods(){
                return {
                    privacyCompare: privacyCompare,
                    dailyinstallslogins: installsDAU,
                    currentOnline: currentOnline,
                    usersOnlineByRegion: usersByRegion
                };
            }
            function DTMethods(){
                return {
                    RetentionReport:RetentionReport
                };
            }            
            if(!isDataTable){
                AccessibleModule = HighChartMethods()
            } else{
                AccessibleModule = DTMethods()
            }
            return AccessibleModule;        
        };
        function HostingInstances(scope, isDataTable) {
            var moduleName = "HostingInstances";

            var privacyCompare = function () {
                var processor = new Processor(moduleName, widgetName);
                var widgetName = "PrivacyChartData"
                // var processor = new Processor(moduleName, widgetName);
                function onTimeSeriesSuccess(data){
                    console.log("huzzah!");
                }

                return {
                    process: processor,
                    successTimeSeries: onTimeSeriesSuccess,
                    successDataTable: function(data){
                        errorLog("No Data Table data Implemented", {
                            module: moduleName,
                            metric: widgetName
                        })                        
                    },
                    fail: function(data){
                        errorLog("call failed", {
                            module: moduleName,
                            metric: widgetName
                        })
                    }
                }
            }

            var AccessibleModule = {};
            function HighChartMethods(){
                return {
                    noChartMethods:"no chart methods Implemented"
                };
            }
            function DTMethods(){
                return {
                    noTableMethods:"no table methods Implemented"
                };
            }            
            if(!isDataTable){
                AccessibleModule = HighChartMethods()
            } else{
                AccessibleModule = DTMethods()
            }
            return AccessibleModule;   
        
        };
        function GameSessions(scope, isDataTable) {
            var moduleName = "GameSessions";

            var privacyCompare = function () {
                var widgetName = "PrivacyChartData"
                var processor = new Processor(moduleName, widgetName);                
                // var processor = new Processor(moduleName, widgetName);
                function onTimeSeriesSuccess(data){
                    console.log("huzzah!");
                }

                return {
                    process: processor,
                    successTimeSeries: onTimeSeriesSuccess,
                    successDataTable: function(data){
                        errorLog("No Data Table data Implemented", {
                            module: moduleName,
                            metric: widgetName
                        })                        
                    },
                    fail: function(data){
                        errorLog("call failed", {
                            module: moduleName,
                            metric: widgetName
                        })
                    }
                }
            }

            var AccessibleModule = {};
            function HighChartMethods(){
                return {
                    noChartMethods:"no chart methods Implemented"
                };
            }
            function DTMethods(){
                return {
                    noTableMethods:"no table methods Implemented"
                };
            }            
            if(!isDataTable){
                AccessibleModule = HighChartMethods()
            } else{
                AccessibleModule = DTMethods()
            }
            return AccessibleModule;   
        
        };

    }
function Processor(moduleName, metricName){
    var p = this;
    p.widgetName = metricName;
    p.moduleName = moduleName;
    p.serviceUrl = "http://localmonitoring.playverse.com:7552";
}
   
Processor.prototype.makeServiceCall = function(attrs){
    if(attrs && typeof attrs.dataUrl != "string"){
        throw new Error("No url in service call");
        errorLog("No url in service call", attrs);                
    }

    var DataCallAttrs = {
        moduleName: this.moduleName ? this.moduleName : null,
        widgetName: this.moduleName ? this.moduleName : null,
        controllerName: (attrs && attrs.controllerId) ? attrs.controllerId : null,
        url: (attrs && attrs.dataUrl) ? attrs.dataUrl : null,
        ajaxCallback: function (data) {
            //console.log("ajax called here is the object %o", this);
            //I want your code inside me

            if (attrs && attrs.callback) {
                //this is where we're camming the passed in function that adds more stuff to this function
                attrs.callback.apply(this, arguments);
            }
        }
    }

    $.extend(DataCallAttrs, attrs);

    return this.getDataPromise(DataCallAttrs);
}

Processor.prototype.getDataPromise = function(DataCallAttrs) {
    var deferral = $q.defer();

    var eventArgs = {
        moduleId: DataCallAttrs.moduleName,
        controllerId: DataCallAttrs.controllerName,
        widgetId: DataCallAttrs.widgetName
    };

    var successFn = function (data, status, xhr) {
        //common.$broadcast(common.config.ajaxSuccess, eventArgs);
        DataCallAttrs.ajaxCallback.apply(this, data);
        deferral.resolve(new Response(data, eventArgs, {
            status: status,
            response: xhr.status
        }));
    }
    // console.log("data url %o", DataCallAttrs.url);
    $.ajax({
        url: DataCallAttrs.url,
        crossDomain: true,
        success: successFn
    })

    return $q.when(deferral.promise);
}

Processor.prototype.parseArgs = function(attrs){
    console.log("parseargs : %o", attrs);
    var requestString = "?";
    for(var property in attrs){

        if(attrs[property] !== null && typeof attrs[property] === 'object'){
            requestString = requestString + property + "=" + attrs[property].id + "&";                                            
        }else if(property !== null){
            requestString = requestString + property + "=" + attrs[property] + "&";    
        }
        
    }
     // console.log("requestString %s", requestString);
     return requestString.substring(0, requestString.length - 1);
}

Processor.prototype.process = function(request){
    console.log("in ProcessRequest: %o", this);
    var args = (request) ? request : {}; 
    var urlAttrs = (request) ? Processor.prototype.parseArgs(request) : ""; 
    this.urlAttrs = urlAttrs;
    this.dataUrl = args.dataUrl = this.serviceUrl + "/" + this.moduleName +"/" + this.widgetName + urlAttrs; 
    
    return this.makeServiceCall(args);

}
})();

