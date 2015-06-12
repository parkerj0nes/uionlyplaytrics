(function () {
    'use strict';

    var pvwidgetModule = angular.module('pvWidgets', []);
    pvwidgetModule.factory('TimeSeriesDataModel', function ($interval, datacontext, WidgetDataModel) {

        function TimeSeriesDataModel() {
        }

        TimeSeriesDataModel.prototype = Object.create(WidgetDataModel.prototype);
        TimeSeriesDataModel.prototype.constructor = WidgetDataModel;

        angular.extend(TimeSeriesDataModel.prototype, {
            init: function () {
                var dataModelOptions = this.dataModelOptions;
                this.limit = (dataModelOptions && dataModelOptions.limit) ? dataModelOptions.limit : 100;

                this.updateScope('-');
                this.startInterval();
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
    });
    pvwidgetModule.factory('DataTableDataModel', function ($interval, datacontext, WidgetDataModel) {

        function DataTableDataModel() {
        }

        DataTableDataModel.prototype = Object.create(WidgetDataModel.prototype);
        DataTableDataModel.prototype.constructor = WidgetDataModel;

        angular.extend(DataTableDataModel.prototype, {
            init: function () {
                var dataModelOptions = this.dataModelOptions;
                this.limit = (dataModelOptions && dataModelOptions.limit) ? dataModelOptions.limit : 100;

                this.updateScope('-');
                this.startInterval();
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
    pvwidgetModule.factory('EditHtmlDataModel', function ($interval, datacontext, WidgetDataModel) {

        function EditHtmlDataModel() {
        }

        EditHtmlDataModel.prototype = Object.create(WidgetDataModel.prototype);
        EditHtmlDataModel.prototype.constructor = WidgetDataModel;

        angular.extend(EditHtmlDataModel.prototype, {
            init: function () {
                var dataModelOptions = this.dataModelOptions;
                this.limit = (dataModelOptions && dataModelOptions.limit) ? dataModelOptions.limit : 100;

                this.updateScope('-');
                this.startInterval();
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
        return [
            {
                name: "TimeSeriesOptions",
                modalOptions: {
                    templateUrl: 'app/common/widget/timeseries/ChartOptionsModal.html',
                    controller: 'ModalCtrl', // defined elsewhere,
                    animation: true,
                    keyboard: true
                }
            },
            {
                name: "DataTableOptions",
                modalOptions: {
                    templateUrl: 'app/common/widget/datatable/ChartOptionsModal.html',
                    controller: 'ModalCtrl', // defined elsewhere,
                    animation: true,
                    keyboard: true
                }
            }
        ];
    });
    pvwidgetModule.factory('pvwidgetDefinitions', ['TimeSeriesDataModel', function (TimeSeriesDataModel) {
        return [
          {
              name: 'TimeSeries',
              directive: 'playchart',
              dataAttrName: 'value',
              dataModelType: TimeSeriesDataModel
          },
          {
              name: 'DataTable',
              directive: 'playtable',
              dataModelType: TimeSeriesDataModel
          },
          {
              name: 'Html',
              directive: 'html-edit',
              dataModelType: TimeSeriesDataModel
          }
        ];
    }]);
    pvwidgetModule.value('defaultWidgets', [
    { name: 'DataTable' },
    { name: 'TimeSeries' },
    { name: 'Html' }
    ]);

    pvwidgetModule.factory('widgetinterface', ['pvwidgetDefinitions', 'pvwidgetOptionsModalConfig', 'defaultWidgets',function (definitions, ModalConfig, defaultWidgets) {
        var getOptionsFn = function (optionSet) {
            //fix this so it works
            var configOptions = ModalConfig;
            if (optionSet && typeof optionSet == "string") {
                var match = $.grep(configOptions, function (option) { if (option.name == optionSet) return option });
                if (match) {
                    return match[0].modalOptions
                }
                return configOptions[0].modalOptions;
            }
        }

        var getWidgetDefinitionsFN = function (definition) {
            if (definition) {
                return [/*return the definition*/]
            }
            return definitions;
        }

        return {
            getWidgetDefinitions: getWidgetDefinitionsFN,
            defaultWidgets: defaultWidgets,
            getModalOptions: getOptionsFn
        }
    }]);

    
})();



