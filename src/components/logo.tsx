import React from 'react';

export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9.34 4.23a2.5 2.5 0 0 1 5.32 0l.21 1.25a4 4 0 0 0 3.86 3.14l1.37-.1a2.5 2.5 0 0 1 2.7 2.7l-.1 1.37a4 4 0 0 0 3.14 3.86l1.25.21a2.5 2.5 0 0 1 0 5.32l-1.25.21a4 4 0 0 0-3.14 3.86l.1 1.37a2.5 2.5 0 0 1-2.7 2.7l-1.37-.1a4 4 0 0 0-3.86 3.14l-.21 1.25a2.5 2.5 0 0 1-5.32 0l-.21-1.25a4 4 0 0 0-3.86-3.14l-1.37.1a2.5 2.5 0 0 1-2.7-2.7l.1-1.37a4 4 0 0 0-3.14-3.86l-1.25-.21a2.5 2.5 0 0 1 0-5.32l1.25-.21a4 4 0 0 0 3.14-3.86l-.1-1.37a2.5 2.5 0 0 1 2.7-2.7l1.37.1a4 4 0 0 0 3.86-3.14Z" />
    </svg>
  );
}
