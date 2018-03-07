import buble from "rollup-plugin-buble";

export default {
    entry: "src/index.js",
    plugins: [buble],
    format: 'umd',
    dest: "dist/index.js",
    moduleName: "vuefile"
}
