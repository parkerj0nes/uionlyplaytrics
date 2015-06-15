(function () {
    'use strict';

    var pvwidgetModule = angular.module('pvWidgets', []);
    pvwidgetModule.factory('TimeSeriesDataModel', ['$interval', 'datacontext', 'WidgetDataModel', 'common' , function ($interval, datacontext, WidgetDataModel, common) {

        function TimeSeriesDataModel() {

        }

        TimeSeriesDataModel.prototype = Object.create(WidgetDataModel.prototype);
        TimeSeriesDataModel.prototype.constructor = WidgetDataModel;

        angular.extend(TimeSeriesDataModel.prototype, {
            setup: function(widget, scope){
                WidgetDataModel.prototype.setup.apply(this, arguments);
                scope.widgetId = widget.dataModelOptions.widgetId;
            },
            init: function () {
                var WC = new common.widgetControl();
                var options = this.dataModelOptions;
                this.widgetId = (options && options.widgetId != null) ? options.widgetId : WC.generateId();
                options.widgetId = this.widgetId;
                this.updateScope(options.widgetId);
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
                common.$on('GetDataModelData', function(e, data){
                    common.$broadcast('EditHtml', {
                        w:w,
                        o:options
                    })
                })
            },
            init: function () {
                console.log("IN EDIT HTML INTIT!!!!!1 %o", this);
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
                    controller: 'TimeSeriesModalCtrl', // defined elsewhere,
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
    pvwidgetModule.factory('pvwidgetDefinitions', ['DataModelController','pvwidgetOptionsModalConfig','common', function (dmc, opt, common) {

         var generator = new common.widgetControl();
        return [
          {
              name: 'TimeSeries',
              directive: 'playchart',
              dataAttrName: 'value',
              dataModelType: dmc.TimeSeriesModel,
              dataModelOptions: {
                widgetId: null,
                controllerId: null,
                seriesId: null
              },
              settingsModalOptions: opt.TimeSeriesOptions,
              onSettingsClose: function(resultFromModal, widgetModel, dashboardScope) {
                // do something to update widgetModel, like the default implementation:
                jQuery.extend(true, widget, result);
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
                console.log("working");
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

        return {
            getWidgetDefinitions: getWidgetDefinitionsFN,
            defaultWidgets: defaultWidgets
        }
    }]);

    
})();



