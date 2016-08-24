# About #
Proof of concept for modern client-side api-driven Whirlpool forums.
Currently only the Forum Index and Thread Index views are implemented due to limitations in the public API.

# Usage #
* Try online: https://bohdyone.github.io/whirlpool-new/dist/index.html
* Or, run `index.html` from `dist/`.
* Or, to serve from local web server, run `npm start` and go to http://localhost:8080/.
* When prompted, enter your API key from https://whirlpool.net.au/profile/. This will then be saved as a site cookie.

# Build #

## Download Dependencies
1. Run `npm install`.

## Development ##
* Run `npm run build`.
* To watch for changes and recompile the .js bundle run `npm run watch`.

## Production ##
* Run `npm run buil_prod` to produce minified bundle.

## Clean ##
* Run `npm run clean` to remove files generated in build.
