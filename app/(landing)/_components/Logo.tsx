import Image from 'next/image';
import { Poppins } from 'next/font/google';

import { cn } from '@/lib/utils';

const font = Poppins({
    subsets: ['latin'],
    weight: ["400", "600"]
});

const Logo = () => {
  return (
    <div className="hidden md:flex items-center gap-x-2">
        <Image
            src="/logo.png"
            alt="Caprice Logo"
            width="40"
            height="40"
            className='dark:hidden'
        />
        <Image
            src="/logo-dark.png"
            alt="Caprice Logo"
            width="40"
            height="40"
            className='hidden dark:block'
        />
        <p className={cn("font-semibold", font.className)}>
            Caprice
        </p>
    </div>
  )
}

export default Logo