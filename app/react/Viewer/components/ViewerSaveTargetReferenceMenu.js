import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {saveReference} from 'app/Viewer/actions/referencesActions';
import {loadTargetDocument} from 'app/Viewer/actions/documentActions';
import {MenuButtons} from 'app/ContextMenu';

export class ViewerSaveTargetReferenceMenu extends Component {
  handleClick() {
    if (this.props.reference.targetRange) {
      let reference = this.props.reference;
      reference.sourceDocument = this.props.sourceDocument;
      return this.props.saveReference(reference);
    }
    if (this.props.reference.targetDocument && !this.props.targetDocument) {
      this.props.loadTargetDocument(this.props.reference.targetDocument);
    }
  }
  render() {
    let disabled = true;
    let className = 'fa-arrow-right';
    if (this.props.reference.targetDocument && !this.props.targetDocument && this.props.reference.relationType) {
      disabled = false;
    }
    if (this.props.targetDocument) {
      className = 'fa-save';
    }

    if (this.props.targetDocument && this.props.reference.targetRange) {
      disabled = false;
    }
    return (
      <div>
        <MenuButtons.Main disabled={disabled} onClick={() => this.handleClick()}>
          <i className={'fa ' + className}></i>
        </MenuButtons.Main>
      </div>
    );
  }
}

ViewerSaveTargetReferenceMenu.propTypes = {
  loadTargetDocument: PropTypes.func,
  saveReference: PropTypes.func,
  sourceDocument: PropTypes.string,
  targetDocument: PropTypes.string,
  reference: PropTypes.object
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({saveReference, loadTargetDocument}, dispatch);
}

function mapStateToProps(state) {
  return {
    reference: state.documentViewer.uiState.toJS().reference,
    sourceDocument: state.documentViewer.doc.get('_id'),
    targetDocument: state.documentViewer.targetDoc.get('_id')
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewerSaveTargetReferenceMenu);
