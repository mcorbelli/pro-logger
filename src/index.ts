import DailyRotateFile from "winston-daily-rotate-file";
import { Logger, format, createLogger, transports } from "winston";
import { isEmpty, isNil } from "lodash";

import LoggingLevels from "./configs/logging_levels.config";
import HttpCodes, { HttpFirstDigit } from "./configs/http_codes.config";

interface ILoggerProps {
    initialLevel: LoggingLevels,
    fileDirname: string,
}
    
class CustomLogger {
    private readonly logger: Logger;
    
    constructor(props: ILoggerProps) {

        this.logger = createLogger({
            level: props.initialLevel,
            format: CustomLogger.logFormat,
            transports: [
                new DailyRotateFile({
                    filename: "logs/%DATE%.log",
                    dirname: props.fileDirname,
                    datePattern: "YYYY-MM-DD",
                }),
            ]
        });

        if (process.env.NODE_ENV !== "production") {

            this.logger.add(new transports.Console({
                format: format.combine(
                    format.colorize(),
                    CustomLogger.logFormat,
                ),
            }));

        }

    }

    private static logFormat = format.combine(
        format.timestamp({
            format: "HH:mm:ss",
        }),
        format.printf((info) => {
    
            const { timestamp, level, message, ...meta } = info;
            let msg = `[ ${timestamp} ] [ ${level} ]: ${message}`;
            
            if (!isEmpty(meta) && !isNil(meta)) {
                msg == `${msg} - ${JSON.stringify(meta, null, 2)}`;
            }
    
            return msg;
    
        }),
        
    );

    /**
     * @method setLogLevel
     * 
     * Sets the log level of the logger instance to the specified level. The parameter
     * must be a string representing the log level to set. Must be one of 'error', 'warn',
     * 'info', 'http', 'verbose', 'debug', or 'silly'.
     */

    public setLogLevel(level: LoggingLevels): void {
        this.logger.level = level;
    }

    /**
     * @method trace
     * 
     * The TRACE log level captures all the details about the behavior of
     * the application. It is mostly diagnostic and is more granular and finer
     * than DEBUG log level. This log level is used in situations where you
     * need to see what happened in your application or what happened in the third-party
     * libraries used. You can use the TRACE log level to query parameters in the
     * code or interpret the algorithm’s steps.
     */
    
    trace(msg: string) {
        this.logger.log("trace", msg);
    }

    /**
     * @method debug
     * 
     * With DEBUG, you are giving diagnostic information in a detailed manner.
     * It is verbose and has more information than you would need when using the
     * application. DEBUG logging level is used to fetch information needed to diagnose,
     * troubleshoot, or test an application. This ensures a smooth running application.
     */
    
    debug(msg: string) {
        this.logger.debug(msg);
    }

    /**
     * @method info
     * 
     * INFO messages are like the normal behavior of applications. They state what happened.
     * For example, if a particular service stopped or started or you added something to the database.
     * These entries are nothing to worry about during usual operations. The information logged
     * using the INFO log is usually informative, and it does not necessarily require you to follow up on it.
     */
    
    info(msg: string) {
        this.logger.info(msg);
    }

    /**
     * @method warn
     * 
     * The WARN log level is used when you have detected an unexpected application problem.
     * This means you are not quite sure whether the problem will recur or remain. You may not
     * notice any harm to your application at this point. This issue is usually a situation that
     * stops specific processes from running. Yet it does not mean that the application has been harmed.
     * In fact, the code should continue to work as usual. You should eventually check these warnings
     * just in case the problem reoccurs.
     */
    
    warn(msg: string) {
        this.logger.warn(msg);
    }

    /**
     * @method error
     * 
     * Unlike the FATAL logging level, error does not mean your application is aborting. Instead,
     * there is just an inability to access a service or a file. This ERROR shows a failure of something
     * important in your application. This log level is used when a severe issue is stopping functions
     * within the application from operating efficiently. Most of the time, the application will
     * continue to run, but eventually, it will need to be addressed.
     */
    
    error(msg: string) {
        this.logger.error(msg);
    }

    /**
     * @method fatal
     * 
     * FATAL means that the application is about to stop a serious problem or corruption
     * from happening. The FATAL level of logging shows that the application’s situation is catastrophic,
     * such that an important function is not working. For example, you can use FATAL log level if the
     * application is unable to connect to the data store.
     */
    
    fatal(msg: string) {
        this.logger.log("fatal", msg);
    }

    /**
     * @method rest
     * 
     * REST retrieves the correct logger based on the http code passed in.
     * By doing so, the correct logger will be invoked based on the call answer code.
     */
    
    rest(http_code: HttpCodes, msg: string) {
        switch (HttpCodes.getFirstDigit(http_code)) {
            case HttpFirstDigit.SUCCESSFUL:
                this.logger.info(msg);
                break;
            case HttpFirstDigit.REDIRECTION:
                this.logger.warn(msg);
                break;
            case HttpFirstDigit.CLIENT_ERROR:
            case HttpFirstDigit.SERVER_ERROR:
                this.logger.error(msg);
                break;
            default:
                this.logger.info(msg);
                break;
        }
    }
}

export {
    LoggingLevels,
    HttpCodes,
}

export default CustomLogger;