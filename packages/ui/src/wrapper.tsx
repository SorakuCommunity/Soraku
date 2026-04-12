import React from "react";
import { cn } from "./utils";

interface Props {
  className?: string;
  children: React.ReactNode;
}

const Wrapper = ({ className, children }: Props) => {
  return (
    <section
      className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}
    >
      {children}
    </section>
  );
};

export default Wrapper;
