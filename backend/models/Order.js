const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product'},
    qty: Number,
    price: Number
  }],
  total: Number,
  status: {type:String, enum:['pending','success','failed'], default:'pending'},
  createdAt: {type:Date, default:Date.now}
});

module.exports = mongoose.model('Order', orderSchema);
