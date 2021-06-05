module.exports = (mongoose) => {
    var schema = mongoose.Schema({
        data: String
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

    const Occupation = mongoose.model("occupation", schema);
    return Occupation;
};