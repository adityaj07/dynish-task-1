"use client";

import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), {
  ssr: false,
});

interface ClientLottieProps {
  animationData: unknown;
  className?: string;
}

export default function ClientLottie({
  animationData,
  className,
}: ClientLottieProps) {
  return (
    <Lottie
      animationData={animationData}
      loop={true}
      autoplay={true}
      className={className || "w-full h-full"}
      style={{ background: "transparent" }}
      rendererSettings={{
        preserveAspectRatio: "xMidYMid slice",
        progressiveLoad: true,
        hideOnTransparent: true,
      }}
    />
  );
}
