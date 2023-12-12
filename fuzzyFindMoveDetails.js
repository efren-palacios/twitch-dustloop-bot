const axios = require("axios");
const Fuse = require("fuse.js");
const fs = require("fs/promises");

const baseUrl = "https://www.dustloop.com/wiki/index.php";
const endpoint = "Special:CargoExport";
const table = "MoveData_GGST";
const fields =
  "chara, input, name, damage, guard, startup, active, recovery, onBlock, onHit, invuln, type";
const orderBy = "`chara`, `input`, `name`";
const limit = 9999;
const format = "json";

const mainQuery = `${baseUrl}?title=${endpoint}&tables=${table}&fields=${encodeURIComponent(
  fields
)}&order+by=${encodeURIComponent(orderBy)}&limit=${limit}&format=${format}`;

const cacheFilePath = "cachedData.json"; // Path to the cached data file
const cacheDurationMs = 3600000; // 1 hour in milliseconds

let cachedData = null;
let lastCacheTime = 0;

async function fetchData() {
  // Check if cached data is still valid
  const currentTime = Date.now();
  if (!cachedData || currentTime - lastCacheTime > cacheDurationMs) {
    try {
      // Fetch the data from the source
      const response = await axios.get(mainQuery);
      cachedData = response.data;

      // Update the cache timestamp
      lastCacheTime = currentTime;

      // Save the data to the cache file
      await fs.writeFile(cacheFilePath, JSON.stringify(cachedData));
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }
  return cachedData;
}

// Function to load data from the cache file
async function loadCachedData() {
  try {
    const data = await fs.readFile(cacheFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading cached data:", error);
    return [];
  }
}

// Initialize cached data from the cache file
loadCachedData()
  .then((data) => {
    if (data) {
      cachedData = data;
    }
  })
  .catch((error) => {
    console.error("Error loading cached data:", error);
  });

// Define a mapping of aliases to character names
let characterAliases = {
  AN: "Anji",
  AS: "Asuka",
  AX: "Axl",
  BA: "Baiken",
  BE: "Bedman",
  BR: "Bridget",
  CH: "Chipp",
  EL: "Elphelt",
  FA: "Faust",
  GI: "Giovanna",
  GO: "Goldlewis",
  HA: "Happy",
  IN: "I-No",
  JC: "Jack-O",
  JO: "Johnny",
  KY: "Ky",
  LE: "Leo",
  MA: "May",
  MI: "Millia",
  NA: "Nagoriyuki",
  PO: "Potemkin",
  RA: "Ramlethal",
  SI: "Sin",
  SO: "Sol",
  TE: "Testament",
  ZA: "Zato",
};

const fullAlias = {
  AN: "Anji Mito",
  AS: "Asuka R♯",
  AX: "Axl Low",
  BA: "Baiken",
  BE: "Bedman",
  BR: "Bridget",
  CH: "Chipp Zanuff",
  EL: "Elphelt Valentine",
  FA: "Faust",
  GI: "Giovanna",
  GO: "Goldlewis Dickinson",
  HA: "Happy Chaos",
  IN: "I-No",
  JC: "Jack-O",
  JO: "Johnny",
  KY: "Ky Kiske",
  LE: "Leo Whitefang",
  MA: "May",
  MI: "Millia Rage",
  NA: "Nagoriyuki",
  PO: "Potemkin",
  RA: "Ramlethal",
  SI: "Sin Kiske",
  SO: "Sol Badguy",
  TE: "Testament",
  ZA: "Zato-1",
};

async function fuzzyFindMoveDetails(characterAlias, inputOrMoveName, property) {
  let characterKey;

  if (characterAliases[characterAlias.toUpperCase()]) {
    characterKey = characterAlias.toUpperCase();
  }

  if (!characterKey) {
    characterKey = Object.keys(characterAliases).find(
      (key) =>
        characterAliases[key].toLowerCase() === characterAlias.toLowerCase()
    );
  }

  if (!characterKey) {
    return "Character not found";
  }

  const data = await fetchData();
  const options = {
    includeScore: true,
    keys: ["chara", "input", "name"],
  };

  // Filter the data to include only entries for the specified character
  const filteredData = data.filter(
    (entry) => entry.chara === fullAlias[characterKey]
  );

  // Use the filtered data for the search
  const filteredFuse = new Fuse(filteredData, options);

  // Search by character key first
  let result = filteredFuse.search({ chara: fullAlias[characterKey] });

  // If no result found for character key, return
  if (result.length === 0) {
    return "Character not found";
  }

  // Perform fuzzy search for the input or move name
  result = filteredFuse.search({ input: inputOrMoveName });

  if (result.length > 0) {
    const move = result[0].item;

    const humanReadableProperty = {
      chara: "Character",
      input: "Input Command",
      name: "Move Name",
      images: "Images",
      damage: "Damage",
      guard: "Guard Type",
      startup: "Startup Frames",
      active: "Active Frames",
      recovery: "Recovery Time",
      onBlock: "Advantage on Block",
      onHit: "Advantage on Hit",
      invul: "Invulnerability",
      type: "Move Type",
    };

    // Find the matching property key (case-insensitive)
    const matchingPropertyKey = Object.keys(humanReadableProperty).find(
      (key) => key.toLowerCase() === property.toLowerCase()
    );

    if (matchingPropertyKey) {
      const formattedProperty = humanReadableProperty[matchingPropertyKey];
      let propertyValue = move[matchingPropertyKey];

      // Check if the property exists and is not null
      if (propertyValue !== null && propertyValue !== undefined) {
        // Convert numeric properties to strings
        if (typeof propertyValue === "number") {
          propertyValue = propertyValue.toString();
        }

        const capitalizedPropertyValue =
          propertyValue.charAt(0).toUpperCase() + propertyValue.slice(1);
        return `${formattedProperty}: ${capitalizedPropertyValue}`;
      } else {
        return `${formattedProperty}: N/A`; // Property is null or undefined
      }
    } else {
      return "Invalid property"; // Property not found in humanReadableProperty
    }
  }

  return "Move not found";
}

module.exports = { fuzzyFindMoveDetails };
