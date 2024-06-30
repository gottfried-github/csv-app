'use client'

import { useRef } from 'react'

const FileUploaderWithoutAction = () => {
  const refInput = useRef<HTMLInputElement>(null)

  const handleImportClick = () => {
    if (!refInput.current?.files?.length) return

    const file = refInput.current.files?.[0]
    if (!file) return

    const formData = new FormData()

    formData.append('file', file)

    fetch('http://localhost:3000/transactions/csv', {
      method: 'POST',
      body: formData,
    })
  }

  return (
    <div>
      <input type="file" multiple={false} ref={refInput} />
      <button onClick={handleImportClick}>Import</button>
    </div>
  )
}

export default FileUploaderWithoutAction
