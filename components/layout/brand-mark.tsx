import Image from 'next/image';

/** The 7ayLabs logo, in the version that reads on the current theme. */
export function BrandMark({ className = 'h-7 w-auto', priority = false }: { className?: string; priority?: boolean }) {
  return (
    <>
      <Image
        src="/7aylabs_blacklogo.png"
        alt=""
        width={410}
        height={142}
        priority={priority}
        className={`block dark:hidden ${className}`}
      />
      <Image
        src="/7aylabs_white_logo.svg"
        alt=""
        width={410}
        height={142}
        priority={priority}
        unoptimized
        className={`hidden dark:block ${className}`}
      />
    </>
  );
}
