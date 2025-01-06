import { useCallback, useState } from "react";
import { Database, QueryExecResult } from "sql.js";
import Editor from '@monaco-editor/react';

interface SqlQueryToolProps {
  db: Database;
}

function SqlQueryTool(props: SqlQueryToolProps) {
  const { db } = props;
  const [query, setQuery] = useState("SELECT * from documents");
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
    <div className="grid grid-cols-2 w-full">
      <div className="flex flex-col gap-2 justify-start items-start">
        <h1 className="text-2xl font-semibold mb-4 text-left">SQL Query</h1>
        <div className="w-full mb-4">
          <Editor
            value={query}
            onChange={(text) => setQuery(text!)}
            width={800}
            height="80vh"
            defaultLanguage="sql"
            />
        </div>
        {error.length > 0 && <div className=" text-red-600">{error}</div>}
        <button
          className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={executeQuery}
        >
          Execute Query
        </button>

      </div>


      <div className="mt-4">
        {/* Место для отображения таблицы */}
        {JSON.stringify(results, null, 2)}
      </div>
    </div>
  );
}

export default SqlQueryTool;
