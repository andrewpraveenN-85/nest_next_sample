import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { ProductType } from './product-type.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(ProductType)
    private readonly productTypesRepository: Repository<ProductType>,
  ) {}

  async findAllPaginated(
    page: number = 1,
    limit: number = 10
  ): Promise<[Product[], number]> {
    try {
      return await this.productsRepository.findAndCount({
        relations: ['productType'],
        skip: (page - 1) * limit,
        take: limit,
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      this.logger.error(`Failed to fetch paginated products: ${error.message}`);
      throw new Error('Failed to fetch products');
    }
  }

  async findOne(id: number): Promise<Product> {
    try {
      const product = await this.productsRepository.findOne({
        where: { id },
        relations: ['productType']
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
      return product;
    } catch (error) {
      this.logger.error(`Failed to find product ${id}: ${error.message}`);
      throw error;
    }
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      // Check if product with same name already exists
      const existingProduct = await this.productsRepository.findOne({
        where: { name: createProductDto.name }
      });

      if (existingProduct) {
        throw new ConflictException(`Product with name '${createProductDto.name}' already exists`);
      }

      const productType = await this.productTypesRepository.findOne({
        where: { id: createProductDto.productTypeId }
      });

      if (!productType) {
        throw new NotFoundException(
          `ProductType with ID ${createProductDto.productTypeId} not found`
        );
      }

      const product = this.productsRepository.create({
        ...createProductDto,
        productType,
        currentStock: createProductDto.openingStock
      });

      return await this.productsRepository.save(product);
    } catch (error) {
      this.logger.error(`Failed to create product: ${error.message}`);
      throw error;
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    try {
      const product = await this.findOne(id);

      if (updateProductDto.name && updateProductDto.name !== product.name) {
        const existingProduct = await this.productsRepository.findOne({
          where: { name: updateProductDto.name }
        });

        if (existingProduct && existingProduct.id !== id) {
          throw new ConflictException(`Product with name '${updateProductDto.name}' already exists`);
        }
      }

      if (updateProductDto.productTypeId) {
        const productType = await this.productTypesRepository.findOne({
          where: { id: updateProductDto.productTypeId }
        });
        if (!productType) {
          throw new NotFoundException(
            `ProductType with ID ${updateProductDto.productTypeId} not found`
          );
        }
        product.productType = productType;
      }

      Object.assign(product, updateProductDto);
      return await this.productsRepository.save(product);
    } catch (error) {
      this.logger.error(`Failed to update product ${id}: ${error.message}`);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.productsRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Product with ID ${id} not found`);
      }
    } catch (error) {
      this.logger.error(`Failed to delete product ${id}: ${error.message}`);
      throw error;
    }
  }

  async getProductTypes(): Promise<ProductType[]> {
    try {
      return await this.productTypesRepository.find({ 
        order: { name: 'ASC' } 
      });
    } catch (error) {
      this.logger.error(`Failed to fetch product types: ${error.message}`);
      throw new Error('Failed to fetch product types');
    }
  }
}