import React from 'react';
import logo from '@/assets/abacus-logo.svg';
import logoDark from '@/assets/abacus-logo.svg';
import Image from 'next/image';

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={className} style={{ minHeight: '50px' }}>
      <Image 
        src={logo} 
        alt="abacus logo" 
        width={175} 
        height={150} 
        className="object-contain dark:hidden" 
        style={{ width: 'auto', height: '150px' }}
      />
      <Image 
        src={logoDark} 
        alt="abacus logo" 
        width={175} 
        height={150} 
        className="object-contain hidden dark:block" 
        style={{ width: 'auto', height: '150px' }}
      />
    </div>
  );
}