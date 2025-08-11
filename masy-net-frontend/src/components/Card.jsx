import React from "react";

export function Card({ children, className }) {
  return (
    <div
      className={`rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}
