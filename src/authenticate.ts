import { createServer } from "http";
import fetch from "node-fetch";

export interface AuthData {
	access_token: string;
	expires_in: number;
	token_type: string;
	scope: string;
	id_token: string;
	refresh_token?: string;
}

/**
 * Begin the process of authenticating a user. This will start a server on the specified port and return the URL to redirect the user to.
 * @param consumerID The consumer ID of your app
 * @param consumerSecret The consumer secret of your app
 * @param scopes The scopes to request, separated by spaces
 * @param redirectURI The redirect URI of your app
 * @param port The port to listen on
 * @param onSuccess A callback function to run when the user has successfully authenticated
 * @returns The URL to redirect the user to
 * @example console.log("Please visit the following URL: " + beginAuth( process.env.CONSUMER_ID, process.env.CONSUMER_SECRET, "basic write", "http://localhost:80/", 80, data => { console.log(data); }));
 */
export function beginAuth(
	consumerID: string,
	consumerSecret: string,
	scopes: string = "basic",
	redirectURI: string = "http://localhost:8787/",
	port: number = 8787,
	onSuccess: (data: AuthData) => void = () => {}
) {
	const state = Math.random().toString(36).substring(2);
	startServer(consumerID, consumerSecret, state, port, onSuccess);
	return getAuthURL(scopes, consumerID, redirectURI, state);
}

/**
 *
 * @param consumerID The consumer ID of your app
 * @param consumerSecret The consumer secret of your app
 * @param state A random string to prevent CSRF attacks (should be the same as the one used in getAuthURL)
 * @param port The port to listen on
 * @param onSuccess A callback function to run when the user has successfully authenticated
 */
function startServer(
	consumerID: string,
	consumerSecret: string,
	state: string,
	port: number,
	onSuccess: (data: AuthData) => void = () => {}
) {
	const httpServer = createServer(async (req, res) => {
		if (!req.url || !req.headers.host) {
			return;
		}
		const url = new URL(req.url, `http://${req.headers.host}`);
		const paramCode = url.searchParams.get("code");
		const paramState = url.searchParams.get("state");
		if (paramCode && paramState == state) {
			const code = paramCode;
			const data = await getAccessToken(consumerID, consumerSecret, code);
			res.end("Success! You can close this window.");
			onSuccess(data);
			httpServer.close();
		} else {
			res.end("Error: Invalid response.");
			httpServer.close();
		}
	}).listen(port);
}

/**
 *
 * @param scopes The scopes to request, separated by spaces
 * @param consumerID The consumer ID of your app
 * @param redirectURI The redirect URI of your app
 * @param state A random string to prevent CSRF attacks (should be the same as the one used in startServer)
 * @returns The URL to redirect the user to
 */
function getAuthURL(
	scopes: string = "basic",
	consumerID: string,
	redirectURI: string = "http://localhost:8787/",
	state: string = "random"
) {
	const params = new URLSearchParams({
		response_type: "code",
		client_id: consumerID,
		redirect_uri: redirectURI,
		scope: scopes,
		approval_prompt: "auto",
		state: state,
	});
	return `https://www.tumblr.com/oauth2/authorize?${params}`;
}

/**
 * Get an access token using the user's access code.
 * @param consumerID The consumer ID of your app
 * @param consumerSecret The consumer secret of your app
 * @param accessCode The access code returned by tumblr
 * @returns The access token response from tumblr
 */
async function getAccessToken(consumerID: string, consumerSecret: string, accessCode: string) {
	const response = await fetch("https://api.tumblr.com/v2/oauth2/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json",
			"User-Agent": "TumblrBotKill/0.0.1",
		},
		body: JSON.stringify({
			grant_type: "authorization_code",
			client_id: consumerID,
			client_secret: consumerSecret,
			redirect_uri: "http://localhost:8787/",
			code: accessCode,
		}),
	});
	return (await response.json()) as AuthData;
}
