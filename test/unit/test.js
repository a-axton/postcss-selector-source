import selectorList from '../../src/index';
import postcss from 'postcss';
import sass from 'node-sass';
import less from 'less';
import stylus from 'stylus';
import fs from 'fs';

var sources = {
  sass: [],
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
      selectorList({
        cssRootDir: './test/fixtures/stylus/',
        callback: function(result) {
          sources.stylus = result;
          done();
        }
      })
    ])
    .process(css)
    .then(function() {});
  });
}

function getSassData(done) {
  sass.render({
    file: './test/fixtures/scss/src/test.scss',
    sourceMap: './test/fixtures/scss/test.css.map',
    outfile: './test/fixtures/scss/test.css'
  }, function(err, results) {
    fs.writeFileSync('./test/fixtures/scss/test.css.map', results.map);

    postcss([
      selectorList({
        cssRootDir: './test/fixtures/scss/',
        callback: function(result) {
          sources.sass = result;
          done();
        }
      })
    ])
    .process(results.css.toString().trim())
    .then(function() {});
  });
}

function getLessData(done) {
  var lessInput = fs.readFileSync('./test/fixtures/less/src/test.less');
  
  less.render(lessInput.toString().trim(), {
      filename: './test/fixtures/less/src/test.less',
      includePaths: './test/fixtures/less/src'
    })
    .then(function(output) {
      fs.writeFileSync('./test/fixtures/less/test.css.map', output.map);

      postcss([
        selectorList({
          cssRootDir: './test/fixtures/less/',
          callback: function(result) {
            sources.less = result;
            done();
          }
        })
      ])
      .process(output.css.toString().trim())
      .then(function() {});
    },
    function(error) {
      console.log(error);
    });
}

function getData(done, type) {
  if (type === 'less') {
    getLessData(done);
  } else if (type === 'sass') {
    getSassData(done);
  } else if (type === 'stylus') {
    getStylusData(done);
  }
}

describe('postcss-selector-source tests', () => {
  Object.keys(sources).forEach(function(type){    
    before(function(done) {
      getData(done, type);
    });

    describe('parsing tests '+type, () => {
      it('should not be empty', () => {
        expect(sources[type].length).to.not.equal(0);
      });

      it('should cut off sources before !ATTN comment', () => {
        expect(sources[type][0].selector).to.not.equal('.should-not-include');
      });

      it('should get original starting line of selector', () => {
        expect(sources[type][0].originalPosition.start.line).to.equal(6);
      });

      it('should get original starting column of selector', () => {
        expect(sources[type][0].originalPosition.start.column).to.equal(0);
      });

      it('should get original ending line of selector', () => {
        expect(sources[type][0].originalPosition.end.line).to.equal(6);
      });

      it('should get original ending column of selector', () => {
        expect(sources[type][0].originalPosition.end.column).to.equal(17);
      });
    });
  });
});
