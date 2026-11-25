"use client";

import { useRouter } from "next/navigation";

export default function useSafeBack() {
  const router = useRouter();

  const safeBack = () => {
    const referrer = document.referrer;
    if (referrer?.includes(window.location.hostname)) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return safeBack;
}
