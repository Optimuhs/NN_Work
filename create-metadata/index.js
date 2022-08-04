const XLSX = require("xlsx");
const fs = require("fs");
const { metadataTemplate } = require("./metadata-template");

// Read all rows from excel file
const parseExcel = (filename) => {
  const excelData = XLSX.readFile(filename);
  return Object.keys(excelData.Sheets).map((name) => ({
    name,
    data: XLSX.utils.sheet_to_json(excelData.Sheets[name]),
  }));
};

// Parse data objects into an array for further processing
const metadata = [];
parseExcel("./Batch 1 Metadata_Trait list.xlsx").forEach((element) => {
  metadata.push(element.data);
});

// Read throught each object and retrieve the value of each entry into an array
const parseData = (metadata) => {
  objData = [];
  for (var propName in metadata) {
    if (metadata.hasOwnProperty(propName)) {
      var propValue = metadata[propName];
      // do something with each element here
      objData.push(propValue);
    }
  }
  return objData;
};

// Create an object of the individual data rows
const createNewDataObj = (data, attribs) => {
  attribProperty = [];
  const metaObj = data.reduce(function (result, item, index) {
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
};

// Update template values with the created object values
const updateTemplate = (metaObj) => {
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
};

const createDataFile = (metadata) => {
  fs.writeFile(
    `nugget#${metadata.token_id}.json`,
    JSON.stringify(metadata),
    function (err) {
      if (err) throw err;
      console.log("complete");
    }
  );
};

const data2 = parseData(metadata[0][1]).slice(0, 23);
const attribs = parseData(metadata[0][0]).slice(1, 24);
let try2 = createNewDataObj(data2, attribs);
const tr1 = updateTemplate(try2);
createDataFile(tr1);
