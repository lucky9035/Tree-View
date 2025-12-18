export const initialTreeData = {
  id: 'root',
  label: 'Root',
  children: [
    {
      id: 'a',
      label: 'A',
      children: [
        {
          id: 'a1',
          label: 'A1',
          children: [
            { id: 'a1-1', label: 'A1-1', children: [] },
            { id: 'a1-2', label: 'A1-2', children: [] },
          ],
        },
        {
          id: 'a2',
          label: 'A2',
          children: [
            { id: 'a2-1', label: 'A2-1', children: [] },
          ],
        },
      ],
    },
    {
      id: 'b',
      label: 'B',
      children: [
        {
          id: 'b1',
          label: 'B1',
          children: [
            { id: 'b1-1', label: 'B1-1', children: [] },
            { id: 'b1-2', label: 'B1-2', children: [] },
            { id: 'b1-3', label: 'B1-3', children: [] },
          ],
        },
        {
          id: 'b2',
          label: 'B2',
          children: [],
        },
      ],
    },
    {
      id: 'c',
      label: 'C',
      children: [
        {
          id: 'c1',
          label: 'C1',
          children: [
            {
              id: 'c1-1',
              label: 'C1-1',
              children: [
                { id: 'c1-1-1', label: 'C1-1-1', children: [] },
                { id: 'c1-1-2', label: 'C1-1-2', children: [] },
              ],
            },
          ],
        },
        {
          id: 'c2',
          label: 'C2',
          children: [],
        },
      ],
    },
  ],
};

export const levelColors = [
  { bg: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', border: '#818cf8', glow: 'rgba(99, 102, 241, 0.4)' },  // Root - Indigo/Purple
  { bg: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)', border: '#22d3ee', glow: 'rgba(14, 165, 233, 0.4)' },  // Level 1 - Sky/Cyan
  { bg: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)', border: '#6ee7b7', glow: 'rgba(16, 185, 129, 0.4)' },  // Level 2 - Emerald
  { bg: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)', border: '#fcd34d', glow: 'rgba(245, 158, 11, 0.4)' },  // Level 3 - Amber
  { bg: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)', border: '#f9a8d4', glow: 'rgba(236, 72, 153, 0.4)' },  // Level 4 - Pink
  { bg: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)', border: '#fca5a5', glow: 'rgba(239, 68, 68, 0.4)' },   // Level 5 - Red
];

