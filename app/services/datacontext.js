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
            GameSessions: GameSessions,
            GameEconomy: GameEconomy
        };

        return service;

        //cb function is a function that executes after the ajax call has completed
        function makeServiceCall(attrs){
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

            return getDataPromise(DataCallAttrs);
        }
        
        function getDataPromise(DataCallAttrs) {
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

        function parseArgs(attrs){
            console.log("parseargs : %o", attrs);
            var requestString = "?";
            for(var property in attrs){
                requestString = requestString + property + "=" + attrs[property] + "&";
            }
             // console.log("requestString %s", requestString);
             return requestString.substring(0, requestString.length - 1);
        }


        function GameSessions() {
            var moduleName = "GameSessions";

            var privacyCompare = function (attrs) {
                var widgetName = "PrivacyCompare"
                var dataUrl = 'http://stagingmetrics.playverse.com/Game/PrivacyChartData?game=DD2&region=USEast_NorthVirg&interval=15&start=2015-06-09T04:00:00.000Z&end=2015-06-09T19:38:55.639Z'

                var DataCallAttrs = {
                    moduleName: (moduleName) ? moduleName :  null,
                    widgetName: (widgetName) ? widgetName : null,
                    controllerName: (attrs && attrs.controllerId) ? attrs.controllerId : null,
                    url: dataUrl,
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

                return getDataPromise(DataCallAttrs);
            }


            return {
                privacyCompare: privacyCompare
            }
        
        };

        function GameEconomy(scope) {
            var moduleName = "Economy";

            var coinFlow = function () {

                function ProcessRequest(attrs){

                    console.log("in ProcessRequest: %o", attrs);
                    var widgetName = "GetCoinFlowMacro";
                    var args = (attrs) ? attrs : {}; 
                    var urlAttrs = (attrs) ? parseArgs(attrs) : ""; 

                    args.dataUrl = serviceEndpointUrl + "/" + moduleName +"/" + widgetName + urlAttrs;
                    args.moduleName = moduleName;
                    args.widgetName = widgetName;
                    // args.callback = function(data){
                    //     console.log("in" + moduleName + " : " + widgetName);
                    //     if(attrs.callback && attrs.callback.isExecuted != true)
                    //         attrs.callback.isExecuted = false;
                    //         attrs.callback.apply(this, data);
                    //         attrs.callback.isExecuted = true;
                    // }
                    return makeServiceCall(args);
                }

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

                return {
                    makeCall: ProcessRequest,
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
        }
    }

})();