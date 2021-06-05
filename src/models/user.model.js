module.exports = (mongoose) => {
    var schema = mongoose.Schema({
        token: String,
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            required: true,
        },
        DOB: {
            type: Date,
            required: true,
        },
        occupation: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        phone: {
            type: Number,
            required: true,
        },
        lastLogin: Date,
        ipAddress: String,
        isVerified: Boolean,
        status: {
            type: Number,
            required: true,
            default: 0,
        },
        level: {
            type: Number,
            required: true,
            default: 0,
        },
    }, {
        timestamps: true
    });

    schema.method("toJSON", function () {
        const {
            __v,
            _id,
            ...object
        } = this.toObject();
        object.id = _id;
        return object;
    });

    // schema.plugin(mongoosePaginate);

    const User = mongoose.model("user", schema);
    return User;
};