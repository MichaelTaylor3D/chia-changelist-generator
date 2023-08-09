const Datalayer = require("chia-datalayer");
const changeListChunker = require("chia-changelist-chunks");

let config = defaultConfig;
let datalayer = Datalayer.rpc(config);
changeListChunker.configure(config);

function configure(newConfig) {
  config = { ...config, ...newConfig };
  datalayer = Datalayer.rpc(config);
  changeListChunker.configure(config);
}

const encodeHex = (str) => {
  return Buffer.from(str).toString("hex");
};

const decodeHex = (str = "") => {
  return Buffer.from(str.replace("0x", ""), "hex").toString("utf8");
};

const isValidHexadecimal = (value) => {
  const hexRegex = /^[0-9a-fA-F]+$/;
  return hexRegex.test(value);
};

const generateChange = async (storeId, action, key, value) => {
  if (!isValidHexadecimal(key)) {
    throw new Error(`Key ${key} is not a valid hexadecimal string`);
  }

  if (!isValidHexadecimal(value)) {
    throw new Error(
      `Value for ${decodeHex(key)} is not a valid hexadecimal string`
    );
  }

  const existingKeys = await datalayer.getKeys({ id: storeId });

  if (action === "insert") {
    return await generateInsertChange(storeId, existingKeys, key, value);
  } else if (action === "delete") {
    return await generateDeleteChange(storeId, existingKeys, key);
  } else {
    throw new Error(`Action ${action} is not supported`);
  }
};

const generateInsertChange = async (existingKeys, key, value) => {
  const change = [];

  if (existingKeys.includes(key)) {
    change.push({
      action: "delete",
      key: key,
    });
  }

  change.push({
    action: "insert",
    key: key,
    value: value,
  });

  return change;
};

const generateDeleteChange = async (key) => {
  const change = [];

  if (existingKeys.includes(key)) {
    change.push({
      action: "delete",
      key: key,
    });
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
    changeList = changeListChunker.chunkChangeList(changeList);
  }
  return changeList;
};

module.exports = {
  configure,
  encodeHex,
  decodeHex,
  generateChangeList,
};
