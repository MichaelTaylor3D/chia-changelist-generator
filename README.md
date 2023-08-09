# `chia-changelist-generator`

This README offers an overview and usage guidelines for the `chia-changelist-generator`, a utility crafted to facilitate interactions with the Chia DataLayer.

## Overview

The `chia-changelist-generator` module provides utility functions to work with the Chia DataLayer, specifically aiming to produce changesets based on hexadecimal keys and values. Moreover, it incorporates the `chia-changelist-chunks` module to optionally segment the change list depending on the configuration.

## Prerequisites

- **Chia DataLayer**: The utility primarily interfaces with the Chia DataLayer. It checks for existing keys, determining the appropriate change operation (insert or delete) for the change list.

## Default Configuration

The utility comes pre-loaded with a default configuration:

```javascript
{
  datalayer_host: "https://localhost:8562",
  wallet_host: "https://localhost:9256",
  certificate_folder_path: "~/.chia/mainnet/config/ssl"
}
```

You can override this configuration using the `configure` method.

## Features

1. **Configuration Update**: Allows you to update the DataLayer RPC and `changeListChunker` configurations dynamically.
2. **Hexadecimal Validation**: Checks if a string is a valid hexadecimal.
3. **Hexadecimal Encoding & Decoding**: Provides methods to encode/decode strings to/from hexadecimal.
4. **Change Generation**: Creates change operations (either insert or delete) based on the input.
5. **Batch Changes with Chunking**: Processes multiple key-value pairs to generate a comprehensive list of modifications. It also offers the option to segment the change list based on size constraints.

## Getting Started

Ensure you've installed the `chia-changelist-generator` package:

```bash
npm install chia-changelist-generator
```

### Usage

**1. Configuration**:
Although initialized with a default configuration, you can easily modify it:

```javascript
const changeListGenerator = require('chia-changelist-generator');
changeListGenerator.configure(yourCustomConfig);
```

**2. Generate Changes**:
To compute changes for a store using multiple key-value pairs and a specified action (either 'insert' or 'delete'):

```javascript
const changes = await changeListGenerator.generateChangeList(storeId, 'insert', [{key: 'key1', value: 'value1'}, {key: 'key2', value: 'value2'}], { chunkChangeList: true });
```

This function calculates the necessary changes and, if specified in the options, chunks the changes into multiple changelists if they exceed the RPC size limits.

### Utility Functions

- **encodeHex(str)**: Transforms a string into its hexadecimal representation.
  
- **decodeHex(str)**: Converts a hex string (with or without a "0x" prefix) into its UTF8 string representation.
  
- **isValidHexadecimal(value)**: Determines if the provided string is a valid hexadecimal.

### Error Handling

The module will throw an error if provided keys or values are not in valid hexadecimal string format, or if an unsupported action is passed to the change generator. Always ensure proper error handling when utilizing these functions.

## Support the Project

If you found this tool helpful, consider donating to support the development of more Chia Datalayer Tools.

**Donation address:** `xch1es9faez5evlvdyfjdjth40fazfm3c9gptds0reuhryf30y3kl67qtcsc83`

Your support is greatly appreciated!