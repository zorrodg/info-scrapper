/**
 * Gets information about USD TRM conversion to COP
 * @author Andres Zorro <zorrodg@gmail.com>
 */

const logger = require('debug-logger')('scrapper');
const fetch = require('node-fetch');
const moment = require('moment');
const cheerio = require('cheerio');
const SCRAPE_URL = 'https://dolar.wilkinsonpc.com.co/dolar-historico/dolar-historico-{{year}}.html';

moment.locale('es');

module.exports = {
    params: '',
    fn: async function (req, res) {
        try {
            const date = moment(req.query.date || undefined);

            if (!date.isValid()) {
                const err = new Error('Invalid date');
                err.statusCode = 400;
                throw err;
            }

            const url = SCRAPE_URL.replace('{{year}}', date.year());

            logger.log('Scraping:', url);

            let $ = await fetch(url);
            $ = await $.text();
            $ = cheerio.load($);

            let dias = $('#tabla_dh [class^="dh_col_fecha"]').map(function () {
                const $dia = $(this);
                const fecha = $dia.text();
                const precio = $dia.next().text();

                return {
                    date: moment(fecha.toLowerCase(), 'DD MMMM YYYY'),
                    value: Number.parseFloat(precio.replace(/[$,]*/g, '').trim())
                };
            });

            dias = Array.from(dias);
            let trm = dias.find((d) => d.date.isSame(date, 'days'));

            logger.log('Found date?', trm);

            res.send(trm);
        } catch (err) {
            res.send(err.statusCode || 500, {
                message: err.message || 'Internal Server Error',
                stack: err.stack
            });
        }
    }
};
