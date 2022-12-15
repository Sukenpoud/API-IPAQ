const pino = require('pino');

module.exports = pino(
    {
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: false,
                translateTime:'SYS:standard',
                destination: `${__dirname}/combined.log`
              }
        },
    }
);