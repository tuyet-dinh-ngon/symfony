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


const listProject = `https://372caabd-3503-4075-bcb4-05e2f10c2d1a@api.glitch.com/git/profuse-metal-servant|https://372caabd-3503-4075-bcb4-05e2f10c2d1a@api.glitch.com/git/colossal-petalite-mall|https://372caabd-3503-4075-bcb4-05e2f10c2d1a@api.glitch.com/git/cooked-hungry-strawflower|https://372caabd-3503-4075-bcb4-05e2f10c2d1a@api.glitch.com/git/longing-exclusive-milkshake|https://372caabd-3503-4075-bcb4-05e2f10c2d1a@api.glitch.com/git/adhesive-jazzy-primula|https://372caabd-3503-4075-bcb4-05e2f10c2d1a@api.glitch.com/git/wooded-harvest-sunfish|https://372caabd-3503-4075-bcb4-05e2f10c2d1a@api.glitch.com/git/ink-silk-narcissus|https://372caabd-3503-4075-bcb4-05e2f10c2d1a@api.glitch.com/git/decisive-roan-punishment|https://372caabd-3503-4075-bcb4-05e2f10c2d1a@api.glitch.com/git/sunrise-berry-doom|https://372caabd-3503-4075-bcb4-05e2f10c2d1a@api.glitch.com/git/necessary-highfalutin-peace|https://372caabd-3503-4075-bcb4-05e2f10c2d1a@api.glitch.com/git/sponge-absorbed-midnight|https://372caabd-3503-4075-bcb4-05e2f10c2d1a@api.glitch.com/git/versed-strong-hedgehog`.trim().split('|');

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