const Datalayer = require("chia-datalayer");
const changeListChunker = require("chia-changelist-chunks");
const defaultConfig = require("./defaultConfig");

let config = defaultConfig;
let datalayer = new Datalayer(config);
changeListChunker.configure(config);

function configure(newConfig) {
  config = { ...config, ...newConfig };
  datalayer = new Datalayer(config);
  changeListChunker.configure(config);
}

const encodeHex = (str) => {
  return Buffer.from(str).toString("hex");
};

const decodeHex = (str = "") => {
  return Buffer.from(str.replace("0x", ""), "hex").toString("utf8");
};

const isValidHexadecimal = (value) => {
  if (value?.startsWith("0x")) {
    value = value.slice(2);
  }
  const hexRegex = /^[0-9a-fA-F]+$/;
  return hexRegex.test(value?.trim());
};

const generateChange = async (storeId, action, key, value) => {
  if (!isValidHexadecimal(key)) {
    throw new Error(`Key ${key} is not a valid hexadecimal string`);
  }

  if (action == "insert" && !isValidHexadecimal(value)) {
    throw new Error(`Value for ${key} is not a valid hexadecimal string`);
  }

  // Update doesnt require knowledge of existing keys
  if (action === "upsert") {
    return generateUpsertChange(key, value);
  }

  const existingKeys = await datalayer.getKeys({ id: storeId });

  if (action === "insert") {
    return generateInsertChange(existingKeys?.keys || [], key, value);
  } else if (action === "delete") {
    return generateDeleteChange(existingKeys?.keys || [], key);
  } else {
    throw new Error(`Action ${action} is not supported`);
  }
};

const generateUpsertChange = async (key, value) => {
  const change = [];

  console.log(`Upsert: Key ${decodeHex(key)}`);

  change.push({
    action: "upsert",
    key: key,
    value: value,
  });

  return change;
};

const generateInsertChange = (existingKeys, key, value) => {
  const change = [];

  const hexKey = key.startsWith("0x") ? key : "0x" + key;

  if (existingKeys.includes(hexKey)) {
    console.log(`UPDATE: Key ${decodeHex(key)}`);
    change.push({
      action: "delete",
      key: key,
    });
  } else {
    console.log(`INSERT: Key ${decodeHex(key)}`);
  }

  change.push({
    action: "insert",
    key: key,
    value: value,
  });

  return change;
};

const generateDeleteChange = async (existingKeys, key) => {
  const change = [];

  const hexKey = key.startsWith("0x") ? key : "0x" + key;

  if (existingKeys.includes(hexKey)) {
    console.log(
      `DELETE: Key ${decodeHex(key)} exists in store adding to change list`
    );
    change.push({
      action: "delete",
      key: key,
    });
  } else {
    console.warn(
      `Key ${decodeHex(key)} does not exist in store not adding to change list`
    );
  }

  return change;
};

const generateChangeList = async (
  storeId,
  action,
  keyValueArray,
  options = {}
) => {
  if (!options.chunkChangeList) {
    options.chunkChangeList = false;
  }

  let changeList = [];

  for (const keyValue of keyValueArray) {
    const { key, value } = keyValue;
    const change = await generateChange(storeId, action, key, value);
    changeList.push(...change);
  }

  if (options.chunkChangeList) {
    changeList = changeListChunker.chunkChangeList(storeId, changeList);
  }
  return changeList;
};

module.exports = {
  configure,
  encodeHex,
  decodeHex,
  generateChangeList,
};
