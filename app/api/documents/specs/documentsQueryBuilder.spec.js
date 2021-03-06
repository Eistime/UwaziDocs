import queryBuilder from 'api/documents/documentQueryBuilder';

describe('documentQueryBuilder', () => {
  beforeEach(() => {});

  describe('default query', () => {
    it('should do a match all on published documents', () => {
      expect(queryBuilder().query().query).toEqual({match_all: {}});
      expect(queryBuilder().query().filter.bool.must[0]).toEqual({"match":{"doc.published": true}});
    });
  });

  describe('from', () => {
    it('should set from', () => {
      expect(queryBuilder().from(5).query().from).toEqual(5);
    });
  });

  describe('limit', () => {
    it('should set size', () => {
      expect(queryBuilder().limit(55).query().size).toEqual(55);
    });
  });

  describe('filterMetadata', () => {
    it('should add filter conditions', () => {
      let query = queryBuilder().filterMetadata({property1: 'value1', property2: 'value2'}).query();
      expect(query.filter.bool.must[0]).toEqual({match: {'doc.published': true}});
      expect(query.filter.bool.must[1]).toEqual({match: {'doc.metadata.property1': 'value1'}});
      expect(query.filter.bool.must[2]).toEqual({match: {'doc.metadata.property2': 'value2'}});
    });

    describe('when there is no filters', () => {
      it('should add filter conditions', () => {
        let query = queryBuilder().filterMetadata().query();
        expect(query.filter.bool.must[0]).toEqual({match: {'doc.published': true}});
        expect(query.filter.bool.must.length).toBe(1);
      });
    });
  });

  describe('filterByTemplate', () => {
    it('should add a match to get only documents that match with the templates', () => {
      let query = queryBuilder().filterByTemplate(['template1', 'template2']).query();
      let expectedMatcher = {
        bool: {
          should: [
             {match: {'doc.template': 'template1'}},
             {match: {'doc.template': 'template2'}}
          ],
          minimum_should_match: 1
        }
      };
      expect(query.filter.bool.must[1]).toEqual(expectedMatcher);
    });
  });

  describe('fullTextSearch', () => {
    it('should do a multi_match on default fields', () => {
      let query = queryBuilder().fullTextSearch('term').query();
      expect(query.query).toEqual({
        multi_match: {
          query: 'term',
          type: 'phrase_prefix',
          fields: ['doc.fullText', 'doc.metadata.*', 'doc.title']
        }
      });
    });

    describe('when term is blank', () => {
      it('should return the default match_all', () => {
        let query = queryBuilder().fullTextSearch('').query();
        expect(query.query).toEqual({match_all: {}});
      });
    });

    describe('sort', () => {
      it('should add a sort property desc by default', () => {
        let query = queryBuilder().sort('title').query();
        expect(query.sort[0]).toEqual({'doc.title': {order: 'desc', ignore_unmapped: true}});
      });
      it('should sort by order passed', () => {
        let query = queryBuilder().sort('title', 'asc').query();
        expect(query.sort[0]).toEqual({'doc.title': {order: 'asc', ignore_unmapped: true}});
      });
    });

    describe('when passing fields', () => {
      it('should use them instead of the default ones', () => {
        let query = queryBuilder().fullTextSearch('term', ['another.field']).query();
        expect(query.query).toEqual({
          multi_match: {
            query: 'term',
            type: 'phrase_prefix',
            fields: ['another.field']
          }
        });
      });
    });
  });

  describe('highlights', () => {
    it('should return a query with hilight configuration for the fields passed', () => {
      let query = queryBuilder().highlight(['field1', 'field2']).query();
      expect(query.highlight.fields).toEqual({
        field1: {},
        field2: {}
      });
    });
  });
});
