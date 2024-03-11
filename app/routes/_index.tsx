import type { MetaFunction } from "@remix-run/cloudflare";
import { Board } from "~/MergeBoard/Board";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    {
      name: "description",
      content: "Welcome to Remix! Using Vite and Cloudflare!",
    },
  ];
};

export default function Index() {
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        fontFamily: "system-ui, sans-serif",
        lineHeight: "1.8",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Board />
    </div>
  );
}
