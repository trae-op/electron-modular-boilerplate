// src/shared/utils/logger.ts
import log from "electron-log";

// Configure the logger's transports (where logs are sent).
// By default, electron-log outputs logs to the Main Process console
// and also writes them to a file within the user's standard application data directory
// (e.g., C:\Users\YourUser\AppData\Roaming\YourAppName\logs on Windows,
// or ~/Library/Application Support/YourAppName/logs on macOS).

// Set the log format for the file output.
// This format includes year, month, day, hour, minute, second, milliseconds, log level, and the message text.
log.transports.file.format = "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}";

// Set the log format for the console output.
// This ensures consistency between file logs and console logs.
log.transports.console.format =
  "[{y}-{m}-{d} {h}:{i}:{s}.{ms}] [{level}] {text}";

// Set the minimum log level for the file transport.
// Logs with a level of 'info' or higher (e.g., 'warn', 'error', 'fatal') will be written to the file.
log.transports.file.level = "info";

// Set the minimum log level for the console transport.
// In a development environment, 'debug' level is often useful to see more detailed messages.
// In a production environment, 'info' or 'warn' is typically preferred to avoid excessive console output.
log.transports.console.level =
  process.env.NODE_ENV === "development" ? "debug" : "info";

// Set the maximum size of the log file.
// When the log file exceeds this size, it will be automatically rotated (renamed and a new log file created).
log.transports.file.maxSize = 5 * 1024 * 1024; // 5 Megabytes

// Configure automatic capturing of unhandled exceptions and promise rejections.
// electron-log provides this functionality automatically when it is initialized in the Main Process.
// There is no specific 'startLogging()' method to call on `errorHandler`; it's handled implicitly.
// The `process.type === 'browser'` check ensures that this particular initialization message
// and any main process-specific configurations run only in the Main Process.
if (process.type === "browser") {
  // Log a message indicating that electron-log has been initialized for the Main Process.
  // Unhandled error capturing is a built-in feature when imported here.
  log.info(
    "Electron-log initialized in Main Process (automatic unhandled error capturing enabled).",
  );
} else {
  // Log a message indicating that electron-log has been initialized for the Renderer Process.
  log.info("Electron-log initialized in Renderer Process.");
}

// Export the configured logger instance.
// This allows other modules and files in both Main and Renderer processes to import
// and use this `logger` object to write log messages (e.g., `logger.info()`, `logger.error()`).
export { log as logger };
