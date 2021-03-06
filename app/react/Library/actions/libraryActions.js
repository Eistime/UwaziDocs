import * as types from 'app/Library/actions/actionTypes';
import api from 'app/Library/DocumentsAPI';
import libraryHelper from 'app/Library/helpers/libraryFilters';

export function enterLibrary() {
  return {type: types.ENTER_LIBRARY};
}

export function selectDocument(doc) {
  return {
    type: types.SELECT_DOCUMENT,
    doc
  };
}
export function unselectDocument() {
  return {type: types.UNSELECT_DOCUMENT};
}

export function showFilters() {
  return {type: types.SHOW_FILTERS};
}

export function hideFilters() {
  return {type: types.HIDE_FILTERS};
}

export function setDocuments(documents) {
  return {type: types.SET_DOCUMENTS, documents};
}

export function setTemplates(templates, thesauris) {
  return function (dispatch, getState) {
    let filtersState = getState().library.filters.toJS();
    let documentTypes = Object.assign(libraryHelper.generateDocumentTypes(templates), filtersState.documentTypes);
    let libraryFilters = filtersState.properties;
    dispatch({type: types.SET_LIBRARY_TEMPLATES, templates, thesauris, documentTypes, libraryFilters});
  };
}

export function setPreviewDoc(docId) {
  return {type: types.SET_PREVIEW_DOC, docId};
}

export function setSuggestions(suggestions) {
  return {type: types.SET_SUGGESTIONS, suggestions};
}

export function hideSuggestions() {
  return {type: types.HIDE_SUGGESTIONS};
}

export function showSuggestions() {
  return {type: types.SHOW_SUGGESTIONS};
}

export function setOverSuggestions(boolean) {
  return {type: types.OVER_SUGGESTIONS, hover: boolean};
}

export function searchDocuments(readOnlySearch, limit) {
  return (dispatch, getState) => {
    let state = getState().library.filters.toJS();
    let properties = state.properties;
    let documentTypes = state.documentTypes;

    let search = Object.assign({}, readOnlySearch);
    search.filters = Object.assign({}, readOnlySearch.filters);

    properties.forEach((property) => {
      if (!property.active) {
        delete search.filters[property.name];
      }
    });

    search.types = Object.keys(documentTypes).reduce((selectedTypes, type) => {
      if (documentTypes[type]) {
        selectedTypes.push(type);
      }

      return selectedTypes;
    }, []);

    search.limit = limit;

    return api.search(search)
    .then((documents) => {
      dispatch(setDocuments(documents));
      dispatch(hideSuggestions());
    });
  };
}

export function loadMoreDocuments(amount) {
  return function (dispatch, getState) {
    searchDocuments(getState().search, amount)(dispatch, getState);
  };
}

export function getSuggestions(searchTerm) {
  return (dispatch) => {
    return api.getSuggestions(searchTerm)
    .then((suggestions) => {
      dispatch(setSuggestions(suggestions));
      dispatch(showSuggestions());
    });
  };
}
