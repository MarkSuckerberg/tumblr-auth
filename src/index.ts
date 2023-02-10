#!/usr/bin/env node
import tumblrAuth from "./authenticate.js";
import open from "open";
import "dotenv/config";
import minimist from "minimist";

const argv = minimist(process.argv.slice(2), {
	boolean: true,
	string: ["scopes", "url"],
	alias: { h: "help", u: "url", p: "port", s: "scopes", j: "json" },
});

if (!process.env.CONSUMER_ID || !process.env.CONSUMER_SECRET) {
	console.error("Please set the CONSUMER_ID and CONSUMER_SECRET environment variables.");
	process.exit(1);
}

if (argv.help) {
	console.log("Usage: npx tumblr-auth [options]");
	console.log("Options:");
	console.log(
		"  -u, --url      The url to redirect to in the OAuth request (default: http://localhost:80/)"
	);
	console.log("  -p, --port     The port to listen on (default: 80)");
	console.log("  -s, --scopes   The scopes to request, separated by spaces (default: basic)");
	console.log("  -j, --json     Output the full JSON response instead of just the access token");
	console.log("  -h --help      Show this help message");
	console.log(JSON.stringify(process.argv, null, 2));
	process.exit(0);
}

const port = argv.port || 80;
const redirectURI = argv.url || "http://localhost:80/";
const scopes = argv.scopes || "basic";

open(
	tumblrAuth(
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
