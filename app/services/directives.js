    var Day = function (date, newUsers, logins, percentArray) {
        var formatDate = function (datestring) {
            var splitDate = datestring.split(" ");
            return splitDate[0];
        }
        var formatPercents = function (percentArray) {
            // console.log(percentArray);
            var l = percentArray.length;
            for (var i = 0; i <= l; i++)
            {
                percentArray[i] = Math.floor(percentArray[i]);
                if (percentArray[i] == -1) {
                    percentArray[i] = '-';
                } else if (percentArray[i] == 0) {
                    percentArray[i] = "N/A"
                }
                else {
                    percentArray[i] = percentArray[i] + '%';
                }
            }
            //this is a big WTF fix this later
            percentArray.pop();
            return percentArray;
        }
        var ChartProcessedEvent = new CustomEvent(
            "RetentionProcessed",
            {
                detail: {
                    message: "Retention Chart Finished",
                    time: new Date(),
                },
                bubbles: true,
                cancelable: true
            }
        );

        this.date = formatDate(date); //(typeof date === "undefined") ? new Date() : formatDate(date);
        this.newUsers = (typeof newUsers === "undefined") ? 0 : newUsers;
        this.logins = (typeof logins === "undefined") ? 0 : logins;
        this.twoWeeks = (typeof percentArray === "undefined") ? [] : formatPercents(percentArray);
};

var getDays = function (res) {
    var DayArray = [];
    $.each(res, function (idx) {
        if(!this.date || this.date == "undefined"){
            console.log(this);
        }else{
            console.log(this);
        }
        var d = new Day(this.date, this.installsOnThisDay, this.loginsOnThisDay, this.days);

        DayArray.push(d);
    });

    return DayArray;
};

