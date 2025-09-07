## Frontend Utils and Data

### `lib/utils.ts`
- `cn(...classes)` — Tailwind class merger (`clsx` + `tailwind-merge`)

Usage:
```tsx
import { cn } from '@/lib/utils'
<div className={cn('p-4', isActive && 'bg-blue-500')} />
```

### `data/toolsConfig.ts`
Structured config of tool categories and tools.
- Types: `FileType`, `Tool`, `ToolCategory`
- Export: `toolsConfig: Record<string, ToolCategory>`

Usage (filter tools by compatibility):
```ts
import { toolsConfig } from '@/data/toolsConfig'
const organize = toolsConfig.organize.tools
```

### `data/toolsData.ts`
Flat list of tools for galleries and search.
- Exports: `toolsData: Tool[]`, `workflowTemplates: Tool[]`, `getToolsByCategory(category: string)`

Usage:
```ts
import { getToolsByCategory } from '@/data/toolsData'
const tools = getToolsByCategory('Convert PDF')
```

