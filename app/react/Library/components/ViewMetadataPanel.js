import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import SidePanel from 'app/Layout/SidePanel';
import documents from 'app/Documents';
import {bindActionCreators} from 'redux';
import {unselectDocument} from '../actions/libraryActions';

import {ShowDocument} from 'app/Documents';

export class ViewMetadataPanel extends Component {
  submit(doc) {
    this.props.saveDocument(doc);
  }

  render() {
    const {doc} = this.props;

    return (
      <SidePanel open={this.props.open}>
        <h1>Metadata</h1>
        <i className="fa fa-close close-modal" onClick={this.props.unselectDocument}/>
        {(() => {
          return <ShowDocument doc={doc}/>;
        })()}
      </SidePanel>
    );
  }
}

ViewMetadataPanel.propTypes = {
  doc: PropTypes.object,
  open: PropTypes.bool,
  saveDocument: PropTypes.func,
  unselectDocument: PropTypes.func
};

const mapStateToProps = ({library}) => {
  return {
    open: library.ui.get('selectedDocument') ? true : false,
    doc: documents.helpers.prepareMetadata(library.ui.get('selectedDocument') ? library.ui.get('selectedDocument').toJS() : {},
                                           library.filters.get('templates').toJS(),
                                           library.filters.get('thesauris').toJS())
  };
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({unselectDocument}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewMetadataPanel);
