import { relations } from "drizzle-orm";
import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable('users', {
    id: int().primaryKey({ autoIncrement: true }),
    username: text().notNull().unique(),
    password: text().notNull(),
    is_active: int().default(1),
    role: text({ enum: ['USER', 'ADMIN'] }).default('USER'),
})

export const assetsTable = sqliteTable('assets', {
    id: int().primaryKey({ autoIncrement: true }),
    user_id: int().notNull().references(() => usersTable.id),
    currency: text({ enum: ['usd', 'thb'] }).default('usd'),
    name: text().notNull(),
    description: text(),
    ratio: real(),
    sequence: int().default(0)
})

export const portsTable = sqliteTable('ports', {
    id: int().primaryKey({ autoIncrement: true }),
    asset_id: int().notNull().references(() => assetsTable.id),
    name: text().notNull(),
    description: text(),
    ratio: real(),
    sequence: int().default(0)
})

export const stocksTable = sqliteTable('stocks', {
    id: int().primaryKey({ autoIncrement: true }),
    port_id: int().notNull().references(() => portsTable.id),
    type: text({ enum: ['stock', 'fund', 'crypto'] }).default('stock'),
    symbol: text().notNull(),
    amount: real().notNull(), // Amount of unit to have
    cost: real().notNull(), // Average cost per unit
    total_cost: real(),
    price: real(),
    value: real(), // For funds or manual tracking
    sequence: int().default(0),
    ratio: real(),
})

// RELATIONS
export const usersRelations = relations(usersTable, ({ many }) => ({
    assets: many(assetsTable),
}))

export const assetsRelations = relations(assetsTable, ({ one, many }) => ({
    user: one(usersTable, {
        fields: [assetsTable.user_id],
        references: [usersTable.id],
    }),
    ports: many(portsTable),
}))

export const portsRelations = relations(portsTable, ({ one, many }) => ({
    asset: one(assetsTable, {
        fields: [portsTable.asset_id],
        references: [assetsTable.id],
    }),
    stocks: many(stocksTable),
}))

export const stocksRelations = relations(stocksTable, ({ one }) => ({
    port: one(portsTable, {
        fields: [stocksTable.port_id],
        references: [portsTable.id],
    }),
}))