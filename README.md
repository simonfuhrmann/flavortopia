# Shake and Vape

Shake and Vape is a DIY e-juice mixing web application.
The website can be found at https://www.shake-and-vape.it.

Beta Notice: This is not a production site. All data stored on this site can
change or get deleted at any time.

## Development

The website can be locally served for development:

* Install NPM dependencies: `npm install`
* Install Polymer dependencies: `bower install`
* Serve the website: `polymer serve`

The website uses the Polymer JS library and heavily relies on its webcomponent
model. Firebase is used as the database backend.

## Deployment

The website is deployed by building and minifying the HTML, JS and CSS, and
uploading it to Firebase Hosting (only available to privileged users).

* Build and minify: `polymer build`
* Deploy to Firebase: `firebase depoly`

