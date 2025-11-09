# AI Development Rules

## Tech Stack Overview

• **Frontend Framework**: Next.js 14 with App Router
• **Language**: TypeScript
• **Styling**: Tailwind CSS with shadcn/ui components
• **Component Library**: shadcn/ui built on Radix UI primitives
• **Icons**: lucide-react icon library
• **State Management**: React built-in hooks (useState, useEffect, useRef)
• **HTTP Client**: Native fetch API (no axios)
• **WebSocket Communication**: Native WebSocket API
• **UI Components**: Reusable components in src/components
• **Page Structure**: Pages organized in src/pages directory

## Library Usage Rules

### ✅ Approved Libraries

1. **UI Components**: Use shadcn/ui components exclusively for UI elements
2. **Icons**: Use lucide-react for all icons
3. **Styling**: Use Tailwind CSS classes for all styling
4. **Forms**: Use shadcn/ui form components with react-hook-form
5. **Data Display**: Use shadcn/ui table, card, badge components
6. **Navigation**: Use React Router for client-side routing
7. **Hooks**: Use built-in React hooks or create custom hooks when needed

### ❌ Prohibited Libraries

1. **No external UI libraries** other than shadcn/ui (no Material UI, Ant Design, etc.)
2. **No external styling solutions** other than Tailwind CSS (no styled-components, emotion, etc.)
3. **No state management libraries** (no Redux, Zustand, Jotai, etc.)
4. **No class-based components** - use functional components with hooks
5. **No jQuery or DOM manipulation libraries**
6. **No external form libraries** other than react-hook-form with shadcn/ui

### 🎯 Component Development Rules

1. **File Structure**: Each component must be in its own file in src/components
2. **Component Size**: Keep components under 100 lines when possible
3. **Props**: Define clear prop interfaces with TypeScript
4. **Styling**: Use Tailwind classes directly in components
5. **Responsiveness**: All components must be mobile-responsive
6. **Accessibility**: Follow ARIA guidelines and use semantic HTML
7. **Reusability**: Components should be generic and reusable
8. **No Business Logic**: Components should only handle UI concerns

### 📁 Project Structure Rules

1. **Pages**: All pages go in src/pages directory
2. **Components**: All reusable components go in src/components
3. **Hooks**: Custom hooks go in src/hooks
4. **Utilities**: Helper functions go in src/lib/utils
5. **Styles**: Global styles in src/index.css and component-specific Tailwind classes
6. **No inline styles** - use Tailwind classes instead

### 🧪 Development Practices

1. **Type Safety**: Use TypeScript for all components and pages
2. **Error Handling**: Implement proper error boundaries and error states
3. **Loading States**: Show loading indicators for async operations
4. **Performance**: Optimize images and lazy load components when appropriate
5. **Testing**: Write unit tests for complex logic
6. **Documentation**: Comment complex logic and export clear component interfaces