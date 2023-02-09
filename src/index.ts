#!/usr/bin/env node
import { beginAuth } from "./authenticate.js";
import open from "open";
import "dotenv/config";
import minimist from "minimist";

const argv = minimist(process.argv.slice(2), {
	boolean: true,
	string: ["host", "scopes"],
	alias: { h: "host", p: "port", s: "scopes" },
});

if (!process.env.CONSUMER_ID || !process.env.CONSUMER_SECRET) {
	console.error("Please set the CONSUMER_ID and CONSUMER_SECRET environment variables.");
	process.exit(1);
}

if (argv.help) {
	console.log("Usage: node index.js [options]");
	console.log("Options:");
	console.log("  -h, --host     The host to listen on (default: http://localhost:80/)");
	console.log("  -p, --port     The port to listen on (default: 80)");
	console.log(
		"  -s, --scopes   The scopes to request, separated by spaces (default: basic write)"
	);
	process.exit(0);
}

const port: number = argv.p || argv.port || 80;
const host = argv.h || argv.host || "http://localhost:80/";
const scopes = argv.s || argv.scopes || "basic write";

open(
	beginAuth(process.env.CONSUMER_ID, process.env.CONSUMER_SECRET, scopes, host, port, data => {
		console.log(data);
	})
);
