# Static Internationalization

> Grunt plugin to translate static assets.

Say you have:

```
app
├── locale
│   ├── en_GB
│   │   └── LC_MESSAGES
│   │       └── messages.po
│   └── fr
│       └── LC_MESSAGES
│           └── messages.po
└── static
    └── data.json  // content: ["_('Hello World')"]
```

And you need to translate `data.json`.  
Staticic internationalization would like like:

```
app
├── i18n
│   ├── en_GB
│   │   └── static
│   │       └── data.json  // content: ["Hello World"]
│   └── fr
│       └── static
│           └── data.json  // content: ["Bonjour tout le monde"]
├── locale
│   ├── en_GB
│   │   └── LC_MESSAGES
│   │       └── messages.po
│   └── fr
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
Checkout the `makemessages` task in [Gruntfile.js](GruntFile.js).


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
          src: 'static/*.json',
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


## License
Copyright (c) 2014 Douglas Beck. Licensed under the MIT license.
