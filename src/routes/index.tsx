import { createFileRoute } from "@tanstack/react-router";
import { DocPage } from "@/components/docs/DocPage";

export const Route = createFileRoute("/")({
  component: () => <DocPage slug="introduction" />,
});
