import mongoose from 'mongoose';

const CoinSchema = new mongoose.Schema({
    blockchain: String,
    contractAddress: String,
    name: String,
    symbol: String,
    description: String,
    isPresale: String,
    launchDate: String,
    presaleUrl: String,
    imageUrl: String,
    slug: String,
    isPromote: {
        type: Boolean,
        default: false,
    },
    isBoost: {
        type: Boolean,
        default: false,
    },
    websiteLink: {
        type: String,
        default: '',
    },
    twitterLink: {
        type: String,
        default: '',
    },
    telegramLink:{
        type: String,
        default: '',
    },
    discordLink:{
        type: String,
        default: '',
    },
    promoteTime:{
        type: Date,
        default: null,
    },
    rocket: {
        type: Number,
        default: 0,
    },
    fire: {
        type: Number,
        default: 0,
    },
    flag: {
        type: Number,
        default: 0,
    },
    voters: [
        {
            ip: String,
            voteType: String,
        }
    ]
}, {
    timestamps: true, 
});

export default mongoose.models.Coin || mongoose.model('Coin', CoinSchema);
