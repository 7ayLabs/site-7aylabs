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

/** The Vizzor mark, as its own site draws it. */
export function VizzorMark({ className = 'h-6 w-auto' }: { className?: string }) {
  return (
    <>
      <Image src="/brand/vizzor_darkicon.png" alt="" width={364} height={535} className={`block dark:hidden ${className}`} />
      <Image src="/brand/vizzor_icon.png" alt="" width={364} height={535} className={`hidden dark:block ${className}`} />
    </>
  );
}
