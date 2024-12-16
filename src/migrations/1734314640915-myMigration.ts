import { MigrationInterface, QueryRunner } from "typeorm";

export class MyMigration1734314640915 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO cesar_tours.country (country_id, country) VALUES
            ('DO', 'Dominican Republic'),
            ('US', 'United States'),
            ('CA', 'Canada'),
            ('MX', 'Mexico'),
            ('BR', 'Brazil'),
            ('AR', 'Argentina'),
            ('DE', 'Germany'),
            ('FR', 'France'),
            ('JP', 'Japan'),
            ('AU', 'Australia')
          `);
          
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM cesar_tours.country 
            WHERE country IN (
              'Dominican Republic',
              'United States',
              'Canada',
              'Mexico',
              'Brazil',
              'Argentina',
              'Germany',
              'France',
              'Japan',
              'Australia'
            )
          `);
    }

}
