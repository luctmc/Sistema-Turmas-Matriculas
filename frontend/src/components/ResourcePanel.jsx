export function ResourcePanel({ title, actions, data, columns }) {
  return (
    <section className="card">
      <header className="panel-header">
        <h3>{title}</h3>
        {actions}
      </header>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="empty">
                  Nenhum registro encontrado
                </td>
              </tr>
            )}
            {data.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => (
                  <td key={`${row.id}-${column.key}`}>
                    {typeof column.render === 'function' ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
