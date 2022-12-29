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


const listProject = `https://6b4f73d1-6c9b-4611-9457-6359b1dcb418@api.glitch.com/git/boiling-copper-journey|https://6b4f73d1-6c9b-4611-9457-6359b1dcb418@api.glitch.com/git/spangle-titanium-koi|https://6b4f73d1-6c9b-4611-9457-6359b1dcb418@api.glitch.com/git/glamorous-political-orca|https://6b4f73d1-6c9b-4611-9457-6359b1dcb418@api.glitch.com/git/spring-flame-iguanadon|https://6b4f73d1-6c9b-4611-9457-6359b1dcb418@api.glitch.com/git/fluff-radial-cough|https://6b4f73d1-6c9b-4611-9457-6359b1dcb418@api.glitch.com/git/accessible-bold-nectarine|https://6b4f73d1-6c9b-4611-9457-6359b1dcb418@api.glitch.com/git/puzzle-rhetorical-marten|https://6b4f73d1-6c9b-4611-9457-6359b1dcb418@api.glitch.com/git/military-torpid-ocelot|https://6b4f73d1-6c9b-4611-9457-6359b1dcb418@api.glitch.com/git/balanced-dorian-cinema|https://6b4f73d1-6c9b-4611-9457-6359b1dcb418@api.glitch.com/git/incongruous-understood-tuba|https://6b4f73d1-6c9b-4611-9457-6359b1dcb418@api.glitch.com/git/bald-whip-glider|https://6b4f73d1-6c9b-4611-9457-6359b1dcb418@api.glitch.com/git/energetic-metal-sing|https://6b4f73d1-6c9b-4611-9457-6359b1dcb418@api.glitch.com/git/adventurous-florentine-wash|https://6b4f73d1-6c9b-4611-9457-6359b1dcb418@api.glitch.com/git/abstracted-angry-filament`.trim().split('|');

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