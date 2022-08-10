const fs = require("fs");
const XLSX = require("xlsx");
const { metadataTemplate } = require("./metadata-template");
const readline = require("readline");

// Convert file
// Uncomment if working with a new xlsx file or if conversion is needed
// const workBook = XLSX.readFile("./Batch 1 Metadata_Trait list.xlsx");
// const converted = XLSX.writeFile(workBook, "batch1data", { bookType: "csv" });

// Update output file name as needed
const stream = fs.createReadStream("./batch1data");

const rl = readline.createInterface({ input: stream });

const data = [];
rl.on("line", (row) => {
  data.push(row.split(","));
});

rl.on("close", () => {
  data.slice(2, 11).forEach((elem) => {
    const initObject = createObjects(elem.slice(1, 24), data[1].slice(1, 24));
    const updatedObj = updateTemplate(initObject);
    console.log(updatedObj);
    createDataFile(updatedObj);
  });
});

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
    templateCopy.token_id = metaObj.Status;
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
      `nugget#${metadata.token_id}.json`,
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
