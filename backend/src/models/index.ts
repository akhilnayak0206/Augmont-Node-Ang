import User from './User';
import Category from './Category';
import Product from './Product';
import BulkUploadJob from './BulkUploadJob';
import ReportJob from './ReportJob';

// Set up associations
Category.hasMany(Product, {
  foreignKey: 'categoryId',
  as: 'products',
});

Product.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
});

BulkUploadJob.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'creator',
});

ReportJob.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'creator',
});

export {
  User,
  Category,
  Product,
  BulkUploadJob,
  ReportJob,
};