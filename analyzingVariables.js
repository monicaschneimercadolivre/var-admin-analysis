import fs from 'fs/promises';

async function getVariables() {
  const variables = (await fs.readFile('majorVariables.csv', 'utf8'));
  await fs.writeFile(
    'majorVariables.json',
    JSON.stringify(variables
      .toString()
      .split('\n')
      .map((variableLine) => variableLine.split(',')).map(([variableId, callAmount]) => ({
        variableId: variableId?.replace('variable_id:', ''),
        callAmount: parseInt(callAmount, 10),
      })), null, 4),
  );
}

async function getEntities() {
  const entities = (await fs.readFile('majorEntities.csv', 'utf8'));
  await fs.writeFile(
    'majorEntities.json',
    JSON.stringify(entities.toString().split('\n').map((entity) => entity.split(',')).map(([entityId, callAmount]) => (
      {
        entity: entityId?.replace('entity_id:', ''),
        frequency: callAmount,
      }))
      .filter((entity) => entity.frequency >= 10000)
      .map((line) => line.entity), null, 4),
  );
}

async function getVariablesFromProd() {
  const variables = JSON.parse(await fs.readFile('updatedVariables.json'));
  const entities = JSON.parse(await fs.readFile('majorEntities.json'));
  console.log(entities);
  const varEntity = variables
    .filter((variable) => entities?.includes(`${variable?.variable_model.entity_id}`))
    .map((variable) => ({
      variable: variable.variable_id,
      entity: variable.variable_model.entity_id,
      field: variable.variable_model.response_field,
      script: variable.variable_model.response_script,
    }));
  // await fs.writeFile('entityVariables.json', JSON.stringify(varEntity, null, 4));
}

async function getScripts() {
  const variables = JSON.parse(await fs.readFile('entityVariables.json'));

  const scripts = variables
    .map((variable) => ({
      variable: variable.variable,
      entity: variable.entity,
      field: variable.field,
      script: variable.script !== '' && variable.script !== '(data) => data' ? variable.script : false,
    }))
    .reduce((accVariable, currVariable) => {
      const variableTemplateRegex = /\$\$([\w-]*)\$\$/g;
      if (currVariable.script) {
        if (variableTemplateRegex.test(currVariable.script) || currVariable.script.includes('getVariable')) {
          accVariable.compoundScriptVariable.push(currVariable);
        } else {
          accVariable.simpleScriptVariable.push(currVariable);
        }
      } else { accVariable.noScriptVariable.push(currVariable); }
      return accVariable;
    }, { noScriptVariable: [], simpleScriptVariable: [], compoundScriptVariable: [] });
  await fs.writeFile('majorScripts.json', JSON.stringify(scripts, null, 4));
}

async function main() {
  // await getVariables();
  // await getEntities();
  await getVariablesFromProd();
  // await getScripts();
}

main();
