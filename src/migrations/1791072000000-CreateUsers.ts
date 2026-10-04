import { type MigrationInterface, type QueryRunner, Table } from 'typeorm';

/** Initial empty-schema migration; refuses to overwrite a pre-existing table. */
export class CreateUsers1791072000000 implements MigrationInterface {
  public readonly name = 'CreateUsers1791072000000';
  async up(runner: QueryRunner): Promise<void> {
    if (await runner.hasTable('users'))
      throw new Error(
        'Existing users table: review schema adoption before applying the initial migration',
      );
    await runner.createTable(
      new Table({
        name: 'users',
        columns: [
          { name: 'id', type: 'varchar', length: '36', isPrimary: true },
          { name: 'email', type: 'varchar', length: '254' },
          { name: 'first_name', type: 'varchar', length: '50' },
          { name: 'last_name', type: 'varchar', length: '50' },
          { name: 'created_at', type: 'datetime', precision: 6, default: 'CURRENT_TIMESTAMP(6)' },
          {
            name: 'updated_at',
            type: 'datetime',
            precision: 6,
            default: 'CURRENT_TIMESTAMP(6)',
            onUpdate: 'CURRENT_TIMESTAMP(6)',
          },
        ],
        indices: [{ name: 'UQ_users_email', columnNames: ['email'], isUnique: true }],
      }),
    );
  }
  async down(runner: QueryRunner): Promise<void> {
    await runner.dropTable('users');
  }
}
