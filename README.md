# postcss-selector-source
A PostCSS plugin for finding the original line and column position of your CSS selectors and declarations from your pre-processed SASS/SCSS/LESS/Stylus files.

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
  selectorSource({
    cssRootDir: './path/to/css/',
    function(selectors) {
      console.log(selectors);
  }})
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
   "selector":".first-selector",
   "selectors":[  
      ".first-selector"
   ],
   "specificity":10,
   "decls":[  
      {  
         "property":"content",
         "value":"'first selector'",
         "start":{  
            "line":6,
            "column":3
         },
         "end":{  
            "line":6,
            "column":28
         },
         "originalPosition":{  
            "start":{  
               "source":"scss/test.scss",
               "line":7,
               "column":2,
               "name":null
            },
            "end":{  
               "source":"scss/test.scss",
               "line":7,
               "column":28,
               "name":null
            }
         }
      },
      {  
         "property":"color",
         "value":"#ffffff",
         "start":{  
            "line":7,
            "column":3
         },
         "end":{  
            "line":7,
            "column":17
         },
         "originalPosition":{  
            "start":{  
               "source":"scss/test.scss",
               "line":8,
               "column":2,
               "name":null
            },
            "end":{  
               "source":"scss/_variable-includes.scss",
               "line":1,
               "column":24,
               "name":null
            }
         }
      }
   ],
   "start":{  
      "line":5,
      "column":1
   },
   "end":{  
      "line":7,
      "column":19
   },
   "originalPosition":{  
      "start":{  
         "source":"scss/test.scss",
         "line":6,
         "column":0,
         "name":null
      },
      "end":{  
         "source":"scss/test.scss",
         "line":6,
         "column":17,
         "name":null
      }
   }
 }
 ...
]
```
