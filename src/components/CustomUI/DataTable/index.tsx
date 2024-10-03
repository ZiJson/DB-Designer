"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import FieldInfoCard from "@/components/TableModal/FieldInfoCard";
import { ModelField } from "@/types/Database";
import { useDraggable } from "@dnd-kit/core";

interface DataTableProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title: string;
}

function DataTable<TData, TValue>({
  columns,
  data,
  title,
  className,
  ...props
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const { isDragging } = useDraggable({ id: title });
  return (
    <div
      className={`overflow-hidden rounded-md border ${className}`}
      id={title}
      {...props}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              colSpan={columns.length}
              className="h-auto bg-secondary-foreground py-2 text-center text-secondary"
            >
              {title}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <HoverCard key={row.id}>
                <HoverCardTrigger asChild>
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </HoverCardTrigger>
                <HoverCardContent
                  side="left"
                  sideOffset={10}
                  align="start"
                  hidden={isDragging}
                >
                  <FieldInfoCard field={row.original as ModelField} />
                </HoverCardContent>
              </HoverCard>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default DataTable;
