const paths = {
  book: <><path d="M4 5.5A3.5 3.5 0 0 1 7.5 2H12v18H7.5A3.5 3.5 0 0 0 4 23.5Z" /><path d="M20 5.5A3.5 3.5 0 0 0 16.5 2H12v18h4.5a3.5 3.5 0 0 1 3.5 3.5Z" /></>,
  shield: <path d="M12 3 4.5 6v5.5c0 4.8 3.1 8.1 7.5 9.5 4.4-1.4 7.5-4.7 7.5-9.5V6Z" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></>,
  chart: <><path d="M4 20V5" /><path d="M4 20h16" /><path d="m7 16 4-5 3 2 5-7" /></>,
  formula: <><path d="M5 5h13" /><path d="m8 5-3 7 3 7" /><path d="M12 10h7M12 15h5" /></>,
  reset: <><path d="M4 11a8 8 0 1 1 2.3 5.7" /><path d="M4 5v6h6" /></>,
  home: <><path d="m3 11 9-8 9 8" /><path d="M5.5 9.5V21h13V9.5" /><path d="M10 21v-6h4v6" /></>,
  left: <path d="m15 18-6-6 6-6" />,
  right: <path d="m9 18 6-6-6-6" />,
};

export function Icon({ name, size = 20 }) {
  return <svg className="icon" aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}
