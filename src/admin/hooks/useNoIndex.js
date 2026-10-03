/**
 * FILE: src/admin/hooks/useNoIndex.js
 * WHAT IT DOES
 *   While the admin is open, tells search engines "do not list this page".
 */
import { useEffect } from 'react';

export function useNoIndex() {
  useEffect(() => {
    const tag = document.createElement('meta');
    tag.name = 'robots';
    tag.content = 'noindex,nofollow';
    document.head.appendChild(tag);
    const oldTitle = document.title;
    document.title = 'Admin · Ishaan Parmar';
    return () => {
      tag.remove();
      document.title = oldTitle;
    };
  }, []);
}
