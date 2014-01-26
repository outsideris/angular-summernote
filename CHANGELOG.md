# 0.2.0 (2014-01-26)

This release adds `ngModel` support

## Features

* support `ngModel` attribute(`code` attribute is removed)

## Breaking Changes

* use `ngModel` attribute insted `code` attribute for 2-ways binding.

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
