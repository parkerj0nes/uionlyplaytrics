(function () {
    'use strict';
    var controllerId = 'timeseries';
    angular.module('app').controller(controllerId, ['common', 'datacontext', pvtimeseries]);

    function pvtimeseries(common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.widgetMeta = getWidgetMeta();
        vm.series = [];

        activate();
        vm.ChartConfig = {
            options: {
                loading: {
                    style: {
                        opacity: 1
                    }
                },
                chart: {
                    type: "column",
                    events: {
                        load: vm.onLoadCallback
                    },
                    zoomType: 'x'
                },
                xAxis: {
                    type: 'datetime',
                    dateTimeLabelFormats: {
                        //day: '%e of %b'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Credits'
                    },
                    stackLabels: {
                        enabled: false,
                        style: {
                            fontWeight: 'bold',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                        }
                    },
                    alternateGridColor: '#FDFFD5'
                },
                tooltip: {
                    formatter: function () {
                        var s = '<b>' + moment.utc(this.x).format("MM/DD/YYYY") + '</b>',
                            sum = 0;
                        $.each(this.points, function (i, point) {
                            s += '<br/>' + point.series.name + ': <b>' +
                                Math.abs(point.y) + ' credits</b>';
                            sum += point.y;
                        });

                        //s += '<br/><b>Sum: ' + sum + ' users</b>'

                        return s;
                    },
                    shared: true
                },
                plotOptions: {
                    area: {
                        stacking: 'normal',
                        lineColor: '#666666',
                        lineWidth: 1,
                        marker: {
                            lineWidth: 1,
                            lineColor: '#666666'
                        }
                    },
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: false,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                            style: {
                                textShadow: '0 0 3px black'
                            }
                        }
                    }
                }
            },

            series: [],
            title: {
                text: 'Premium Credit Inflow / Outflow'
            },
        }
        var onFailure = function (error) {
            console.log(error);
        }

        var onLoadCallback = function () {
            var refreshRate = 1000 * 60 * 60 * 24;

            $.each(vm.SessionTypeConfig.series, function (idx, el) {
                //$timeout(function () {
                //    series.data = $scope.dau.DD2;
                //}, refreshRate);

            });

        }

        var onSuccess = function (results) {
            for (var key in results.data.SeriesData) {
                //console.log(results.data.SeriesData[key]);
                var series = new Charts.Series(key, results.data.SeriesData[key], results.data.StartDate, vm.pointInterval);
                vm.series.push(series);
            };
            $rootScope.$broadcast('ChartSuccess', {
                data: vm.series
            });
        }
        function getWidgetMeta() {
            return {
                id: 123,
                seriesData:[],
                game: 'TimeSeries widget',
                module: 'This is a module string',
                series: 'TimeSeries name',
                description: 'Hot Towel Angular is a SPA template for Angular developers.'
            };
        }

        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function (data) {
                    // log(data);
                    vm.datacontext = datacontext;
                });
        }

    }
})();

