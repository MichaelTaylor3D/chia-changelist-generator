# `chia-changelist-generator`

This README offers an overview and usage guidelines for the `chia-changelist-generator`, a utility crafted to facilitate interactions with the Chia DataLayer.

## Overview

The `chia-changelist-generator` module introduces utility functions to collaborate with the Chia DataLayer, specifically aiming to produce changesets founded on hexadecimal keys and values. Moreover, it incorporates the `chia-changelist-chunks` tool to segment the change list depending on the configuration.

## Prerequisites

- **Chia Wallet**: This tool hinges on the Chia Wallet to ensure there aren't any lingering transactions before probing the DataLayer. This step is essential for working with the latest available data.

- **Chia DataLayer**: The DataLayer must be active, given the utility examines if specific keys already exist, subsequently determining the fitting change operation for the change list.

## Default Configuration

The utility is pre-loaded with a built-in configuration as follows:

```javascript
{
  datalayer_host: "https://localhost:8562",
  wallet_host: "https://localhost:9256",
  certificate_folder_path: "~/.chia/mainnet/config/ssl"
}
```

You can effortlessly supersede this default setup through the `configure` method.

## Features

1. **Configuration Update**: Enables on-the-fly adjustments of the DataLayer RPC and changeListChunker with fresh configurations.
2. **Hexadecimal Validation**: Authenticates if a particular string is a valid hexadecimal.
3. **Hexadecimal Encoding & Decoding**: Renders methods to encode/decode strings to/from hexadecimal.
4. **Change Generation**: Constructs change tasks (like insertions or deletions) based on delivered inputs.
5. **Batch Changes with Chunking**: Handles numerous key-value pairs to generate a detailed list of modifications. It also offers an option to segment the change list.

## Getting Started

Make sure to have the `chia-changelist-generator` package:

```bash
npm install chia-changelist-generator
```

### Usage

**1. Configuration**:
Although initialized with the aforementioned default setup, you can modify it:

```javascript
const changeListGenerator = require('chia-changelist-generator');
changeListGenerator.configure(yourCustomConfig);
```

**2. Generate Changes**:
To compute changes for a store from several key-value pairs:

```javascript
const changes = await changeListGenerator.generateChangeList(storeId, [{key: 'key1', value: 'value1'}, {key: 'key2', value: 'value2'}], { chunkChangeList: true });
```

This function precisely calculates the changes and can, if directed in the options, chunk the changes into several changelist if the maximum size of the changelist exceed the RPC size limits.

### Utility Functions

- **encodeHex(str)**: Transforms a conventional string to its hexadecimal variant.
  
- **decodeHex(str)**: Converts a hex string (with an optional "0x" prefix) to its UTF8 version.
  
- **isValidHexadecimal(value)**: Validates if a given string corresponds to a legit hexadecimal.

### Error Handling

In cases where the key or value diverges from a valid hexadecimal string format, the module will react by raising an error. Always integrate robust error-handling strategies when interfacing with these functions.
