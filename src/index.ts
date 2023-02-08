import { beginAuth } from "./authenticate.js";
import "dotenv/config";

if (!process.env.CONSUMER_ID || !process.env.CONSUMER_SECRET) {
	console.error("Please set the CONSUMER_ID and CONSUMER_SECRET environment variables.");
	process.exit(1);
}

console.log(
	"Please visit the following URL: " +
		beginAuth(
			process.env.CONSUMER_ID,
			process.env.CONSUMER_SECRET,
			"basic write",
			"http://localhost:80/",
			80,
			data => {
				console.log(data);
			}
		)
);
