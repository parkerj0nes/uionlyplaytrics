(function () {
    'use strict';
    var controllerId = 'datatable';
    angular.module('app').controller(controllerId, ['common', 'datacontext', pvdatatable]);

    function pvdatatable(common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.widgetMeta = getWidgetMeta();

        activate();

        var onFailure = function (error) {
            console.log(error);
        }

        var onLoadCallback = function () {


        }

        var onSuccess = function (results) {

        }
        function getWidgetMeta(storageName) {
            var localStorage = common.$window.localStorage;

            if (storageName) {

            }

            // console.log("storage: %o", JSON.parse(localStorage.getItem("demo_simple")));
            var store = JSON.parse(localStorage.demo_simple).widgets;
            // console.log(store);
            for (var key in store) {
                console.log(store[key]);
            }

            return store;
            //return {
            //    id: 123,
            //    seriesData: [],
            //    game: 'TimeSeries widget',
            //    module: 'This is a module string',
            //    series: 'TimeSeries name',
            //    description: 'Hot Towel Angular is a SPA template for Angular developers.'
            //};
        }

        function activate() {
            var promises = [];
            common.activateController(promises, controllerId)
                .then(function (data) {
                });
        }
    }
})();