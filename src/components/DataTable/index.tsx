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
import FieldInfoCard from "@/components/TableModel/FieldInfoCard";
import { ModelField } from "@/types/Database";
import { useDraggable } from "@dnd-kit/core";
import { Portal as HoverCardPortal } from "@radix-ui/react-hover-card";

interface DataTableProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title: string;
  isEnum?: boolean;
}
function DataTable<TData, TValue>({
  isEnum = false,
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
              className="h-auto bg-primary/90 py-2 text-center text-primary-foreground"
            >
              {title}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length
            ? (
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
                  <HoverCardPortal>
                    <HoverCardContent
                      side="left"
                      sideOffset={10}
                      align="start"
                      hidden={isDragging || isEnum}
                    >
                      <FieldInfoCard field={row.original as ModelField} />
                    </HoverCardContent>
                  </HoverCardPortal>
                </HoverCard>
              ))
            )
            : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
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
