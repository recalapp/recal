#!/bin/bash

# dashboard
rm -f nice/static/compiled/dashboard.js nice/static/compiled/dashboard.min.js
cat nice/static/js/*.js nice/static/js/dashboard/*.js >> nice/static/compiled/dashboard.js
#yuicompressor nice/static/compiled/dashboard.js -o nice/static/compiled/dashboard.min.js

rm -f nice/static/compiled/dashboard.css nice/static/compiled/dashboard.min.css
cat nice/static/css/*.css nice/static/css/dashboard/*.css >> nice/static/compiled/dashboard.css
#yuicompressor nice/static/compiled/dashboard.css -o nice/static/compiled/dashboard.min.css

# profile
rm -f nice/static/compiled/profile.js nice/static/compiled/profile.min.js
cat nice/static/js/*.js nice/static/js/profile/*.js >> nice/static/compiled/profile.js
#yuicompressor nice/static/compiled/profile.js -o nice/static/compiled/profile.min.js

rm -f nice/static/compiled/profile.css nice/static/compiled/profile.min.css
cat nice/static/css/*.css nice/static/css/profile/*.css >> nice/static/compiled/profile.css
#yuicompressor nice/static/compiled/profile.css -o nice/static/compiled/profile.min.css
