const fs = require("fs");
const XLSX = require("xlsx");
const { metadataTemplate } = require("./metadata-template");
const readline = require("readline");
const dataTraits = require("./config-B2-T1.js");
// Convert file
// Uncomment if working with a new xlsx file or if conversion is needed
// const workBook = XLSX.readFile("./Batch 1 Metadata_Trait list.xlsx");
// const converted = XLSX.writeFile(workBook, "batch1data", { bookType: "csv" });

// Update output file name as needed
const stream = fs.createReadStream(
  "./metadatabatch1-2-31.xlsx - All NFT's.csv"
);

const rl = readline.createInterface({ input: stream });

const data = [];
rl.on("line", (row) => {
  data.push(row.split(","));
});

rl.on("close", () => {
  data.slice(0, 11).forEach((elem) => {
    // console.log(elem);
    const initObject = createObjects(elem.slice(4, 32), data[0].slice(4, 32));
    console.log(initObject);
    // const updatedObj = updateTemplate(initObject);
    // console.log(updatedObj);
    // createDataFile(updatedObj);
  });
});
// console.log(dataTraits.races.nugget.layers[0].elements);
const createObjects = (metadata, attribs) => {
  try {
    attribProperty = [];
    const metaObj = metadata.reduce(function (result, item, index) {
      if (item === "" || item === undefined) {
        const key = attribs[index];
        result[key] = "";
      }
      if (index <= 7) {
        const key = attribs[index];
        result[key] = item;
      } else {
        attribProperty.push({ trait_type: attribs[index], value: item });
      }
      return result;
    }, {});
    metaObj["attributtes"] = attribProperty;
    return metaObj;
  } catch (err) {
    console.log(err);
  }
};

// Update template values with the created object values
const updateTemplate = (metaObj) => {
  try {
    templateCopy = JSON.parse(JSON.stringify(metadataTemplate));
    templateCopy.token_id = metaObj.Token_id;
    templateCopy.name = metaObj.Name;
    templateCopy.rarity = metaObj.NFT;
    templateCopy.attributtes = metaObj.attributtes;
    templateCopy.dna = metaObj.attributtes
      .map((str) => {
        return str.value;
      })
      .join(",");
    return templateCopy;
  } catch (err) {
    console.log("undefined object, cannot update template");
  }
};

const createDataFile = (metadata) => {
  try {
    fs.writeFile(
      `./metadataFolder/nuggetNew#${metadata.token_id}.json`,
      JSON.stringify(metadata),
      function (err) {
        if (err) throw err;
        console.log("complete");
      }
    );
  } catch (err) {
    console.log("Cannot write undefined");
  }
};

const createDNAString = (attributes) => {
  console.log(races);
};
