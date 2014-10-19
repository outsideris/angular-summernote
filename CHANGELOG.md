# 0.3.0 (2014-10-19)
Support [AngularJS 1.3.0](http://angularjs.blogspot.kr/2014/10/angularjs-130-superluminal-nudge.html)
* bug fixes
  ([#20](https://github.com/outsideris/angular-summernote/issues/20))

# 0.2.4 (2014-10-04)
* bug fixes
  ([#19](https://github.com/outsideris/angular-summernote/issues/19))

# 0.2.3 (2014-09-04)
* update with [summernote v0.5.8](https://github.com/HackerWins/summernote/releases/tag/v0.5.8)
* add `onChange` event
* support airmode

## Bug fixes

* ngModel is synchronized with insert images
  ([#15](https://github.com/outsideris/angular-summernote/issues/15))

# 0.2.2 (2014-05-11)

* update with [summernote v0.5.1](https://github.com/HackerWins/summernote/releases/tag/v0.5.1)
* add `onPaste` event

## Bug Fixes

* ngModel is synchronized when summernote's codeview mode is enabled.
  ([#7](https://github.com/outsideris/angular-summernote/issues/7))

# 0.2.1 (2014-02-23)

## Bug Fixes

* ngModel is syncronized when text is changed using toolbar
  ([#4](https://github.com/outsideris/angular-summernote/issues/4))

# 0.2.0 (2014-01-26)

This release adds `ngModel` support

## Features

* support `ngModel` attribute(`code` attribute is removed)

## Breaking Changes

* use `ngModel` attribute instead `code` attribute for 2-ways binding.

  To migrate your code change your markup like below.
    
  Before:

```html
<summernote code="text"></summernote>
```

  After:

```html
<summernote ng-model="text"></summernote>
```

# 0.1.1 (2014-01-18)

_Very first, initial release_.

## Features

`summernote` direcive was released with the following directives:

* `summernote` directive
* `height` and `focus` attributes
* `config` attribute
* `code` attribute 
* `on-init`, `on-enter`, `on-foucs`, `on-blur`, `on-keyup`,
  `on-keydown` and `on-image-upload` attributes for event listeners
* `lang` attribute for i18n
