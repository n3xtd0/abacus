import React from 'react';
import logo from '@/assets/abacus-logo.svg';
import Image from 'next/image';

export default function Icon() {
  return (
    <div>
      <Image className="w-40" src={logo} alt="abacus icon" />
    </div>
  );
}