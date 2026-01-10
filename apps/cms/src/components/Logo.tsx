import React from 'react';
import logo from '@/assets/abacus-logo.svg';
import logoDark from '@/assets/abacus-logo.svg';
import Image from 'next/image';

export default function Logo({ className, height = 150 }: { className?: string; height?: number }) {
  return (
    <div className={className}>
      <Image 
        src={logo} 
        alt="abacus logo" 
        width={175} 
        height={height} 
        className="object-contain dark:hidden" 
        style={{ width: 'auto', height: `${height}px` }}
      />
      <Image 
        src={logoDark} 
        alt="abacus logo" 
        width={175} 
        height={height} 
        className="object-contain hidden dark:block" 
        style={{ width: 'auto', height: `${height}px` }}
      />
    </div>
  );
}