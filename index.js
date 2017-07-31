#!/usr/bin/env node
const fetch = require("node-fetch");
const clipboard = require("copy-paste");
const { promisify } = require("util");
const { parse: parseUrl } = require("url");

const API_URL = "https://match.audio";
const fetchJson = async (url, options = {}) => {
  const mergedOptions = Object.assign(
    {
      headers: Object.assign(
        { "Content-type": "application/json" },
        options.headers
      )
    },
    options
  );
  const res = await fetch(url, mergedOptions);
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Unable to parse JSON: ${text}`);
  }
};

const match = async url => {
  try {
    return await fetchJson(`${API_URL}/search`, {
      method: "POST",
      body: { url }
    });
  } catch (error) {
    return await fetchResult(parseAudioUrl(url));
  }
};

const parseAudioUrl = url => {
  const parsed = parseUrl(url, true, true);
  switch (parsed.hostname) {
    case "play.google.com":
      return parseGoogleUrl(parsed);
  }
  throw new Error(`Unsure how to parse URL: ${url}`);
};

const parseGoogleUrl = ({ pathname, query }) => {
  const [id] = pathname.split("/").reverse();
  return { service: "google", type: id[0] === "T" ? "track" : "album", id };
};

const fetchResult = async ({ service, type, id }) => {
  const remoteUrl = `${API_URL}/${service}/${type}/${id}.json`;
  return await fetchJson(remoteUrl);
};

if (module.parent) {
  module.exports = match;
} else {
  cliInput()
    .then(match)
    .then(cliOutput)
    .then(console.log)
    .then(() => 0, () => 1)
    .then(process.exit);
}

async function cliInput() {
  return (
    (await promisify(clipboard.paste)()) ||
    process.argv[process.argv.length - 1]
  );
}

async function cliOutput(result) {
  if (result instanceof Error) {
    return `While fetching matches:\n\n${result.stack}`;
  }

  const youtubeMatch = result.matches.find(
    ({ service }) => service === "youtube"
  );
  if (youtubeMatch && youtubeMatch.streamUrl) {
    await promisify(clipboard.copy)(youtubeMatch.streamUrl);
    console.log("Copied YouTube link to clipboard!\n");
  }
  const { type, name, artist } = result;
  return [`Matches for ${type} '${name}' by ${artist.name}:`, ""]
    .concat(
      result.matches
        .filter(({ streamUrl }) => streamUrl)
        .map(({ service, streamUrl }) => ` - ${service}: ${streamUrl}`)
    )
    .join("\n");
}
