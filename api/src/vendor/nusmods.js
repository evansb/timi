import _            from 'lodash';
import Promise      from 'bluebird';
import unshortener  from 'unshortener';
import Url          from 'url';
import request      from 'request';

let expandP = Promise.promisify(unshortener.expand);
let requestP = Promise.promisify(request);

class NUSMods {

  constructor(url) {
    this.url = url;
  }

  scrap() {
    let moduleClass = [];
    expandP(this.url)
      .then((expandedPath) => {
        var nusmods = Url.parse(expandedPath['path'], true);
        var classes = nusmods['query'];

        var result = {};
        moduleClass = [];
        for (var cl in classes){
          let mod = cl.split('[')[0];
          moduleClass.push([mod, classes[cl]]);
        }
        result['moduleClass'] = moduleClass;

        let ay = nusmods['pathname'].split('/')[2];
        let sem = nusmods['pathname'].split('/')[3].replace('sem','');
        result['ay'] = ay;
        result['sem'] = sem;

        return result;
      })
      .then((details) => {
        let { ay, sem, moduleClass } = details;
        let base = `http://api.nusmods.com/${ay}/${sem}/modules`;
        let requests = moduleClass.map(mc => {
          let moduleUrl = `${base}/${mc[0]}/timetable.json`;
          return requestP(moduleUrl);
        });
        return requests;
      })
      .map((response) => JSON.parse(response[0].body))
      .then((modules) =>
        _.flatten(
          _.zipWith(moduleClass, modules, (mc, module) =>
            _.filter(module, o => o.ClassNo == mc[1])
          )
        )
      )
      .then(console.log)
      .catch(console.log)
  }
}

export default NUSMods;
