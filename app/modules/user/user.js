(function () {
    'use strict';
    var controllerId = 'user';
    angular.module('app').controller(controllerId, ['common','datacontext', 'widgetinterface', usersessions]);

    function usersessions(common, datacontext, widgets) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var widgetDefs = widgets.getWidgetDefinitions();
        
        var tsdef = widgetDefs[0];
        var dtdef = widgetDefs[1].dataModelOptions;        
        var generator = new common.widgetControl();

        
        var intervals = common.OptionsEnums.TimeInterval;
        var regions = common.OptionsEnums.AWSRegions;
        var chartTypes = common.OptionsEnums.ChartTypes;
        
        var vm = this;

        vm.title = 'User Sessions';
        vm.PlaytricsModule = 'UserSessions';
        function getModule(moduleName){
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
            if(typeof moduleName === "object"){
                module = moduleName;
            } else if(typeof moduleName == "string"){
                var module = getModule(moduleName);   
            }
            var metric = null;
            for(var i = 0; i < module.methods.length; ++i) {
                if(module.methods[i] == metricName) {
                    metric = module.methods[i];
                    break;
                }
            }
            return metric;            
        }        

        function getConfig(moduleName, metricName, chartTitle){
            var config = tsdef;
            var module = getModule(moduleName);
            var metric = getMetric(module, metricName);
            config.title = chartTitle
            config.dataModelOptions.module = module;
            config.dataModelOptions.metricName = metric;            
            console.log(config);
            return config;

        }

        function installsDAUConfig(){

        }
        function currentOnlineConfig(){
            var config = tsdef;
            var module = getModule(vm.PlaytricsModule);
            var metric = getMetric(module, "currentonline");
            config.title = "Current Online"
            config.dataModelOptions.module = module;
            config.dataModelOptions.metricName = metric;            
            console.log(config);
            return config;
        }        


        vm.moduleInfo = {
            charts: [{
                name: "installsDAU",
                config: getConfig(vm.PlaytricsModule, "dailyinstallslogins", "DAU and Installs Per Day")
            },{
                name: "currently online",
                config: getConfig(vm.PlaytricsModule, "currentOnline", "Current Online")
            }],
            tables: [{}]

        }
        console.log(vm);
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