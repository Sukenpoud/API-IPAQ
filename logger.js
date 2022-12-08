const pino = require('pino');

module.exports = pino(
    {
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: false,
                destination: `${__dirname}/combined.log`
              }
        },
    }
);