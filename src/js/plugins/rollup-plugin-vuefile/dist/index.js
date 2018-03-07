(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('rollup-pluginutils'), require('path'), require('parse5'), require('process'), require('de-indent'), require('escodegen')) :
    typeof define === 'function' && define.amd ? define(['rollup-pluginutils', 'path', 'parse5', 'process', 'de-indent', 'escodegen'], factory) :
    (global.vuefile = factory(global.rollupPluginutils,global.path,global.parse5,global.process,global.deindent,global.escodegen));
}(this, function (rollupPluginutils,path,parse5,process,deindent,escodegen) { 'use strict';

    path = 'default' in path ? path['default'] : path;
    parse5 = 'default' in parse5 ? parse5['default'] : parse5;
    deindent = 'default' in deindent ? deindent['default'] : deindent;
    escodegen = 'default' in escodegen ? escodegen['default'] : escodegen;

    function parse(html) {
        var fragment = parse5.parseFragment(html, {
            locationInfo: true
        });

        var result = {};
        fragment.childNodes.forEach(function(node) {
            switch (node.tagName) {
                case "template":
                    result.template = getTemplate(node, html);
                    break;
                case "script":
                    result.script = getScript(node, html);
                    break;
                case "style":
                    result.style = getStyle(node, html);
                    break;
            }
        });
        return result;
    };

    function getTemplate(node, html) {
        var lang = getAttribute(node, "lang");
        return getNodeContent(node, html);
    }

    function getNodeContent(node, html) {
        var start = node.__location.startTag.endOffset;
        var end = node.__location.endTag.startOffset;
        var content = deindent(html.substr(start, end - start)).trim();
        return content;
    }

    function getStyle(node, html) {
        var lang = getAttribute(node, "lang");
        var content = getNodeContent(node, html);
        return content;
    }

    function getScript(node, html) {
        var content = getNodeContent(node, html);
        return content;
    }

    function getAttribute(node, name) {
        if (node.attrs) {
            var i = node.attrs.length
            var attr
            while (i--) {
                attr = node.attrs[i]
                if (attr.name === name) {
                    return attr.value
                }
            }
        }
    }

    var acorn = require("acorn");

    function vuefile(options = {}) {
        options = Object.assign(options, {
            extensions: ['.vue']
        });
        let filter = rollupPluginutils.createFilter(options.include, options.exclude);
        const extensions = options.extensions;

        return {
            name: "vuefile",
            transform(code, id) {
                if (!filter(id)) {
                    return null;
                }
                console.log(id);
                if (extensions.indexOf(path.extname(id)) === -1) {
                    return null;
                }

                var vueObject = parse(code);
                var ast = acorn.parse(vueObject.script + "", {
                    sourceType: "module"
                });

                let defaultExportNode;
                ast.body.forEach(function(node) {
                    if (node.type == "ExportDefaultDeclaration") {
                        defaultExportNode = node;
                    }
                });
                defaultExportNode.declaration.properties.push({
                    type: 'Property',
                    start: 0,
                    end: 0,
                    method: false,
                    shorthand: false,
                    computed: false,
                    key: {
                        type: 'Identifier',
                        start: 0,
                        end: 0,
                        name: 'template'
                    },
                    value: {
                        type: 'Literal',
                        start: 0,
                        end: 0,
                        value: vueObject.template,
                        raw: vueObject.template
                    },
                    kind: 'init'
                });
                return escodegen.generate(ast);
            }
        }
    }

    return vuefile;

}));