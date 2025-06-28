import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../lib/database';
import bcryptjs from 'bcryptjs';

// Interfaz para los atributos del usuario
export interface UserAttributes {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interfaz para la creación de usuario (opcional el id)
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'role' | 'isActive'> {}

// Clase del modelo Usuario
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public firstName!: string;
  public lastName!: string;
  public role!: 'user' | 'admin';
  public isActive!: boolean;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Método para validar la contraseña
  public async validatePassword(password: string): Promise<boolean> {
    return await bcryptjs.compare(password, this.password);
  }

  // Método para obtener el nombre completo
  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  // Método para obtener datos públicos del usuario
  public toJSON(): Partial<UserAttributes> {
    const { password, ...userWithoutPassword } = this.get();
    return userWithoutPassword;
  }
}

// Definir el modelo
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [6, 255],
      },
    },
    firstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [2, 50],
      },
    },
    lastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [2, 50],
      },
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user',
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    hooks: {
      // Hash de la contraseña antes de crear el usuario
      beforeCreate: async (user: User) => {
        if (user.password) {
          const salt = await bcryptjs.genSalt(10);
          user.password = await bcryptjs.hash(user.password, salt);
        }
      },
      // Hash de la contraseña antes de actualizar (si cambió)
      beforeUpdate: async (user: User) => {
        if (user.changed('password')) {
          const salt = await bcryptjs.genSalt(10);
          user.password = await bcryptjs.hash(user.password, salt);
        }
      },
    },
  }
);

export default User;
