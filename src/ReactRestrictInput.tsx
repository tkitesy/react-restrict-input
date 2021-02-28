import * as React from 'react'

export interface ReactRestrictInputProps {
  restrict?: RegExp
  value: string
  onChange: (value: string) => void
  maxChars?: number
  [key: string]: any
}

function filterByRestrict(restrict: RegExp, value: string) {
  return value
    .split('')
    .filter((ch) => restrict.test(ch))
    .join('')
}
const defalutRestrict = /./

export function ReactRestrictInput(props: ReactRestrictInputProps) {
  const {
    value,
    onChange,
    restrict = defalutRestrict,
    maxChars: maxLength,
    ...others
  } = props
  const isCompositionInput = React.useRef(false)
  const lastInputSelection = React.useRef([0, 0] as [number, number])
  const lastInputValue = React.useRef('')
  const inputRef = React.useRef<HTMLInputElement | null>(null)

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      if (isCompositionInput.current) {
        // 输入法输入时，确保输入框接受所有输入
        onChange(inputValue)
      } else {
        // 非输入法输入时，只接受约束字符
        const filterValue = filterByRestrict(restrict, inputValue)
        //非输入法环境下只需判断是否超长，超过长度就不改变value的值
        if (maxLength && maxLength > 0) {
          if (filterValue.length > maxLength) {
            const [, end] = lastInputSelection.current
            Promise.resolve().then(() => {
              inputRef.current!.setSelectionRange(end, end, 'forward')
            })
            return
          }
        }
        onChange(filterValue)
      }
    },
    [restrict, onChange]
  )

  const handleKeyDown = React.useCallback(() => {
    if (!isCompositionInput.current) {
      const start = inputRef.current!.selectionStart || 0
      const end = inputRef.current!.selectionEnd || 0
      lastInputSelection.current = [start, end]
      lastInputValue.current = inputRef.current!.value
    }
  }, [])

  const handleCompositionStart = React.useCallback(() => {
    isCompositionInput.current = true
  }, [])

  const calculateInputValue = React.useCallback(
    (data: string) => {
      const lastValue = lastInputValue.current
      const [start, end] = lastInputSelection.current
      if (maxLength && maxLength > 0) {
        const filterValue = filterByRestrict(restrict, data)
        const remainLen = maxLength + (end - start) - lastValue.length
        if (remainLen > 0) {
          data = filterValue.substring(0, remainLen)
        } else {
          return lastValue
        }
      }

      const inputValue =
        lastValue.substring(0, start) +
        data +
        lastValue.substring(end, lastValue.length)
      Promise.resolve().then(() => {
        inputRef.current!.setSelectionRange(
          start + data.length,
          start + data.length,
          'forward'
        )
      })
      return inputValue
    },
    [maxLength, restrict]
  )

  const handleCompositionEnd = React.useCallback(
    (e: React.CompositionEvent<HTMLInputElement>) => {
      isCompositionInput.current = false
      let data = e.data
      onChange(calculateInputValue(data))
      e.preventDefault()
    },
    [calculateInputValue, onChange]
  )

  const handlePaste = React.useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      let data = e.clipboardData?.getData('text')
      onChange(calculateInputValue(data))
      e.preventDefault()
    },
    [calculateInputValue, onChange]
  )

  return (
    <input
      {...others}
      ref={inputRef}
      value={value}
      onKeyDown={handleKeyDown}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      onChange={handleChange}
      onPaste={handlePaste}
    />
  )
}
