import * as React from 'react'
import { ReactRestrictInput } from 'react-restrict-input'

const App = () => {
  const [value, setValue] = React.useState('')
  return (
    <>
      <ReactRestrictInput
        value={value}
        onChange={setValue}
        maxChars={10}
        restrict={/[0-9a-z我]/}
      />
      <ReactRestrictInput
        value={value}
        onChange={setValue}
        maxChars={10}
        restrict={/./}
      />
    </>
  )
}

export default App
