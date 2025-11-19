import Elysia from "elysia";
import logixlysia from "logixlysia";
import { IS_PROD } from "../constants";

export const logPlugin = (app: Elysia) => {
  return app.use(
    logixlysia({
      config: {
        showStartupMessage: true,
        startupMessageFormat: "simple",
        timestamp: {
          translateTime: "yyyy-mm-dd HH:MM:ss",
        },
        ip: true,
        logFilePath: IS_PROD
          ? "/var/log/elysia-example/elysia-example.log"
          : "./logs/elysia-example.log",
        logRotation: {
          maxSize: "10m",
          interval: "1d",
          maxFiles: "7d",
          compress: true,
        },
        customLogFormat:
          "🦊 {now} {level} {duration} {method} {pathname} {status} {message} {ip} {epoch}",
        logFilter: {
          level: IS_PROD ? ["ERROR", "WARNING"] : ["INFO", "WARN", "ERROR"],
          // status: [500, 404],
          // method: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        },
      },
    })
  );
};
