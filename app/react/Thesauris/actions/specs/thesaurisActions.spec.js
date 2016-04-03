import * as actions from '~/Thesauris/actions/thesaurisActions';
import * as types from '~/Thesauris/actions/actionTypes';

describe('thesaurisActions', () => {
  describe('editThesauri', () => {
    it('should return an EDIT_THESAURI action ', () => {
      let thesauri = {name: 'Secret list of things', values: []};
      let action = actions.editThesauri(thesauri);
      expect(action).toEqual({type: types.EDIT_THESAURI, thesauri});
    });
  });

  describe('setThesauris', () => {
    it('should return an SET_THESAURIS action ', () => {
      let thesauris = [{name: 'Secret list of things', values: []}];
      let action = actions.setThesauris(thesauris);
      expect(action).toEqual({type: types.SET_THESAURIS, thesauris});
    });
  });
});
