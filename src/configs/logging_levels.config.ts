/**
 * - ERROR: (highest level) used for critical errors
 * - WARNING: used for warnings
 * - INFO: used for generic information
 * - HTTP: used to log HTTP requests
 * - VERBOSE: used to log verbose messages
 * - DEBUG: used to log debug messages
 * - SILLY: (lowest level) used to log very detailed messages
 */

enum LoggingLevels {
    ERROR = "error",
    WARNING = "warn",
    INFO = "info",
    HTTP = "http",
    VERBOSE = "verbose",
    DEBUG = "debug",
    SILLY = "silly",
}

export default LoggingLevels;