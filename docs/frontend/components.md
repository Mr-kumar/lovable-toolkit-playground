## Frontend Components

All components use React + TypeScript and Tailwind. Import paths assume Vite path aliases (e.g., `@/components/...`).

### `UploadSection`
Props:
- `onFilesSelected(files: File[])`
- `isUploading: boolean`
- `errors: string[]`
- `clearErrors(): void`

Usage:
```tsx
import UploadSection from '@/components/UploadSection'

<UploadSection
  onFilesSelected={(files) => console.log(files)}
  isUploading={false}
  errors={[]}
  clearErrors={() => {}}
/>
```

### `ToolSelection`
Props:
- `files: File[]`
- `onRemoveFile(index: number)`
- `onSelectTool(toolId: string)`
- `onReset()`
- `errors: string[]`
- `clearErrors()`

### `ToolInterface`
Props:
- `toolId: string`
- `toolName: string`
- `toolDescription: string`
- `toolIcon: React.ComponentType`
- `onClose()`

### `FileList`
Props: `files: File[]`, `onRemoveFile(index: number)`

### Navigation/Layout
- `Header` — top navigation with dropdowns for tools; integrates `PDFToolsDropdown`
- `Footer` — site footer
- `SearchSection` — search UI with suggestions
- `FilterSection` — category filter bar
- `PDFToolsDropdown` — dropdown content; props: `{ activeDropdown: string, onToolClick?(): void }`

### UI Primitives (`src/components/ui/*`)
Common shadcn-style primitives are available (e.g., `Button`, `Card`, `Select`, `Slider`, `Dialog`, `Tabs`, etc.). Import like:
```tsx
import { Button } from '@/components/ui/button'
```

