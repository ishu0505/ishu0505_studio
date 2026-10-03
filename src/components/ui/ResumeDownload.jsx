/**
 * FILE: src/components/ui/ResumeDownload.jsx
 * WHAT IT DOES
 *   The 'Download resume' button. One place defines it, so every copy of the button stays in sync.
 */
import Button from './Button';
import { profile } from '../../data/profile';

// Single source of truth for the "download resume" action.
export default function ResumeDownload({ variant = 'dark', children = 'Download resume ↓' }) {
  return (
    <Button href={profile.resume.url} download={profile.resume.filename} variant={variant}>
      {children}
    </Button>
  );
}
