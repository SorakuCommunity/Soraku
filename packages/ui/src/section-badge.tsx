import { cn } from "./utils";

interface SectionBadgeProps {
  title: string;
  className?: string;
}

const SectionBadge = ({ title, className }: SectionBadgeProps) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10",
        className,
      )}
    >
      <div className="relative flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
        <div className="absolute w-2 h-2 rounded-full bg-primary/60 animate-ping" />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-primary" />
      </div>
      <span className="text-xs font-medium text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
        {title}
      </span>
    </div>
  );
};

export default SectionBadge;
