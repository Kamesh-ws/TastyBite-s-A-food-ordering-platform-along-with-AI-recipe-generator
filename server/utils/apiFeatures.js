export class APIFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    // Method to handle search functionality
    search() {
        let keyword = this.queryStr.keyword
            ? {
                  $or: [
                      { name: { $regex: this.queryStr.keyword, $options: 'i' } },
                      { description: { $regex: this.queryStr.keyword, $options: 'i' } },
                  ],
              }
            : {};

        this.query.find({ ...keyword });
        return this;
    }

    // // Method to handle filter functionality
    // filter() {
    //     const queryStrCopy = { ...this.queryStr };

    //     // Removing specific fields that shouldn’t be part of the filter
    //     const removeFields = ['keyword', 'limit', 'page'];
    //     removeFields.forEach((field) => delete queryStrCopy[field]);

    //     // Adding support for filter operations like gte, lte
    //     let queryStr = JSON.stringify(queryStrCopy);
    //     queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);

    //     this.query.find(JSON.parse(queryStr));
    //     return this;
    // }

     // Filter functionality

     filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((el) => delete queryObj[el]);
    
        // Advanced filtering for price range
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
          /\b(gte|gt|lte|lt)\b/g,
          (match) => `$${match}`
        );
    
        this.query = this.query.find(JSON.parse(queryStr));
        return this;
      }
    
      sort() {
        if (this.queryString.sort) {
          const sortBy = this.queryString.sort.split(',').join(' ');
          this.query = this.query.sort(sortBy);
        } else {
          // Default sort by delivery time
          this.query = this.query.sort('deliveryTime');
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

    // Pagination method
     paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  
    }
}


