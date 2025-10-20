cube(`Sales`, {
  sql: `
    SELECT
      id,
      product_name,
      sale_date,
      quantity,
      price,
      quantity * price AS total
    FROM client1.sales
  `,

  dimensions: {
    id: {
      sql: `id`,
      type: `number`,
      primaryKey: true,
      shown: true
    },

    product_name: {
      sql: `product_name`,
      type: `string`
    },

    sale_date: {
      sql: `sale_date`,
      type: `time`
    },

    quantity: {
      sql: `quantity`,
      type: `number`
    },

    price: {
      sql: `price`,
      type: `number`
    }
  },

  measures: {
    total: {
      sql: `total`,
      type: `sum`
    }
  },

  preAggregations: {
    // Define pre-aggregations if needed
  }
});