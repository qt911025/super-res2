var assign = assign || require('object.assign');

import Q from 'q';

import ResourceAction from './ResourceAction.js';
import actionDefaults from './actionDefaults.js';

let superRes = {};

function generateDefaultActions(url, defaultParams) {
  let resource = {};

  let action = new ResourceAction(url, defaultParams, assign({}, actionDefaults));
  resource.get = action.makeRequest.bind(action);
  resource.query = resource.get;

  action = new ResourceAction(url, defaultParams, assign({}, actionDefaults, {method: 'POST'}))
  resource.save = action.makeRequest.bind(action);

  action = new ResourceAction(url, defaultParams, assign({}, actionDefaults, {method: 'PUT'}));
  resource.put = action.makeRequest.bind(action);

  action = new ResourceAction(url, defaultParams, assign({}, actionDefaults, {method: 'DELETE'}));
  resource.remove = action.makeRequest.bind(action);
  resource['delete'] = resource.remove;

  return resource;
}

superRes.resource = (url, defaultParams, actions) => {
  let resource = generateDefaultActions(url, defaultParams);
  if (actions) {
    Object.getOwnPropertyNames(actions).forEach((name) => {
      resource[name] = (new ResourceAction(url, defaultParams, actions[name])).makeRequest;
    });
  }
  return resource;
};

superRes.promiseWrapper = function promiseWrapper(promiseObj) {
  return (resource) => {
    let proxiedResource = assign({}, resource);
    Object.getOwnPropertyNames(resource).forEach((name) => {
      let actionFunction = proxiedResource[name];
      proxiedResource[name] = function (...args) {
        let promise = actionFunction.apply(proxiedResource, args);
        //TODO am I swallowing rejected promises here?
        return promiseObj.when(promise);
      }
    });
    return proxiedResource;
  }
};

export default superRes;
