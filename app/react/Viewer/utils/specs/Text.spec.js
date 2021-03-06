import TextRange from 'batarange';

import Text from 'app/Viewer/utils/Text';
import mockRangeSelection from 'app/utils/mockRangeSelection';
import wrapper from 'app/utils/wrapper';

describe('Text', () => {
  let text;

  beforeEach(() => {
    text = Text(document);
  });

  describe('selected()', () => {
    it('should return true if text selected', () => {
      mockRangeSelection('text_selected');
      expect(text.selected()).toBe(true);
    });
    it('should return false if no text selected', () => {
      mockRangeSelection('');
      expect(text.selected()).toBe(false);
    });
  });

  describe('getSelection', () => {
    it('should return a serialized selection', () => {
      spyOn(TextRange, 'serialize').and.returnValue({start: 1, end: 10});
      let range = mockRangeSelection('text');

      let serializedRange = text.getSelection();
      expect(serializedRange).toEqual({start: 1, end: 10, text: 'text'});
      expect(TextRange.serialize).toHaveBeenCalledWith(range, document);
    });
  });

  describe('simulateSelection', () => {
    describe('when there is no selection', () => {
      it('should wrap the range with a span.fake-selection', () => {
        spyOn(wrapper, 'wrap').and.returnValue('fakeSelection');
        spyOn(TextRange, 'restore').and.returnValue('restoredRange');
        spyOn(text, 'selected').and.returnValue(false);
        spyOn(text, 'removeSimulatedSelection');

        text.simulateSelection('range');

        let elementWrapper = document.createElement('span');
        elementWrapper.classList.add('fake-selection');

        expect(TextRange.restore).toHaveBeenCalledWith('range', document);
        expect(wrapper.wrap).toHaveBeenCalledWith(elementWrapper, 'restoredRange');
        expect(text.fakeSelection).toBe('fakeSelection');
        expect(text.removeSimulatedSelection).toHaveBeenCalled();
      });
    });

    describe('when selection passed is null', () => {
      it('should only remove current fakeSelection', () => {
        spyOn(text, 'removeSimulatedSelection');
        spyOn(wrapper, 'wrap');
        text.simulateSelection(null);

        expect(text.removeSimulatedSelection).toHaveBeenCalled();
        expect(wrapper.wrap).not.toHaveBeenCalled();
      });
    });

    describe('when there is text selected', () => {
      it('should only remove current fakeSelection', () => {
        spyOn(text, 'removeSimulatedSelection');
        spyOn(wrapper, 'wrap');
        spyOn(text, 'selected').and.returnValue(true);

        text.simulateSelection({});

        expect(text.removeSimulatedSelection).toHaveBeenCalled();
        expect(wrapper.wrap).not.toHaveBeenCalled();
      });
    });
  });

  describe('removeSimulatedSelection', () => {
    it('should unwrap fake selection, fakeSelection to null and remove real selection', () => {
      let unwrap = jasmine.createSpy('unwrap');
      spyOn(text, 'removeSelection');
      text.fakeSelection = {unwrap};
      text.removeSimulatedSelection();

      expect(text.removeSelection).toHaveBeenCalled();
      expect(unwrap).toHaveBeenCalled();
      expect(text.fakeSelection).toBe(null);
    });

    describe('when no fakeSelection', () => {
      it('should not throw an error', () => {
        expect(text.removeSimulatedSelection.bind(text)).not.toThrow();
      });
    });
  });

  describe('renderReferences', () => {
    let unwrap;

    let elementWrapper = (id) => {
      let element = document.createElement('a');
      element.classList.add('reference');
      element.setAttribute('data-id', id);
      return element;
    };

    beforeEach(() => {
      unwrap = jasmine.createSpy('unwrap');
      spyOn(wrapper, 'wrap').and.returnValue({unwrap});
      spyOn(TextRange, 'restore').and.returnValue('restoredRange');
    });

    it('should wrap a collection of references', () => {
      let references = [{_id: '1', sourceRange: 'sourceRange1'}, {_id: '2', sourceRange: 'sourceRange2'}];

      text.renderReferences(references);
      expect(TextRange.restore).toHaveBeenCalledWith('sourceRange1', document);
      expect(TextRange.restore).toHaveBeenCalledWith('sourceRange2', document);
      expect(wrapper.wrap).toHaveBeenCalledWith(elementWrapper('1'), 'restoredRange');
      expect(wrapper.wrap).toHaveBeenCalledWith(elementWrapper('2'), 'restoredRange');
    });

    it('should not render references already rendered', () => {
      let firstReferneces = [{_id: '1', sourceRange: 'sourceRange1'}, {_id: '2', sourceRange: 'sourceRange2'}];
      let secondReferences = [
        {_id: '1', sourceRange: 'sourceRange1'}, {_id: '2', sourceRange: 'sourceRange2'}, {_id: '3', sourceRange: 'sourceRange3'}
      ];
      text.renderReferences(firstReferneces);
      TextRange.restore.calls.reset();
      wrapper.wrap.calls.reset();
      text.renderReferences(secondReferences);

      expect(TextRange.restore.calls.count()).toBe(1);
      expect(wrapper.wrap.calls.count()).toBe(1);
      expect(TextRange.restore).toHaveBeenCalledWith('sourceRange3', document);
      expect(wrapper.wrap).toHaveBeenCalledWith(elementWrapper('3'), 'restoredRange');
    });

    it('should unwrap references that are passed', () => {
      let firstReferneces = [{_id: '1', sourceRange: 'sourceRange1'}, {_id: '2', sourceRange: 'sourceRange2'}];
      let secondReferences = [{_id: '2', sourceRange: 'sourceRange2'}, {_id: '3', sourceRange: 'sourceRange3'}];
      text.renderReferences(firstReferneces);
      text.renderReferences(secondReferences);

      expect(unwrap.calls.count()).toBe(1);
      expect(text.renderedReferences[1]).not.toBeDefined();
    });
  });

  describe('highlight', () => {
    let createElement = () => {
      return document.createElement('a');
    };

    beforeEach(() => {
      text.renderedReferences = {
        reference1: {
          nodes: [createElement(), createElement()]
        },
        reference2: {
          nodes: [createElement(), createElement(), createElement()]
        }
      };
    });

    it('should add class highlighted to all nodes of a reference', () => {
      text.highlight('reference2');

      expect(text.renderedReferences.reference2.nodes[0].className).toBe('highlighted');
      expect(text.renderedReferences.reference2.nodes[1].className).toBe('highlighted');
    });

    it('should handle unexistant references', () => {
      expect(text.highlight.bind(text, 'reference_unexistant')).not.toThrow();
    });

    it('should toggle highlighting when new reference is passed', () => {
      text.highlight('reference2');
      text.highlight('reference1');

      expect(text.renderedReferences.reference2.nodes[0].className).toBe('');
      expect(text.renderedReferences.reference2.nodes[1].className).toBe('');
      expect(text.renderedReferences.reference1.nodes[0].className).toBe('highlighted');
      expect(text.renderedReferences.reference1.nodes[1].className).toBe('highlighted');
    });

    describe('when passing null', () => {
      it('should not throw an error', () => {
        expect(text.highlight.bind(text, null)).not.toThrow();
      });
    });
  });

  describe('activate', () => {
    let createElement = () => {
      return document.createElement('a');
    };

    beforeEach(() => {
      text.renderedReferences = {
        reference1: {
          nodes: [createElement(), createElement()]
        },
        reference2: {
          nodes: [createElement(), createElement(), createElement()]
        }
      };
    });

    it('should add class is-active to all nodes of a reference', () => {
      text.activate('reference2');

      expect(text.renderedReferences.reference2.nodes[0].className).toBe('is-active');
      expect(text.renderedReferences.reference2.nodes[1].className).toBe('is-active');
    });

    it('should handle unexistant references', () => {
      expect(text.activate.bind(text, 'reference_unexistant')).not.toThrow();
    });

    it('should toggle activate when new reference is passed', () => {
      text.activate('reference2');
      text.activate('reference1');

      expect(text.renderedReferences.reference2.nodes[0].className).toBe('');
      expect(text.renderedReferences.reference2.nodes[1].className).toBe('');
      expect(text.renderedReferences.reference1.nodes[0].className).toBe('is-active');
      expect(text.renderedReferences.reference1.nodes[1].className).toBe('is-active');
    });

    describe('when passing null', () => {
      it('should not throw an error', () => {
        expect(text.activate.bind(text, null)).not.toThrow();
      });
    });
  });
});
