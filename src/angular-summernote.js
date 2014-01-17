/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 */

angular.module('summernote', [])

  .constant('summernoteConfig', {

  })

  .controller('SummernoteController', ['$scope', '$attrs', 'summernoteConfig', function($scope, $attrs, summernoteConfig) {
    var currentElement, codeInSummernote;

    if (angular.isDefined($attrs.height)) { summernoteConfig.height = $attrs.height; }
    if (angular.isDefined($attrs.focus)) { summernoteConfig.focus = true; }

    this.activate = function(scope, element) {
      summernoteConfig.onkeyup = function(e) {
        if (scope.code !== element.code()) {
          codeInSummernote = scope.code = element.code();
          if ($scope.$$phase == '$apply' || $scope.$$phase == '$digest' ) {
            scope.$apply();
          }
        }
      };

      element.summernote(summernoteConfig);
      element.code(scope.code);
      currentElement = element;
    };

    $scope.$on('$destroy', function () {
      currentElement.destroy();
    });

    $scope.$watch('code', function(newValue, oldValue) {
      // prevent to set code twice when code are changed in summernote
      if (newValue !== oldValue && newValue !== codeInSummernote) {
        currentElement.code(newValue);
      }
    });
  }])
  .directive('summernote', [function() {
    return {
      restrict: 'EA',
      transclude: true,
      replace: true,
      controller: 'SummernoteController',
      scope: {
        code: '='
      },
      template: '<div class="summernote"></div>',
      link: function(scope, element, attrs, summernoteController) {
        summernoteController.activate(scope, element);
      }
    };
  }]);
