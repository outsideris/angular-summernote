/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 */
/* global angular */
angular.module('summernote', [])

  .controller('SummernoteController', ['$scope', '$attrs', function($scope, $attrs) {
    'use strict';

    var currentElement,
        summernoteConfig = $scope.summernoteConfig || {};

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
    summernoteConfig.onpaste = function(evt) { $scope.paste({evt:evt}); };
    summernoteConfig.onkeydown = function(evt) { $scope.keydown({evt:evt}); };
    if (angular.isDefined($attrs.onImageUpload)) {
      summernoteConfig.onImageUpload = function(files, editor, welEditable) {
        $scope.imageUpload({files:files, editor:editor, welEditable:welEditable});
      };
    }

    this.activate = function(scope, element, ngModel) {
      summernoteConfig.onkeyup = function(evt) {
        var newValue = element.code();
        if (ngModel && ngModel.$viewValue !== newValue) {
          ngModel.$setViewValue(newValue);
          if ($scope.$$phase !== '$apply' || $scope.$$phase !== '$digest' ) {
            scope.$apply();
          }
        }
        $scope.keyup({evt:evt});
      };

      element.summernote(summernoteConfig);
      var editor$ = element.next('.note-editor');
      editor$.find('.note-toolbar').click(function() {
        var newValue = element.code();
        if (ngModel && ngModel.$viewValue !== newValue) {
          ngModel.$setViewValue(newValue);
          if ($scope.$$phase !== '$apply' || $scope.$$phase !== '$digest' ) {
            scope.$apply();
          }
        }
      });

      if (ngModel) {
        ngModel.$render = function() {
          element.code(ngModel.$viewValue || '');
        };
      }

      currentElement = element;
    };

    $scope.$on('$destroy', function () {
      currentElement.destroy();
    });
  }])
  .directive('summernote', [function() {
    'use strict';

    return {
      restrict: 'EA',
      transclude: true,
      replace: true,
      require: ['summernote', '^?ngModel'],
      controller: 'SummernoteController',
      scope: {
        summernoteConfig: '=config',
        init: '&onInit',
        enter: '&onEnter',
        focus: '&onFocus',
        blur: '&onBlur',
        paste: '&onPaste',
        keyup: '&onKeyup',
        keydown: '&onKeydown',
        imageUpload: '&onImageUpload'
      },
      template: '<div class="summernote"></div>',
      link: function(scope, element, attrs, ctrls) {
        var summernoteController = ctrls[0],
            ngModel = ctrls[1];

        summernoteController.activate(scope, element, ngModel);
      }
    };
  }]);
