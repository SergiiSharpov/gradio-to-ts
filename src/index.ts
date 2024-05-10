import * as path from "node:path";
import * as fs from "node:fs";

import packageJSON from "../gradio/client/js/package.json";

const { name, version, description, author, main, types, dependencies } = packageJSON;
const license = "MIT";

const SrcFolder = path.join(__dirname, "../gradio/client/js/dist");
const IgnoreSrc = ["test"];

const DestFolder = path.join(__dirname, "../gradio-ts/dist");

const copyFile = (src: string, dest: string) => {
  fs.copyFileSync(src, dest);
}

const copyFolder = (src: string, dest: string) => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  fs.readdirSync(src).forEach((file) => {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);

    if (fs.lstatSync(srcFile).isDirectory()) {
      copyFolder(srcFile, destFile);
    } else {
      copyFile(srcFile, destFile);
    }
  });
}

const copy = (src: string, dest: string, ignore: string[] = []) => {
  if (!fs.existsSync(src)) {
    console.error(`Source folder does not exist: ${src}, you may need to run 'npm run build' first in the gradio/client/js folder.`);
    return;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  fs.readdirSync(src).forEach((file) => {
    if (ignore.includes(file)) {
      return;
    }

    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);

    if (fs.lstatSync(srcFile).isDirectory()) {
      copyFolder(srcFile, destFile);
    } else {
      copyFile(srcFile, destFile);
    }
  });
}

const createPackageJSON = (dest: string) => {
  const packageJSON = {
    name,
    version,
    description,
    author,
    main,
    types,
    license,
    dependencies
  };

  fs.writeFileSync(path.join(dest, "../package.json"), JSON.stringify(packageJSON, null, 2));
}

console.log(`Copying files from "${SrcFolder}" to "${DestFolder}"`);
copy(SrcFolder, DestFolder, IgnoreSrc);

console.log("Creating package.json");
createPackageJSON(DestFolder);

console.log("Done!");

