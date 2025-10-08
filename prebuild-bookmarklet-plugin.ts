import { transpile } from "Typescript";
import { minify_sync } from "terser";
import { readFile, writeFile } from "fs";

export default function prebuildBookmarklet(source: string) {
  return {
    name: "prebuild-bookmarklet-plugin",
    buildStart() {
      console.info("> prebuilding bookmarklet");

      readFile(source, "utf8", (err, data) => {
        if (err) {
          return console.error(err);
        }

        console.info(`>> read in ${source}`);

        const transpiledTS = transpile(data);

        if (transpiledTS === undefined) {
          return console.error(">> transpiler failed");
        }

        console.info(">> code transpiled");

        let minifiedJS;

        try {
          minifiedJS = minify_sync(transpiledTS, { mangle: false });
        } catch (err) {
          return console.error(`>> minifier failed: ${err}`);
        }

        if (minifiedJS) {
          console.info(">> code minified");
          const out = minifiedJS.code ?? "";

          writeFile("./src/bookmarklet.js", out, (err) => {
            if (err) {
              return console.error(`>> ${err}`);
            }

            console.info(">> minified bookmarklet written");
          });

          return;
        }
      });
    },
  };
}
