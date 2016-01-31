import postcss from 'postcss';
import { Scouter } from 'scouter';
import Source from './Source';

let source = new Source();
let scouter = new Scouter();
let selectors = [];
let removeAbove = {
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
    if (source.smc) {
      entry.originalPosition = source.getOriginalPosition(start, end);
    }

    return entry;
  });
}

function _buildMediaParams(params) {
  params = params.match(/\((.*?)\)/g);

  if (params && params.length) {
    return params.map(param => {
      param = param.replace(/[\])(]/g, '').replace(/\s/g, '').split(':');
      return {
        property: param[0],
        value: param[1]
      };
    });
  }
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

  if (source.smc) {
    entry.originalPosition = source.getOriginalPosition(start, end);
  }

  selectors.push(entry);
}

export default postcss.plugin('selector-source', (callback) => {
  selectors = [];
  // logs each selector with startend position
  return function(css, result) {
    css.walkComments(function(comment) {
      if (comment.text.indexOf('!ATTN') > -1) {
        removeAbove.set(comment.source.start.line);
      } else if (comment.text.indexOf('sourceMappingURL') > -1) {
        source.setSourceMap(comment.text);
      }
    });

    css.walkRules(_buildRuleEntry);

    if (!source.smc) {
      result.warn('make sure an external css source-map is being generated');
    }

    if (callback && typeof(callback) === 'function') {
      callback(selectors);
    } else {
      result.warn('provide a callback to see the results');
    }

    return result;
  };
});
