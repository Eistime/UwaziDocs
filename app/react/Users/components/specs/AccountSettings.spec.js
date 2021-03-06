import React from 'react';
import {shallow} from 'enzyme';

import {AccountSettings} from '../AccountSettings';
import UsersAPI from '../../UsersAPI';

describe('AccountSettings', () => {
  let component;
  let props;

  beforeEach(() => {
    props = {
      user: {name: 'doe'},
      notify: jasmine.createSpy('notify')
    };
    component = shallow(<AccountSettings {...props} />);
  });

  describe('change email', () => {
    beforeEach(() => {
      spyOn(UsersAPI, 'save').and.returnValue(Promise.resolve());
    });

    it('should save the user with the new email', () => {
      component.setState({email: 'newemail@uwazi.com'});
      component.childAt(0).find('form').simulate('submit', {preventDefault: () => {}});
      expect(UsersAPI.save).toHaveBeenCalledWith({name: 'doe', email: 'newemail@uwazi.com'});
    });
  });

  describe('change password', () => {
    beforeEach(() => {
      spyOn(UsersAPI, 'save').and.returnValue(Promise.resolve());
    });

    it('should save the user with the new password', () => {
      component.setState({password: 'ultraSecret', repeatPassword: 'ultraSecret'});
      component.childAt(1).find('form').simulate('submit', {preventDefault: () => {}});
      expect(UsersAPI.save).toHaveBeenCalledWith({name: 'doe', password: 'ultraSecret'});
    });

    it('should empty the passwords values', () => {
      component.setState({password: 'ultraSecret', repeatPassword: 'ultraSecret'});
      component.childAt(1).find('form').simulate('submit', {preventDefault: () => {}});
      expect(component.instance().state.password).toBe('');
      expect(component.instance().state.repeatPassword).toBe('');
    });

    describe('when passwords do not match', () => {
      it('should not update it', () => {
        component.setState({password: 'ultraSecret', repeatPassword: 'IDontKnowWhatIAmDoing'});
        component.childAt(1).find('form').simulate('submit', {preventDefault: () => {}});
        expect(UsersAPI.save).not.toHaveBeenCalled();
      });

      it('should display an error', () => {
        component.setState({password: 'ultraSecret', repeatPassword: 'IDontKnowWhatIAmDoing'});
        component.childAt(1).find('form').simulate('submit', {preventDefault: () => {}});
        expect(component.childAt(1).find('form').childAt(0).hasClass('has-error')).toBe(true);
        expect(component.childAt(1).find('form').childAt(1).hasClass('has-error')).toBe(true);
      });
    });
  });
});
