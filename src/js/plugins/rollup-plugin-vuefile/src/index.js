import {
    createFilter
} from 'rollup-pluginutils';
import path from 'path';
import parser from './parser';
import escodegen from "escodegen";
var acorn = require("acorn");

export default function vuefile(options = {}) {
    options = Object.assign(options, {
        extensions: ['.vue']
    });
    let filter = createFilter(options.include, options.exclude);
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

            var vueObject = parser(code);
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
