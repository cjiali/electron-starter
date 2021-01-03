# Work in progress

- 使用 [create-react-app](https://create-react-app.dev/docs/getting-started) 工具快速创建 react + typescript 项目
- 使用 [node-sass](https://sass-lang.com/install) 作为 CSS 预处理器
- 使用 [react-app-rewired](https://github.com/timarney/react-app-rewired#readme) 重连 react app 以便于复写 create-react-app 配置
- 使用 [customize-cra](https://github.com/arackaf/customize-cra) 扩展 create-react-app 配置以便于支持多页应用
- 使用 [cross-env](https://github.com/kentcdodds/cross-env#readme) 工具区分开发环境和生产环境
- 使用 [concurrently](https://github.com/kimmobrunfeldt/concurrently#readme) 让所有脚本同步触发（只用开一个端口就可启动程序）
- 使用 [wait-on](https://github.com/jeffbski/wait-on#readme) 等待渲染进程执行完后再运行主进程
- 使用 [nodemon](https://github.com/remy/nodemon#nodemon) 监听 build 目录变化（每次目录变化就重新运行主程序）
- 使用 [gulp](https://gulpjs.com/docs/en/getting-started/watching-files) 进行主进程代码的自动化构建
- 使用 [electron](https://www.electronjs.org/docs) 环境进行桌面开发
- 使用 [electron-builder](https://www.electron.build/) 进行项目打包
- 使用 [husky](https://github.com/typicode/husky#readme) 实现各种 Git Hooks 以便于执行自定义操作
- 使用 [lint-staged](https://github.com/okonet/lint-staged) 对 Git 暂存区中的文件执行代码检测
- 使用 [eslint](https://eslint.org/docs/user-guide/) 进行代码校验
- 使用 [prettier](https://prettier.io/docs/en/index.html) 进行代码格式化
  
> 使用 eslint-config-prettier 处理 eslint 与 prettier 的规则冲突

- 使用 [codecov](https://docs.codecov.io/docs) 生成测试覆盖率
- 使用 [Github Actions](https://docs.github.com/en/free-pro-team@latest/actions) 作 CI/CD

## 初始化项目 | Initialize project

```sh
yarn global add create-react-app
# or
npm install create-react-app --global

# Start a new TypeScript app using templates
create-react-app electron-starter --template typescript
```

国内下载安装某些包容易失败（如：node-sass、electron），建议更换 Yarn 或 Npm 镜像源。

It is easy to fail to download and install certain packages in China (such as node-sass, electron). It is recommended to replace the Yarn or Npm mirror source.

**.yarnrc:**

```text
registry "https://registry.npm.taobao.org"

sass_binary_site "https://npm.taobao.org/mirrors/node-sass/"
phantomjs_cdnurl "http://cnpmjs.org/downloads"
electron_mirror "https://npm.taobao.org/mirrors/electron/"
sqlite3_binary_host_mirror "https://foxgis.oss-cn-shanghai.aliyuncs.com/"
profiler_binary_host_mirror "https://npm.taobao.org/mirrors/node-inspector/"
chromedriver_cdnurl "https://cdn.npm.taobao.org/dist/chromedriver"
```

**.npmrc:**

```text
registry="https://registry.npm.taobao.org"

sass_binary_site="https://npm.taobao.org/mirrors/node-sass/"
phantomjs_cdnurl="http://cnpmjs.org/downloads"
electron_mirror="https://npm.taobao.org/mirrors/electron/"
sqlite3_binary_host_mirror="https://foxgis.oss-cn-shanghai.aliyuncs.com/"
profiler_binary_host_mirror="https://npm.taobao.org/mirrors/node-inspector/"
chromedriver_cdnurl="https://cdn.npm.taobao.org/dist/chromedriver"
```

### 添加 Sass | Add Sass

> [使用 Sass 作为 CSS 预处理器 | Use Sass as a CSS preprocessor](https://create-react-app.dev/docs/adding-a-sass-stylesheet)

```shell
yarn add node-sass
# or
npm install node-sass --save
```

> 可在 [.env](https://github.com/facebook/create-react-app/blob/master/docusaurus/docs/adding-custom-environment-variables.md) 文件中添加 SASS_PATH 变量，如此从 `node_modules` 导入时即可不用 ~ 前缀。
>
> Add the SASS PATH variable to the [.env](https://github.com/facebook/create-react-app/blob/master/docusaurus/docs/adding-custom-environment-variables.md) file, so we don’t need the ~ prefix when importing from `node_modules`.

**.env:**

```text
SASS_PATH=node_modules:src
```

## 重连 React App | Rewire React App

**安装依赖** | Install dependencies

> 使用 [react-app-rewired](https://github.com/timarney/react-app-rewired#readme) 重新连线 react app 以便于复写 create-react-app 配置。
> Use [react-app-rewired](https://github.com/timarney/react-app-rewired#readme) to rewire react app for easy replication of the create-react-app configuration.

```shell
yarn add react-app-rewired --dev
# or
npm install react-app-rewired --save-dev
```

**编辑文件（夹）** | Edit files (folders)

```sh
touch config-overrides.js
```

**config-overrides.js:**

```javascript
module.exports = function override(config, env) {
  // do stuff with the webpack config...
  return config;
};
```

**package.json:**

```json
{
  "scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject"
  },
}
```

## 自定义 React App | Custom React App

> 使用 [customize-cra](https://github.com/arackaf/customize-cra) 扩展 create-react-app 配置以便于支持多页应用。
> Use [customize-cra](https://github.com/arackaf/customize-cra) to extend the create-react-app configuration to support multi-page applications.

**安装依赖** | Install dependencies

```shell
yarn add customize-cra --dev
# or
npm install customize-cra --save-dev
```

**编辑文件（夹）** | Edit files (folders)

**config-overrides.js:**

```javascript
const { override, addWebpackAlias } = require('customize-cra');

module.exports = {
  webpack: override(
    addWebpackAlias({
        '@': path.join(__dirname, "src")
    }), // Configure path alias
  ),
};
```

## 多入口支持 | Support multiple entry

**编辑文件（夹）** | Edit files (folders)

```sh
cd src
mkdir window worker
cp ./* window
cp ./* worker

cd ..
touch .env
```

**.env:**

```text
REACT_APP_INDEX="window/index.tsx"
REACT_APP_PATHS_ALIAS={"@":"src/window/","#":"src/worker/"}
REACT_APP_MULTI_ENTRY={"window":"window/index.tsx","worker":"worker/index.tsx"}
```

**config-overrides.js:**

```javascript
const path = require("path");
const {
  override,
  addWebpackAlias,
  setWebpackTarget,
} = require("customize-cra");

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
    ), // Configure path alias
    setWebpackTarget("electron-renderer")
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
```

## 配置 Electron | Configure Electron

**安装依赖** | Install dependencies

```shell
# Use electron environment for desktop development
yarn add electron --dev
# Use cross-env to distinguish development and production environment
yarn add cross-env --dev
# Use concurrently to enable all scripts to be triggered synchronously (only need to open a port to start the program)
yarn add concurrently --dev
# Use wait-on to wait for the rendering process to execute before running the main process
yarn add wait-on --dev
# Use nodemon to monitor build directory changes (rerun the main program every time the directory changes)
yarn add nodemon --dev

# Use gulp to build the main process file
yarn add gulp del gulp-concat gulp-uglify gulp-typescript gulp-sourcemaps --dev

# or
npm install electron --save-dev
npm install gulp --save-dev
npm install cross-env --dev
npm install concurrently --save-dev
npm install nodemon --save-dev
npm install wait-on --save-dev

npm install gulp del gulp-concat gulp-uglify gulp-typescript gulp-sourcemaps --save-dev
```

**编辑文件（夹）** | Edit files (folders)

```sh
mkdir app
touch app/index.ts
touch gulpfile.js
```

**config-overrides.js:**

> 为了方便使用 Electron 以及 Node.js 相关的 api， 需要将 webpack 中 target 配置项设置为 `electron-renderer`。
>
> To facilitate the use of Electron and Node.js related api, you need to set the target configuration item in webpack to `electron-renderer`.

```js
const { override, setWebpackTarget } = require('customize-cra');

// ...
module.exports = {
  webpack: override(
      // ...,
      setWebpackTarget('electron-renderer')
  ),
  // ...
};
```

> Webpack 配置中设置了 `target:electron-renderer` 之后，原生浏览器的环境将无法运行此 react 项目（因为不支持 Node.js 相关的 api），会抛出 `Uncaught ReferenceError: require is not defined` 异常。
>
> After setting `target:electron-renderer` in the Webpack configuration, the environment of the native browser will not be able to run this react project (because it does not support Node.js related api), an exception of `Uncaught Reference Error: require is not defined` will be thrown.

**gulpfile.js:**

```js
const gulp = require("gulp")
const del = require("del")
const concat = require("gulp-concat")
const uglify = require("gulp-uglify")
const ts = require("gulp-typescript")
const sourcemaps = require("gulp-sourcemaps")

const tsProject = ts.createProject("tsconfig.json", {
    module: "commonjs",
})

function transpile() {
    const reporter = ts.reporter.fullReporter()
    const tsResult = gulp.src("app/**/*.ts").pipe(sourcemaps.init()).pipe(tsProject(reporter))

    return tsResult.pipe(concat("main.js"))
}

function output(stream) {
    return stream.pipe(sourcemaps.write(".", { includeContent: false, sourceRoot: "app" })).pipe(gulp.dest("build/"))
}

// The `clean` function is not exported so it can be considered a private task.
// It can still be used within the `series()` composition.
function clean(cb) {
    // body omitted
    return del(["build/main.js*", "build/index.js*"], cb)
}

// The `start` function is exported so it is public and can be run with the `gulp` command.
// It can also be used within the `series()` composition.
function start(cb) {
    // body omitted
    const stream = transpile()
    return output(stream)
}

// The `build` function is exported so it is public and can be run with the `gulp` command.
// It can also be used within the `series()` composition.
function build(cb) {
    // body omitted
    const stream = transpile().pipe(uglify())
    return output(stream)
}

gulp.task("clean", clean)

gulp.task("start", start)

gulp.task("build", build)

gulp.task("watch", function () {
    gulp.watch(["app/**/*.ts"], gulp.series(clean, start))
})

gulp.task("default", gulp.series(clean, process.env.NODE_ENV === "production" ? build : start))
```

**main/index.ts:**
> Electron 入口文件

```js
import path from "path";
import { app, BrowserWindow, ipcMain } from "electron";

// Reference to application window
let mainWindow: BrowserWindow = null;

// Determine whether the command line parameter contains `--debug`
// const debug = /--debug/.test(process.argv[2]);

const createWindow = function () {
  /* 创建应用窗口（并赋值给 mainWindow 变量） */
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true, // 应用 Node.js
      preload: path.join(__dirname, "preload.js"),
    },
  });

  /**
   * Load index. html file, here load URL is divided into two situations:
   *  1.Development environment, pointing to the development environment address of react
   *  2.Production environment, point to the index html after react build.
   */
  const startUrl =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000/"
      : path.join(__dirname, "/public/index.html");
  mainWindow.loadURL(startUrl);
  // mainWindow.loadURL("http://localhost:3000/");
  // mainWindow.loadURL(path.join('file://', __dirname, '/public/index.html'));

  ipcMain.on("min", function () {
    mainWindow.minimize();
  });
  ipcMain.on("max", function () {
    mainWindow.maximize();
  });

  mainWindow.webContents.openDevTools();
  // If the command line contains the `--debug` parameter, open the third-party developer tool
  // if (debug) {
  //    require('devtron').install();
  // }

  mainWindow.on("closed", () => {
    // When the application is closed, release the reference to the main Window variable
    mainWindow = null;
  });
};

// Ensure that the window is only instantiated once
// app.requestSingleInstanceLock();
// app.on('second-instance', () => {
//     if (mainWindow) {
//         if (mainWindow.isMinimized())
//             mainWindow.restore();
//         mainWindow.focus();
//     }
// });

// Listen for app ready events
app.on("ready", () => {
  createWindow();
});

// 监听所有视窗关闭事件
app.on("window-all-closed", () => {
  // On mac OS, unless the user exits definitely with Cmd + Q,
  // Otherwise, most applications and their menu bars will remain active.
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Listen for application activation events
app.on("activate", () => {
  // On mac OS, when the dock icon is clicked and no other windows are open,
  // Usually a window is recreated in the application.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// This file can be split into several files and then imported with require.
```

**package.json:**

```json
{
  "main": "build/index.js",
  "homepage": ".",
  "scripts": {
    "start": "concurrently yarn:start:*",
    "prestart": "cross-env NODE_ENV=development yarn gulp",
    "start:renderer": "cross-env BROWSER=none react-app-rewired start",
    "start:watch": "cross-env NODE_ENV=development yarn gulp watch",
    "start:main": "wait-on http://localhost:3000 && nodemon --watch ./build --exec electron . --no-sandbox",
    "build": "concurrently yarn:build:*",
    "build:renderer": "react-app-rewired build",
    "build:main": "cross-env NODE_ENV=production yarn gulp build",
    "test": "react-app-rewired test",
    "eject": "react-scripts eject",
    "electron": "electron . --no-sandbox"
  }
}
```

> 默认情况下，`package.json` 文件中 `homepage` 配置项的内容是 `http://localhost:3000`，此时构建后的所有资源文件路径都是以 `/static` 开头的绝对路径，而 Electron 调用的入口是 `file://` 协议，`/static` 开头的资源会被定位到根目录去，以致找不到静态文件。为解决这个问题，需要在 `package.json` 文件中添加  `"homepage": "."` 配置项，以使得所有重新构建后的静态文件的路径都换成 `./static` 开头的相对路径。
>
> By default, package. The content of the homepage configuration item in the `package.json` file is `http://localhost:3000`. At this time, all the resource file paths after building are absolute paths beginning with `/static`, and the entrance called by Electron is With the `file://` protocol, the resources which path starting with `/static` will be located to the root directory, so that static files can not be found. To solve this problem, we need to add the `"homepage": "."` configuration item to the `package.json` file so that the paths of all rebuilt static files are replaced with relative paths starting with `./static`.

## 配置 Git Hooks | Configure Git Hooks

> - `husky` 用于实现各种 Git Hooks，以运行一些自定义操作。
> `husky` is used to implement various Git Hooks to run some custom operations.
> - `lint-staged` 用于对 Git 暂存区中的文件执行代码检测。
> `lint-staged` is used to perform code detection on files in the Git staging area.

**安装依赖** | Install dependencies

```sh
yarn add husky lint-staged --dev
# or
npm install husky lint-staged -d
```

**编辑文件（夹）** | Edit files (folders)
**package.json:**

```json
{
  "husky": {
    "hooks": {
        
    }
  },
  "lint-staged": {
        
  },
}
```

### 提交规范 | Commit Convention

**编辑文件（夹）** | Edit files (folders)

```sh
mkdir scripts && touch scripts/verify-commit-msg.js
```

**scripts/verify-commit-msg.js:**

```js
#!/usr/bin/env node

/**
 * This is a commit-msg sample running in the Node environment,
 *    and will be invoked on the commit-msg git hook.
 *
 * You can use it by renaming it to `commit-msg` (without path extension),
 *    and then copying the renamed file to your project's directory `.git/hooks/`.
 *
 * Note: To ensure it can be run, you should grunt the renamed file (`commit-msg`)
 *    with running command `chmod a+x .git/hooks/commit-msg` in your project's directory.
 */
const chalk = require("chalk")
const message = require("fs").readFileSync(process.argv[2], "utf-8").trim()

const COMMIT_REG = /^(revert: )?(WIP|feat|fix|docs|style|refactor|perf|test|workflow|build|ci|chore|merge|release)(\(.+\))?: .{1,50}/

if (!COMMIT_REG.test(message)) {
    console.log()
    console.error(
        `  ${chalk.bgRed.white(" ERROR ")} ${chalk.red(`invalid commit message format.`)}\n\n` +
            chalk.red(`  Proper commit message format is required for automated changelog generation. Examples:\n\n`) +
            `    ${chalk.green(`feat(pencil): add 'graphiteWidth' option`)}\n` +
            `    ${chalk.green(`fix(graphite): stop graphite breaking when width < 0.1 (close #28)`)}\n\n` +
            chalk.red(`  See .github/commit-convention.md for more details.\n`),
    )
    process.exit(1)
}
```

**package.json:**

```json
{
    "husky": {
        "hooks": {
            "commit-msg": "node scripts/verify-commit-msg.js ${HUSKY_GIT_PARAMS}"
        }
    },
}
```

### 编码规范 | Coding Convention

**安装依赖** | Install dependencies

> 使用 eslint-config-prettier 解决 ESLint 与 Prettier 的规则冲突

```sh
# Use ESLint for code linting
yarn add eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin --dev # for eslint
# Use prettier for code formatting
yarn add prettier eslint-config-prettier --dev # for prettier

# or
npm install eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin --save-dev # for eslint
npm install  prettier eslint-config-prettier --save-dev # for prettier
```

**创建文件（夹）** | Create file (folder)

```sh
touch .editorconfig
touch .eslintrc.js .eslintignore
mkdir .vscode && touch .vscode/settings.json
touch .prettierrc .prettierignore
```

**配置 EditorConfig** | Configure EditorConfig

> EditorConfig 帮助开发人员在不同的编辑器和IDE之间定义和维护一致的编码样式。
> EditorConfig helps developers define and maintain consistent coding styles between different editors and IDEs.
>
> EditorConfig 项目由用于定义编码样式的**文件格式**和一组**文本编辑器插件组成**，这些**插件**使编辑器能够读取文件格式并遵循定义的样式。
> EditorConfig project consists of a file format used to define encoding styles and a set of text editor plugins. These plugins enable the editor to read the file format and follow the defined style.
>
> 对于 VS Code，对应的插件名是[EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
> For VS Code, the corresponding plugin name is [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)

**.editorconfig:**

```toml
# EditorConfig is awesome: https://EditorConfig.org

# top-most EditorConfig file
root = true

# Unix-style newlines with a newline ending every file
[*]
end_of_line = lf
insert_final_newline = true
charset = utf-8
indent_style = space
indent_size = 4

[{*.json,*.md,*.yml,*yaml,*.*rc}]
indent_style = space
indent_size = 2
```

**配置 ESLint** | Configure ESLint

**.eslintrc.js:**

```javascript
module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        "plugin:@typescript-eslint/recommended",
        // 用于关闭 ESLint 相关的格式规则集，详见：https://github.com/prettier/eslint-config-prettier/blob/master/index.js
        "prettier",
        // 用于关闭 @typescript-eslint/eslint-plugin 插件相关的格式规则集，详见：https://github.com/prettier/eslint-config-prettier/blob/master/@typescript-eslint.js
        "prettier/@typescript-eslint",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12,
        sourceType: "module",
    },
    plugins: ["@typescript-eslint"],
    rules: {}
}
```

**.eslintignore:**

```text
/build/
/coverage/
/docs/

/.github/
/.vscode/
/.history/
```

**.vscode/settings.json:**

```json
{
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll": true,
    "source.fixAll.eslint": true
  },
  "eslint.format.enable": true,
  "eslint.validate": ["javascript", "typescript", "javascriptreact", "typescriptreact", "vue"],
  "files.autoSave": "onFocusChange",
  "files.associations": {
    "*.ttml": "xml",
    "*.ttss": "css"
  }
}
```

**配置 Prettier** | Configure Prettier

**.prettierrc:**

```json
{
  "trailingComma": "all",
  "tabWidth": 4,
  "semi": false,
  "singleQuote": false,
  "endOfLine": "lf",
  "printWidth": 120,
  "overrides": [
    {
      "files": ["*.json", "*.md", "*.yml", "*.yaml", "*.*rc"],
      "options": {
        "tabWidth": 2
      }
    }
  ]
}
```

**.prettierignore:**

```text
# Ignore artifacts:
/build/
/coverage/
/docs/

/.github/
/.vscode/
/.history/

package.json
package-lock.json
yarn.lock
```

**package.json:**

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write . --ignore-unknown"
  },
  "hooks": {
    "pre-commit": "lint-staged",
  },
  "lint-staged": {
    "*.ts?(x)": [
      "prettier --write --ignore-unknown",
      "eslint --fix"
    ]
  },
}
```

## 配置 CI/CD | Configure CI/CD

**安装依赖** | Install dependencies

```sh
yarn add codecov --dev
# or
npm install codecov --save-dev
```

**编辑文件（夹）** | Edit files (folders)

```sh
mkdir .github/workflows
touch .github/workflows/ci.yml
touch .travis.yml
```

**package.json:**

```json
{
  "scripts": {
    "codecov": "codecov",
  }
}
```

**配置 Github Actions** | Configure Github Actions

```yml
name: Node.js CI

on: 
  # Run this workflow every time a new commit pushed to your repository
  push：
    branches:
      - master

jobs:
  # Set the job key. The key is displayed as the job name
  # when a job name is not provided
  test:
    # Name the Job
    name: Test code
    # Set the type of machine to run on
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [10.x, 12.x， 14.x]

    steps:
      # Checks out a copy of your repository on the ubuntu-latest machine
      - uses: actions/checkout@v2
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}
      - name: Cache Node.js modules
        uses: actions/cache@v2
        with:
          # yarn cache files are stored in `~/.yarn` on Linux/macOS
          path: ~/.yarn
          key: ${{ runner.OS }}-node-${{ hashFiles('**/package.json') }}
          restore-keys: |
            ${{ runner.OS }}-node-
            ${{ runner.OS }}-
      - run: yarn install
      - run: yarn build --if-present
      - run: yarn test
        env:
          CI: true
      steps:
      - uses: actions/checkout@v2
      - uses: codecov/codecov-action@v1
        with:
          # token: ${{ secrets.CODECOV_TOKEN }} # required for private repository
          # file: ./coverage.xml # optional
          # files: ./coverage1.xml,./coverage2.xml # optional
          # flags: unittests # optional
          # name: codecov-umbrella # optional
          fail_ci_if_error: true # optional (default = false)
          verbose: true # optional (default = false)
```

**配置 Travis CI** | Configure Travis CI

**.travis.yml:**

```yml
language: node_js
node_js:
  - 14.15.1
cache: # Cache Node.js dependencies to improve the efficiency of the second build
directories:
  - node_modules
install: 
  # The default installation instruction of Travis CI is `yarn --frozen-lockfile`
  # This command will lock the version number of the current dependency package. 
  # When the dependency package is updated, yarn will report a warning 
  #   to prevent developers from using the old version of the dependency.
  - yarn 
test:
  - yarn test
after_success: 
  - yarn codecov # Generate codecov icon on Github homepage
```

## 项目打包 | Project packaging

> 常用打包工具 | Commonly used packaging tools:
>
> - [electron-builder](https://www.electron.build/)
> - [electron-packager](https://github.com/electron/electron-packager)

**配置 electron-builder** | Configure electron-builder

**安装依赖** | Install dependencies

```sh
yarn add electron-builder --dev
# or
npm install electron-builder --save-dev
```

**编辑文件（夹）** | Edit files (folders)

**package.json:**

```json
{
  "scripts": {
    "pack": "electron-builder --dir",
    "dist": "electron-builder",
  },
  "build": {
    "extends": null,
    "files": [
      "build/**/*",
      "node_modules/",
      "package.json"
    ]
  },
}
```

**开始打包** | Start packing

> electron 下载很慢时可以手工下载后放到系统的缓存目录：
>
> When electron download is very slow, we can manually download it and put it in the system cache directory:
>
> ```sh
> # Linux:
> $XDG_CACHE_HOME 
> # or
> ~/.cache/electron/
> 
> # MacOS:
> ~/Library/Caches/electron/
> 
> # Windows:
> $LOCALAPPDATA/electron/Cache 
> # or
> ~/AppData/Local/electron/Cache/
> ```

```sh
yarn build
yarn pack

# or
npm run build
npm run pack
```

**配置 electron-packager** | Configure electron-packager

**安装依赖** | Install dependencies

```sh
yarn add electron-packager --dev
# or
npm install electron-packager --save-dev
```

**编辑文件（夹）** | Edit files (folders)

**package.json:**

```json
{
    "scripts": {
        "pack": "electron-packager ." 
    }
}
```

```sh
yarn pack
# or
npm run pack
```

**提醒：** 由于打包的时候会把浏览器内核完整打包进去，所以就算你的项目开发就几百k的资源，但最终的打包文件估计也会比较大。

**Reminder:** Since the browser kernel will be fully packaged when packaging, even if your project is developed with hundreds of K resources, the final package file is estimated to be relatively large.

## 项目加密 | Project encryption

可以看到，在每个包下的 resources 文件夹里的 app 文件夹就是我们写的程序，这样我们的代码就是暴露在用户电脑上的，非常的不安全，还好 electron 自带了加密功能。

As we can see, the app folder in the resources folder of each package is the program we wrote, so our code is exposed on the user's computer, which is very insecure. Fortunately, electron has its own encryption function.

**安装依赖** | Install dependencies

> 使用 asar (<https://github.com/electron/asar>) 对项目进行加密。
> Use asar (<<https://github>. com/electron/asar>) Encrypt the project.

```bash
yarn global add asar
# or
npm install -g asar
```

**加密文件（夹）** | Encrypt files (folders)

```sh
# Execute under the resources folder of the generated application
asar pack ./app app.asar
```

## 注意事项 | Tips

- 开发时候如果只在浏览器的页面查看效果，会提示 electron 的模块无法导入，一般都是在主进程中通过 React 项目的 URL 去热调试应用，**调试须在electron生成的窗口中进行**！

  If you only view the effect on the browser page during development, you will be prompted that the electron module cannot be imported. Generally, the application is hot debugged through the URL of the React project in the main process. Debugging must be performed in the window generated by electron !
