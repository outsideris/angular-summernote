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

  });

});