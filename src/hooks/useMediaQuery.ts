import { useEffect, useState } from 'react';

/** آیا media query (مثل «(max-width: 960px)») الان برقرار است؟ با تغییر اندازه صفحه به‌روز می‌شود */
export const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);

  return matches;
};
