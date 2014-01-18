/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 */
/* global angular */
angular.module('summernote', [])

  .constant('summernoteConfig', {})

  .controller('SummernoteController', ['$scope', '$attrs', 'summernoteConfig', function($scope, $attrs, summernoteConfig) {
    'use strict';

    var currentElement, codeInSummernote;

    if (angular.isDefined($attrs.height)) { summernoteConfig.height = $attrs.height; }
    if (angular.isDefined($attrs.focus)) { summernoteConfig.focus = true; }
    if (angular.isDefined($attrs.lang)) {
      if (!angular.isDefined($.summernote.lang[$attrs.lang])) {
        throw new Error('"' + $attrs.lang + '" lang file must be exist.');
      }
      summernoteConfig.lang = $attrs.lang;
    }

    summernoteConfig.oninit = $scope.init;
    summernoteConfig.onenter = function(evt) { $scope.enter({evt:evt}); };
    summernoteConfig.onfocus = function(evt) { $scope.focus({evt:evt}); };
    summernoteConfig.onblur = function(evt) { $scope.blur({evt:evt}); };
    summernoteConfig.onkeydown = function(evt) { $scope.keydown({evt:evt}); };
    if (angular.isDefined($attrs.onImageUpload)) {
      summernoteConfig.onImageUpload = function(files, editor, welEditable) {
        $scope.imageUpload({files:files, editor:editor, welEditable:welEditable});
      };
    }

    this.activate = function(scope, element) {
      summernoteConfig.onkeyup = function(evt) {
        if (scope.code !== element.code()) {
          if (scope.code) { scope.code = element.code(); }
          codeInSummernote = element.code();
          if ($scope.$$phase === '$apply' || $scope.$$phase === '$digest' ) {
            scope.$apply();
          }
        }
        $scope.keyup({evt:evt});
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
    'use strict';

    return {
      restrict: 'EA',
      transclude: true,
      replace: true,
      controller: 'SummernoteController',
      scope: {
        code: '=',
        init: '&onInit',
        enter: '&onEnter',
        focus: '&onFocus',
        blur: '&onBlur',
        keyup: '&onKeyup',
        keydown: '&onKeydown',
        imageUpload: '&onImageUpload'
      },
      template: '<div class="summernote"></div>',
      link: function(scope, element, attrs, summernoteController) {
        summernoteController.activate(scope, element);
      }
    };
  }]);
