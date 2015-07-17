﻿(function() {
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
                    yAxis: {
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
                    },
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

            function tsSuccess(results){

            }
            function tsFail(results){}   
            var dm = new config.dataModelType();         
            console.log("directives %o", dm.getData);
            dm.setup({},scope);
            console.log(dm);
            dm.getData(config, function(data){
                jQuery.extend(true, scope.ts.ChartConfig, config.chartOptions);
                console.log(data);
                scope.ts.ChartConfig.series.push(data[0]);              

            });                      
            
            //get the chart configuration 
            // ------------------------
            //if it's a widget there will be a chart config from the default options OR chart options set by the user
            //jQuery.extend(true,scope.chartConfig, scope.vm.widgetData.chartOptions);
            // console.log(coinFlow);
        }

 
    });

    app.directive('playtable', function (datacontext) {
        var directive = {
            restrict: 'A',
            controller: 'datatable as vm',
            templateUrl: "app/common/widget/datatable/playtable.html",
            link: link
        };
        return directive;
        function link(scope, element, attrs) { }

    });

    //need to update these, which were directly pasted over from playtrics
    app.directive('pvChartConfig', function () {
        return {
            controller: function ($scope) { }
        }
    });
    app.directive('todaytotals', function () {
        return {
            restrict: 'E',
            templateUrl: '/Retention/TodayTotals',
            replace: true,
            controller: 'TotalsController',
            link: function (scope, element, attrs) {
                console.log(scope);
                
            }
        };
    })

    app.directive('twoweekretention', function () {
        return {
            restrict: 'E',
            templateUrl: '/Retention/TwoWeekRetention',
            replace: true,
            controller: 'RetentionController as vm',
            link: function (scope, element, attrs) {
                console.log(scope);
            }
        };
    })

    app.directive('twoweekretentionaverages', function () {
        return {
            restrict: 'E',
            templateUrl: '/Template/SeriesChart',
            replace: true,
            controller: 'RetentionController as vm',
            link: function (scope, element, attrs) {
                console.log(scope);
            }
        };
    })

    app.directive('installslogins', function () {
        return {
            restrict: 'E',
            templateUrl: '/Template/SeriesChart',
            replace: true,
            controller: 'InstallsLoginsController as vm',
            link: function (scope, element, attrs) {
                console.log(scope);
            }
        };
    })


    app.directive('returnerstable', function () {
        return {
            restrict: 'E',
            templateUrl: '/Retention/ReturnersTable',
            replace: true,
            controller: 'ReturnersTableCtrl',
            link: function (scope, element, attrs) {
                console.log(scope);

            }
        };
    })
    app.directive('returnerschart', function () {
        return {
            restrict: 'E',
            templateUrl: '/Retention/ReturnersChart',
            replace: true,
            controller: 'ReturnersChartCtrl',
            link: function (scope, element, attrs) {
                console.log(scope);
            }
        };
    })    
})();