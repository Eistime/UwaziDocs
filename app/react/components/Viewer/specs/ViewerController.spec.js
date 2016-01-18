import React, { Component, PropTypes } from 'react'
import ViewerController from '../ViewerController';
import backend from 'fetch-mock'
import TestUtils from 'react-addons-test-utils'
import {APIURL} from '../../../config.js'
import Provider from '../../../core/Provider'

describe('ViewerController', () => {

  let documentResponse = [{key:'template1', id:'1', value:{}}];

  let component;

  beforeEach(() => {
    let initialData = {};
    let params = {};
    TestUtils.renderIntoDocument(<Provider initialData={initialData}><ViewerController params={params} ref={(ref) => component = ref} /></Provider>);
    backend.restore();
    backend
    .mock(APIURL+'documents?id=1', 'GET', {body: JSON.stringify({rows:documentResponse})});
  });

  describe('static requestState', () => {
    it('should request templates and find template based on the key passed', (done) => {
      let id = 1;
      ViewerController.requestState({documentId:id})
      .then((response) => {
        expect(response).toEqual(documentResponse[0]);
        done();
      })
      .catch(done.fail)
    });
  });

});