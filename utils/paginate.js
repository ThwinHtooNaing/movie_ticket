// lib/queryBuilder.js
export async function queryBuilder({
  connection,
  table,
  page = 1,
  limit = 10,
  search,
  searchColumns = [],
  filters = {}, 
}) {
  const offset = (page - 1) * limit;
  let whereParts = [];
  let values = [];

  
  if (search && searchColumns.length > 0) {
    const searchConditions = searchColumns.map(
      (col) => `LOWER(${col}) LIKE LOWER(?)`,
    );
    whereParts.push(`(${searchConditions.join(" OR ")})`);
    values.push(...searchColumns.map(() => `%${search}%`));
  }

  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      whereParts.push(`${key} = ?`);
      values.push(value);
    }
  });

  const whereClause =
    whereParts.length > 0 ? `WHERE ${whereParts.join(" AND ")}` : "";

  // Data query
  const dataQuery = `
    SELECT * FROM ${table}
    ${whereClause}
    LIMIT ? OFFSET ?
  `;

  const [data] = await connection.query(dataQuery, [...values, limit, offset]);

  // Count query
  const countQuery = `
    SELECT COUNT(*) as total FROM ${table}
    ${whereClause}
  `;
  const [countRows] = await connection.query(countQuery, values);
  const total = countRows[0].total;

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      loaded: data.length, // helpful for "X out of Y"
    },
  };
}
