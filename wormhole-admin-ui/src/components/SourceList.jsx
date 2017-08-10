import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import Snackbar from 'material-ui/Snackbar'
import { muiTheme } from '../muiTheme'

import { fetchDatasources, deleteDatasource } from '../actions/datasourceActions'
import { isEmpty } from '../validators'
import { fetchData, postData } from '../utils/httpUtils'

import './SourceList.css'

const propTypes = {
  datasources: PropTypes.array,
  fetchDatasources: PropTypes.func,
  deleteDatasource: PropTypes.func,
}

class SourceList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      openDialog: false,
      openSnackbar: false,
      tipMsg: '',
      delIndex: 0,
    }

    this.handleOpen = this.handleOpen.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleRequestClose = this.handleRequestClose.bind(this)
    this.deleteSuccessfully = this.deleteSuccessfully.bind(this)
  }

  getChildContext () {
    return { muiTheme }
  }

  componentDidMount () {
    fetchData('/datasources').then(function (json) {
      console.log(json)
      this.props.fetchDatasources(json || [])
    }.bind(this), function (error) {
      console.error('error', error)
    })
  }

  handleOpen (event, index = 0) {
    this.setState(
      {
        openDialog: true,
        delIndex: index,
      }
    )
  }

  handleClose () {
    this.setState({ openDialog: false })
  }

  handleDelete () {
    this.deleteSource()
    this.setState({ openDialog: false })
  }

  handleRequestClose () {
    this.setState({
      openSnackbar: false,
    })
  }

  deleteSuccessfully () {
    const list = this.props.datasources
    const index = this.state.delIndex
    const delList = list.splice(index, 1)

    console.log('deleted datasouece', delList)
    this.props.deleteDatasource(list || [])
    console.log('props', this.props.datasources)
    this.setState({
      openSnackbar: true,
      tipMsg: 'Delete Successfully',
    })
  }

  deleteFailed (error) {
    this.setState({
      openSnackbar: true,
      tipMsg: error || 'Delete Failed',
    })
  }
  // TODO: Delete Datasource API
  deleteSource () {
    console.log(this.state.delIndex)
    const id = this.props.datasources[this.state.delIndex].id
    console.log(id)
    postData(`/jobs/delete/${id}`).then(function (json) {
      console.log(json)
      this.deleteSuccessfully()
    }.bind(this), function (error) {
      console.error('error', error)
      this.deleteFailed(error)
    }.bind(this))
  }

  renderActions (id) {
    const editUrl = `/datasource/edit/${id}`
    const viewUrl = `/datasource/view/${id}`

    // remove delete function
    return (
      <div className="btn-group btn-group-xs">
        <a href={viewUrl} className="btn btn-sm btn-default">
          <i className="fa fa-search">{''}</i>
        </a>
        <a href={editUrl} className="btn btn-sm btn-default">
          <i className="fa fa-edit">{''}</i>
        </a>
      </div>
    )
  }

  renderDatasourceList () {
    const styles = {
      idCol: {
        width: 100,
      },
      actionCol: {
        width: 120,
      }
    }

    return (
      <Table>
        <TableHeader displaySelectAll={false} adjustForCheckbox={false} enableSelectAll={false}>
          <TableRow>
            <TableHeaderColumn style={styles.idCol}>#</TableHeaderColumn>
            <TableHeaderColumn style={styles.actionCol}>Actions</TableHeaderColumn>
            <TableHeaderColumn>Source Type</TableHeaderColumn>
            <TableHeaderColumn>Create Date</TableHeaderColumn>
            <TableHeaderColumn>Source Host</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}
          showRowHover={true}
          stripedRows={true}
        >
          {
            this.props.datasources.map((ds, index) => {
              return (
                <TableRow key={index}>
                  <TableRowColumn style={styles.idCol}>{isEmpty(ds.id) ? '--' : ds.id}</TableRowColumn>
                  <TableRowColumn style={styles.actionCol}>{ this.renderActions(ds.id, index) }</TableRowColumn>
                  <TableRowColumn>{isEmpty(ds.type) ? '--' : ds.type}</TableRowColumn>
                  <TableRowColumn>{isEmpty(ds.create_time) ? '--' : ds.create_time}</TableRowColumn>
                  <TableRowColumn>
                    {isEmpty(ds.db.host) ? '--' : ds.db.host} : {isEmpty(ds.db.port) ? '--' : ds.db.port}
                  </TableRowColumn>
                </TableRow>
              )
            })
          }
        </TableBody>
      </Table>
    )
  }

  render () {
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Delete"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleDelete}
      />,
    ]

    return (
      <div>
        <h1 className="title"> Datasource List </h1>
        <RaisedButton
          label="Create"
          primary={true}
          href="/datasource/add"
        />
        {
          isEmpty(this.props.datasources)
            ? <div className="no-available-data">No Available Datasource</div>
            : <div className="list">{ this.renderDatasourceList() }</div>
        }
        <Dialog
          title="Delete Comfirmation"
          actions={actions}
          modal={true}
          open={this.state.openDialog}
          onRequestClose={this.handleClose}
        >
           You sure you want to delete this Source?
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

SourceList.propTypes = propTypes
SourceList.childContextTypes = {
  muiTheme: React.PropTypes.object.isRequired,
}

function mapStateToProps (state) {
  const { datasources } = state
  return {
    datasources
  }
}

export default connect(mapStateToProps, { fetchDatasources, deleteDatasource })(SourceList)
