const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");

const logFilePath = "./logs/server.log"; // Define log file path

// Ensure logs directory exists
if (!fs.existsSync("./logs")) {
  fs.mkdirSync("./logs");
}

// Function to append logs to a file
function appendLog(message) {
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logFilePath, `[${timestamp}] ${message}\n`, "utf8");
}

// Override console.log
const oldConsoleLog = console.log;
console.log = (...args) => {
  oldConsoleLog(...args);
  appendLog(
    args
      .map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : arg))
      .join(" ")
  );
};

// Override console.error
const oldConsoleError = console.error;
console.error = (...args) => {
  oldConsoleError(...args);
  // Use a different prefix or formatting if desired
  appendLog(
    "ERROR: " +
      args
        .map((arg) => (typeof arg === "object" ? JSON.stringify(arg) : arg))
        .join(" ")
  );
};

const dev = process.env.NODE_ENV !== "production";
const hostname =
  process.env.NODE_ENV !== "production" ? "localhost" : process.env.HOSTNAME;
const port = process.env.PORT || 3003;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const parsedUrl = parse(req.url, true);
      const { pathname, query } = parsedUrl;

      if (pathname === "/a") {
        await app.render(req, res, "/a", query);
      } else if (pathname === "/b") {
        await app.render(req, res, "/b", query);
      } else {
        await handle(req, res, parsedUrl);
      }
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  })
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});