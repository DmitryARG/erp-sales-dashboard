cube(`sales`, {
  sql: `SELECT * FROM client1.sales 
        UNION ALL 
        SELECT * FROM client2.sales 
        UNION ALL 
        SELECT * FROM client3.sales`,

  measures: {
    count: {
      type: `count`
    },

    totalQuantity: {
      sql: `quantity`,
      type: `sum`
    },

    totalPrice: {
      sql: `price`,
      type: `sum`
    }
  },

  dimensions: {
    productName: {
      sql: `product_name`,
      type: `string`
    },

    saleDate: {
      sql: `sale_date`,
      type: `time`
    }
  }
});