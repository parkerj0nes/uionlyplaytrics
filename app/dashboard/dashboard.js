(function () {
    'use strict';
    var controllerId = 'dashboard';
    angular.module('app')
.constant('Enums', {
    AWSRegions: [
        { id: 0, name: 'All', friendly: 'All Regions' },
        { id: 1, name: 'USEast_NorthVirg', friendly: 'US East (Northern Virginia)' },
        { id: 2, name: 'USWest_NorthCali', friendly: 'US West (Northern California)' },
        { id: 3, name: 'USWest_Oregon', friendly: 'US West (Oregon)' },
        { id: 4, name: 'EU_Ireland', friendly: 'EU (Ireland)' },
        { id: 5, name: 'AsiaPac_Singapore', friendly: 'Asia Pacific (Singapore)' },
        { id: 6, name: 'AsiaPac_Sydney', friendly: 'Asia Pacific (Sydney)' },
        { id: 7, name: 'AsiaPac_Tokyo', friendly: 'Asia Pacific (Tokyo)' },
        { id: 8, name: 'SouthAmer_SaoPaulo', friendly: 'South America (Sao Paulo)' }
    ],
    TimeInterval: [
//        { id: 0, interval: 3, friendly: '3 Minute' },
        { id: 1, interval: 5, friendly: '5 Minute' },
//        { id: 2, interval: 10, friendly: '10 Minute' },
        { id: 3, interval: 15, friendly: '15 Minute' },
        { id: 4, interval: 30, friendly: '30 Minute' },
        { id: 5, interval: 60, friendly: '1 hour' },
//        { id: 6, interval: 180, friendly: '6 hour' },
        { id: 7, interval: 360, friendly: '6 hour' },
        { id: 8, interval: 720, friendly: '12 Hours' },
        { id: 9, interval: 1440, friendly: 'Day' }
//        { id: 10, interval: 10080, friendly: 'Week' },
//        { id: 11, interval: 99999, friendly: 'Month' },
//        { id: 12, interval: 999999, friendly: 'Quarter Year' },
//        { id: 13, interval: 9999999, friendly: 'Bi-annual' },
//        { id: 14, interval: 99999999, friendly: 'year' }
    ],
    ChartTypes: [
        { id: 0, type: 'line', friendly: 'Line' },
        { id: 1, type: 'spline', friendly: 'Spline' },
        { id: 2, type: 'area', friendly: 'Area' },
        { id: 3, type: 'areaspline', friendly: 'Areaspline' },
        { id: 4, type: 'column', friendly: 'Column' },
        { id: 5, type: 'bar', friendly: 'Bar' },
        { id: 6, type: 'pie', friendly: 'Pie' }
//        { id: 7, type: 'scatter', friendly: 'Scatter' },
//        { id: 8, type: 'polar', friendly: 'Polar' },
//        { id: 9, type: 'range', friendly: 'Range' }
    ]

}).factory('CSVconverter', [function () {
        var factory = {};

        var checkEntryForTimestamp = function (timestamp) {
            var valid = (new Date(timestamp)).getTime() > 0;

            return valid;
        }
        Number.prototype.padLeft = function (base, chr) {
            var len = (String(base || 10).length - String(this).length) + 1;
            return len > 0 ? new Array(len).join(chr || '0') + this : this;
        }
        function JSDateToExcelDate(inDate) {

            var d = inDate;
            dformat = [(d.getMonth() + 1).padLeft(),
                d.getDate().padLeft(),
                d.getFullYear()].join('-') +
                ' ' +
              [d.getHours().padLeft(),
                d.getMinutes().padLeft(),
                d.getSeconds().padLeft()].join(':');

            return dformat;
        }

        var parse = function (item) {
            //var dateFomat = 'yyyy-MM-ddTHH:mm:ssZ';
            var getLogLength = function(n){
                if (n == 0) return 1; // because Math.log(0) is undefined
                if (n < 0) n = -n; // because Math.log() doesn't work for negative numbers

                return Math.floor((Math.log10(n))); // log base 10 will return the natural log value common to the number at least for base 10 values, 12 for datetimestamps.  hell yeah
            }

            if (getLogLength(parseInt(item)) < 12 || getLogLength(parseInt(item)) == 'NaN') return item;

            if (checkEntryForTimestamp(item) == true) {
                var date;
                date = new Date(item);
                item = JSDateToExcelDate(date);
                //console.log(item);
            }

            return item;
        }

        factory.ConvertToCSV = function (objArray) {

            //only implement isArray if no native implementation is available
            if (typeof Array.isArray === 'undefined') {
                Array.isArray = function(obj) {
                    return Object.prototype.toString.call(obj) === '[object Array]';
                }
            };

            var array = (objArray != 'undefined' && typeof objArray != 'object') ? JSON.parse(objArray) : objArray;

            var seperator = ",";
            var delimiter = "";
            var str = '';
            var firstLine = '"Series"' + seperator + '"Datetime"'+ seperator + '"Value"' + delimiter + "\n";
            str += firstLine;

            //looking for stupid unix timestamps and turning them back into human readable date time format
            //maybe this is gay and stupid
            for (var i = 0; i < array.length; i++) {
                var seriesName = array[i]["name"];

                for (var x = 0; x < array[i]["data"].length; x++) {
                    var points = array[i]["data"][x];

                    var pointDate = parse(points[0]);
                    var pointValue = points[1];

                    var line = '"' + seriesName + '"' + seperator + '"' + pointDate + '"' + seperator + '"' + pointValue + '"' + "\n";

                    str += line;
                }
            }

            return str;
        }

        return factory;

    }]).controller("ModalCtrl", ['$scope', 'CSVconverter', function ($scope, converter) {
        //datepicker controls

        $scope.refresh = false;
        $scope.pointInterval = 24 * 3600 * 1000;
        $scope.formats = ['yyyy-MM-ddTHH:mm:ssZ', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];

        var today = new Date(Date.parse($scope.formats[1]));
        $scope.format = $scope.formats[0];

        var from = new Date();
        from.setHours(0, 0, 0, 0);

        $scope.$parent.start = from;
        $scope.$parent.end = new Date();



        $scope.today = function (datepickerClass) {
            if (datepickerClass == null || datepickerClass == 'undefined') return today;

            if (datepickerClass == "start-date") {
                $scope.$parent.start = today;
            }
            if (datepickerClass == "end-date") {
                $scope.$parent.end = today;
            }
        };


        $scope.maxDate = $scope.today();
        $scope.clear = function () {
            $scope.$parent.start = clear;
            $scope.$parent.end = clear;
        };

        //Disable dates after today
        $scope.disabled = function (date, mode) {
            return (mode === 'day' && (date > new Date()));
            //return false;
        };

        $scope.toggleMin = function () {
            $scope.minDate = null; //$scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $.each($event.currentTarget.classList, function (idx, el) {
                if (this == "start-date") {
                    //console.log("start clicked");
                    $scope.startOpened = true;
                }
                if (this == "end-date") {
                    //console.log("end clicked");
                    $scope.endOpened = true;
                }
            });

        };

        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        $scope.$parent.openModal = function () {
            $scope.showModal = true;
        };
        $scope.$parent.okModal = function () {

            //$scope.series = [];
            //$scope.ChartConfig.series = $scope.series;
            //$scope.showModal = false;



            var eventArgs = {
                start:  $scope.start.toJSON(),
                end: $scope.end.toJSON(),
                interval: $scope.selectedInterval.interval,
                region: $scope.selectedRegion.id,
                chart: $scope.selectedChartType.type,
                refresh: $scope.refresh,
                updateInterval: ($scope.refresh) ? ($scope.refresh) : null
            }

            //console.log(eventArgs);
            $scope.$emit("PlaytricsChartUpdate", eventArgs);

        };

        $scope.$parent.cancelModal = function () {
            $scope.showModal = false;
        };

        var csv = converter.ConvertToCSV;

        $scope.isDLdisabled = true;
        $scope.downloadCSV = function () {
            //console.log($scope.$parent);
            var results = csv(JSON.stringify($scope.$parent.ChartConfig.series));

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
            $scope.isDLdisabled = false;
        });
    

  }]).controller(controllerId, ['common', 'datacontext','widgetinterface', dashboard])

    function dashboard(common, datacontext, widgetinterface) {
        var vm = this;
        vm.title = 'dashboard';

        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);


        vm.dashboardOptionsTest = {
            widgetButtons: false,
            widgetDefinitions: widgetinterface.getWidgetDefinitions(),
            settingsModalOptions: widgetinterface.getModalOptions("TimeSeriesOptions"),
            defaultWidgets: widgetinterface.defaultWidgets,
            storage: common.$window.localStorage,
            storageId: 'demo_simple'
        };
        vm.randomValue = Math.random();
        common.$interval(function () {
            vm.randomValue = Math.random();
        }, 500);

        activate();

        function activate() {
            common.activateController([getMessageCount()], controllerId)
                .then(function () { log('Activated dashboard View'); });
        }

        function getMessageCount() {
            console.log("getMessageCount");
            return datacontext.getMessageCount().then(function (data) {
                return vm.messageCount = data;
            });
        }

    }
})();