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
            var promises = [getMessageCount(), getPeople()];
            common.activateController(promises, controllerId)
                .then(function (data) {
                    log(data);
                    vm.datacontext = datacontext;
                });
        }

        function getMessageCount() {
            return datacontext.getMessageCount().then(function (data) {
                return vm.messageCount = data;
            });
        }

        function getPeople() {
            return datacontext.getPeople().then(function (data) {
                return vm.people = data;
            });
        }
    }
})();