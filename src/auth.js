const config = {
  appName: 'mastoClone v0.02',
  appSite: 'http://0.0.0.0:8000',
  scope: 'read:favourites',
  url: 'https://fosstodon.org/api/v1/apps',
  baseUrl: 'https://fosstodon.org',
};

const init = function init() {
  // Wait for the user to submit their instance, then run all functions
  if (window.location.search) {
    // if the authorization_code code has been returned, it will be in the URL
    getAuthToken();
    // Then, clean up the URL
    window.history.pushState({}, '', config.appSite);
  }
};

const getClientSecret = function getClientSecret() {
  const xhr = new XMLHttpRequest();
  xhr.open('POST', config.url, true);

  xhr.onerror = () => console.error('getClientSecret failed');

  const params = new FormData();
  params.append('client_name', config.appName);
  params.append('scopes', config.scope);
  params.append('redirect_uris', config.appSite);
  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      const clientId = JSON.parse(xhr.responseText).client_id;
      const clientSecret = JSON.parse(xhr.responseText).client_secret;
      window.localStorage.setItem(`${config.appName}clientId`, clientId);
      window.localStorage.setItem(
        `${config.appName}clientSecret`,
        clientSecret,
      );
      auth();
    }
  };
  xhr.send(params);
};

const auth = function authorizeApplication() {
  const url =
    `${config.baseUrl}/oauth/authorize?` +
    `scope=${config.scope}&` +
    'response_type=code&' +
    `redirect_uri=${config.appSite}&` +
    `client_id=${window.localStorage.getItem(`${config.appName}clientId`)}&` +
    `client_secret=${window.localStorage.getItem(
      `${config.appName}clientSecret`,
    )}&`;
  window.location.href = url;
};

const getAuthToken = function useAuthCodeToGetAuthToken() {
  window.localStorage.setItem(
    `${config.appName}t5AuthCode`,
    window.location.search.split('=')[1],
  );
  const xhr = new XMLHttpRequest();
  xhr.open(
    'POST',
    `${window.localStorage.getItem('baseUrl')}/oauth/token`,
    true,
  );

  const params = new FormData();
  params.append(
    'client_id',
    window.localStorage.getItem(`${config.appName}clientId`),
  );
  params.append(
    'client_secret',
    window.localStorage.getItem(`${config.appName}clientSecret`),
  );
  params.append('grant_type', 'authorization_code');
  params.append(
    'code',
    window.localStorage.getItem(`${config.appName}t5AuthCode`),
  );
  params.append('redirect_uri', config.appSite);

  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
      const authToken = JSON.parse(xhr.responseText).access_token;
      window.localStorage.setItem(`${config.appName}token`, authToken);
    }
  };
  xhr.send(params);
};

init();
