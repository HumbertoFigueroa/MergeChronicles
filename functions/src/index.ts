
import { onRequest } from "firebase-functions/v2/https";
import path from "path";
import express from "express";
import next from "next";

const nextApp = next({
  dev: false,
  conf: {
    distDir: path.join(
      path.dirname(require.resolve("nextn/package.json")),
      ".next"
    ),
  },
});
const handle = nextApp.getRequestHandler();

const server = express();
server.all("*", (req, res) => {
  return handle(req, res);
});

export const nextAppProxy = onRequest(server);
