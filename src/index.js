import postcss from 'postcss';
import Source from './Source';

let source = new Source();
let selectors = [];

function buildDecls(decls) {
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

function buildMediaParams(params) {
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

function buildRuleEntry(rule) {
  let start = rule.source.start;
  let end = rule.source.end;
  let decls = buildDecls(rule.nodes);
  let entry = {
    selector: rule.selector,
    selectors: rule.selectors,
    decls: decls,
    start: start,
    end: end
  };
  if (rule.parent.name === 'media') {
    entry.params = buildMediaParams(rule.parent.params);
  }
  if (source.smc) {
    entry.originalPosition = source.getOriginalPosition(start, end);
  }
  selectors.push(entry);
}

export default postcss.plugin('selector-source', (callback) => {
  selectors = [];
  return (css, result) => {
    source.smc = css.source.input;
    css.walkRules(buildRuleEntry);
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
