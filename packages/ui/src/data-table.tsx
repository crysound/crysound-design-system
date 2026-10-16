"use client";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Button, EmptyState, Input } from "./index";
import { Checkbox } from "./forms";
import { Pagination } from "./navigation";
export interface DataColumn<T> {
  id: string;
  header: string;
  accessor: (row: T) => string | number;
  cell?: (row: T) => ReactNode;
  sortable?: boolean;
}
export interface DataTableProps<T> {
  data: T[];
  columns: DataColumn<T>[];
  getRowId: (row: T) => string;
  caption: string;
  pageSize?: number;
  searchPlaceholder?: string;
  selectable?: boolean;
  onSelectionChange?: (ids: string[]) => void;
  emptyTitle?: string;
}
export function DataTable<T>({
  data,
  columns,
  getRowId,
  caption,
  pageSize = 5,
  searchPlaceholder = "搜索所有列…",
  selectable = false,
  onSelectionChange,
  emptyTitle = "没有匹配记录",
}: DataTableProps<T>) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{ id: string; direction: "asc" | "desc" }>();
  const [selected, setSelected] = useState<string[]>([]);
  const size = Math.max(1, Math.floor(pageSize));
  const rows = useMemo(() => {
    const filtered = data.filter((row) =>
      columns.some((column) =>
        String(column.accessor(row))
          .toLocaleLowerCase()
          .includes(query.toLocaleLowerCase()),
      ),
    );
    if (!sort) return filtered;
    const column = columns.find((c) => c.id === sort.id);
    return column
      ? [...filtered].sort((a, b) => {
          const av = column.accessor(a),
            bv = column.accessor(b);
          const order =
            typeof av === "number" && typeof bv === "number"
              ? av - bv
              : String(av).localeCompare(String(bv), undefined, {
                  numeric: true,
                });
          return sort.direction === "asc" ? order : -order;
        })
      : filtered;
  }, [data, columns, query, sort]);
  const pageCount = Math.max(1, Math.ceil(rows.length / size));
  const currentPage = Math.min(page, pageCount);
  const visible = rows.slice((currentPage - 1) * size, currentPage * size);
  const ids = visible.map(getRowId);
  const checked = ids.length > 0 && ids.every((id) => selected.includes(id));
  const mixed = ids.some((id) => selected.includes(id));
  const select = (next: string[]) => {
    setSelected(next);
    onSelectionChange?.(next);
  };
  useEffect(() => {
    const available = new Set(data.map(getRowId));
    const next = selected.filter((id) => available.has(id));
    if (next.length !== selected.length) {
      setSelected(next);
      onSelectionChange?.(next);
    }
  }, [data, getRowId, selected, onSelectionChange]);
  return (
    <div className="cs-data-table">
      <div className="cs-table-toolbar">
        <Input
          label="搜索记录"
          placeholder={searchPlaceholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
        <span className="cs-help" role="status">
          {rows.length} 条记录{selectable && ` · 已选 ${selected.length} 条`}
        </span>
      </div>
      {rows.length ? (
        <div className="cs-table-scroll">
          <table className="cs-table">
            <caption className="cs-sr-only">{caption}</caption>
            <thead>
              <tr>
                {selectable && (
                  <th scope="col">
                    <Checkbox
                      label={<span className="cs-sr-only">选择当前页</span>}
                      checked={checked ? true : mixed ? "indeterminate" : false}
                      onCheckedChange={(value) =>
                        select(
                          value === true
                            ? Array.from(new Set([...selected, ...ids]))
                            : selected.filter((id) => !ids.includes(id)),
                        )
                      }
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.id}
                    scope="col"
                    aria-sort={
                      sort?.id === column.id
                        ? sort.direction === "asc"
                          ? "ascending"
                          : "descending"
                        : column.sortable
                          ? "none"
                          : undefined
                    }
                  >
                    {column.sortable ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setSort({
                            id: column.id,
                            direction:
                              sort?.id === column.id && sort.direction === "asc"
                                ? "desc"
                                : "asc",
                          })
                        }
                      >
                        {column.header}
                        <svg className="cs-sort-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          {sort?.id !== column.id ? <><path d="M8 19V5m-4 4 4-4 4 4" /><path d="M16 5v14m-4-4 4 4 4-4" /></> : sort.direction === "asc" ? <path d="M12 19V5m-6 6 6-6 6 6" /> : <path d="M12 5v14m-6-6 6 6 6-6" />}
                        </svg>
                      </Button>
                    ) : (
                      column.header
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr
                  key={getRowId(row)}
                  data-selected={selected.includes(getRowId(row)) || undefined}
                >
                  {selectable && (
                    <td>
                      <Checkbox
                        label={
                          <span className="cs-sr-only">
                            选择记录 {getRowId(row)}
                          </span>
                        }
                        checked={selected.includes(getRowId(row))}
                        onCheckedChange={(value) =>
                          select(
                            value === true
                              ? [...selected, getRowId(row)]
                              : selected.filter((id) => id !== getRowId(row)),
                          )
                        }
                      />
                    </td>
                  )}
                  {columns.map((column) => (
                    <td key={column.id}>
                      {column.cell?.(row) ?? column.accessor(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState
          title={emptyTitle}
          description="请调整搜索词或检查数据来源。"
        />
      )}
      <div className="cs-table-footer">
        <span className="cs-help">
          第 {currentPage} / {pageCount} 页
        </span>
        <Pagination
          page={currentPage}
          pageCount={pageCount}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

/** Long titles remain readable without making the entire row bold. */
export function TableCellText({children, description}: {children: ReactNode; description?: ReactNode}) {
  return <div className="cs-table-cell-text"><div>{children}</div>{description && <small>{description}</small>}</div>;
}
