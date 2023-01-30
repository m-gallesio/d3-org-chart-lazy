import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import { rmSync } from "fs";

import config from "../package.json" assert { type: "json" };

rmSync("../dist", { force: true, recursive: true });

const config_shared = {
    name: "d3",
    extend: true,
    globals: {
        "d3-org-chart": "d3"
    }
};

const config_terser = Object.assign({
    plugins: [terser()]
}, config_shared);

export default [{
    input: "src/index.ts",
    external: ["d3-org-chart"],
    output: [
        Object.assign({
            file: config.main,
            format: "umd"
        }, config_shared),
        Object.assign({
            file: config.module,
            format: "es"
        }, config_shared),
        Object.assign({
            file: `${config.main.replace('.js', '')}.min.js`,
            format: "umd",
        }, config_terser),
        Object.assign({
            file: `${config.module.replace('.js', '')}.min.js`,
            format: "es"
        }, config_terser)
    ],
    plugins: [
        typescript({
            removeComments: true,
            declaration: true,
            declarationDir: "types"
        })
    ]
}];
