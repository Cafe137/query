function CafeQueryError(message) {
    this.name = 'CafeQueryError'
    this.message = message
}
CafeQueryError.prototype = Error.prototype

function CafeQuery(dataSource) {
    return {
        findOne: async (query, ...values) => {
            const [rows] = await dataSource.query(query, values)
            if (!rows) {
                throw new CafeQueryError('Expected single result, got falsy value')
            }
            if (rows.length !== 1) {
                throw new CafeQueryError('Expected single result, got length: ' + rows.length)
            }
            return rows[0]
        },
        findAll: async (query, ...values) => {
            const [rows] = await dataSource.query(query, values)
            return rows
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
