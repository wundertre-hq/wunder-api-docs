import { createFileRoute } from "@tanstack/react-router";
import { DocPage } from "@/components/docs/DocPage";

export const Route = createFileRoute("/$")({
  component: RouteComponent,
});

function RouteComponent() {
  const { _splat } = Route.useParams();
  return <DocPage slug={_splat ?? "introduction"} />;
}
