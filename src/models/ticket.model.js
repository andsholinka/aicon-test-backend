module.exports = (mongoose) => {
    var schema = mongoose.Schema({
        username: {
            type: String,
            required: true,
        },
        code: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            default: "Pending",
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

    const Ticket = mongoose.model("ticket", schema);
    return Ticket;
};