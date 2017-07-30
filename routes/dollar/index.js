/**
 * Gets information about USD TRM conversion to COP
 * @author Andres Zorro <zorrodg@gmail.com>
 */

const logger = require('debug-logger')('scrapper');
const SCRAPE_URL = 'https://dolar.wilkinsonpc.com.co/dolar-historico/dolar-historico-{{year}}.html';

module.exports = {
    params: '',
    fn(req, res) {
        res.send({
            date: req.query.date,
            USD: 1234
        });
    }
};
