import React from 'react';
import logo from '@/assets/abacus-logo.svg';
import logoDark from '@/assets/abacus-logo.svg';
import Image from 'next/image';

export default function Logo() {
  return (
    <div>
      <Image className="h-20 object-contain dark:hidden" src={logo} alt="abacus logo" />
      <Image className="h-20 object-contain hidden dark:block" src={logoDark} alt="abacus logo" />
    </div>
  );
}