import selectorList from '../../src/index';
import postcss from 'postcss';
import sass from 'node-sass';
import fs from 'fs';

describe('postcss-selector-source tests', () => {
  describe('parsing tests', () => {
    var selectors;

    before(function(done) {
      sass.render({
        file: './test/fixtures/scss/test.scss',
        sourceMap: './test/fixtures/test.css.map',
        outfile: './test/fixtures/test.css'
      }, function(err, results) {
        fs.writeFileSync('./test/fixtures/test.css.map', results.map);

        postcss([
          selectorList({
            cssRootDir: './test/fixtures/',
            callback: function(result) {
              selectors = result;
              console.log(JSON.stringify(selectors[0]))
              done();
            }
          })
        ])
        .process(results.css.toString().trim())
        .then(function() {});
      });
    });

    it('should not be empty', () => {
      expect(selectors.length).to.not.equal(0);
    });

    it('should cut off sources before !ATTN comment', () => {
      expect(selectors[0].selector).to.not.equal('.should-not-include');
    });

    it('should get original starting line of selector', () => {
      expect(selectors[0].originalPosition.start.line).to.equal(6);
    });

    it('should get original starting column of selector', () => {
      expect(selectors[0].originalPosition.start.column).to.equal(0);
    });

    it('should get original ending line of selector', () => {
      expect(selectors[0].originalPosition.end.line).to.equal(6);
    });

    it('should get original ending column of selector', () => {
      expect(selectors[0].originalPosition.end.column).to.equal(17);
    });
  });

  describe('missing options', () => {
    var result;

    before(function(done) {
      sass.render({
        file: './test/fixtures/scss/test.scss',
        sourceMap: './test/fixtures/test.css.map',
        outfile: './test/fixtures/test.css'
      }, function(err, results) {
        fs.writeFileSync('./test/fixtures/test.css.map', results.map);

        postcss([
          selectorList()
        ])
        .process(results.css.toString().trim())
        .then(function(postCSSresults) {
          result = postCSSresults;
          done();
        });
      });
    });

    it('should warn about missing cssRootDir option', () => {
      expect(result.messages[0].text).to.equal('use the cssRootDir option to specify where your css source map file is');
    });

    it('should warn about missing callback', () => {
      expect(result.messages[1].text).to.equal('provide a callback to see the results');
    });
  });
});
