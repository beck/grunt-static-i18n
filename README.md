# Static Internationalization

[![Build Status](https://api.travis-ci.org/beck/grunt-static-i18n.png)](https://travis-ci.org/beck/grunt-static-i18n)
[![Coverage Status](https://coveralls.io/repos/beck/grunt-static-i18n/badge.png)](https://coveralls.io/r/beck/grunt-static-i18n)

> Grunt plugin to translate static assets.

Say you have:

```
app/
├── Gruntfile.js
└── app
    ├── locale
    │   ├── fr
    │   │   └── LC_MESSAGES
    │   │       └── messages.po
    │   └── pt_BR
    │       └── LC_MESSAGES
    │           └── messages.po
    └── static
        └── data.json  // content: ["_('Hello World')"]
```

And you need to translate `data.json`.  
Static internationalization would like like:

```
app/
├── Gruntfile.js
└── app
    ├── i18n
    │   ├── fr
    │   │   └── static
    │   │       └── data.json  // content: ["Bonjour tout le monde"]
    │   ├── pt_BR
    │   │   └── static
    │   │       └── data.json // content: ["Olá mundo"]
    │   └── static
    │       └── data.json  // not translated: ["Hello World"]
    ├── locale
    │   ├── fr
    │   │   └── LC_MESSAGES
    │   │       └── messages.po
    │   └── pt_BR
    │       └── LC_MESSAGES
    │           └── messages.po
    └── static
        └── data.json
```


## Getting Started

This plugin requires [Grunt](http://gruntjs.com/).

Translations are done with node-gettext and you will need a proper
gettext catalog (structure seen above).  If need help extracting translation
strings, checkout [grunt-i18n-abide](https://www.npmjs.org/package/grunt-i18n-abide).
Checkout the `makemessages` task in [Gruntfile.js](Gruntfile.js).


## The "statici18n" task

### Overview

In your project's Gruntfile, add a section named `statici18n` to the data
object passed into `grunt.initConfig()`: 

```js
grunt.initConfig({
  statici18n: {
    options: {
      localeDir: 'app/locale'
    },
    myAppTask: {
      files: [{
        expand: true,
        cwd: 'app',
        src: 'static/*.{js,json}',
        dest: 'app/i18n'
      }]
    }
  }
})
```

### Options

#### options.localeDir
Type: `String`
Default value: `locale`

Sometimes easiest to use a var, say `<%= abideCreate.options.localeDir %>`

#### options.template.interpolate
Type: `RegEx`  
Default: search for `_('msgid')` or `_("msgid")`

Used to find gettext calls.  
Sets [_.templateSettings.interpolate](http://lodash.com/docs#templateSettings_interpolate)

#### options.textDomain
Type: `String`
Default value: `messages`

Name of your po files: `locale/<lang>/LC_MESSAGES/<textDomain>.po`

## Tests

Run `grunt && open coverage.html`

## Release History

* 0.3.2 - capture errors when compiling large templates
* 0.3.1 - add text domain to options
* 0.3.0 - fix issue with locale discovery
* 0.2.0 - quote translated text when rendering javascript
* 0.1.0 - render non-language defaults to destination
* 0.0.2 - add coverage reporting
* 0.0.1 - initial release

## License
Copyright (c) 2014 Douglas Beck. Licensed under the MIT license.
