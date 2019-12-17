
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { ScatterplotPreview } from '../organisms/Scatterplot';
import { getScatterplotVars } from '../../modules/config'

const mapStateToProps = ({
  scatterplot: { data, error }
}, {
  match: { params: { region, highlightedState = 'us-all', metric, demographic, secondary }}
}) => ({
  ...getScatterplotVars(region, metric, demographic),
  data,
  region,
  error,
  highlightedState: highlightedState.split('-')[0]
})

export default compose(
  withRouter,
  connect(mapStateToProps, null)
)(ScatterplotPreview)
