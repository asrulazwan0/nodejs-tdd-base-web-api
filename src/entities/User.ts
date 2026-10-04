import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

/** Persisted profile example; no authentication credentials. */
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid') id!: string;
  @Index('UQ_users_email', { unique: true })
  @Column({ type: 'varchar', length: 254 })
  email!: string;
  @Column({ type: 'varchar', length: 50, name: 'first_name' }) firstName!: string;
  @Column({ type: 'varchar', length: 50, name: 'last_name' }) lastName!: string;
  @CreateDateColumn({ type: 'datetime', precision: 6, name: 'created_at' }) createdAt!: Date;
  @UpdateDateColumn({ type: 'datetime', precision: 6, name: 'updated_at' }) updatedAt!: Date;
}
