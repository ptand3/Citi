
const fs = require('fs');
var rimraf = require('rimraf');
var minify = require('html-minifier').minify;

const { inlineSource } = require('inline-source');

const path = require('path');
const htmlpath = path.resolve('dist/index.html');
 

 inlineSource(htmlpath, {
          compress: true,
          rootpath: path.resolve('dist'),
          // Skip all css types and png formats
          ignore: ['jpg', 'png']
        }).then(html => {
              var result = minify(html, {
                   removeAttributeQuotes: false,
                   caseSensitive: true,
                   collapseWhitespace: true,
                   removeComments: false,
                   minifyCSS: true,
                   minifyJS: true
                });

        //OPS PATCH
            datareg_one = result.replace(/"<script>/g, '"<scr" + "ipt>');
            datareg_two = datareg_one.replace(/script>"/g, 'scr" + "ipt>"');
            result = datareg_two;
        ////////////
            fs.writeFile('dist/default.htm', result, 'utf8', function (err) {
                 if (err) return console.log(err);
            });

        }).catch(err => {
          // Handle error
          console.log(err);
});

    rimraf('dist/main-styles.css.map', () => {});
    rimraf('dist/main-styles.css', () => {});
    rimraf('dist/index.html', () => {});
    rimraf('dist/js', () => {});