(function () {
    'use strict';
    var controllerId = 'TimeSeriesModalCtrl';
    angular.module('app').controller(controllerId, ['$scope','$modalInstance', 'common', 'datacontext', 'EditHtmlDataModel', pvTimeSeriesModalCtrl]);

    function pvTimeSeriesModalCtrl($scope,$modalInstance, common, datacontext, datamodel) {
        var widgetOptions = this;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var wc = new common.widgetControl();
        var intervalMultiplier = (60 * 1000);


        widgetOptions.modules = GetModules(datacontext);
        widgetOptions.selectedModule = widgetOptions.modules[0];

        widgetOptions.metrics = widgetOptions.selectedModule.methods;
        widgetOptions.selectedMetric = widgetOptions.metrics[0];


        widgetOptions.title = "WE DID IT!";
        widgetOptions.refresh = false;
        widgetOptions.pointInterval = 24 * 3600 * 1000;
        widgetOptions.formats = ['yyyy-MM-ddTHH:mm:ssZ', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        widgetOptions.intervals = common.OptionsEnums.TimeInterval;
        widgetOptions.regions = common.OptionsEnums.AWSRegions;
        widgetOptions.chartTypes = common.OptionsEnums.ChartTypes;
//        widgetOptions.selectedInterval = widgetOptions.intervals[1];
        widgetOptions.UpdateInterval = widgetOptions.intervals[1];
        // widgetOptions.pointInterval = widgetOptions.selectedInterval * intervalMultiplier;
//        widgetOptions.selectedRegion = widgetOptions.regions[0];
//        widgetOptions.selectedChartType = ;

        widgetOptions.isMeridian = false;
        var today = new Date(Date.parse(widgetOptions.formats[1]));
        widgetOptions.format = widgetOptions.formats[0];

        var from = new Date();
        from.setHours();

        widgetOptions.start = from;
        widgetOptions.end = new Date();

        widgetOptions.chartParams = {
            game: 'DD2',
            region: widgetOptions.regions[0],
            interval: widgetOptions.intervals[1],
            start: (function(x){
                return x.setHours(0, 0, 0, 0);
            })(new Date()),
            end: new Date(),
            chartType: widgetOptions.chartTypes[5]

        };
        widgetOptions.dateOptions = {
            showWeeks: false
        }
        activate();
        function activate() {
            var promises = [];
            // checkEdits();
            common.activateController(promises, controllerId)
                .then(function (data) {
                    var store = wc.getWidgetMeta();
                    // console.log(widgetOptions.intervals);
                    // console.log("html modal options activated: %o", store);

                });
        }

        function GetModules(datacontext){
            var moduleNames = Object.getOwnPropertyNames(datacontext);
            console.log("datacontext getOwnPropertyNames: %o", moduleNames);
            var modules = [];
            for (var i = moduleNames.length - 1; i >= 0; i--) {
                var moduleName = moduleNames[i];
                console.log(moduleNames[i]);
                if(typeof datacontext[moduleNames[i]]){
                    var mod = datacontext[moduleNames[i]]();
                    // console.log(mod);
                    // console.log(Object.getOwnPropertyNames(mod));
                }
                var newModule = {
                    name: moduleNames[i],
                    methods: (function (x){
                        // console.log(x);
                        return x;
                    })(Object.getOwnPropertyNames(mod))
                };

                modules.push(newModule);
            }
            console.log("modules from datacontext: %o", modules);            
            return modules;
        }
        widgetOptions.setMetricState = function(module){
            // console.log(module);
            var mod = $.grep(widgetOptions.modules, function(m){
                // console.log("m: %o, module: %o", m, module);
                return (m.name === module.name);
            });
            // console.log(mod);
            widgetOptions.metrics = mod[0].methods;
        }

        widgetOptions.cancel = cancel;
        function cancel () {
            console.log("cancel");
        }

        var onLoadCallback = function () {


        }
        widgetOptions.ok = ok;
        function ok () {
            // console.log('calling ok from widget-specific settings controller!');
            widgetOptions.series = [];
            // widgetOptions.ChartConfig.series = widgetOptions.series;
            widgetOptions.showModal = false;



            var eventArgs = {
                start:  widgetOptions.start.toJSON(),
                end: widgetOptions.end.toJSON(),
                interval: widgetOptions.selectedInterval.interval,
                region: widgetOptions.selectedRegion.id,
                chart: widgetOptions.selectedChartType.type,
                refresh: widgetOptions.refresh,
                updateInterval: (widgetOptions.refresh) ? (widgetOptions.refresh) : null
            }

            //console.log(eventArgs);
            $scope.$emit("PlaytricsChartUpdate", eventArgs);
            $modalInstance.close(widgetOptions);
        }






        widgetOptions.today = function (datepickerClass) {
            if (datepickerClass == null || datepickerClass == 'undefined') return today;

            if (datepickerClass == "start-date") {
                $scope.$parent.start = today;
            }
            if (datepickerClass == "end-date") {
                $scope.$parent.end = today;
            }
        };


        widgetOptions.maxDate = widgetOptions.today();
        widgetOptions.clear = function () {
            $scope.$parent.start = clear;
            $scope.$parent.end = clear;
        };

         //Disable dates after today
        widgetOptions.disabled = function (date, mode) {
            return (mode === 'day' && (date > new Date()));
            //return false;
        };

        widgetOptions.toggleMin = function () {
            $scope.minDate = null; //$scope.minDate ? null : new Date();
        };
        widgetOptions.toggleMin();

        widgetOptions.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $.each($event.currentTarget.classList, function (idx, el) {
                if (this == "start-date") {
                    //console.log("start clicked");
                    widgetOptions.startOpened = true;
                }
                if (this == "end-date") {
                    //console.log("end clicked");
                    widgetOptions.endOpened = true;
                }
            });

        };

        widgetOptions.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.$parent.openModal = function () {
            $scope.showModal = true;
        };

        var csv = common.CSVconverter.ConvertToCSV;

        widgetOptions.isDLdisabled = true;
        widgetOptions.downloadCSV = function () {
            //console.log($scope.$parent);
            var results = csv(JSON.stringify('poop'));

            //console.log(results);

            var csvContent = "data:text/csv;charset=utf-8," + escape(results);
            var link = document.createElement("a");
            var d = new Date(),
            curr_date = d.getDate(),
            curr_month = d.getMonth() + 1,
            curr_year = d.getFullYear(),
            datestring = curr_date + "-" + curr_month + "-" + curr_year;

            link.setAttribute("href", csvContent);
            link.setAttribute("download", datestring + "-data.csv");

            link.click();
        }

        $scope.$on('ChartSuccess', function (event, args) {
            widgetOptions.isDLdisabled = false;
        });
        


    }
})();