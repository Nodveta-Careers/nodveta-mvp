import dynamic from "next/dynamic";

export default function createClientPage(importFn) {
  return dynamic(importFn, { ssr: false });
}
