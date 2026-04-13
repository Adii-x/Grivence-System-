import React from 'react';

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  keyExtractor: (row: T) => string;
}

function Table<T>({ columns, data, onRowClick, keyExtractor }: TableProps<T>) {
  return (
    <div className="w-full overflow-x-auto overscroll-x-contain">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="bg-elevated">
            {columns.map((col) => (
              <th key={col.key} className={`text-left px-4 py-3 text-xs uppercase tracking-wider font-medium text-text-secondary ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={keyExtractor(row)}
              onClick={() => onRowClick?.(row)}
              className={`border-b border-[hsl(var(--border-subtle))] transition-colors ${onRowClick ? 'hover:bg-elevated cursor-none' : ''}`}
            >
              {columns.map((col) => (
                <td key={col.key} className={`px-4 py-3 ${col.className || ''}`}>
                  {col.render ? col.render(row) : (row as Record<string, unknown>)[col.key] as React.ReactNode}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <div className="text-center py-12 text-text-secondary text-sm">No data found</div>
      )}
    </div>
  );
}

export default Table;
