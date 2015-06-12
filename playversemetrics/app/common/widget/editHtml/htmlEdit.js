(function () {
    'use strict';
    var controllerId = 'htmlCtrl';
    angular.module('app').directive('htmlEdit', function (datacontext) {
        var directive = {
            restrict: 'A',
            controller: 'htmlCtrl as vm',
            templateUrl: "app/common/widget/editHtml/htmlEdit.html",
            link: link
        };
        return directive;
        function link(scope, element, attrs) {
            console.log("html link")
        }

    })
    .controller(controllerId, ['common', 'datacontext', pvEditHtml]);

    function pvEditHtml(common, datacontext) {
        var WidgetId;
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var wc = new common.widgetControl();
        var vm = this;
        activate();
        function activate() {
            var promises = [];
            checkEdits();
            common.activateController(promises, controllerId)
                .then(function (data) {
                    var store = wc.getWidgetMeta();
                    log(store);
                    WidgetId = wc.generateId();
                    console.log("html activated")
                });
        }

        var onFailure = function (error) {
            console.log(error);
        }

        var onLoadCallback = function () {


        }

        var onSuccess = function (results) {

        }
        function decodeHtml(html) {
            var txt = document.createElement("textarea");
            txt.innerHTML = html;
            return txt.value;
        }
        vm.saveEdits = saveEdits;
        function saveEdits() {
            $("#user-content").html("");
            var editElem = $("#edit");
            console.log("input: %s", editElem.val());
            $("#user-content").html(decodeHtml(editElem.val()))
            localStorage.userEdits = editElem.val();
            log("Edits saved!");

        }
        vm.checkEdits = checkEdits;
        function checkEdits() {

            //find out if the user has previously saved edits
            if (localStorage.userEdits != null)
                $("#user-content").html(decodeHtml(localStorage.userEdits))
                $("#edit").html(localStorage.userEdits);
        }

    }
})();