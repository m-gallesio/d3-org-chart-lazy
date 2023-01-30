import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import { rmSync } from "fs";

import config from "./package.json" assert { type: "json" };

rmSync("./dist", { force: true, recursive: true });

export default [{
    input: "src/index.ts",
    external: ["d3-org-chart"],
    output: [
        {
            file: config.main,
            format: "umd",
            name: "d3",
            extend: true,
            globals: {
                "d3-org-chart": "d3"
            }
        },
        {
            file: config.module,
            format: "es",
            name: "d3",
            extend: true,
            globals: {
                "d3-org-chart": "d3"
            }
        },
        {
            file: `${config.main.replace('.js', '')}.min.js`,
            format: "umd",
            name: "d3",
            extend: true,
            globals: {
                "d3-org-chart": "d3"
            }
        },
        {
            file: `${config.module.replace('.js', '')}.min.js`,
            format: "es",
            name: "d3",
            extend: true,
            globals: {
                "d3-org-chart": "d3"
            },
            plugins: [terser()]
        }
    ],
    plugins: [
        typescript({
            removeComments: true,
            declaration: true,
            declarationDir: "types"
        })
    ]
}];
