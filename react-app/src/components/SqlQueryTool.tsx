import { useCallback, useState } from "react";
import { Database, QueryExecResult } from "sql.js";
import Editor from '@monaco-editor/react';
import DynamicTable from "./DynamicTable";
import styles from "./SqlQueryTool.module.css"; 

interface SqlQueryToolProps {
  db: Database;
}

function SqlQueryTool(props: SqlQueryToolProps) {
  const { db } = props;
  const first_task = `SELECT 
    strftime('%Y-%m', DateCreated) AS Month,
    e.FirstName || ' ' || e.LastName AS Employee,
    SUM(CASE WHEN Type = 'Estimate' THEN 1 ELSE 0 END) AS Estimate,
    SUM(CASE WHEN Type = 'Contract' THEN 1 ELSE 0 END) AS Contract,
    ROUND(
        CASE 
            WHEN SUM(CASE WHEN Type = 'Contract' THEN 1 ELSE 0 END) = 0 THEN 0
            ELSE (CAST(SUM(CASE WHEN Type = 'Estimate' THEN 1 ELSE 0 END) AS FLOAT) / 
                  SUM(CASE WHEN Type = 'Contract' THEN 1 ELSE 0 END)) * 100 
        END, 2
    ) || '%' AS Conversion
FROM Documents d
JOIN Employees e ON d.ResponsibleEmployee = e.ID
GROUP BY Month, Employee
ORDER BY Month, Employee;
`;
  const [query, setQuery] = useState(first_task);
  const [error, setError] = useState<string>("");
  const [results, setResults] = useState<QueryExecResult[]>([]);

  const executeQuery = useCallback(() => {
    try {
      setResults(db.exec(query));
      setError("");
    } catch (error) {
      if (error instanceof Error) {
        setError(`An error occurred: ${error.message}`);
      } else if (typeof error === "string") {
        setError(error);
      } else {
        setError("An unknown error occurred");
      }
      setResults([]);
    }
  }, [db, query]);

  return (
    <div className={styles.grid}>
      <h1 className={styles.title}>SQL Query</h1>
      <div className={styles.flexContainer}>
        <div className={styles.editorContainer}>
          <Editor
            value={query}
            onChange={(text) => setQuery(text!)}
            defaultLanguage="sql"
          />
          {error && <div className={styles.textRed}>{error}</div>}
          <button className={styles.button} onClick={executeQuery}>
            Execute Query
          </button>
        </div>
        <div className={styles.tableContainer}>
          <DynamicTable results={results} />
        </div>
      </div>
    </div>
  );
}

export default SqlQueryTool;
