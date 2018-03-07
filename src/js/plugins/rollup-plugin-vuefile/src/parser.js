import {
    createFilter
} from 'rollup-pluginutils';
import path from 'path';
import parse5 from "parse5";
import process from "process";
import deindent from 'de-indent';

export default function parse(html) {
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
