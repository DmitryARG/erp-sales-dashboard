cube(`MartIncomingGoods`, {
  sql: `
    SELECT
      incoming_good_key,
      incoming_code,
      date_key,
      warehouse_key,
      product_key,
      quantity,
      status,
      creation_date,
      shipment_type,
      marketplace_key
    FROM ${COMPILE_CONTEXT.securityContext?.tenantId}.mart_incoming_goods
  `,

  dimensions: {
    incoming_good_key: {
      sql: `incoming_good_key`,
      type: `number`,
      primaryKey: true,
      shown: true
    },

    incoming_code: {
      sql: `incoming_code`,
      type: `string`
    },

    date_key: {
      sql: `date_key`,
      type: `time`
    },

    warehouse_key: {
      sql: `warehouse_key`,
      type: `number`
    },

    product_key: {
      sql: `product_key`,
      type: `number`
    },

    status: {
      sql: `status`,
      type: `string`
    },

    creation_date: {
      sql: `creation_date`,
      type: `time`
    },

    shipment_type: {
      sql: `shipment_type`,
      type: `string`
    },

    marketplace_key: {
      sql: `marketplace_key`,
      type: `number`
    },

  },

  measures: {
    quantity: {
      sql: `quantity`,
      type: `sum`
    },

    total_quantity: {
      sql: `quantity`,
      type: `sum`
    }
  },

  preAggregations: {
    // Define pre-aggregations if needed
  }
});