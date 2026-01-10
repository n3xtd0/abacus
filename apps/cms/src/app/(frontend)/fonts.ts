import localFont from 'next/font/local'

export const gothamCondensed = localFont({
  src: [
    {
      path: '../../assets/GothamCondOTF/GothamCond-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../assets/GothamCondOTF/GothamCond-Book.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../assets/GothamCondOTF/GothamCond-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../assets/GothamCondOTF/GothamCond-Bold.otf',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-gotham',
  display: 'swap',
})
