const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://d8b88d85-5f14-4735-a5a9-943df0c28c6e@api.glitch.com/git/wary-hollow-toast|https://d8b88d85-5f14-4735-a5a9-943df0c28c6e@api.glitch.com/git/quill-valuable-dahlia|https://d8b88d85-5f14-4735-a5a9-943df0c28c6e@api.glitch.com/git/stupendous-crystal-cheek|https://d8b88d85-5f14-4735-a5a9-943df0c28c6e@api.glitch.com/git/lapis-witty-kale|https://d8b88d85-5f14-4735-a5a9-943df0c28c6e@api.glitch.com/git/topaz-colossal-havarti|https://d8b88d85-5f14-4735-a5a9-943df0c28c6e@api.glitch.com/git/copper-youthful-nickel|https://d8b88d85-5f14-4735-a5a9-943df0c28c6e@api.glitch.com/git/warp-season-revolve|https://d8b88d85-5f14-4735-a5a9-943df0c28c6e@api.glitch.com/git/sleet-good-glove|https://d8b88d85-5f14-4735-a5a9-943df0c28c6e@api.glitch.com/git/loving-marbled-acorn|https://d8b88d85-5f14-4735-a5a9-943df0c28c6e@api.glitch.com/git/crystal-few-rhodium|https://d8b88d85-5f14-4735-a5a9-943df0c28c6e@api.glitch.com/git/exciting-lilac-iguanadon|https://d8b88d85-5f14-4735-a5a9-943df0c28c6e@api.glitch.com/git/dazzling-difficult-fernleaf|https://d8b88d85-5f14-4735-a5a9-943df0c28c6e@api.glitch.com/git/merciful-moored-mulberry|https://d8b88d85-5f14-4735-a5a9-943df0c28c6e@api.glitch.com/git/efficacious-plant-minotaurasaurus`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();