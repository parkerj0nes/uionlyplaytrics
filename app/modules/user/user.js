(function () {
    'use strict';
    var controllerId = 'user';
    angular.module('app').controller(controllerId, ['common','datacontext', 'widgetinterface', usersessions]);
        

    function usersessions(common, datacontext, widgets, DTOptionsBuilder, DTColumnBuilder) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
                
        var intervals = common.OptionsEnums.TimeInterval;
        var regions = common.OptionsEnums.AWSRegions;
        var chartTypes = common.OptionsEnums.ChartTypes;
        
        var vm = this;

        vm.title = 'User Sessions';
        vm.PlaytricsModule = 'UserSessions';

        function TimeSeriesConfiguration(moduleName, metricName, chartTitle){
            var widgetDefs = widgets.getWidgetDefinitions();            
            var tsdef = widgetDefs[0];
            var dtdef = widgetDefs[1].dataModelOptions;   
            
            this.config = {};
            $.extend(this.config, tsdef);
            this.config.dataModelOptions = Object.create(tsdef.dataModelOptions);
            this.module = getModule(moduleName);
            this.metric = getMetric(this.module, metricName);
            this.config.title = chartTitle
            this.config.dataModelOptions.module = this.module;
            this.config.dataModelOptions.metricName = this.metric;            
            console.log(this.metric + " > %o ", this.config);
            return this.config;

        }

        function DataTablesConfiguration(moduleName, metricName, chartTitle, tableId){
            var widgetDefs = widgets.getWidgetDefinitions();            
            
            //need to put a pointer to the data promise on data model for data tables
            // as well as some representation of the column definitions.

            //we need to build our columns here probably as an array of objects, each with a solumn name and a display name.

            var dtdef = widgetDefs[1];   
            this.config = {};
            $.extend(this.config, dtdef); //try Object.create(tsde)f
            this.config.dataModelOptions = Object.create(dtdef.dataModelOptions);
            var columnBuilder = this.config.dataModelOptions.columnBuilder;
            this.config.columnBuilder = this.config.dataModelOptions.columnBuilder;
            this.config.optionsBuilder = this.config.dataModelOptions.optionsBuilder;            
            this.module = getModule(moduleName);
            this.metric = getMetric(this.module, metricName);
            this.config.title = chartTitle;
            this.config.dataModelOptions.module = this.module;
            this.config.dataModelOptions.metricName = this.metric;            
            this.config.tableId = tableId;


            console.log(this.metric + " > %o ", this.config);


            return this.config;

        }

        function getModule(moduleName){
            var generator = new common.widgetControl();            
            var modules = generator.getModules(datacontext);
            var module = null;
            for(var i = 0; i < modules.length; ++i) {
                if(modules[i].name == moduleName) {
                    module = modules[i];
                    break;
                }
            }
            return module;            
        }
        function getMetric(moduleName, metricName){
            var module = null;
            var metric = null;

            if(typeof moduleName === "object"){
                module = moduleName;
                console.log(module);                
            } else if(typeof moduleName == "string"){
                var module = getModule(moduleName);  
                console.log(module);
            }
            searchObj(module);
            function searchObj( obj ){

                for( var key in obj ) {

                    if( typeof obj[key] === 'object' ){
                        searchObj( obj[key] );
                    }

                    if( key === metricName ){
                        console.log( 'property=' + key + ' value=' + obj[key]);
                        metric = key;
                        break;                        
                    }

                }

            }            
            return metric;           
        }        
       
        vm.moduleInfo = {
            charts: [{
                name: "Daily Active Users and Daily Installs",
                config: new TimeSeriesConfiguration(vm.PlaytricsModule, "dailyinstallslogins", "DAU and Installs Per Day")
            },
            {
                name: "Average Weekly 14 Day Retention",
                config: new TimeSeriesConfiguration(vm.PlaytricsModule, "reportAverage", "Users Online By Region")
            },
            {
                name: "NURR CURR RURR",
                config: new TimeSeriesConfiguration(vm.PlaytricsModule, "usersOnlineByRegion", "Users Online By Region")
            },            
            {
                name: "Currently Online",
                config: new TimeSeriesConfiguration(vm.PlaytricsModule, "currentOnline", "Current Online")
            },
            {
                name: "Users Online By Region",
                config: new TimeSeriesConfiguration(vm.PlaytricsModule, "usersOnlineByRegion", "Users Online By Region")
            }],
            tables: [{
                name: "Retention",
                config: new DataTablesConfiguration(vm.PlaytricsModule, "RetentionReport", "Retention Data", "retentionTable")
            },{

                name: "NURR CURR RURR",
                config: new DataTablesConfiguration(vm.PlaytricsModule, "ReturnersReport", "Retention Data", "NCRTable")
            }]

        }
        activate();

        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function (data) {
                    log("activate fired");
                });
        }        
    }

    //moduleInfo.chart[0].name    
})();