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
