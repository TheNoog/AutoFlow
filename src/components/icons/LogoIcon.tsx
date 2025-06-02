import type { LucideProps } from 'lucide-react';
import { GitFork } from 'lucide-react'; // Using GitFork as a placeholder, it visually represents flows/branches

const LogoIcon = (props: LucideProps) => {
  return <GitFork {...props} />;
};

export default LogoIcon;
