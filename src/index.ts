import { createServer } from "http";
import fetch from "node-fetch";
import "dotenv/config";

function getUserToken(consumerID: string, consumerSecret: string) {
	const state = "1234567890";
	const params = new URLSearchParams({
		response_type: "code",
		client_id: consumerID,
		redirect_uri: "http://localhost:8787/",
		scope: "basic",
		approval_prompt: "auto",
		state: state,
	});
	console.log(
		`To login, open a browser and navigate to:
		https://www.tumblr.com/oauth2/authorize?${params}`
	);
	const httpServer = createServer(async (req, res) => {
		if (!req.url) {
			return;
		}
		const url = new URL(req.url, "http://localhost:8787/");
		const paramCode = url.searchParams.get("code");
		const paramState = url.searchParams.get("state");
		if (paramCode && paramState == state) {
			const code = paramCode;
			await getAccessToken(consumerID, consumerSecret, code);
			res.end("Success! You can close this window.");
			httpServer.close();
			return;
		} else {
			res.end("Error: Invalid response.");
			httpServer.close();
			return;
		}
	}).listen(80, "localhost");
}

async function getAccessToken(consumerID: string, consumerSecret: string, code: string) {
	const response = await fetch("https://api.tumblr.com/v2/oauth2/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
			"User-Agent": "TumblrBotKill/0.0.1",
		},
		body: JSON.stringify({
			grant_type: "authorization_code",
			client_id: consumerID,
			client_secret: consumerSecret,
			redirect_uri: "http://localhost:8787/",
			code: code,
		}),
	});
	const data: any = await response.json();
	if (data.error) {
		throw new Error(data.error_description);
	}
	console.log(JSON.stringify(data, null, 2));
	return data.access_token;
}

if (!process.env.CONSUMER_ID || !process.env.CONSUMER_SECRET) {
	console.error("Please set the CONSUMER_ID and CONSUMER_SECRET environment variables.");
	process.exit(1);
}

getUserToken(process.env.CONSUMER_ID, process.env.CONSUMER_SECRET);

