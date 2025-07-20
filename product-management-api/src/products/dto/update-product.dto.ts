// src/products/dto/update-product.dto.ts
import { IsNumber, IsString, IsOptional } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  productTypeId?: number;

  @IsOptional()
  @IsNumber()
  openingStock?: number;

  @IsOptional()
  @IsNumber()
  reorderLevel?: number;

  @IsOptional()
  @IsString()
  measurementUnit?: string;

  @IsOptional()
  imagePath?: string;
}