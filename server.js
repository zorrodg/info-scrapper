/**
 * Scrape All Things!
 * @author Andres Zorro <zorrodg@gmail.com>
 */

const restify = require('restify');
const { promisify } = require('util');
const { resolve, relative } = require('path');
const readdir = promisify(require('fs').readdir);
const logger = require('debug-logger')('scrapper');

const { PORT } = require('./config/env');
const server = restify.createServer();

server.use(require('restify-plugins').queryParser());

readdir(resolve(__dirname, 'routes'))
.then((paths) => {
    for (let path of paths) {
        let scrapper = require('./' + relative(__dirname, `routes/${path}`));
        server.get(`/${path}/${scrapper.params}`, scrapper.fn);
    }

    server.get('.*', (req, res) => res.sendRaw('Welcome to Scrapperland!'));

    server.listen(PORT, () => {
      logger.log('%s listening to %s', server.name, server.url);
    });
});
