(function () {
    'use strict';
    var controllerId = 'htmlCtrl';
    angular.module('app').directive('htmlEdit', function (datacontext, common) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var directive = {
            restrict: 'A',
            controller: 'htmlCtrl as vm',
            templateUrl: "app/common/widget/editHtml/htmlEdit.html",
            link: link
        };
        return directive;
        function link(scope, element, attrs) {
            element.attr("widgetId", scope.widgetData);
            scope.vm.checkEdits = checkEdits;
            scope.vm.saveEdits = saveEdits;
            checkEdits();

            function saveEdits() {

                var widget = $('div[widgetId="'+scope.widgetData+'"]');
                var textarea = widget.find($('textarea'));
                var content = widget.find($(".user-content"));
                content.html("");
                // console.log("input: %s", editElem.val());
                content.html(decodeHtml(textarea.val()))
                localStorage[scope.widgetData] = textarea.val();
                log("Edits saved!");

            }

            function checkEdits() {
                var widget = $('div[widgetId="'+scope.widgetData+'"]');
                var textarea = widget.find($('textarea'));
                var content = widget.find($(".user-content"));
                //find out if the user has previously saved edits
                if (localStorage[scope.widgetData] != null){
                     $(content).html(decodeHtml(localStorage[scope.widgetData]))                 
                }
                $(textarea).html(localStorage[scope.widgetData]);  

            }
            function decodeHtml(html) {
                var txt = document.createElement("textarea");
                txt.innerHTML = html;
                return txt.value;
            }
        }
    })
    .controller(controllerId, ['common', 'datacontext', pvEditHtml]);

    function pvEditHtml(common, datacontext) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);
        var wc = new common.widgetControl();
        var vm = this;
        console.log("html edit: %o", this);
        activate();
        function activate() {
            var promises = [];
            // checkEdits();
            common.activateController(promises, controllerId)
                .then(function (data) {
                    var store = wc.getWidgetMeta();
                    // console.log("html activated: %o", store);

                });
        }

        var onFailure = function (error) {
            console.log(error);
        }

        var onLoadCallback = function () {


        }

        var onSuccess = function (results) {

        }


    }
})();