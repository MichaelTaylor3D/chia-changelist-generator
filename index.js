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

const generateChange = async (storeId, key, value) => {
  if (!isValidHexadecimal(key)) {
    throw new Error(`Key ${key} is not a valid hexadecimal string`);
  }

  if (!isValidHexadecimal(value)) {
    throw new Error(
      `Value for ${decodeHex(key)} is not a valid hexadecimal string`
    );
  }

  const change = [];

  const existingKeys = await datalayer.getKeys({ id: storeId });

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

const generateChangeList = async (storeId, keyValueArray, options = {}) => {
  if (!options.chunkChangeList) {
    options.chunkChangeList = false;
  }

  let changeList = [];

  for (const keyValue of keyValueArray) {
    const {key, value} = keyValue;
    const change = await generateChange(storeId, key, value);
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
  generateChangeList
};