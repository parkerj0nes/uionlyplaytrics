(function () {
    'use strict';
    var controllerId = 'dashboard';
    angular.module('app').controller(controllerId, ['common','datacontext', dashboard]);

    function dashboard(common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.news = {
            title: 'Playtrics Fancypants UI',
            description: 'Hot Towel Angular is a SPA template for Angular developers.'
        };
        vm.messageCount = 0;
        vm.people = [];
        vm.title = 'User Data';

        activate();

        function activate() {
            var promises = [getMessageCount(), getPeople(), getPrivacyCompareData()];
            common.activateController(promises, controllerId)
                .then(function (data) {
                    log("activate fired");
                });
        }

        function getMessageCount() {
            console.log("getMessageCount");
            return datacontext.getMessageCount().then(function (data) {
                return vm.messageCount = data;
            });
        }

        function getPeople() {
            return datacontext.getPeople().then(function (data) {
                return vm.people = data;
            });
        }

        function getPrivacyCompareData() {
            var GameSessions = datacontext.GameSessions();
            //console.log(GameSessions);

            return GameSessions.privacyCompare().then(function (data) {
                log("Privacy data got")
                return vm.PrivacyCompareChartData = data;
            });
        }
    }
})();