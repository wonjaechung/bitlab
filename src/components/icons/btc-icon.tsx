import React from 'react';

export const BtcIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" fill="#F7931A" stroke="none" />
    <path
      d="M8 12.5C8 11.6716 8.67157 11 9.5 11H13.5C14.8807 11 16 9.88071 16 8.5C16 7.11929 14.8807 6 13.5 6H9V18H13.5C14.8807 18 16 16.8807 16 15.5C16 14.1193 14.8807 13 13.5 13H9.5M12 11V6M12 18V13"
      stroke="white"
      strokeWidth="1.5"
    />
    <path d="M7 9H8M7 15H8" stroke="white" strokeWidth="2" />
  </svg>
);
