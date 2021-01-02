const path = require("path");
const { override, addWebpackAlias } = require("customize-cra");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");

const paths = require("react-scripts/config/paths");

/**
 * Get param named with prefix 'REACT_APP_' in `.env` file
 * @param {*} name Variable name
 * @param {*} parsable Is parsable with JSON.parse()
 */
const getReactAppParam = (name, parsable = false) => {
  name =
    "REACT_APP_" +
    name
      .trim("_")
      .split(/(?<=[a-z])(?=[A-Z])/g)
      .join("_")
      .toUpperCase();

  let param = process.env[name];
  if (undefined === param) {
    throw new Error(`Undefined the param "${name}" in .env file!`);
  }
  try {
    parsable && (param = JSON.parse(param));
  } catch (err) {
    throw new Error(
      `The param "${name}" with value "${param}" can't be parsed by JSON.parse()!`
    );
  }
  return param;
};

/**
 * Clear the original plugins for single entry
 * @param {*} plugins From config.plugins
 * @param {*} name The name of plugin which should be cleared
 */
const clearOriginalPlugins = (plugins, name) => {
  return plugins.filter(
    (it) =>
      !(it.constructor && it.constructor.name && name === it.constructor.name)
  );
};

/**
 * Modify entry configurations
 * @param {*} env Environment variable
 */
const getEntryConfigFactory = (env) => {
  const arr =
    "development" === env
      ? [require.resolve("react-dev-utils/webpackHotDevClient")]
      : [];
  return (index) => {
    return [...arr, `${paths.appSrc}/${index}`];
  };
};

/**
 * Modify HtmlWebpackPlugin configurations
 * @param {*} env Environment variable
 */
const getHtmlWebpackPluginFactory = (env) => {
  const minify = {
    removeComments: true,
    collapseWhitespace: true,
    removeRedundantAttributes: true,
    useShortDoctype: true,
    removeEmptyAttributes: true,
    removeStyleLinkTypeAttributes: true,
    keepClosingSlash: true,
    minifyJS: true,
    minifyCSS: true,
    minifyURLs: true,
  };
  const config = Object.assign(
    {},
    { inject: true, template: paths.appHtml },
    "development" !== env ? { minify } : undefined
  );
  return (entry) => {
    return new HtmlWebpackPlugin({
      ...config,
      chunks: ["vendors", `runtime~${entry}.html`, entry],
      filename: `${entry}.html`,
    });
  };
};

/**
 * Modify ManifestPlugin configurations
 * @param {*} env Environment variable
 */
const genManifestPlugin = (env) => {
  return new ManifestPlugin({
    fileName: "asset-manifest.json",
    publicPath: "development" === env ? paths.servedPath : "/",
    generate: (seed, files, entrypoints) => {
      const manifestFiles = files.reduce((acc, { name, path }) => {
        acc[name] = path;
        return acc;
      }, seed);

      const entrypointFiles = Object.entries(entrypoints).reduce(
        (acc, [entrypoint, files]) => {
          acc[entrypoint] = files.filter(
            (filename) => !filename.endsWith(".map")
          );
          return acc;
        },
        {}
      );

      return {
        files: manifestFiles,
        entrypoints: entrypointFiles,
      };
    },
  });
};

const multiEntry = getReactAppParam("multiEntry", true);
const pathsAlias = getReactAppParam("pathsAlias", true);
const appIndex = getReactAppParam("index");

const hasAppIndex = !!appIndex;
const hasMultiEntry =
  !!multiEntry &&
  "object" === typeof multiEntry &&
  "{}" !== JSON.stringify(multiEntry);
const hasPathsAlias =
  !!pathsAlias &&
  "object" === typeof pathsAlias &&
  "{}" !== JSON.stringify(pathsAlias);

if (hasAppIndex) {
  // Modify the default entry file and root directory
  paths.appIndexJs = `${paths.appSrc}/${appIndex}`;
  paths.servedPath = "./";
}

/**
 * Support multiple entry
 * Key points:
 * - Clear the original HtmlWebpackPlugin configuration in `config.plugins`.
 * - Expand `config.entry` from the original array to an object (each key represents an entry).
 * - Adde `[name]` variable to the filename attribute in `config.output` to distinguish the output entry name
 * ` (here, the JS file of each entry is compiled separately according to entry name).
 * @param {*} config Webpack Configurations
 * @param {*} env Environment variable
 */
const supportMultiEntry = (config, env) => {
  if (!hasMultiEntry) {
    return config;
  }
  // Clear the original plugins for single entry
  config.plugins = clearOriginalPlugins(config.plugins, "HtmlWebpackPlugin");
  config.plugins = clearOriginalPlugins(config.plugins, "ManifestPlugin");

  const genEntryConfig = getEntryConfigFactory(env);
  const genHtmlWebpackPlugin = getHtmlWebpackPluginFactory(env);
  config.entry = {};
  Object.entries(multiEntry).forEach(([name, index]) => {
    // Add new entry
    config.entry[name] = genEntryConfig(index);
    // Add HtmlWebpackPlugin with new configurations for multiple entry
    config.plugins.push(genHtmlWebpackPlugin(name));
  });
  // Add ManifestPlugin with new configurations for multiple entry
  config.plugins.push(genManifestPlugin(env));

  if ("development" === env) {
    config.output.path = paths.appBuild;
    config.output.filename = "static/js/[name].bundle.js";
    config.output.chunkFilename = "static/js/[name].chunk.js";
  }
  return config;
};

module.exports = {
  webpack: override(
    supportMultiEntry,
    addWebpackAlias(
      hasPathsAlias
        ? Object.entries(pathsAlias).reduce((acc, [key, dir]) => {
            acc[key] = path.join(__dirname, dir); // use absolute path
            return acc;
          }, {})
        : {}
    ) // Configure path alias
  ),
  // Modify Webpack Dev Server configurations
  devServer: (getConfig) => {
    return (proxy, allowedHost) => {
      const config = getConfig(proxy, allowedHost);
      // Redirect URL to `/build/<entry>.html` (The HTML file path output by the HtmlWebpackPlugin)
      if (hasMultiEntry) {
        config.historyApiFallback.rewrites = Object.keys(multiEntry).map(
          (entry) => ({
            from: new RegExp(`^\\/${entry}\\.html`),
            to: `/build/${entry}.html`,
          })
        );
      }
      return config;
    };
  },
};