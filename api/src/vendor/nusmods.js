import _ from 'lodash';
import Promise from 'bluebird';
import unshortener from 'unshortener';
import Url from 'url';
import request from 'request';

let expandP = Promise.promisify(unshortener.expand);
let requestP = Promise.promisify(request);

class NUSMods {

  constructor(url) {
    this.url = url;
  }

  async scrap() {
    try {
      let moduleClass = [];
      let expandedPath = await expandP(this.url);
      let nusmods = Url.parse(expandedPath.path, true);
      let classes = nusmods.query;
      for (var cl in classes){
        let mod = cl.split('[')[0];
        moduleClass.push([mod, classes[cl]]);
      }
      let ay = nusmods.pathname.split('/')[2];
      let sem = nusmods.pathname.split('/')[3].replace('sem', '');
      let base = `http://api.nusmods.com/${ay}/${sem}/modules`;
      let requests = moduleClass.map(mc => requestP(`${base}/${mc[0]}/timetable.json`));
      let responses = await Promise.all(requests);
      let modules = responses.map(response => JSON.parse(response[0].body));
      let result = _.flatten(_.zipWith(moduleClass, modules, (mc, module) =>
              _.filter(module, o => o.ClassNo === mc[1])))
      return result;
    } catch (err) {
      console.log(err);
    }
  }
}

export default NUSMods;
