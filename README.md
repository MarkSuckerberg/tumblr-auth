# Typeble CLI Authenticator

A simple unofficial library/command line application that allows obtaining an OAuth2 token for use with the Tumblr API.

## Using Typeble-auth (Library)

1. Run `npm install typeble-auth --save` to install the library in your project
2. Place `import typebleAuth from "typeble-auth";` at the top of the file
3. Print the string output from `typebleAuth(args)` to the user you want to get the token from
4. Specify the function you want to run using that token with the `onSuccess()` callback argument

## Using Typeble-auth (CLI)

1. Run `npm install typeble-auth --save-dev` to install it just for development
2. Set the `CONSUMER_ID` and `CONSUMER_SECRET` environment variables to your Tumblr bot Consumer ID and secret respectively
3. Run `npx typeble-auth`
4. Accept the prompt that pops up in your default browser
5. The access token will be printed to stdout

## Arguments

| Arg           | Purpose                                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| -h --help     | Displays the help prompt explaining all the arguments.                                                                                           |
| -u --url      | The URL to redirect to (including the port, if non-standard, although the Tumblr API doesn't seem to redirect properly to addresses with ports.) |
| -p, --port    | The port to host the internal web server on. Be sure it matches the host!                                                                        |
| -w, --write   | Request the write access scope for the returned token.                                                                                           |
| -o, --offline | Request the offline_access scope for the returned token, which will return the refresh token as well if the json option is specified.            |
| -j, --json    | Instead of only printing the access token, prints the entire JSON response body, including expiry, refresh token, and similar.                   |
