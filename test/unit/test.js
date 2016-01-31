import selectorList from '../../src/index';
import postcss from 'postcss';
import sass from 'node-sass';
import less from 'less';
import stylus from 'stylus';
import fs from 'fs';

var sources = {
  sass: [],
  scss: [],
  less: [],
  stylus: []
};

function getStylusData(done) {
  var stylusInput = fs.readFileSync('./test/fixtures/stylus/src/test.styl');

  var style = stylus(stylusInput.toString().trim())
    .set('filename', './test/fixtures/stylus/test.styl')
    .set('paths', ['./test/fixtures/stylus/src/'])
    .set('sourcemap', true);

  style.render(function(err, css) {
    fs.writeFileSync('./test/fixtures/stylus/test.css.map', JSON.stringify(style.sourcemap));
    postcss([
      selectorList(function(result) {
        sources.stylus = result;
        done();
      })
    ])
    .process(css)
    .then(function() {});
  });
}

function getScssData(done) {
  sass.render({
    file: './test/fixtures/scss/src/test.scss',
    sourceMap: './test/fixtures/scss/test.css.map',
    outfile: './test/fixtures/scss/test.css',
    outputStyle: 'expanded',
    sourceMapEmbed: true
  }, function(err, results) {
    fs.writeFileSync('./test/fixtures/scss/test.css', results.css.toString().trim());
    postcss([
      selectorList(function(result) {
        sources.scss = result;
        done();
      })
    ])
    .process(results.css.toString().trim())
    .then(function() {});
  });
}

function getSassData(done) {
  sass.render({
    file: './test/fixtures/sass/src/test.sass',
    sourceMap: './test/fixtures/sass/test.css.map',
    outfile: './test/fixtures/sass/test.css',
    outputStyle: 'expanded',
    sourceMapEmbed: true
  }, function(err, results) {
    fs.writeFileSync('./test/fixtures/sass/test.css', results.css.toString().trim());
    postcss([
      selectorList(function(result) {
        sources.sass = result;
        done();
      })
    ])
    .process(results.css.toString().trim())
    .then(function() {});
  });
}

function getLessData(done) {
  var lessInput = fs.readFileSync('./test/fixtures/less/src/test.less');

  less.render(lessInput.toString(), {
      filename: './test/fixtures/less/src/test.less',
      includePaths: './test/fixtures/less/src',
      sourceMap: {
        sourceMapFileInline: true
      }
    })
    .then(function(output) {
      fs.writeFileSync('./test/fixtures/less/test.css', output.css);
      postcss([
        selectorList(function(result) {
          sources.less = result;
          done();
        })
      ])
      .process(output.css)
      .then(function() {});
    },
    function(error) {
      console.log(error);
    });
}

function getData(done, type) {
  let get = {
    less: getLessData,
    scss: getScssData,
    sass: getSassData,
    stylus: getStylusData,
  }
  get[type](done);
}

describe('postcss-selector-source tests', () => {
  Object.keys(sources).forEach(function(type){
    before(function(done) {
      getData(done, type);
    });

    describe('parsing tests ' + type, () => {
      it('should not be empty', () => {
        expect(sources[type].length).to.not.equal(0);
      });

      it('should get original starting line of selector', () => {
        expect(sources[type][0].originalPosition.start.line).to.equal(1);
      });

      it('should get original starting column of selector', () => {
        expect(sources[type][0].originalPosition.start.column).to.equal(0);
      });

      it('should get original ending line of selector', () => {
        if (type === 'less' || type === 'stylus') {
          expect(sources[type][0].originalPosition.end).to.equal(null);
        } else {
          expect(sources[type][0].originalPosition.end.line).to.equal(1);
        }
      });

      it('should get original ending column of selector', () => {
        if (type === 'less' || type === 'stylus') {
          expect(sources[type][0].originalPosition.end).to.equal(null);
        } else {
          expect(sources[type][0].originalPosition.end.column).to.equal(17);
        }
      });

      it('should register properties as important', () => {
        expect(sources[type][1].decls[1].important).to.equal(true);
      });
    });
  });
});
