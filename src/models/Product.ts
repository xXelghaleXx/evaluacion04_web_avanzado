import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../lib/database';
import User from './User';

// Interfaz para los atributos del producto
export interface ProductAttributes {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
  isActive: boolean;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interfaz para la creación de producto (opcional el id)
interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'imageUrl' | 'isActive'> {}

// Clase del modelo Producto
class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public price!: number;
  public stock!: number;
  public category!: string;
  public imageUrl?: string;
  public isActive!: boolean;
  public userId!: number;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Método para verificar disponibilidad
  public get isAvailable(): boolean {
    return this.isActive && this.stock > 0;
  }

  // Método para formatear precio
  public get formattedPrice(): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(this.price);
  }
}

// Definir el modelo
Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [3, 100],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [10, 500],
      },
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [3, 50],
      },
    },
    imageUrl: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'products',
  }
);

// Definir asociaciones
User.hasMany(Product, {
  foreignKey: 'userId',
  as: 'products',
});

Product.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

export default Product;
