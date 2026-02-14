import { relations } from "drizzle-orm";
import { int, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable('users', {
    id: int().primaryKey({ autoIncrement: true }),
    username: text().notNull(),
    password: text().notNull(),
    is_active: int().default(1),
})

export const assetsTable = sqliteTable('assets', {
    id: int().primaryKey({ autoIncrement: true }),
    user_id: int().notNull().references(() => usersTable.id),
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
    symbol: text().notNull(),
    amount: real().notNull(),
    cost: real().notNull(),
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