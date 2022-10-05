let ROLE = null; // Possible values: 'master', 'viewer', null

function getRandomClientId() {
  return Math.random().toString(36).substring(2).toUpperCase();
}

const formValues = {
  region: null,
  channelName: null,
  clientId: getRandomClientId(),
  sendVideo: true,
  sendAudio: false,
  openDataChannel: false,
  widescreen: true,
  fullscreen: false,
  useTrickleICE: true,
  natTraversalDisabled: false,
  forceTURN: false,
  accessKeyId: null,
  endpoint: null,
  secretAccessKey: null,
  sessionToken: null,
};

function onStatsReport(report) {
  // TODO: Publish stats
}

function onStop() {
  if (!ROLE) {
    return;
  }
  if (ROLE === 'master') {
    stopMaster();
  }
  ROLE = null;
}

window.addEventListener('beforeunload', onStop);

window.addEventListener('error', event => {
  console.error(event.message);
  event.preventDefault();
});

window.addEventListener('unhandledrejection', event => {
  console.error(event.reason.toString());
  event.preventDefault();
});

async function startMasterStream() {
  ROLE = 'master';
  const localView = $('#master .local-view')[0];
  startMaster(localView, null, formValues, onStatsReport, event => {});
}
