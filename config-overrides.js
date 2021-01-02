const  path = require('path');
const { override, addWebpackAlias } = require('customize-cra');

module.exports = {
  webpack: override(
    addWebpackAlias({
        '@': path.join(__dirname, "src")
    }), // Configure path alias
  ),
};