(function() {
    'use strict';

    var app = angular.module('app');

    app.directive('ccImgPerson', ['config', function (config) {
        //Usage:
        //<img data-cc-img-person="{{s.speaker.imageSource}}"/>
        var basePath = config.imageSettings.imageBasePath;
        var unknownImage = config.imageSettings.unknownPersonImageSource;
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$observe('ccImgPerson', function(value) {
                value = basePath + (value || unknownImage);
                attrs.$set('src', value);
            });
        }
    }]);


    app.directive('ccSidebar', function () {
        // Opens and clsoes the sidebar menu.
        // Usage:
        //  <div data-cc-sidebar>
        // Creates:
        //  <div data-cc-sidebar class="sidebar">
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            var $sidebarInner = element.find('.sidebar-inner');
            var $dropdownElement = element.find('.sidebar-dropdown a');
            element.addClass('sidebar');
            $dropdownElement.click(dropdown);

            function dropdown(e) {
                var dropClass = 'dropy';
                e.preventDefault();
                if (!$dropdownElement.hasClass(dropClass)) {
                    hideAllSidebars();
                    $sidebarInner.slideDown(350);
                    $dropdownElement.addClass(dropClass);
                } else if ($dropdownElement.hasClass(dropClass)) {
                    $dropdownElement.removeClass(dropClass);
                    $sidebarInner.slideUp(350);
                }

                function hideAllSidebars() {
                    $sidebarInner.slideUp(350);
                    $('.sidebar-dropdown a').removeClass(dropClass);
                }
            }
        }
    });


    app.directive('ccWidgetClose', function () {
        // Usage:
        // <a data-cc-widget-close></a>
        // Creates:
        // <a data-cc-widget-close="" href="#" class="wclose">
        //     <i class="fa fa-remove"></i>
        // </a>
        var directive = {
            link: link,
            template: '<i class="fa fa-remove"></i>',
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$set('href', '#');
            attrs.$set('wclose');
            element.click(close);

            function close(e) {
                e.preventDefault();
                element.parent().parent().parent().hide(100);
            }
        }
    });

    app.directive('ccWidgetMinimize', function () {
        // Usage:
        // <a data-cc-widget-minimize></a>
        // Creates:
        // <a data-cc-widget-minimize="" href="#"><i class="fa fa-chevron-up"></i></a>
        var directive = {
            link: link,
            template: '<i class="fa fa-chevron-up"></i>',
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            //$('body').on('click', '.widget .wminimize', minimize);
            attrs.$set('href', '#');
            attrs.$set('wminimize');
            element.click(minimize);

            function minimize(e) {
                e.preventDefault();
                var $wcontent = element.parent().parent().next('.widget-content');
                var iElement = element.children('i');
                if ($wcontent.is(':visible')) {
                    iElement.removeClass('fa fa-chevron-up');
                    iElement.addClass('fa fa-chevron-down');
                } else {
                    iElement.removeClass('fa fa-chevron-down');
                    iElement.addClass('fa fa-chevron-up');
                }
                $wcontent.toggle(500);
            }
        }
    });

    app.directive('ccScrollToTop', ['$window',
        // Usage:
        // <span data-cc-scroll-to-top></span>
        // Creates:
        // <span data-cc-scroll-to-top="" class="totop">
        //      <a href="#"><i class="fa fa-chevron-up"></i></a>
        // </span>
        function ($window) {
            var directive = {
                link: link,
                template: '<a href="#"><i class="fa fa-chevron-up"></i></a>',
                restrict: 'A'
            };
            return directive;

            function link(scope, element, attrs) {
                var $win = $($window);
                element.addClass('totop');
                $win.scroll(toggleIcon);

                element.find('a').click(function (e) {
                    e.preventDefault();
                    // Learning Point: $anchorScroll works, but no animation
                    //$anchorScroll();
                    $('body').animate({ scrollTop: 0 }, 500);
                });

                function toggleIcon() {
                    $win.scrollTop() > 300 ? element.slideDown(): element.slideUp();
                }
            }
        }
    ]);

    app.directive('ccSpinner', ['$window', function ($window) {
        // Description:
        //  Creates a new Spinner and sets its options
        // Usage:
        //  <div data-cc-spinner="vm.spinnerOptions"></div>
        var directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            scope.spinner = null;
            scope.$watch(attrs.ccSpinner, function (options) {
                if (scope.spinner) {
                    scope.spinner.stop();
                }
                scope.spinner = new $window.Spinner(options);
                scope.spinner.spin(element[0]);
            }, true);
        }
    }]);

    app.directive('ccWidgetHeader', function() {
        //Usage:
        //<div data-cc-widget-header title="vm.map.title"></div>
        var directive = {
            link: link,
            scope: {
                'title': '@',
                'subtitle': '@',
                'rightText': '@',
                'allowCollapse': '@'
            },
            templateUrl: 'app/layout/widgetheader.html',
            restrict: 'A',
        };
        return directive;

        function link(scope, element, attrs) {
            attrs.$set('class', 'widget-head');
        }
    });
    app.directive('modaloptions', function () {
        return {
            restrict: 'E',
            templateUrl: 'app/common/widget/timeseries/ChartOptionsModal.html',
            replace: true,
            scope: true,
            controller: 'ModalCtrl',
            link: function (scope, element, attrs) {

            }
        };
    });

    app.directive('playchart', function (datacontext) {

        var playScope = {
            source: "@",
            config: "&config"
        };

        var directive = {
            restrict: 'E',
            controller: 'timeseries as ts',
            templateUrl: "app/common/widget/timeseries/playchart.html",
            link: link,
            scope: playScope
        };

        return directive;

        function tsSuccess(results){

        }
        function tsFail(results){

        }   
        
        function link(scope, element, attrs) {
            // console.log("link function");
            var config = scope.config();

            console.log("playchart config: %o", config);

            scope.ts.ChartConfig = {
                options: {
                    loading: {
                        style: {
                            opacity: 1
                        }
                    },
                    chart: {
                        type: "column",
                        events: {
                            // load: ts.onLoadCallback
                        },
                        zoomType: 'x'
                    },
                    xAxis: {
                        type: 'datetime',
                        dateTimeLabelFormats: {
                            //day: '%e of %b'
                        }
                    },
                    yAxis: [{
                        title: {
                            // text: 'Credits'
                        },
                        stackLabels: {
                            enabled: false,
                            style: {
                                fontWeight: 'bold',
                                color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                            }
                        },
                        alternateGridColor: '#FDFFD5'
                    }],
                    tooltip: {
                        // formatter: function () {
                        //     var s = '<b>' + moment.utc(this.x).format("MM/DD/YYYY") + '</b>',
                        //         sum = 0;
                        //     $.each(this.points, function (i, point) {
                        //         s += '<br/>' + point.series.name + ': <b>' +
                        //             Math.abs(point.y) + ' credits</b>';
                        //         sum += point.y;
                        //     });

                        //     //s += '<br/><b>Sum: ' + sum + ' users</b>'

                        //     return s;
                        // },
                        // shared: true
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
                     text: config.title
                },
            }


            var dm = new config.dataModelType();         
            
            dm.setup({},scope);

            console.log(dm);
            dm.getData(config, function(Response){
                jQuery.extend(true, scope.ts.ChartConfig, config.chartOptions);
                console.log(Response.data);
                Response.data.forEach(function(datum){
                    if(typeof datum === 'object' && datum.data){
                        for(var prop in datum){
                            if(prop === 'yAxis'){
                                scope.ts.ChartConfig.options.yAxis.push({
                                    title: {
                                        text: datum.name
                                    },
                                    stackLabels: {
                                        enabled: false,
                                        style: {
                                            fontWeight: 'bold',
                                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                                        }
                                    },
                                    alternateGridColor: '#FDFFD5'
                                })
                            }
                        }
                        scope.ts.ChartConfig.series.push(datum);                        
                    }
                })
            });                      
            
            //get the chart configuration 
            // ------------------------
            //if it's a widget there will be a chart config from the default options OR chart options set by the user
            //jQuery.extend(true,scope.chartConfig, scope.vm.widgetData.chartOptions);
            // console.log(coinFlow);
        }

 
    });

    app.directive('playtable', function (datacontext, $q) {
        var playScope = {
            source: "@",
            config: "&config"
        };

        var directive = {
            restrict: 'E',
            controller: 'datatable as dt',
            templateUrl: "app/common/widget/datatable/playtable.html",
            link: link,
            scope: playScope
        };

        return directive;

        function link(scope, element, attrs) { 

            var config = scope.dt.config = scope.config();
            console.log("config I need %o", scope)                 
            scope.dt.tableInfo = {};
            scope.dt.tableInfo.id = config.tableId;        
            var dm = new config.dataModelType();         
            var dtRetentionArray = [];
            dm.setup({},scope);
            dm.init(config);

        }

    });

    //need to update these, which were directly pasted over from playtrics
    app.directive('pvChartConfig', function () {
        return {
            controller: function ($scope) { }
        }
    });   
})();