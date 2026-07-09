import Image from "next/image";

interface NorthbridgeLogoProps {
  className?: string;
}

export default function NorthbridgeLogo({ className = "" }: NorthbridgeLogoProps) {
  return (
    <Image
      src="/northbridge-logo.png"
      alt="Northbridge Venture Group"
      width={1024}
      height={512}
      className={`block h-auto w-auto shrink-0 ${className}`}
      priority
    />
  );
}
