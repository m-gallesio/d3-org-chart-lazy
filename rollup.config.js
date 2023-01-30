import typescript from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import { rmSync } from "fs";

import config from "./package.json" assert { type: "json" };

rmSync("./dist", { force: true, recursive: true });

const name = "d3-org-chart-lazy";

export default [{
    input: "src/index.ts",
    external: ["d3-org-chart"],
    output: [
        {
            file: config.main,
            format: "umd",
            name,
            globals: {
                "d3-org-chart": "d3"
            }
        },
        {
            file: config.module,
            format: "es",
            name: config.name
        },
        {
            file: `${config.main.replace('.js', '')}.min.js`,
            format: "umd",
            name,
            plugins: [terser()],
            globals: {
                "d3-org-chart": "d3"
            }
        },
        {
            file: `${config.module.replace('.js', '')}.min.js`,
            format: "es",
            name: config.name,
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
