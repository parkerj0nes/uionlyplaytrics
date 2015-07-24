
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
                function onDataTableSuccess(R){
                    scope.dt.isRefresh = true;
                    scope.dt.datarefreshRate = 1000 * 60 * 60 * 12;
                    scope.dt.toggleRefresh = function (val) {
                        if (!val) {
                            clearInterval(vm.dataRefreshInterval);
                            $(".timerstatus").html("<span style='color: red;'>Data Refresh off</span>");
                            setTimeout(function () {
                                $(".timerstatus").html("");
                            }, 5 * 1000)
                            return;
                        }
                        scope.dt.dataRefreshInterval = setInterval(scope.dt.reloadData, scope.dt.datarefreshRate);
                        $(".timerstatus").html("<span style='color: green;'>Table will refresh every {0} hours</span>".format(scope.dt.datarefreshRate / (1000* 60 * 60)));
                        setTimeout(function () {
                            $(".timerstatus").html("");
                        }, 5 * 1000)
                    }
                    scope.dt.reloadData = function () {
                        console.log("wat");
                        var resetPaging = true;
                        dtRetentionArray = [];
                        scope.dt.dtInstance.reloadData(callback, resetPaging);
                    };
                    console.log(R.data);
                    var columns = [];
                        var dtRow = {
                            RecordDate: "",
                            installs: "",
                            day1: "-",
                            day2: "-",
                            day3: "-",
                            day4: "-",
                            day5: "-",
                            day6: "-",
                            day7: "-",
                            day8: "-",
                            day9: "-",
                            day10: "-",
                            day11: "-",
                            day12: "-",
                            day13: "-",
                            day14: "-",
                        };
                        for(var property in dtRow){
                            var colObj = {};
                            colObj.title = property.toUpperCase();
                            colObj.data = property;
                            colObj.class = "center";
                            columns.push(colObj);
                        }           
                        $('#' + scope.dt.tableInfo.id).dataTable( {
                            "data": R.data,
                            "columns": columns
                        } );   
                      
                    scope.dt.dataRefreshInterval = setInterval(scope.dt.reloadData, scope.dt.datarefreshRate);


           

                    function mainRetentionPromise() {
                        var deferred = $q.defer();
                        var Rows;
                        dm.getData(config).then(function (Response) {
                            var res = Response.data;
                            console.log("OMG THE DATA %o", res);
                            Rows = [];
                            Rows = getDays(res);
                            var percents = {};
                            $.each(Rows, function (idx, el) {
                                var dtRow = {
                                    RecordDate: el.date,
                                    installs: el.newUsers,
                                    logins: el.logins,
                                    day1: "-",
                                    day2: "-",
                                    day3: "-",
                                    day4: "-",
                                    day5: "-",
                                    day6: "-",
                                    day7: "-",
                                    day8: "-",
                                    day9: "-",
                                    day10: "-",
                                    day11: "-",
                                    day12: "-",
                                    day13: "-",
                                    day14: "-",
                                };

                                $.each(el.twoWeeks, function (idx, perc) {
                                    dtRow["day" + (idx + 1).toString()] = perc;
                                    if (perc != "N/A" || "-") {
                                        perc.replace("%", "");
                                        //console.log(perc);
                                        if (!percents["day" + (idx + 1).toString()]) {
                                            percents["day" + (idx + 1).toString()] = 0
                                        }
                                        perc = parseInt(perc);
                                        percents["day" + (idx + 1).toString()] = parseInt(perc);
                                        percents["day" + (idx + 1).toString()] = ((percents["day" + (idx + 1).toString()] + perc) / Rows.length);
                                    }

                                });
                                //console.log(percents);
                                dtRetentionArray.push(dtRow);
                            });
                            console.log("DT array: %o ", dtRetentionArray);
                            Response.data = dtRetentionArray
                            deferred.resolve(Response);
                            //$("#two-week-retention").trigger("RetentionProcessed");

                        });                
                        return deferred.promise;
                    }
                }

                function onTimeSeriesSuccess(data){
                    console.log("huzzah!");
                }

                return {
                    process: processor,
                    successTimeSeries: onTimeSeriesSuccess,
                    successDataTable: onDataTableSuccess,
                    fail: function(data){
                        errorLog("call failed", {
                            module: moduleName,
                            metric: widgetName
                        })
                    }
                }
            }
            
            var RetentionAverageTimeseries = function(){

                moduleName = "Retention";
                var widgetName = "ReportAverage";
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

            var ReturnerTimeSeries = function(){
                moduleName = "Retention";
                var widgetName = "ReturnersSeries";
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
            var ReturnersDataTable = function(){
                moduleName = "Retention";
                var widgetName = "ReturnersDataTable";
                var processor = new Processor(moduleName, widgetName);
                // var processor = new Processor(moduleName, widgetName);
                function onDataTableSuccess(data){
                    console.log("huzzah! %o", data);
                    scope.dt.data = data;
                }

                function onTimeSeriesSuccess(data){
                    console.log("huzzah!");
                }

                return {
                    process: processor,
                    successTimeSeries: onTimeSeriesSuccess,
                    successDataTable: onDataTableSuccess,
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
                    usersOnlineByRegion: usersByRegion,
                    RetentionAverageTimeseries: RetentionAverageTimeseries,
                    ReturnerTimeSeries : ReturnerTimeSeries
                };
            }
            function DTMethods(){
                return {
                    RetentionReport:RetentionReport,
                    ReturnersDataTable : ReturnersDataTable
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
        var coolResponse = new Response(data, eventArgs, {
            status: status,
            response: xhr.status
        });
        console.log(coolResponse)
        DataCallAttrs.ajaxCallback.apply(this, coolResponse);

        deferral.resolve(coolResponse);
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

        if(attrs[property] !== null && typeof attrs[property] === 'function'){
            continue;
        }
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

