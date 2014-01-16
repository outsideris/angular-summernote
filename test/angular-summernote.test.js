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

  // TODO: "focus" options couldn't test
  // because dom is drew lazily in karma
  describe('"focus" option', function() {

    it.skip('should be focused if it specified', function () {
      var el = $('<summernote focus>Hello world</summernote>').appendTo(document.body);
      element = $compile(el)($rootScope);
      element.next().appendTo(document.body);
      $rootScope.$digest();

      expect(element.next().find('.note-editable:focus')).to.length(1);

      var hasFocus = (document.activeElement == element.next().find('.note-editable').get(0));
      expect(hasFocus).to.be.true;
    });
  });
});
