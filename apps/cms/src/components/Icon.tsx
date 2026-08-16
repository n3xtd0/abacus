import React from 'react';
import logo from '@/assets/CP-logo.svg';
import Image from 'next/image';

export default function Icon() {
  return (
    <Image 
      src={logo} 
      alt="CP icon" 
      width={300} 
      height={100} 
      style={{ width: 'auto', height: '50px' }}
    />
  );
}