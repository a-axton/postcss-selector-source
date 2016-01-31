var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var postcss = _interopRequire(require("postcss"));

var Source = _interopRequire(require("./Source"));

var source = new Source();
var selectors = [];

function buildDecls(decls) {
  return decls.map(function (decl) {
    var start = decl.source.start;
    var end = decl.source.end;
    var important = decl.important ? true : false;
    var entry = {
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
    return params.map(function (param) {
      param = param.replace(/[\])(]/g, "").replace(/\s/g, "").split(":");
      return {
        property: param[0],
        value: param[1]
      };
    });
  }
}

function buildRuleEntry(rule) {
  var start = rule.source.start;
  var end = rule.source.end;
  var decls = buildDecls(rule.nodes);
  var entry = {
    selector: rule.selector,
    selectors: rule.selectors,
    decls: decls,
    start: start,
    end: end
  };
  if (rule.parent.name === "media") {
    entry.params = buildMediaParams(rule.parent.params);
  }
  if (source.smc) {
    entry.originalPosition = source.getOriginalPosition(start, end);
  }
  selectors.push(entry);
}

module.exports = postcss.plugin("selector-source", function (callback) {
  selectors = [];
  return function (css, result) {
    source.smc = css.source.input;
    css.walkRules(buildRuleEntry);
    if (!source.smc) {
      result.warn("make sure an external css source-map is being generated");
    }
    if (callback && typeof callback === "function") {
      callback(selectors);
    } else {
      result.warn("provide a callback to see the results");
    }
    return result;
  };
});