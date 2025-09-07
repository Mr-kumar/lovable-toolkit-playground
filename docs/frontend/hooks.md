## Frontend Hooks

### `useFileHandler`
Manages drag-drop/file selection with validation.

Returns:
- `files: File[]`, `errors: string[]`, `isUploading: boolean`, `isDragOver: boolean`
- `handleFiles(list: FileList|null) -> Promise<File[]>`
- `onDrop(e)`, `onDragOver(e)`, `onDragLeave(e)`
- `getFileType(file)`, `getFilesType(files)`
- `formatFileSize(bytes)`
- `clearErrors()`, `removeFile(index)`, `resetFiles()`

Usage:
```tsx
const { onDrop, onDragOver, onDragLeave, handleFiles, files, errors } = useFileHandler()
```

### `useToast` and `toast`
Global toast store.

Usage:
```tsx
import { useToast, toast } from '@/hooks/use-toast'

const { toasts, dismiss } = useToast()
toast({ title: 'Done', description: 'Completed successfully' })
```

### `useIsMobile`
Responsive helper, returns boolean.
```tsx
import { useIsMobile } from '@/hooks/use-mobile'
const isMobile = useIsMobile()
```

