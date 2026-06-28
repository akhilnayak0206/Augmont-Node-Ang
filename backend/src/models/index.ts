import User from './User';
import Category from './Category';
import Product from './Product';
import BulkJob from './BulkJob';

// Set up associations
Category.hasMany(Product, {
  foreignKey: 'categoryId',
  as: 'products',
});

Product.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
});

export { User, Category, Product, BulkJob };