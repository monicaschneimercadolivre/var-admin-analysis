import fs from 'fs/promises';
import axios from 'axios';
import variablesIds from './variablesIds';


async function getVariables() {
    const variables = [];
  
    async function storeVariables(variable) {
      const config = {
        method: 'get',
        url: `https://internal-api.mercadolibre.com/cx/flow-assistant/storages/variables/${variable.variable_id}`,
        headers: {
          'X-Scope': 'prod',
          'X-Admin-Id': 'mschneider',
        },
      };
  
      return axios(config)
        .then((response) => {
          console.log(`${variable.variable_id} was successfuly stored`);
          return response.data;
        })
        .catch((e) => {
          console.log('Unable to store variable: ', variable.variable_id);
          console.log(e);
          return null;
        });
    }
  
    for (const variable of variablesIds) {
      const vari = await storeVariables(variable);
      variables.push(vari);
      console.log(vari);
    }
    await fs.writeFile('updatedVariables.json', JSON.stringify(variables));
  }

  async function main() {
    await getVariables();
  }
  
  main();