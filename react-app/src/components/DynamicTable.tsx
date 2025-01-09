import { QueryExecResult } from "sql.js";

interface DynamicTableProps {
  results: QueryExecResult[];
}

const DynamicTable: React.FC<DynamicTableProps> = ({ results }) => {
  if (results.length === 0) {
    return <div>No data available</div>;
  }
  const columns = results[0].columns;

  const rows = results[0].values;

  return (
    <table className="table-auto border-collapse border border-gray-400 w-full">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column} className="border border-gray-400 px-4 py-2">
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td
                key={cellIndex}
                className="border border-gray-400 px-4 py-2 text-center"
              >
                {cell !== null ? cell.toString() : "NULL"}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DynamicTable;
