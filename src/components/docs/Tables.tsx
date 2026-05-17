import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export type ParamRow = {
  name: string;
  type: string;
  required?: boolean;
  description: string;
};

export function ParamTable({ rows, title }: { rows: ParamRow[]; title?: string }) {
  return (
    <div className="my-5 overflow-hidden rounded-lg border border-border">
      {title && (
        <div className="border-b border-border bg-card px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow className="bg-card hover:bg-card">
            <TableHead className="w-1/4">Name</TableHead>
            <TableHead className="w-1/5">Type</TableHead>
            <TableHead className="w-auto">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.name} className="align-top">
              <TableCell className="py-3">
                <code className="font-mono text-sm text-primary">{r.name}</code>
                {r.required && (
                  <span className="ml-2 text-[10px] font-semibold uppercase text-accent">required</span>
                )}
              </TableCell>
              <TableCell className="py-3 font-mono text-xs text-muted-foreground">{r.type}</TableCell>
              <TableCell className="py-3 text-sm text-foreground/90">{r.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export type SchemaRow = {
  name: string;
  type: string;
  nullable?: boolean;
  description: string;
};

export function SchemaTable({ rows, title = "Response" }: { rows: SchemaRow[]; title?: string }) {
  return (
    <div className="my-5 overflow-hidden rounded-lg border border-border">
      <div className="border-b border-border bg-card px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-card hover:bg-card">
            <TableHead className="w-1/4">Field</TableHead>
            <TableHead className="w-1/5">Type</TableHead>
            <TableHead className="w-auto">Description</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.name} className="align-top">
              <TableCell className="py-3">
                <code className="font-mono text-sm text-primary">{r.name}</code>
                {r.nullable && (
                  <span className="ml-2 text-[10px] uppercase text-muted-foreground">nullable</span>
                )}
              </TableCell>
              <TableCell className="py-3 font-mono text-xs text-muted-foreground">{r.type}</TableCell>
              <TableCell className="py-3 text-sm text-foreground/90">{r.description}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
