# Tumblr CLI Authenticator

A simple library/command line application that allows obtaining an OAuth2 token for use with the Tumblr API.

## Using Tumblr-auth (Library)

1. Run `npm install tumblr-auth --save` to install the library in your project
2. Place `import tumblrAuth from "tumblr-auth";` at the top of the file
3. Print the string output from `tumblrAuth(args)` to the user you want to get the token from
4. Specify the function you want to run using that token with the `onSuccess()` callback argument

## Using Tumblr-auth (CLI)

1. Run `npm install tumblr-auth --save-dev` to install it just for development
2. Set the `CONSUMER_ID` and `CONSUMER_SECRET` environment variables to your Tumblr bot Consumer ID and secret respectively
3. Run `npx tumblr-auth`
4. Accept the prompt that pops up in your default browser
5. The access token will be printed to stdout

## Arguments

| Arg          | Purpose                                                                                                                                          |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| -h --help    | Displays the help prompt explaining all the arguments.                                                                                           |
| -u --url     | The URL to redirect to (including the port, if non-standard, although the tumblr API doesn't seem to redirect properly to addresses with ports.) |
| -p, --port   | The port to host the internal web server on. Be sure it matches the host!                                                                        |
| -s, --scopes | The scopes with which the requested token will have.                                                                                             |
| -j, --json   | Instead of only printing the access token, prints the entire JSON response body, including expiry, refresh token, and similar.                   |
