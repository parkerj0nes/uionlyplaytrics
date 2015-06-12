(function () {
    'use strict';

    var serviceId = 'datacontext';
    angular.module('app').factory(serviceId, ['common', datacontext]);

    function datacontext(common) {
        var $q = common.$q;

        var service = {
            getPeople: getPeople,
            getMessageCount: getMessageCount,
            GameSessions: GameSessions,
            GameEconomy: GameEconomy
        };

        return service;
        
        function getDataPromise(DataCallAttrs) {
            var deferral = $q.defer();
            //console.log("in GetData promise")
            var successFn = function (data) {
                var eventArgs = {
                    moduleId: DataCallAttrs.moduleName,
                    controllerId: DataCallAttrs.controllerName,
                    widgetId: DataCallAttrs.widgetName
                };
                common.$broadcast(common.config.ajaxSuccess, eventArgs);
                $.extend(data, eventArgs);
                DataCallAttrs.ajaxCallback.apply(this, data);
                deferral.resolve(data);
            }

            $.ajax({
                url: DataCallAttrs.url,
                crossDomain: true,
                success: successFn
            })

            return $q.when(deferral.promise);
        }

        function getMessageCount() { return $q.when(72); }

        function getPeople() {
            var people = [
                { firstName: 'John', lastName: 'Papa', age: 25, location: 'Florida' },
                { firstName: 'Ward', lastName: 'Bell', age: 31, location: 'California' },
                { firstName: 'Colleen', lastName: 'Jones', age: 21, location: 'New York' },
                { firstName: 'Madelyn', lastName: 'Green', age: 18, location: 'North Dakota' },
                { firstName: 'Ella', lastName: 'Jobs', age: 18, location: 'South Dakota' },
                { firstName: 'Landon', lastName: 'Gates', age: 11, location: 'South Carolina' },
                { firstName: 'Haley', lastName: 'Guthrie', age: 35, location: 'Wyoming' }
            ];
            return $q.when(people);
        }

        function GameSessions() {
            var moduleName = "GameSessions";

            var privacyCompare = function (attrs) {
                var widgetName = "PrivacyCompare"
                var dataUrl = 'http://localmonitoring.playverse.com:7552/Game/PrivacyChartData?game=DD2&region=USEast_NorthVirg&interval=15&start=2015-06-09T04:00:00.000Z&end=2015-06-09T19:38:55.639Z'

                var DataCallAttrs = {
                    moduleName: (moduleName) ? moduleName :  null,
                    widgetName: (widgetName) ? widgetName : null,
                    controllerName: (attrs && attrs.controllerId) ? attrs.controllerId : null,
                    url: dataUrl,
                    ajaxCallback: function (data) {
                        //console.log("ajax called here is the object %o", this);
                        //I want your code inside me

                        if (attrs && attrs.callback) {
                            //this is where we're camming the passed in function that adds more stuff to this function
                            attrs.callback.apply(this, arguments);
                        }
                    }
                }

                $.extend(DataCallAttrs, attrs);

                return getDataPromise(DataCallAttrs);
            }


            return {
                privacyCompare: privacyCompare
            }
        
        };

        function GameEconomy() {
            var moduleName = "GameEconomy";

            var coinFlow = function (attrs) {
                var widgetName = "coinFlow"
                var dataUrl = 'http://localmonitoring.playverse.com:7552/Economy/GetCoinFlowMacro?game=DD2&region=0&interval=15&start=2015-04-28T00:00:00.000Z&end=2015-05-28T16:16:14.950Z'

                var DataCallAttrs = {
                    moduleName: (moduleName) ? moduleName : null,
                    widgetName: (widgetName) ? widgetName : null,
                    controllerName: (attrs && attrs.controllerId) ? attrs.controllerId : null,
                    url: dataUrl,
                    ajaxCallback: function (data) {
                        //console.log("ajax called here is the object %o", this);
                        //I want your code inside me

                        if (attrs && attrs.callback) {
                            //this is where we're camming the passed in function that adds more stuff to this function
                            attrs.callback.apply(this, arguments);
                        }
                    }
                }

                $.extend(DataCallAttrs, attrs);

                return getDataPromise(DataCallAttrs);
            }


            return {
                coinFlow: coinFlow
            }
        }
    }

})();