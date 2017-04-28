import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { mutCreator } from 'components/state-helpers';
import { objectToDataURL } from 'utility';
import { identity } from 'actions';

import SettingsPresentation from './presentation';

class Settings extends React.Component {
  static propTypes = {
    config: PropTypes.object.isRequired,
    updateAlias: PropTypes.func.isRequired,

    regenerateUid: PropTypes.func.isRequired,
    regenerateKeys: PropTypes.func.isRequired,
    importSettings: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = { config: props.config };
    this.mut = mutCreator(this);

    this.saveSafeSettings = this.saveSafeSettings.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ config: nextProps.config });
  }

  saveSafeSettings() {
    const { updateSafeSettings } = this.props;
    const { alias, url } = this.state.config;

    updateSafeSettings({ alias, url });
  }

  render() {
    const { regenerateUid, regenerateKeys, importSettings, config } = this.props;
    const { alias, url, uid, publicKey } = this.state.config;

    const mut = this.mut;
    const settingsDataUrl = objectToDataURL(config);

    return (
      <SettingsPresentation
        alias={alias}
        onAliasChange={mut('config.alias')}
        saveSafeSettings={this.saveSafeSettings}
        url={url}
        onUrlChange={mut('config.url')}
        uid={uid}
        regenerateUid={regenerateUid}
        publicKey={publicKey}
        regenerateKeys={regenerateKeys}
        settingsDataUrl={settingsDataUrl}
        importSettings={importSettings}/>
    );
  }
}

const mapStateToProps = state => ({
  config: state.identity.config,
  importFailure: state.identity.config.importSettingsFailure,
  importSuccess: state.identity.config.importSettingsSuccess
});

const mapDispatchToProps = dispatch => ({
  regenerateUid: bindActionCreators(identity.config.regenerateUid, dispatch),
  regenerateKeys: bindActionCreators(identity.config.regenerateKeys, dispatch),
  updateSafeSettings: bindActionCreators(identity.config.updateSafeSettings, dispatch),
  importSettings: bindActionCreators(identity.config.importSettings, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);