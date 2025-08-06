import mongoose from 'mongoose';

const UserListSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['viewer', 'admin', 'superadmin'],
    default: 'viewer'
  },
}, {
  timestamps: true
});

const UserList = mongoose.model('UserList', UserListSchema);

export default UserList;
