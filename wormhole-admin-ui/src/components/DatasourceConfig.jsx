import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Card, CardHeader, CardText } from 'material-ui/Card'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
import Snackbar from 'material-ui/Snackbar'
import Dialog from 'material-ui/Dialog'
import { Grid, Row, Col } from 'react-bootstrap'
import Header from './Header'
import TextFieldGroup from './TextFieldGroup'
import PortalCard from './PortalCard'
import { muiTheme } from '../muiTheme'
import { addDatasource, updateDatasource, fetchDatasource } from '../actions/datasourceActions'
import { fetchData, putData } from '../utils/httpUtils'
import { formatDate } from '../utils/date'

import '../containers/view.css'
import './DatasourceConfig.css'

const propTypes = {
  datasource: PropTypes.object,
  addDatasource: PropTypes.func,
  updateDatasource: PropTypes.func,
  fetchDatasource: PropTypes.func,
}

class DatasourceConfig extends Component {
  constructor (props) {
    super(props)
    const url = window.location.href
    const id = url.split('/').pop() !== 'add' ? url.split('/').pop() : 0

    this.state = {
      edit: url.indexOf('view') < 0,
      type: 'mysql_binlog',
      sourceID: id,
      partition_nums: 32,
      tipMsg: 'Create Successfully',
      openDialog: false,
      openSnackbar: false,
    }

    this.save = this.save.bind(this)
    this.handleOpenDialog = this.handleOpenDialog.bind(this)
    this.handleCloseDialog = this.handleCloseDialog.bind(this)
    this.handleRequestClose = this.handleRequestClose.bind(this)
    this.handleChangePartitionNums = this.handleChangePartitionNums.bind(this)
  }

  getChildContext () {
    return { muiTheme }
  }

  //FIXME: ajax aynsc ??
  componentDidMount () {
    console.log('DatasourceConfig componentDidMount')
    if (this.state.sourceID !== 0) {
      fetchData(`/datasources/${this.state.sourceID}`).then(function (json) {
        console.log(json)
        this.setState({
          datasource: json,
        })
        this.props.fetchDatasource(json || {})
        console.log('datasource view props', this.props)
      }.bind(this), function (error) {
        console.error('error', error)
      })
    }
  }

  // FIXME: why this.props not update
  componentWillReceiveProps () {
    console.log('DatasourceConfig componentWillReceiveProps')
    console.log('state:', this.state)
    console.log('props:', this.props)
  }

  handleRequestClose () {
    this.setState({
      openSnackbar: false,
    })
  }

  handleOpenDialog () {
    this.setState({
      openDialog: true,
    })
  }
  handleCloseDialog () {
    this.setState({
      openDialog: false,
    })
  }

  handleChangePartitionNums (event, index, value) {
    console.log('partition num', value)
    const { datasource } = this.props

    datasource.partition_nums = +value
    this.props.updateDatasource(datasource)

    return this.setState({
      partition_nums: value,
    })
  }

  back () {
    window.history.back()
  }

  save () {
    console.log('save datasource', this.props.datasource)
    const { datasource } = this.props
    datasource.create_time = formatDate(new Date())
    console.log('create_time', datasource.create_time)
    this.props.addDatasource(datasource)
    putData(`/datasource`, datasource).then(function () {
      this.setState({
        openSnackbar: true,
        openDialog: false,
      })
    }.bind(this), function (error) {
      console.error('error', error)
      this.setState({
        openSnackbar: true,
        openDialog: false,
        tipMsg: 'Create Failed'
      })
    }.bind(this))
  }

  render () {
    const styles = {
      headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400,
      },
      btn: {
        fontSize: 18,
        margin: '12px 12px 0 0',
      },
      customWidth: {
        width: 150,
      }
    }
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleCloseDialog}
      />,
      <FlatButton
        label="Save"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.save}
      />,
    ]

    console.log('DatasourceConfig render')

    return (
      <div className="view config-view">
        <Header selectedKey={1} />
        <div className="container">
          <h1 className="title">Create a new Datasource</h1>
          <div className="row-actions">
            {
              this.state.edit
                ? <RaisedButton
                  label="Save"
                  labelPosition="before"
                  labelColor="#fff"
                  primary={true}
                  style={styles.btn}
                  onClick={this.handleOpenDialog}
                  icon={<i className="fa fa-save"></i>}
                />
                : ''
            }
            <RaisedButton
              label="Back"
              labelPosition="before"
              labelColor="#fff"
              primary={true}
              style={styles.btn}
              onClick={this.back}
              icon={<i className="fa fa-arrow-left"></i>}
            />
          </div>
          <Grid>
            <Row className="show-grid">
              <Col xs={12} md={12}>
                <TextFieldGroup sourceID={this.state.sourceID} type="datasource" edit={this.state.edit} />
              </Col>
            </Row>
            <Row className="show-grid">
              <Col xs={12} md={6}>
                <PortalCard datasource={this.props.datasource} type="datasource" edit={this.state.edit} />
              </Col>
              <Col xs={12} md={6}>
                <Card className="card card-input">
                  <CardHeader
                    title="Load"
                    actAsExpander={false}
                    showExpandableButton={false}
                  />
                  <CardText>
                    <SelectField
                      disabled={!this.state.edit}
                      className="select"
                      style={styles.customWidth}
                      multiple={false}
                      hintText="Select a number"
                      value={this.state.partition_nums}
                      onChange={this.handleChangePartitionNums}
                    >
                      <MenuItem
                        key={1}
                        insetChildren={true}
                        value={32}
                        primaryText="Medium"
                      />
                      <MenuItem
                        key={2}
                        insetChildren={true}
                        value={128}
                        primaryText="Strong"
                      />
                      <MenuItem
                        key={256}
                        insetChildren={true}
                        value={256}
                        primaryText="Super"
                      />
                    </SelectField>
                  </CardText>
                </Card>
              </Col>
            </Row>
          </Grid>
        </div>
        <Dialog
          title="Save Comfirmation"
          actions={actions}
          modal={true}
          open={this.state.openDialog}
          onRequestClose={this.handleCloseDialog}
        >
           Please check your input.
        </Dialog>
        <Snackbar
          open={this.state.openSnackbar}
          message={this.state.tipMsg}
          autoHideDuration={2000}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    )
  }
}

DatasourceConfig.propTypes = propTypes
DatasourceConfig.childContextTypes = {
  muiTheme: React.PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  const { datasource } = state
  return {
    datasource,
  }
}

export default connect(mapStateToProps, { addDatasource, updateDatasource, fetchDatasource })(DatasourceConfig)
