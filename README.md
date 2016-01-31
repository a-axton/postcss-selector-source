# postcss-selector-source
A PostCSS plugin for finding the original line and column position of your CSS selectors and declarations from your pre-processed SASS/SCSS/LESS/Stylus files.

##### Output Differences
LESS and Stylus don't provide source map markers for selector endings 'originalPosition.end' returns null, everything else is consistent.

## Important!
This plugin requires source maps to work properly. Works with embedded or external source maps.

## Installation
```bash
npm install --save postcss-selector-source
```

## Usage
This plugin doesn't modify your css, it returns an object of all of your used selectors and declarations with pointers to their original position.
```javascript
var postcss = require('postcss');
var selectorSource = require('postcss-selector-source');

postcss([
  selectorSource(function(selectors) {
    console.log(selectors);
  })
]).process(css);
```

## Sample output
```javascript
[
  {
    "selector": ".first-selector",
    "selectors": [".first-selector"],
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
          "file": "src/test.scss",
          "line": 7,
          "column": 2
        },
        "end": {
          "file": "src/test.scss",
          "line": 7,
          "column": 28
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
          "file": "src/test.scss",
          "line": 8,
          "column": 2
        },
        "end": {
          "file": "src/test.scss",
          "line": 8,
          "column": 35
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
        "file": "src/test.scss",
        "line": 6,
        "column": 0
      },
      "end": {
        "file": "src/test.scss",
        "line": 6,
        "column": 17
      }
    }
  }
...
]
```
