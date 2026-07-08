type NordiAvatarProps = {
  className?: string;
};

export default function NordiAvatar({ className = "h-9 w-9" }: NordiAvatarProps) {
  return (
    <span
      className={[
        "mt-1 flex shrink-0 items-center justify-center rounded-full bg-red text-[11px] font-bold uppercase tracking-wide text-white",
        className,
      ].join(" ")}
      aria-hidden
    >
      N
    </span>
  );
}
