import {describe, beforeEach, it, sinon, expect} from './lib/common';
import {AzureMonitorQueryCtrl} from '../src/query_ctrl';
import Q from 'q';
import moment from 'moment';

describe('AzureMonitorQueryCtrl', function() {
  let queryCtrl;

  beforeEach(function() {
    AzureMonitorQueryCtrl.prototype.panelCtrl = {panel: {}};
    AzureMonitorQueryCtrl.prototype.target = {target: ''};
    queryCtrl = new AzureMonitorQueryCtrl({}, {});
    queryCtrl.datasource = {$q: Q};
  });

  describe('init query_ctrl variables', function() {
    it('time grain variables should be initialized', function() {
      expect(queryCtrl.target.timeGrain).to.be(1);
      expect(queryCtrl.target.timeGrainUnit).to.be('hour');
    });
  });

  describe('when getOptions for the Resource Group dropdown is called', function() {
    const response = [
      {text: 'nodeapp', value: 'nodeapp'},
      {text: 'otherapp', value: 'otherapp'},
    ];

    beforeEach(function() {
      queryCtrl.datasource.metricFindQuery = function(query) {
        expect(query).to.be('?api-version=2017-06-01');
        return this.$q.when(response);
      };
    });

    it('should return a list of Resource Groups', function() {
      return queryCtrl.getResourceGroups('').then(result => {
        expect(result[0].text).to.be('nodeapp');
      });
    });
  });

  describe('when getOptions for the Metric Definition dropdown is called', function() {
    const response = [
      {text: 'Microsoft.Compute/virtualMachines', value: 'Microsoft.Compute/virtualMachines'},
      {text: 'Microsoft.Network/publicIPAddresses', value: 'Microsoft.Network/publicIPAddresses'},
    ];

    beforeEach(function() {
      queryCtrl.target.resourceGroup = 'test';
      queryCtrl.datasource.getMetricDefinitions = function(query) {
        expect(query).to.be('test');
        return this.$q.when(response);
      };
    });

    it('should return a list of Metric Definitions', function() {
      return queryCtrl.getMetricDefinitions('').then(result => {
        expect(result[0].text).to.be('Microsoft.Compute/virtualMachines');
        expect(result[1].text).to.be('Microsoft.Network/publicIPAddresses');
      });
    });
  });
});
