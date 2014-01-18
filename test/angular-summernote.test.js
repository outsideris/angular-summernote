/**
 * Copyright (c) 2013 JeongHoon Byun aka "Outsider", <http://blog.outsider.ne.kr/>
 * Licensed under the MIT license.
 * <http://outsider.mit-license.org/>
 */
describe('Summernote directive', function() {
  'use strict';

  var $rootScope, $compile, element;

  beforeEach(module('summernote'));
  beforeEach(inject(function(_$compile_, _$rootScope_) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  describe('initialization', function() {

    it('has "summernote" class', function () {
      element = $compile('<summernote></summernote>')($rootScope);
      $rootScope.$digest();

      expect($(element.get(0)).hasClass('summernote')).to.be.true;
    });

    it('works with "summernote" element', function () {
      element = $compile('<summernote></summernote>')($rootScope);
      $rootScope.$digest();

      expect(element.next().hasClass('note-editor')).to.be.true;
    });

    it('works with "summernote" attribute', function () {
      element = $compile('<div summernote></div>')($rootScope);
      $rootScope.$digest();

      expect(element.next().hasClass('note-editor')).to.be.true;
    });

    it('works with multiple "summernote" elements', function () {
      element = $compile('<summernote></summernote><br><summernote></summernote>')($rootScope);
      $rootScope.$digest();

      expect(element.next('.note-editor')).to.length(2);
    });

  });

  describe('"height" option', function() {

    it('should be 0 unless it specified', function () {
      element = $compile('<summernote></summernote>')($rootScope);
      $rootScope.$digest();

      expect(element.next().find('.note-editable').outerHeight()).to.be.equal(0);
    });

    it('should be 400 if it specified', function () {
      element = $compile('<summernote height="400"></summernote>')($rootScope);
      $rootScope.$digest();

      expect(element.next().find('.note-editable').outerHeight()).to.be.equal(400);
    });

    it('should set with multiple directives', function () {
      element = $compile('<summernote height="200"></summernote><br><summernote height="400"></summernote>')($rootScope);
      $rootScope.$digest();

      expect(element.next().find('.note-editable').eq(0).outerHeight()).to.be.equal(200);
      expect(element.next().find('.note-editable').eq(1).outerHeight()).to.be.equal(400);
    });

  });

  describe('"focus" option', function() {
    it('should be focused if it specified', function () {
      var el = $('<summernote focus>Hello world</summernote>').appendTo(document.body);
      element = $compile(el)($rootScope);
      $rootScope.$digest();

      expect(element.next().find('.note-editable:focus')).to.length(1);

      el.next().remove();
      el.remove();
    });
  });

  describe('summernoteConfig', function() {
    var originalConfig = {};

    beforeEach(inject(function(summernoteConfig) {
      angular.extend(originalConfig, summernoteConfig);
      summernoteConfig.height = 300;
      summernoteConfig.focus = true;
      summernoteConfig.toolbar = [
        ['style', ['bold', 'italic', 'underline', 'clear']],
        ['fontsize', ['fontsize']],
        ['color', ['color']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['height', ['height']],
      ];
    }));
    afterEach(inject(function(summernoteConfig) {
      // return it to the original state
      delete summernoteConfig.height;
      delete summernoteConfig.focus;
      delete summernoteConfig.toolbar;
    }));

    it('"height" should be 300', function() {
      element = $compile('<summernote></summernote>')($rootScope);
      $rootScope.$digest();

      expect(element.next().find('.note-editable').outerHeight()).to.be.equal(300);
    });

    it('toolbar should be customized', function() {
      element = $compile('<summernote></summernote>')($rootScope);
      $rootScope.$digest();

      expect(element.next().find('.note-toolbar > .note-fontsize')).to.length(1);
      expect(element.next().find('.note-toolbar > .note-help')).to.length(0);
    });

    it('"lang" needs the lang file', function() {
      var fn = $compile('<summernote lang="ko-KR"></summernote>');
      try {
        fn($rootScope);
      } catch(e) {
        expect(e.message).to.be.exist;
      }
    });
  });

  describe('destroy', function() {
    var scope;

    beforeEach(function() {
      scope = $rootScope.$new();
    });

    it('shoud be destroyed when scope is destroyed.', function() {
      // given
      element = $compile('<summernote></summernote>')(scope);
      scope.$digest();
      expect(element.next().hasClass('note-editor')).to.be.true;
      // when
      scope.$destroy();
      // then
      expect(element.next().hasClass('note-editor')).to.be.false;
    });
  });

  describe('code', function() {
    var scope, originalConfig = {};

    beforeEach(inject(function(summernoteConfig) {
      scope = $rootScope.$new();
      angular.extend(originalConfig, summernoteConfig);
      summernoteConfig.focus = true;
    }));
    afterEach(inject(function(summernoteConfig) {
      // return it to the original state
      delete summernoteConfig.focus;
    }));

    it('text should be synchronized when value are changed in outer scope', function() {
      // given
      var oldText = 'Hello World!', newText = 'new text';
      scope.text = oldText;
      element = $compile('<summernote code="text"></summernote>')(scope);
      scope.$digest();
      expect(element.code()).to.be.equal(oldText);
      // when
      scope.text = newText;
      scope.$digest();
      // then
      expect(element.code()).to.be.equal(newText);
    });

    it('text should be synchronized when value are changed in summernote', function() {
      var oldText = 'Hello World!', newText = 'new text';
      // given
      scope.text = oldText;
      var el = $('<summernote code="text"></summernote>').appendTo(document.body);
      element = $compile(el)(scope);
      scope.$digest();
      expect(element.code()).to.be.equal(oldText);
      // when
      element.code(newText);
      $(element.next().find('.note-editable').eq(0)).trigger('keyup');
      scope.$digest();
      // then
      expect(scope.text).to.be.equal(newText);

      el.next().remove();
      el.remove();
    });
  });

  describe('callbacks', function() {
    var scope;

    beforeEach(inject(function(summernoteConfig) {
      summernoteConfig = {focus: false};
      scope = $rootScope.$new();
    }));

    it('oninit should be invoked', function(done) {
      scope.init = function() {
        expect(true).to.be.true;
        done();
      };
      element = $compile('<summernote on-init="init()"></summernote>')(scope);
      scope.$digest();
    });

    it('onenter should be invoked', function(done) {
      scope.enter = function() {
        // then
        expect(true).to.be.true;
        done();
      };
      // given
      var el = $('<summernote on-enter="enter()"></summernote>').appendTo(document.body);
      element = $compile(el)(scope);
      scope.$digest();
      // when
      var e= jQuery.Event('keypress');
      e.keyCode = 13; // Enter key
      element.next().find('.note-editable').trigger(e);
      scope.$digest();
      // tear down
      el.next().remove();
      el.remove();
    });

    it('onfocus should be invoked', function(done) {
      scope.focus = function(e) {
        // then
        expect(e).to.be.exist;
        done();
      };
      // given
      var el = $('<summernote on-focus="focus(evt)"></summernote>').appendTo(document.body);
      element = $compile(el)(scope);
      scope.$digest();
      // when
      element.next().find('.note-editable').focus();
      scope.$digest();
      // tear down
      el.next().remove();
      el.remove();
    });

    it('onblur should be invoked', function(done) {
      scope.blur = function(e) {
        // then
        expect(e).to.be.exist;
        done();
      };
      // given
      var el = $('<summernote on-blur="blur(evt)"></summernote>').appendTo(document.body);
      element = $compile(el)(scope);
      scope.$digest();
      // when
      element.next().find('.note-editable').blur();
      scope.$digest();
      // tear down
      el.next().remove();
      el.remove();
    });

    it('onkeyup should be invoked', function(done) {
      scope.keyup = function(e) {
        // then
        expect(e).to.be.exist;
        done();
      };
      // given
      var el = $('<summernote on-keyup="keyup(evt)"></summernote>').appendTo(document.body);
      element = $compile(el)(scope);
      scope.$digest();
      // when
      element.next().find('.note-editable').keyup();
      scope.$digest();
      // tear down
      el.next().remove();
      el.remove();
    });

    it('onkeydown should be invoked', function(done) {
      scope.keydown = function(e) {
        // then
        expect(e).to.be.exist;
        done();
      };
      // given
      var el = $('<summernote on-keydown="keydown(evt)"></summernote>').appendTo(document.body);
      element = $compile(el)(scope);
      scope.$digest();
      // when
      element.next().find('.note-editable').keydown();
      scope.$digest();
      // tear down
      el.next().remove();
      el.remove();
    });

    // TODO: add tests for onImageUpload
  });

});
