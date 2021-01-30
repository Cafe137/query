function CafeQueryError(message) {
    this.name = 'CafeQueryError'
    this.message = message
}
CafeQueryError.prototype = Error.prototype

const assertSingle = rows => {
    if (!rows) {
        throw new CafeQueryError('Expected single result, got falsy value')
    }
    if (rows.length !== 1) {
        throw new CafeQueryError('Expected single result, got length: ' + rows.length)
    }
}

function CafeQuery(dataSource) {
    return {
        expectNone: async (query, ...values) => {
            const [rows] = await dataSource.query(query, values)
            if (!rows) {
                throw new CafeQueryError('Expected no results, got falsy value')
            }
            if (rows.length !== 0) {
                throw new CafeQueryError('Expected no results, got length: ' + rows.length)
            }
        },
        findOne: async (query, ...values) => {
            const [rows] = await dataSource.query(query, values)
            assertSingle(rows)
            return rows[0]
        },
        findFirstOrNull: async (query, ...values) => {
            const [rows] = await dataSource.query(query, values)
            if (!rows || rows.length === 0) {
                return null
            }
            return rows[0]
        },
        findAll: async (query, ...values) => {
            const [rows] = await dataSource.query(query, values)
            return rows
        },
        count: async (query, ...values) => {
            const [rows] = await dataSource.query(query, values)
            assertSingle(rows)
            return rows[0]['COUNT(*)']
        },
        query: async (query, ...values) => {
            const [rows] = await dataSource.query(query, values)
            return rows
        }
    }
}

module.exports = {
    CafeQuery,
    CafeQueryError
}
