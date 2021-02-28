# react-restrict-input

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/react-restrict-input.svg)](https://www.npmjs.com/package/react-restrict-input) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-restrict-input
```

## Usage

```tsx
import React, { Component } from 'react'

import { ReactRestrictInput } from 'react-restrict-input'

const App = () => {
  const [value, setValue] = React.useState('')
  return (
    <ReactRestrictInput
      value={value}
      onChange={setValue}
      maxChars={10}
      restrict={/[0-9a-z我]/}
    />
  )
}
```

## License

MIT © [tkitesy](https://github.com/tkitesy)
