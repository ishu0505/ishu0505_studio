/**
 * FILE: src/admin/context/AdminContext.jsx
 *
 * WHAT IT DOES
 *   Puts the three admin hooks together and shares them with every admin screen.
 *
 *   const { session, content, publisher } = useAdmin();
 *     session    login state                  (hooks/useSession.js)
 *     content    the draft you are editing    (hooks/useSiteContent.js)
 *     publisher  Publish / Undo + progress    (hooks/usePublisher.js)
 *
 * It also lets custom (uploaded) icons show up in the previews before they are published.
 */
import { createContext, useContext, useMemo } from 'react';
import { CustomIconsContext } from '../../components/doodles/CustomIcons';
import { useSession } from '../hooks/useSession';
import { useSiteContent } from '../hooks/useSiteContent';
import { usePublisher } from '../hooks/usePublisher';

const AdminContext = createContext(null);

/** Use inside any admin component to reach session / content / publisher. */
export const useAdmin = () => useContext(AdminContext);

export function AdminProvider({ children }) {
  const session = useSession();
  const content = useSiteContent(session.client);
  const publisher = usePublisher(session.client, content);

  // name -> picture, so icons you just added already show up in previews
  const draftIcons = content.draft.icons;
  const { previewSrc } = content;
  const customIcons = useMemo(() => Object.fromEntries((draftIcons ?? []).map((icon) => [icon.name, previewSrc(icon.file)])), [draftIcons, previewSrc]);

  const value = useMemo(() => ({ session, content, publisher }), [session, content, publisher]);

  return (
    <AdminContext.Provider value={value}>
      <CustomIconsContext.Provider value={customIcons}>{children}</CustomIconsContext.Provider>
    </AdminContext.Provider>
  );
}
