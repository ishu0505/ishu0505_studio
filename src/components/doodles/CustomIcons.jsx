/**
 * FILE: src/components/doodles/CustomIcons.jsx
 * WHAT IT DOES
 *   Gives <Doodle> access to icons you uploaded in the admin (name -> picture URL).
 *   The public site reads them from src/content/icons.json; the admin overrides this so unpublished icons preview too.
 */
import { createContext, useContext } from 'react';
import { customIcons } from '../../data/icons';

// name -> image URL for icons uploaded through the admin.
// The admin wraps its screens in a provider so not-yet-published icons preview too.
export const CustomIconsContext = createContext(customIcons);
export const useCustomIcons = () => useContext(CustomIconsContext);
