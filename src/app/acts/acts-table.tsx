
"use client";

import { Act } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge";

interface ActsTableProps {
  acts: Act[];
  onEdit: (act: Act) => void;
  onDelete: (actCode: string) => void;
}

export function ActsTable({ acts, onEdit, onDelete }: ActsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Code</TableHead>
            <TableHead>Designation</TableHead>
            <TableHead className="w-[100px]">Cotation</TableHead>
            <TableHead className="w-[150px] text-right">Honoraire (TND)</TableHead>
            <TableHead className="w-[100px] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {acts.length > 0 ? (
            acts.map((act) => (
              <TableRow key={act.code}>
                <TableCell>
                  <Badge variant="outline">{act.code}</Badge>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{act.designation}</div>
                  {act.notes && <div className="text-xs text-muted-foreground italic pt-1">Note: {act.notes}</div>}
                </TableCell>
                <TableCell>{act.cotation}</TableCell>
                <TableCell className="text-right font-mono">{act.honoraire?.toFixed(3) ?? "N/A"}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(act)}>
                        <Pencil className="h-4 w-4"/>
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the medical act.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDelete(act.code)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                    No acts in this group.
                </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
