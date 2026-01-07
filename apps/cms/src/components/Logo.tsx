import React from 'react';
import logo from '@/assets/abacus-logo.svg';
import logoDark from '@/assets/abacus-logo.svg';
import Image from 'next/image';

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Image className="h-full w-auto object-contain dark:hidden" src={logo} alt="abacus logo" />
      <Image className="h-full w-auto object-contain hidden dark:block" src={logoDark} alt="abacus logo" />
    </div>
  );
}