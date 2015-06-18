(function () {
    'use strict';

    var serviceId = 'datacontext';
    angular.module('app').factory(serviceId, ['common', 'config', datacontext]);

    function datacontext(common, config) {
        // console.log("app config %o", config);
        var serviceEndpointUrl = config.appDataUrl;
        var $q = common.$q;
        var getLogFn = common.logger.getLogFn;
        var errorLog = getLogFn(serviceId, 'error');
        var service = {
            GameEconomy: GameEconomy,
            GameSessions: GameSessions,
            HostingInstances: HostingInstances,
            UserSessions: UserSessions
        };

        return service;

        //cb function is a function that executes after the ajax call has completed
        function Processor(moduleName, widgetName){
            var p = this;
            p.widgetName = widgetName;
            p.ModuleName = moduleName;
            p.makeServiceCall = function(attrs){
                console.log(attrs);
                if(attrs && typeof attrs.dataUrl != "string"){
                    throw new Error("No url in service call");
                    errorLog("No url in service call", attrs);                
                }

                var DataCallAttrs = {
                    moduleName: (attrs && attrs.moduleName) ? attrs.moduleName : null,
                    widgetName: (attrs &&  attrs.widgetName) ? attrs.widgetName : null,
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

                return p.getDataPromise(DataCallAttrs);
            }

            p.getDataPromise = function(DataCallAttrs) {
                var deferral = $q.defer();
                //

                // ("in GetData promise")
                var successFn = function (data) {
                    var eventArgs = {
                        moduleId: DataCallAttrs.moduleName,
                        controllerId: DataCallAttrs.controllerName,
                        widgetId: DataCallAttrs.widgetName
                    };
                    common.$broadcast(common.config.ajaxSuccess, eventArgs);

                    $.extend(data, eventArgs);
                    DataCallAttrs.ajaxCallback.apply(this, data);
                    
                    deferral.resolve(data);
                }
                // console.log("data url %o", DataCallAttrs.url);
                $.ajax({
                    url: DataCallAttrs.url,
                    crossDomain: true,
                    success: successFn
                })

                return $q.when(deferral.promise);
            }
            p.parseArgs = function(attrs){
                console.log("parseargs : %o", attrs);
                var requestString = "?";
                for(var property in attrs){
                    requestString = requestString + property + "=" + attrs[property] + "&";
                }
                 // console.log("requestString %s", requestString);
                 return requestString.substring(0, requestString.length - 1);
            }
            p.process = function(attrs){
                console.log("in ProcessRequest: %o", attrs);

                var args = (attrs) ? attrs : {}; 
                console.log(p);
                var urlAttrs = (attrs) ? p.parseArgs(attrs) : ""; 

                args.dataUrl = serviceEndpointUrl + "/" + p.ModuleName +"/" + p.widgetName + urlAttrs;
                args.moduleName = p.moduleName;
                args.widgetName = p.widgetName;
                console.log("process request: %o", p);
                return p.makeServiceCall(args);

            }
        }
        function GameEconomy(scope) {

            var moduleName = "Economy"
            var coinFlow = function () {
                var widgetName = "GetCoinFlowMacro";
                var processor = new Processor(moduleName, widgetName);
                console.log(processor);
                function onTimeSeriesSuccess(results) {
                    var CAT_PROCESS = false;
                        // console.log("in onTimeSeriesSuccess function: %o", results);
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
                                scope.vm.ChartConfig.series.push(SeriesFactory(flowData));
                                //console.log(flowData);
                            });
                            $.each(results.Outflows, function (idx, flowData) {
                                scope.vm.ChartConfig.series.push(SeriesFactory(flowData));
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
                    process: processor.process,
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

            return {
                coinFlow: coinFlow
            }
        };
        function UserSessions(scope) {
            var moduleName = "GameSessions";

            var privacyCompare = function () {
                var processor = new Processor(moduleName, widgetName);
                var widgetName = "PrivacyChartData"
                // var processor = new Processor(moduleName, widgetName);
                function onTimeSeriesSuccess(data){
                    console.log("huzzah!");
                }

                return {
                    process: processor.process,
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

            return {
                privacyCompare: privacyCompare
            }
        
        };
        function HostingInstances(scope) {
            var moduleName = "GameSessions";

            var privacyCompare = function () {
                var processor = new Processor(moduleName, widgetName);
                var widgetName = "PrivacyChartData"
                // var processor = new Processor(moduleName, widgetName);
                function onTimeSeriesSuccess(data){
                    console.log("huzzah!");
                }

                return {
                    process: processor.process,
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

            return {
                privacyCompare: privacyCompare
            }
        
        };
        function GameSessions(scope) {
            var moduleName = "GameSessions";

            var privacyCompare = function () {
                var processor = new Processor(moduleName, widgetName);
                var widgetName = "PrivacyChartData"
                // var processor = new Processor(moduleName, widgetName);
                function onTimeSeriesSuccess(data){
                    console.log("huzzah!");
                }

                return {
                    process: processor.process,
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

            return {
                privacyCompare: privacyCompare
            }
        
        };

    }

})();