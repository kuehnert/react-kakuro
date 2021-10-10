const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minLength: 5,
    maxLength: 24,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error('E-Mail is invalid');
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    length: 60,
    validate(value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password too simple!');
      }
    },
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  solved: [String],
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign(
    { _id: user._id.toString() },
    process.env.TOKEN_SECRET
  );

  user.tokens = [...user.tokens, { token }];
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Unable to login');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Unable to login');
  }

  return user;
};

// Hash the plain password before saving
userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = mongoose.model('user', userSchema);

// const checkAdmin = async () => {
//   const admin = await User.findOne({ email: 'mk@mister-k.net' });

//   if (!admin) {
//     const me = new User({
//       name: 'mk',
//       email: 'mk@mister-k.net',
//       password: process.env.DEFAULT_ADMIN_PASSWORD,
//     });
//     console.log('admin user not found, creating...');
//     me.save()
//       .then(() => {
//         console.log('admin user created');
//       })
//       .catch(error => {
//         console.error('Error creating admin, exiting: ', error);
//         process.exit(1);
//       });
//   } else {
//     console.log('admin user found.');
//   }
// };

// checkAdmin();

module.exports = User;
