const mongoose = require('mongoose');

const treeSchema = new mongoose.Schema(
  {
    fams: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    ppl: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    nid: {
      type: Number,
      default: 1
    },
    cc: {
      type: Number,
      default: 0
    },
    rootId: {
      type: String,
      default: null
    }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    tree: {
      type: treeSchema,
      default: () => ({
        fams: {},
        ppl: {},
        nid: 1,
        cc: 0,
        rootId: null
      })
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('User', userSchema);
