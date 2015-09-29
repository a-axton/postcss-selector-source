# postcss-selector-source
A PostCSS plugin for finding the original line and column position of your CSS selectors and declarations from your pre-processed SASS/SCSS/LESS/Stylus files.

## Important
This plugin requires source maps to work properly. Works with embedded or external source maps.

## Installation
```bash
npm install --save postcss-selector-source
```

## Usage

This plugin doesn't edit your css, it returns an object of all of your used selectors and declarations with
pointers to their original position.
```javascript
var postcss = require('postcss');
var selectorSource = require('postcss-selector-source');

postcss([
  selectorSource(function(selectors) {
    console.log(selectors);
  })
]).process(css);
```

## Don't want to include all of your CSS?
Anything declared above this comment won't show up in the results.
```sass
@import 'bootstrap'; // won't be included
@import 'wont-be-included'; // won't be included
/* !ATTN - anything above me won't be included */
@import 'will-be-included';

.will-also-be-included {
}
```

## Sample output
```javascript
[
  {
    "selector": ".first-selector",
    "selectors": [".first-selector"],
    "specificity": 10,
    "decls": [{
      "property": "content",
      "value": "'first selector'",
      "important": false,
      "start": {
        "line": 6,
        "column": 3
      },
      "end": {
        "line": 6,
        "column": 28
      },
      "originalPosition": {
        "start": {
          "source": "src/test.scss",
          "line": 7,
          "column": 2,
          "name": null
        },
        "end": {
          "source": "src/test.scss",
          "line": 7,
          "column": 28,
          "name": null
        }
      }
    }, {
      "property": "color",
      "value": "#ffffff",
      "important": true,
      "start": {
        "line": 7,
        "column": 3
      },
      "end": {
        "line": 7,
        "column": 28
      },
      "originalPosition": {
        "start": {
          "source": "src/test.scss",
          "line": 8,
          "column": 2,
          "name": null
        },
        "end": {
          "source": "src/test.scss",
          "line": 8,
          "column": 35,
          "name": null
        }
      }
    }],
    "start": {
      "line": 5,
      "column": 1
    },
    "end": {
      "line": 7,
      "column": 30
    },
    "originalPosition": {
      "start": {
        "source": "src/test.scss",
        "line": 6,
        "column": 0,
        "name": null
      },
      "end": {
        "source": "src/test.scss",
        "line": 6,
        "column": 17,
        "name": null
      }
    }
  }, {
    "selector": ".first-selector",
    "selectors": [".first-selector"],
    "specificity": 10,
    "decls": [{
      "property": "content",
      "value": "'first selector media query'",
      "important": false,
      "start": {
        "line": 10,
        "column": 7
      },
      "end": {
        "line": 10,
        "column": 44
      },
      "originalPosition": {
        "start": {
          "source": "src/test.scss",
          "line": 11,
          "column": 4,
          "name": null
        },
        "end": {
          "source": "src/test.scss",
          "line": 11,
          "column": 42,
          "name": null
        }
      }
    }, {
      "property": "width",
      "value": "500px",
      "important": false,
      "start": {
        "line": 11,
        "column": 7
      },
      "end": {
        "line": 11,
        "column": 19
      },
      "originalPosition": {
        "start": {
          "source": "src/test.scss",
          "line": 12,
          "column": 4,
          "name": null
        },
        "end": {
          "source": "src/_variable-includes.scss",
          "line": 2,
          "column": 21,
          "name": null
        }
      }
    }],
    "start": {
      "line": 9,
      "column": 5
    },
    "end": {
      "line": 11,
      "column": 21
    },
    "params": [{
      "property": "max-width",
      "value": "300px"
    }],
    "originalPosition": {
      "start": {
        "source": "src/test.scss",
        "line": 6,
        "column": 0,
        "name": null
      },
      "end": {
        "source": "src/test.scss",
        "line": 6,
        "column": 17,
        "name": null
      }
    }
  }
...
]
```
