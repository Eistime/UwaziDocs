import * as actions from 'app/Viewer/actions/uiActions';
import * as types from 'app/Viewer/actions/actionTypes';

describe('openReferencePanel', () => {
  describe('openReferencePanel()', () => {
    it('should return a OPEN_REFERENCE_PANEL', () => {
      let action = actions.openReferencePanel();
      expect(action).toEqual({type: types.OPEN_REFERENCE_PANEL});
    });
  });
});