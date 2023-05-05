const fs = require('fs/promises');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
  path: './compoundScriptVariableCSV.csv',
  header: ['variable', 'entity', 'field', 'script', 'comentario', 'scriptTypes', 'programming', 'type', 'operators'].map((item) => ({ id: item, title: item })),

});

async function main() {
  const fileDataArray = [];
  const fileData = JSON.parse(await fs.readFile('majorScripts.json'));
  fileDataArray.push(fileData);
  console.log(fileData);
  try {
    const data = await csvWriter.writeRecords(fileData.compoundScriptVariable);
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

main();
