(function () {
    'use strict';

    var pvwidgetModule = angular.module('pvWidgets', []);
    pvwidgetModule.factory('TimeSeriesDataModel', ['$interval', 'datacontext', 'WidgetDataModel', 'common' , function ($interval, datacontext, WidgetDataModel, common) {

        function TimeSeriesDataModel() {

        }

        TimeSeriesDataModel.prototype = Object.create(WidgetDataModel.prototype);
        TimeSeriesDataModel.prototype.constructor = WidgetDataModel;
        var dc = datacontext;
        TimeSeriesDataModel.prototype.module;
        TimeSeriesDataModel.prototype.metric;
        // var coinFlow = GameEconomy.coinFlow();

        // console.log("playchart scope: %o", scope);
        //coinFlow.makeCall(attrs).then(coinFlow.success, coinFlow.fail);

        angular.extend(TimeSeriesDataModel.prototype, {
            setup: function(widget, scope){
                WidgetDataModel.prototype.setup.apply(this, arguments);
                scope.ts.modelOptions = scope.modelOptions = widget.dataModelOptions;
                if(!scope.modelOptions){
                    var config = scope.config();
                    console.log(config);
                    this.module = dc[config.dataModelOptions.module.name](scope);
                    this.metric = this.module[config.dataModelOptions.metricName]();                    
                    return;
                }
                this.module = dc[scope.modelOptions.module.name](scope);
                this.metric = module[scope.modelOptions.metricName]();
            },
            init: function () {
                var WC = new common.widgetControl();
                var options = this.dataModelOptions;
                this.widgetId = (options && options.widgetId != null) ? options.widgetId : WC.generateId();
                options.widgetId = this.widgetId;
                this.getData(options, metric);
                this.updateScope(options);
                // console.log("module init: %o", scope.vm);
            },
            getData: function(options, success, fail){
                if(!options.ajaxParams && options.dataModelOptions){
                    options = options.dataModelOptions;
                }
                var successFn = (success) ? success : this.metric.successTimeSeries;
                var failFn = (fail) ? fail : this.metric.fail;
                
                var params = {
                    game: options.ajaxParams.game,
                    region: options.ajaxParams.region.id,
                    interval: options.ajaxParams.interval.id,
                    start: options.ajaxParams.start,
                    end: options.ajaxParams.end,
                    chartType: options.ajaxParams.chartType.id
                }
                return this.metric.process(params).then(successFn, failFn);                
            },
            startInterval: function (timeoutMs) {
                $interval.cancel(this.intervalPromise);

                this.intervalPromise = $interval(function () {
                    this.getData(options, metric);
                    this.updateScope(value);
                }.bind(this), timeoutMs);
            },

            destroy: function () {
                WidgetDataModel.prototype.destroy.call(this);
                $interval.cancel(this.intervalPromise);
            }
        });



        return TimeSeriesDataModel;
    }]);
    pvwidgetModule.factory('DataTableDataModel', function ($interval, datacontext, WidgetDataModel) {

        function DataTableDataModel() {
        }

        DataTableDataModel.prototype = Object.create(WidgetDataModel.prototype);
        DataTableDataModel.prototype.constructor = WidgetDataModel;

        angular.extend(DataTableDataModel.prototype, {
            init: function () {
                console.log("in DATATABLE INTI!!!!")
                var dataModelOptions = this.dataModelOptions;
                //this.limit = (dataModelOptions && dataModelOptions.limit) ? dataModelOptions.limit : 100;

                // this.updateScope('-');
                // this.startInterval();
            },

            startInterval: function () {
                $interval.cancel(this.intervalPromise);

                this.intervalPromise = $interval(function () {
                    var value = Math.floor(Math.random() * this.limit);
                    this.updateScope(value);
                }.bind(this), 500);
            },

            updateLimit: function (limit) {
                this.dataModelOptions = this.dataModelOptions ? this.dataModelOptions : {};
                this.dataModelOptions.limit = limit;
                this.limit = limit;
            },

            destroy: function () {
                WidgetDataModel.prototype.destroy.call(this);
                $interval.cancel(this.intervalPromise);
            }
        });

        return DataTableDataModel;
    });
    pvwidgetModule.factory('EditHtmlDataModel', function ($interval, datacontext, common, WidgetDataModel) {

        function EditHtmlDataModel() {
        }

        EditHtmlDataModel.prototype = Object.create(WidgetDataModel.prototype);
        EditHtmlDataModel.prototype.constructor = WidgetDataModel;
        var WC = new common.widgetControl();
        var w;
        angular.extend(EditHtmlDataModel.prototype, {
            setup: function(widget, scope){
                w = widget;
                WidgetDataModel.prototype.setup.apply(this, arguments);
                var options = widget.dataModelOptions;
                this.widgetId = (options && options.widgetId != null) ? options.widgetId : WC.generateId();
                options.widgetId = this.widgetId;
                scope.vm.widgetId = this.widgetId;
                this.updateScope(options.widgetId);

                // console.log("")

                common.$on('GetDataModelData', function(e, data){
                    common.$broadcast('EditHtml', {
                        w:w,
                        o:options
                    })
                })
            },
            init: function () {
                // console.log("IN EDIT HTML INTIT!!!!!1 %o", this);
                var dataModelOptions = this.dataModelOptions;
                // this.limit = (dataModelOptions && dataModelOptions.limit) ? dataModelOptions.limit : 100;

                // this.updateScope(widgetId);
                // this.startInterval();
            },

            startInterval: function () {
                $interval.cancel(this.intervalPromise);

                this.intervalPromise = $interval(function () {
                    var value = Math.floor(Math.random() * this.limit);
                    this.updateScope(value);
                }.bind(this), 500);
            },

            updateLimit: function (limit) {
                this.dataModelOptions = this.dataModelOptions ? this.dataModelOptions : {};
                this.dataModelOptions.limit = limit;
                this.limit = limit;
            },

            destroy: function () {
                var options = w.dataModelOptions;
                $interval.cancel(this.intervalPromise);
                localStorage.removeItem(options.widgetId);
                WidgetDataModel.prototype.destroy.call(this);
            }
        });

        return EditHtmlDataModel;
    });
    pvwidgetModule.factory('DataModelController', ['TimeSeriesDataModel', 'DataTableDataModel', 'EditHtmlDataModel', function (ts, dt, eh) {
        return {
            TimeSeriesModel: ts,
            DataTableModel: dt,
            EditHtmlModel: eh
        }
    }])
    pvwidgetModule.factory('pvwidgetOptionsModalConfig', function () {
         return {
            TimeSeriesOptions: {
                    templateUrl: 'app/common/widget/timeseries/ChartOptionsModal.html',
                    controller: 'TimeSeriesModalCtrl as widgetOptions', // defined elsewhere,
                    animation: true,
                    keyboard: true
                },
            DataTableOptions: {
                    templateUrl: 'app/common/widget/datatable/ChartOptionsModal.html',
                    controller: 'DatatableModalCtrl', // defined elsewhere,
                    animation: true,
                    keyboard: true
                },
            EditHtmlOptions: {
                    templateUrl: 'app/common/widget/editHtml/ChartOptionsModal.html',
                    controller: 'EditHtmlModalCtrl as widgetOptions', // defined elsewhere,
                    animation: true,
                    keyboard: true
                }
         }
    });
    pvwidgetModule.factory('pvwidgetDefinitions', ['DataModelController','pvwidgetOptionsModalConfig','common','datacontext', function (dmc, opt, common, datacontext) {

        var generator = new common.widgetControl();
        var modules = generator.getModules(datacontext);
        var metrics = modules[0].methods;
        var intervals = common.OptionsEnums.TimeInterval;
        var regions = common.OptionsEnums.AWSRegions;
        var chartTypes = common.OptionsEnums.ChartTypes;
        var ChartTitle = 'Premium Credit Inflow / Outflow';
        var Units = 'Credits';
        var onLoadCallback = function(){}
        var toolTipFormatter = function () {
                        var s = '<b>' + moment.utc(this.x).format("MM/DD/YYYY") + '</b>',
                            sum = 0;
                        $.each(this.points, function (i, point) {
                            s += '<br/>' + point.series.name + ': <b>' +
                                Math.abs(point.y) + ' credits</b>';
                            sum += point.y;
                        });

                        //s += '<br/><b>Sum: ' + sum + ' users</b>'

                        return s;
                    };
        return [
          {
              name: 'TimeSeries',
              directive: 'playchart',
              title: 'Premium Credit Inflow/Outflow',
              dataModelType: dmc.TimeSeriesModel,
              dataModelOptions: {
                refresh: false,
                refreshRate: intervals[0],
                moduleArray: modules,
                metricArray: metrics,
                chartTypeArray:chartTypes,
                regionArray: regions,
                intervalArray: intervals,
                module: modules[0],
                metricName: modules[0].methods[0],
                chartOptions: {
                    chart: {
                        type: chartTypes[4].type,
                        events: {
                            load: onLoadCallback
                        }
                    },
                    yAxis: {
                        title: {
                            text: Units
                            }
                    },
                    tooltip: {
                        formatter: toolTipFormatter,
                    },
                    title: {
                        text: ChartTitle
                    },
                },
                datepickerOptions: {
                    maxDate: moment.utc(),
                    minDate: false,
                    startOpened : false,
                    endOpened: false,
                    format: common.dateFormats[0],
                    dateOptions: {
                        formatYear: 'yy',
                        startingDay: 1,
                        showWeeks: false
                    }
                },
                timepickerOptions: {
                    isMeridian: false
                },
                ajaxParams: {
                    game: 'DD2',
                    region: regions[0],
                    interval: intervals[1],
                    start: moment.utc().subtract(14, 'days').toJSON(),
                    end: moment.utc().toJSON(),
                    chartType: chartTypes[4]
                }
              },
              settingsModalOptions: opt.TimeSeriesOptions,
              onSettingsClose: function(result, widget, dashboardScope) {
                // do something to update widgetModel, like the default implementation:
                // console.log("result: %o", dashboardScope);
                // widget.dataModelOptions = result.widget;
                jQuery.extend(true, widget, result);
                dashboardScope.saveDashboard();
                console.log("widget: %o", widget);
                //scope has been updated *should have been*
               //make ajax call or dont and only set refresh rate

              },
              onSettingsDismiss: function(reasonForDismissal, dashboardScope) {
                // probably do nothing here, since the user pressed cancel
              }
          },
          {
              name: 'DataTable',
              directive: 'playtable',
              dataModelType: dmc.DataTableModel,
              dataModelOptions: {
                widgetId: null,
                controllerId: null,
                seriesId: null
              },
              settingsModalOptions: opt.DataTableOptions,
              onSettingsClose: function(result, widget, dashboardScope) {
                // do something to update widgetModel, like the default implementation:
                // widget.title = result.dataModel.widgetTitle;
                // console.log
                jQuery.extend(true, widget, result);
              },
              onSettingsDismiss: function(reason, scope) {
                // probably do nothing here, since the user pressed cancel
              }
          },
          {
              name: 'Html',
              directive: 'html-edit',
              dataModelType: dmc.EditHtmlModel,
              dataModelOptions: {
                widgetId: null,
                controllerId: null,
                seriesId: null
              },
              settingsModalOptions: opt.EditHtmlOptions,
              onSettingsClose: function(result, widget, dashboardScope) {
                // do something to update widgetModel, like the default implementation:
                // console.log("poop");
                jQuery.extend(true, widget, result);
              },
              onSettingsDismiss: function(reasonForDismissal, dashboardScope) {
                // probably do nothing here, since the user pressed cancel
                // console.log("working");
              }
          }
        ];
    }]);
    pvwidgetModule.value('defaultWidgets', [
    { name: 'DataTable' },
    { name: 'TimeSeries' },
    { name: 'Html' }
    ]);

    pvwidgetModule.factory('widgetinterface', ['pvwidgetDefinitions', 'pvwidgetOptionsModalConfig', 'defaultWidgets',function (definitions, ModalConfig, defaultWidgets) {

        var getWidgetDefinitionsFN = function (definition) {
            if (definition) {
                return [/*return the definition*/]
            }
            return definitions;
        }

        var getConfigFN = function (definition) {
            if (definition) {
                return [/*return the config*/]
            }
            return ModalConfig;
        }        

        return {
            getWidgetDefinitions: getWidgetDefinitionsFN,
            defaultWidgets: defaultWidgets,
            getConfig: getConfigFN
        }
    }]);

    
})();



