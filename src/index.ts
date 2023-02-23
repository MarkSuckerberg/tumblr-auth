#!/usr/bin/env node
import typebleAuth from "./authenticate.js";
import { refreshTokenAuth } from "./authenticate.js";
import open from "open";
import "dotenv/config";
import minimist from "minimist";

const argv = minimist(process.argv.slice(2), {
	boolean: true,
	string: ["url", "refresh"],
	alias: { h: "help", u: "url", p: "port", w: "write", o: "offline", j: "json", r: "refresh" },
});

if (!process.env.CONSUMER_ID || !process.env.CONSUMER_SECRET) {
	console.error("Please set the CONSUMER_ID and CONSUMER_SECRET environment variables.");
	process.exit(1);
}

if (argv.help) {
	console.log("Usage: npx typeble-auth [options]");
	console.log("Options:");
	console.log(
		"  -u, --url      The url to redirect to in the OAuth request (default: http://localhost:80/)"
	);
	console.log("  -p, --port     The port to listen on (default: 80)");
	console.log("  -w, --write    Request the write scope");
	console.log("  -o, --offline  Request the offline_access scope");
	console.log("  -j, --json     Output the full JSON response instead of just the access token");
	console.log("  -h, --help     Show this help message");
	console.log("  -r, --refresh  Get a new access token using a refresh token");
	process.exit(0);
}

const port = argv.port || 80;
const redirectURI = argv.url || "http://localhost:80/";
const scopes = "basic" + (argv.write ? " write" : "") + (argv.offline ? " offline_access" : "");
const refreshToken = argv.refresh;

if (refreshToken) {
	refreshTokenAuth(process.env.CONSUMER_ID, process.env.CONSUMER_SECRET, refreshToken, data => {
		console.log(argv.json ? data : data.access_token);
	});
} else {
	open(
		typebleAuth(
			process.env.CONSUMER_ID,
			process.env.CONSUMER_SECRET,
			scopes,
			redirectURI,
			port,
			data => {
				console.log(argv.json ? data : data.access_token);
			}
		)
	);
}
