/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 */

angular.module('summernote', [])

  .controller('SummernoteController', ['$scope', '$attrs', function($scope, $attrs) {

    this.activate = function(scope, element) {
      element.summernote();
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


