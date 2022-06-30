import { createLogger, format, transports } from 'winston';

const customFormat = format.combine(
    format.timestamp({
        format: "HH:mm:ss + SSS",
    }),
    format.printf((info) => {
        const level = (info.level || "DEFAULT").toUpperCase();
        return `[ ${info.timestamp} ] - ${level}: ${info.message}`;
    }),
)

const logger = createLogger({
    format: customFormat,
    transports: [
        new transports.File({
            filename: "logs/combined.log",
        }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.colorize(),
    }));
}

module.exports = logger;