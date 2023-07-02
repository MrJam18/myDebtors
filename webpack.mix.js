let mix = require('laravel-mix');

mix.js('resources/js/App.jsx', 'public/dist/js/app.js').react().options({'cssModuleIdentifier': '[name]__[local]--[hash:base64:5]'}).sourceMaps(false,'source-map').disableNotifications();
