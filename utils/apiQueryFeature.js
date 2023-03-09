class APIQueryFeature {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //Build query
    //1. Build a shallow copy to manipulate
    const copyQuery = { ...this.queryString };
    //2. Delete excluded field from the shallow copy
    //a.list the fields
    const excludedField = ['sort', 'page', 'limit', 'fields'];
    //b. foreach key found on the copy data delete
    excludedField.forEach((el) => delete copyQuery[el]);

    //3. Implementing equality feature
    // req.query input {duration: {gte : 5}}
    // expected output {duration: {$gte : 5}}
    // data we are adding $ sign gte,gt,lte,lt for mongodb

    //a.Convert to a string
    let copyStringQuery = JSON.stringify(copyQuery);

    //reaasign the string with the replaced matched string
    copyStringQuery = copyStringQuery.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    //FILTERING
    this.query.find(JSON.parse(copyStringQuery));

    return this;
  }

  sort() {
    //SORTING
    //note if -sort by largest to smallest order
    //Check if sorting is implemented
    if (this.queryString.sort) {
      //convert to mongodb std of ',' to ' '
      const sortby = this.queryString.sort.split(',').join(' ');
      //reaasign by sorting
      this.query = this.query.sort(sortby);
    } else {
      //default soting
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  fields() {
    //FIELDS
    //note if -fields by largest to smallest order
    //Check if fields is implemented
    if (this.queryString.fields) {
      //convert to mongodb std of ',' to ' '
      const sortby = this.queryString.fields.split(',').join(' ');
      //reaasign by sorting
      this.query = this.query.select(sortby);
    } else {
      //default soting
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    // PAGINATION from ?page=3&limit=10
    //Default values and values
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;

    // Formula created page if ?page=3&limit=10 page arangement will be page 1, 1 - 10 results page 2, 11 - 20
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIQueryFeature;
