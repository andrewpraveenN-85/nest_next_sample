import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ProductType } from './product-type.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(() => ProductType, { eager: true })
  @JoinColumn({ name: 'product_type_id' })
  productType: ProductType;

  @Column('decimal', { precision: 10, scale: 2 })
  openingStock: number;

  @Column('decimal', { precision: 10, scale: 2 })
  currentStock: number;

  @Column('decimal', { precision: 10, scale: 2 })
  reorderLevel: number;

  @Column({
    type: 'enum',
    enum: ['kg', 'g', 'l', 'ml', 'piece', 'box', 'pack'],
    default: 'piece'
  })
  measurementUnit: string;

  @Column({ nullable: true })
  imagePath: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}