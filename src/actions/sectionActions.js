import { updateRoute, updateViewportRoute } from "../modules/router";
import { onScatterplotData, onScatterplotLoaded } from "./scatterplotActions";
import { loadLocation } from "./featuresActions";
import { onRemoveSelectedFeature, onViewportChange, onCoordsChange, addToFeatureIdMap, onSelectFeature } from "./mapActions";
import { parseLocationsString, getLocationFromFeature } from '../modules/router';

export const onHoverFeature = (feature, sectionId) => ({
  type: 'SET_HOVERED_FEATURE',
  feature,
  sectionId
});

const getOptionsDispatchForSection = (dispatch, section, ownProps) => ({
  onOptionChange: (id, option) => {
    switch(id) {
      case 'highlight':
        return updateRoute(ownProps, { 
          highlightedState: option.id
        })
      case 'region':
        return updateRoute(ownProps, { region: option.id })
      default:
        return dispatch({
          type: 'SET_REPORT_VARS',
          sectionId: section,
          optionId: id,
          value: option.id
        })
    }
  },
})

export const getCardDispatchForSection = (dispatch, section) => ({
  onCardDismiss: (feature) => 
    dispatch(onRemoveSelectedFeature(
      feature
    )),
  onCardHover: (feature) => {
    dispatch(onHoverFeature(feature, section))
  },
  onCardClick: (feature) => {
    const l = parseLocationsString(
      getLocationFromFeature(feature)
    )[0];
    if (l) {
      dispatch(onViewportChange({ 
        latitude: parseFloat(l.lat), 
        longitude: parseFloat(l.lon),
        zoom: l.id.length + 2
      }, true))
    }
  },
})

export const getScatterplotDispatchForSection = (dispatch, sectionId) => ({
  onScatterplotData: (data, region) =>
    dispatch(onScatterplotData(data, region)),
  onScatterplotReady: () => 
    dispatch(onScatterplotLoaded(sectionId)),
  onScatterplotHover: (feature) =>
    dispatch(onHoverFeature(feature, sectionId)),
  onScatterplotClick: (location) =>
    dispatch(loadLocation(location)),
})

export const getMapDispatchForSection = (dispatch, sectionId, ownProps) => ({
  onMapHover: (feature, coords) => {
    dispatch(onHoverFeature(feature, 'map'))
    dispatch(onCoordsChange(coords))
    dispatch(addToFeatureIdMap([ feature ]))
  },
  onMapViewportChange: (vp) => {
    dispatch(onViewportChange(vp))
    updateViewportRoute(ownProps, vp);
  },
  onMapClick: (feature) => 
    dispatch(onSelectFeature(feature, ownProps.match.params.region)),
})


export const sectionMapDispatchToProps = (sectionId) =>
  (dispatch, ownProps) => ({
    ...getOptionsDispatchForSection(dispatch, sectionId, ownProps),
    ...getCardDispatchForSection(dispatch, sectionId),
    ...getScatterplotDispatchForSection(dispatch, sectionId),
    ...getMapDispatchForSection(dispatch, sectionId, ownProps)
  })

