import { MigrationInterface, QueryRunner } from "typeorm";

export class PopulateWallet1722775293484 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
            
            DROP TABLE IF EXISTS wallet CASCADE;
            
            CREATE TABLE IF NOT EXISTS wallet (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                cvu VARCHAR(255) UNIQUE NOT NULL,
                compromisedcurrencies JSONB,
                currencies JSONB,
                createdate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updatedate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE OR REPLACE FUNCTION update_wallet_timestamp()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updatedate = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;


            INSERT INTO wallet (cvu, currencies, compromisedcurrencies) VALUES
            ('12345678901234567890', '[{"type": "BTC", "amount": 5},{"type": "ETH", "amount": 2.5}]', '[]'),
            ('11112222333344445555', '[{"type": "BTC", "amount": 15},{"type": "XRP", "amount": 25}]', '[]'),
            ('09876543210987654321', '[{"type": "BTC", "amount": 20},{"type": "ADA", "amount": 10}]', '[]'),
            ('55554444333322221111', '[{"type": "BTC", "amount": 25},{"type": "LTC", "amount": 5}]', '[]'),
            ('98765432101234567890', '[{"type": "BTC", "amount": 30}]', '[{"type": "BTC", "amount": 30}]');
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`
            DELETE FROM wallet
            WHERE cvu IN (
                '12345678901234567890',
                '11112222333344445555',
                '09876543210987654321',
                '55554444333322221111',
                '98765432101234567890'
            );

            DROP TABLE wallet;
        `)
    }

}
