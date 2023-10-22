import winston from "winston";
import { CONFIG } from "../config/config.js";

const levelOptions = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
  colors: {
    fatal: "red",
    error: "red",
    warning: "yellow",
    info: "blue",
    http: "green",
    debug: "white",
  },
};

winston.addColors(levelOptions.colors);

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.printf((info) => {
    return `${info.level}: ${info.message} - Time: ${info.timestamp}`;
  })
);

const developmentLogger = winston.createLogger({
  levels: levelOptions.levels,
  format: logFormat,
  transports: [
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        logFormat
      ),
    }),
    new winston.transports.File({
      filename: "errors.Development.log",
      level: "error",
      format: logFormat,
    }),
  ],
});

const productionLogger = winston.createLogger({
  format: logFormat,
  transports: [
    new winston.transports.Console({
      level: "info",
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        logFormat
      ),
    }),
    new winston.transports.File({
      filename: "errors.Production.log",
      level: "error",
      format: logFormat,
    }),
  ],
});

let activeLogger = developmentLogger;

if (CONFIG.NODE_ENV === "production") {
  activeLogger = productionLogger;
}

export const addLogger = (req, res, next) => {
  req.logger = activeLogger;
  next();
};
