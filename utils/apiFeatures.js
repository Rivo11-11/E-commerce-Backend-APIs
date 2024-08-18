class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    let filterObj = { ...this.queryString };
    const exclude = ['page', 'limit', 'sort', 'fields', 'keyword'];
    exclude.forEach(i => delete filterObj[i]);

    let queryStr = JSON.stringify(filterObj);
    queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, match => `$${match}`);
    filterObj = JSON.parse(queryStr);

    this.query = this.query.find(filterObj);
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }

  page() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    return [page, limit];
  }

  async lengthOfData() {
    // clone the query alow you to execute it multiple time without monogoose error "Query already executed"
    const results = await this.query.clone(); // Clone the query before executing it
    return results.length;
  }

  sort() {
    if (this.queryString.sort) {
      const sortFields = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortFields);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  search(fields) {
    if (this.queryString.keyword) {
      const keyword = this.queryString.keyword;
      const find = {
        $or: fields.map(field => ({ [field]: { $regex: keyword, $options: 'i' } }))
      };
      this.query = this.query.find(find);
    }
    return this;
  }
  

  async execute(reference, select) {
    let results;
    if (reference && select) {
      results = await this.query.populate({
        path: reference,
        select: select
      });
    } else {
      results = await this.query;
    }
    return results;
  }
}

module.exports = APIFeatures;
