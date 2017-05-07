import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormGroup, Card, CardBlock, CardTitle, CardHeader, CardText, Input, Label, Row, Col, Button } from 'reactstrap';

import FileChooser from 'components/file-chooser';

export default class SettingsPresentation extends Component {
  static propTypes = {
    alias: PropTypes.string,
    uid: PropTypes.string,
    url: PropTypes.string,
    publicKey: PropTypes.string,
    settingsDataUrl: PropTypes.string,

    importSettings: PropTypes.func.isRequired,
    onAliasChange: PropTypes.func.isRequired,
    saveSafeSettings: PropTypes.func.isRequired,
    regenerateKeys: PropTypes.func.isRequired
  }

  render() {
    const {
      alias, onAliasChange, saveSafeSettings,
      url, onUrlChange,
      uid,
      publicKey, regenerateKeys,
      settingsDataUrl, importSettings
    } = this.props;

    return (
      <div>
        <Row className='justify-content-between align-items-start'>
          <Col sm={2}>
            <h2 className='mt-0'>Settings</h2>
          </Col>
          <Col sm={4} />
          <Col sm={6} className='text-right'>
            <div className='btn-group'>
              <a
                href={settingsDataUrl}
                download='settings.tanqueReact'
                target='_blank'
                className='btn btn-success'>Download Settings</a>
              <FileChooser
                onChange={importSettings}
                buttonClasses={'btn btn-default'}
                buttonText={'Import Settings'} />
            </div>
            <p className='padding-5 mt-3'>
              Importing previously saved settings is
              the only way you can use the same account on multiple devices.
            </p>
          </Col>
        </Row>

        <Row className='justify-content-center'>
          <Col sm={12} umd={8}>
            <Card>
              <CardHeader tag='h4'>Safe Settings </CardHeader>
              <CardBlock>
                <Row>
                  <Col sm={12}>
                    <FormGroup>
                      <Label className='control-label'>Alias</Label>
                      <Input
                        className='form-control'
                        type='text'
                        onChange={onAliasChange}
                        value={alias} />
                    </FormGroup>

                    <FormGroup>
                      <Label className='control-label'>Preferred Relay</Label>
                      <Input
                        className='form-control'
                        type='text'
                        onChange={onUrlChange}
                        value={url} />
                    </FormGroup>

                    <Button
                      onClick={saveSafeSettings}
                      className='float-right'>Save</Button>
                  </Col>
                </Row>
              </CardBlock>
            </Card>

            <br /><br /><br />
            <Card>
              <CardHeader tag='h4'>Destructive Settings</CardHeader>
              <CardBlock>
                <h4>UID</h4>
                <FormGroup>
                  <Label></Label>
                  <Input type='text' disabled value={uid} />
                </FormGroup>

                <br />
                <h4>KEYS</h4>
                <FormGroup>
                  <Label>Public Key</Label>
                  <Input type='text' disabled value={publicKey} />
                  <br />
                  <Label>Private Key</Label>
                  <Input type='text' disabled value='Hidden' />
                </FormGroup>
                <div className='alert'>* Uses NaCl algorithms.</div>
                <div className='alert bg-danger'>
                  Note that re-generating your keys will require you to be
                  re-authorized to the network.
                  You will not be able to decrypt any messages sent to you until
                  re-authorization.
                </div>
                <Button
                  color='danger'
                  onClick={regenerateKeys}
                  className='float-right'>I understand, regenerate anyway</Button>
              </CardBlock>
            </Card>
            <br/>
            <br/>
            <br/>
          </Col>
        </Row>
      </div>
    );
  }
}
