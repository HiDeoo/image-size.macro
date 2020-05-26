<div align="center">
  <h1>image-size.macro 📐</h1>
  <p>Image size at build time using babel-plugin-macros</p>
</div>

<div align="center">
  <a href="https://github.com/HiDeoo/image-size.macro/actions?query=workflow%3Aintegration"><img alt="Integration Status" src="https://github.com/HiDeoo/image-size.macro/workflows/integration/badge.svg"></a>
  <a href="https://github.com/kentcdodds/babel-plugin-macros"><img alt="Babel Macro" src="https://img.shields.io/badge/babel--macro-%F0%9F%8E%A3-f5da55.svg"></a>
  <a href="https://github.com/HiDeoo/image-size.macro/blob/master/LICENSE"><img alt="License" src="https://badgen.now.sh/badge/license/MIT/blue"></a>
  <br /><br />
</div>

**image-size.macro is a [Babel macro](https://babeljs.io/blog/2017/09/11/zero-config-with-babel-macros) that gives you the size of an image (width & height) at build time using [babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros) and [image-size](https://github.com/image-size/image-size).**

## Usage

### Installation

1. Install [babel-plugin-macros](https://github.com/kentcdodds/babel-plugin-macros) and the macro:

```sh
yarn add -D babel-plugin-macros image-size.macro
```

or

```sh
npm install --save-dev babel-plugin-macros image-size.macro
```

2. Add the plugin to your [Babel configuration](https://babeljs.io/docs/en/config-files):

#### `.babelrc`

```diff
{
  "plugins": [
    "other-plugins",
+   "macros",
  ]
}
```

#### `babel.config.js`

```diff
module.exports = {
  plugins: [
    ...otherPlugins,
+   'macros',
  ]
}
```

### Example

```js
import imageSize from 'image-size.macro'

const myImageSize = imageSize('./my-image.png')
```

↓ ↓ ↓ ↓ ↓ ↓

```js
const myImageSize = { height: 20, width: 10 }
```

## License

Licensed under the MIT License, Copyright © HiDeoo.

See [LICENSE](https://github.com/HiDeoo/image-size.macro/blob/master/LICENSE) for more information.
