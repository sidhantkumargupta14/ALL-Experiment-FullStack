# Interactive Calendar + Performance Optimization + Testing

## Port
This project runs on **5176**, different from the earlier projects.

## Features
- Month calendar view
- One-week calendar view below the month view
- Dynamic post/event rendering
- Click an event to view/edit it
- Create, edit and delete posts
- Drag-and-drop rescheduling
- Optimization mode ON/OFF
- Render count for event cards
- `React.memo`, `useMemo`, `useCallback`
- Unit/component tests with Vitest + React Testing Library

## Run
```bash
npm install
npm run dev
```

Open: http://localhost:5176

## Test
```bash
npm test
```

The optimization toggle is educational: turning optimization ON uses memoized event cards and stable callbacks; OFF uses regular rendering so render-count differences can be observed.
