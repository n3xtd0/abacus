import logo from '@/assets/abacus-logo.svg';
import grayLogo from '@/assets/abacus-logo-gray.svg';
import logoDark from '@/assets/abacus-logo.svg';
import Image from 'next/image';

interface Props {
  className?: string;
  height?: number;
  isGray?: boolean;
}
export default function Logo({ className, height = 150, isGray = false }: Props) {
  const logoSrc = isGray ? grayLogo : logo;
  const logoDarkSrc = isGray ? grayLogo : logoDark;
  return (
    <div className={className}>
      <Image 
        src={logoSrc} 
        alt="abacus logo" 
        width={175} 
        height={height} 
        className="object-contain dark:hidden" 
        style={{ width: 'auto', height: `${height}px` }}
      />
      <Image 
        src={logoDarkSrc} 
        alt="abacus logo" 
        width={175} 
        height={height} 
        className="object-contain hidden dark:block" 
        style={{ width: 'auto', height: `${height}px` }}
      />
    </div>
  );
}