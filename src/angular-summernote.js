/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 */

angular.module('summernote', [])

  .constant('summernoteConfig', {

  })

  .controller('SummernoteController', ['$scope', '$attrs', 'summernoteConfig', function($scope, $attrs, summernoteConfig) {

    if (angular.isDefined($attrs.height)) { summernoteConfig.height = $attrs.height; }
    if (angular.isDefined($attrs.focus)) { summernoteConfig.focus = true; }

    this.activate = function(scope, element) {
      element.summernote(summernoteConfig);
    };

  }])
  .directive('summernote', [function() {
    return {
      restrict: 'EA',
      transclude: true,
      replace: true,
      controller: 'SummernoteController',
      scope: {},
      template: '<div class="summernote"></div>',
      link: function(scope, element, attrs, summernoteController) {
        summernoteController.activate(scope, element);
      }
    };
  }]);


