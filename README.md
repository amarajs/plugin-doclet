## [@amarajs/plugin-doclet](https://github.com/amarajs/plugin-doclet)

Server-side plugin to provide `doclets` args to features.

### Installation

`npm install --save @amarajs/plugin-doclet`

### Usage

```javascript
const Amara = require('@amarajs/core');
const AmaraPluginDoclet = require('@amarajs/plugin-doclet');
const AmaraPluginEngineServer = require('@amarajs/plugin-engine-server');
const amara = Amara([
    AmaraPluginEngineServer(server),
    AmaraPluginDoclet()
]);
```

### Feature Type

The `@amarajs/plugin-doclet` middleware allows creates no new feature types; however, it does register a new `doclets` arg provider for use in your features. The doclets are determined by reading the file at the requested path and parsing any JSDoc-like doclets in the form:

```javascript
/**
 * @doclet QUANTIFIER value1 value2 ...
 */
```

Where `QUANTIFIER` can be `ALL`, `NONE`, or `ANY` (aka `SOME`). If not provided, the default is `ALL`. Values will be converted to upper-case. For example:

```javascript
/**
 * @feature feature-123 feature-456
 * @role any admin power-user
 */
```

Would parse into the following `doclets` value:

```javascript
doclets: {
    feature: {
        quantifier: 'ALL',
        value: 'feature-123 feature-456'
    },
    role: {
        quantifier: 'ANY',
        value: 'admin power-user'
    }
}
```

#### Example Usage

```javascript
// exclude file content where the feature isn't configured

const switches = require('.config').switches;
const isActive = (feature) => !!switches[feature];
const whitespace = /\s+/g;
const trim = (s) => s.trim();

amara.add({
    type: 'transform', // from @amarajs/plugin-bundle
    targets: ['GET /features/**/*.js'],
    args: { feature: ({doclets}) => doclets.feature },
    apply: ({feature}) => (code) => {
        if (!feature) return code;
        let active = false;
        const {value = '', quantifier = 'ALL'} = feature;
        const features = value.split(whitespace).map(trim);
        switch (quantifier) {
        case 'NONE':
            active = !features.some(isActive);
        case 'ANY':
        case 'SOME':
            active = features.some(isActive);
        case 'ALL':
            active = features.every(isActive);
        }
        return active ? code : '';
    }
});
```

### Customization

This plugin has no customization options.

### Contributing

If you have a feature request, please create a new issue so the community can discuss it.

If you find a defect, please submit a bug report that includes a working link to reproduce the problem (for example, using [this fiddle](https://jsfiddle.net/04f3v2x4/)). Of course, pull requests to fix open issues are always welcome!

### License

The MIT License (MIT)

Copyright (c) Dan Barnes

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
