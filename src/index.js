import postcss from 'postcss';
import { Scouter } from 'scouter';
import Source from './Source';

const source = new Source();
const scouter = new Scouter();
const selectors = [];
const removeAbove = {
  line: 0,
  set: function(line) {
    this.line = line;
  }
};

// maps out the relevant css declaration info
function _buildDecls(decls) {
  return decls.map(decl => {
    let start = decl.source.start;
    let end = decl.source.end;
    let important = decl.important ? true : false;
    let entry = {
      property: decl.prop,
      value: decl.value,
      important: important,
      start: start,
      end: end
    };
    if (source.sourceMapURL) {
      entry.originalPosition = source.getOriginalPosition(start, end);
    }

    return entry;
  });
}

function _buildMediaParams(params) {
  params = params.match(/\((.*?)\)/g);

  return params.map(param => {
    param = param.replace(/[\])(]/g, '').replace(/\s/g, '').split(':');
    return {
      property: param[0],
      value: param[1]
    };
  });
}

function _buildRuleEntry(rule) {
  if (rule.source.start.line < removeAbove.line) {return;}

  let start = rule.source.start;
  let end = rule.source.end;
  let decls = _buildDecls(rule.nodes);
  let entry = {
    selector: rule.selector,
    selectors: rule.selectors,
    specificity: scouter.score(rule.selector),
    decls: decls,
    start: start,
    end: end
  };

  if (rule.parent.name === 'media') {
    entry.params = _buildMediaParams(rule.parent.params);
  }

  if (source.sourceMapURL) {
    entry.originalPosition = source.getOriginalPosition(start, end);
  }

  selectors.push(entry);
}

export default postcss.plugin('selector-source', (options = {}) => {
  // logs each selector with startend position
  return function(css, result) {
    css.eachComment(function(comment) {
      if (comment.text.indexOf('!ATTN') > -1) {
        removeAbove.set(comment.source.start.line);
      } else if (comment.text.indexOf('sourceMappingURL') > -1) {
        source.setSourceMapURL(options.cssRootDir, comment.text);
      }
    });

    css.eachRule(_buildRuleEntry);

    if (!source.sourceMapURL) {
      result.warn('make sure an external css source-map is being generated');
    }

    if (!options.cssRootDir) {
      result.warn('use the cssRootDir option to specify where your css source map file is');
    }

    if (options.callback && typeof(options.callback) === 'function') {
      options.callback(selectors);
    } else {
      result.warn('provide a callback to see the results');
    }

    return result;
  };
});
