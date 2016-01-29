/* global process */
var parse       = require('jsdoc-parse'),
    handlebars  = require('handlebars'),
    fs          = require('q-io/fs'),
    path        = require('path'),
    q           = require('q'),
    Docs        = null,
    Namespace   = null,
    docs        = null,
    Doclet      = null;

Namespace = function(doclet) {
    this.doclet = doclet;
    this.members = [];
};

Docs = function() {
    this.namespaces = {};
    this.templates  = {};
    this.root       = '';
    this.hbs        = null;

    Object.seal(this);

    this.init();
};

Docs.prototype = {
    constructor: Docs,

    init: function() {
        var self = this;

        self.root   = process.cwd();
        self.hbs    = handlebars.create();

        return q.all([
            self.parseScript(),
            self.readTemplates()
        ])
            .spread(function(input) {
                self.sortDoclets(input);

                return self.renderDocs();
            })
            .catch(function(e) {
                console.log(e.stack);
            });
    },

    parseScript: function() {
        var defered = q.defer(),
            input   = '';

        parse({
            src: './dist/mixitup-pagination.js'
        })
            .on('data', function(data) {
                input += data;
            })
            .on('end', function() {
                defered.resolve(input);
            })
            .on('error', function(e) {
                throw e;
            });

        return defered.promise;
    },

    sortDoclets: function(input) {
        var self    = this,
            doclets = JSON.parse(input);

        doclets.forEach(function(doclet) {
            if (doclet.kind === 'namespace') {
                self.namespaces[doclet.id] = new Namespace(doclet);
            }
        });

        doclets.forEach(function(doclet) {
            var namespace = null,
                model     = new Doclet();

            if (
                doclet.memberof &&
                typeof (namespace = self.namespaces[doclet.memberof]) !== 'undefined'
            ) {
                Object.assign(model, doclet);

                namespace.members.push(model);
            }
        });
    },

    readTemplates: function() {
        var self        = this,
            dirPath     = path.join(self.root, 'build'),
            fileNames   = [];

        return fs.exists(dirPath)
            .then(function(exists) {
                if (exists) {
                    return fs.list(dirPath);
                }
            })
            .then(function(list) {
                var filtered = list.filter(function(fileName) {
                    return fileName.charAt(0) !== '.' && fileName.indexOf('.md') > -1;
                });

                return filtered;
            })
            .then(function(filtered) {
                var tasks = [];

                fileNames = filtered;

                fileNames.forEach(function(fileName) {
                    var filePath = path.join(self.root, 'build', fileName);

                    tasks.push(fs.read(filePath));
                });

                return q.all(tasks);
            })
            .then(function(buffers) {
                buffers.forEach(function(buffer, i) {
                    var slug = fileNames[i].replace('.md', '');

                    self.templates[slug] = self.hbs.compile(buffer);
                });
            });
    },

    renderDocs: function() {
        var self            = this,
            tasks           = [];

        Object.keys(self.namespaces).forEach(function(key) {
            var namespace   = self.namespaces[key],
                filePath    = path.join(self.root, 'docs', key + '.md'),
                output      = '';

            output = self.templates['template-docs-namespace'](namespace);

            tasks.push(fs.write(filePath, output));
        });

        return q.all(tasks);
    }
};

Doclet = function() {
    this.id             = '';
    this.name           = '';
    this.access         = '';
    this.longname       = '';
    this.scope          = '';
    this.kind           = '';
    this.description    = '';
    this.memberof       = '';
    this.since          = '';
    this.order          = -1;
    this.type           = '';
    this.meta           = {};
    this.defaultvalue   = [];
    this.params         = [];
    this.returns        = [];
    this.examples       = [];

    Object.defineProperties(this, {
        isFactory: {
            get: function() {
                return this.kind === 'function' && !this.memberof;
            }
        },
        isMethod: {
            get: function() {
                return this.kind === 'function' && this.memberof;
            }
        },
        isProperty: {
            get: function() {
                return this.kind === 'member'
            }
        },
        syntax: {
            get: function() {
                if (this.isMethod || this.isFactory) {
                    return this.examples[0];
                }
            }
        },
        codeExamples: {
            get: function() {
                if (this.isMethod || this.isFactory) {
                    return this.examples.slice(1);
                } else {
                    return this.examples;
                }
            }
        }
    });

    Object.seal(this);
};

module.exports = new Docs();