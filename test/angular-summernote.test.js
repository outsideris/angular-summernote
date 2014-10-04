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
      var el = $('<summernote focus height="400"></summernote>').appendTo(document.body);
      element = $compile(el)($rootScope);
      $rootScope.$digest();

      expect(element.next().find('.note-editable').get(0)).to.be.equal(document.activeElement);

      el.next().remove();
      el.remove();
    });
  });

  describe('"airmode" option', function() {

    it('should be on', function () {
      element = $compile('<summernote airMode></summernote>')($rootScope);
      $rootScope.$digest();

      expect(element.hasClass('note-air-editor')).to.be.true;
    });


    it('should be on using config', function () {
      var scope = $rootScope.$new();
      scope.summernoteConfig = {airMode: true};
      element = $compile('<summernote config="summernoteConfig"></summernote>')(scope);
      $rootScope.$digest();

      expect(element.hasClass('note-air-editor')).to.be.true;
      element.next().remove();
      element.remove();
    });

  });

  describe('summernoteConfig', function() {
    var scope;

    beforeEach(function() {
      scope = $rootScope.$new();
      scope.summernoteConfig = {
        height: 300,
        focus: true,
        toolbar: [
          ['style', ['bold', 'italic', 'underline', 'clear']],
          ['fontsize', ['fontsize']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['height', ['height']]
        ]
      };
    });

    it('"height" should be 300', function() {
      element = $compile('<summernote config="summernoteConfig"></summernote>')(scope);
      $rootScope.$digest();

      expect(element.next().find('.note-editable').outerHeight()).to.be.equal(300);
    });

    it('toolbar should be customized', function() {
      element = $compile('<summernote config="summernoteConfig"></summernote>')(scope);
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

    it('should clean up summernnote', function () {
      // given
      scope.summernoteConfig = {height: 300};
      scope.test = [];
      var element = $compile('<div ng-repeat="t in test"><summernote ng-model="t.c" config="summernoteConfig"></summernote></div>')(scope);
      scope.$digest();

      scope.test.push({c: ''});
      scope.$digest();
      expect($(element.next().children().get(0)).hasClass('summernote')).to.be.true;

      // when
      scope.test.pop();
      scope.$digest();

      // then
      expect($(element.next().children().get(0)).hasClass('summernote')).to.be.false;
    });
  });

  describe('ngModel', function() {
    var scope;

    beforeEach(function() {
      scope = $rootScope.$new();
      scope.summernoteConfig = {focus: true};
    });

    it('text should be synchronized when value are changed in outer scope', function() {
      // given
      var oldText = 'Hello World!', newText = 'new text';
      scope.text = oldText;
      element = $compile('<summernote ng-model="text"></summernote>')(scope);
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
      var el = $('<summernote ng-Model="text"></summernote>').appendTo(document.body);
      element = $compile(el)(scope);
      scope.$digest();
      expect(element.code()).to.be.equal(oldText);
      // when
      element.code(newText);
      $(element.next().find('.note-editable').eq(0)).trigger('input'); // to trigger onChange
      scope.$digest();
      // then
      expect(scope.text).to.be.equal(newText);

      el.next().remove();
      el.remove();
    });

    it('text should be synchronized when text is changed using toolbar', function() {
      var selectText = function(element){
        var doc = document;
        if (doc.body.createTextRange) {
          var range = document.body.createTextRange();
          range.moveToElementText(element);
          range.select();
        } else if (window.getSelection) {
          var selection = window.getSelection();
          var range = document.createRange();
          range.selectNodeContents(element);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      };

      var oldText = 'Hello World!';
      // given
      scope.text = oldText;
      var el = $('<summernote ng-Model="text"></summernote>').appendTo(document.body);
      element = $compile(el)(scope);
      scope.$digest();
      expect(element.code()).to.be.equal(oldText);
      // when
      selectText($(element.next().find('.note-editable'))[0]);
      $(element.next().find('.note-font').find('button').eq(0)).click();
      scope.$digest();
      // then
      expect(scope.text).to.be.equal(element.code());

      el.next().remove();
      el.remove();
    });

    it('text chould be synchronized when text is changed in codeview mode', function() {
      var oldText = 'Hello World!', newText = 'new text';
      // given
      scope.text = oldText;
      var el = $('<summernote ng-Model="text"></summernote>').appendTo(document.body);
      element = $compile(el)(scope);
      scope.$digest();
      expect(element.code()).to.be.equal(oldText);
      // when
      element.next().find('.note-view').find('button[data-event=codeview]').click();
      scope.text = newText;
      scope.$digest();
      // then
      expect(element.code()).to.be.equal(newText);

      el.next().remove();
      el.remove();
    });

    it('text should be synchronized in use codeview when text is changed in outer scope', function() {
      var oldText = 'Hello World!', newText = 'new text';
      // given
      scope.text = oldText;
      var el = $('<summernote ng-Model="text"></summernote>').appendTo(document.body);
      element = $compile(el)(scope);
      scope.$digest();
      expect(element.code()).to.be.equal(oldText);
      // when
      element.next().find('.note-view').find('button[data-event=codeview]').click();
      element.next().find('.note-codable').val(newText);
      $(element.next().find('.note-codable').eq(0)).trigger('keyup');
      scope.$digest();
      // then
      expect(scope.text).to.be.equal(newText);

      el.next().remove();
      el.remove();
    });

    it('should be synchronized when image inserted', function(done) {
      // given
      scope.text = 'Hello World';
      var el = $('<summernote ng-Model="text"></summernote>').appendTo(document.body);
      element = $compile(el)(scope);
      scope.$digest();
      // when
      var preventBubbling = function(e) { e.stopPropagation(); };
      $('.note-toolbar').on('click', preventBubbling);

      $(element.next().find('.note-insert').eq(1).find('button').eq(1)).click(); // image

      expect(element.next().find('.note-image-dialog')).to.length(1);
      var imgUrl = 'https://www.gravatar.com/avatar/748a6dc8b4eaba0fde62909e39be7987?s=200';
      element.next().find('.note-image-dialog').find('.note-image-url').val(imgUrl);
      element.next().find('.note-image-dialog').find('.note-image-url').trigger('keyup');
      element.next().find('.note-image-dialog').find('.note-image-btn').click();

      // then
      setTimeout(function() {
        expect(element.code()).to.match(/gravatar/);

        // tear down
        $('.note-toolbar').off('click', preventBubbling);
        el.next().remove();
        el.remove();
        done();
      }, 200);
    });
  });

  describe('callbacks', function() {
    var scope;

    beforeEach(function() {
      scope = $rootScope.$new();
      scope.summernoteConfig = {focus: false};
    });

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
//      e.keyCode = 13; // Enter key
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

    it('onpaste should be invoked', function(done) {
      scope.paste = function(e) {
        // then
        expect(true).to.be.true;
        done();
      };
      // given
      var el = $('<summernote on-paste="paste(evt)"></summernote>').appendTo(document.body);
      element = $compile(el)(scope);
      scope.$digest();
      // when
      var event = jQuery.Event('paste');
      event.originalEvent = '';
      element.next().find('.note-editable').trigger(event);

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

    it('onChange should be invoked', function(done) {
      var selectText = function(element){
        var doc = document;
        if (doc.body.createTextRange) {
          var range = document.body.createTextRange();
          range.moveToElementText(element);
          range.select();
        } else if (window.getSelection) {
          var selection = window.getSelection();
          var range = document.createRange();
          range.selectNodeContents(element);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      };

      scope.change = function(contents, editable$) {
        // then
        expect(/Hello World/.test(contents)).to.be.ok;
        done();
      };
      // given
      var oldText = 'Hello World!';
      scope.text = oldText;
      var el = $('<summernote ng-Model="text" on-change="change(contents, editable$)"></summernote>')
                  .appendTo(document.body);
      element = $compile(el)(scope);
      scope.$digest();
      // when
      selectText($(element.next().find('.note-editable'))[0]);
      $(element.next().find('.note-font').find('button').eq(0)).click();
      scope.$digest();
      // tear down
      el.next().remove();
      el.remove();
    });

    // TODO: add tests for onImageUpload
  });

});
